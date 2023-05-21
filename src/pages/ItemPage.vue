<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { useRoute } from 'vue-router'

import ColorsList from '../components/ColorsList.vue'
import ItemInfoTab from '../components/ItemInfoTab.vue'
import ItemDeliveryTab from '../components/ItemDeliveryTab.vue'
import BaseBreadcrumbs from '../components/BaseBreadcrumbs.vue'

import { API_BASE_URL } from '../config'
import { useCartStore } from '../stores/CartStore'
import { useFetchAll } from '../composables/useFetchAll'
import { useNumberFormat } from '../composables/useNumberFormat'
import BaseCounter from '../components/BaseCounter.vue'

const route = useRoute()
const cartStore = useCartStore()

const product = reactive({})

const isFetchingProduct = ref(false)
const hasFetchingProductError = ref(true)

getProductData()

const pickedData = reactive({
  colorIndex: 0,
  sizeIndex: 0,
  quantity: 1
})

const pics = computed(() =>
  isFetchingProduct.value ? null : product.colors[pickedData.colorIndex].gallery
)
const zoomedInPicIndex = ref(0)
const zoomedInPicUrl = computed(() =>
  !pics.value ? null : pics.value[zoomedInPicIndex.value].file.url
)

watch(
  () => pickedData.quantity,
  (value) => {
    if (value < 1) {
      pickedData.quantity = 1
    }
  }
)

const breadcrumbItems = reactive([
  {
    title: 'Каталог',
    routeName: 'catalog'
  },
  {
    title: computed(() => product.category?.title),
    query: computed(() => ({
      category: product.category?.id
    })),
    routeName: 'catalog'
  },
  {
    title: computed(() => product.title),
    routeName: ''
  }
])

const descrTabs = {
  'Информация о товаре': ItemInfoTab,
  'Доставка и возврат': ItemDeliveryTab
}
const descrTab = ref('Информация о товаре')

async function getProductData() {
  isFetchingProduct.value = true
  hasFetchingProductError.value = false

  const url = `${API_BASE_URL}/products/${route.params.id}`
  try {
    const [productData] = await useFetchAll({ urls: [url] })
    Object.assign(product, productData)
  } catch (error) {
    hasFetchingProductError.value = true
    console.log(error)
  }

  isFetchingProduct.value = false
}

function onSubmit() {
  cartStore.addItemToCart({
    productId: product.id,
    colorId: product.colors[pickedData.colorIndex].color.id,
    sizeId: product.sizes[pickedData.sizeIndex].id,
    quantity: pickedData.quantity
  })
}

function setZoomedInPic(index) {
  zoomedInPicIndex.value = index
}
</script>

<template>
  <main class="content container">
    <div v-if="isFetchingProduct">Загрузка информации о товаре...</div>
    <div v-else-if="hasFetchingProductError">
      <p>При загрузке произошла ошибка.</p>
      <button class="button button--primary" @click.prevent="getProductData()">
        Попробовать<br />ещё раз
      </button>
    </div>

    <template v-else>
      <div class="content__top">
        <BaseBreadcrumbs :items="breadcrumbItems"></BaseBreadcrumbs>
      </div>

      <section class="item">
        <div class="item__pics pics">
          <div class="pics__wrapper">
            <img width="570" height="570" :src="zoomedInPicUrl" :alt="product.title" />
          </div>
          <ul class="pics__list">
            <li v-for="(pic, index) of pics" :key="pic" class="pics__item">
              <a
                href="#"
                class="pics__link pics__link--current"
                @click.prevent="setZoomedInPic(index)"
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
                <BaseCounter v-model="pickedData.quantity"></BaseCounter>
                <b class="item__price"> {{ useNumberFormat(product.price) }} ₽ </b>
              </div>

              <div class="item__row">
                <fieldset class="form__block">
                  <legend class="form__legend">Цвет</legend>
                  <ColorsList v-model="pickedData.colorIndex" :colors="product.colors"></ColorsList>
                </fieldset>

                <fieldset class="form__block">
                  <legend class="form__legend">Размер</legend>
                  <label class="form__label form__label--small form__label--select">
                    <select v-model="pickedData.sizeIndex" class="form__select" name="category">
                      <option v-for="(size, index) of product.sizes" :key="size" :value="index">
                        {{ size.title }}
                      </option>
                    </select>
                  </label>
                </fieldset>
              </div>

              <button
                class="item__button button button--primary"
                type="submit"
                @click.prevent="onSubmit"
              >
                В корзину
              </button>
              <span v-if="cartStore.loading.itemAdd">Товар добавляется...</span>
              <span v-else-if="cartStore.errors.itemAdd">Произошла ошибка, попробуйте позднее</span>
              <span v-else-if="cartStore.isItemAdded">Товар добавлен успешно!</span>
            </form>
          </div>
        </div>

        <div class="item__desc">
          <ul class="tabs">
            <li v-for="(_, name) in descrTabs" :key="name" class="tabs__item">
              <a
                :class="{ 'tabs__link--current': descrTab === name }"
                class="tabs__link"
                href="#"
                @click.prevent="descrTab = name"
              >
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
@import '../styles/tabs';
@import '../styles/pics';
.item {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 55px 30px;
  align-items: flex-start;
}

.item__code {
  font-size: 14px;
  line-height: 1;
  color: $text-light;
}

.item__title {
  margin: 10px 0 22px;

  font-size: 40px;
  line-height: 50px;
  font-weight: 400;
}

.item__price {
  display: block;

  font-weight: 500;
  font-size: 40px;
  line-height: 1;
}

.item__sizes {
  color: #898989;
}

.item__row {
  display: grid;
  grid-template-columns: repeat(2, auto);
  grid-gap: 20px;
  justify-content: flex-start;

  &--center {
    align-items: center;
  }
}

.item__desc {
  grid-column: 1/-1
}

.item__content {
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

.item__button {
  min-width: 200px;;
}
</style>
