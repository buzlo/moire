<script setup>
import { ref, shallowRef, computed, toRaw } from 'vue'
import { useProductStore } from '../stores/ProductStore'
import { useFilterStore } from '../stores/FilterStore'

const productStore = useProductStore()
const filterStore = useFilterStore()

filterStore.fill()

const fromPrice = ref(null)
const toPrice = ref(null)
const pickedCategory = ref(-1)
const pickedMaterials = shallowRef([])
const pickedSeasons = shallowRef([])

function onSubmit() {
  const params = {}
  if (pickedCategory.value > -1) params.categoryId = pickedCategory.value
  if (pickedMaterials.value.length > 0) params['materialIds[]'] = pickedMaterials.value
  if (pickedSeasons.value.length > 0) params['seasonIds[]'] = pickedSeasons.value
  if (fromPrice.value > 0) params.minPrice = fromPrice.value
  if (toPrice.value > 0) params.maxPrice = toPrice.value

  productStore.fill(params)
}

function onReset() {
  fromPrice.value = null
  toPrice.value = null
  pickedCategory.value = -1
  pickedMaterials.value = []
  pickedSeasons.value = []
  onSubmit()
}

const maxPrice = computed(() => {
  const products = toRaw(productStore.products)
  const prices = products.map((product) => product.price)
  return Math.max(...prices)
})
</script>

<template>
  <aside class="filter">
    <form @submit.prevent="onSubmit" class="filter__form form" action="#" method="get">
      <fieldset class="form__block">
        <legend class="form__legend">Цена</legend>
        <label class="form__label form__label--price">
          <input
            class="form__input"
            type="text"
            name="min-price"
            v-model="fromPrice"
            placeholder="0"
          />
          <span class="form__value">От</span>
        </label>
        <label class="form__label form__label--price">
          <input
            class="form__input"
            type="text"
            name="max-price"
            v-model="toPrice"
            :placeholder="maxPrice"
          />
          <span class="form__value">До</span>
        </label>
      </fieldset>

      <fieldset class="form__block">
        <legend class="form__legend">Категория</legend>
        <label class="form__label form__label--select">
          <select class="form__select" type="text" name="category" v-model="pickedCategory">
            <option :value="-1">Все категории</option>
            <option
              v-for="category of filterStore.categories"
              :value="category.id"
              :key="category.id"
            >
              {{ category.title }}
            </option>
          </select>
        </label>
      </fieldset>

      <fieldset class="form__block">
        <legend class="form__legend">Материал</legend>
        <ul class="check-list">
          <li v-for="material of filterStore.materials" class="check-list__item" :key="material.id">
            <label class="check-list__label">
              <input
                class="check-list__check sr-only"
                type="checkbox"
                name="material"
                :value="material.id"
                v-model="pickedMaterials"
              />
              <span class="check-list__desc">
                {{ material.title }}
                <span>({{ material.productsCount }})</span>
              </span>
            </label>
          </li>
        </ul>
      </fieldset>

      <fieldset class="form__block">
        <legend class="form__legend">Коллекция</legend>
        <ul class="check-list">
          <li v-for="season of filterStore.seasons" class="check-list__item" :key="season.id">
            <label class="check-list__label">
              <input
                class="check-list__check sr-only"
                type="checkbox"
                name="collection"
                :value="season.id"
                v-model="pickedSeasons"
              />
              <span class="check-list__desc">
                {{ season.title }}
                <span>({{ season.productsCount }})</span>
              </span>
            </label>
          </li>
        </ul>
      </fieldset>

      <button class="filter__submit button button--primary" type="submit">Применить</button>
      <button @click.prevent="onReset" class="filter__reset button button--second" type="button">
        Сбросить
      </button>
    </form>
  </aside>
</template>

<style lang="scss" scoped>
.filter {
  &__form {
    padding: 0 25px 60px;
  }

  &__submit {
    width: 100%;
    margin-bottom: 15px;
  }

  &__reset {
    width: 144px;
  }
}
</style>
