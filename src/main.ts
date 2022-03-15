import {createApp} from 'vue';
import App from './app/app.vue';
import router from './router';
import store from './store';

import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome';
import {library} from '@fortawesome/fontawesome-svg-core';
import {faLock, faEnvelope} from '@fortawesome/free-solid-svg-icons';
import {faFacebook, faGooglePlus} from '@fortawesome/free-brands-svg-icons';
import Toast, {PluginOptions} from 'vue-toastification';
import 'vue-toastification/dist/index.css';
import {createI18n} from 'vue-i18n';
import {VueWindowSizePlugin} from 'vue-window-size/option-api';

import '@vueform/multiselect/themes/default.css';
import pt from './translation/pt.json';
import axios from 'axios';

import './index.scss';

library.add(faLock, faEnvelope, faFacebook, faGooglePlus);
axios.defaults.baseURL = process.env.VUE_APP_API_URL;
axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem(
    'token'
)}`;

const options: PluginOptions = {timeout: 2000};
const i18n = createI18n({
    locale: 'pt',
    messages: {pt},
    fallbackLocale: 'pt'
});

createApp(App)
    .component('font-awesome-icon', FontAwesomeIcon)
    .use(store)
    .use(router)
    .use(VueWindowSizePlugin)
    .use(Toast, options)
    .use(i18n)
    .mount('#app');
