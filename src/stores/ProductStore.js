import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { API_BASE_URL } from '../config'

export const useProductStore = defineStore('products', () => {
  const products = ref([])
  const isFetching = ref(false)
  const fetchingError = ref(true)
  const productsCount = computed(() => products.value.length)

  async function fill(params) {
    isFetching.value = true
    const url = new URL(`${API_BASE_URL}/products`)
    url.search = new URLSearchParams(params)

    products.value = await fetch(url)
      .then((response) => response.json())
      .then((parsedRes) => parsedRes.items)
    isFetching.value = false
  }

  return { products, isFetching, fetchingError, productsCount, fill }
})
