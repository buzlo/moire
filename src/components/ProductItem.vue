<script setup>
import { computed, ref } from 'vue'
import { useNumberFormat } from '../composables/useNumberFormat'
import ColorsList from './ColorsList.vue'

const props = defineProps(['product'])

const currentColor = ref(0)
const currentImg = computed(() => {
  try {
    return props.product.colors[currentColor.value].gallery[0].file.url
  } catch (error) {
    console.log(error)
    return null
  }
})
</script>

<template>
  <li class="catalog__item">
    <RouterLink :to="{ name: 'item', params: { id: product.id } }" class="catalog__pic" href="#">
      <img :src="currentImg" :alt="product.title" />
      <div v-if="!currentImg">Изображение не найдено</div>
    </RouterLink>

    <h3 class="catalog__title">
      <RouterLink :to="{ name: 'item', params: { id: product.id } }" href="#"> {{ product.title }} </RouterLink>
    </h3>

    <span class="catalog__price"> {{ useNumberFormat(product.price) }} ₽ </span>

    <ColorsList v-model="currentColor" :colors="product.colors"></ColorsList>
  </li>
</template>
