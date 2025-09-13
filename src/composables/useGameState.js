import { ref } from 'vue'

// This composable manages the game state for the introduction and completion of the game
export function useGameState() {
  // Game flow state
  const showIntroduction = ref(true)
  const gameCompleted = ref(false)

  // Game flow methods
  const returnEndScreen = () => {
    return 'returnEndScreen'
  }

  const startChallenge = () => {
    showIntroduction.value = false
  }

  const completeGame = () => {
    gameCompleted.value = true
  }

  return {
    // State
    showIntroduction,
    gameCompleted,
    
    // Methods
    returnEndScreen,
    startChallenge,
    completeGame
  }
}