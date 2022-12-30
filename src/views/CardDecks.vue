<template>
  
    <v-container>
      <h1 class="text-h4 font-weight-bold my-10">Card Decks</h1>
      <div class="d-flex flex-xl-row flex-lg-row flex-md-row flex-sm-row flex-column align-center flex-wrap">
        <div class="addcard pa-14 ma-4" v-on:mouseover="addcardcolor = '#c0ffff'" v-on:mouseleave="addcardcolor = '#55ffff'"
          v-on:click="addoverlay = !addoverlay">

          <p class="addcardtext text-h5 font-weight-light text-center mt-6">Add a new card deck</p>
          <v-overlay v-model="addoverlay" scrim="black" class="justify-center align-center">
            <AddNewDeck v-on:closeOverlay="addoverlay = false" v-on:deckAdded="loadDecks"/>
          </v-overlay>

        </div>
        
        <v-card class="pa-6 ma-4 rounded-xl" color="white" width="230" height="260" v-for="deck in decks"
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
                  <v-btn icon="mdi-play" color="black" size="small" v-bind="props">
                  </v-btn>
                </template>
              </v-tooltip>

              <v-tooltip text="Edit" location="top">
                <template v-slot:activator="{ props }">
                  <v-btn icon="mdi-pencil" color="black" size="small" class="mx-3" v-bind="props"></v-btn>
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
import Navbar from "../components/Navbar.vue"
import AddNewDeck from "../components/AddNewDeck.vue"
import axios from 'axios'

export default {
  components: { Navbar, AddNewDeck },
  data() {
    return {
      username: "",
      decks: [],
      addcardcolor: "#00ffff",
      addoverlay: false,
      msg: ""
    }
  },
  created() {
    if (!this.$store.state.isAuthenticated) {
      this.$router.push({ name: "Signin" })
    } else {
      console.log(this.$store.state.currentUser)
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
        },
      }
      axios.get('https://f4ng7av2s6.execute-api.ap-southeast-1.amazonaws.com/flashlearn-test/card-decks', loadDecks_config)
        .then(response => {
          this.decks = response.data
          console.log(response.data)
        })
        .catch(error => {
          console.log(error)
        })
    }
  }
}

</script>

<style>
.addcard {
  width: 230px;
  height: 260px;
  border: 2px dashed v-bind(addcardcolor);
  border-radius: 24px;
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