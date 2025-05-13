import { defineStore } from "pinia";

export const useAreaStore = defineStore("areaStore", {
  state: () => ({
    areas: [
      {
        label: "Kodlama & Geliştirme",
        background:
          "https://4kwallpapers.com/images/wallpapers/ios-13-stock-ipados-green-black-background-amoled-ipad-hd-3840x2160-793.jpg",
        apps: [
          { name: "GitHub", url: "https://github.com/mertcan-tas" },

          {
            name: "Stackoverflow",
            url: "https://stackoverflow.com/questions",
          },
          {
            name: "Codewars",
            url: "https://www.codewars.com/dashboard",
          },
          {
            name: "Freecodecamp",
            url: "https://www.freecodecamp.org/learn/project-euler/",
          },

          { name: "Hackerrank", url: "https://www.hackerrank.com/dashboard" },

          { name: "API Desing", url: "https://roadmap.sh/api-design" },
          {
            name: "Gitlab",
            url: "https://gitlab.com/users/mertcan-tas/projects ",
          },
          { name: "Gitee", url: "https://gitee.com/explore " },
          { name: "Docker Hub", url: "https://hub.docker.com/ " },
          {
            name: "Docker Docs",
            url: "https://docs.docker.com/reference/cli/docker/ ",
          },
          {
            name: "Gitignore",
            url: "https://www.toptal.com/developers/gitignore/ ",
          },
          {
            name: "MDN Docs.",
            url: "https://developer.mozilla.org/en-US/docs/Learn_web_development ",
          },
          { name: "Visualgo", url: "https://visualgo.net/en " },
          {
            name: "Goalkicker",
            url: "https://books.goalkicker.com/ ",
          },
          { name: "Roadmap", url: "https://roadmap.sh " },
          { name: "Flutter Pcks.", url: "https://pub.dev/packages " },
          {
            name: "Codecademy",
            url: "https://www.codecademy.com/learn ",
          },
          {
            name: "SMS API",
            url: "https://panel.iletimerkezi.com/auth/login ",
          },
          {
            name: "SMS Docs",
            url: "https://www.toplusmsapi.com/ornekler/python-sms-gonderim-raporu ",
          },
          {
            name: "Font Source",
            url: "https://fontsource.org/",
          },
          {
            name: "Redis Books",
            url: "https://redis.io/ebooks/",
          },
        ],
      },
      {
        label: "Tasarım & UI/UX",
        background:
          "https://4kwallpapers.com/images/wallpapers/windows-11-bloom-collection-blue-background-blue-abstract-3840x2160-9033.jpg",
        apps: [
          { name: "Dribbble", url: "https://dribbble.com/ " },
          { name: "Behance", url: "https://www.behance.net/ " },
          { name: "Mockuptree", url: "https://mockuptree.com/ " },
          { name: "Freepik", url: "https://www.freepik.com/ " },
          { name: "Vecteezy", url: "https://www.vecteezy.com/ " },
          { name: "Unsplash", url: "https://unsplash.com/ " },
          { name: "Undraw", url: "https://undraw.co/illustrations " },
          {
            name: "Manypixels",
            url: "https://www.manypixels.co/gallery ",
          },
          {
            name: "Illustrations",
            url: "https://freeillustrations.xyz/ ",
          },
          { name: "Flaticon", url: "https://www.flaticon.com/ " },
          {
            name: "Bootstrap Icons",
            url: "https://icons.getbootstrap.com/ ",
          },
          {
            name: "Icon Park",
            url: "https://iconpark.oceanengine.com/official ",
          },
          { name: "Icon Monster", url: "https://iconmonstr.com/ " },
          { name: "Seek Logo", url: "https://seeklogo.com/ " },
          {
            name: "World Vector",
            url: "https://worldvectorlogo.com/ ",
          },
          { name: "Logo Book", url: "http://logobook.com/" },
          {
            name: "Lottie",
            url: "https://lottiefiles.com/free-animations/loader ",
          },
          {
            name: "UI Store",
            url: "https://www.uistore.design/types/adobe-xd/ ",
          },
          {
            name: "Muz Li",
            url: "https://muz.li/inspiration/uikits/ ",
          },
          {
            name: "Color Name",
            url: "https://www.color-name.com/hex/ed5623 ",
          },
          { name: "UI Colors", url: "https://uicolors.app/create " },
          { name: "Eva Colors", url: "https://colors.eva.design/ " },
          { name: "Icon Kitchen", url: "https://icon.kitchen/ " },
        ],
      },
      {
        label: "İş & Sosyal Medya",
        background:
          "https://4kwallpapers.com/images/wallpapers/road-mountains-tarmac-sunrise-morning-macos-big-sur-stock-5k-3840x2160-3996.jpg",
        apps: [
          {
            name: "Linkedin",
            url: "https://www.linkedin.com/feed/ ",
          },
          {
            name: "Linkedin Learn",
            url: "https://www.linkedin.com/learning/ ",
          },
          {
            name: "BTK Akademi",
            url: "https://www.btkakademi.gov.tr/portal ",
          },
          {
            name: "Udemy",
            url: "https://www.udemy.com/home/my-courses/learning/ ",
          },
          { name: "YouTube", url: "https://www.youtube.com/ " },
          { name: "Reddit", url: "https://www.reddit.com/ " },
          { name: "Techcrunch", url: "https://techcrunch.com/ " },
          {
            name: "Hacker News",
            url: "https://news.ycombinator.com/ ",
          },
          { name: "Pinterest", url: "https://tr.pinterest.com/ " },
          { name: "Telegram", url: "https://web.telegram.org/a/ " },
          {
            name: "Doc. Translate",
            url: "https://app.immersivetranslate.com/ ",
          },
          { name: "Kaggle", url: "https://www.kaggle.com/ " },
          {
            name: "Yazılım Turkiye",
            url: "https://www.yazilimturkiye.com/ ",
          },
          { name: "Ororo", url: "https://ororo.tv/en/channels " },
        ],
      },
      {
        label: "Yardımcı Araçlar",
        background:
          "https://4kwallpapers.com/images/wallpapers/abstract-background-3840x2160-11615.png",
        apps: [
          { name: "Qwen", url: "https://chat.qwen.ai/ " },
          { name: "DeepSeek", url: "https://chat.deepseek.com/ " },
          { name: "Gemini", url: "https://gemini.google.com/app " },
          { name: "Claude", url: "https://claude.ai/new " },
          { name: "Chatgpt", url: "https://chatgpt.com/ " },
          { name: "Keybr", url: "https://www.keybr.com/ " },
          { name: "Lifeofpix", url: "https://www.lifeofpix.com/ " },
          { name: "Coverr", url: "https://coverr.co/ " },
          { name: "Storyset", url: "https://storyset.com/ " },
          {
            name: "HTML Minify",
            url: "http://html-minify.online-domain-tools.com/",
          },
          {
            name: "HTML Format",
            url: "https://www.freeformatter.com/html-formatter.html ",
          },
          {
            name: "Credit Gen.",
            url: "https://iplogger.org/creditCardGenerator/ ",
          },
          {
            name: "UUI Gen.",
            url: "https://www.uuidgenerator.net/version4 ",
          },
          {
            name: "MD5 Gen.",
            url: "https://onlinehashtools.com/generate-random-md5-hash ",
          },
          { name: "Theme Lock", url: "https://themelock.com/eng/ " },
          {
            name: "Crackthemes",
            url: "https://www.crackthemes.com/ ",
          },
          {
            name: "Nulled Scripts",
            url: "http://www.nulled-scripts.xyz/",
          },
          { name: "WP Null 24", url: "https://wpnull24.net/ " },
          { name: "Nulled One", url: "https://nulled.one/ " },
          {
            name: "Torrent Mac",
            url: "https://www.torrentmac.net/ ",
          },
          { name: "Tineye", url: "https://tineye.com/ " },
          {
            name: "Eleven Labs",
            url: "https://elevenlabs.io/app/speech-synthesis/text-to-speech ",
          },
          {
            name: "Base64 Con.",
            url: "https://base64.guru/converter/encode/image ",
          },
          {
            name: "agromonitoring",
            url: "https://agromonitoring.com/ ",
          },
          { name: "4KWallpapers", url: "https://4kwallpapers.com/ " },
          {
            name: "Scrnshts Club",
            url: "https://scrnshts.club/category/photo-and-video/ ",
          },
          {
            name: "Pexels Videos",
            url: "https://www.pexels.com/videos/ ",
          },
          {
            name: "Vecteezy Vid.",
            url: "https://www.vecteezy.com/free-videos ",
          },
        ],
      },
    ],
    faviconCache: {},
  }),

  actions: {
    loadFromLocalStorage() {
      try {
        const areasRaw = localStorage.getItem("areas");
        const faviconCacheRaw = localStorage.getItem("faviconCache");

        if (areasRaw) {
          const areasData = JSON.parse(areasRaw);
          if (Array.isArray(areasData)) {
            this.areas = areasData.map((area) => ({
              ...area,
              apps: Array.isArray(area.apps) ? area.apps : [],
            }));
          }
        }

        if (faviconCacheRaw) {
          const faviconData = JSON.parse(faviconCacheRaw);
          if (typeof faviconData === "object" && faviconData !== null) {
            this.faviconCache = faviconData;
          }
        }

        this.areas.forEach((area) => {
          area.apps.forEach((app) => {
            const domain = new URL(app.url).hostname;
            app.icon =
              this.faviconCache[domain] ||
              `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
          });
        });
      } catch (error) {
        console.error("localStorage'dan veri yüklenirken hata oluştu:", error);
        this.areas = [
          {
            label: "Main",
            background: "",
            apps: [],
          },
        ];
        this.faviconCache = {};
      }
    },

    saveToLocalStorage() {
      try {
        const safeAreas = Array.isArray(this.areas)
          ? this.areas.map((area) => ({
              ...area,
              apps: Array.isArray(area.apps) ? area.apps : [],
            }))
          : [
              {
                label: "Main",
                background: "",
                apps: [],
              },
            ];

        const safeFaviconCache =
          typeof this.faviconCache === "object" && this.faviconCache !== null
            ? this.faviconCache
            : {};

        localStorage.setItem("areas", JSON.stringify(safeAreas));
        localStorage.setItem("faviconCache", JSON.stringify(safeFaviconCache));
      } catch (error) {
        console.error("localStorage'a veri kaydedilirken hata oluştu:", error);
      }
    },

    addArea(newArea) {
      this.areas.push(newArea);
      this.saveToLocalStorage();
    },

    async addAppToArea(areaIndex, title, url) {
      function getValidURL(input) {
        if (!input) return null;
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

      if (
        !this.areas[areaIndex] ||
        !Array.isArray(this.areas[areaIndex].apps)
      ) {
        this.areas[areaIndex].apps = [];
      }

      let iconData = this.faviconCache[domain];

      if (!iconData) {
        try {
          const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
          const response = await fetch(faviconUrl);
          if (!response.ok) throw new Error("Favicon indirilemedi");

          const blob = await response.blob();
          const reader = new FileReader();

          await new Promise((resolve, reject) => {
            reader.onloadend = () => {
              this.faviconCache[domain] = reader.result;
              iconData = reader.result;
              resolve();
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });
        } catch (error) {
          console.error("Favicon dönüştürme hatası:", error);
          iconData =
            "data:image/png;base64,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";
        }
      }

      this.areas[areaIndex].apps.push({
        name: title,
        url: validURL.toString(),
        icon: iconData,
      });

      this.saveToLocalStorage();
    },
  },
});
