import { defineStore } from 'pinia'
import { computed, reactive, ref } from 'vue'
import { API_BASE_URL } from '../config'
import { useFetchAll } from '../composables/useFetchAll'

export const useFilterStore = defineStore('filterData', () => {
  const categories = ref([])
  const materials = ref([])
  const seasons = ref([])
  const isFetching = ref(false)
  const fetchingError = ref(true)
  const categoriesCount = computed(() => categories.value.length)

  const picked = reactive({
    fromPrice: null,
    toPrice: null,
    category: 0,
    materials: [],
    seasons: []
  })

  async function fill() {
    isFetching.value = true
    ;[categories.value, materials.value, seasons.value] = await useFetchAll([
      `${API_BASE_URL}/productCategories`,
      `${API_BASE_URL}/materials`,
      `${API_BASE_URL}/seasons`,
    ], 'items')

    isFetching.value = false
  }

  return {
    categories,
    materials,
    seasons,
    isFetching,
    fetchingError,
    categoriesCount,
    picked,
    fill
  }
})
