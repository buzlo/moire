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

<style lang="scss" scoped></style>
