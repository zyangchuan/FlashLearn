import { ref } from "vue";
import { useStore } from "vuex";
import axios from "axios";

const cardHandler = () => {
  const store = useStore();
  const cardQuestion = ref("");
  const cardAnswer = ref("");

  const deleteCard = async (cardID) => {
    const deleteCard_config = {
      headers: {
        Authorization:
          store.state.currentUser.signInUserSession.idToken.jwtToken,
      },
      params: {
        deckid: store.state.currentDeckID,
        cardid: cardID,
      },
    };

    try {
      return axios.delete(
        process.env.VUE_APP_API + "/card-decks/edit-deck",
        deleteCard_config
      );
    } catch (error) {
      throw error;
    }
  };

  const updateCard = async (cardID, cardQuestion, cardAnswer) => {
    const editCard_config = {
      headers: {
        Authorization:
          store.state.currentUser.signInUserSession.idToken.jwtToken,
      },
      params: {
        deckid: store.state.currentDeckID,
        cardid: cardID,
      },
    };

    const cardInfo = {
      question: cardQuestion,
      answer: cardAnswer,
    };

    try {
      return axios.put(
        process.env.VUE_APP_API + "/card-decks/edit-deck",
        cardInfo,
        editCard_config
      );
    } catch (error) {
      throw error;
    }
  };

  const createCard = async () => {
    const createCard_config = {
      headers: {
        Authorization:
          store.state.currentUser.signInUserSession.idToken.jwtToken,
      },
      params: {
        deckid: store.state.currentDeckID,
      },
    };
    const cardInfo = {
      question: cardQuestion.value,
      answer: cardAnswer.value,
    };

    try {
      return axios.post(
        process.env.VUE_APP_API + "/card-decks/edit-deck",
        cardInfo,
        createCard_config
      );
    } catch (error) {
      throw error;
    }
  };

  return { cardQuestion, cardAnswer, deleteCard, updateCard, createCard };
};

export default cardHandler;
