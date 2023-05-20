import { defineStore } from 'pinia'
import { computed, reactive, ref } from 'vue'
import { API_BASE_URL } from '../config'
import { useFetchAll } from '../composables/useFetchAll'

export const useFilterStore = defineStore('filterData', () => {
  const categories = ref([])
  const materials = ref([])
  const seasons = ref([])
  const isFetching = ref(false)
  const hasFetchingError = ref(true)

  const pickedValues = reactive({
    fromPrice: null,
    toPrice: null,
    category: 0,
    materials: [],
    seasons: []
  })
  const hasPickedValues = computed(() => {
    return Object.values(pickedValues).some((value) => {
      if (!Array.isArray(value)) return value

      return value.length > 0
    })
  })

  getFilterData()

  async function getFilterData() {
    isFetching.value = true
    hasFetchingError.value = false
    try {
      ;[categories.value, materials.value, seasons.value] = await useFetchAll(
        [
          `${API_BASE_URL}/productCategories`,
          `${API_BASE_URL}/materials`,
          `${API_BASE_URL}/seasons`
        ],
        'items'
      )
    } catch {
      hasFetchingError.value = true
    }

    isFetching.value = false
  }

  return {
    categories,
    materials,
    seasons,
    isFetching,
    hasFetchingError,
    pickedValues,
    hasPickedValues
  }
})
