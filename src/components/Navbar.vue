<template>
  <v-app-bar app size="large">
    <v-app-bar-nav-icon color="white" v-on:click="drawer = !drawer"></v-app-bar-nav-icon>
    <v-app-bar-title>
      <span class="font-weight-light text-body-1 text-sm-h6">FlashLearn</span>
    </v-app-bar-title>
    <v-spacer></v-spacer>
    <p class="h6 mx-6 font-weight-medium hidden-sm-and-down">Hello {{ username }}</p>
    <v-btn 
      color="white"
      prepend-icon="mdi-exit-to-app"
      v-on:click="signOut">
      Sign out
    </v-btn>
  </v-app-bar>

  <v-navigation-drawer app temporary v-model="drawer" width="300">
    <div class="d-flex flex-column align-center my-10">
      <v-avatar size="100" class="mb-2">
        <v-img cover src="/avatar.jpg"></v-img>
      </v-avatar>
      <p class="text-body-1 white">{{ username }}</p>
    </div>

    <v-list>
      <v-list-item 
        prepend-icon="mdi-cards"
        title="Card decks" 
        value="carddecks"
        v-bind:to="{ name: 'CardDecks' }"
        active-color="primary">
      </v-list-item>

      <v-list-item 
        prepend-icon="mdi-account-multiple"
        value="friends"
        disabled>
        <v-list-item-title class="d-inline">Friends</v-list-item-title>
        <v-chip class="mx-4"  size="small">Coming soon</v-chip>
      </v-list-item>

      <v-list-item 
        prepend-icon="mdi-account"
        title="Account"
        value="accounts"
        v-bind:to="{ name: 'Account' }"
        active-color="primary">
      </v-list-item>
    </v-list>

  </v-navigation-drawer>

</template>

<script>
import { Auth } from "aws-amplify"

export default {
  data () {
    return {
      drawer: false,
      username: ""
    }
  },
  methods: {
    async signOut() {
      try {
        await Auth.signOut()
        this.$store.commit("setCurrentUser", null)
        this.$router.push({ name: "Signin" })
        console.log(this.$store.state.currentUser)
      } catch (error) {
        console.log('error signing out: ', error);
      }
    }
  },
  mounted() {
    this.username = this.$store.state.currentUser.attributes.preferred_username
  }
}
</script>

<style>

</style>