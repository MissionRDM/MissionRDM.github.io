import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useGameInfo } from '@/store/gameInfo'

export function useHintsSolutionsLvl6() {
  const { t } = useI18n()
  const game = useGameInfo()

  // Determine current step based on Level 6 game logic
  const getCurrentStep = () => {
    const codes = game.enteredCodes

    // Fourth step: user has to enter '1323' to complete level
    if (game.currentScenarioImage === 'fourth') {
      return 'fourth'
    }

    // Third step: user has to enter '36' to complete level
    if (game.currentScenarioImage === 'third') {
      return 'third'
    } 

    // Second step: user enters code '2' to change scenario to second
    if (codes.includes('2') && game.currentScenarioImage === 'second' && !game.firstHintFound) {
      return 'second'
    }

    // First step: game.enteredCodes.length === 0 enters the first code
    if (game.enteredCodes.length === 0) {
      return 'first'
    }

    // Default fallback
    return 'first'
  }

  // Get current hints
  const currentHint = computed(() => {
    const step = getCurrentStep()
    return t(`level6.hints.${step}`)
  })

  const currentSolution = computed(() => {
    const step = getCurrentStep()
    return t(`level6.solutions.${step}`)
  })

  const showClues = () => {
    game.showHints('clues')
  }

  const showSolutions = () => {
    game.showHints('solutions')
  }

  const closeHints = () => {
    game.closeHints()
  }

  return {
    currentHint,
    currentSolution,
    showClues,
    showSolutions,
    closeHints,
    showHintModal: computed(() => game.showHintModal),
    hintModalType: computed(() => game.hintModalType),
    getCurrentStep 
  }
}