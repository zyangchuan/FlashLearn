import { ref } from 'vue'
import { Auth } from "aws-amplify"
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

export const signIn = () => {
  const store = useStore()

  //Sign in variables
  const email = ref("")
  const password = ref("")
  const signInLoading = ref(false) //Loading spinner for the sign in button
  
  const cognitoSignIn = async () => {
    try {
      signInLoading.value = true
      await Auth.signIn(email.value, password.value) //Sign in via aws cognito
      store.dispatch("setAuthentication") //Set the current user in the global state
    
    } catch (error) {
      console.log(error)
      signInLoading.value = false
      throw error
    }
  }

  return { email, password, signInLoading, cognitoSignIn }
}

export const signUp = () => {
  //Sign up variables
  const email = ref("")
  const password = ref("")
  const cpassword = ref("")
  const signUpLoading = ref(false) //Loading spinner for sign up button

  //Sign up function
  const cognitoSignUp = async () => {
    try {
      signUpLoading.value = true
      await Auth.signUp({ //Sign up via aws cognito
        username: email.value,
        password: password.value,
        attributes: {
          email: email.value
        }
      })

    } catch (error) {
      console.log(error)
      signUpLoading.value = false
      throw error
    }
  }

  return { email, password, cpassword, signUpLoading, cognitoSignUp }
}
