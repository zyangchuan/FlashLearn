<template>
  <div class="mx-auto" style="max-width: 500px;">
    <v-card
      title="Edit deck details"
      class="py-4 px-sm-4 px-md-4 px-lg-4 mx-5">

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
        <v-btn flat v-on:click="editDeck">Apply</v-btn>
        <v-btn flat v-on:click="closeOverlay">Cancel</v-btn>
      </div> 
    </v-card>
  </div>
  
</template>

<script>
import axios from 'axios'

export default {
  props: [ 'deckname', 'descp' ],
  data () {
    return {
      deckName: this.deckname,
      deckDesc: this.descp
    }
  },
  methods: {
    closeOverlay () {
      this.$emit('closeOverlay')
    },
    editDeck () {
      this.$emit('closeOverlay')
      const editDeck_config = {
        headers: {
          "Authorization": this.$store.state.currentUser.signInUserSession.idToken.jwtToken
        },
        params: {
          "deckid": this.$store.state.currentDeckID
        }
      }
      const deckInfo = {
        "deckname": this.deckName,
        "descp": this.deckDesc
      }

      axios.put('https://f4ng7av2s6.execute-api.ap-southeast-1.amazonaws.com/flashlearn-test/card-decks', deckInfo, editDeck_config)
        .catch(error => {
          console.log(error)
        })
      this.$emit("deckEdited")
    }
  }
}
</script>

<style>

</style>