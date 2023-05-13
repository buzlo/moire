<script setup>
import { useProductStore } from '../stores/ProductStore'
import { useInflectNoun } from '../composables/useInflectNoun'
import CatalogFilter from '../components/CatalogFilter.vue';
import ProductItem from '../components/ProductItem.vue'
const productStore = useProductStore()
productStore.fill()
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
      <CatalogFilter></CatalogFilter>
      <div v-if="productStore.isFetching">Загрузка...</div>
      <section v-else class="catalog">
        <ul class="catalog__list">
          <ProductItem
            v-for="product of productStore.products"
            :product="product"
            :key="product.id"
          ></ProductItem>
        </ul>

        <ul class="catalog__pagination pagination">
          <li class="pagination__item">
            <a
              class="pagination__link pagination__link--arrow pagination__link--disabled"
              aria-label="Предыдущая страница"
            >
              <svg width="8" height="14" fill="currentColor">
                <use xlink:href="#icon-arrow-left"></use>
              </svg>
            </a>
          </li>
          <li class="pagination__item">
            <a class="pagination__link pagination__link--current"> 1 </a>
          </li>
          <li class="pagination__item">
            <a class="pagination__link" href="#"> 2 </a>
          </li>
          <li class="pagination__item">
            <a class="pagination__link" href="#"> 3 </a>
          </li>
          <li class="pagination__item">
            <a class="pagination__link" href="#"> 4 </a>
          </li>
          <li class="pagination__item">
            <a class="pagination__link" href="#"> ... </a>
          </li>
          <li class="pagination__item">
            <a class="pagination__link" href="#"> 10 </a>
          </li>
          <li class="pagination__item">
            <a
              class="pagination__link pagination__link--arrow"
              href="#"
              aria-label="Следующая страница"
            >
              <svg width="8" height="14" fill="currentColor">
                <use xlink:href="#icon-arrow-right"></use>
              </svg>
            </a>
          </li>
        </ul>
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

  &__list {
    @include ulres;

    display: grid;
    grid-template-columns: repeat(3, 270px);
    grid-gap: 65px 30px;
    margin-bottom: 70px;
  }

  &__pic {
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

  &__title {
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

  &__price {
    display: block;
    margin-bottom: 10px;

    font-size: 18px;
    line-height: 24px;
    font-weight: 500;
  }

  &__pagination {
    margin-top: auto;
  }
}
</style>
