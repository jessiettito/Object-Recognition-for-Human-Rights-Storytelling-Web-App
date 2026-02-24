import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router.js'  // import the router

createApp(App)
  .use(router) 
  .mount('#app')