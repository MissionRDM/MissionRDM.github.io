import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useGameInfo } from '@/store/gameInfo'

export function useHintsSolutionsLvl1() {
  const { t } = useI18n()
  const game = useGameInfo()

  // Determine current step based on your exact game logic
  const getCurrentStep = () => {
    const codes = game.enteredCodes
    
    // Step 8: Has code 28, looking for code 88 to continue
    if (game.currentScenarioImage === 'congrats') {
      return 'eigth'
    }

    // Step 7: Has code 26, looking for code 28
    if (game.currentScenarioImage === 'final') {
      return 'seventh'
    }

    // Step 6: Has code 21, looking for code 26
    if (game.currentScenarioImage === 'third') {
      return 'sixth'
    }

    // Step 5: Riddle solved, looking for code 21
    if (game.currentScenarioImage === 'updated') {
      return 'fifth'
    }

    // Step 4: Has code 29 but riddle not solved yet (waiting for riddle solution)
    if (game.secondHintFound && !game.riddleSolved) {
      return 'fourth'
    }

    // Step 3: Has codes 8 and 4, looking for code 29
    if (codes.includes('8') && codes.includes('4') && !game.secondHintFound) {
      return 'third'
    }

    // Step 2: Looking for code 8 (empty codes or just started)
    if ((game.firstHintFound && !codes.includes('4')) || ((game.riddleSolved && game.firstHintFound))) {
      return 'second'
    }

    // Step 1: Has code 8, looking for code 4
    if (codes.length === 0 || (game.riddleSolved && !game.firstHintFound)) {
      return 'first'
    }

    // Default fallback
    return 'first'
  }

  // Get current hints
  const currentHint = computed(() => {
    const step = getCurrentStep()
    return t(`level1.hints.${step}`)
  })

  const currentSolution = computed(() => {
    const step = getCurrentStep()
    return t(`level1.solutions.${step}`)
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