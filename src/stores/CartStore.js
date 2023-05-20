import { defineStore } from 'pinia'
import { ref } from 'vue'
import { API_BASE_URL } from '../config'
import { useFetchAll } from '../composables/useFetchAll'

export const useCartStore = defineStore('cart', () => {
  const cartItems = ref([])
  const userAccessKey = ref(localStorage.getItem('moireUserAccessKey'))

  const isFetchingCart = ref(false)
  const hasCartFetchingError = ref(true)
  const isAddingProduct = ref(false)
  const isProductAdded = ref(false)
  const hasProductAddingError = ref(false)

  loadCartData()

  async function loadCartData() {
    isFetchingCart.value = true
    hasCartFetchingError.value = false

    const searchParams = [['userAccessKey', userAccessKey.value]]
    const url = new URL(`${API_BASE_URL}/baskets`)
    url.search = new URLSearchParams(searchParams)

    try {
      const [cartData] = await useFetchAll({ urls: [url] })
      cartItems.value = cartData.items
      if (!userAccessKey.value) {
        userAccessKey.value = cartData.user.accessKey
        localStorage.setItem('moireUserAccessKey', userAccessKey.value)
      }
    } catch {
      hasCartFetchingError.value = true
    }

    isFetchingCart.value = false
  }

  async function addItemToCart({ productId, colorId, sizeId, quantity }) {
    isAddingProduct.value = true
    hasProductAddingError.value = false
    isProductAdded.value = false

    const searchParams = [['userAccessKey', userAccessKey.value]]
    const url = new URL(`${API_BASE_URL}/baskets/products`)
    url.search = new URLSearchParams(searchParams)

    try {
      const [cartData] = await useFetchAll({
        urls: [url],
        method: 'POST',

        body: { productId, colorId, sizeId, quantity }
      })
      cartItems.value = cartData.items
      isProductAdded.value = true
    } catch (error) {
      hasProductAddingError.value = true
      console.log(error)
    }

    isAddingProduct.value = false
  }

  return {
    cartItems,
    isFetchingCart,
    hasCartFetchingError,
    isAddingProduct,
    isProductAdded,
    hasProductAddingError,
    addItemToCart
  }
})
