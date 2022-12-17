import { createRouter, createWebHistory } from 'vue-router'
import Signin from '../views/Signin.vue'
import Decks from '../views/Decks.vue'

const routes = [
  {
    path: '/',
    redirect: '/sign-in'
  },
  {
    path: '/sign-in',
    name: 'signin',
    component: Signin
  },
  {
    path: '/decks',
    name: 'Decks',
    component: Decks
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
