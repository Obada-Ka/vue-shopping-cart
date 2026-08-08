import { createMemoryHistory, createRouter, type RouteRecordRaw } from 'vue-router'

import HelloWorld from '../components/HelloWorld.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: HelloWorld
  }
]

export const router = createRouter({
  history: createMemoryHistory(),
  routes
})
