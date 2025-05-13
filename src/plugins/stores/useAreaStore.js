import { defineStore } from "pinia";

export const useAreaStore = defineStore("areaStore", {
  state: () => ({
    areas: [
      {
        label: "Main",
        background: "https://images6.alphacoders.com/139/1396013.jpg",
        apps: [
          {
            "name": "Lena",
            "icon": "https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://www.trendyol.com&size=128",
            "url": "www.google.com"
          }
        ],
      },
    ],
    faviconCache: {},
    initialized: false,
  }),
  
  actions: {
    async loadFromStorage() {
      try {
        const data = await chrome.storage.local.get(["areas", "faviconCache"]);
        console.log("Storage'dan yüklenen veri:", data);

        // areas verisi güvenli mi?
        if (data.areas && Array.isArray(data.areas)) {
          this.areas = data.areas.map((area) => ({
            ...area,
            apps: Array.isArray(area.apps) ? area.apps : [],
          }));
        } else {
          // Chrome storage'da veri yoksa veya bozuksa sadece Main alanı kalır
          this.areas = [
            {
              label: "Main",
              background: "https://images6.alphacoders.com/139/1396013.jpg",
              apps: [],
            },
          ];
        }

        // faviconCache kontrolü
        if (data.faviconCache && typeof data.faviconCache === "object") {
          this.faviconCache = data.faviconCache;
        } else {
          this.faviconCache = {};
        }

        this.initialized = true;
      } catch (error) {
        console.error("Storage'dan veri yüklenirken hata oluştu:", error);
        // Hata durumunda güvenli başlangıç
        this.areas = [
          {
            label: "Main",
            background: "https://images6.alphacoders.com/139/1396013.jpg",
            apps: [],
          },
        ];
        this.faviconCache = {};
        this.initialized = true;
      }
    },

    async saveToStorage() {
      if (!this.initialized) {
        console.warn(
          "Storage henüz yüklenmeden kaydetme işlemi yapılıyor, bekleyiniz..."
        );
        await this.loadFromStorage();
      }

      try {
        const safeAreas = Array.isArray(this.areas)
          ? this.areas.map((area) => ({
              ...area,
              apps: Array.isArray(area.apps) ? area.apps : [],
            }))
          : [
              {
                label: "Main",
                background: "https://images6.alphacoders.com/139/1396013.jpg",
                apps: [],
              },
            ];

        const safeFaviconCache =
          typeof this.faviconCache === "object" && this.faviconCache !== null
            ? this.faviconCache
            : {};

        // Storage sınırını aşmamak için veri boyutunu kontrol et
        const dataToSave = {
          areas: safeAreas,
          faviconCache: safeFaviconCache,
        };

        console.log("Storage'a kaydedilecek veri:", dataToSave);

        await chrome.storage.local.set(dataToSave);
        console.log("Veri başarıyla kaydedildi");
      } catch (error) {
        console.error("Storage'a veri kaydedilirken hata oluştu:", error);
        alert("Veriler kaydedilirken bir hata oluştu: " + error.message);
      }
    },

    addArea(newArea) {
      if (!this.initialized) {
        console.warn("Store henüz initialize edilmemiş!");
        return;
      }

      this.areas.push(newArea);
      this.saveToStorage();
    },

    async addAppToArea(areaIndex, title, url) {
      if (!this.initialized) {
        console.warn("Store henüz initialize edilmemiş!");
        await this.loadFromStorage();
      }

      function getValidURL(input) {
        if (!input) return null;

        // Kullanıcı başına http eklememişse ekle
        if (!/^https?:\/\//i.test(input)) {
          input = "https://" + input.replace(/^\/+/, "");
        }

        try {
          return new URL(input);
        } catch (e) {
          return null;
        }
      }

      const validURL = getValidURL(url);

      if (!validURL) {
        alert("Lütfen geçerli bir URL girin (örneğin: google.com)");
        return;
      }

      const domain = validURL.hostname;

      // Alan indeksi geçerli mi?
      if (areaIndex < 0 || areaIndex >= this.areas.length) {
        console.error("Geçersiz alan indeksi:", areaIndex);
        return;
      }

      // apps dizisini garantiye al
      if (!Array.isArray(this.areas[areaIndex].apps)) {
        this.areas[areaIndex].apps = [];
      }

      // Favicon cache kontrolü
      if (!this.faviconCache[domain]) {
        // useAreaStore.js içinde
        this.faviconCache[ domain ] = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
      }

      // Yeni uygulamayı ekle
      this.areas[areaIndex].apps.push({
        name: title,
        icon: this.faviconCache[domain],
        url: validURL.toString(),
      });

      // Değişiklikleri kaydet
      try {
        await this.saveToStorage();
        console.log(`"${title}" uygulaması başarıyla eklendi ve kaydedildi`);
      } catch (error) {
        console.error("Uygulama eklenirken hata oluştu:", error);
      }
    },
  },
});
