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
@import '../styles/mixins';
@import '../styles/variables';
.cart {
  &__field {
    grid-row: 1/3;
  }

  &__list {
    @include ulres;
  }

  &__item {
    &:not(:last-child) {
      margin-bottom: 60px;
    }
  }

  &__form {
    display: grid;
    grid-template-columns: 1fr 370px;
    grid-template-rows: auto 1fr;
    grid-gap: 20px 50px;
    align-items: flex-start;
  }

  &__block {
    border: 1px solid #dedede;
    border-radius: 1px;
    padding: 35px 30px;
  }

  &__button {
    margin-top: 20px;
    width: 100%;
  }

  &__desc {
    margin: 0 0 15px;

    font-size: 16px;
    line-height: 22px;
  }

  &__price {
    margin: 0 0 15px;

    font-size: 30px;
    line-height: 48px;

    span {
      font-weight: 500;
      font-size: 34px;
      line-height: 48px;
    }
  }

  &__data {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 5px 30px;
    padding-bottom: 25px;
    margin-bottom: 15px;

    label:not(:nth-child(4)):not(:nth-child(3)) {
      grid-column: 1/-1;
    }
  }

  &__title {
    margin: 0 0 20px;

    font-family: $font-second;
    font-size: 14px;
    line-height: 24px;
    text-transform: uppercase;
  }

  &__options {
    &:not(:last-child) {
      margin-bottom: 40px;
    }
  }

  &__orders {
    @include ulres;
    padding: 0 30px 25px;
    margin: 0 -30px 25px;
    border-bottom: 1px solid #dedede;
  }

  &__order {
    display: grid;
    grid-template-columns: 1fr 90px;
    grid-gap: 5px 20px;

    &:not(:last-child) {
      margin-bottom: 20px;
    }

    h3 {
      margin: 0;

      font-size: 16px;
      line-height: 22px;
      font-weight: 400;
    }

    b {
      font-weight: 500;
      font-size: 16px;
      line-height: 24px;
      text-align: right;
    }

    span {
      font-size: 12px;
      line-height: 1;
      color: $text-second;
    }
  }

  &__total {
    p {
      margin: 0;
      &:not(:last-child) {
        margin-bottom: 5px;
      }
    }
  }

  &__error {
    grid-column: 2/3;
  }

  &__message {
    margin: 0 0 50px;

    font-size: 16px;
    line-height: 24px;
    color: #000;
  }
}

.product {
  .product {
    display: grid;
    grid-template-columns: 120px 280px 140px auto 20px;
    grid-template-rows: repeat(3, min-content);
    align-items: center;
    grid-gap: 10px 20px;
  }

  &__pic {
    align-self: flex-start;
    grid-column: 1/2;
    grid-row: 1/4;
  }

  &__title {
    margin: 0;
    grid-column: 2/3;
    grid-row: 1/2;
    align-self: flex-start;

    font-size: 16px;
    line-height: 22px;
    font-weight: 400;
  }

  &__info {
    margin: 0;
    grid-column: 2/3;
    grid-row: 2/3;

    font-size: 14px;
    line-height: 1;
    color: #737373;

    &--color {
      span {
        position: relative;
        display: inline-block;
        padding-left: 30px;
        vertical-align: top;

        i {
          position: absolute;
          top: 50%;
          left: 5px;
          transform: translateY(-50%);
          display: block;
          width: 20px;
          height: 20px;
          border-radius: 50%;
        }
      }
    }

    span {
      color: $text-main;
    }
  }

  &__code {
    grid-column: 2/3;
    grid-row: 3/4;

    font-size: 12px;
    color: $text-light;
  }

  &__del {
    grid-column: 5/6;
    grid-row: 1/2;
  }

  &__counter {
    width: 130px;
    height: 40px;

    input {
      padding: 10px 5px;
      height: 40px;
      width: 55px;
    }
  }
}
</style>
