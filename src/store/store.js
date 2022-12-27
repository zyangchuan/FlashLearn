import { createStore } from 'vuex'

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
    }
})