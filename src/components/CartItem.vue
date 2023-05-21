<script setup>
import { computed } from 'vue'
import BaseCounter from './BaseCounter.vue'
import { useNumberFormat } from '../composables/useNumberFormat'

const props = defineProps({ item: { type: Object, required: true } })
const emit = defineEmits(['updateQty', 'deleteItem'])

const count = computed({
  get() {
    return props.item.quantity
  },
  set(value) {
    emit('updateQty', value)
  }
})

function onItemDelete(id) {
  emit('deleteItem', id)
}
</script>

<template>
  <li class="cart__item product">
    <RouterLink class="product__pic" :to="{ name: 'item', params: { id: item.product.id } }">
      <img
        :src="item.color.gallery[0].file.url"
        width="120"
        height="120"
        :alt="item.product.title"
      />
    </RouterLink>
    <h3 class="product__title">{{ item.product.title }}</h3>
    <p class="product__info product__info--color">
      Цвет:
      <span>
        <i :style="{ 'background-color': item.color.color.code }"></i>
        {{ item.color.color.title }}
      </span>
      <span> Размер: {{ item.size.title }} </span>
    </p>
    <span class="product__code"> Артикул: {{ item.product.id }} </span>

    <BaseCounter v-model="count"></BaseCounter>

    <b class="product__price"> {{ useNumberFormat(item.product.price) }} ₽ </b>

    <button
      class="product__del button-del"
      type="button"
      aria-label="Удалить товар из корзины"
      @click="onItemDelete(item.id)"
    >
      <svg width="20" height="20" fill="currentColor">
        <use xlink:href="#icon-close"></use>
      </svg>
    </button>
  </li>
</template>

<style lang="scss" scoped>
@import '../styles/variables';
.product {
  display: grid;
  grid-template-columns: 120px 280px 140px auto 20px;
  grid-template-rows: repeat(3, min-content);
  align-items: center;
  grid-gap: 10px 20px;
}

.product__pic {
  align-self: flex-start;
  grid-column: 1/2;
  grid-row: 1/4;
}

.product__title {
  margin: 0;
  grid-column: 2/3;
  grid-row: 1/2;
  align-self: flex-start;

  font-size: 16px;
  line-height: 22px;
  font-weight: 400;
}

.product__info {
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

.product__code {
  grid-column: 2/3;
  grid-row: 3/4;

  font-size: 12px;
  color: $text-light;
}

.product__del {
  grid-column: 5/6;
  grid-row: 1/2;
}

.product__counter {
  width: 130px;
  height: 40px;

  input {
    padding: 10px 5px;
    height: 40px;
    width: 55px;
  }
}
</style>
