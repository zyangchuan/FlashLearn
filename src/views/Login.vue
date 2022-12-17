<template>  
  <div class="d-flex flex-sm-column flex-md-row 
  justify-center 
  align-center 
  fill-height">
    
    <div class="my-10 hidden-md-and-up">
      <h1 class="text-h4 font-weight-light">The Revision App</h1>
    </div>

    <v-card class="pa-7" width="500" height="600">

      <p class="text-h4 
      font-weight-bold 
      text-center">
        Welcome
      </p>

      <p class="text-subtitle-1 
      font-weight-medium 
      text-center
      ma-2">
        Login to begin!
      </p>
      
      <div class="mx-4 my-15">

        <p class="caption
        font-weight-light
        text-uppercase
        ma-2">
          Username or email
        </p>

        <v-text-field label="Username/Email" prepend-inner-icon="mdi-account"></v-text-field>

        <p class="caption
        font-weight-light
        text-uppercase
        ma-2">
          Password
        </p>

        <v-text-field type="password" label="Password" prepend-inner-icon="mdi-key"></v-text-field>

      </div>

      <div class="d-flex flex-column align-center">
        <v-btn color="white" size="large"
        v-bind:to="{ name: 'Decks' }">
          <v-icon icon="mdi-login" class="mr-2"></v-icon>
          <span>Login</span>
        </v-btn>

        <v-btn flat class="my-4">Register</v-btn>
      </div>

    </v-card>
    
    <div class="largetitle hidden-sm-and-down ml-16">
      <h1 class="text-h1 font-weight-light">The</h1>
      <h1 class="text-h1 font-weight-light">Revision</h1>
      <h1 class="text-h1 font-weight-light">App</h1>
    </div>   

  </div>
</template>

<script>
import { defineComponent } from 'vue';

// Components

export default defineComponent({
  name: 'Login',

  components: {  },
});
</script>


