import { createRouter, createWebHistory } from 'vue-router'
import WelcomeScreen from './presentation/screens/WelcomeScreen.vue'
import CaptureScreen from "./presentation/screens/CaptureScreen.vue";
import ResultScreen from "./presentation/screens/ResultScreen.vue";
import ListScreen from './presentation/screens/ListScreen.vue';
import ThemesScreen from './presentation/screens/ThemesScreen.vue';
import StoryScreen from './presentation/screens/StoryScreen.vue';
import FullStoryScreen from './presentation/screens/FullStoryScreen.vue';

const routes = [
  { path: '/', component: WelcomeScreen },
  { path: '/capture', component: CaptureScreen },
  { path: '/list', component: ListScreen },
  { path: '/story', component: StoryScreen },
  { path: '/result', component: ResultScreen },
  { path: '/themes', component: ThemesScreen },
  { path: '/stories/:storyId', component: FullStoryScreen },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
