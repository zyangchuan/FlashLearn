<template>
  <v-container>
    <div class="d-flex justify-space-between align-center">
      <h1 class="text-h5 text-sm-h4 font-weight-bold my-10">Edit Card Deck</h1>
      <v-btn 
        variant="outlined" 
        prepend-icon="mdi-arrow-left" 
        class="text-capitalize" 
        v-bind:to="{ name: 'CardDecks' }"
      >
        Back
      </v-btn>
    </div>

    <PopUpPrompt ref="confirmDeleteDeckPrompt">
      <template v-slot:message>
        Are you sure you want to delete this card deck?
      </template>
      <template v-slot:actions>
        <v-btn
          class="text-capitalize mx-2"
          color="red"
          variant="text"
          :loading="deleteDeckSpinner"
          v-on:click="editDeckPageDeleteDeck"
        >
          Yes, delete
        </v-btn>
        <v-btn
          class="text-capitalize mx-2"
          color="white"
          variant="text"
          v-on:click="confirmDeleteDeckPrompt.show = false"
        >
          Cancel
        </v-btn>
      </template>
    </PopUpPrompt>

    <v-overlay v-model="editDeckOverlay" scrim="black" class="justify-center align-center">
      <Form ref="editDeckForm">
        <template v-slot:headers>
          <p class="text-h6">Edit deck</p>
        </template>

        <template v-slot:fields>
          <p class="caption font-weight-light my-2">
            Deck Name
          </p>

          <v-text-field 
            label="Deck name"
            v-model="editDeckName"
            counter="50"
            v-bind:rules="[validation.required, validation.maxLength(editDeckName, 50)]"
          ></v-text-field>

          <p class="caption font-weight-light my-2">
            Deck Description
          </p>

          <v-textarea 
            label="Deck description"
            v-model="editDeckDesc"
            counter="150"
            v-bind:rules="[validation.maxLength(editDeckDesc, 150)]"
          ></v-textarea>
        </template>

        <template v-slot:buttons>
          <div class="d-flex flex-end">
            <v-btn 
              variant="flat"
              :loading="editDeckSpinner"
              v-on:click="editDeckPageUpdateDeck"
            >
              Apply
            </v-btn>
            <v-btn 
              variant="flat"
              v-on:click="editDeckOverlay = false"
            >
              Cancel
            </v-btn>
          </div>
        </template>
      </Form>
    </v-overlay>

    <v-overlay v-model="editCardOverlay" scrim="black" class="justify-center align-center editcard">
      <Form ref="editCardForm">
        <template v-slot:headers>
          <p class="text-h6">Edit card</p>
        </template>

        <template v-slot:fields>
          <p class="caption font-weight-light my-2">
            Question
          </p>

          <v-text-field 
            label="Question"
            v-model="editCardQuestion"
            counter="60"
            v-bind:rules="[validation.required, validation.maxLength(editCardQuestion, 60)]"
          ></v-text-field>

          <p class="caption font-weight-light my-2">
            Answer
          </p>

          <v-textarea 
            label="Answer"
            v-model="editCardAnswer"
            counter="150"
            v-bind:rules="[validation.maxLength(editCardAnswer, 150)]"
          ></v-textarea>
        </template>

        <template v-slot:buttons>
          <div class="d-flex flex-end">
            <v-btn 
              variant="flat"
              :loading="updateCardLoading"
              v-on:click="editDeckPageUpdateCard"
            >
              Apply
            </v-btn>
            <v-btn 
              variant="flat"
              v-on:click="editCardOverlay = false"
            >
              Cancel
            </v-btn>
          </div>
        </template>
      </Form>
    </v-overlay>

    <PopUpPrompt ref="confirmDeleteCardPrompt">
      <template v-slot:message>
        Are you sure you want to delete this card?
      </template>
      <template v-slot:actions>
        <v-btn
          class="text-capitalize mx-2"
          color="red"
          variant="text"
          :loading="deleteCardSpinner"
          v-on:click="editDeckPageDeleteCard()"
        >
          Yes, delete
        </v-btn>
        <v-btn
          class="text-capitalize mx-2"
          color="white"
          variant="text"
          v-on:click="confirmDeleteCardPrompt.show = false"
        >
          Cancel
        </v-btn>
      </template>
    </PopUpPrompt>

    <v-overlay v-model="loadingOverlay" scrim="black" class="align-center justify-center">
      <v-progress-circular
        indeterminate
        size="64"
        color="primary"
      ></v-progress-circular>
    </v-overlay>

    <v-card elevation="0">
      <v-card class="pa-6 pa-sm-8 mb-n2 fill-width rounded-lg" color="rgb(50, 50, 50)" elevation="10">
        <div class="d-flex flex-column flex-sm-row justify-space-between">
          <div class="w-sm-75">
            <p class="text-h5 text-sm-h4 font-weight-medium">{{ deckName }}</p>
            <p class="text-body-1 text-sm-h6 text-grey my-4">{{ deckDesc }}</p>
          </div>

          <div class="d-flex flex-sm-column  justify-center">
            <v-btn 
              class="mx-5 mb-sm-5 text-capitalize"
              variant="outlined" 
              color="red" 
              width="130"
              prepend-icon="mdi-trash-can-outline"
              v-on:click="confirmDeleteDeckPrompt.show = true">
              Delete Deck
            </v-btn>
            <v-btn 
              class="mx-5 text-capitalize"
              variant="outlined" 
              color="blue" 
              width="130"
              prepend-icon="mdi-pencil"
              v-on:click="openEditDeckOverlay">
              Edit Details
            </v-btn>
          </div>
        </div>
      </v-card>
      
      <v-sheet
        class="mx-auto mt-10"
      >
        <v-row justify="center">
          <v-col cols="10" sm="6">
            <v-text-field 
              label="Search Card" 
              append-icon="mdi-magnify"
              density="compact"
              single-line
              v-model="search"
            ></v-text-field>
          </v-col>
        </v-row>

        <p class="text-body-1 text-sm-h6 text-center text-grey">Click/Tap the card to reveal the answer</p>
        
        <div class="flashcards-group">
          <div
            v-for="card in matchingCards"
            :key="card.cardid"
          >
            <div class="d-flex flex-column align-center mb-5">
              <FlashCard :card="card" size="small"/>
              <div>
                <v-chip class="mx-2 text-red" v-on:click="openDeleteCardPrompt(card.cardid)" link>Delete</v-chip>
                <v-chip class="mx-2 text-blue" v-on:click="openEditCardOverlay(card.cardid, card.question, card.answer)" link>Edit</v-chip>
              </div>
            </div>
          </div>
        </div>

        <v-overlay v-model="createCardOverlay" scrim="black" class="justify-center align-center createcard">
          <Form ref="createCardForm">
            <template v-slot:headers>
              <p class="text-h6">Create card</p>
            </template>

            <template v-slot:fields>
              <p class="caption font-weight-light my-2">
                Question
              </p>

              <v-text-field 
                label="Question"
                v-model="cardQuestion"
                counter="60"
                v-bind:rules="[validation.required, validation.maxLength(cardQuestion, 60)]"
              ></v-text-field>

              <p class="caption font-weight-light my-2">
                Answer
              </p>

              <v-textarea 
                label="Answer"
                v-model="cardAnswer"
                counter="150"
                v-bind:rules="[validation.required, validation.maxLength(cardQuestion, 150)]"
              ></v-textarea>
            </template>

            <template v-slot:buttons>
              <div class="d-flex flex-end">
                <v-btn 
                  variant="flat"
                  :loading="createCardSpinner"
                  v-on:click="editDeckPageCreateCard"
                >
                  Create
                </v-btn>
                <v-btn 
                  variant="flat"
                  v-on:click="createCardOverlay = false"
                >
                  Cancel
                </v-btn>
              </div>
            </template>
          </Form>
        </v-overlay>

        <v-overlay v-model="flashGenOverlay" scrim="black" class="justify-center align-center flashgen">
          <Form ref="flashGenForm">
            <template v-slot:headers>
              <p class="text-h5 text-yellow-lighten-2 mb-8">FlashGen</p>
              <p class="text-h6 font-weight-light mb-8">Paste a paragraph of text (e.g study notes, a paragraph from an article) into the box below to generate flash cards immediately.</p>
            </template>

            <template v-slot:fields>
              <p class="caption font-weight-light my-2">
                Paste your text here
              </p>

              <v-textarea 
                label="Text"
                v-model="flashGenText"
                counter="2000"
                v-bind:rules="[validation.required, validation.minLength(flashGenText, 120), validation.maxLength(flashGenText, 2000)]"
              ></v-textarea>
            </template>

            <template v-slot:buttons>
              <div class="d-flex flex-end">
                <v-btn 
                  variant="flat"
                  class="text-yellow-lighten-2"
                  :loading="flashGenSpinner"
                  v-on:click="editDeckPageFlashGen()"
                >
                  Generate Cards
                </v-btn>
                <v-btn 
                  variant="flat"
                  v-on:click="flashGenOverlay = false"
                >
                  Cancel
                </v-btn>
              </div>
            </template>
          </Form>
        </v-overlay>

        <div class="my-6 d-flex flex-start align-center justify-center">
          <v-btn 
            variant="outlined" 
            prepend-icon="mdi-plus" 
            class="text-capitalize" 
            width="130"
            v-on:click="createCardOverlay = true"
          >
            Create card
          </v-btn>
          <span class="mx-6">Or</span>
          <v-btn 
            variant="outlined" 
            prepend-icon="mdi-flash" 
            class="text-yellow-lighten-2 text-capitalize" 
            width="120"
            v-on:click="flashGenOverlay = true">FlashGen</v-btn>
        </div>
      </v-sheet>
    </v-card>
  </v-container>
</template>

<script>
import { ref } from '@vue/reactivity'
import { useRouter } from 'vue-router'
import { computed, onMounted } from '@vue/runtime-core'
import Form from "../components/Form.vue"
import FlashCard from "../components/FlashCard.vue"
import PopUpPrompt from "../components/PopUpPrompt.vue"
import deckHandler from "../composables/deckHandler"
import cardHandler from "../composables/cardHandler"
import flashGen from "../composables/flashGen"
import validation from "../composables/validation"

export default {
  props: ['deckname'],
  components: { PopUpPrompt, Form, FlashCard },
  setup() {
      const router = useRouter()

      //Load deck
      const loadingOverlay = ref(false)
      const { deckName, deckDesc, cards, loadDeck, deleteDeck, editDeckName, editDeckDesc, updateDeck } = deckHandler()
      
      //Load deck on mounted
      onMounted(() => {
        loadingOverlay.value = true
        loadDeck()
          .then(() => {
            //Copy the values so that they do not change when editing deck
            loadingOverlay.value = false
          })
          .catch(error => {
            console.log(error)
          })
      })

      //Search card
      const search = ref("")
      const matchingCards = computed(() => {
        return cards.value.filter(card => card.question.toLowerCase().includes(search.value.toLowerCase()))
      })

      //Delete deck
      const confirmDeleteDeckPrompt = ref()
      const deleteDeckSpinner = ref(false)
      const editDeckPageDeleteDeck = () => {
        deleteDeckSpinner.value = true
        deleteDeck()
          .then(() => {
            deleteDeckSpinner.value = false
            router.push({ name: 'CardDecks' })
          })
          .catch (error => {
            console.log(error)
          })
      }

      //Update deck
      const editDeckOverlay = ref(false)
      const editDeckForm = ref()
      const editDeckSpinner = ref(false)

      //Open edit deck overlay
      const openEditDeckOverlay = () => {
        editDeckOverlay.value = true
        editDeckName.value = deckName.value 
        editDeckDesc.value = deckDesc.value
      }

      const editDeckPageUpdateDeck = async () => {
        await editDeckForm.value.form.validate()

        if (editDeckForm.value.validated) {
          try {
            editDeckSpinner.value = true
            await updateDeck()
            editDeckSpinner.value = false
            editDeckOverlay.value = false
            editDeckName.value = ""
            editDeckDesc.value = ""
            loadingOverlay.value = true
            loadingOverlay.value = false
          } catch (error) {
            console.log(error)
          }
        }
      }

      //Delete card
      const confirmDeleteCardPrompt = ref()
      const { cardQuestion, cardAnswer, deleteCard, updateCard, createCard } = cardHandler()
      const deleteCardID = ref("")
      const deleteCardSpinner = ref(false)

      const openDeleteCardPrompt = (cardID) => {
        deleteCardID.value = cardID
        confirmDeleteCardPrompt.value.show = true
      }
      
      const editDeckPageDeleteCard = async () => {
        try {
          deleteCardSpinner.value = true
          await deleteCard(deleteCardID.value)
          deleteCardSpinner.value = false
          confirmDeleteCardPrompt.value.show = false
          await loadDeck()
        } catch (error) {
          console.log(error)
        }
      }

      //Edit card
      const editCardForm = ref()
      const editCardID = ref("")
      const editCardOverlay = ref(false)
      const updateCardLoading = ref(false)
      const editCardQuestion = ref("")
      const editCardAnswer = ref("")

      const openEditCardOverlay = (cardID, cardQuestion, cardAnswer) => {
        editCardOverlay.value = true
        editCardID.value = cardID
        editCardQuestion.value = cardQuestion
        editCardAnswer.value = cardAnswer
      }

      const editDeckPageUpdateCard = async () => {
        await editCardForm.value.form.validate()

        if (editCardForm.value.validated) {
          try {
            updateCardLoading.value = true
            await updateCard(editCardID.value, editCardQuestion.value, editCardAnswer.value)
            updateCardLoading.value = false
            editCardOverlay.value = false
            await loadDeck()
          } catch (error) {
            console.log(error)
          }
        }
      }

      //Create card
      const createCardForm = ref()
      const createCardOverlay = ref(false)
      const createCardSpinner = ref(false)

      const editDeckPageCreateCard = async () => {
        await createCardForm.value.form.validate()

        if (createCardForm.value.validated) {
          try {
            createCardSpinner.value = true
            const newCard = await createCard()
            createCardSpinner.value = false
            cards.value.push(newCard.data)
            createCardOverlay.value = false
            cardQuestion.value = ""
            cardAnswer.value = ""
            await loadDeck()
          } catch (error) {
            console.log(error)
          }
        }
      }

      //FlashGen
      const flashGenForm = ref()
      const flashGenOverlay = ref(false)
      const flashGenSpinner = ref(false)
      const { flashGenText, generateCards } = flashGen()

      const editDeckPageFlashGen = async () => {
        await flashGenForm.value.form.validate()

        if (flashGenForm.value.validated) {
          try {
            flashGenSpinner.value = true
            await generateCards()
            flashGenSpinner.value = false
            flashGenOverlay.value = false
            flashGenText.value = ""
            loadingOverlay.value = true
            await loadDeck()
            loadingOverlay.value = false
          } catch (error) {
            console.log(error)
          }
        }
      }

      return { 
        deckName, 
        deckDesc, 
        search,
        matchingCards, 
        loadingOverlay,
        confirmDeleteDeckPrompt,
        deleteDeckSpinner,
        editDeckPageDeleteDeck,
        openEditDeckOverlay,
        editDeckOverlay,
        editDeckSpinner,
        editDeckForm,
        editDeckName,
        editDeckDesc,
        editDeckPageUpdateDeck,
        confirmDeleteCardPrompt,
        deleteCardSpinner,
        openDeleteCardPrompt,
        editDeckPageDeleteCard,
        editCardForm,
        editCardOverlay,
        updateCardLoading,
        editCardQuestion,
        editCardAnswer,
        openEditCardOverlay,
        editDeckPageUpdateCard,
        createCardForm,
        createCardOverlay,
        createCardSpinner,
        cardQuestion,
        cardAnswer,
        editDeckPageCreateCard,
        flashGenForm,
        flashGenOverlay,
        flashGenSpinner,
        flashGenText,
        editDeckPageFlashGen,
        validation
      }
    }
}
</script>

<style scoped>
  .flashcards-group {
    display: flex;
    overflow-x: scroll;
    padding: 0px 10px;
  }

  /* width */
  ::-webkit-scrollbar {
    height: 12px;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background: #212121;
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: #464646;
    border-radius: 10px;
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background: #515151;
  }
</style>