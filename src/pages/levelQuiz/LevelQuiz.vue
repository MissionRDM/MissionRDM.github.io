<!-- EmergencyGameComponent.vue - SIMPLIFIED VERSION -->
<template>
  <div class="min-h-screen bg-[#121212] text-gray-200 font-mono relative overflow-hidden">
    <!-- Back Button -->
    <div class="absolute top-4 left-4 z-50">
      <button 
        @click="goBackToEnd"
        class="bg-gray-700/80 hover:bg-gray-600 border border-gray-600 text-gray-200 font-medium py-2 px-3 rounded-lg transition-colors flex items-center justify-center"
      >
        ⬅️
      </button>
    </div>

    <!-- Timer -->
    <div class="absolute top-4 right-4 z-50">
      <TimerComponent 
        ref="timerRef"
        class="bg-red-900/80 border border-red-600 rounded-lg"
      />
    </div>

    <!-- Introduction Modal -->
    <EmergencyIntroModal 
      :visible="showIntroduction"
      @returnEndScreen="handleReturnEndScreen"
      @start-challenge="startChallenge"
    />

    <!-- Main Game Area -->
    <EmergencyGameArea 
      v-if="!showIntroduction && !gameCompleted"
      :gameObjects="gameObjects"
      :completedQuizzes="completedQuizzes"
      @object-click="handleObjectClick"
    />

    <!-- Quiz Modal -->
    <QuizModalComponent
      :visible="!!currentQuiz"
      :quiz="currentQuiz"
      v-model:selectedAnswer="selectedAnswer"
      :quizError="quizError"
      :isCompleted="currentQuiz ? completedQuizzes.has(currentQuiz.id) : false"
      :emoji="currentQuiz ? gameObjects[currentQuiz.id]?.emoji : '❓'"
      @close="closeQuiz"
      @submit="submitAnswer"
    />



    <!-- Success Modal -->
    <CongratsModalComponent
      :visible="gameCompleted"
      :level="7" 
      :steps="completionSteps"
      @continue="handleContinueToEndScreen"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useEmergencyGame } from '@/composables/useLevelQuiz.js'
import TimerComponent from '@/components/others/TimerComponent.vue'
import QuizModalComponent from '@/components/riddle/QuizModalComponent.vue'
import CongratsModalComponent from '@/components/others/CongratsModalComponent.vue'
import EmergencyIntroModal from '@/components/tutorial/QuizIntroComponent.vue'
import EmergencyGameArea from '@/components/scenario/QuizGameAreaComponent.vue'

import router from '@/router'

const { t } = useI18n()
defineEmits(['complete'])

// Use the simplified composable
const {
  showIntroduction,
  gameCompleted,
  timeElapsed,
  currentQuiz,
  selectedAnswer,
  quizError,
  completedQuizzes,
  gameObjects,
  startChallenge,
  returnEndScreen,
  openQuiz,
  closeQuiz,
  submitAnswer,
  handleObjectClick
} = useEmergencyGame()

// Local state
const timerRef = ref(null)

// Computed properties
const completionSteps = computed(() => [
  {
    label: t('emergencyGame.success.title'),
    items: [
      t('emergencyGame.success.message', { 
        minutes: Math.floor((900 - timeElapsed.value) / 60) 
      })
    ]
  }
])

// Event handlers
const handleReturnEndScreen = () => {
  const result = returnEndScreen()
  if (result === 'returnEndScreen') {
    router.push('/level/end')
  }
}

const handleContinueToEndScreen = () => {
  router.push('/level/end')
}

const goBackToEnd = () => {
  router.push('/level/end')
}
</script>