import { createApp } from "vue";
import App from "./App.vue";
import store from "./stores/index";
import router from "./router/index";
import "./assets/tailwind.css";
import VueLazyload from "vue-lazyload";

const app = createApp(App);

app.use(store);
app.use(router);
app.use(VueLazyload);

app.mount("#app");
