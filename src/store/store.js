import { createStore } from 'vuex'
import { Auth } from 'aws-amplify'

export const store = createStore ({
  state: {
    currentUser: null,
    isAuthenticated: false
  },
  mutations: {
    setCurrentUser (state, user) {
      state.currentUser = user
    },
    setAuthenticationState (state, bool) {
      state.isAuthenticated = bool
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