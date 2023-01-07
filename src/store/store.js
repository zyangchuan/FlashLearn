import { createStore } from 'vuex'
import { Auth } from 'aws-amplify'
import VuexPersistence from 'vuex-persist'
import { cardStack } from '../functions/cardstack.js'

const vuexLocal = new VuexPersistence({
  storage: window.localStorage
})

export const store = createStore ({
  plugins: [vuexLocal.plugin],
  state: {
    currentUser: null,
    currentDeckID: "",
    studyCards: null
  },
  mutations: {
    setCurrentUser (state, user) {
      state.currentUser = user
    },
    setCurrentDeckID (state, deckid) {
      state.currentDeckID = deckid
    },
    createCardStack (state, cards) {
      state.studyCards = new cardStack(cards)
    }
  },
  actions: {
    getAuthentication (context) {
      Auth.currentAuthenticatedUser()
        .then (user => {
          context.commit("setCurrentUser", user)
        })
        .catch (error => {
          console.log(error)
        }) 
    }
  }
})
