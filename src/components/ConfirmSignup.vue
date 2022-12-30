<template>
  <v-card class="pa-7" width="530" v-if="!confirmed">
    <p 
      class="text-h4 
      font-weight-medium 
      text-center">
      Confirm your account
    </p>

    <p class="my-10 text-center">Enter the confirmation code that has been sent to your email.</p>

    <v-form v-model="validated">
      <div class="mx-4 mt-6">
        <p 
          class="caption
          font-weight-light
          text-uppercase
          ma-2 ml-0">
          Create a username
        </p>

        <v-text-field
          label="Username" 
          v-model="p_username"
          v-bind:rules="[required, noSpace]">
        </v-text-field>

        <p 
          class="caption
          font-weight-light
          text-uppercase
          ma-2 ml-0">
          Confirmation code
        </p>

        <v-text-field
          type="text" 
          label="Confirmation code" 
          v-model="code"
          v-bind:rules="[required]">
        </v-text-field>
            
      </div>

      <p class="text-center mb-2 text-red">{{ errorMsg }}</p>

      <div class="d-flex mx-4 justify-end">
        <v-btn flat v-on:click="confirmAcc">Continue</v-btn>
      </div>
    </v-form>
    

  </v-card>

  <v-card class="d-flex flex-column pa-7 justify-center align-center" width="530" height="280" v-if="confirmed">
    <p 
      class="text-h4 
      font-weight-medium 
      text-center
      mb-10">
      Your account has been created successfully!
    </p>

    <div class="d-flex mx-4 justify-center">
      
      <v-btn 
        color="white"
        size="large"
        v-bind:loading="loading"
        v-on:click="login">
        <v-icon icon="mdi-login" class="mr-2"></v-icon>
        <span>Sign in</span>
      </v-btn>
      
    </div>
  </v-card>
</template>

<script>
import { Auth } from "aws-amplify"

export default {
  props: ['email', 'password', 'resendCode'],
  data () {
    return {
      code: "",
      p_username: "", //preferred user name used for login
      confirmed: false,
      errorMsg: "",
      loading: false,
      validated: false
    }
  },
  methods: {
    async confirmAcc () {
      try {
        if (this.validated) {
          await Auth.confirmSignUp(this.email, this.code)
          this.confirmed = true
        }

      } catch (error) {
        console.log('error confirming signup: ', error)
        if (error.name === "CodeMismatchException") {
          this.errorMsg = "Invalid confirmation code provided, please try again."
        }
      }
    },
    required(value) {
      if (value) {
        return true
      } else {
        return "This field is required."
      }
    },
    noSpace(value) {
      if (value.match(/\s/g)) {
        return "Do no include space in your username"
      } else {
        return true
      }
    },
    async login () {
      try {
        this.loading = true
        await Auth.signIn(this.email, this.password)
        const user = await Auth.currentAuthenticatedUser()
          
        this.$store.commit("setCurrentUser", user)
        this.$store.commit("setAuthenticationState", true)

        //assign the preferred user name to the user's account
        console.log(user)
        await Auth.updateUserAttributes(user, {
          preferred_username: this.p_username
        })

        this.$router.push({ name: "CardDecks" })

      } catch (error) {
        console.log("signin error:", error)
        if (error.name === 'UserNotConfirmedException') {
          this.unconfirmed = true
        }
      }
    },
    async resendConfirmCode() {
      if (this.resendCode) {
        try {
          await Auth.resendSignUp(this.email);
        } catch (err) {
            console.log('error resending code: ', err);
        }
      }
    }
  },
  mounted () {
    this.resendConfirmCode()
  }
}
</script>

<style>

</style>