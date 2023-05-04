import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useProductStore = defineStore('products', () => {
  const products = ref([])

  async function fill() {
    products.value = await fetch('https://vue-moire.skillbox.cc/api/products').then(response => response.json()).then(parsedRes => parsedRes.items);
  }
  return { products, fill }
})
