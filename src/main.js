import { createApp } from "vue";
import "./assets/style.css";
import App from "./App.vue";
import VueSmoothScroll from "vue3-smooth-scroll";
import router from './router';
import Button from "./components/Button.vue";
import LinkButton from "./components/LinkButton.vue";
import axios from 'axios';
axios.defaults.withCredentials = true;
import DashboardLayout from './components/DashboardLayout.vue'
import EmptyLayout from './components/EmptyLayout.vue'

let app = createApp(App);

app.use(VueSmoothScroll);
app.use(router);
app.component('DefaultLayout', DashboardLayout)
app.component('EmptyLayout', EmptyLayout)
app.component("Button", Button);
app.component("LinkButton", LinkButton);

app.mount("#app");
