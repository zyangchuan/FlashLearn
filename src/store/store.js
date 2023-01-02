import { createStore } from 'vuex'
import { Auth } from 'aws-amplify'
import VuexPersistence from 'vuex-persist'

const vuexLocal = new VuexPersistence({
  storage: window.localStorage
})

export const store = createStore ({
  plugins: [vuexLocal.plugin],
  state: {
    currentUser: null,
    isAuthenticated: false,
    currentDeckID: ""
  },
  mutations: {
    setCurrentUser (state, user) {
      state.currentUser = user
    },
    setAuthenticationState (state, bool) {
      state.isAuthenticated = bool
    },
    setCurrentDeckID (state, deckid) {
      state.currentDeckID = deckid
    }
  },
  actions: {
    getAuthentication (context) {
      Auth.currentAuthenticatedUser()
        .then (user => {
          context.commit("setCurrentUser", user)
          context.commit("setAuthenticationState", true)
        })
        .catch (error => {
          console.log(error)
        }) 
    }
  }
})