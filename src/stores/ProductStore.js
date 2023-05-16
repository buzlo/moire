import { defineStore } from 'pinia'
import { computed, reactive, ref } from 'vue'
import { API_BASE_URL } from '../config'
import { useFetchAll } from '../composables/useFetchAll'

export const useProductStore = defineStore('products', () => {
  const params = reactive({})
  const products = ref([])
  const isFetching = ref(false)
  const hasFetchingError = ref(true)
  const productsCount = computed(() => products.value.length)

  async function fill() {
    isFetching.value = true
    hasFetchingError.value = false

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

    try {
      [products.value] = await useFetchAll([url], 'items')
    } catch {
      hasFetchingError.value = true
    }

    isFetching.value = false
  }

  return { params, products, isFetching, hasFetchingError, productsCount, fill }
})
