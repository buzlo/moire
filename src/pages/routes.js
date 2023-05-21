import { createRouter, createWebHashHistory } from 'vue-router'
import CatalogPage from './CatalogPage.vue'
import ItemPage from './ItemPage.vue'
import CartPage from './CartPage.vue'

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
  },
  {
    path: '/cart',
    name: 'cart',
    component: CartPage
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
