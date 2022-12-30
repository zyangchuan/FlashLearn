<template>
  <v-app>
    <v-main>
      <Navbar v-if="this.$store.state.isAuthenticated"/>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
import Navbar from "./components/Navbar.vue"

export default {
  name: 'App',
  components: { Navbar },
  created() {
    this.$store.dispatch("getAuthentication")
  }
}
</script>

