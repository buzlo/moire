import { createRouter, createWebHashHistory } from "vue-router";
import CatalogPage from './CatalogPage.vue';

const routes = [
  {
    path: '/',
    component: CatalogPage,
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router;
