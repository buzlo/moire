<script setup>
import { computed, toRaw } from 'vue'
import { useRoute } from 'vue-router'
import { useProductStore } from '../stores/ProductStore'
import { useFilterStore } from '../stores/FilterStore'

const productStore = useProductStore()
const filterStore = useFilterStore()
const route = useRoute()

filterStore.pickedValues.category = route.query.category ?? 0

onSubmit()

function onSubmit() {
  productStore.params.categoryId = filterStore.pickedValues.category
  productStore.params['materialIds[]'] = toRaw(filterStore.pickedValues.materials)
  productStore.params['seasonIds[]'] = toRaw(filterStore.pickedValues.seasons)
  productStore.params.minPrice = filterStore.pickedValues.fromPrice
  productStore.params.maxPrice = filterStore.pickedValues.toPrice

  productStore.fill()
}

function onReset() {
  filterStore.pickedValues.fromPrice = null
  filterStore.pickedValues.toPrice = null
  filterStore.pickedValues.category = 0
  filterStore.pickedValues.materials = []
  filterStore.pickedValues.seasons = []
  onSubmit()
}

const maxPrice = computed(() => {
  const products = toRaw(productStore.products)
  const prices = products.map((product) => product.price)
  return Math.max(...prices)
})
</script>

<template>
  <div v-if="filterStore.isFetching">Загрузка фильтра...</div>
  <div v-else-if="filterStore.hasFetchingError">
    <p>При загрузке фильтра произошла ошибка.</p>
    <button class="button button--primary" @click.prevent="getFilterData()">
      Попробовать<br />ещё раз
    </button>
  </div>
  <aside v-else class="filter">
    <form class="filter__form form" action="#" method="get" @submit.prevent="onSubmit">
      <fieldset class="form__block">
        <legend class="form__legend">Цена</legend>
        <label class="form__label form__label--price">
          <input
            v-model.number="filterStore.pickedValues.fromPrice"
            class="form__input"
            type="text"
            name="min-price"
            placeholder="0"
          />
          <span class="form__value">От</span>
        </label>
        <label class="form__label form__label--price">
          <input
            v-model.number="filterStore.pickedValues.toPrice"
            class="form__input"
            type="text"
            name="max-price"
            :placeholder="maxPrice"
          />
          <span class="form__value">До</span>
        </label>
      </fieldset>

      <fieldset class="form__block">
        <legend class="form__legend">Категория</legend>
        <label class="form__label form__label--select">
          <select v-model="filterStore.pickedValues.category" class="form__select" name="category">
            <option :value="0">Все категории</option>
            <option
              v-for="category of filterStore.categories"
              :key="category.id"
              :value="category.id"
            >
              {{ category.title }}
            </option>
          </select>
        </label>
      </fieldset>

      <fieldset class="form__block">
        <legend class="form__legend">Материал</legend>
        <ul class="check-list">
          <li v-for="material of filterStore.materials" :key="material.id" class="check-list__item">
            <label class="check-list__label">
              <input
                v-model="filterStore.pickedValues.materials"
                class="check-list__check sr-only"
                type="checkbox"
                name="material"
                :value="material.id"
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
          <li v-for="season of filterStore.seasons" :key="season.id" class="check-list__item">
            <label class="check-list__label">
              <input
                v-model="filterStore.pickedValues.seasons"
                class="check-list__check sr-only"
                type="checkbox"
                name="collection"
                :value="season.id"
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
      <button
        v-show="filterStore.hasPickedValues"
        class="filter__reset button button--second"
        type="button"
        @click.prevent="onReset"
      >
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
