<template>
  <v-app :theme="isDark ? 'dark' : 'light'">
    <v-main>
      <slot></slot>
    </v-main>
  </v-app>
</template>

<script>
import { useThemeStore } from "@/plugins/stores/theme-store.js";
import { useI18n } from "vue-i18n";

export default {
  name: "BaseLayout",
  data() {
    return {
      themeStore: useThemeStore(),
      i18n: useI18n(),
    };
  },
  computed: {
    isDark() {
      return this.themeStore.isDark;
    },
    currentLanguage() {
      return this.themeStore.currentLanguage;
    },
  },
  watch: {
    currentLanguage: {
      handler(newLang) {
        if (
          this.i18n.locale &&
          typeof this.i18n.locale === "object" &&
          "value" in this.i18n.locale
        ) {
          this.i18n.locale.value = newLang;
        } else {
          this.i18n.locale = newLang;
        }
        document.documentElement.setAttribute("lang", newLang);
      },
      immediate: true,
    },
  },
  mounted() {
    this.themeStore.initSettings();
    
    if (
      this.i18n.locale &&
      typeof this.i18n.locale === "object" &&
      "value" in this.i18n.locale
    ) {
      this.i18n.locale.value = this.themeStore.currentLanguage;
    } else {
      this.i18n.locale = this.themeStore.currentLanguage;
    }
    document.documentElement.setAttribute(
      "lang",
      this.themeStore.currentLanguage
    );
  },
};
</script>
