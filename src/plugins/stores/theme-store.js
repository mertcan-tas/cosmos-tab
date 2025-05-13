// themeStore.js
import { defineStore } from "pinia";

export const useThemeStore = defineStore("theme", {
  state: () => ({
    isDark: false,
    currentLanguage: "tr",
  }),

  actions: {
    toggleDarkMode() {
      this.isDark = !this.isDark;
      localStorage.setItem("darkMode", this.isDark);
    },

    setLanguage(lang) {
      if (this.currentLanguage === lang) {
        return;
      }

      this.currentLanguage = lang;

      localStorage.setItem("language", lang);

      document.documentElement.setAttribute("lang", lang);

      window.dispatchEvent(
        new CustomEvent("language-changed", {
          detail: { language: lang },
        })
      );
    },

    initSettings() {
      const savedTheme = localStorage.getItem("darkMode");
      const savedLanguage = localStorage.getItem("language");

      if (savedTheme !== null) {
        this.isDark = savedTheme === "true";
      } else {
        this.isDark = false;
        localStorage.setItem("darkMode", "false");
      }

      if (savedLanguage) {
        this.currentLanguage = savedLanguage;
      } else {
        this.currentLanguage = "tr";
        localStorage.setItem("language", "tr");
      }

      document.documentElement.setAttribute("lang", this.currentLanguage);
    },
  },
});
