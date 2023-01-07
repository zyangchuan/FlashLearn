<template>
  
    <v-container>
      <h1 class="text-h5 text-sm-h4 text-md-h4 text-lg-h4 font-weight-bold my-10">Card Decks</h1>
      <div class="d-flex flex-xl-row flex-lg-row flex-md-row flex-sm-row flex-column align-center flex-wrap">
        <v-overlay v-model="loadingOverlay" scrim="black" class="align-center justify-center">
          <v-progress-circular
            indeterminate
            size="64"
            color="primary"
          ></v-progress-circular>
        </v-overlay>

        <v-overlay v-model="noCardOverlay" scrim="black" class="justify-center align-center">
          <div style="max-width: 500px;">
            <v-card
              class="pa-6 mx-5">
              <p class="text-h6 font-weight-light text-center">This deck does not have any cards</p>
              <div class="d-flex flex-column align-center mt-6">
                <v-btn variant="flat" class="text-capitalize" v-on:click="goEditDeck(editdeck)">Go Create Cards</v-btn>
                <v-btn variant="flat" class="text-capitalize" v-on:click="closeNoCardOverlay()">Close</v-btn>
              </div>
            </v-card>
          </div>
        </v-overlay>
        
        <div class="addcard pa-14 ma-4" v-on:mouseover="addcardcolor = '#c0ffff'" v-on:mouseleave="addcardcolor = '#55ffff'"
          v-on:click="addoverlay = true">

          <p class="addcardtext text-h5 font-weight-light text-center mt-6">Add a new card deck</p>
          <v-overlay v-model="addoverlay" scrim="black" class="justify-center align-center addnewdeck">
            <AddNewDeck
              v-on:closeOverlay="addoverlay = false" 
              v-on:deckAdded="loadDecks"/>
          </v-overlay>
        </div>
        
        <v-card class="pa-6 ma-4 rounded-lg" color="white" width="230" height="260" v-for="deck in decks"
          v-bind:key="deck.deckid">

          <div class="d-flex flex-column 
            align-start
            justify-space-between fill-height">
            <div>
              <p class="text-h6 font-weight-bold">{{ deck.deckname }}</p>
              <v-btn variant="plain" class="pa-0" v-on:click="deck.descReveal = true">Description</v-btn>
            </div>

            <div>

              <v-tooltip text="Study" location="top">
                <template v-slot:activator="{ props }">
                  <v-btn icon="mdi-play" color="black" 
                    size="small" v-bind="props" :loading="deck.playLoading"
                    v-on:click="goStudyDeck(deck)">
                  </v-btn>
                </template>
              </v-tooltip>

              <v-tooltip text="Edit" location="top">
                <template v-slot:activator="{ props }">
                  <v-btn icon="mdi-pencil" color="black" 
                    size="small" class="mx-3" 
                    v-bind="props" v-on:click="goEditDeck(deck)"></v-btn>
                </template>
              </v-tooltip>
            </div>
          </div>

          <v-expand-transition>
            <v-card v-if="deck.descReveal" class="transition-fast-in-fast-out v-card--reveal">
              <v-card-text class="ma-3">
                <p class="text-body-1">{{ deck.descp }}</p>
              </v-card-text>
              <v-card-actions class="ma-3">
                <v-btn v-on:click="deck.descReveal = false">
                  Close
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-expand-transition>
        </v-card>
      </div>
      
    </v-container>
 
  
</template>

<script>
import AddNewDeck from "../components/AddNewDeck.vue"
import axios from 'axios'

export default {
  components: { AddNewDeck },
  data() {
    return {
      username: "",
      decks: [],
      editdeck: {},
      addcardcolor: "#00ffff",
      addoverlay: false,
      noCardOverlay: false,
      loadingOverlay: true,
      msg: ""
    }
  },
  mounted() {
    if (!this.$store.state.currentUser) {
      this.$router.push({ name: "Signin" })
    } else {
      this.username = this.$store.state.currentUser.attributes.preferred_username
    }

    this.loadDecks() //load all the decks when the page first renders

  },
  methods: {
    loadDecks() {
      const loadDecks_config = {
        headers: {
          "Authorization": this.$store.state.currentUser.signInUserSession.idToken.jwtToken
        },
        params: {
          "userid": this.$store.state.currentUser.attributes.sub
        }
      }
      axios.get('https://f4ng7av2s6.execute-api.ap-southeast-1.amazonaws.com/flashlearn-test/card-decks', loadDecks_config)
        .then(response => {
          this.decks = response.data
          this.loadingOverlay = false
        })
        .catch(error => {
          console.log(error)
        })
    },
    goEditDeck(deck) {
      this.$store.commit('setCurrentDeckID', deck.deckid)
      this.$router.push({ name: 'EditDeck', params: { deckname: deck.deckname } })
    },
    async goStudyDeck(deck) {
      deck.playLoading = true
      await this.$store.dispatch("loadCards", deck.deckid)
      if (this.$store.state.studyCards.cardCount() == 0) {
        this.playLoading = false
        this.openNoCardOverlay(deck)
      } else {
        this.$router.push({ name: 'StudyDeck', params: { deckname: deck.deckname } })
      }
    },
    openNoCardOverlay (deck) {
      this.noCardOverlay = true
      this.editdeck = deck
    },
    closeNoCardOverlay () {
      this.noCardOverlay = false
      this.editdeck.playLoading = false
    }
  }
}

</script>

<style>
.addnewdeck > .v-overlay__content  {
  width: 100%;
}

.addcard {
  width: 230px;
  height: 260px;
  border: 2px dashed v-bind(addcardcolor);
  border-radius: 12px;
  cursor: pointer;
}

.addcardtext {
  color: v-bind(addcardcolor);
  user-select: none;
}

.v-card--reveal {
  bottom: 0;
  right: 0;
  position: absolute;
  height: 100%;
  width: 100%;
}
</style>