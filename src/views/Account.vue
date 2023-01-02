<template>
  <v-container>

    <h1 class="text-h5 text-sm-h4 text-md-h4 text-lg-h4 font-weight-bold my-10">Account</h1>
    <v-card class="pa-6" max-width="800px">
      <div class="d-flex flex-row align-center">
        <v-avatar size="100" class="mb-2">
          <v-img cover src="/avatar.jpg"></v-img>
        </v-avatar>
        <p class="text-h5 font-weight-medium mx-6">{{ display_username }}</p>
      </div>

      <v-card class="d-flex flex-column justify-space-between pa-5 mt-6" color="rgb(50,50,50)">
        <div class="d-flex flex-row align-center justify-space-between">
          <div class="w-50">
            <p class="text-subtitle-2 text-sm-subtitle-1 text-md-subtitle-1 text-lg-subtitle-1 font-weight-medium text-uppercase text-grey-lighten-1">Username</p>
            <v-text-field
              density="compact" 
              class="mb-n7" 
              autofocus
              v-if="editingUsername"
              v-model="edit_username">
            </v-text-field>
            <p class="text-subtitle-1 text-sm-h6 text-md-h6 text-lg-h6 font-weight-light text-white" v-else>{{ edit_username }}</p>
          </div>
          <v-btn color="white" variant="outlined" size="small"
            v-on:click="editingUsername = !editingUsername"
            v-if="!editingUsername">
            <v-icon icon="mdi-pencil" class="mr-1"></v-icon>
            <span>Edit</span>
          </v-btn>
          <v-btn color="white" variant="outlined" size="small"
            v-on:click="updateUsername"
            v-bind:loading="loading"
            v-else>
            <span>Submit</span>
          </v-btn>
        </div>
        <div class="d-flex flex-row align-center justify-space-between">
          <div class="w-50 my-5">
            <p class="text-subtitle-2 text-sm-subtitle-1 text-md-subtitle-1 text-lg-subtitle-1 font-weight-medium text-uppercase text-grey-lighten-1">Email</p>
            <p class="text-subtitle-1 text-sm-h6 text-md-h6 text-lg-h6 font-weight-light text-white">{{ email }}</p>
          </div>
        </div>

      </v-card>
    </v-card>

  </v-container>
</template>

<script>
import Navbar from "../components/Navbar.vue"
import { Auth } from "aws-amplify"

export default {
  components: { Navbar },
  data() {
    return {
      display_username: "",
      edit_username: "",
      email: "",
      editingUsername: false,
      loading: false
    }
  },
  mounted() {
    this.edit_username = this.$store.state.currentUser.attributes.preferred_username
    this.display_username = this.$store.state.currentUser.attributes.preferred_username
    this.email = this.$store.state.currentUser.attributes.email
  },
  methods: {
    async updateUsername () {
      const user = await Auth.currentAuthenticatedUser()
      this.loading = true
      await Auth.updateUserAttributes(user, {
        preferred_username: this.edit_username
      })
      this.editingUsername = false
      this.display_username = this.edit_username
      location.reload()
    }
  }  
}
</script>

<style>
  .custom-loader {
    animation: loader 1s infinite;
    display: flex;
  }

  @keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>