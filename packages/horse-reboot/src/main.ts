import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './plugins/firebase';
import { IonicVue } from './plugins/ionic';
import { pinia } from './plugins/pinia';
import './plugins/vant';
import './plugins/dayjs';

createApp(App)
  .use(router)
  .use(IonicVue, {
    mode: 'ios',
  })
  .use(pinia)
  .mount('#app');
