import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useGameInfo } from '@/store/gameInfo'

export function useHintsSolutionsLvl3() {
  const { t } = useI18n()
  const game = useGameInfo()

  // Determine current step based on your exact game logic
  const getCurrentStep = () => {
    const codes = game.enteredCodes

    // Step 1: (ninth hint) find number 99
    if (game.secondHintFound) {
      return 'tenth'
    }

    // Step 2: (eighth hint) code 64 entered
    if (codes.includes('64') && !game.secondHintFound) {
      return 'ninth'
    }

    // Step 3: (seventh hint) code 22 entered
    if (codes.includes('22') && !game.secondHintFound) {
      return 'eighth'
    }

    // Step 4: (sixth hint) code 77 entered
    if (codes.includes('77') && !game.secondHintFound) {
      return 'seventh'
    }

    // Step 5: (fifth hint) code 59 / 58 / 57 entered
    if (codes.includes('59') && codes.includes('58') && codes.includes('57')) {
      return 'sixth'
    }

    // Step 5: (fifth hint) game firstHintFound is true and patience is true
    if (game.clickedElement && game.patience) {
      return 'fifth'
    }

    // Step 6: (fourth hint) game firstHintFound is true and patience is false
    if (game.clickedElement && !game.patience) {
      return 'fourth'
    }

    // Step 7: (third hint) code 33 entered
    if (codes.includes('33')) {
      return 'third'
    }

    // Step 8: (second hint) code 17 entered
    if (codes.length === 0 && game.firstHintFound) {
      return 'second'
    }

    // Step 9: (first hint) no codes entered
    if (codes.length === 0) {
      return 'first'
    }

    // Default fallback
    return 'first'
  }

  // Get current hints
  const currentHint = computed(() => {
    const step = getCurrentStep()
    return t(`level3.hints.${step}`)
  })

  const currentSolution = computed(() => {
    const step = getCurrentStep()
    return t(`level3.solutions.${step}`)
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