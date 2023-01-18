<template>
  <Form ref="confirmForm" v-if="!confirmed">
    <template v-slot:headers>
      <p 
        class="text-h5 text-sm-h4
        font-weight-medium 
        text-center"
      >
        Confirm your account
      </p>

      <p 
        class="my-10 mx-4 text-center"
      >
        Enter the confirmation code that has been sent to your email.
      </p>
    </template>

    <template v-slot:fields>
      <p class="caption font-weight-light my-2">
        Create a username
      </p>

      <v-text-field
        label="Username" 
        v-model="p_username"
        v-bind:rules="[validation.required, validation.noSpace]">
      </v-text-field>

      <p class="caption font-weight-light my-2">
        Confirmation code
      </p>

      <v-text-field
        type="text" 
        label="Confirmation code" 
        v-model="code"
        v-bind:rules="[validation.required]">
      </v-text-field>

      <p class="text-center mb-2 text-red">{{ confirmError }}</p>
    </template>

    <template v-slot:buttons>
      <div class="d-flex flex-end">
        <v-btn 
          variant="flat" 
          :loading="confirmLoading"
          v-on:click="confirmForm.form.validate(), confirmAcc()"
        >
          Continue
        </v-btn>
      </div>
    </template>
  </Form>

  <v-card class="d-flex flex-column pa-5 justify-center align-center mx-auto" max-width="500" height="250" v-if="confirmed">
    <p 
      class="text-h5 text-sm-h4
      font-weight-medium 
      text-center
      mb-10"
    >
      Your account has been created successfully!
    </p>
    <v-btn 
      color="white"
      v-bind:loading="signInLoading"
      v-on:click="confirmPageSignIn"
    >
      <v-icon icon="mdi-login" class="mr-2"></v-icon>
      <span>Sign in</span>
    </v-btn>
  </v-card>
</template>

<script>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Auth } from "aws-amplify"
import Form from "../components/Form.vue"
import { signIn } from "../composables/userAuth"
import validation from "../composables/validation"


export default {
  props: ['email', 'password', 'resendCode'],
  components: { Form },
  setup(props) {
    const router = useRouter() //Router object

    //Form input validation
    const confirmForm = ref() //Reference to the confirm form (AuthForm component)

    //Handle confirmation
    const code = ref("") //Confirmation code
    const p_username = ref("") //Preferred username
    const confirmed = ref(false) //Renders the success window if this is true
    const confirmLoading = ref(false) //Loading spinner for confirm button
    const confirmError = ref("")

    //Resend confirmation code if confirming from sign in page
    onMounted(() => {
      if (props.resendCode) {
        Auth.resendSignUp(props.email)
          .catch(error => {
            console.log(error)
          })
      }
    })

    // Confirm account function
    const confirmAcc = async () => {
      if (confirmForm.value.validated) { //Do not run if the inputs are invalid
        confirmLoading.value = true //Loading spinner renders

        //If successful
        try {
          await Auth.confirmSignUp(props.email, code.value) //Sign up through aws
          confirmed.value = true //Renders the sign in window
          confirmLoading.value = false //Spinner stops

        } catch (error) {
          confirmLoading.value = false //Spinner stops
          if (error.name === "CodeMismatchException") { //If the code is incorrect
            confirmError.value = "Invalid confirmation code provided, please try again."
          }
        }
      }
    }

    //Handle sign in
    const { email, password, signInLoading, cognitoSignIn } = signIn()
    email.value = props.email //Pass in email and password from props
    password.value = props.password

    //Sign in function
    const confirmPageSignIn = async () => {
      try {
        await cognitoSignIn ()
        const user = await Auth.currentAuthenticatedUser()
        await Auth.updateUserAttributes(user, { //Update the preferred username 
          preferred_username: p_username.value
        })
        router.push({ name: 'CardDecks' })
      } catch (error) {
        console.log(error)
      }
    }
      
    return { 
      confirmForm, 
      code,
      p_username, 
      confirmLoading,  
      confirmed, 
      confirmError, 
      confirmAcc,
      confirmPageSignIn, 
      signInLoading, 
      validation 
    }
  }
}
</script>