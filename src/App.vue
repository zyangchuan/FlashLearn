<template>
  <v-app>
    <v-main>
      <Navbar v-if="isSignedIn()"/>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
import { onMounted, watchEffect } from '@vue/runtime-core'
import { useStore } from 'vuex'
import Navbar from "./components/Navbar.vue"
import { useRoute, useRouter } from 'vue-router'
import { Auth, Hub } from 'aws-amplify'
import axios from 'axios'

export default {
  components: { Navbar },
  setup() {
    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    
    const isSignedIn = () => {
      return store.getters.isAuthenticated
    }
    //If there is no user, return to sign in page
    watchEffect(() => {
      Auth.currentAuthenticatedUser()
        .catch(error => {
          store.commit("setCurrentUser", null);
        })
      if (!store.getters.isAuthenticated & route.name !== 'Signup' ) {
        router.push({ name: "Signin" })
      }
    })
    
    //If user token expired, return to sign in page
    onMounted(() => {
      axios.interceptors.response.use(null, error => {
        if (error.response.data.message == "The incoming token has expired") {
          Auth.signOut()
            .then(() => {
              store.commit("setCurrentUser", null)
            })
            .catch(error => {
              console.log(error)
            })
        }
      })
    })

    return { isSignedIn }
  }
}
</script>

<style>
  .link {
    text-decoration: none;
    color: lightskyblue;
  }
  .link:hover {
    color: lightblue;
  }
  .v-overlay__content {
    width: 100%;
    padding: 15px;
  }
  .v-progress-circular {
    display: block;
    margin: auto;
  }
  .avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: url("@/assets/avatar.jpg");
    background-position: 50% 50%;
    background-size: cover;
  }
</style>