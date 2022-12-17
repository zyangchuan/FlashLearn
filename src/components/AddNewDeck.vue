<template>
        <v-card
            width="500" 
            height="510"
            title="Add a new card deck"
            class="pa-5">

            <div class="mx-7 my-5">
                <p class="caption
                font-weight-light
                my-2">
                Deck title
                </p>

                <v-text-field 
                    label="Deck title" 
                    clearable
                    clear-icon="mdi-close-circle"
                    v-model="deckTitle">
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
export default {
    data () {
        return {
            deckTitle: "",
            deckDesc: ""
        }
    },
    methods: {
        closeOverlay () {
            this.$emit('closeOverlay')
        },
        addDeck () {
            this.$emit('closeOverlay')
            this.$emit('addDeck', {title: this.deckTitle, desc: this.deckDesc})
        }
    }
}
</script>

<style>

</style>