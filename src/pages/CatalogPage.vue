<script setup>
import { ref, computed } from 'vue'
import { useProductStore } from '../stores/ProductStore'
import { useInflectNoun } from '../composables/useInflectNoun'
import CatalogFilter from '../components/CatalogFilter.vue'
import ProductItem from '../components/ProductItem.vue'
import BasePagination from '../components/BasePagination.vue'

const productStore = useProductStore()

const page = ref(1)
const perPage = ref(6)

const pagesQty = computed(() => Math.ceil(productStore.products.length / perPage.value))
const currentPageProducts = computed(() => {
  const computedValue = []
  const startIndex = (page.value - 1) * perPage.value
  const endIndex = startIndex + perPage.value
  for (let i = startIndex; i < endIndex; i++) {
    computedValue.push(productStore.products[i])
    if (i === productStore.products.length - 1) break
  }
  return computedValue
})
</script>

<template>
  <main class="content container">
    <div class="content__top">
      <div class="content__row">
        <h1 class="content__title">Каталог</h1>
        <span class="content__info">
          {{ productStore.productsCount }}
          {{ useInflectNoun(productStore.productsCount, ['товар', 'товара', 'товаров']) }}
        </span>
      </div>
    </div>

    <div class="content__catalog">
      <CatalogFilter />
      <div v-if="productStore.isFetching">Загрузка товаров...</div>
      <div v-else-if="productStore.hasFetchingError">
        <p>При загрузке товаров произошла ошибка.</p>
        <button class="button button--primary" @click.prevent="productStore.fill()">
          Попробовать<br />ещё раз
        </button>
      </div>
      <section v-else class="catalog">
        <ul class="catalog__list">
          <ProductItem
            v-for="product of currentPageProducts"
            :key="product.id"
            :product="product"
          ></ProductItem>
        </ul>
        <BasePagination v-model="page" :pages-qty="pagesQty" />
      </section>
    </div>
  </main>
</template>

<style lang="scss" scoped>
@import '../styles/variables';
@import '../styles/mixins';

.catalog {
  display: flex;
  flex-direction: column;
  align-self: stretch;
}

.catalog__list {
  @include ulres;

  display: grid;
  grid-template-columns: repeat(3, 270px);
  grid-gap: 65px 30px;
  margin-bottom: 70px;
}

.catalog__pic {
  display: block;
  width: 270px;
  height: 350px;
  margin-bottom: 20px;

  img {
    width: 270px;
    height: 350px;
    object-fit: cover;
  }
}

.catalog__title {
  margin: 0 0 10px;

  font-weight: 400;
  font-size: 16px;
  line-height: 22px;
  color: $text-main;

  a {
    color: $text-main;
    transition: $transition;

    &:hover,
    &:focus {
      opacity: 0.6;
    }
  }
}

.catalog__price {
  display: block;
  margin-bottom: 10px;

  font-size: 18px;
  line-height: 24px;
  font-weight: 500;
}

.catalog__pagination {
  margin-top: auto;
}
</style>
