import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useGameInfo } from '@/store/gameInfo'

export function useHintsSolutionsLvl2() {
  const { t } = useI18n()
  const game = useGameInfo()

  // Determine current step based on your exact game logic
  const getCurrentStep = () => {
    const codes = game.enteredCodes

    // Step 1: (eighth hint) scenarion is main and game.firstHintFound is true
    if (game.currentScenarioImage === 'main' && game.firstHintFound) {
      return 'eighth'
    }

    // Step 2: (seventh hint) scenario image is 'main'
    if (game.currentScenarioImage === 'main') {
      return 'seventh'
    }

    // Step 3: (sixth hint) code 36 entered
    if (codes.includes('36')) {
      return 'sixth'
    }

    // Step 4: (fifth hint) code 1 entered
    if (codes.includes('1')) {
      return 'fifth'
    }

    // Step 5: (fourth hint) code 31 entered
    if (codes.includes('31')) {
      return 'fourth'
    }

    // Step 6: (third hint) code 15 entered
    if (codes.includes('15')) {
      return 'third'
    }

    // Step 7: (second hint) found 9
    if (codes.includes('9')) {
      return 'second'
    }

    // Step 8: (first hint) no codes entered
    if (codes.length === 0) {
      return 'first'
    }

    // Default fallback
    return 'first'
  }

  // Get current hints
  const currentHint = computed(() => {
    const step = getCurrentStep()
    return t(`level2.hints.${step}`)
  })

  const currentSolution = computed(() => {
    const step = getCurrentStep()
    return t(`level2.solutions.${step}`)
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