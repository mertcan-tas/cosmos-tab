document.addEventListener('DOMContentLoaded', () => {
    // Apply background to settings page
    applySettingsBackground();
    
    // Initialize settings
    initSettings();

    // Background image preview setup
    setupBackgroundPreviews();

    // Custom background URL input
    setupCustomBackgroundInput();

    // Add shortcut form
    setupShortcutForm();

    // Settings checkboxes
    setupSettingsCheckboxes();
    
    // Export and import functionality
    setupExportImport();
    
    // Reset settings
    setupResetSettings();
});

// Apply background to settings page
async function applySettingsBackground() {
    const settings = await getSettings();
    const bgImgPath = settings.useCustomBackground ? 
        settings.customBackground : 
        `/assets/img/${settings.background}`;
    
    // Set CSS variable for background image
    document.documentElement.style.setProperty('--bg-image', `url('${bgImgPath}')`);
}

// Initialize all settings from storage
async function initSettings() {
    const settings = await getSettings();
    
    // Set background image previews
    document.querySelectorAll('.bg-image-preview').forEach(el => {
        const imgFile = el.dataset.img;
        el.style.backgroundImage = `url('/assets/img/${imgFile}')`;
        
        // Mark active background
        if (settings.background === imgFile) {
            document.querySelectorAll('.bg-image-preview').forEach(p => p.classList.remove('active', 'border-blue-500'));
            el.classList.add('active', 'border-blue-500');
        }
    });

    // Set custom background if exists
    if (settings.customBackground) {
        document.getElementById('customBgUrl').value = settings.customBackground;
    }

    // Set checkboxes
    document.getElementById('darkOverlay').checked = settings.darkOverlay;
    document.getElementById('openNewTab').checked = settings.openNewTab;
    document.getElementById('cacheIcons').checked = settings.cacheIcons;
}

// Setup background image previews
function setupBackgroundPreviews() {
    document.querySelectorAll('.bg-image-preview').forEach(el => {
        el.addEventListener('click', async () => {
            // Update UI
            document.querySelectorAll('.bg-image-preview').forEach(p => p.classList.remove('active', 'border-blue-500'));
            el.classList.add('active', 'border-blue-500');
            
            // Save to storage
            const imgFile = el.dataset.img;
            const settings = await getSettings();
            settings.background = imgFile;
            settings.useCustomBackground = false;
            await saveSettings(settings);
            
            // Update page background
            applySettingsBackground();
        });
    });
}

// Setup custom background input
function setupCustomBackgroundInput() {
    // Show/hide custom URL input
    const customBgBtn = document.querySelector('.custom-bg-btn');
    const customBgInput = document.getElementById('customBgInput');
    
    customBgBtn.addEventListener('click', () => {
        customBgInput.classList.toggle('hidden');
        if (!customBgInput.classList.contains('hidden')) {
            document.getElementById('customBgUrl').focus();
        }
    });

    // Save custom background URL
    document.getElementById('saveBgUrl').addEventListener('click', async () => {
        const url = document.getElementById('customBgUrl').value.trim();
        if (!url) return;

        try {
            // Check if URL is valid by attempting to load the image
            const valid = await checkImageExists(url);
            if (!valid) {
                alert('Geçersiz resim URL!');
                return;
            }

            // Update settings
            const settings = await getSettings();
            settings.customBackground = url;
            settings.useCustomBackground = true;
            await saveSettings(settings);

            // Update UI
            document.querySelectorAll('.bg-image-preview').forEach(p => p.classList.remove('active', 'border-blue-500'));
            customBgBtn.classList.add('active', 'border-blue-500');
            
            // Update page background
            applySettingsBackground();
            
            alert('Özel arkaplan kaydedildi!');
        } catch (error) {
            console.error('Error saving custom background:', error);
            alert('Arkaplan kaydedilemedi: ' + error.message);
        }
    });
}

// Setup shortcut form
function setupShortcutForm() {
    const form = document.getElementById('addShortcutForm');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('shortcutName').value.trim();
        const url = document.getElementById('shortcutUrl').value.trim();
        
        if (!name || !url) {
            alert('Lütfen ad ve URL girin');
            return;
        }
        
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            alert('URL http:// veya https:// ile başlamalıdır');
            return;
        }
        
        try {
            // Get current settings
            const settings = await getSettings();
            
            // Initialize shortcuts array if needed
            if (!settings.shortcuts) settings.shortcuts = [];
            
            // Get the next position (at the end of the list)
            const nextPosition = settings.appPositions && settings.appPositions.length > 0 
                ? Math.max(...settings.appPositions.map(p => p.position)) + 1 
                : settings.shortcuts.length + (settings.hiddenDefaultApps ? settings.hiddenDefaultApps.length : 0);
            
            // Add new shortcut
            const newShortcut = {
                name,
                url,
                custom: true
            };
            
            settings.shortcuts.push(newShortcut);
            
            // Add to positions
            if (!settings.appPositions) settings.appPositions = [];
            settings.appPositions.push({
                name,
                url,
                position: nextPosition
            });
            
            // Download and cache the favicon for this new shortcut
            await downloadAndCacheFavicon(url);
            
            // Save settings
            await saveSettings(settings);
            
            // Reset form
            form.reset();
            
            alert('Kısayol eklendi!');
        } catch (error) {
            console.error('Error adding shortcut:', error);
            alert('Kısayol eklenemedi: ' + error.message);
        }
    });
}

// Setup export and import functionality
function setupExportImport() {
    // Export bookmarks
    document.getElementById('exportBookmarks').addEventListener('click', async () => {
        try {
            const settings = await getSettings();
            
            if (!settings.shortcuts || settings.shortcuts.length === 0) {
                alert('Dışa aktarılacak yer imi bulunamadı.');
                return;
            }
            
            // Create bookmarks HTML file
            const bookmarksHTML = generateBookmarksHTML(settings.shortcuts);
            
            // Create file download
            downloadFile('kozmos_bookmarks.html', bookmarksHTML, 'text/html');
            
        } catch (error) {
            console.error('Bookmarks export error:', error);
            alert('Yer imleri dışa aktarılırken bir hata oluştu: ' + error.message);
        }
    });
    
    // Export all settings
    document.getElementById('exportSettings').addEventListener('click', async () => {
        try {
            const settings = await getSettings();
            const settingsJSON = JSON.stringify(settings, null, 2);
            
            // Create file download
            downloadFile('kozmos_settings.json', settingsJSON, 'application/json');
            
        } catch (error) {
            console.error('Settings export error:', error);
            alert('Ayarlar dışa aktarılırken bir hata oluştu: ' + error.message);
        }
    });
    
    // Import settings
    document.getElementById('importSettings').addEventListener('change', async (e) => {
        try {
            const file = e.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = async (event) => {
                try {
                    const importedSettings = JSON.parse(event.target.result);
                    
                    // Basic validation
                    if (!importedSettings || typeof importedSettings !== 'object') {
                        throw new Error('Geçersiz ayarlar dosyası');
                    }
                    
                    // Confirm import
                    if (confirm('Bu işlem mevcut tüm ayarlarınızı yeni ayarlarla değiştirecektir. Devam etmek istiyor musunuz?')) {
                        await saveSettings(importedSettings);
                        alert('Ayarlar başarıyla içe aktarıldı. Sayfayı yenilemek için Tamam\'a tıklayın.');
                        window.location.reload();
                    }
                } catch (error) {
                    console.error('Settings import parse error:', error);
                    alert('İçe aktarma sırasında bir hata oluştu: ' + error.message);
                }
            };
            reader.readAsText(file);
            
        } catch (error) {
            console.error('Settings import error:', error);
            alert('Ayarlar içe aktarılırken bir hata oluştu: ' + error.message);
        }
    });
}

// Setup reset settings button
function setupResetSettings() {
    document.getElementById('resetSettings').addEventListener('click', async () => {
        if (confirm('Tüm ayarlarınız ve kısayollarınız silinecek. Bu işlem geri alınamaz. Devam etmek istiyor musunuz?')) {
            if (confirm('Emin misiniz? Bu işlem sonrasında tüm verileriniz kaybolacaktır.')) {
                try {
                    // Clear all settings
                    if (typeof chrome !== 'undefined' && chrome.storage) {
                        await new Promise((resolve) => {
                            chrome.storage.sync.clear(resolve);
                        });
                        
                        // Also clear icon cache
                        await new Promise((resolve) => {
                            chrome.storage.local.remove('kozmos_icon_cache', resolve);
                        });
                    }
                    
                    alert('Tüm ayarlar başarıyla sıfırlandı. Sayfayı yenilemek için Tamam\'a tıklayın.');
                    window.location.href = 'index.html';
                } catch (error) {
                    console.error('Settings reset error:', error);
                    alert('Ayarlar sıfırlanırken bir hata oluştu: ' + error.message);
                }
            }
        }
    });
}

// Generate bookmarks HTML file
function generateBookmarksHTML(shortcuts) {
    const date = new Date().toISOString().split('T')[0];
    
    let html = `<!DOCTYPE NETSCAPE-Bookmark-file-1>
<!-- This is an automatically generated file.
     It will be read and overwritten.
     DO NOT EDIT! -->
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>Bookmarks</TITLE>
<H1>Bookmarks</H1>
<DL><p>
    <DT><H3 ADD_DATE="${Math.floor(Date.now()/1000)}" LAST_MODIFIED="${Math.floor(Date.now()/1000)}" PERSONAL_TOOLBAR_FOLDER="true">Kozmos Yer İmleri (${date})</H3>
    <DL><p>`;
    
    // Add each shortcut as a bookmark
    shortcuts.forEach(shortcut => {
        const addDate = Math.floor(Date.now()/1000);
        html += `
        <DT><A HREF="${shortcut.url}" ADD_DATE="${addDate}">${shortcut.name}</A>`;
    });
    
    html += `
    </DL><p>
</DL><p>`;
    
    return html;
}

// Helper: Download file
function downloadFile(filename, content, contentType) {
    const a = document.createElement('a');
    const file = new Blob([content], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
}

// Download and cache favicon as data URI
async function downloadAndCacheFavicon(url) {
    try {
        const domain = new URL(url).hostname;
        const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
        
        // Chrome API ile fetch işlemi
        if (typeof chrome !== 'undefined' && chrome.runtime?.id) {
            const response = await chrome.runtime.sendMessage({
                action: "fetchFavicon",
                url: faviconUrl
            });
            
            if (response.error) throw new Error(response.error);
            const blob = new Blob([response], { type: 'image/png' });
            
            // Convert blob to data URI
            const dataUri = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.readAsDataURL(blob);
            });
            
            iconCache[url] = dataUri;
            saveIconCache();
            return dataUri;
        }
        // Fallback for non-extension context
        else {
            const response = await fetch(faviconUrl, {
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'image/png'
                }
            });
            const blob = await response.blob();
            const dataUri = URL.createObjectURL(blob);
            iconCache[url] = dataUri;
            saveIconCache();
            return dataUri;
        }
    } catch (error) {
        console.error('Error downloading favicon:', error);
        return null;
    }
}

// Save icon to cache
async function saveIconToCache(url, dataUri) {
    return new Promise((resolve) => {
        if (typeof chrome !== 'undefined' && chrome.storage) {
            chrome.storage.local.get('kozmos_icon_cache', (result) => {
                const iconCache = result.kozmos_icon_cache || {};
                iconCache[url] = dataUri;
                chrome.storage.local.set({ 'kozmos_icon_cache': iconCache }, resolve);
            });
        } else {
            resolve();
        }
    });
}

// Setup settings checkboxes
function setupSettingsCheckboxes() {
    const checkboxes = [
        'darkOverlay',
        'openNewTab',
        'cacheIcons'
    ];
    
    checkboxes.forEach(id => {
        const checkbox = document.getElementById(id);
        checkbox.addEventListener('change', async () => {
            const settings = await getSettings();
            settings[id] = checkbox.checked;
            await saveSettings(settings);
        });
    });
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

// Helper: Check if image exists
async function checkImageExists(url) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = url;
    });
} 