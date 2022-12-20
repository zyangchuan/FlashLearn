<template>
    <div class="d-flex flex-column
    align-center
    fillheight">
    
        <div class="my-10">
            <h1 class="text-h4 font-weight-light">FlashLearn</h1>
        </div>

        <v-card class="pa-7" width="500" height="690">
            <p 
            class="text-h4 
            font-weight-medium 
            text-center">
                Sign up
            </p>
        
            <div class="mx-4 my-10">

                <p class="caption
                font-weight-light
                text-uppercase
                ma-2 ml-0">
                Username
                </p>

                <v-text-field label="Username"></v-text-field>

                <p class="caption
                font-weight-light
                text-uppercase
                ma-2 ml-0">
                Email address
                </p>

                <v-text-field type="email" label="Email Address"></v-text-field>

                <p class="caption
                font-weight-light
                text-uppercase
                ma-2 ml-0">
                Confirm email address
                </p>

                <v-text-field type="email" label="Email Address"></v-text-field>

                <p class="caption
                font-weight-light
                text-uppercase
                ma-2 ml-0">
                Password
                </p>

                <v-text-field type="password" label="Password"></v-text-field>

            </div>

            <div class="mx-4">
                <v-btn flat>Sign up</v-btn>
                <v-btn flat v-bind:to="{ name: 'Signin' }">Sign in</v-btn>
            </div>

        </v-card>
    
    </div>
</template>

<script>
export default {

}
</script>

<style>

</style>