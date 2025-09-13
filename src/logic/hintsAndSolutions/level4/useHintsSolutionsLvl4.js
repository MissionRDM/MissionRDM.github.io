import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useGameInfo } from '@/store/gameInfo'

export function useHintsSolutionsLvl4() {
  const { t } = useI18n()
  const game = useGameInfo()

  // Determine current step based on Level 4 game logic
  const getCurrentStep = () => {
    const codes = game.enteredCodes

    // Step 13: Final step - enter 47 to complete level
    if (game.currentScenarioImage === 'eighth' && codes.includes('17') || codes.includes('32')) {
      return 'thirteenth'
    }

    // Step 12: In seventh scenario after second hint found, need to enter language code (17 or 32)
    if (game.currentScenarioImage === 'seventh' && game.secondHintFound && game.callSequence['Santiago'] >= 3) {
      return 'twelfth'
    }

    // Step 11: In seventh scenario after Santiago second call, need to call Santiago again
    if (game.currentScenarioImage === 'seventh' && game.secondHintFound && game.callSequence['Santiago'] >= 2 && !codes.includes('3')) {
      return 'eleventh'
    }

    // Step 10: In seventh scenario after Santiago second call, before finding second hint
    if (game.currentScenarioImage === 'seventh' && !game.secondHintFound && game.callSequence['Santiago'] >= 2) {
      return 'tenth'
    }

    // Step 9: In sixth scenario after entering 1 and open the file enter '61'
    if (game.currentScenarioImage === 'sixth' && game.callSequence['Santiago'] >= 1 && game.firstHintFound) {
      return 'ninth'
    }

    // Step 8: In sixth scenario after Santiago first call, need to enter 1
    if (game.currentScenarioImage === 'sixth' && game.callSequence['Santiago'] >= 1 && !game.firstHintFound) {
      return 'eighth'
    }

    // Step 7: In fifth scenario, need to call Santiago
    if (game.currentScenarioImage === 'fifth' && codes.includes('81')) {
      return 'seventh'
    }

    // Step 6: In fourth scenario, need to enter 81
    if (game.currentScenarioImage === 'fourth' && codes.includes('23')) {
      return 'sixth'
    }

    // Step 5: In third scenario after Inès call, need to enter 23
    if (game.currentScenarioImage === 'third' && codes.includes('4') && codes.includes('51') && game.callSequence['Inès'] >= 1) {
      return 'fifth'
    }

    // Step 4: In third scenario after Inès call, need to enter 51
    if (game.currentScenarioImage === 'third' && codes.includes('4') && game.callSequence['Inès'] >= 1 && !codes.includes('51')) {
      return 'fourth'
    }

    // Step 3: In third scenario after Inès call, need to enter 4
    if (game.currentScenarioImage === 'third' && game.callSequence['Inès'] >= 1 && !codes.includes('4')) {
      return 'third'
    }

    // Step 2: In second scenario, need to call Inès
    if (game.currentScenarioImage === 'second' && codes.includes('44')) {
      return 'second'
    }

    // Step 1: Initial state, need to enter 44
    if (codes.length === 0 || !codes.includes('44')) {
      return 'first'
    }

    // Default fallback
    return 'first'
  }

  // Get current hints
  const currentHint = computed(() => {
    const step = getCurrentStep()
    return t(`level4.hints.${step}`)
  })

  const currentSolution = computed(() => {
    const step = getCurrentStep()
    return t(`level4.solutions.${step}`)
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