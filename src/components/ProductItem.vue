<script setup>
import { computed, ref } from 'vue'
import { useNumberFormat } from '../composables/useNumberFormat'
import ColorsList from './ColorsList.vue';

const props = defineProps(['product'])

const currentColor = ref(props.product.colors[0].id)
const currentImg = computed(() => {
  try {
    return props.product.colors.find(color => color.id === currentColor.value).gallery[0].file.url
  } catch (error) {
    console.log(error)
    return null
  }
})


</script>

<template>
  <li class="catalog__item">
    <a class="catalog__pic" href="#">
      <img :src="currentImg" :alt="product.title" />
      <div v-if="!currentImg">Изображение не найдено</div>
    </a>

    <h3 class="catalog__title">
      <a href="#"> {{ product.title }} </a>
    </h3>

    <span class="catalog__price"> {{ useNumberFormat(product.price) }} ₽ </span>

    <ColorsList v-model="currentColor" :colors="product.colors"></ColorsList>
  </li>
</template>
