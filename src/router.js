import Vue from "vue";
import VueRouter from "vue-router";

import App from "./App";
import Animation from "./examples/Animation";
import DotGrid from "./examples/DotGrid";
import LineGrid from "./examples/LineGrid";
import StickMan from "./examples/StickMan";
import BasicShape from "./examples/BasicShape";
import FreeDrawing from "./examples/FreeDrawing";

Vue.use(VueRouter);
const router = new VueRouter({
  mode: "history",
  base: __dirname,
  routes: [
    { path: "/", component: App },
    { path: "/examples/animation", component: Animation },
    { path: "/examples/dot-grid", component: DotGrid },
    { path: "/examples/line-grid", component: LineGrid },
    { path: "/examples/stick-man", component: StickMan },
    { path: "/examples/basic-shape", component: BasicShape },
    { path: "/examples/free-drawing", component: FreeDrawing }
  ]
});

export default router;
