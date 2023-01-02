import { createRouter, createWebHistory } from 'vue-router'
import Signin from '../views/Signin.vue'
import Signup from '../views/Signup.vue'
import CardDecks from '../views/CardDecks.vue'
import EditDeck from '../views/EditDeck.vue'
import Account from '../views/Account.vue'

const routes = [
  {
    path: '/',
    redirect: '/sign-in'
  },
  {
    path: '/sign-in',
    name: 'Signin',
    component: Signin
  },
  {
    path: '/sign-up',
    name: 'Signup',
    component: Signup
  },
  {
    path: '/card-decks',
    name: 'CardDecks',
    component: CardDecks,
  },
  {
    path: '/card-decks/edit-deck/:deckname',
    name: 'EditDeck',
    component: EditDeck,
    props: true
  },
  {
    path: '/account',
    name: 'Account',
    component: Account
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
