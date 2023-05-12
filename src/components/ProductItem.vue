<script setup>
import { computed, ref } from 'vue'
import { useNumberFormat } from '../composables/useNumberFormat'

const props = defineProps(['product'])
const colors = computed(() => props.product.colors)

const currentColor = ref(0)
const currentImg = computed(() => {
  try {
    return colors.value[currentColor.value].gallery[0].file.url
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

    <ul class="colors colors--black">
      <li v-for="(color, index) of product.colors" class="colors__item" :key="color.id">
        <label class="colors__label">
          <input
            class="colors__radio sr-only"
            type="radio"
            :name="color.color.title"
            :value="index"
            v-model="currentColor"
          />
          <span class="colors__value" :style="{ backgroundColor: color.color.code }"> </span>
        </label>
      </li>
    </ul>
  </li>
</template>
