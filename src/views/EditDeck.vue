<template>
  <v-container>
    <div class="d-flex justify-space-between align-center">
      <h1 class="text-h5 text-sm-h4 font-weight-bold my-10">Edit Card Deck</h1>
      <v-btn variant="outlined" prepend-icon="mdi-arrow-left" class="text-capitalize" v-bind:to="{ name: 'CardDecks' }">Back</v-btn>
    </div>

    <v-overlay v-model="deleteDeckOverlay" scrim="black" class="justify-center align-center">
      <div style="max-width: 500px;">
        <v-card
          class="pa-6 mx-5">
          <p class="text-h6 font-weight-light text-center">Are you sure you want to delete this card deck?</p>
          <div class="d-flex justify-end mt-6">
            <v-btn variant="flat" class="text-red" v-on:click="deleteDeck">Yes, Delete</v-btn>
            <v-btn variant="flat" v-on:click="deleteDeckOverlay = false">No, Keep it</v-btn>
          </div>
        </v-card>
      </div>
    </v-overlay>

    <v-overlay v-model="editDeckOverlay" scrim="black" class="justify-center align-center editdeckdetails">
      <EditDeckDetails 
        v-on:closeOverlay="editDeckOverlay = false" 
        v-on:deckEdited="loadNewDeck"
        v-bind:deckname="deckname"
        v-bind:descp="deck_descp"/>
    </v-overlay>

    <v-overlay v-model="editCardOverlay" scrim="black" class="justify-center align-center editcard">
      <EditCard 
        v-on:closeOverlay="editCardOverlay = false" 
        v-on:cardUpdated="loadDeck"
        v-bind:cardid="editCardID"
        v-bind:question="editCardQuestion"
        v-bind:answer="editCardAnswer"/>
    </v-overlay>

    <v-overlay v-model="deleteCardOverlay" scrim="black" class="justify-center align-center">
      <div style="max-width: 500px;">
        <v-card
          class="pa-6 mx-5">
          <p class="text-h6 font-weight-light text-center">Are you sure you want to delete this card?</p>
          <div class="d-flex justify-end mt-6">
            <v-btn variant="flat" class="text-red" v-on:click="deleteCard(deleteCardID)">Yes, Delete</v-btn>
            <v-btn variant="flat" v-on:click="deleteCardOverlay = false">No, Keep it</v-btn>
          </div>
        </v-card>
      </div>
    </v-overlay>

    <v-overlay v-model="loadingOverlay" scrim="black" class="align-center justify-center">
      <v-progress-circular
        indeterminate
        size="64"
        color="primary"
      ></v-progress-circular>
    </v-overlay>

    <v-card elevation="0">
      <v-card class="pa-6 pa-sm-8 mb-n2 fill-width rounded-lg" color="rgb(50, 50, 50)" elevation="10">
        <div class="d-flex flex-column flex-sm-row justify-space-between">
          <div class="w-sm-75">
            <p class="text-h5 text-sm-h4 font-weight-medium">{{ deckname }}</p>
            <p class="text-body-1 text-sm-h6 text-grey my-4">{{ deck_descp }}</p>
          </div>

          <div class="d-flex flex-sm-column  justify-center">
            <v-btn 
              class="mx-5 mb-sm-5 text-capitalize"
              variant="outlined" 
              color="red" 
              width="130"
              prepend-icon="mdi-trash-can-outline"
              v-on:click="deleteDeckOverlay = true">
              Delete Deck
            </v-btn>
            <v-btn 
              class="mx-5 text-capitalize"
              variant="outlined" 
              color="blue" 
              width="130"
              prepend-icon="mdi-pencil"
              v-on:click="editDeckOverlay = true">
              Edit Details
            </v-btn>
          </div>


        </div>
      </v-card>
      
      <v-sheet
        class="mx-auto mt-10"
      >
        <p class="text-body-1 text-sm-h6 text-center text-grey">Click/Tap the card to reveal the answer</p>
        <v-slide-group
          class="pb-4 pa-4"
        >
          <v-slide-group-item
            v-for="card in cards"
            :key="card.cardid"
          >
            <div class="d-flex flex-column align-center">
              <div
                class="ma-4 flipcard"
                v-on:click="card.isflipped = !card.isflipped"
                v-bind:class="{ isflipped: card.isflipped }"
              >
                <div class="card-container">
                  <div class="cardface-front">
                    <p class="text-h6 text-black">{{ card.question }}</p>
                    <p class="text-body-1 text-uppercase text-blue-lighten-2 text-center">Questions</p>
                  </div>
                  <div class="cardface-back">
                    <p class="text-body-1 font-weight-medium text-black">{{ card.answer }}</p>
                    <p class="text-body-1 text-uppercase text-green-lighten-2 text-center">Answer</p>
                  </div>
                </div>
              </div>

              <div>
                <v-chip class="mx-2 text-red" v-on:click="goDeleteCard(card.cardid)" link>Delete</v-chip>
                <v-chip class="mx-2 text-blue" v-on:click="goEditCard(card.cardid, card.question, card.answer)" link>Edit</v-chip>
              </div>
            </div>
              
          </v-slide-group-item>
        </v-slide-group>

        <v-divider class="my-4"></v-divider>

        <v-overlay v-model="createCardOverlay" scrim="black" class="justify-center align-center createcard">
          <CreateCard 
            v-on:closeOverlay="createCardOverlay = false" 
            v-on:cardCreated="loadDeck"/>
        </v-overlay>

        <v-overlay v-model="flashGenOverlay" scrim="black" class="justify-center align-center flashgen">
          <FlashGen 
            v-on:closeOverlay="flashGenOverlay = false" 
            v-on:flashGenDone="loadDeck"/>
        </v-overlay>

        <div class="my-5 d-flex flex-start align-center justify-center">
          <v-btn 
            variant="outlined" 
            prepend-icon="mdi-plus" 
            class="text-capitalize" 
            width="130"
            v-on:click="createCardOverlay = true"
          >
            Create card
          </v-btn>
          <span class="mx-6">Or</span>
          <v-btn 
            variant="outlined" 
            prepend-icon="mdi-flash" 
            class="text-yellow-lighten-2 text-capitalize" 
            width="120"
            v-on:click="flashGenOverlay = true">FlashGen</v-btn>
        </div>
      </v-sheet>
    </v-card>
    
    
  </v-container>
</template>

<script>
import axios from 'axios'
import EditDeckDetails from "../components/EditDeckDetails.vue"
import EditCard from "../components/EditCard.vue"
import CreateCard from "../components/CreateCard.vue"
import FlashGen from "../components/FlashGen.vue"

export default {
  props: ['deckname'],
  components: { EditDeckDetails, EditCard, CreateCard, FlashGen },
  data() {
    return {
      deck_descp: "",
      deleteDeckOverlay: false,
      deleteCardOverlay: false,
      editDeckOverlay: false,
      editCardOverlay: false,
      createCardOverlay: false,
      flashGenOverlay: false,
      loadingOverlay: true,
      deleteCardID: "",
      editCardID: "",
      editCardQuestion: "",
      editCardAnswer: "",
      cards: [],
      deckInfo: {},
      test1: 'test1',
      test2: 'test2'

    }
  },
  methods: {
    loadNewDeck (newname) {
      this.$router.push({ name: "EditDeck", params: { deckname: newname } })
    },
    loadDeck () {
      const loadDeck_config = {
        headers: {
            "Authorization": this.$store.state.currentUser.signInUserSession.idToken.jwtToken
          },
          params: {
            "deckid": this.$store.state.currentDeckID
          }
      }

      axios.get('https://f4ng7av2s6.execute-api.ap-southeast-1.amazonaws.com/flashlearn-test/card-decks/edit-deck', loadDeck_config)
        .then(response => {
          this.deck_descp = response.data.descp
          this.cards = response.data.cards
          this.loadingOverlay = false
        })
        .catch(error => {
          console.log(error)
        })
    },
    deleteDeck() {
      const deleteDeck_config = {
        headers: {
          "Authorization": this.$store.state.currentUser.signInUserSession.idToken.jwtToken
        },
        params: {
          "userid": this.$store.state.currentUser.attributes.sub,
          "deckid": this.$store.state.currentDeckID
        }
      }
      axios.delete('https://f4ng7av2s6.execute-api.ap-southeast-1.amazonaws.com/flashlearn-test/card-decks', deleteDeck_config)
        .catch(error => {
          console.log(error)
        })

      this.deleteDeckOverlay = false
      this.$router.push({ name: 'CardDecks' })
    },
    goDeleteCard (cardid) {
      this.deleteCardOverlay = true
      this.deleteCardID = cardid
    },
    goEditCard (cardid, question, answer) {
      this.editCardOverlay = true
      this.editCardID = cardid
      this.editCardQuestion = question
      this.editCardAnswer = answer
    },
    deleteCard (cardid) {
      const deleteCard_config = {
        headers: {
          "Authorization": this.$store.state.currentUser.signInUserSession.idToken.jwtToken
        },
        params: {
          "deckid": this.$store.state.currentDeckID,
          "cardid": cardid
        }
      }
      axios.delete('https://f4ng7av2s6.execute-api.ap-southeast-1.amazonaws.com/flashlearn-test/card-decks/edit-deck', deleteCard_config)
        .then(() => {
          this.deleteCardOverlay = false
          this.loadDeck()
        })
        .catch(error => {
          console.log(error)
        })
    }
  },
  created() {
    this.loadDeck()
  }
}
</script>
<style>
  .createcard > .v-overlay__content  {
    width: 100%;
  }

  .editdeckdetails > .v-overlay__content  {
    width: 100%;
  }

  .editcard > .v-overlay__content  {
    width: 100%;
  }

  .flashgen > .v-overlay__content  {
    width: 100%;
  }
</style>
<style scoped>

.flipcard {
    background-color: transparent;
    height: 320px;
    width: 270px;
    perspective: 1000px;
  }

  .card-container {
    position: relative;
    width: 100%;
    height: 100%;
    transition: transform 0.6s;
    transform-style: preserve-3d;;
  }

  .cardface-back, .cardface-front  {
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: absolute;
    width: 100%;
    height: 100%;
    padding: 12px;
    backface-visibility: hidden;
    background-color: white;
  }

  .isflipped .card-container{
    transform: rotateY(180deg);
  }

  .cardface-back {
    transform: rotateY(180deg);
  }

</style>