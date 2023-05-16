import { defineStore } from 'pinia'
import { computed, reactive, ref } from 'vue'
import { API_BASE_URL } from '../config'

export const useProductStore = defineStore('products', () => {
  const params = reactive({})
  const products = ref([])
  const isFetching = ref(false)
  const fetchingError = ref(true)
  const productsCount = computed(() => products.value.length)

  async function fill() {
    isFetching.value = true

    const searchParams = []
    for (const key in params) {
      const value = params[key]
      if (value) {
        if (Array.isArray(value)) value.map((item) => searchParams.push([key, item]))
        else searchParams.push([key, value])
      }
    }

    const url = new URL(`${API_BASE_URL}/products`)
    url.search = new URLSearchParams(searchParams)

    products.value = await fetch(url)
      .then((response) => response.json())
      .then((parsedRes) => parsedRes.items)

    isFetching.value = false
  }

  return { params, products, isFetching, fetchingError, productsCount, fill }
})
