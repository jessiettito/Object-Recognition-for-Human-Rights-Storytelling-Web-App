import { createRouter, createWebHistory } from 'vue-router'
import WelcomeScreen from './presentation/screens/WelcomeScreen.vue'
import CaptureScreen from "./presentation/screens/CaptureScreens.vue";
import ListScreen from './presentation/screens/ListScreen.vue'

const routes = [
  { path: '/', component: WelcomeScreen },
  { path: "/capture", component: CaptureScreen },
  { path: '/list', component: ListScreen }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
