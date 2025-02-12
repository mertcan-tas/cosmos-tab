async function loadApps() {
    try {
        const response = await fetch('/apps.json');
        const data = await response.json();
        const gridContainer = document.getElementById('appGridContainer');
        
        // Satır gruplama
        const rows = data.apps.reduce((acc, app) => {
            const row = app.row || 1;
            if(!acc[row]) acc[row] = [];
            acc[row].push(app);
            return acc;
        }, {});

        // Her satır için işlem
        for(const [rowNumber, apps] of Object.entries(rows)) {
            const rowDiv = document.createElement('div');
            rowDiv.className = 'grid grid-cols-4 md:grid-cols-12 gap-4 mb-4';
            
            for(const app of apps) {
                const appElement = document.createElement('a');
                appElement.href = app.url;
                appElement.target = '';
                appElement.className = 'group flex flex-col items-center justify-center space-y-2 p-2 hover:bg-white/20 rounded-xl transition-all backdrop-blur-sm';
                
                // İkon konteynırı
                const iconDiv = document.createElement('div');
                iconDiv.className = 'w-[56px] h-[56px] bg-white rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm border border-gray-200';
                
                // İkon resmi
                const iconImg = document.createElement('img');
                iconImg.className = 'w-[36px] h-[36px] rounded-lg';
                iconImg.alt = `${app.name} icon`;

                // İkon yükleme mantığı
                const loadIcon = async () => {
                    try {
                        // 1. Önce JSON'da belirtilen ikonu dene
                        if(app.icon) {
                            const localIcon = `/assets/icons/${app.icon}.png`;
                            const valid = await checkImageExists(localIcon);
                            if(valid) {
                                iconImg.src = localIcon;
                                return;
                            }
                        }
                        
                        // 2. Favicon fallback
                        const domain = new URL(app.url).hostname;
                        iconImg.src = '/assets/icons/default.svg';
                        
                    } catch(error) {
                        console.error(`İkon yüklenemedi (${app.name}):`, error);
                        iconImg.src = '/assets/icons/default.svg';
                    }
                };

                iconDiv.appendChild(iconImg);
                appElement.appendChild(iconDiv);
                
                // Uygulama adı
                const appName = document.createElement('span');
                appName.className = 'text-xs font-medium text-white text-center';
                appName.textContent = app.name;
                appElement.appendChild(appName);
                
                rowDiv.appendChild(appElement);
                await loadIcon(); // İkonları sırayla yükle
            }
            
            gridContainer.appendChild(rowDiv);
        }

    } catch(error) {
        console.error('Uygulamalar yüklenirken hata oluştu:', error);
        gridContainer.innerHTML = `
            <div class="text-red-500 text-center p-4">
                Uygulamalar yüklenirken bir hata oluştu!<br>
                <small>${error.message}</small>
            </div>
        `;
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

window.addEventListener('DOMContentLoaded', loadApps);