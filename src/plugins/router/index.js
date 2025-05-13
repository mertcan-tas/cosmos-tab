import { createRouter, createWebHistory } from "vue-router";

import HomeView from "@/views/home/HomeView.vue";
import SettingsView from "@/views/settings/SettingsView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  linkActiveClass: "active",
  linkExactActiveClass: "",
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/settings",
      name: "settings",
      component: SettingsView,
    },
    {
      path: "/:catchAll(.*)",
      name: "notfound",
      component: HomeView,
    },
  ],
});

export default router;
