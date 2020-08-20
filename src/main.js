import Vue from "vue";
import Layout from "./Layout.vue";
import BootstrapVue from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import router from "./router";
Vue.use(BootstrapVue);

Vue.config.productionTip = false;

new Vue({
  render: h => h(Layout),
  router
}).$mount("#app");
