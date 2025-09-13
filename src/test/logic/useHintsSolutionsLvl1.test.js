import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useHintsSolutionsLvl1 } from '@/logic/hintsAndSolutions/level1/useHintsSolutionsLvl1.js'
import { useGameInfo } from '@/store/gameInfo.js'

// Mock vue-i18n
vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: vi.fn((key) => `translated_${key}`)
  })
}))

describe('useHintsSolutionsLvl1', () => {
  let store, hints

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useGameInfo()
    hints = useHintsSolutionsLvl1()
    vi.clearAllMocks()
  })

  describe('getCurrentStep logic', () => {
    it('returns "first" for empty codes array', () => {
      store.enteredCodes = []
      
      expect(hints.getCurrentStep()).toBe('first')
    })

    it('returns "second" when first hint found but code 4 not entered', () => {
      store.firstHintFound = true
      store.enteredCodes = []
      
      expect(hints.getCurrentStep()).toBe('second')
    })

    it('returns "third" when codes 8 and 4 are entered but second hint not found', () => {
      store.enteredCodes = ['8', '4']
      store.secondHintFound = false
      
      expect(hints.getCurrentStep()).toBe('third')
    })

    it('returns "fourth" when second hint found but riddle not solved', () => {
      store.secondHintFound = true
      store.riddleSolved = false
      
      expect(hints.getCurrentStep()).toBe('fourth')
    })

    it('returns "fifth" when riddle solved with codes 8 and 4 but not 21', () => {
      store.riddleSolved = true
      store.enteredCodes = ['8', '4']
      
      expect(hints.getCurrentStep()).toBe('third')
    })

    it('returns "sixth" when code 21 entered but not 26', () => {
      store.currentScenarioImage = 'third'
      
      expect(hints.getCurrentStep()).toBe('sixth')
    })

    it('handles complex state combinations correctly', () => {
      // Test riddle solved with first hint found should return "second"
      store.riddleSolved = true
      store.firstHintFound = true
      store.enteredCodes = []
      
      expect(hints.getCurrentStep()).toBe('second')
    })

    it('falls back to "first" for unexpected states', () => {
      store.riddleSolved = true
      store.firstHintFound = false
      store.enteredCodes = []
      
      expect(hints.getCurrentStep()).toBe('first')
    })
  })

  describe('computed properties', () => {
    it('returns translated current hint', () => {
      expect(hints.currentHint.value).toBe('translated_level1.hints.first')
    })

    it('returns translated current solution', () => {
      expect(hints.currentSolution.value).toBe('translated_level1.solutions.first')
    })

    it('updates hint and solution when game state changes', () => {
      store.enteredCodes = ['8', '4']
      store.secondHintFound = false
      
      expect(hints.currentHint.value).toBe('translated_level1.hints.third')
      expect(hints.currentSolution.value).toBe('translated_level1.solutions.third')
    })

    it('reflects show hint modal state', () => {
      store.showHintModal = true
      
      expect(hints.showHintModal.value).toBe(true)
    })

    it('reflects hint modal type', () => {
      store.hintModalType = 'solutions'
      
      expect(hints.hintModalType.value).toBe('solutions')
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

  describe('edge cases', () => {
    it('handles multiple codes in different orders', () => {
      store.enteredCodes = ['4', '8'] // Different order
      store.secondHintFound = false
      
      expect(hints.getCurrentStep()).toBe('third')
    })

    it('if conditions are not met should return the lowest priority step', () => {
      // Has all conditions for multiple steps, should return the highest priority
      store.enteredCodes = ['1', '99', '50']
      
      expect(hints.getCurrentStep()).toBe('first')
    })

    it('handles empty state gracefully', () => {
      // Reset everything to initial state
      store.enteredCodes = []
      store.riddleSolved = false
      store.firstHintFound = false
      store.secondHintFound = false
      
      expect(hints.getCurrentStep()).toBe('first')
    })
  })
})