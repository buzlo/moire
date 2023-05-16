<script setup>
import { ref, reactive, computed } from 'vue'
import { useRoute } from 'vue-router'
import ColorsList from '../components/ColorsList.vue'
import { API_BASE_URL } from '../config'
import { useFetchAll } from '../composables/useFetchAll'
import { useNumberFormat } from '../composables/useNumberFormat'
import ItemInfoTab from '../components/ItemInfoTab.vue'
import ItemDeliveryTab from '../components/ItemDeliveryTab.vue'

const route = useRoute()
const product = ref({})
const isFetching = ref(false)
const hasFetchingError = ref(true)
const qtyToAdd = ref(1)

getProductData()

const picked = reactive({
  colorIndex: 0,
  sizeIndex: 0
})

const pics = computed(() =>
  isFetching.value ? null : product.value.colors[picked.colorIndex].gallery
)
const zoomedInPicIndex = ref(0)
const zoomedInPicUrl = computed(() =>
  !pics.value ? null : pics.value[zoomedInPicIndex.value].file.url
)

const descrTabs = {
  'Информация о товаре': ItemInfoTab,
  'Доставка и возврат': ItemDeliveryTab
}
const descrTab = ref('Информация о товаре')

async function getProductData() {
  isFetching.value = true
  hasFetchingError.value = false

  const url = `${API_BASE_URL}/products/${route.params.id}`
  try {
    ;[product.value] = await useFetchAll([url])
  } catch {
    hasFetchingError.value = true
  }

  isFetching.value = false
}

function setZoomedInPic(index) {
  zoomedInPicIndex.value = index
}
</script>

<template>
  <main class="content container">
    <div v-if="isFetching">Загрузка товаров...</div>
    <div v-else-if="hasFetchingError">
      <p>При загрузке товаров произошла ошибка.</p>
      <button @click.prevent="getProductData()" class="button button--primary">
        Попробовать<br />ещё раз
      </button>
    </div>

    <template v-else>
      <div class="content__top">
        <ul class="breadcrumbs">
          <li class="breadcrumbs__item">
            <RouterLink :to="{ name: 'catalog' }" class="breadcrumbs__link" href="#">
              Каталог
            </RouterLink>
          </li>
          <li class="breadcrumbs__item">
            <a class="breadcrumbs__link" href="#"> {{ product.category.title }} </a>
          </li>
          <li class="breadcrumbs__item">
            <a class="breadcrumbs__link"> {{ product.title }} </a>
          </li>
        </ul>
      </div>

      <section class="item">
        <div class="item__pics pics">
          <div class="pics__wrapper">
            <img width="570" height="570" :src="zoomedInPicUrl" :alt="product.title" />
          </div>
          <ul class="pics__list">
            <li v-for="(pic, index) of pics" class="pics__item" :key="pic">
              <a
                @click.prevent="setZoomedInPic(index)"
                href="#"
                class="pics__link pics__link--current"
              >
                <img width="98" height="98" :src="pic.file.url" :alt="product.title" />
              </a>
            </li>
          </ul>
        </div>

        <div class="item__info">
          <span class="item__code">Артикул: {{ product.id }}</span>
          <h2 class="item__title">{{ product.title }}</h2>
          <div class="item__form">
            <form class="form" action="#" method="POST">
              <div class="item__row item__row--center">
                <div class="form__counter">
                  <button
                    @click="qtyToAdd -= 1"
                    type="button"
                    aria-label="Убрать один товар"
                    :disabled="qtyToAdd === 1"
                  >
                    <svg width="12" height="12" fill="currentColor">
                      <use xlink:href="#icon-minus"></use>
                    </svg>
                  </button>

                  <input type="text" v-model="qtyToAdd" name="count" />

                  <button @click="qtyToAdd += 1" type="button" aria-label="Добавить один товар">
                    <svg width="12" height="12" fill="currentColor">
                      <use xlink:href="#icon-plus"></use>
                    </svg>
                  </button>
                </div>

                <b class="item__price"> {{ useNumberFormat(product.price) }} ₽ </b>
              </div>

              <div class="item__row">
                <fieldset class="form__block">
                  <legend class="form__legend">Цвет</legend>
                  <ColorsList v-model="picked.colorIndex" :colors="product.colors"></ColorsList>
                </fieldset>

                <fieldset class="form__block">
                  <legend class="form__legend">Размер</legend>
                  <label class="form__label form__label--small form__label--select">
                    <select
                      v-model="picked.sizeIndex"
                      class="form__select"
                      type="text"
                      name="category"
                    >
                      <option v-for="(size, index) of product.sizes" :value="index" :key="size">
                        {{ size.title }}
                      </option>
                    </select>
                  </label>
                </fieldset>
              </div>

              <button class="item__button button button--primary" type="submit">В корзину</button>
            </form>
          </div>
        </div>

        <div class="item__desc">
          <ul class="tabs">
            <li v-for="(_, name) in descrTabs" class="tabs__item" :key="name">
              <a @click.prevent="descrTab = name" :class="{'tabs__link--current': descrTab === name}" class="tabs__link" href="#">
                {{ name }}
              </a>
            </li>
          </ul>

          <component :is="descrTabs[descrTab]"></component>
        </div>
      </section>
    </template>
  </main>
</template>

<style lang="scss" scoped>
@import '../styles/variables';
@import '../styles/content';
@import '../styles/form';
.item {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 55px 30px;
  align-items: flex-start;

  &__code {
    font-size: 14px;
    line-height: 1;
    color: $text-light;
  }

  &__title {
    margin: 10px 0 22px;

    font-size: 40px;
    line-height: 50px;
    font-weight: 400;
  }

  &__price {
    display: block;

    font-weight: 500;
    font-size: 40px;
    line-height: 1;
  }

  &__sizes {
    color: #898989;
  }

  &__row {
    display: grid;
    grid-template-columns: repeat(2, auto);
    grid-gap: 20px;
    justify-content: flex-start;

    &--center {
      align-items: center;
    }
  }

  &__desc {
    grid-column: 1/-1;
  }

  &__content {
    width: 595px;
    padding-top: 50px;

    h3 {
      margin: 25px 0 5px;

      font-size: 16px;
      line-height: 24px;
      font-weight: 500;
    }

    p {
      margin: 0 0 20px;

      font-size: 16px;
      line-height: 28px;
      color: $text-main;
      font-weight: 300;
    }

    a {
      border-bottom: 2px dashed $text-main;
      transition: $transition;

      font-size: 14px;
      line-height: 22px;
      color: $text-main;

      &:hover,
      &:focus {
        border-color: transparent;
      }
    }
  }

  &__button {
    min-width: 200px;
  }
}
</style>
