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
      <div class="w-75 mx-auto">
        <p class="text-h6 text-center text-grey">Click/Tap the card to reveal the answer</p>
      </div>
      
      <v-row class="d-flex flex-column">
        <v-col class="d-flex flex-column align-center justify-center fill-height">
          <FlashCard  :card="currentCard" size="large"/>
          <p class="text-body-1">{{ this.$store.state.studiedCount }} / {{ this.$store.state.studyCardsCount }} <span class="mx-2">Cards Studied</span></p>
        </v-col>
        <v-col>
          <p class="text-h6 text-center">How familiar are you with this card?</p>
        </v-col>
        <v-col class="d-flex flex-column justify-center align-center">
          <div>
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

    <PopUpPrompt ref="completePrompt">
      <template v-slot:message>
        Good job! You finished studying this deck!
      </template>
      <template v-slot:actions>
        <v-btn variant="flat" class="text-capitalize" v-on:click="studyAgain()">Study Again</v-btn>
        <v-btn variant="flat" class="text-capitalize" v-on:click="finish()">Finish</v-btn>
      </template>
    </PopUpPrompt>
  </v-container>
</template>

<script>
import axios from 'axios'
import FlashCard from "../components/FlashCard.vue"
import PopUpPrompt from "../components/PopUpPrompt.vue"
export default {
  props: ['deckname'],
  components: { FlashCard, PopUpPrompt },
  data () {
    return {
      loadingOverlay: false,
      nFLoading: false,
      nSLoading: false,
      fLoading: false,
      currentCard: {}
    }
  },
  mounted() {
    this.loadCards()
  },
  methods: {
    loadCards() {
      this.currentCard = this.$store.getters.getCurrentCard
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
          this.$store.commit("popCard")
          this.currentCard.isflipped = false
          this.$store.commit("insertCard", {card: this.currentCard, noOfCardsAfter: 1})
          this.currentCard = this.$store.getters.getCurrentCard
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
          this.$store.commit("popCard")
          this.currentCard.isflipped = false
          this.$store.commit("insertCard", {card: this.currentCard, noOfCardsAfter: 2})
          this.currentCard = this.$store.getters.getCurrentCard
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
          this.$store.commit("popCard")
          if (this.$store.getters.deckIsEmpty) {
            this.$refs.completePrompt.show = true
          } else {
            this.$store.commit("addStudiedCount")
            this.currentCard = this.$store.getters.getCurrentCard
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    async studyAgain() {
      this.$refs.completePrompt.show = false
      this.loadingOverlay = true
      await this.$store.dispatch("loadCards", this.$store.state.currentDeckID)
      this.loadCards()
      this.loadingOverlay = false
      this.$store.commit("resetStudiedCount")
    },
    finish() {
      this.$router.push({ name: 'CardDecks' })
    }
  }
}
</script>