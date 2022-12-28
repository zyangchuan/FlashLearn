<template>
  <v-app-bar app size="large">
    <v-app-bar-nav-icon color="white" v-on:click="drawer = !drawer"></v-app-bar-nav-icon>
    <v-app-bar-title>
      <span class="font-weight-light">FlashLearn</span>
    </v-app-bar-title>
    <v-spacer></v-spacer>
    <p class="h6 mx-6 font-weight-medium">Hello {{ username }}</p>
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
        <v-img src="/avatar.jpg"></v-img>
      </v-avatar>
      <p class="text-body-1 white">{{ username }}</p>
    </div>

    <v-list>
      <v-list-item 
        prepend-icon="mdi-cards"
        title="Card decks" 
        value="carddecks">
      </v-list-item>

      <v-list-item 
        prepend-icon="mdi-account-multiple"

        value="friends">
        <v-list-item-title class="d-inline">Friends</v-list-item-title>
        <v-chip class="mx-3" size="small">Coming soon</v-chip>
      </v-list-item>

      <v-list-item 
        prepend-icon="mdi-account"
        title="Account"
        value="accounts">
      </v-list-item>
    </v-list>

  </v-navigation-drawer>

</template>

<script>
import { Auth } from "aws-amplify"

export default {
  props: [ 'username' ],
  data () {
    return {
      drawer: false,
      drawerOptions: [
        {title: "Card decks", icon: "mdi-cards", value: 1},
        {title: "Friends", icon: "mdi-account-multiple", value: 2},
        {title: "Account", icon: "mdi-account", value: 3},
        {title: "Settings", icon: "mdi-cog", value: 4},
      ]
    }
  },
  methods: {
    async signOut() {
      try {
        await Auth.signOut();
        this.$store.state.user = null
        this.$store.state.isAuthenticated = false
        this.$router.push({ name: "Signin" })
      } catch (error) {
        console.log('error signing out: ', error);
      }
    }
  }
}
</script>

<style>

</style>