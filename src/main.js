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

import { defineRule, configure } from 'vee-validate';
import * as AllRules from '@vee-validate/rules';
import { localize, setLocale } from '@vee-validate/i18n';
import zhTW from '@vee-validate/i18n/dist/locale/zh_TW.json';

Object.keys(AllRules).forEach((rule) => {
  if (typeof AllRules[rule] === 'function') {
    defineRule(rule, AllRules[rule]);
  }
});

configure({
  generateMessage: localize({ zh_TW: zhTW }),
  validateOnInput: true,
});

setLocale('zh_TW');

const app = createApp(App);

app.config.globalProperties.$filters = {
  currency,
  date,
};

app.config.globalProperties.$httpMessage = $httpMessage;

app.use(createPinia());
app.use(router);
app.use(VueAxios, axios);
app.component('isLoading', Loading);
app.mount('#app');
