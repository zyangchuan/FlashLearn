import { createStore } from 'vuex'
import { Auth } from 'aws-amplify'
import VuexPersistence from 'vuex-persist'
import { cardStack } from '../functions/cardstack.js'
import axios from 'axios'

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
  getters: {
    isAuthenticated: state => state.currentUser !== null
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
    setAuthentication (context) {
      Auth.currentAuthenticatedUser()
        .then (user => {
          context.commit("setCurrentUser", user)
        })
        .catch (error => {
          console.log(error)
        }) 
    },
    async loadCards (context, deckid) {
      const loadCards_config = {
        headers: {
          "Authorization": context.state.currentUser.signInUserSession.idToken.jwtToken
        },
        params: {
          "deckid": deckid
        }
      }
      return axios.get('https://f4ng7av2s6.execute-api.ap-southeast-1.amazonaws.com/flashlearn-test/card-decks/study', loadCards_config)
        .then((response) => {
          context.commit("setCurrentDeckID", deckid)
          context.commit("createCardStack", response.data)
        })
        .catch((error) => {
          console.log(error)
        })

    }
  }
})
