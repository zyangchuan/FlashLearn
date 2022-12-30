<template>
  <v-card
    width="500" 
    title="Add a new card deck"
    class="pa-5">

    <div class="mx-7 my-5">
      <p class="caption
      font-weight-light
      my-2">
      Deck name
      </p>

      <v-text-field 
          label="Deck name" 
          clearable
          clear-icon="mdi-close-circle"
          v-model="deckName">
      </v-text-field>

      <p class="caption
      font-weight-light
      mb-2 mt-5">
      Deck description
      </p>

      <v-textarea 
        label="Deck description"
        clearable
        clear-icon="mdi-close-circle"
        v-model="deckDesc">
      </v-textarea>

    </div>
    <div class="d-flex justify-end ml-5">
      <v-btn flat v-on:click="addDeck">Add</v-btn>
      <v-btn flat v-on:click="closeOverlay">Cancel</v-btn>
    </div> 
  </v-card>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      deckName: "",
      deckDesc: ""
    }
  },
  methods: {
    closeOverlay () {
      this.$emit('closeOverlay')
    },
    addDeck () {
      this.$emit('closeOverlay')
      const addDeck_config = {
        headers: {
          "Authorization": this.$store.state.currentUser.signInUserSession.idToken.jwtToken
        },
        params: {
          "userid": this.$store.state.currentUser.attributes.sub
        },
      }
      const deckInfo = {
          "deckname": this.deckName,
          "descp": this.deckDesc
        }

      axios.post('https://f4ng7av2s6.execute-api.ap-southeast-1.amazonaws.com/flashlearn-test/card-decks', deckInfo, addDeck_config)
        .then(response => {
          console.log(response)
          this.$emit("deckAdded")
        })
        .catch(error => {
          console.log(error)
        })
    }
  }
}
</script>

<style>

</style>