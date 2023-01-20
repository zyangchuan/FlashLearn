<template>
  <v-container>
    <h1 class="my-10 text-h5 text-sm-h4 font-weight-bold">Card Decks</h1>
    <v-overlay v-model="loadingDecksOverlay" scrim="black" class="justify-center align-center">
      <v-progress-circular
        indeterminate
        size="64"
        color="primary"
      ></v-progress-circular>
    </v-overlay>
    
    <PopUpPrompt ref="noCardPrompt">
      <template v-slot:message>
        This deck does not have any cards.
      </template>
      <template v-slot:actions>
        <v-btn
          class="text-capitalize mx-2"
          color="white"
          variant="text"
          v-on:click="goEditDeck(noCardDeck)"
        >
          Go Create
        </v-btn>
        <v-btn
          class="text-capitalize mx-2"
          color="white"
          variant="text"
          v-on:click="noCardPrompt.show = false"
        >
          Close
        </v-btn>
      </template>
    </PopUpPrompt>

    <v-overlay v-model="createDeckOverlay" scrim="black" class="justify-center align-center">
      <Form ref="createDeckForm">
        <template v-slot:headers>
          <p class="text-h6">Create a new deck</p>
        </template>

        <template v-slot:fields>
          <p class="caption font-weight-light my-2">
            Deck Name
          </p>

          <v-text-field 
            label="Deck name"
            v-model="deckName"
            counter="50"
            v-bind:rules="[validation.required, validation.maxLength(deckName, 50)]"
          ></v-text-field>

          <p class="caption font-weight-light my-2">
            Deck Description
          </p>

          <v-textarea 
            label="Deck description"
            v-model="deckDesc"
            counter="150"
            v-bind:rules="[validation.maxLength(deckDesc, 150)]"
          ></v-textarea>
        </template>

        <template v-slot:buttons>
          <div class="d-flex flex-end">
            <v-btn 
              variant="flat"
              v-on:click="createDeckForm.form.validate(), cardDecksPageCreateDeck()"
            >
              Create
            </v-btn>
            <v-btn 
              variant="flat"
              v-on:click="createDeckOverlay = !createDeckOverlay"
            >
              Cancel
            </v-btn>
          </div>
        </template>
      </Form>
    </v-overlay>
    
    <div class="d-flex flex-wrap flex-column flex-sm-row align-center">
      <div class="addcard pa-10 ma-4 d-flex align-center" v-on:click="createDeckOverlay = true">
        <p class="addcardtext text-h5 font-weight-light text-center">Create a new card deck</p>
      </div>

      <v-card 
        class="pa-6 ma-4 rounded-lg" 
        color="white" 
        width="240" 
        height="288" 
        v-for="deck in decks"
        v-bind:key="deck.deckid"
      >
        <div 
          class="d-flex flex-column align-start fill-height justify-space-between"
        >
          <div>
            <p class="text-h6 font-weight-bold">{{ deck.deckname }}</p>
            <v-btn 
              variant="plain" 
              class="pa-0" 
              v-on:click="deck.descReveal = true"
            >
              Description
            </v-btn>
          </div>

          <div>
            <v-tooltip text="Study" location="top" z-index="0">
              <template v-slot:activator="{ props }">
                <v-btn
                  size="small"
                  icon="mdi-play"
                  color="black"
                  :loading="deck.playLoading"
                  v-bind="props"
                  v-on:click="goStudyDeck(deck)"
                ></v-btn>
              </template>
            </v-tooltip>

            <v-tooltip text="Edit" location="top" z-index="0">
              <template v-slot:activator="{ props }">
                <v-btn 
                  size="small" 
                  icon="mdi-pencil" 
                  color="black" 
                  class="mx-3" 
                  v-bind="props" 
                  v-on:click="goEditDeck(deck)"
                ></v-btn>
              </template>
            </v-tooltip>
          </div>
        </div>

        <v-expand-transition>
          <v-card 
            v-if="deck.descReveal" 
            class="transition-fast-in-fast-out v-card--reveal"
          >
            <v-card-text class="mx-3">
              <p class="text-body-1">{{ deck.descp }}</p>
            </v-card-text>
            <v-card-actions class="mx-3">
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
import { ref } from '@vue/reactivity'
import { useRouter } from 'vue-router'
import { onMounted } from '@vue/runtime-core'
import { useStore } from 'vuex'
import Form from "../components/Form.vue"
import PopUpPrompt from "../components/PopUpPrompt.vue"
import { decksLoader, deckCreator } from "../composables/decksHandler"
import validation from "../composables/validation"



export default {
  components: { Form, PopUpPrompt },
  setup() {
    const store = useStore()
    const router = useRouter()
    const createDeckForm = ref()

    //Load decks
    const loadingDecksOverlay = ref(false)
    const { decks, loadDecks } = decksLoader()
    
    onMounted(() => {
      loadingDecksOverlay.value = true
      loadDecks()
        .then(() => {
          loadingDecksOverlay.value = false
        })
        .catch(error => {
          console.log(error)
        })
    })

    //Create a new deck
    const createDeckOverlay = ref(false)
    const { deckName, deckDesc, createDeck } = deckCreator()

    const cardDecksPageCreateDeck = async () => {
      if (createDeckForm.value.validated) {
        createDeckOverlay.value = false
        loadingDecksOverlay.value = true

        try {
          await createDeck()
          loadingDecksOverlay.value = false
          deckName.value = ""
          deckDesc.value = ""
        } catch (error) {
          console.log(error)
        }
      }
    }

    const goEditDeck = deck => {
      store.commit("setCurrentDeckID", deck.deckid)
      router.push({ name: 'EditDeck', params: { deckname: deck.deckname } })
    }

    const goStudyDeck = deck => {
      deck.playLoading = true
      store.dispatch("loadCards", deck.deckid)
        .then(() => {
          if (store.state.studyCards.cardCount() == 0) {
            deck.playLoading = false
            openNoCardOverlay(deck)
          } else {
            router.push({ name: 'StudyDeck', params: { deckname: deck.deckname } })
          }
        })
    }

    //No card prompt
    const noCardPrompt = ref()
    const noCardDeck = ref(null)

    const openNoCardOverlay = deck => {
      noCardPrompt.value.show = true
      noCardDeck.value = deck
    }

    return { 
      decks, 
      loadingDecksOverlay,
      loadDecks, 
      createDeckForm,
      deckName, 
      deckDesc, 
      cardDecksPageCreateDeck,
      createDeckOverlay, 
      validation, 
      goEditDeck,
      goStudyDeck,
      noCardPrompt,
      noCardDeck,
      openNoCardOverlay 
    }
  }
}
</script>

<style scoped>
  .addcard {
    width: 240px;
    height: 288px;
    border: 2px dashed #55ffff;
    border-radius: 10px;
    cursor: pointer;
  }

  .addcardtext {
    color: #55ffff;
    user-select: none;
  }

  .addcard:hover {
    border: 2px dashed #c0ffff;
  }

  .addcard:hover .addcardtext {
    color: #c0ffff;
  }

  .v-card--reveal {
    bottom: 0;
    right: 0;
    position: absolute;
    height: 100%;
    width: 100%;
  }
</style>