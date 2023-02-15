<template>
	<v-container class="d-flex justify-center align-center fill-height">
    <v-row class="align-center">
      <v-col cols="12">
        <div>
          <img :src="require('@/assets/flashlearn-text-logo.svg')" style="width: 180px; display: block; margin: 0 auto;">
        </div>
      </v-col>

      <v-col cols="12" v-if="!unconfirmed">
        <Form ref="signUpForm">
          <template v-slot:headers>
            <p 
              class="text-h5 text-sm-h4 font-weight-medium text-center">
              Sign up
            </p>
          </template>

          <template v-slot:fields>
            <p class="caption font-weight-light my-2">
              Email Address
            </p>

            <v-text-field 
              type="email" 
              label="Email Address" 
              v-model="email"
              v-bind:rules="[validation.required]"
            >
            </v-text-field>

            <p class="caption font-weight-light my-2">
              Password
            </p>

            <v-text-field 
              type="password" 
              label="Password" 
              v-model="password"
              v-bind:rules="[
                validation.required,
                validation.minLength(password, 8), 
                validation.includeLetters,
                validation.includeNumbers
              ]"
            >
            </v-text-field>

            <p class="caption font-weight-light my-2">
              Confirm Password
            </p>

            <v-text-field
              type="password" 
              label="Password" 
              v-model="cpassword" 
              v-bind:rules="[validation.match(cpassword, password)]"
            >
            </v-text-field>
            <p class="text-center text-red">{{ signUpError }}</p>
          </template>

          <template v-slot:buttons>
            <div class="d-flex flex-column align-center">
              <v-btn 
                variant="flat" 
                size="large" 
                :loading="signUpLoading" 
                v-on:click="signUpPageSignUp"
              >
                Sign up
              </v-btn>
              <p class="my-2">
                Already a user? 
                <span>
                  <router-link class="link" v-bind:to="{ name: 'Signin' }">
                    Sign in
                  </router-link>
                </span>
              </p>
            </div>
          </template>
        </Form>
      </v-col>
      
      <v-col cols="12" v-if="unconfirmed">
        <ConfirmSignup
          v-bind:email="email" 
          v-bind:password="password" 
          v-bind:resendCode="false"
        />
      </v-col>
    </v-row>
	</v-container>
</template>

<script>
import ConfirmSignup from "../components/ConfirmSignup.vue"
import Form from "../components/Form.vue"
import { signUp } from "../composables/userAuth"
import validation from "../composables/validation"
import { ref } from '@vue/reactivity'
import { onMounted } from '@vue/runtime-core'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
	components: { ConfirmSignup, Form },
	setup() {
    const router = useRouter()
    const store = useStore()
    const signUpForm = ref()

    const unconfirmed = ref(false)
    const signUpError = ref("")
    const { email, password, cpassword, signUpLoading, cognitoSignUp } = signUp()

    const signUpPageSignUp = async () => {
      await signUpForm.value.form.validate()

      if (signUpForm.value.validated) {
        try {
          await cognitoSignUp ()
          unconfirmed.value = true
        } catch (error) {
          switch (error.name) {
            case "UsernameExistsException": 
              signUpError.value = "An account with the given email already exists."
              break
            case "InvalidParameterException":
              signUpError.value = "Invalid email address format."
              break
          }
        }
      }
    }

    onMounted(() => {
      if (store.getters.isAuthenticated) {
        router.push({ name: 'CardDecks' })
      }
    })

    return {
      email, password, cpassword, signUpLoading, unconfirmed, signUpError, signUpPageSignUp, signUpForm, validation
    }
  }
}
</script>