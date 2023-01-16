<template>
  <div class="mx-auto" style="max-width: 500px;">
    <v-card
      title="FlashGen"
      class="py-4 px-sm-4 px-md-4 px-lg-4 mx-5 fill-width">

      <div class="mx-7 my-5">
        <p class="text-h6 font-weight-light mb-8">Paste your notes into the box below to generate flash cards automatically.</p>
        <p class="caption
          font-weight-light
          mb-2"
        >
          Copy and paste your text here:
        </p>

        <v-textarea 
          label="Copy and paste your text here"
          clearable
          clear-icon="mdi-close-circle"
          v-model="text"
        >
        </v-textarea>

      </div>
      <div class="d-flex justify-end ml-5">
        <v-btn flat v-bind:loading="generating" v-on:click="genCards" class="text-yellow-lighten-2">Generate cards</v-btn>
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
      text: "",
      generating: false
    }
  },
  methods: {
    closeOverlay () {
      this.$emit('closeOverlay')
    },
    genCards () {
      const flashGen_config = {
        headers: {
          "Authorization": this.$store.state.currentUser.signInUserSession.idToken.jwtToken
        },
        params: {
          "deckid": this.$store.state.currentDeckID
        },
      }
      const text = {
          "text": this.text,
        }

      this.generating = true
      axios.post('https://f4ng7av2s6.execute-api.ap-southeast-1.amazonaws.com/flashlearn-test/card-decks/edit-deck/flashgen', text, flashGen_config)
        .then(response => {
          this.$emit("flashGenDone")
          this.generating = false
          this.$emit('closeOverlay')
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