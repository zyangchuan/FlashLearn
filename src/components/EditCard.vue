<template>
  <div class="mx-auto" style="max-width: 500px;">
    <v-card
      title="Edit card"
      class="py-4 px-sm-4 px-md-4 px-lg-4 mx-5">

      <div class="mx-7 my-5">
        <p class="caption
          font-weight-light
          my-2">
          Question
        </p>

        <v-textarea 
          label="Question" 
          clearable
          clear-icon="mdi-close-circle"
          v-model="cardQuestion">
        </v-textarea>

        <p class="caption
          font-weight-light
          mb-2 mt-5">
          Answer
        </p>

        <v-textarea 
          label="Answer"
          clearable
          clear-icon="mdi-close-circle"
          v-model="cardAnswer">
        </v-textarea>

      </div>
      <div class="d-flex justify-end ml-5">
        <v-btn flat v-on:click="updateCard">Apply</v-btn>
        <v-btn flat v-on:click="closeOverlay">Cancel</v-btn>
      </div> 
    </v-card>
  </div>
  
</template>

<script>
import axios from 'axios'

export default {
  props: [ 'cardid', 'question', 'answer' ],
  data () {
    return {
      cardQuestion: this.question,
      cardAnswer: this.answer
    }
  },
  methods: {
    closeOverlay () {
      this.$emit('closeOverlay')
    },
    updateCard () {
      this.$emit('closeOverlay')
      const editCard_config = {
        headers: {
          "Authorization": this.$store.state.currentUser.signInUserSession.idToken.jwtToken
        },
        params: {
          "deckid": this.$store.state.currentDeckID,
          "cardid": this.cardid,
        }
      }
      const cardInfo = {
        "question": this.cardQuestion,
        "answer": this.cardAnswer
      }

      axios.put('https://f4ng7av2s6.execute-api.ap-southeast-1.amazonaws.com/flashlearn-test/card-decks/edit-deck', cardInfo, editCard_config)
        .catch(error => {
          console.log(error)
        })
      this.$emit("cardUpdated")
    }
  }
}
</script>

<style>

</style>