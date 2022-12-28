<template>
	<div 
		class="d-flex flex-column
		justify-center
		align-center
		fill-height">
	
		<div class="my-10">
				<h1 class="text-h4 font-weight-light">FlashLearn</h1>
		</div>

		<v-card class="pa-7" width="500" v-if="!unconfirmed">
			<p 
				class="text-h4
				mb-4 
				font-weight-medium 
				text-center">
				Sign up
			</p>
	
			<div class="mx-4 mt-6 mb-2">

				<p 
					class="caption
					font-weight-light
					text-uppercase
					ma-2 ml-0">
					Email address
				</p>

				<v-text-field 
          type="email" 
          label="Email Address" 
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
          v-model="password"
          v-bind:rules="[required, lengthCheck, letterCheck, numberCheck]">
        </v-text-field>

				<p 
					class="caption
					font-weight-light
					text-uppercase
					ma-2 ml-0">
					Confirm Password
				</p>

				<v-text-field
          type="password" 
          label="Password" 
          v-model="cpassword" 
          v-bind:rules="[matchingPass]">
        </v-text-field>

			</div>

			<p class="text-center text-red">{{ errorMsg }}</p>

			<div class="ma-4">
        <v-btn flat v-on:click="register">Sign up</v-btn>
        <v-btn flat v-bind:to="{ name: 'Signin' }">Sign in</v-btn>
			</div>

		</v-card>

		<ConfirmSignup
      v-bind:email="this.email" 
      v-bind:password="this.password" 
      v-bind:resendCode="false"
      v-if="unconfirmed" />
	
	</div>
</template>

<script>
import ConfirmSignup from "../components/ConfirmSignup.vue"
import { Auth } from "aws-amplify"

export default {
	components: { ConfirmSignup },
	data () {
		return {
			email: "",
			password: "",
			cpassword: "", //confirm password field
      validated: false, //check if passwords match
			unconfirmed: false, //if unconfirmed, render confirmation page
			errorMsg: "" //for alerting account already exisiting
		}
	},
	methods: {
		async register () {
			if (this.validated) {
				try {
				const { user } = await Auth.signUp({
					username: this.email,
					password: this.password,
					attributes: {
						email: this.email
					}
				})
				console.log(user)
				this.unconfirmed = true
				} catch (error) {
				console.log("signup error: ", error)
				if (error.name === "UsernameExistsException") {
					this.errorMsg = "An account with the given email already exists."
				}
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
		matchingPass () {
			if (this.cpassword === this.password) {
        this.validated = true
				return true
			} else {
        this.validated = false
				return "Passwords do not match."
			}
		},
    lengthCheck (value) {
      if (value.length >= 8) {
        return true
      } else {
        return "Password must be at least 8 characters long."
      }
    },
    letterCheck (value) {
      if (/[a-z]/.test(value)) {
        return true
      } else {
        return "Password must include a lower case letter."
      }
    },
    numberCheck (value) {
      if (/[0-9]/.test(value)) {
        return true
      } else {
        return "Password must include a number."
      }
    }
	}
}
</script>

<style>

</style>