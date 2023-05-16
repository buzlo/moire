<script setup>
import { computed, ref, reactive, toRaw } from 'vue'
import { useProductStore } from '../stores/ProductStore'
import { API_BASE_URL } from '../config'
import { useFetchAll } from '../composables/useFetchAll'

const productStore = useProductStore()

const categories = ref([])
const materials = ref([])
const seasons = ref([])
const isFetching = ref(false)
const hasFetchingError = ref(true)

const picked = reactive({
  fromPrice: null,
  toPrice: null,
  category: 0,
  materials: [],
  seasons: []
})

getFilterData()

async function getFilterData() {
  isFetching.value = true
  hasFetchingError.value = false
  try {
    ;[categories.value, materials.value, seasons.value] = await useFetchAll(
      [`${API_BASE_URL}/productCategories`, `${API_BASE_URL}/materials`, `${API_BASE_URL}/seasons`],
      'items'
    )
  } catch {
    hasFetchingError.value = true
  }

  isFetching.value = false
}

function onSubmit() {
  productStore.params.categoryId = picked.category
  productStore.params['materialIds[]'] = toRaw(picked.materials)
  productStore.params['seasonIds[]'] = toRaw(picked.seasons)
  productStore.params.minPrice = picked.fromPrice
  productStore.params.maxPrice = picked.toPrice

  productStore.fill()
}

function onReset() {
  picked.fromPrice = null
  picked.toPrice = null
  picked.category = 0
  picked.materials = []
  picked.seasons = []
  onSubmit()
}

const maxPrice = computed(() => {
  const products = toRaw(productStore.products)
  const prices = products.map((product) => product.price)
  return Math.max(...prices)
})
</script>

<template>
  <div v-if="isFetching">Загрузка фильтра...</div>
  <div v-else-if="hasFetchingError">
    <p>При загрузке фильтра произошла ошибка.</p>
    <button @click.prevent="getFilterData()" class="button button--primary">
      Попробовать<br />ещё раз
    </button>
  </div>
  <aside v-else class="filter">
    <form @submit.prevent="onSubmit" class="filter__form form" action="#" method="get">
      <fieldset class="form__block">
        <legend class="form__legend">Цена</legend>
        <label class="form__label form__label--price">
          <input
            class="form__input"
            type="text"
            name="min-price"
            v-model.number="picked.fromPrice"
            placeholder="0"
          />
          <span class="form__value">От</span>
        </label>
        <label class="form__label form__label--price">
          <input
            class="form__input"
            type="text"
            name="max-price"
            v-model.number="picked.toPrice"
            :placeholder="maxPrice"
          />
          <span class="form__value">До</span>
        </label>
      </fieldset>

      <fieldset class="form__block">
        <legend class="form__legend">Категория</legend>
        <label class="form__label form__label--select">
          <select class="form__select" name="category" v-model="picked.category">
            <option :value="0">Все категории</option>
            <option v-for="category of categories" :value="category.id" :key="category.id">
              {{ category.title }}
            </option>
          </select>
        </label>
      </fieldset>

      <fieldset class="form__block">
        <legend class="form__legend">Материал</legend>
        <ul class="check-list">
          <li v-for="material of materials" class="check-list__item" :key="material.id">
            <label class="check-list__label">
              <input
                class="check-list__check sr-only"
                type="checkbox"
                name="material"
                :value="material.id"
                v-model="picked.materials"
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
          <li v-for="season of seasons" class="check-list__item" :key="season.id">
            <label class="check-list__label">
              <input
                class="check-list__check sr-only"
                type="checkbox"
                name="collection"
                :value="season.id"
                v-model="picked.seasons"
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
@import '../styles/form';
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
