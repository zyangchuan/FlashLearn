<template>
  <v-container class="d-flex justify-center align-center fill-height">
    <v-row class="justify-center align-center">
      <v-col cols="12" sm="12" v-if="!unconfirmed">
        <div class="hidden-md-and-up">
          <img
            :src="require('@/assets/flashlearn-text-logo.svg')"
            style="width: 180px; display: block; margin: 0 auto"
          />
        </div>
      </v-col>

      <v-col cols="12" sm="12" md="6" lg="6" v-if="!unconfirmed">
        <Form ref="signInForm">
          <template v-slot:headers>
            <p class="text-h5 text-sm-h4 font-weight-medium text-center">
              Welcome
            </p>
            <p class="text-subtitle-1 font-weight-medium text-center">
              Sign in to begin!
            </p>
          </template>

          <template v-slot:fields>
            <p class="caption font-weight-light my-2">
              Username or Email Address
            </p>

            <v-text-field
              label="Username/Email"
              prepend-inner-icon="mdi-account"
              v-model="email"
              v-bind:rules="[validation.required]"
            >
            </v-text-field>

            <p class="caption font-weight-light my-2">Password</p>

            <v-text-field
              type="password"
              label="Password"
              prepend-inner-icon="mdi-key"
              v-model="password"
              v-bind:rules="[validation.required]"
            >
            </v-text-field>

            <p class="text-subtitle-1 text-red text-center">
              {{ signInError }}
            </p>
          </template>
          <template v-slot:buttons>
            <div class="d-flex flex-column align-center">
              <v-btn
                class="my-2"
                color="white"
                size="large"
                v-on:click="signInPageSignIn"
                v-bind:loading="signInLoading"
              >
                <v-icon icon="mdi-login"></v-icon>
                <span>Sign in</span>
              </v-btn>

              <v-btn class="my-2" variant="text" v-bind:to="{ name: 'Signup' }">
                Sign up
              </v-btn>
              <div class="separator">
                <p class="separator-text">OR</p>
              </div>
              <GoogleSignIn />
            </div>
          </template>
        </Form>
      </v-col>

      <v-col md="6" lg="6" v-if="!unconfirmed">
        <div class="hidden-sm-and-down mx-10">
          <img :src="require('@/assets/flashlearn-text-logo.svg')" />
        </div>
      </v-col>

      <v-col cols="12" sm="12" md="6" lg="6">
        <ConfirmSignup
          v-bind:email="email"
          v-bind:password="password"
          v-bind:resendCode="true"
          v-if="unconfirmed"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { onMounted, ref, watchEffect } from "vue";
import { useRouter } from "vue-router";
import ConfirmSignup from "../components/ConfirmSignup.vue";
import Form from "../components/Form.vue";
import GoogleSignIn from "../components/GoogleSignIn.vue";
import { signIn } from "../composables/userAuth";
import validation from "../composables/validation";
import { useStore } from "vuex";

import { Hub } from "aws-amplify"
export default {
  components: { ConfirmSignup, Form, GoogleSignIn },
  setup() {
    
    const router = useRouter(); //Router object
    const store = useStore(); //Vuex store object

    watchEffect(() => {
      Hub.listen('auth', ({ payload: { event, data } }) => {
        switch (event) {
          case 'signIn':
            store.dispatch("setAuthentication");
            break;
        }
      });

      if (store.getters.isAuthenticated) {
        router.push({ name: "CardDecks" });
      }
    });

    //Form input validation
    const signInForm = ref(); //Reference to the sign in form (AuthForm component)

    //Handle sign in
    const unconfirmed = ref(false); //Render the confirmation window if this is true
    const signInError = ref("");
    const { email, password, signInLoading, cognitoSignIn } =
      signIn();

    //Sign in page function
    const signInPageSignIn = async () => {
      await signInForm.value.form.validate();

      if (signInForm.value.validated) {
        //Do not run if the inputs are invalid
        try {
          //If successful
          await cognitoSignIn();
          router.push({ name: "CardDecks" }); //Redirect to the Card Decks page
        } catch (error) {
          //If unsuccessful
          switch (
            error.name //Handle different errors
          ) {
            case "UserNotConfirmedException": //If the user is not confirmed
              unconfirmed.value = true; //Render the confirmation page
              break;
            case "NotAuthorizedException": //If the credentials are incorrect
              signInError.value = "Incorrect username or password."; //Display error
              break;
          }
        }
      }
    };

    return {
      email,
      password,
      unconfirmed,
      signInLoading,
      signInError,
      signInPageSignIn,
      signInForm,
      validation,
    };
  },
};
</script>

<style scoped>
.separator {
  margin-top: 20px;
  width: 80%;
  border-top: 1px solid grey;
  display: flex;
  justify-content: center;
}

.separator-text {
  position: relative;
  top: -12px;
  padding-left: 10px;
  padding-right: 10px;
  background-color: #212121;
}
</style>