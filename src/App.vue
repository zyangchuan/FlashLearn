<template>
  <v-app>
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
import { Auth } from "aws-amplify"

export default {
  name: 'App',
  
  data: () => ({
    //
  }),

  methods: {
    async retrieveSession () {
      try {
        const session = await Auth.currentSession()
        this.$store.commit("setAuthenticationState", true)
        console.log(session)
        const user = await Auth.currentAuthenticatedUser()
        console.log(user)
        this.$store.commit("setCurrentUser", user)
      } catch (error) {
        console.log(error)
      }
    }
  },

  mounted() {
    this.retrieveSession()
  }
}
</script>

