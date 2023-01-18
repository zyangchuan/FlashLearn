import { ref } from "vue"
import { useStore } from "vuex"
import axios from 'axios'

export const decksLoader = () => {
  const store = useStore()
  const decks = ref([])

  const loadDecks = async () => {

    const loadDecks_config = {
      headers: {
        "Authorization": store.state.currentUser.signInUserSession.idToken.jwtToken
      },
      params: {
        "userid": store.state.currentUser.attributes.sub
      }
    }

    try {
      const response = await axios.get('https://f4ng7av2s6.execute-api.ap-southeast-1.amazonaws.com/flashlearn-test/card-decks', loadDecks_config)
      decks.value = response.data
    } catch (error) {
      throw error
    }
  }

  return { decks, loadDecks }
}

export const deckCreator = () => {
  const store = useStore()
  const deckName = ref("")
  const deckDesc = ref("")

  const createDeck = async () => {
    const addDeck_config = {
      headers: {
        "Authorization": store.state.currentUser.signInUserSession.idToken.jwtToken
      },
      params: {
        "userid": store.state.currentUser.attributes.sub
      }
    }
  
    const deckInfo = {
      "deckname": deckName.value,
      "descp": deckDesc.value
    }

    try {
      await axios.post('https://f4ng7av2s6.execute-api.ap-southeast-1.amazonaws.com/flashlearn-test/card-decks', deckInfo, addDeck_config)
    } catch (error) {
      throw error
    }
  }

  return {deckName, deckDesc, createDeck}
}