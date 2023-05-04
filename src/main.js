import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './pages/routes'
import './style.css'

const store = createPinia();
createApp(App).use(router).use(store).mount('#app')
