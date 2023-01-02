<template>
  <div class="mx-auto" style="max-width: 500px;">
    <v-card
      title="Create new card"
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
        <v-btn flat v-on:click="createCard">Create</v-btn>
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
      cardQuestion: "",
      cardAnswer: ""
    }
  },
  methods: {
    closeOverlay () {
      this.$emit('closeOverlay')
    },
    createCard () {
      this.$emit('closeOverlay')
      const createCard_config = {
        headers: {
          "Authorization": this.$store.state.currentUser.signInUserSession.idToken.jwtToken
        },
        params: {
          "deckid": this.$store.state.currentDeckID,
        }
      }
      const cardInfo = {
        "question": this.cardQuestion,
        "answer": this.cardAnswer
      }

      axios.post('https://f4ng7av2s6.execute-api.ap-southeast-1.amazonaws.com/flashlearn-test/card-decks/edit-deck', cardInfo, createCard_config)
        .then(() => {
          this.$emit("cardCreated")
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