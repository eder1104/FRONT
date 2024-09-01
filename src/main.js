import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { Quasar } from 'quasar'
import { Notify } from 'quasar'
import { router } from "./routes/routes.js"
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

// Import icon libraries
import '@quasar/extras/material-icons/material-icons.css'

// Import Quasar css
import 'quasar/src/css/index.sass'

// Assumes your root component is App.vuer
// and placed in same folder as main.js
import App from './App.vue'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
const myApp = createApp(App)

myApp.use(router)

myApp.use(Quasar, {
  plugins: {Notify}, // import Quasar plugins and add here
})

myApp.use(pinia)

// Assumes you have a <div id="app"></div> in your index.html
myApp.mount('#app')