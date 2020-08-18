import Vue from "vue";
import VueRouter from "vue-router";

import FreeDrawing from "./examples/FreeDrawing";
import Home from "./Home";
import App from "./App";

Vue.use(VueRouter);

const router = new VueRouter({
  routes: [
    { path: "/", component: App },
    { path: "/free-drawing", component: FreeDrawing }
  ]
});

export default router;
