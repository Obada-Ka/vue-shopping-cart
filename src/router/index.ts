import { createMemoryHistory, createRouter, type RouteRecordRaw } from 'vue-router'

import ShoppingCartPage from '../pages/ShoppingCartPage.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: ShoppingCartPage
  }
]

export const router = createRouter({
  history: createMemoryHistory(),
  routes
})
