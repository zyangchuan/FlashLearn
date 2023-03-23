import axios from "axios";
import { ref } from "vue";
import { useStore } from "vuex";

const studyHandler = () => {
  const store = useStore();
  const currentCard = ref({});

  const loadCard = () => {
    currentCard.value = store.getters.getCurrentCard;
    console.log(currentCard);
  };

  const notFamiliar = async () => {
    currentCard.value.familiarity -= 2;
    if (currentCard.value.familiarity < 0) {
      currentCard.value.familiarity = 0; // prevent negative value
    }

    const updateCard_config = {
      headers: {
        Authorization:
          store.state.currentUser.signInUserSession.idToken.jwtToken,
      },
    };
    const cardInfo = {
      card: currentCard.value,
    };

    try {
      store.commit("popCard");
      store.commit("insertCard", {
        card: currentCard.value,
        noOfCardsAfter: 1,
      });
      currentCard.value = store.getters.getCurrentCard;
      return axios.put(
        process.env.VUE_APP_API + "/card-decks/study",
        cardInfo,
        updateCard_config
      );
    } catch (error) {
      throw error;
    }
  };

  const notSure = async () => {
    currentCard.value.familiarity -= 1;
    if (currentCard.value.familiarity < 0) {
      currentCard.value.familiarity = 0;
    }

    const updateCard_config = {
      headers: {
        Authorization:
          store.state.currentUser.signInUserSession.idToken.jwtToken,
      },
    };
    const cardInfo = {
      card: currentCard.value,
    };
    try {
      store.commit("popCard");
      store.commit("insertCard", {
        card: currentCard.value,
        noOfCardsAfter: 2,
      });
      currentCard.value = store.getters.getCurrentCard;
      return axios.put(
        process.env.VUE_APP_API + "/card-decks/study",
        cardInfo,
        updateCard_config
      );
    } catch (error) {
      throw error;
    }
  };

  const familiar = async () => {
    currentCard.value.familiarity += 2;
    if (currentCard.value.familiarity > 4) {
      currentCard.value.familiarity = 4;
    }

    const updateCard_config = {
      headers: {
        Authorization:
          store.state.currentUser.signInUserSession.idToken.jwtToken,
      },
    };
    const cardInfo = {
      card: currentCard.value,
    };
    try {
      store.commit("popCard");
      if (!store.getters.deckIsEmpty) {
        currentCard.value = store.getters.getCurrentCard;
      }
      return axios.put(
        process.env.VUE_APP_API + "/card-decks/study",
        cardInfo,
        updateCard_config
      );
    } catch (error) {
      throw error;
    }
  };
  const studyAgain = async () => {
    store.commit("resetStudiedCount");
    return store.dispatch("loadCards", store.state.currentDeckID);
  };

  return { currentCard, loadCard, notFamiliar, notSure, familiar, studyAgain };
};

export default studyHandler;
