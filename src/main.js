import Vue from 'vue';
import '@fontsource/merriweather/300.css';
import '@fontsource/merriweather/400.css';
import '@fontsource/merriweather/700.css';
import App from './App.vue';
import './styles/base.css';

Vue.config.productionTip = false;

new Vue({
  render: (createElement) => createElement(App),
}).$mount('#app');
