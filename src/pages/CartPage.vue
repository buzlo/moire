<script setup>
import { computed, reactive } from 'vue'

import BaseBreadcrumbs from '../components/BaseBreadcrumbs.vue'

import { useCartStore } from '../stores/CartStore'
import { useInflectNoun } from '../composables/useInflectNoun'
import { useNumberFormat } from '../composables/useNumberFormat'
import { useCountTotal } from '../composables/useCountTotal'
import CartItem from '../components/CartItem.vue'

const cartStore = useCartStore()

const breadcrumbItems = reactive([
  {
    title: 'Каталог',
    routeName: 'catalog'
  },
  {
    title: 'Корзина',
    routeName: ''
  }
])

const itemsInfo = computed(() => {
  const count = cartStore.cartItems.length
  return count + ' ' + useInflectNoun(count, ['товар', 'товара', 'товаров'])
})

const cartTotal = computed(() => useCountTotal(cartStore.cartItems))

function onItemDelete(id) {
  cartStore.deleteCartItem(id)
}

function onItemUpdate(id, qty) {
  cartStore.updateCartItem(id, qty)
}
</script>

<template>
  <main class="content container">
    <div class="content__top">
      <BaseBreadcrumbs :items="breadcrumbItems"></BaseBreadcrumbs>

      <div class="content__row">
        <h1 class="content__title">Корзина</h1>
        <span class="content__info"> {{ itemsInfo }} </span>
      </div>
    </div>

    <div v-if="cartStore.loading.cart">Загрузка корзины...</div>
    <div v-else-if="cartStore.errors.cart">
      <p>При загрузке произошла ошибка.</p>
      <button class="button button--primary" @click.prevent="cartStore.loadCartData()">
        Попробовать<br />ещё раз
      </button>
    </div>
    <section v-else class="cart">
      <form class="cart__form form" action="#">
        <div class="cart__field">
          <ul class="cart__list">
            <CartItem
              v-for="item of cartStore.cartItems"
              :key="item.id"
              :item="item"
              @update-qty="onItemUpdate(item.id, $event)"
              @delete-item="onItemDelete"
            ></CartItem>
          </ul>
        </div>

        <div class="cart__block">
          <p class="cart__desc">Мы&nbsp;посчитаем стоимость доставки на&nbsp;следующем этапе</p>
          <p class="cart__price">
            Итого: <span>{{ useNumberFormat(cartTotal) }} ₽</span>
          </p>

          <button class="cart__button button button--primary" type="submit">Оформить заказ</button>
        </div>

        <span v-if="cartStore.loading.update">Корзина обновляется...</span>
        <span v-else-if="cartStore.errors.update"
          >При обновлении корзины произошла ошибка, попробуйте позднее</span
        >
      </form>
    </section>
  </main>
</template>

<style lang="scss" scoped>
@import '../styles/cart';
</style>
