import { createRouter, createWebHashHistory } from 'vue-router'
import CatalogPage from './CatalogPage.vue'
import ItemPage from './ItemPage.vue'
import CartPage from './CartPage.vue'
import OrderPage from './OrderPage.vue'
import OrderInfoPage from './OrderInfoPage.vue'

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
  },
  {
    path: '/cart/order',
    name: 'order',
    component: OrderPage
  },
  {
    path: '/cart/order/:id',
    name: 'order-info',
    component: OrderInfoPage
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
