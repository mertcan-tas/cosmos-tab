import { createI18n } from "vue-i18n";

import trMessages from "@/plugins/i18n/locales/tr.js";
import enMessages from "@/plugins/i18n/locales/en.js";

const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: localStorage.getItem("language") || "tr",
  fallbackLocale: "en",
  messages: {
    tr: trMessages, 
    en: enMessages, 
  },
});

export default i18n;