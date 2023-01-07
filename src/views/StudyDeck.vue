<template>
  <v-container>
    <div class="mx-auto" style="max-width: 800px;">
      <v-overlay v-model="loadingOverlay" scrim="black" class="align-center justify-center">
        <v-progress-circular
          indeterminate
          size="64"
          color="primary"
        ></v-progress-circular>
      </v-overlay>
      
      <div class="d-flex justify-space-between align-center">
        <h1 class="text-h5 text-sm-h4 font-weight-bold my-10">Studying {{ deckname }}</h1>
        <v-btn variant="outlined" prepend-icon="mdi-arrow-left" class="text-capitalize" v-bind:to="{ name: 'CardDecks' }">Back</v-btn>
      </div>
      <div class="w-75 mx-auto mt-10">
        <p class="text-h6 text-center text-grey">Click/Tap the card to reveal the answer</p>
      </div>
      
      <v-row class="d-flex flex-column">
        <v-col class="d-flex flex-column align-center justify-center fill-height">
          <div
            class="ma-6 flipcard"
            v-on:click="isflipped = !isflipped"
            v-bind:class="{ isflipped: isflipped }"
          >
            <div class="card-container">
              <div class="cardface cardface-front">
                <p class="text-h6 text-black font-weight-medium">{{ currentCard.question }}</p>
                <p class="text-h6 text-uppercase text-blue-lighten-2 text-center">Question</p>
              </div>
              <div class="cardface cardface-back">
                <p class="text-body-1 font-weight-medium text-black">{{ currentCard.answer }}</p>
                <p class="text-h6 text-uppercase text-green-lighten-2 text-center">Answer</p>
              </div>
            </div>
          </div>
          <p class="text-h6">{{ noOfCardsStudied }} / {{ totalCardsLength }} <span class="mx-2">Cards Studied</span></p>
        </v-col>
        <v-col class="d-flex flex-column justify-center align-center">
          <div class="mt-5">
            <v-btn 
              variant="outlined" 
              class="mx-2 text-capitalize text-red" 
              width="110px"
              v-bind:loading="nFLoading"
              v-on:click="notFamiliar(currentCard)">Not Familiar</v-btn>
            <v-btn 
              variant="outlined" 
              class="mx-2 text-capitalize text-orange" 
              width="85px"
              v-bind:loading="nSLoading"
              v-on:click="notSure(currentCard)">Not Sure</v-btn>
            <v-btn 
              variant="outlined"
              class="mx-2 text-capitalize text-green" 
              width="75px"
              v-bind:loading="fLoading"
              v-on:click="familiar(currentCard)">Familiar</v-btn>
          </div>
        </v-col>
      </v-row>
    </div>
    <v-overlay v-model="completeOverlay" scrim="black" class="justify-center align-center">
      <div style="max-width: 500px;">
        <v-card
          class="pa-6 mx-5">
          <p class="text-h6 font-weight-light text-center">Good job! You finished studying this deck!</p>
          <div class="d-flex justify-center mt-6">
            <v-btn variant="flat" class="text-capitalize" v-on:click="studyAgain()">Study Again</v-btn>
            <v-btn variant="flat" class="text-capitalize" v-on:click="finish()">Finish</v-btn>
          </div>
        </v-card>
      </div>
    </v-overlay>
  </v-container>
</template>

<script>
import axios from 'axios'

export default {
  props: ['deckname'],
  data () {
    return {
      loadingOverlay: false,
      completeOverlay: false,
      isflipped: false,
      nFLoading: false,
      nSLoading: false,
      fLoading: false,
      currentCard: {},
      totalCardsLength: 0,
      noOfCardsStudied: 0
    }
  },
  mounted() {
    this.loadCards()
  },
  methods: {
    loadCards() {
      this.totalCardsLength = this.$store.state.studyCards.cardCount()
      this.currentCard = this.$store.state.studyCards.pop()
    },
    notFamiliar(card) {
      card.familiarity -= 2
      if (card.familiarity < 0) {
        card.familiarity = 0
      }
      const updateCard_config = {
        headers: {
          "Authorization": this.$store.state.currentUser.signInUserSession.idToken.jwtToken
        }
      }
      const cardInfo = {
        "card": card
      }
      this.nFLoading = true
      axios.put('https://f4ng7av2s6.execute-api.ap-southeast-1.amazonaws.com/flashlearn-test/card-decks/study', cardInfo, updateCard_config)
        .then(() => {
          this.nFLoading = false
          this.$store.state.studyCards.insert(this.currentCard, 1)
          this.currentCard = this.$store.state.studyCards.pop()
        })
        .catch(error => {
          console.log(error)
        })
    },
    notSure(card) {
      card.familiarity -= 1
      if (card.familiarity < 0) {
        card.familiarity = 0
      }
      const updateCard_config = {
        headers: {
          "Authorization": this.$store.state.currentUser.signInUserSession.idToken.jwtToken
        }
      }
      const cardInfo = {
        "card": card
      }
      this.nSLoading = true
      axios.put('https://f4ng7av2s6.execute-api.ap-southeast-1.amazonaws.com/flashlearn-test/card-decks/study', cardInfo, updateCard_config)
        .then(() => {
          this.nSLoading = false
          this.$store.state.studyCards.insert(this.currentCard, 2)
          this.currentCard = this.$store.state.studyCards.pop()
        })
        .catch(error => {
          console.log(error)
        })
    },
    familiar(card) {
      card.familiarity += 2
      if (card.familiarity > 4) {
        card.familiarity = 4
      }
      const updateCard_config = {
        headers: {
          "Authorization": this.$store.state.currentUser.signInUserSession.idToken.jwtToken
        }
      }
      const cardInfo = {
        "card": card
      }
      this.fLoading = true
      axios.put('https://f4ng7av2s6.execute-api.ap-southeast-1.amazonaws.com/flashlearn-test/card-decks/study', cardInfo, updateCard_config)
        .then(() => {
          this.fLoading = false
          this.noOfCardsStudied ++
          if (this.$store.state.studyCards.isEmpty()) {
            this.completeOverlay = true
          }
          this.currentCard = this.$store.state.studyCards.pop()
        })
        .catch(error => {
          console.log(error)
        })
    },
    async studyAgain() {
      this.completeOverlay = false
      this.loadingOverlay = true
      await this.$store.dispatch("loadCards", this.$store.state.currentDeckID)
      this.loadCards()
      this.loadingOverlay = false
      this.noOfCardsStudied = 0
    },
    finish() {
      this.$router.push({ name: 'CardDecks' })
    }
  }

}
</script>

<style>

  .flipcard {
    background-color: transparent;
    height: 320px;
    width: 270px;
    perspective: 1000px;
    cursor: pointer;
  }

  .card-container {
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: 12px;
    transition: transform 0.6s;
    transform-style: preserve-3d;
    background-color: white;
  }

  .cardface-front {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: absolute;
    width: 100%;
    height: 100%;
    padding: 12px;
    -webkit-backface-visibility: hidden; /* Safari */
    backface-visibility: hidden;
  }

  .cardface-back {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: absolute;
    width: 100%;
    height: 100%;
    padding: 12px;
    -webkit-backface-visibility: hidden; /* Safari */
    backface-visibility: hidden;
    transform: rotateY(180deg);
  }

  .isflipped .card-container{
    transform: rotateY(180deg);
  }

</style>