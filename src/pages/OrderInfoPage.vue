<script setup>
import { computed, reactive, watch } from 'vue'
import { useRoute } from 'vue-router'

import BaseBreadcrumbs from '../components/BaseBreadcrumbs.vue'

import { useCartStore } from '../stores/CartStore'
import { useOrderStore } from '../stores/OrderStore'
import { useProductCountWithNoun } from '../composables/useProductCountWithNoun'
import { useNumberFormat } from '../composables/useNumberFormat'
import BaseDictionary from '../components/BaseDictionary.vue'

const cartStore = useCartStore()
const orderStore = useOrderStore()
const route = useRoute()

const orderId = computed(() => orderStore.orderData.id)
const basketItems = computed(() => orderStore.orderData.basket?.items ?? [])
const deliveryPrice = computed(() => orderStore.orderData.deliveryType?.price ?? 0)
const totalPrice = computed(() => orderStore.orderData.totalPrice)

const itemsInfo = computed(() => useProductCountWithNoun(basketItems.value.length))

if (orderStore.orderData.id !== +route.params.id) {
  orderStore.loadOrderData(route.params.id, cartStore.userAccessKey)
}

const dictionaryItems = computed(() => [
  {
    key: 'Получатель',
    value: orderStore.orderData.name
  },
  {
    key: 'Адрес доставки',
    value: orderStore.orderData.address
  },
  {
    key: 'Телефон',
    value: orderStore.orderData.phone
  },
  {
    key: 'Email',
    value: orderStore.orderData.email
  },
  {
    key: 'Способ оплаты',
    value: orderStore.orderData.paymentType
  }
])

function formatPrice(price) {
  return +price ? useNumberFormat(price) + ' ₽' : 'бесплатно'
}

const breadcrumbItems = [
  {
    title: 'Каталог',
    routeName: 'catalog'
  },
  {
    title: 'Корзина',
    routeName: 'cart'
  },
  {
    title: 'Оформление заказа',
    routeName: ''
  }
]
</script>

<template>
  <main class="content container">
    <div class="content__top">
      <BaseBreadcrumbs :items="breadcrumbItems"></BaseBreadcrumbs>

      <h1 class="content__title">
        Заказ оформлен <span>№ {{ orderId }}</span>
      </h1>
    </div>

    <section class="cart">
      <div v-if="orderStore.loading.data">Загрузка корзины...</div>
      <div v-else-if="orderStore.errors.data">
        <p>При загрузке произошла ошибка.</p>
        <button class="button button--primary" @click.prevent="orderStore.loadOrderData">
          Попробовать<br />ещё раз
        </button>
      </div>
      <form class="cart__form form" action="#" method="POST">
        <div class="cart__field">
          <p class="cart__message">
            Благодарим за&nbsp;выбор нашего магазина. На&nbsp;Вашу почту придет письмо
            с&nbsp;деталями заказа. Наши менеджеры свяжутся с&nbsp;Вами в&nbsp;течение часа для
            уточнения деталей доставки.
          </p>
          <BaseDictionary :items="dictionaryItems"></BaseDictionary>
        </div>

        <div class="cart__block">
          <ul class="cart__orders">
            <li v-for="item of basketItems" :key="item.id" class="cart__order">
              <h3>{{ item.product.title }}</h3>
              <b>{{ useNumberFormat(item.price) }} ₽</b>
              <span>Артикул: {{ item.product.id }}</span>
            </li>
          </ul>

          <div class="cart__total">
            <p>
              Доставка: <b>{{ formatPrice(deliveryPrice) }}</b>
            </p>
            <p>
              Итого: <b>{{ itemsInfo.count }}</b> {{ itemsInfo.noun }} на сумму
              <b>{{ formatPrice(totalPrice) }}</b>
            </p>
          </div>
        </div>
      </form>
    </section>
  </main>
</template>

<style lang="scss" scoped>
@import '../styles/cart';
</style>
