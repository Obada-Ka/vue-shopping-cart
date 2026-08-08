import { createPinia } from 'pinia'
import { createApp } from 'vue'

import './assets/styles/main.css'
import App from './App.vue'
import { router } from './router/index.ts'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.mount('#app')
