import { ref } from 'vue'

// This composable manages the quiz system for the game
// It handles quiz state, user answers, and quiz completion logic
export function useQuizSystem(quizzes) {
  // Quiz state
  const currentQuiz = ref(null)
  const selectedAnswer = ref(null)
  const quizError = ref('')
  const completedQuizzes = ref(new Set())

  // Quiz methods
  const openQuiz = (quizId) => {
    currentQuiz.value = quizzes[quizId]
    selectedAnswer.value = null
    quizError.value = ''
  }

  const closeQuiz = () => {
    currentQuiz.value = null
    selectedAnswer.value = null
    quizError.value = ''
  }

  const submitAnswer = () => {
    if (selectedAnswer.value === null) return false
    
    const quiz = currentQuiz.value
    if (selectedAnswer.value === quiz.correctAnswer) {
      completedQuizzes.value.add(quiz.id)
      closeQuiz()
      return { success: true, color: quiz.color }
    } else {
      quizError.value = 'emergencyGame.errors.incorrectAnswer'
      selectedAnswer.value = null
      return { success: false }
    }
  }

  const reviewToken = (index, collectedTokens) => {
    if (collectedTokens[index]) {
      const color = collectedTokens[index]
      const quizId = Object.keys(quizzes).find(id => quizzes[id].color === color)
      if (quizId) openQuiz(quizId)
    }
  }

  return {
    // State
    currentQuiz,
    selectedAnswer,
    quizError,
    completedQuizzes,
    
    // Methods
    openQuiz,
    closeQuiz,
    submitAnswer,
    reviewToken
  }
}