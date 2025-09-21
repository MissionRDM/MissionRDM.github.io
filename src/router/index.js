import { createRouter, createWebHashHistory } from 'vue-router'
import Introduction from '@/pages/introduction/Introduction.vue'
import StartScreen from '@/pages/StartScreen.vue'
import Level1 from '@/pages/level1/Level1.vue' 
import Level2 from '@/pages/level2/Level2.vue'
import Level3 from '@/pages/level3/Level3.vue'
import Level4 from '@/pages/level4/Level4.vue'
import Level5 from '@/pages/level5/Level5.vue'
import Level6 from '@/pages/level6/Level6.vue'
import LevelEnd from '@/pages/levelEnd/LevelEnd.vue'
import LevelQuiz from '@/pages/levelQuiz/LevelQuiz.vue'

// This file sets up the Vue Router for the MissionRDM game, defining routes for each level and the introduction screen.
// Each route corresponds to a specific component that represents a level or screen in the game.
const routes = [
  {
    path: '/',
    name: 'StartScreen',
    component: StartScreen
  },
  {
    path: '/introduction',
    name: 'Introduction',
    component: Introduction
  },
  {
    path: '/level/1',
    name: 'Level1',
    component: Level1
  },
  {
    path: '/level/2',
    name: 'Level2',
    component: Level2
  },
  {
    path: '/level/3',
    name: 'Level3',
    component: Level3
  },
  {
    path: '/level/4',
    name: 'Level4',
    component: Level4
  },
  {
    path: '/level/5',
    name: 'Level5',
    component: Level5
  },
  {
    path: '/level/6',
    name: 'Level6',
    component: Level6
  },
  {
    path: '/level/end',
    name: 'LevelEnd',
    component: LevelEnd
  },
  {
    path: '/level/quiz',
    name: 'LevelQuiz',
    component: LevelQuiz
  }
]

// Create the router instance with the defined routes and history mode
// Using createWebHashHistory for hash-based routing 
const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
