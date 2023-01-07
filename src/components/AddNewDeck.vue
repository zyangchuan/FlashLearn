<template>
  <div class="mx-auto" style="max-width: 500px;">
    <v-card
      title="Add a new card deck"
      class="py-4 px-sm-4 px-md-4 px-lg-4 mx-5 fill-width">

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
          model-value="deckname"
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
          model-value="descp"
          v-model="deckDesc">
        </v-textarea>

      </div>
      <div class="d-flex justify-end ml-5">
        <v-btn flat v-on:click="addDeck">Add</v-btn>
        <v-btn flat v-on:click="closeOverlay">Cancel</v-btn>
      </div> 
    </v-card>
  </div>
  
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
        .then(() => {
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