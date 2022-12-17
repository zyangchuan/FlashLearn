<template>
  <Navbar />
  <v-container>
    <h1 class="text-h4 font-weight-bold my-10">Card Decks</h1>
    <v-row wrap>
        
        <div 
          class="addcard pa-14"
          v-on:mouseover="addcardcolor = '#c0ffff'"
          v-on:mouseleave="addcardcolor = '#55ffff'"
          v-on:click="addoverlay = !addoverlay">
          
          <p class="addcardtext text-h5 font-weight-light text-center mt-6">Add a new card deck</p>
          <v-overlay 
            v-model="addoverlay" 
            scrim="black" 
            class="justify-center align-center">
            <AddNewDeck 
              v-on:closeOverlay="addoverlay = false"
              v-on:addDeck="addDeck"/>
          </v-overlay>
          
        </div>
      
        <v-card 
          class="pa-6 ma-4 rounded-xl"
          color="white"
          width="230"
          height="260"
          v-for="deck in decks"
          v-bind:key="deck.id">

          <div class="d-flex flex-column align-start justify-space-between fill-height">
            <div>
              <p class="text-h6 font-weight-bold">{{ deck.name }}</p>
              <v-btn variant="plain" class="pa-0"
              v-on:click="deck.descReveal = true">Description</v-btn>
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
            <v-card
              v-if="deck.descReveal"
              class="transition-fast-in-fast-out v-card--reveal"
            >
              <v-card-text class="ma-3">
                <p class="text-body-1">{{ deck.desc }}</p>
              </v-card-text>
              <v-card-actions class="ma-3">
                <v-btn
                  v-on:click="deck.descReveal = false"
                >
                  Close
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-expand-transition>
        </v-card>
      
    </v-row>
  </v-container>
</template>

<script>
import Navbar from "../components/Navbar.vue"
import AddNewDeck from "../components/AddNewDeck.vue"

export default {
    components: { Navbar, AddNewDeck },
    data () {
      return {
        deckCount: 5,
        decks: [
          {id: 1, name: "Physics definitions", no_of_cards: "29", desc: "A lot a lot of physics definitions", descReveal: false},
          {id: 2, name: "Biology definitions", no_of_cards: "50", desc: "A lot a lot of bio definitions", descReveal: false},
          {id: 3, name: "GP word bank", no_of_cards: "200", desc: "Make sure u add 5 everyday and learn 5 everyday", descReveal: false},
          {id: 4, name: "Econs", no_of_cards: "75", desc: "Make sure u add 5 everyday and learn 5 everyday", descReveal: false},
          {id: 5, name: "Computer science", no_of_cards: "69", desc: "I hate this deck go die", descReveal: false},
        ],
        addcardcolor: "#00ffff",
        addoverlay: false,
      }
    },
    methods: {
      addDeck (deckInfo) {
        this.deckCount++
        this.decks.push({id: this.deckCount, name: deckInfo.title, no_of_cards: 0, desc: deckInfo.desc, descReveal: false})
      }
    }
}
</script>

<style>
  .addcard {
    width: 230px;
    height: 260px;
    margin: 16px;
    border: 2px dashed v-bind(addcardcolor);
    border-radius: 24px;
    cursor: pointer;;
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