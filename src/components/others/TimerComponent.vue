<!-- TimerComponent.vue: A component for displaying and managing the game timer -->
<template>
  <div class="bg-gray-800 text-white px-6 py-1 rounded-lg text-center shadow-sm font-mono text-lg sm:text-xl lg:text-2xl border-2 border-black">
    Time: {{ time }}
    <div v-if="penaltySeconds > 0" class="text-red-400 text-sm">
      +{{ penaltySeconds }}s penalty
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, provide } from 'vue'

const time = ref('00:00')
const penaltySeconds = ref(0)
let seconds = 0
let intervalId = null

// Start the timer when the component is mounted
onMounted(() => {
  intervalId = setInterval(() => {
    seconds++
    const mins = String(Math.floor(seconds / 60)).padStart(2, '0')
    const secs = String(seconds % 60).padStart(2, '0')
    time.value = `${mins}:${secs}`
  }, 1000)
})

// Add penalty method
const addPenalty = (penaltyTime) => {
  seconds += penaltyTime
  penaltySeconds.value += penaltyTime
  
  // Show penalty indicator briefly
  setTimeout(() => {
    penaltySeconds.value = 0
  }, 3000)
}

// Get current time in seconds
const getCurrentTimeInSeconds = () => {
  return seconds
}

// Get start time (you might want to track this for level completion)
const getStartTime = () => {
  return Date.now() - (seconds * 1000)
}

// Reset timer (for new levels)
const resetTimer = () => {
  seconds = 0
  penaltySeconds.value = 0
  time.value = '00:00'
}

// Stop timer
const stopTimer = () => {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
}

// Provide timer methods to child components
provide('timer', {
  addPenalty,
  getCurrentTimeInSeconds,
  getStartTime,
  resetTimer,
  stopTimer
})

// Expose methods for parent components
defineExpose({
  addPenalty,
  getCurrentTimeInSeconds,
  getStartTime,
  resetTimer,
  stopTimer
})
</script>