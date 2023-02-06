<template>
  <v-container>
    <div class="mx-auto" style="max-width: 800px;">
      <v-overlay v-model="loadingOverlay" scrim="black" class="align-center justify-center">
        <v-progress-circular
          indeterminate
          size="64"
          color="primary"
        ></v-progress-circular>
      </v-overlay>
      
      <div class="d-flex justify-space-between align-center">
        <h1 class="text-h5 text-sm-h4 font-weight-bold my-10">Studying {{ deckname }}</h1>
        <v-btn variant="outlined" prepend-icon="mdi-arrow-left" class="text-capitalize" v-bind:to="{ name: 'CardDecks' }">Back</v-btn>
      </div>
      <div class="w-75 mx-auto">
        <p class="text-h6 text-center text-grey">Click/Tap the card to reveal the answer</p>
      </div>
      
      <v-row class="d-flex flex-column">
        <v-col class="d-flex flex-column align-center justify-center fill-height">
          <FlashCard  :card="currentCard" size="large"/>
          <p class="text-body-1">{{ this.$store.state.studiedCount }} / {{ this.$store.state.studyCardsCount }} <span class="mx-2">Cards Studied</span></p>
        </v-col>
        <v-col>
          <p class="text-h6 text-center">How familiar are you with this card?</p>
        </v-col>
        <v-col class="d-flex flex-column justify-center align-center">
          <div>
            <v-btn 
              variant="outlined" 
              class="mx-2 text-capitalize text-red" 
              width="110px"
              v-bind:loading="nFLoading"
              v-on:click="studyDeckNotFamiliar()">Not Familiar</v-btn>
            <v-btn 
              variant="outlined" 
              class="mx-2 text-capitalize text-orange" 
              width="85px"
              v-bind:loading="nSLoading"
              v-on:click="studyDeckNotSure()">Not Sure</v-btn>
            <v-btn 
              variant="outlined"
              class="mx-2 text-capitalize text-green" 
              width="75px"
              v-bind:loading="fLoading"
              v-on:click="studyDeckFamiliar()">Familiar</v-btn>
          </div>
        </v-col>
      </v-row>
    </div>

    <PopUpPrompt ref="completePrompt">
      <template v-slot:message>
        Good job! You finished studying this deck!
      </template>
      <template v-slot:actions>
        <v-btn variant="flat" class="text-capitalize" v-on:click="studyDeckAgain()">Study Again</v-btn>
        <v-btn variant="flat" class="text-capitalize" v-on:click="finish()">Finish</v-btn>
      </template>
    </PopUpPrompt>
  </v-container>
</template>

<script>
import { onMounted, ref } from '@vue/runtime-core'
import FlashCard from "../components/FlashCard.vue"
import PopUpPrompt from "../components/PopUpPrompt.vue"
import studyHandler from "../composables/studyHandler"
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  props: ['deckname'],
  components: { FlashCard, PopUpPrompt },
  
  setup() {
    const router = useRouter()
    const store = useStore()
    const { currentCard, loadCard, notFamiliar, notSure, familiar, studyAgain } = studyHandler()

    onMounted(() => {
      loadCard()
    })

    const noOfCardsStudied = ref(0)
    const completeOverlay = ref(false)

    //data and methods for NotFamiliar
    const nFLoading = ref(false)
    const studyDeckNotFamiliar = async () => {
      nFLoading.value = true

      try {
        currentCard.value.isflipped = false
        await notFamiliar()
        nFLoading.value = false
      } catch (error) {
        console.log(error)
      }
    }

    //data and methods for NotSure
    const nSLoading = ref(false)
    const studyDeckNotSure = async () => {
      nSLoading.value = true

      try {
        currentCard.value.isflipped = false
        await notSure()
        nSLoading.value = false
      } catch (error) {
        console.log(error)
      }
    }

    //data and methods for Familiar
    const fLoading = ref(false)
    const completePrompt = ref()
    const studyDeckFamiliar = async () => {
      fLoading.value = true

      try {
        await familiar()
        fLoading.value = false
        store.commit("addStudiedCount")
        if (store.getters.deckIsEmpty) {
            completePrompt.value.show = true
        }
      } catch(error) {
        console.log(error)
      }
    }
    
    const loadingOverlay = ref(false)
    const studyDeckAgain = async () => {
      completePrompt.value.show = false
      loadingOverlay.value = true
      await studyAgain()
      loadCard()
      loadingOverlay.value = false
    }

    const finish = () => {
      router.push({name: "CardDecks"})
    }

    return { loadingOverlay, nFLoading, nSLoading, fLoading, currentCard, completePrompt, studyDeckNotFamiliar, studyDeckNotSure, studyDeckFamiliar, studyDeckAgain, finish}
  }
}
</script>
  