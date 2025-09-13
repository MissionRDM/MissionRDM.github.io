import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useHintsSolutionsLvl6 } from '@/logic/hintsAndSolutions/level6/useHintsSolutionsLvl6.js'
import { useGameInfo } from '@/store/gameInfo.js'

// Mock vue-i18n
vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: vi.fn((key) => `translated_${key}`)
  })
}))

describe('useHintsSolutionsLvl6', () => {
  let store, hints

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useGameInfo()
    hints = useHintsSolutionsLvl6()
    vi.clearAllMocks()
  })

  describe('getCurrentStep logic', () => {
    it('returns "first" for empty codes array', () => {
      store.enteredCodes = []
      
      expect(hints.getCurrentStep()).toBe('first')
    })

    it('returns "second" when code 2 entered but hint not found', () => {
      store.enteredCodes = ['2']
      store.currentScenarioImage = 'second'
      store.firstHintFound = false
      
      expect(hints.getCurrentStep()).toBe('second')
    })

    it('returns "third" when in third scenario', () => {
      store.currentScenarioImage = 'third'
      store.enteredCodes = ['2', '1']
      store.firstHintFound = true
      
      expect(hints.getCurrentStep()).toBe('third')
    })

    it('returns "fourth" when in fourth scenario', () => {
      store.currentScenarioImage = 'fourth'
      store.enteredCodes = ['2', '1']
      store.firstHintFound = true
      
      expect(hints.getCurrentStep()).toBe('fourth')
    })

    it('falls back to "first" for unexpected states', () => {
      store.enteredCodes = ['invalid']
      store.currentScenarioImage = 'invalid'
      
      expect(hints.getCurrentStep()).toBe('first')
    })

    it('falls back to "first" when codes exist but conditions not met', () => {
      store.enteredCodes = ['2']
      store.currentScenarioImage = 'initial'
      store.firstHintFound = false
      
      expect(hints.getCurrentStep()).toBe('first')
    })
  })

  describe('computed properties', () => {
    it('returns translated current hint for first step', () => {
      store.enteredCodes = []
      
      expect(hints.currentHint.value).toBe('translated_level6.hints.first')
    })

    it('returns translated current hint for second step', () => {
      store.enteredCodes = ['2']
      store.currentScenarioImage = 'second'
      store.firstHintFound = false
      
      expect(hints.currentHint.value).toBe('translated_level6.hints.second')
    })

    it('returns translated current hint for third step', () => {
      store.currentScenarioImage = 'third'
      
      expect(hints.currentHint.value).toBe('translated_level6.hints.third')
    })

    it('returns translated current hint for fourth step', () => {
      store.currentScenarioImage = 'fourth'
      
      expect(hints.currentHint.value).toBe('translated_level6.hints.fourth')
    })

    it('returns translated current solution', () => {
      expect(hints.currentSolution.value).toBe('translated_level6.solutions.first')
    })

    it('updates solution when game state changes to second step', () => {
      store.enteredCodes = ['2']
      store.currentScenarioImage = 'second'
      store.firstHintFound = false
      
      expect(hints.currentSolution.value).toBe('translated_level6.solutions.second')
    })

    it('updates solution when game state changes to third step', () => {
      store.currentScenarioImage = 'third'
      
      expect(hints.currentSolution.value).toBe('translated_level6.solutions.third')
    })

    it('updates solution when game state changes to fourth step', () => {
      store.currentScenarioImage = 'fourth'
      
      expect(hints.currentSolution.value).toBe('translated_level6.solutions.fourth')
    })

    it('reflects show hint modal state', () => {
      store.showHintModal = false
      
      expect(hints.showHintModal.value).toBe(false)
    })

    it('reflects hint modal type', () => {
      store.hintModalType = 'clues'
      
      expect(hints.hintModalType.value).toBe('clues')
    })
  })

  describe('modal functions', () => {
    it('calls showHints with clues parameter', () => {
      const showHintsSpy = vi.spyOn(store, 'showHints')
      
      hints.showClues()
      
      expect(showHintsSpy).toHaveBeenCalledWith('clues')
    })

    it('calls showHints with solutions parameter', () => {
      const showHintsSpy = vi.spyOn(store, 'showHints')
      
      hints.showSolutions()
      
      expect(showHintsSpy).toHaveBeenCalledWith('solutions')
    })

    it('calls closeHints method', () => {
      const closeHintsSpy = vi.spyOn(store, 'closeHints')
      
      hints.closeHints()
      
      expect(closeHintsSpy).toHaveBeenCalled()
    })
  })

  describe('step progression scenarios', () => {
    it('handles complete game progression', () => {
      // Start - first step
      store.enteredCodes = []
      expect(hints.getCurrentStep()).toBe('first')
      
      // Enter code '2' - second step
      store.enteredCodes = ['2']
      store.currentScenarioImage = 'second'
      store.firstHintFound = false
      expect(hints.getCurrentStep()).toBe('second')
      
      // Enter code '1' and find hint - third step
      store.enteredCodes = ['2', '1']
      store.currentScenarioImage = 'third'
      store.firstHintFound = true
      expect(hints.getCurrentStep()).toBe('third')
      
      // Progress to fourth scenario - fourth step
      store.currentScenarioImage = 'fourth'
      expect(hints.getCurrentStep()).toBe('fourth')
    })

    it('prioritizes scenario image over other conditions', () => {
      // Fourth scenario should always return 'fourth'
      store.currentScenarioImage = 'fourth'
      store.enteredCodes = []
      store.firstHintFound = false
      expect(hints.getCurrentStep()).toBe('fourth')
      
      // Third scenario should always return 'third'
      store.currentScenarioImage = 'third'
      store.enteredCodes = []
      store.firstHintFound = false
      expect(hints.getCurrentStep()).toBe('third')
    })
  })
})