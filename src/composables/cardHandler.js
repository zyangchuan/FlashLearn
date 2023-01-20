import { ref } from "vue"
import { useStore } from "vuex"
import axios from 'axios'

const cardHandler = () => {
  const store = useStore()
  const cardQuestion = ref("")
  const cardAnswer = ref("")

  const deleteCard = async (cardID) => {
    const deleteCard_config = {
      headers: {
        "Authorization": store.state.currentUser.signInUserSession.idToken.jwtToken
      },
      params: {
        "deckid": store.state.currentDeckID,
        "cardid": cardID
      }
    }

    try {
      axios.delete('https://f4ng7av2s6.execute-api.ap-southeast-1.amazonaws.com/flashlearn-test/card-decks/edit-deck', deleteCard_config)
    } catch (error) {
      throw error
    }
  }

  const updateCard = async (cardID, cardQuestion, cardAnswer) => {
    const editCard_config = {
      headers: {
        "Authorization": store.state.currentUser.signInUserSession.idToken.jwtToken
      },
      params: {
        "deckid": store.state.currentDeckID,
        "cardid": cardID,
      }
    }

    const cardInfo = {
      "question": cardQuestion,
      "answer": cardAnswer
    }

    try {
      axios.put('https://f4ng7av2s6.execute-api.ap-southeast-1.amazonaws.com/flashlearn-test/card-decks/edit-deck', cardInfo, editCard_config)
    } catch (error) {
      throw error
    }
  }

  const createCard = async () => {
    const createCard_config = {
      headers: {
        "Authorization": store.state.currentUser.signInUserSession.idToken.jwtToken
      },
      params: {
        "deckid": store.state.currentDeckID,
      }
    }
    const cardInfo = {
      "question": cardQuestion.value,
      "answer": cardAnswer.value
    }

    try {
      axios.post('https://f4ng7av2s6.execute-api.ap-southeast-1.amazonaws.com/flashlearn-test/card-decks/edit-deck', cardInfo, createCard_config)
    } catch (error) {
      throw error
    }
  }

  return { cardQuestion, cardAnswer, deleteCard, updateCard, createCard }
}

export default cardHandler