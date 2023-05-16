import { createRouter, createWebHashHistory } from 'vue-router'
import CatalogPage from './CatalogPage.vue'
import ItemPage from './ItemPage.vue'

const routes = [
  {
    path: '/',
    name: 'catalog',
    component: CatalogPage
  },
  {
    path: '/product/:id',
    name: 'item',
    component: ItemPage
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
