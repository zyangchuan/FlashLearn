<template>  
  <div 
    class="d-flex flex-sm-column flex-md-row 
    justify-center 
    align-center 
    fill-height">
    
    <div class="my-10 hidden-md-and-up">
      <h1 class="text-h4 font-weight-light">FlashLearn</h1>
    </div>

    <v-card class="pa-7" width="500" height="580" v-if="!unconfirmed">

      <p 
        class="text-h4 
        font-weight-medium 
        text-center">
        Welcome
      </p>

      <p 
        class="text-subtitle-1 
        font-weight-medium 
        text-center
        ma-2">
        Sign in to begin!
      </p>
      
      <div class="mx-4 mt-15 mb-10">

        <p 
          class="caption
          font-weight-light
          text-uppercase
          ma-2 ml-0">
          Username or email
        </p>

        <v-text-field label="Username/Email" prepend-inner-icon="mdi-account" v-model="email"></v-text-field>

        <p 
          class="caption
          font-weight-light
          text-uppercase
          ma-2 ml-0">
          Password
        </p>

        <v-text-field type="password" label="Password" prepend-inner-icon="mdi-key" v-model="password"></v-text-field>

      </div>

      <div class="d-flex flex-column align-center">
        <v-btn 
          color="white"
          size="large"
          v-on:click="login"
          v-bind:loading="loading">
          <v-icon icon="mdi-login" class="mr-2"></v-icon>
          <span>Sign in</span>
        </v-btn>
        
        <v-btn 
          variant="text"
          class="my-6"
          v-bind:to="{ name: 'Signup' }">
          Sign up
        </v-btn>
      </div>

    </v-card>

    <ConfirmSignup
      v-bind:email="email"
      v-bind:password="password"
      v-bind:resendCode="true"
      v-if="unconfirmed"/>
    
    <div class="largetitle hidden-sm-and-down ml-16">
      <h1 class="text-h1 font-weight-light">FlashLearn</h1>
    </div>   

  </div>
</template>

<script>
import ConfirmSignup from "../components/ConfirmSignup.vue"
import { defineComponent } from 'vue'
import { Auth } from "aws-amplify"

// Components

export default defineComponent({
  name: 'Login',
  components: { ConfirmSignup },
  data () {
    return {
      email: "",
      password: "",
      unconfirmed: false,
      loading: false
    }
  },
  methods: {
    async login () {
      try {
        this.loading = true
        await Auth.signIn(this.email, this.password)
        Auth.currentAuthenticatedUser()
          .then (user => {
            this.$store.commit("setCurrentUser", user)
            this.$store.commit("setAuthenticationState", true)
            this.$router.push({ name: "Decks" })
          })
      
      } catch (error) {
        console.log("signin error:", error)
        if (error.name === 'UserNotConfirmedException') {
          this.unconfirmed = true
        }
      }
    }
  }
})
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
