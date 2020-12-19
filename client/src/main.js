import Vue from 'vue';
import WebCam from 'vue-web-cam';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import router from './router';

Vue.use(WebCam)
Vue.config.productionTip = false

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
