import { createApp } from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import Loading from 'vue3-loading-overlay';
import 'vue3-loading-overlay/dist/vue3-loading-overlay.css';
import { currency, date } from './methods/filters';
import $httpMessage from './methods/pushMessage';
import { createPinia } from 'pinia';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';

import './assets/all.scss';

import App from './App.vue';
import router from './router';

const app = createApp(App);

app.config.globalProperties.$filters = {
  currency,
  date,
};

// 此函式的用途是整合 Ajax 的錯誤事件，統一整理發送給予 Toast 處理
app.config.globalProperties.$httpMessage = $httpMessage;

app.use(createPinia());
app.use(router);
app.use(VueAxios, axios);
app.component('isLoading', Loading);
app.mount('#app');
