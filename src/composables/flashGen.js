import { ref } from "vue";
import { useStore } from "vuex";
import axios from "axios";

const flashGen = () => {
  const store = useStore();
  const flashGenText = ref("");

  const generateCards = async () => {
    const flashGen_config = {
      headers: {
        Authorization:
          store.state.currentUser.signInUserSession.idToken.jwtToken,
      },
      params: {
        deckid: store.state.currentDeckID,
      },
    };
    const text = {
      text: flashGenText.value,
    };
    try {
      return axios.post(
        process.env.VUE_APP_API + "/card-decks/edit-deck/flashgen",
        text,
        flashGen_config
      );
    } catch (error) {
      throw error;
    }
  };

  return { flashGenText, generateCards };
};

export default flashGen;
