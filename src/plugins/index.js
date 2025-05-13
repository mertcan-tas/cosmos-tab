import router from './router/index'; 
import pinia from './stores/index'; 
import vuetify from './vuetify/index';
import i18n from './i18n/index';

export function registerPlugins(app) {
  app.use(router);
  app.use(pinia);
  app.use(vuetify);
  app.use(i18n);
}