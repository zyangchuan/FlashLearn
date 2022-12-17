<template>
  <Navbar />
  <v-container>
    <h1 class="text-h4 font-weight-bold my-10">Card Decks</h1>
    <v-row wrap>
        <div 
          class="addcard pa-14"
          v-on:mouseover="addcardcolor = '#c0ffff'"
          v-on:mouseleave="addcardcolor = '#55ffff'">
            <p class="addcardtext text-h5 font-weight-light text-center mt-6">Add a new card deck</p>
        </div>
      
        <v-card 
          class="pa-6 ma-4 rounded-xl"
          color="white"
          width="230"
          height="260"
          v-for="card in cards"
          v-bind:key="card.id">
          <div class="d-flex flex-column align-start justify-space-between fill-height">
            <p class="text-h6 font-weight-bold">{{ card.name }}</p>
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
        </v-card>
      
    </v-row>
  </v-container>
</template>

<script>
import Navbar from "../components/Navbar.vue"

export default {
    components: { Navbar },
    data () {
      return {
        cards: [
          {id: 1, name: "Physics definitions", no_of_cards: "29"},
          {id: 2, name: "Biology definitions", no_of_cards: "50"},
          {id: 3, name: "GP word bank", no_of_cards: "200"},
          {id: 4, name: "Econs", no_of_cards: "75"},
          {id: 5, name: "Computer science", no_of_cards: "69"},
        ],
        addcardcolor: "#00ffff"
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
</style>