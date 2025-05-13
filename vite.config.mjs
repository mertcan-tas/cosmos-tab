import Components from "unplugin-vue-components/vite";
import Vue from "@vitejs/plugin-vue";
import Vuetify, { transformAssetUrls } from "vite-plugin-vuetify";
import Fonts from "unplugin-fonts/vite";
import vueDevTools from "vite-plugin-vue-devtools";

import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
  plugins: [
    Vue({
      template: { transformAssetUrls },
    }),
    vueDevTools(),
    Vuetify(),
    Components({
      dirs: ["src/assets", "src/components", "src/layouts", "src/views"],
    }),
    viteStaticCopy({
      targets: [
        {
          src: "src/assets/icon/",
          dest: ".",
          rename: "icon/",
        },
        {
          src: "manifest.json",
          dest: ".",
        },
      ],
    }),
    Fonts({
      fontsource: {
        families: [
          {
            name: "Roboto",
            subsets: ["latin"],
            weights: [100, 300, 400, 500, 700, 900],
            styles: ["normal"],
          },
        ],
      },
    }),
  ],
  optimizeDeps: {
    exclude: ["vuetify"],
  },
  define: { "process.env": {} },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
    extensions: [".js", ".json", ".jsx", ".mjs", ".ts", ".tsx", ".vue"],
  },
  server: {
    port: 3000,
  },
  base: "./",
  build: {
    assetsDir: "assets",
  },
  css: {
    preprocessorOptions: {
      sass: {
        api: "modern-compiler",
      },
      scss: {
        api: "modern-compiler",
      },
    },
  },
});
