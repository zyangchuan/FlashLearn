import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'

import { store } from './store/store'

import { Amplify, Auth } from 'aws-amplify'
import awsconfig from './aws-exports'
Amplify.configure(awsconfig)

loadFonts()

createApp(App)
  .use(router)
  .use(store)
  .use(vuetify)
  .mount('#app')
