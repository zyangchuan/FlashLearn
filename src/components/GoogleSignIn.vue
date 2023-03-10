<template>
  <div>
    <v-btn color="white" size="large" style="text-transform: none" :loading="googleloading" @click="signInPageGoogleSignIn">
      <img :src="require('@/assets/google-logo.png')" style="width:25px; height:25px; margin-right: 10px;"/>
      <p>Sign in with Google</p>
    </v-btn>
  </div>
</template>

<script>
import { signIn } from "../composables/userAuth";
import { Auth } from "aws-amplify"
export default {
  setup() {
    const { googleloading, googleSignIn } = signIn()

    const signInPageGoogleSignIn = async () => {
      try {
        await googleSignIn()
      } catch (error) {
        console.log(error)
      }
    }

    return { googleloading, signInPageGoogleSignIn }
  }
}
</script>
