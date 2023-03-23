import { ref } from "vue";
import { useStore } from "vuex";
import axios from "axios";

const deckHandler = () => {
  const store = useStore();
  const deckID = store.state.currentDeckID;
  const deckName = ref("");
  const deckDesc = ref("");

  const editDeckName = ref("");
  const editDeckDesc = ref("");

  const cards = ref([]);

  const loadDeck = async () => {
    const loadDeck_config = {
      headers: {
        Authorization:
          store.state.currentUser.signInUserSession.idToken.jwtToken,
      },
      params: {
        deckid: deckID,
      },
    };

    try {
      const response = await axios.get(
        process.env.VUE_APP_API + "/card-decks/edit-deck",
        loadDeck_config
      );
      deckName.value = response.data.deckname;
      deckDesc.value = response.data.descp;
      cards.value = response.data.cards;
    } catch (error) {
      throw error;
    }
  };

  const deleteDeck = async () => {
    const deleteDeck_config = {
      headers: {
        Authorization:
          store.state.currentUser.signInUserSession.idToken.jwtToken,
      },
      params: {
        userid: store.state.currentUser.attributes.sub,
        deckid: store.state.currentDeckID,
      },
    };

    try {
      return axios.delete(
        process.env.VUE_APP_API + "/card-decks",
        deleteDeck_config
      );
    } catch (error) {
      throw error;
    }
  };

  const updateDeck = async () => {
    const editDeck_config = {
      headers: {
        Authorization:
          store.state.currentUser.signInUserSession.idToken.jwtToken,
      },
      params: {
        deckid: store.state.currentDeckID,
      },
    };
    const deckInfo = {
      deckname: editDeckName.value,
      descp: editDeckDesc.value,
    };

    try {
      const newDeckInfo = await axios.put(
        process.env.VUE_APP_API + "/card-decks",
        deckInfo,
        editDeck_config
      );
      deckName.value = newDeckInfo.data.deckname;
      deckDesc.value = newDeckInfo.data.descp;
    } catch (error) {
      throw error;
    }
  };

  return {
    deckName,
    deckDesc,
    cards,
    loadDeck,
    deleteDeck,
    editDeckName,
    editDeckDesc,
    updateDeck,
  };
};

export default deckHandler;
