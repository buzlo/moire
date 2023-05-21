<script setup>
import { computed, reactive, unref, watch, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import { useVuelidate } from '@vuelidate/core'
import { vMaska } from 'maska'

import BaseBreadcrumbs from '../components/BaseBreadcrumbs.vue'

import { API_BASE_URL } from '../config'
import { useCartStore } from '../stores/CartStore'
import { useOrderStore } from '../stores/OrderStore'
import { useFetchAll } from '../composables/useFetchAll'
import { useCreateRules } from '../composables/useCreateRules'
import { useProductCountWithNoun } from '../composables/useProductCountWithNoun'
import { useNumberFormat } from '../composables/useNumberFormat'

const cartStore = useCartStore()
const orderStore = useOrderStore()
const router = useRouter()

const breadcrumbItems = reactive([
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
])

const itemsInfo = computed(() => useProductCountWithNoun(cartStore.items.length))

const rules = useCreateRules()

const phoneMaska = reactive({
  unmasked: ''
})
const formState = reactive({
  deliveryTypeId: null,
  paymentTypeId: null,
  comment: '',
  phone: ''
})
watchEffect(() => (formState.phone = '+7' + phoneMaska.unmasked))

const formInputs = [
  {
    name: 'name',
    type: 'text',
    placeholder: 'Введите ваше полное имя',
    label: 'ФИО'
  },
  {
    name: 'address',
    type: 'text',
    placeholder: 'Введите ваш адрес',
    label: 'Адрес доставки'
  },
  {
    name: 'maskedPhone',
    type: 'tel',
    placeholder: 'Введите ваш телефон',
    label: 'Телефон'
  },
  {
    name: 'email',
    type: 'email',
    placeholder: 'Введите ваш email',
    label: 'Email'
  }
]

for (const input of formInputs) {
  formState[input.name] = ''
}

const v$ = useVuelidate(rules, formState)

const loading = reactive({
  deliveries: false,
  payments: false,
  submit: false
})
const errors = reactive({
  deliveries: true,
  payments: true,
  submit: true
})

const deliveries = reactive([])
const deliveryPrice = computed(() => {
  const index = deliveries.findIndex((delivery) => delivery.id === formState.deliveryTypeId)
  return +deliveries[index]?.price
})
const priceWithDelivery = computed(() => {
  return +cartStore.cartTotal + deliveryPrice.value
})

getDeliveriesData()

const payments = reactive([])

watch(() => formState.deliveryTypeId, getPaymentsData)

async function getDeliveriesData() {
  loading.deliveries = true
  errors.deliveries = false

  const url = `${API_BASE_URL}/deliveries`
  try {
    const [deliveriesData] = await useFetchAll({ urls: [url] })
    deliveries.splice(0, Infinity, ...deliveriesData)
    formState.deliveryTypeId = deliveries[0].id
  } catch (error) {
    errors.deliveries = true
    console.log(error)
  }

  loading.deliveries = false
}

async function getPaymentsData() {
  loading.payments = true
  errors.payments = false

  const searchParams = [['deliveryTypeId', formState.deliveryTypeId]]
  const url = new URL(`${API_BASE_URL}/payments`)
  url.search = new URLSearchParams(searchParams)
  try {
    const [paymentsData] = await useFetchAll({ urls: [url] })
    payments.splice(0, Infinity, ...paymentsData)
    formState.paymentTypeId = payments[0].id
  } catch (error) {
    errors.payments = true
    console.log(error)
  }

  loading.payments = false
}

async function onSubmit() {
  const isFormCorrect = await unref(v$).$validate()
  if (!isFormCorrect) return

  await orderStore.submitOrder(formState, cartStore.userAccessKey)
  if (orderStore.errors.submit) return

  cartStore.loadCartData()
  router.push(`/cart/order/${orderStore.orderData.id}`)
}

function formatPrice(price) {
  return +price ? useNumberFormat(price) + ' ₽' : 'бесплатно'
}
</script>

<template>
  <main class="content container">
    <div class="content__top">
      <BaseBreadcrumbs :items="breadcrumbItems"></BaseBreadcrumbs>

      <div class="content__row">
        <h1 class="content__title">Оформление заказа</h1>
      </div>
    </div>

    <section class="cart">
      <form class="cart__form form" action="#" method="POST" @submit.prevent="onSubmit">
        <div class="cart__field">
          <div class="cart__data">
            <label v-for="item of formInputs" :key="item.name" class="form__label">
              <input
                v-model="formState[item.name]"
                v-maska="item.name === 'maskedPhone' ? phoneMaska : null"
                class="form__input"
                :type="item.type"
                :name="item.name"
                :data-maska="item.name === 'maskedPhone' ? '+7 ### ###-##-##' : null"
                :placeholder="item.placeholder"
              />
              <span class="form__value">{{ item.label }}</span>
              <div class="form__error">
                <span
                  v-for="$error of v$[item.name !== 'maskedPhone' ? item.name : 'phone'].$errors"
                  :key="$error.$validator"
                >
                  {{ $error.$message + ' ' }}
                </span>
              </div>
            </label>

            <label class="form__label">
              <textarea
                v-model="formState.comment"
                class="form__input form__input--area"
                name="comments"
                placeholder="Ваши пожелания"
              ></textarea>
              <span class="form__value">Комментарий к заказу</span>
            </label>
          </div>

          <div class="cart__options">
            <h3 class="cart__title">Доставка</h3>
            <ul class="cart__options options">
              <li v-for="delivery of deliveries" :key="delivery.id" class="options__item">
                <label class="options__label">
                  <input
                    v-model="formState.deliveryTypeId"
                    class="options__radio sr-only"
                    type="radio"
                    name="delivery"
                    :value="delivery.id"
                  />
                  <span class="options__value">
                    {{ delivery.title }}
                    <b>{{ formatPrice(delivery.price) }}</b>
                  </span>
                </label>
              </li>
            </ul>

            <h3 class="cart__title">Оплата</h3>
            <ul class="cart__options options">
              <li v-for="payment of payments" :key="payment.id" class="options__item">
                <label class="options__label">
                  <input
                    v-model="formState.paymentTypeId"
                    class="options__radio sr-only"
                    type="radio"
                    name="pay"
                    :value="payment.id"
                  />
                  <span class="options__value"> {{ payment.title }} </span>
                </label>
              </li>
            </ul>
          </div>
        </div>

        <div class="cart__block">
          <ul class="cart__orders">
            <li v-for="item of cartStore.items" :key="item.id" class="cart__order">
              <h3>{{ item.product.title }}</h3>
              <b>{{ useNumberFormat(item.product.price) }} ₽</b>
              <span>Артикул: {{ item.product.id }}</span>
            </li>
          </ul>

          <div class="cart__total">
            <p>
              Доставка: <b>{{ formatPrice(deliveryPrice) }}</b>
            </p>
            <p>
              Итого: <b>{{ itemsInfo.count }}</b> {{ itemsInfo.noun }} на сумму
              <b>{{ useNumberFormat(priceWithDelivery) }} ₽</b>
            </p>
          </div>

          <button class="cart__button button button--primary" type="submit">Оформить заказ</button>
        </div>
        <div v-if="orderStore.errors.submit" class="cart__error form__error-block">
          <h4>Заявка не отправлена!</h4>
          <p>Похоже произошла ошибка. Попробуйте отправить снова или перезагрузите страницу.</p>
        </div>
      </form>
    </section>
  </main>
</template>

<style lang="scss" scoped>
@import '../styles/cart';
@import '../styles/options';
</style>
