import { ref } from "vue"
import { useStore } from "vuex"
import axios from 'axios'

const flashGen = () => {
  const store = useStore()
  const flashGenText = ref("")

  const generateCards = async () => {
    const flashGen_config = {
      headers: {
        "Authorization": store.state.currentUser.signInUserSession.idToken.jwtToken
      },
      params: {
        "deckid": store.state.currentDeckID
      },
    }
    const text = {
        "text": flashGenText.value
      }
    try {
      await axios.post('https://f4ng7av2s6.execute-api.ap-southeast-1.amazonaws.com/flashlearn-test/card-decks/edit-deck/flashgen', text, flashGen_config)
    } catch (error) {
      throw error
    }
  }

  return { flashGenText, generateCards }
}

export default flashGen