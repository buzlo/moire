import { defineStore } from 'pinia'
import { reactive } from 'vue'
import { API_BASE_URL } from '../config'
import { useFetchAll } from '../composables/useFetchAll'

export const useOrderStore = defineStore('order', () => {
  const orderData = reactive({})

  const loading = reactive({
    submit: false,
    data: false
  })

  const errors = reactive({
    submit: false,
    data: false
  })

  async function submitOrder(submitData, userAccessKey) {
    loading.submit = true
    errors.submit = false

    const searchParams = [['userAccessKey', userAccessKey]]
    const url = new URL(`${API_BASE_URL}/orders`)
    url.search = new URLSearchParams(searchParams)
    try {
      const [newOrderData] = await useFetchAll({
        urls: [url],
        method: 'POST',
        body: submitData
      })
      Object.assign(orderData, newOrderData)
    } catch (error) {
      errors.submit = true
      console.log(error)
    }

    loading.submit = false
  }

  async function loadOrderData(orderId, userAccessKey) {
    loading.data = true
    errors.data = false

    const searchParams = [['userAccessKey', userAccessKey]]
    const url = new URL(`${API_BASE_URL}/orders/${orderId}`)
    url.search = new URLSearchParams(searchParams)
    try {
      const [newOrderData] = await useFetchAll({
        urls: [url]
      })
      Object.assign(orderData, newOrderData)
    } catch (error) {
      errors.data = true
      console.log(error)
    }

    loading.data = false
  }

  return {
    orderData,
    loading,
    errors,
    submitOrder,
    loadOrderData
  }
})
