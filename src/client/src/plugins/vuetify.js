import Vue from 'vue';
import VueCookies from 'vue-cookies';
import Vuetify from 'vuetify/lib/framework';

Vue.use(VueCookies);
Vue.$cookies.config('7d');

Vue.use(Vuetify);

export default new Vuetify({
});
