async function loadApps() {
    try {
        const response = await fetch('/apps.json');
        const data = await response.json();
        const grid = document.getElementById('appGrid');

        data.apps.forEach(app => {
            // Asset klasör yapınıza göre path'i ayarlayın
            const iconPath = `/assets/icons/${app.icon}`;
            
            const appElement = `
                <a href="${app.url}" 
                   class="group flex flex-col items-center justify-center space-y-2 p-2 hover:bg-white/20 rounded-xl transition-all backdrop-blur-sm">
                    <div class="w-[56px] h-[56px] bg-white rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm border border-gray-200">
                        <img src="${iconPath}" 
                             alt="${app.name} icon" 
                             class="w-[36px] h-[36px] rounded-lg">
                    </div>
                    <span class="text-xs font-medium text-white">${app.name}</span>
                </a>
            `;
            grid.innerHTML += appElement;
        });

    } catch (error) {
        console.error('Uygulamalar yüklenirken hata oluştu:', error);
        const errorElement = `<div class="text-red-500 text-center">Uygulamalar yüklenemedi!</div>`;
        grid.innerHTML = errorElement;
    }
}

window.addEventListener('DOMContentLoaded', loadApps);