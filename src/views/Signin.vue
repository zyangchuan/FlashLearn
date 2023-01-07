<template>  
  
  <v-container class="d-flex justify-center align-center fill-height">

      <v-row class="justify-center align-center">
        
        <v-col cols="12" sm="12" v-if="!unconfirmed">
          <div class="hidden-md-and-up">
            <h1 class="text-h4 font-weight-light text-center">FlashLearn</h1>
          </div>
        </v-col> 

        <v-col cols="12" sm="12" md="6" lg="6" v-if="!unconfirmed">
            <v-card class="py-7 px-md-7 px-lg-7 px-sm-7 px-3 mx-auto" max-width="500px">
              <p 
                class="text-h5 text-sm-h4 text-md-h4 text-lg-h4
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
              
              <div class="mx-4 mt-10 mt-sm-15 mt-md-15 mt-lg-15
                mb-sm-6 mb-md-6 mb-lg-6">

                <p 
                  class="caption
                  font-weight-light
                  text-uppercase
                  ma-2 ml-0">
                  Username or email
                </p>

                <v-text-field 
                  label="Username/Email"
                  prepend-inner-icon="mdi-account"
                  v-model="email"
                  v-bind:rules="[required]">
                </v-text-field>

                <p 
                  class="caption
                  font-weight-light
                  text-uppercase
                  ma-2 ml-0">
                  Password
                </p>

                <v-text-field
                  type="password" 
                  label="Password" 
                  prepend-inner-icon="mdi-key" 
                  v-model="password"
                  v-bind:rules="[required]">
                </v-text-field>

              </div>

              <p class="text-subtitle-1 text-red text-center">{{ errorMsg }}</p>

              <div class="d-flex flex-column align-center mt-10">
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
                  class="mt-6"
                  v-bind:to="{ name: 'Signup' }">
                  Sign up
                </v-btn>
              </div>

            </v-card>
          
        </v-col>
        
        <v-col md="6" lg="6" v-if="!unconfirmed">
          <div class="hidden-sm-and-down mx-10">
            <p class="text-md-h2 text-lg-h1 font-weight-light">FlashLearn</p>
          </div> 
        </v-col>

        <v-col cols="12" sm="12" md="6" lg="6">
          <ConfirmSignup
            v-bind:email="email"
            v-bind:password="password"
            v-bind:resendCode="true"
            v-if="unconfirmed"/>
        </v-col>
        
      </v-row>

  </v-container>

  
    
</template>

<script>
import ConfirmSignup from "../components/ConfirmSignup.vue"
import { Auth } from "aws-amplify"

// Components

export default ({
  components: { ConfirmSignup },
  data () {
    return {
      email: "",
      password: "",
      unconfirmed: false,
      loading: false,
      errorMsg: ""
    }
  },
  mounted () {
    if (this.$store.state.currentUser) {
      this.$router.push({ name: 'CardDecks' })
    }
  },
  methods: {
    async login () {
      try {
        this.loading = true
        await Auth.signIn(this.email, this.password)
        this.$store.dispatch("getAuthentication")
        this.$router.push({ name: "CardDecks" })
      
      } catch (error) {
        console.log("signin error:", error)

        switch (error.name) {
          case "UserNotConfirmedException": 
            this.unconfirmed = true
            break
          case "NotAuthorizedException":
            this.loading = false
            this.errorMsg = "Incorrect username or password."
            break
        }
      }
    },
    required(value) {
      if (value) {
        return true
      } else {
        return "This field is required."
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
