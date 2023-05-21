import { defineStore } from 'pinia'
import { ref, reactive, computed } from 'vue'
import { API_BASE_URL } from '../config'
import { useFetchAll } from '../composables/useFetchAll'
import { useCountTotal } from '../composables/useCountTotal'

export const useCartStore = defineStore('cart', () => {
  const items = ref([])
  const userAccessKey = ref(localStorage.getItem('moireUserAccessKey'))

  const isItemAdded = ref(false)

  const loading = reactive({
    cart: false,
    itemAdd: false,
    update: false
  })

  const errors = reactive({
    cart: true,
    itemAdd: false,
    update: false
  })

  const cartTotal = computed(() => useCountTotal(items.value))

  loadCartData()

  async function loadCartData() {
    loading.cart = true
    errors.cart = false

    const searchParams = [['userAccessKey', userAccessKey.value]]
    const url = new URL(`${API_BASE_URL}/baskets`)
    url.search = new URLSearchParams(searchParams)

    try {
      const [cartData] = await useFetchAll({ urls: [url] })
      items.value = cartData.items
      if (!userAccessKey.value) {
        userAccessKey.value = cartData.user.accessKey
        localStorage.setItem('moireUserAccessKey', userAccessKey.value)
      }
    } catch {
      errors.cart = true
    }

    loading.cart = false
  }

  async function addItemToCart({ productId, colorId, sizeId, quantity }) {
    loading.itemAdd = true
    errors.itemAdd = false
    isItemAdded.value = false

    const searchParams = [['userAccessKey', userAccessKey.value]]
    const url = new URL(`${API_BASE_URL}/baskets/products`)
    url.search = new URLSearchParams(searchParams)

    try {
      const [cartData] = await useFetchAll({
        urls: [url],
        method: 'POST',

        body: { productId, colorId, sizeId, quantity }
      })
      items.value = cartData.items
      isItemAdded.value = true
    } catch (error) {
      errors.itemAdd = true
      console.log(error)
    }

    loading.itemAdd = false
  }

  async function deleteCartItem(id) {
    loading.update = true
    errors.update = false

    const searchParams = [['userAccessKey', userAccessKey.value]]
    const url = new URL(`${API_BASE_URL}/baskets/products`)
    url.search = new URLSearchParams(searchParams)

    try {
      const [cartData] = await useFetchAll({
        urls: [url],
        method: 'DELETE',

        body: { basketItemId: id }
      })
      items.value = cartData.items
    } catch (error) {
      errors.update = true
      console.log(error)
    }

    loading.update = false
  }

  async function updateCartItem(id, qty) {
    loading.update = true
    errors.update = false

    const searchParams = [['userAccessKey', userAccessKey.value]]
    const url = new URL(`${API_BASE_URL}/baskets/products`)
    url.search = new URLSearchParams(searchParams)

    try {
      const [cartData] = await useFetchAll({
        urls: [url],
        method: 'PUT',

        body: { basketItemId: id, quantity: qty }
      })
      items.value = cartData.items
    } catch (error) {
      errors.update = true
      console.log(error)
    }

    loading.update = false
  }

  return {
    items,
    loading,
    errors,
    isItemAdded,
    cartTotal,
    addItemToCart,
    deleteCartItem,
    updateCartItem
  }
})
