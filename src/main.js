import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'

import { store } from './store/store'

import { Amplify, Auth } from 'aws-amplify'
import awsconfig from './aws-exports'

const updatedAwsConfig = {
  ...awsconfig,
  aws_cognito_identity_pool_id: "ap-southeast-1:614b8fbe-7c03-467b-b4ad-6161668e5637",
  oauth: {
    ...awsconfig.oauth,
    scope: [
      "phone",
      "email",
      "openid",
      "profile",
      "aws.cognito.signin.user.admin"
    ],
    redirectSignIn: "https://www.flashlearn.io/card-decks",
    redirectSignOut: "https://www.flashlearn.io/sign-in",
    responseType: "code"
  },
  federationTarget: "COGNITO_USER_POOLS",
  aws_cognito_username_attributes: ["EMAIL"]
}

Amplify.configure(updatedAwsConfig)

loadFonts()

createApp(App)
  .use(router)
  .use(store)
  .use(vuetify)
  .mount('#app')
