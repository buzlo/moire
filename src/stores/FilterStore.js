import { defineStore } from 'pinia'
import { computed, reactive, ref } from 'vue'
import { API_BASE_URL } from '../config'

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
    ;[categories.value, materials.value, seasons.value] = await Promise.all([
      fetch(`${API_BASE_URL}/productCategories`),
      fetch(`${API_BASE_URL}/materials`),
      fetch(`${API_BASE_URL}/seasons`)
    ])
      .then(async (responses) => await Promise.all(responses.map((response) => response.json())))
      .then((parsedResponses) => parsedResponses.map((parsedResponse) => parsedResponse.items))
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
