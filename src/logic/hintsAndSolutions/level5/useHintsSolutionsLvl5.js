import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useGameInfo } from '@/store/gameInfo'

export function useHintsSolutionsLvl5() {
  const { t } = useI18n()
  const game = useGameInfo()

  // Determine current step based on Level 5 game logic
  const getCurrentStep = () => {
    const codes = game.enteredCodes

    // Step 12: Final step - enter 3 to complete level (drawing on tablet)
    if (game.currentScenarioImage === 'ninth' && codes.includes('84')) {
      return 'twelfth'
    }

    // Step 11: In eighth scenario with active riddle, need to enter 84 (DOI identifier)
    if (game.currentScenarioImage === 'eighth' && game.activeRiddle && codes.includes('6')) {
      return 'eleventh'
    }

    // Step 10: In eighth scenario after Inès call, need to call Inès for help
    if (game.currentScenarioImage === 'eighth' && !game.activeRiddle) {
      return 'tenth'
    }

    // Step 9: In seventh scenario after third hint found, need to enter 6 (copyright license)
    if (game.currentScenarioImage === 'seventh' && game.thirdHintFound) {
      return 'ninth'
    }

    // Step 8: In seventh scenario after Jack call, need to enter 8 (hint code for CopyEIGHT.pdf)
    if (game.currentScenarioImage === 'seventh' && !game.thirdHintFound) {
      return 'eighth'
    }

    // Step 7: In sixth scenario, need to call Jack for help
    if (game.currentScenarioImage === 'sixth' && codes.includes('96')) {
      return 'seventh'
    }

    // Step 6: In fifth scenario with second hint found, need to enter 96 (access conditions)
    if (game.currentScenarioImage === 'fifth' && game.secondHintFound && codes.includes('71')) {
      return 'sixth'
    }

    // Step 5: In fifth scenario after entering 71, need to enter 5 (hint code for access conditions)
    if (game.currentScenarioImage === 'fifth' && codes.includes('71') && !game.secondHintFound) {
      return 'fifth'
    }

    // Step 4: In fourth scenario after Santiago call, need to solve riddle (enter 71 - repository choice)
    if (game.currentScenarioImage === 'fourth') {
      return 'fourth'
    }

    // Step 3: In third scenario, need to call Santiago for help
    if (game.currentScenarioImage === 'third') {
      return 'third'
    }

    // Step 2: After first hint found, need to enter 19 (Chicago COVID-19 response)
    if (game.currentScenarioImage == 'second') {
      return 'second'
    }

    // Step 1: Very beginning, need to enter 3 (re3data.org)
    if (game.currentScenarioImage == "default") {
      return 'first'
    }

    // Default fallback
    return 'first'
  }

  // Get current hints
  const currentHint = computed(() => {
    const step = getCurrentStep()
    return t(`level5.hints.${step}`)
  })

  const currentSolution = computed(() => {
    const step = getCurrentStep()
    return t(`level5.solutions.${step}`)
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