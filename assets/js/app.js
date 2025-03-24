// Global variables
let iconCache = {};
let isEditMode = false;

// Initialize app
async function initApp() {
    try {
        // Load settings
        const settings = await getSettings();
        
        // Perform migration if needed (from customApps to shortcuts)
        await migrateIfNeeded(settings);
        
        // Load icon cache from storage if caching is enabled
        if (settings.cacheIcons) {
            await loadIconCache();
        }
        
        // Apply background based on settings
        applyBackground(settings);
        
        // Apply dark overlay setting
        applyOverlay(settings);
        
        // Load apps
        await loadApps(settings);
        
        // Setup edit mode toggle button
        setupEditModeButton();
        
    } catch(error) {
        console.error('Uygulama başlatılırken hata oluştu:', error);
        document.getElementById('appGridContainer').innerHTML = `
            <div class="text-red-500 text-center p-4">
                Uygulama başlatılırken bir hata oluştu!<br>
                <small>${error.message}</small>
            </div>
        `;
    }
}

// Migrate data from old structure to new if needed
async function migrateIfNeeded(settings) {
    // Check if we need to migrate (has customApps property but no shortcuts property)
    if (settings.customApps && settings.customApps.length > 0 && (!settings.shortcuts || settings.shortcuts.length === 0)) {
        console.log('Migrating from customApps to shortcuts...');
        
        try {
            // Try to fetch the old apps.json file
            const defaultApps = await fetchDefaultApps();
            
            // Create shortcuts array by combining customApps and apps.json data
            settings.shortcuts = [...defaultApps];
            
            // Add custom apps
            settings.customApps.forEach(customApp => {
                settings.shortcuts.push({
                    ...customApp,
                    custom: true
                });
            });
            
            // Handle hiddenDefaultApps if they exist
            if (settings.hiddenDefaultApps && settings.hiddenDefaultApps.length > 0) {
                settings.shortcuts = settings.shortcuts.filter(shortcut => {
                    return !settings.hiddenDefaultApps.some(hidden => 
                        hidden.name === shortcut.name && hidden.url === shortcut.url
                    );
                });
            }
            
            // Save migrated settings
            delete settings.customApps; // Remove old property
            await saveSettings(settings);
            console.log('Migration completed successfully');
        } catch (error) {
            console.error('Migration error:', error);
            // If migration fails, create default shortcuts
            settings.shortcuts = createDefaultShortcuts();
            await saveSettings(settings);
        }
    }
}

// Fetch the old apps.json file if it exists
async function fetchDefaultApps() {
    try {
        const response = await fetch('/apps.json');
        if (!response.ok) {
            throw new Error('apps.json not found');
        }
        const data = await response.json();
        return data.apps.map(app => ({
            ...app,
            default: true
        }));
    } catch (error) {
        console.warn('Could not fetch apps.json, using default shortcuts');
        return createDefaultShortcuts();
    }
}

// Setup edit mode toggle button
function setupEditModeButton() {
    // Create edit mode button
    const editBtn = document.createElement('div');
    editBtn.className = 'edit-btn';
    editBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
    `;
    document.body.appendChild(editBtn);
    
    // Toggle edit mode when edit button is clicked
    editBtn.addEventListener('click', () => {
        isEditMode = !isEditMode;
        
        // Update button appearance
        editBtn.classList.toggle('active', isEditMode);
        
        // Update all app elements to reflect edit mode
        const appElements = document.querySelectorAll('#appGridContainer .app-item');
        appElements.forEach(el => {
            el.classList.toggle('edit-mode', isEditMode);
            el.draggable = isEditMode;
        });
        
        // Show or hide delete buttons
        const deleteButtons = document.querySelectorAll('.delete-btn');
        deleteButtons.forEach(btn => {
            btn.style.display = isEditMode ? 'flex' : 'none';
        });
    });
}

// Load icon cache from storage
async function loadIconCache() {
    return new Promise((resolve) => {
        if (typeof chrome !== 'undefined' && chrome.storage) {
            chrome.storage.local.get('kozmos_icon_cache', (result) => {
                if (result.kozmos_icon_cache) {
                    iconCache = result.kozmos_icon_cache;
                }
                resolve();
            });
        } else {
            resolve();
        }
    });
}

// Save icon cache to storage
async function saveIconCache() {
    return new Promise((resolve) => {
        if (typeof chrome !== 'undefined' && chrome.storage) {
            // Eğer cache çok büyükse, gereksiz eski öğeleri temizle
            const cacheSize = Object.keys(iconCache).length;
            if (cacheSize > 100) {
                const cacheEntries = Object.entries(iconCache);
                // En son 80 öğeyi tut, gerisini temizle
                const sortedEntries = cacheEntries.sort((a, b) => {
                    return (b[1].timestamp || 0) - (a[1].timestamp || 0);
                });
                iconCache = Object.fromEntries(sortedEntries.slice(0, 80));
            }
            
            // Her cache öğesi için timestamp ekle
            Object.keys(iconCache).forEach(key => {
                if (!iconCache[key].timestamp) {
                    iconCache[key].timestamp = Date.now();
                }
            });
            
            chrome.storage.local.set({ 'kozmos_icon_cache': iconCache }, resolve);
        } else {
            resolve();
        }
    });
}

// Apply background based on settings
function applyBackground(settings) {
    const bgImgPath = settings.useCustomBackground ? 
        settings.customBackground : 
        `/assets/img/${settings.background}`;
    
    // Set CSS variable for background image
    document.documentElement.style.setProperty('--bg-image', `url('${bgImgPath}')`);
    
    // Update background element
    const bgElement = document.querySelector('.fixed.inset-0.-z-10 img');
    if (bgElement) {
        bgElement.src = bgImgPath;
    }
}

// Apply overlay settings
function applyOverlay(settings) {
    const overlayElement = document.querySelector('.absolute.inset-0.bg-black\\/30');
    if (overlayElement) {
        overlayElement.style.display = settings.darkOverlay ? 'block' : 'none';
    }
}

// Load apps from storage
async function loadApps(settings) {
    try {
        // Get all apps from settings
        let allApps = [];
        
        // Add shortcuts from storage
        if (settings.shortcuts && settings.shortcuts.length > 0) {
            allApps = [...settings.shortcuts];
        } else {
            // First time setup - add some default shortcuts
            allApps = createDefaultShortcuts();
            settings.shortcuts = allApps;
            await saveSettings(settings);
        }
        
        // Hide default apps that user removed
        if (settings.hiddenDefaultApps && settings.hiddenDefaultApps.length > 0) {
            allApps = allApps.filter(app => {
                return !settings.hiddenDefaultApps.some(hidden => 
                    hidden.name === app.name && hidden.url === app.url
                );
            });
        }
        
        // Get saved positions if they exist
        if (settings.appPositions && settings.appPositions.length > 0) {
            // Apply saved positions to apps
            allApps = allApps.map(app => {
                const savedPosition = settings.appPositions.find(p => 
                    p.url === app.url && p.name === app.name
                );
                
                if (savedPosition) {
                    return { ...app, position: savedPosition.position };
                }
                
                return app;
            });
            
            // Sort apps by position if position is defined
            allApps.sort((a, b) => {
                if (a.position !== undefined && b.position !== undefined) {
                    return a.position - b.position;
                }
                if (a.position !== undefined) return -1;
                if (b.position !== undefined) return 1;
                return 0;
            });
        }
        
        const gridContainer = document.getElementById('appGridContainer');
        gridContainer.className = 'grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-4 mb-4';
        gridContainer.innerHTML = '';
        
        // İkon yükleme için paralel işlem
        const iconPromises = [];

        // Create app elements
        for (const app of allApps) {
            const appElement = document.createElement('a');
            appElement.href = app.url;
            appElement.target = settings.openNewTab ? '_blank' : '';
            appElement.className = 'app-item group flex flex-col items-center justify-center space-y-2 p-2 hover:bg-white/20 rounded-xl transition-all backdrop-blur-sm relative';
            appElement.setAttribute('data-name', app.name);
            appElement.setAttribute('data-url', app.url);
            
            // Add draggable attribute (will be enabled in edit mode)
            appElement.draggable = false;
            
            // Prevent default link behavior during edit mode
            appElement.addEventListener('click', (e) => {
                if (isEditMode) {
                    e.preventDefault();
                }
            });
            
            // Add delete button (hidden by default)
            const deleteBtn = document.createElement('div');
            deleteBtn.className = 'delete-btn absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center cursor-pointer z-10';
            deleteBtn.innerHTML = '✕';
            deleteBtn.style.display = 'none';
            deleteBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                removeApp(app.name, app.url);
            });
            appElement.appendChild(deleteBtn);
            
            // Add drag functionality
            setupDragAndDrop(appElement);
            
            // İkon konteynırı
            const iconDiv = document.createElement('div');
            iconDiv.className = 'w-[56px] h-[56px] bg-white rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm border border-gray-200';
            
            // İkon resmi
            const iconImg = document.createElement('img');
            iconImg.className = 'w-[36px] h-[36px] rounded-lg';
            iconImg.alt = `${app.name} icon`;
            
            // Add image loading effect
            iconImg.style.opacity = '0';
            iconImg.style.transition = 'opacity 0.3s ease-in-out';
            iconImg.onload = () => {
                iconImg.style.opacity = '1';
            };

            // Collect icon loading promises for parallel loading
            const iconPromise = loadIconForApp(app, iconImg, settings);
            iconPromises.push(iconPromise);

            iconDiv.appendChild(iconImg);
            appElement.appendChild(iconDiv);
            
            // Uygulama adı
            const appName = document.createElement('span');
            appName.className = 'text-xs font-medium text-white text-center';
            appName.textContent = app.name;
            appElement.appendChild(appName);
            
            gridContainer.appendChild(appElement);
        }
        
        // Load all icons in parallel, then save cache
        Promise.all(iconPromises).then(() => {
            if (settings.cacheIcons) {
                saveIconCache();
            }
        });

    } catch(error) {
        console.error('Uygulamalar yüklenirken hata oluştu:', error);
        document.getElementById('appGridContainer').innerHTML = `
            <div class="text-red-500 text-center p-4">
                Uygulamalar yüklenirken bir hata oluştu!<br>
                <small>${error.message}</small>
            </div>
        `;
    }
}

// Create default shortcuts
function createDefaultShortcuts() {
    return [
        {
            "name": "Google",
            "url": "https://www.google.com/",
            "default": true
        },
        {
            "name": "YouTube",
            "url": "https://www.youtube.com/",
            "default": true
        },
        {
            "name": "GitHub",
            "url": "https://github.com/",
            "default": true
        },
        {
            "name": "Gmail",
            "url": "https://mail.google.com/",
            "default": true
        },
        {
            "name": "Twitter",
            "url": "https://twitter.com/",
            "default": true
        },
        {
            "name": "Facebook",
            "url": "https://www.facebook.com/",
            "default": true
        },
        {
            "name": "Instagram",
            "url": "https://www.instagram.com/",
            "default": true
        },
        {
            "name": "LinkedIn",
            "url": "https://www.linkedin.com/",
            "default": true
        }
    ];
}

// Setup drag and drop functionality
function setupDragAndDrop(element) {
    element.addEventListener('dragstart', (e) => {
        if (!isEditMode) return;
        
        e.dataTransfer.setData('text/plain', element.getAttribute('data-name') + '|' + element.getAttribute('data-url'));
        element.classList.add('dragging');
        
        // Sürükleme başlatıldığında orijinal pozisyonu kaydet
        element.setAttribute('data-original-index', Array.from(element.parentNode.children).indexOf(element));
        
        // Set a ghost image that's invisible
        const ghost = document.createElement('div');
        ghost.style.opacity = '0';
        document.body.appendChild(ghost);
        e.dataTransfer.setDragImage(ghost, 0, 0);
        
        // Remove ghost after dragstart
        setTimeout(() => {
            document.body.removeChild(ghost);
        }, 0);
    });
    
    element.addEventListener('dragend', () => {
        element.classList.remove('dragging');
        
        // Animasyonu tamamlandıktan sonra pozisyonları kaydet
        saveAppPositions();
        
        // Sürükleme bittiğinde tüm elementlerin animasyonunu sıfırla
        const allItems = document.querySelectorAll('.app-item');
        allItems.forEach(item => {
            item.style.transition = '';
            item.style.transform = '';
        });
    });
    
    element.addEventListener('dragover', (e) => {
        if (!isEditMode) return;
        e.preventDefault();
        
        const dragging = document.querySelector('.dragging');
        if (!dragging || dragging === element) return;
        
        const container = document.getElementById('appGridContainer');
        const allApps = Array.from(container.querySelectorAll('.app-item:not(.dragging)'));
        
        // En yakın elementi hem X hem de Y koordinatlarına göre bul
        const closestApp = findClosestElement(allApps, e.clientX, e.clientY);
        
        if (closestApp) {
            // Sürüklenen element ile en yakın element arasındaki pozisyonu belirle
            const draggingRect = dragging.getBoundingClientRect();
            const closestRect = closestApp.getBoundingClientRect();
            
            // Yer değiştirme yönünü belirle
            const isBefore = isBeforeElement(e.clientX, e.clientY, closestApp);
            
            if (isBefore) {
                container.insertBefore(dragging, closestApp);
            } else {
                container.insertBefore(dragging, closestApp.nextSibling);
            }
            
            // Diğer elementlere animasyon ekle
            animateOtherElements(dragging, container);
        } else {
            container.appendChild(dragging);
        }
    });
    
    element.addEventListener('drop', (e) => {
        if (!isEditMode) return;
        e.preventDefault();
    });
}

// Find closest element considering both X and Y coordinates
function findClosestElement(elements, x, y) {
    let closestDistance = Infinity;
    let closestElement = null;
    
    elements.forEach(element => {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Calculate distance using Euclidean distance formula
        const distance = Math.sqrt(
            Math.pow(x - centerX, 2) + 
            Math.pow(y - centerY, 2)
        );
        
        if (distance < closestDistance) {
            closestDistance = distance;
            closestElement = element;
        }
    });
    
    return closestElement;
}

// Determine if mouse position is before or after element
function isBeforeElement(x, y, element) {
    const rect = element.getBoundingClientRect();
    
    // Grid yapısına göre karar ver
    // Aynı satırdaysa X koordinatına göre, farklı satırdaysa Y koordinatına göre
    const isSameRow = Math.abs(y - (rect.top + rect.height / 2)) < rect.height;
    
    if (isSameRow) {
        return x < rect.left + rect.width / 2;
    } else {
        return y < rect.top + rect.height / 2;
    }
}

// Animate elements during drag
function animateOtherElements(draggingElement, container) {
    const allElements = Array.from(container.querySelectorAll('.app-item'));
    const draggingIndex = Array.from(container.children).indexOf(draggingElement);
    
    allElements.forEach((item, index) => {
        if (item !== draggingElement) {
            const itemIndex = Array.from(container.children).indexOf(item);
            
            // Tüm elementlerin geçiş animasyonu için transition ekle
            item.style.transition = 'transform 0.2s cubic-bezier(0.2, 0, 0.2, 1)';
            
            // Yer değiştirme sırasında hafif bir animasyon ekle
            if (Math.abs(itemIndex - draggingIndex) <= 2) {
                // Yakındaki elementler için daha belirgin animasyon
                const direction = itemIndex < draggingIndex ? -1 : 1;
                
                // Sürüklenen elemanın pozisyonuna bağlı olarak hafif bir animasyon ekle
                if (direction === -1) {
                    // Eleman solda kalıyorsa sağa doğru hafif bir hareket ve ölçeklendirme
                    item.style.transform = 'scale(1.02) translateX(2px)';
                } else {
                    // Eleman sağda kalıyorsa sola doğru hafif bir hareket ve ölçeklendirme
                    item.style.transform = 'scale(1.02) translateX(-2px)';
                }
                
                // Kısa bir gecikme sonra dönüşümü sıfırla
                setTimeout(() => {
                    if (item.style.transform) {
                        item.style.transform = '';
                    }
                }, 200);
            }
        }
    });
}

// Save app positions
async function saveAppPositions() {
    try {
        const container = document.getElementById('appGridContainer');
        const appElements = container.querySelectorAll('.app-item');
        
        const positions = [];
        
        // Collect position information
        appElements.forEach((el, index) => {
            positions.push({
                name: el.getAttribute('data-name'),
                url: el.getAttribute('data-url'),
                position: index
            });
        });
        
        // Save to settings
        const settings = await getSettings();
        settings.appPositions = positions;
        await saveSettings(settings);
        
    } catch (error) {
        console.error('Error saving app positions:', error);
    }
}

// Load icon for a specific app
async function loadIconForApp(app, iconImg, settings) {
    try {
        // 1. Check for stored favicon data in iconCache
        if (settings.cacheIcons && iconCache[app.url] && iconCache[app.url].startsWith('data:')) {
            iconImg.src = iconCache[app.url];
            return;
        }
        
        // 2. Check for stored favicon URL in iconCache
        if (settings.cacheIcons && iconCache[app.url]) {
            iconImg.src = iconCache[app.url];
            
            // If the cache has a URL (not data URI), try to download and store the actual icon
            if (!iconCache[app.url].startsWith('data:')) {
                downloadAndCacheFavicon(app.url);
            }
            return;
        }
        
        // 3. Fetch and download favicon 
        const dataUri = await downloadAndCacheFavicon(app.url);
        if (dataUri) {
            iconImg.src = dataUri;
            return;
        }
        
        // 4. Fallback to Google Favicon service if download failed
// loadIconForApp fonksiyonunda bu kısmı değiştirin
        const domain = new URL(app.url).hostname;
        const faviconUrl = `https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://${domain}&size=64`;
                
        // Cache the URL for next time
        if (settings.cacheIcons) {
            iconCache[app.url] = faviconUrl;
        }
        
    } catch(error) {
        console.error(`İkon yüklenemedi (${app.name}):`, error);
        
        // Fallback to Google Favicon service
        try {
            const domain = new URL(app.url).hostname;
            const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
            iconImg.src = faviconUrl;
            
            if (settings.cacheIcons) {
                iconCache[app.url] = faviconUrl;
            }
        } catch {
            // Ultimate fallback
            iconImg.src = '/assets/icons/default.svg';
        }
    }
}

// Download and cache favicon as data URI
async function downloadAndCacheFavicon(url) {
    try {
        const domain = new URL(url).hostname;
        const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
        
        // Fetch the favicon as blob
        const response = await fetch(faviconUrl);
        if (!response.ok) throw new Error('Failed to fetch favicon');
        
        const blob = await response.blob();
        
        // Convert blob to data URI
        const dataUri = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(blob);
        });
        
        // Store in cache
        if (dataUri) {
            iconCache[url] = dataUri;
            saveIconCache();
        }
        
        return dataUri;
    } catch (error) {
        console.error('Error downloading favicon:', error);
        return null;
    }
}

// Remove an app
async function removeApp(name, url) {
    try {
        const settings = await getSettings();
        
        // Is this a default app?
        const isDefaultApp = settings.shortcuts.some(app => 
            app.name === name && app.url === url && app.default === true
        );
        
        if (isDefaultApp) {
            // Add to hidden default apps
            if (!settings.hiddenDefaultApps) {
                settings.hiddenDefaultApps = [];
            }
            
            // Add to hidden default apps
            settings.hiddenDefaultApps.push({ name, url });
        } else {
            // Remove from shortcuts
            settings.shortcuts = settings.shortcuts.filter(app => 
                !(app.name === name && app.url === url)
            );
        }
        
        // Also remove from app positions
        if (settings.appPositions) {
            settings.appPositions = settings.appPositions.filter(pos => 
                !(pos.name === name && pos.url === url)
            );
        }
        
        // Save updated settings
        await saveSettings(settings);
        
        // Reload the page to reflect changes
        window.location.reload();
    } catch (error) {
        console.error('Error removing app:', error);
        alert('Kısayol silinemedi: ' + error.message);
    }
}

// Resim varlığını kontrol etme fonksiyonu
async function checkImageExists(url) {
    try {
        const response = await fetch(url, { method: 'HEAD' });
        return response.ok;
    } catch {
        return false;
    }
}

// Helper: Get settings from storage
async function getSettings() {
    return new Promise((resolve) => {
        if (typeof chrome !== 'undefined' && chrome.storage) {
            chrome.storage.local.get('kozmos_settings', (result) => {
                const defaultSettings = {
                    background: '1.jpg',
                    customBackground: '',
                    useCustomBackground: false,
                    darkOverlay: true,
                    openNewTab: true,
                    cacheIcons: true,
                    shortcuts: [],
                    appPositions: [],
                    hiddenDefaultApps: []
                };
                
                resolve(result.kozmos_settings || defaultSettings);
            });
        } else {
            // Fallback for local development without Chrome APIs
            const defaultSettings = {
                background: '1.jpg',
                customBackground: '',
                useCustomBackground: false,
                darkOverlay: true,
                openNewTab: true,
                cacheIcons: true,
                shortcuts: [],
                appPositions: [],
                hiddenDefaultApps: []
            };
            resolve(defaultSettings);
        }
    });
}

// Helper: Save settings to storage
async function saveSettings(settings) {
    return new Promise((resolve) => {
        if (typeof chrome !== 'undefined' && chrome.storage) {
            // Shortcuts verisini optimize edelim
            if (settings.shortcuts && settings.shortcuts.length > 0) {
                // Her shortcut için gereksiz fazlalık alanları kaldır
                settings.shortcuts = settings.shortcuts.map(shortcut => {
                    // Sadece gerekli alanları tut
                    return {
                        name: shortcut.name,
                        url: shortcut.url,
                        // Eğer varsa özel alanları da koru
                        ...(shortcut.custom ? { custom: true } : {}),
                        ...(shortcut.default ? { default: true } : {}),
                        ...(shortcut.position !== undefined ? { position: shortcut.position } : {})
                    };
                });
            }
            
            chrome.storage.local.set({ 'kozmos_settings': settings }, resolve);
        } else {
            // Fallback for local development
            console.log('Storage API not available, settings not saved');
            resolve();
        }
    });
}

// Start the app when DOM is loaded
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    console.log('Document already loaded, initializing app');
    initApp();
} else {
    console.log('Waiting for document to load, adding event listener');
    window.addEventListener('DOMContentLoaded', () => {
        console.log('DOMContentLoaded event fired, initializing app');
        initApp();
    });
}