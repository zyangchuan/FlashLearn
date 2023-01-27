import { createStore } from 'vuex'
import { Auth } from 'aws-amplify'
import VuexPersistence from 'vuex-persist'
import axios from 'axios'

const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
  reducer: state => ({
    currentUser: state.currentUser
  })
})

const vuexSession = new VuexPersistence({
  storage: window.sessionStorage,
  reducer: state => ({
    currentDeckID: state.currentDeckID,
    studyCards: state.studyCards,
    studyCardsCount: state.studyCardsCount,
    studiedCount: state.studiedCount
  })
})

export const store = createStore ({
  plugins: [vuexLocal.plugin, vuexSession.plugin],
  state: {
    currentUser: null,
    currentDeckID: "",
    studyCards: [],
    studyCardsCount: 0,
    studiedCount: 0
  },
  getters: {
    isAuthenticated: state => state.currentUser !== null,
    deckIsEmpty: state => state.studyCards.length == 0,
    getCurrentCard: state => state.studyCards[state.studyCards.length - 1]
  },
  mutations: {
    setCurrentUser (state, user) {
      state.currentUser = user
    },
    setCurrentDeckID (state, deckid) {
      state.currentDeckID = deckid
    },
    createCardStack (state, cards) {
      state.studyCards = cards
      state.studyCardsCount = cards.length
    },
    addStudiedCount (state) {
      state.studiedCount ++
    },
    popCard (state) {
      return state.studyCards.pop()
    },
    insertCard (state, payload) {
      if (state.studyCards.length == 1) {
        state.studyCards.splice(0, 0, payload.card)
      }
      else if (state.studyCards.length == 0) {
        state.studyCards.push(payload.card)
      }
      else {
        state.studyCards.splice(state.studyCards.length - payload.noOfCardsAfter, 0, payload.card)
      }
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
