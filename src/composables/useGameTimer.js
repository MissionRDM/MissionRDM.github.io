import { ref, computed, onUnmounted } from 'vue'

export function useGameTimer() {
  // Timer state
  const timeElapsed = ref(0)
  const timer = ref(null)

  // Computed properties
  const formattedTime = computed(() => {
    const remaining = Math.max(0, 900 - timeElapsed.value)
    const minutes = Math.floor(remaining / 60)
    const seconds = remaining % 60
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  })

  // Timer methods
  const startTimer = () => {
    timer.value = setInterval(() => {
      timeElapsed.value++
    }, 1000)
  }

  const stopTimer = () => {
    if (timer.value) {
      clearInterval(timer.value)
      timer.value = null
    }
  }
  
  // Cleanup
  onUnmounted(() => {
    stopTimer()
  })

  return {
    // State
    timeElapsed,
    
    // Computed
    formattedTime,
    
    // Methods
    startTimer,
    stopTimer,
  }
}