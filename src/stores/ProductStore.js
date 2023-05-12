import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useProductStore = defineStore('products', () => {
  const products = ref([])
  const isFetching = ref(false)
  const fetchingError = ref(true)
  const productsCount = computed(() => products.value.length)

  async function fill() {
    isFetching.value = true
    products.value = await fetch('https://vue-moire.skillbox.cc/api/products')
      .then((response) => response.json())
      .then((parsedRes) => parsedRes.items)
    isFetching.value = false
  }

  return { products, isFetching, fetchingError, productsCount, fill }
})
