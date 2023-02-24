import { ref } from "vue";
import { useStore } from "vuex";
import axios from "axios";

const decksHandler = () => {
  const store = useStore();
  const decks = ref([]);
  const deckName = ref("");
  const deckDesc = ref("");

  const loadDecks = async () => {
    const loadDecks_config = {
      headers: {
        Authorization:
          store.state.currentUser.signInUserSession.idToken.jwtToken,
      },
      params: {
        userid: store.state.currentUser.attributes.sub,
      },
    };

    try {
      const response = await axios.get(
        process.env.VUE_APP_API + "/card-decks",
        loadDecks_config
      );
      decks.value = response.data;
    } catch (error) {
      throw error;
    }
  };

  const createDeck = async () => {
    const addDeck_config = {
      headers: {
        Authorization:
          store.state.currentUser.signInUserSession.idToken.jwtToken,
      },
      params: {
        userid: store.state.currentUser.attributes.sub,
      },
    };

    const deckInfo = {
      deckname: deckName.value,
      descp: deckDesc.value,
    };

    try {
      return axios.post(
        process.env.VUE_APP_API + "/card-decks",
        deckInfo,
        addDeck_config
      );
    } catch (error) {
      throw error;
    }
  };

  return { decks, loadDecks, deckName, deckDesc, createDeck };
};

export default decksHandler;
