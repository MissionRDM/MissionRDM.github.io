import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useGameInfo } from '@/store/gameInfo.js'

// Mock vue-i18n
vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: vi.fn((key) => `translated_${key}`)
  })
}))

// Import the composable after mocking
const { useHintsSolutionsLvl3 } = await import('@/logic/hintsAndSolutions/level3/useHintsSolutionsLvl3.js')

describe('useHintsSolutionsLvl3', () => {
  let store, hints

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useGameInfo()
    hints = useHintsSolutionsLvl3()
    vi.clearAllMocks()
  })

  describe('getCurrentStep logic', () => {
    it('returns "first" for empty codes array', () => {
      store.enteredCodes = []
      
      expect(hints.getCurrentStep()).toBe('first')
    })

    it('returns "second" when first hint found but no codes entered', () => {
      store.enteredCodes = []
      store.firstHintFound = true
      
      expect(hints.getCurrentStep()).toBe('second')
    })

    it('returns "third" when code 33 is entered', () => {
      store.enteredCodes = ['33']
      
      expect(hints.getCurrentStep()).toBe('third')
    })

    it('returns "sixth" when all hint codes are entered', () => {
      store.enteredCodes = ['57', '58', '59']
      
      expect(hints.getCurrentStep()).toBe('sixth')
    })

    it('returns "seventh" when code 77 entered', () => {
      store.enteredCodes = ['77']
      store.secondHintFound = false
      
      expect(hints.getCurrentStep()).toBe('seventh')
    })

    it('returns "eighth" when code 22 entered', () => {
      store.enteredCodes = ['22']
      store.secondHintFound = false
      
      expect(hints.getCurrentStep()).toBe('eighth')
    })

    it('returns "ninth" when code 64 entered', () => {
      store.enteredCodes = ['64']
      store.secondHintFound = false
      
      expect(hints.getCurrentStep()).toBe('ninth')
    })

    it('returns "tenth" when second hint found', () => {
      store.secondHintFound = true
      
      expect(hints.getCurrentStep()).toBe('tenth')
    })
  })

  describe('computed properties', () => {
    it('returns translated current hint', () => {
      expect(hints.currentHint.value).toBe('translated_level3.hints.first')
    })

    it('returns translated current solution', () => {
      expect(hints.currentSolution.value).toBe('translated_level3.solutions.first')
    })

    it('updates when game state changes', () => {
      store.enteredCodes = ['33']
      
      expect(hints.currentHint.value).toBe('translated_level3.hints.third')
      expect(hints.currentSolution.value).toBe('translated_level3.solutions.third')
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
})