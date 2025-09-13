import { useGameState } from '@/composables/useGameState'
import { useGameTimer } from '@/composables/useGameTimer'
import { useQuizSystem } from '@/composables/useQuizSystem'
import { 
  gameObjects, 
  quizzes
} from '@/utils/gameConfig'

// This composable combines game state management, timer functionality, and quiz system into a single interface
// It provides methods to start the game, handle quiz interactions, and manage the game flow
// It also ensures that the game timer and quiz system are synchronized with the game state
export function useEmergencyGame() {
  // Initialize all sub-composables
  const gameState = useGameState()
  const timer = useGameTimer()
  const quiz = useQuizSystem(quizzes)

  // Enhanced methods that coordinate between systems
  const startChallenge = () => {
    gameState.startChallenge()
    timer.startTimer()
  }

  // Handle click on game objects to open quizzes
  // This function checks if the object exists and if the quiz is not completed before opening it
  const handleObjectClick = (objectId) => {
    if (gameObjects[objectId] && !quiz.completedQuizzes.value.has(objectId)) {
      quiz.openQuiz(objectId)
    } else if (quiz.completedQuizzes.value.has(objectId)) {
      // Allow review of completed quizzes
      quiz.openQuiz(objectId)
    }
  }

  // Submit the answer for the current quiz
  // This function checks if the answer is correct and updates the game state accordingly
  const submitAnswer = () => {
    const result = quiz.submitAnswer()
    if (result.success) {
      // Check if all 6 quizzes are completed
      if (quiz.completedQuizzes.value.size === 6) {
        gameState.completeGame()
        timer.stopTimer()
      }
      return true
    }
    return false
  }

  return {
    showIntroduction: gameState.showIntroduction,
    gameCompleted: gameState.gameCompleted,
    timeElapsed: timer.timeElapsed,
    currentQuiz: quiz.currentQuiz,
    selectedAnswer: quiz.selectedAnswer,
    quizError: quiz.quizError,
    completedQuizzes: quiz.completedQuizzes,
    
    // Configuration
    gameObjects,
    quizzes,
    formattedTime: timer.formattedTime,
    startTimer: timer.startTimer,
    returnEndScreen: gameState.returnEndScreen,
    startChallenge,
    openQuiz: quiz.openQuiz,
    closeQuiz: quiz.closeQuiz,
    submitAnswer,
    handleObjectClick
  }
}