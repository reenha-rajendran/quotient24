import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/HomePage.vue";
import NewsCategory from "@/views/NewsCategory.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  { path: "/category/:name", name: "category", component: NewsCategory },
  {
    path: "/search/results",
    name: "searchResult",
    component: () => import("../views/SearchResultView.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
