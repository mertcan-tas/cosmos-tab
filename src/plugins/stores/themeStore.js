// themeStore.js
import { defineStore } from 'pinia';

export const useThemeStore = defineStore('theme', {
  state: () => ({
    isDark: false,
    currentLanguage: 'tr',
  }),
  
  actions: {
    toggleDarkMode() {
      this.isDark = !this.isDark;
      localStorage.setItem('darkMode', this.isDark);
    },
    
    setLanguage(lang) {
      if (this.currentLanguage === lang) {
        return; // Skip if language hasn't changed
      }
      
      // Update the store value
      this.currentLanguage = lang;
      
      // Persist to localStorage
      localStorage.setItem('language', lang);
      
      // Force application to reload locale resources
      document.documentElement.setAttribute('lang', lang);
      
      // Dispatch a custom event that components can listen for
      window.dispatchEvent(new CustomEvent('language-changed', { 
        detail: { language: lang } 
      }));
    },
    
    initSettings() {
      // Get stored values
      const savedTheme = localStorage.getItem('darkMode');
      const savedLanguage = localStorage.getItem('language');
      
      // Apply stored theme setting or default
      if (savedTheme !== null) {
        this.isDark = savedTheme === 'true';
      } else {
        // Default theme
        this.isDark = false;
        localStorage.setItem('darkMode', 'false');
      }
      
      // Apply stored language setting or default
      if (savedLanguage) {
        this.currentLanguage = savedLanguage;
      } else {
        // Default language
        this.currentLanguage = 'tr';
        localStorage.setItem('language', 'tr');
      }
      
      // Set the HTML lang attribute
      document.documentElement.setAttribute('lang', this.currentLanguage);
    }
  }
});