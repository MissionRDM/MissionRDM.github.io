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
const { useHintsSolutionsLvl4 } = await import('@/logic/hintsAndSolutions/level4/useHintsSolutionsLvl4.js')

describe('useHintsSolutionsLvl4', () => {
  let store, hints

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useGameInfo()
    hints = useHintsSolutionsLvl4()
    vi.clearAllMocks()
  })

  describe('getCurrentStep logic', () => {
    it('returns "first" for empty codes array', () => {
      store.enteredCodes = []
      
      expect(hints.getCurrentStep()).toBe('first')
    })

    it('returns "first" when code 44 not entered', () => {
      store.enteredCodes = []
      store.currentScenarioImage = 'first'
      
      expect(hints.getCurrentStep()).toBe('first')
    })

    it('returns "second" when code 44 entered and in second scenario', () => {
      store.enteredCodes = ['44']
      store.currentScenarioImage = 'second'
      
      expect(hints.getCurrentStep()).toBe('second')
    })

    it('returns "third" when in third scenario after Inès call without code 4', () => {
      store.enteredCodes = ['44']
      store.currentScenarioImage = 'third'
      store.callSequence = { 'Inès': 1, 'Santiago': 0 }
      
      expect(hints.getCurrentStep()).toBe('third')
    })

    it('returns "fourth" when in third scenario with code 4 but without code 51', () => {
      store.enteredCodes = ['44', '4']
      store.currentScenarioImage = 'third'
      store.callSequence = { 'Inès': 1, 'Santiago': 0 }
      
      expect(hints.getCurrentStep()).toBe('fourth')
    })

    it('returns "fifth" when in third scenario with both codes 4 and 51', () => {
      store.enteredCodes = ['44', '4', '51']
      store.currentScenarioImage = 'third'
      store.callSequence = { 'Inès': 1, 'Santiago': 0 }
      
      expect(hints.getCurrentStep()).toBe('fifth')
    })

    it('returns "sixth" when in fourth scenario with code 23', () => {
      store.enteredCodes = ['44', '4', '51', '23']
      store.currentScenarioImage = 'fourth'
      
      expect(hints.getCurrentStep()).toBe('sixth')
    })

    it('returns "seventh" when in fifth scenario with code 81', () => {
      store.enteredCodes = ['44', '4', '51', '23', '81']
      store.currentScenarioImage = 'fifth'
      
      expect(hints.getCurrentStep()).toBe('seventh')
    })

    it('returns "eighth" when in sixth scenario after Santiago call without firstHintFound', () => {
      store.enteredCodes = ['44', '4', '51', '23', '81']
      store.currentScenarioImage = 'sixth'
      store.callSequence = { 'Inès': 1, 'Santiago': 1 }
      store.firstHintFound = false
      
      expect(hints.getCurrentStep()).toBe('eighth')
    })

    it('returns "ninth" when in sixth scenario with firstHintFound', () => {
      store.enteredCodes = ['44', '4', '51', '23', '81']
      store.currentScenarioImage = 'sixth'
      store.callSequence = { 'Inès': 1, 'Santiago': 1 }
      store.firstHintFound = true
      
      expect(hints.getCurrentStep()).toBe('ninth')
    })

    it('returns "tenth" when in seventh scenario without secondHintFound', () => {
      store.enteredCodes = ['44', '4', '51', '23', '81', '61']
      store.currentScenarioImage = 'seventh'
      store.callSequence = { 'Inès': 1, 'Santiago': 2 }
      store.secondHintFound = false
      
      expect(hints.getCurrentStep()).toBe('tenth')
    })

    it('returns "eleventh" when in seventh scenario with secondHintFound but without code 3', () => {
      store.enteredCodes = ['44', '4', '51', '23', '81', '61']
      store.currentScenarioImage = 'seventh'
      store.callSequence = { 'Inès': 1, 'Santiago': 2 }
      store.secondHintFound = true
      
      expect(hints.getCurrentStep()).toBe('eleventh')
    })

    it('returns "twelfth" when in seventh scenario with secondHintFound and Santiago called 3+ times', () => {
      store.enteredCodes = ['44', '4', '51', '23', '81', '61', '3']
      store.currentScenarioImage = 'seventh'
      store.callSequence = { 'Inès': 1, 'Santiago': 3 }
      store.secondHintFound = true
      
      expect(hints.getCurrentStep()).toBe('twelfth')
    })

    it('returns "thirteenth" when in eighth scenario with language code 17', () => {
      store.enteredCodes = ['44', '4', '51', '23', '81', '61', '3', '17']
      store.currentScenarioImage = 'eighth'
      
      expect(hints.getCurrentStep()).toBe('thirteenth')
    })

    it('returns "thirteenth" when in eighth scenario with language code 32', () => {
      store.enteredCodes = ['44', '4', '51', '23', '81', '61', '3', '32']
      store.currentScenarioImage = 'eighth'
      
      expect(hints.getCurrentStep()).toBe('thirteenth')
    })
  })

  describe('computed properties', () => {
    it('returns translated current hint', () => {
      expect(hints.currentHint.value).toBe('translated_level4.hints.first')
    })

    it('returns translated current solution', () => {
      expect(hints.currentSolution.value).toBe('translated_level4.solutions.first')
    })

    it('updates when game state changes to second step', () => {
      store.enteredCodes = ['44']
      store.currentScenarioImage = 'second'
      
      expect(hints.currentHint.value).toBe('translated_level4.hints.second')
      expect(hints.currentSolution.value).toBe('translated_level4.solutions.second')
    })

    it('updates when game state changes to third step', () => {
      store.enteredCodes = ['44']
      store.currentScenarioImage = 'third'
      store.callSequence = { 'Inès': 1, 'Santiago': 0 }
      
      expect(hints.currentHint.value).toBe('translated_level4.hints.third')
      expect(hints.currentSolution.value).toBe('translated_level4.solutions.third')
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
    it('handles empty callSequence object', () => {
      store.enteredCodes = []
      store.callSequence = {}
      
      expect(hints.getCurrentStep()).toBe('first')
    })

    it('handles undefined game state properties', () => {
      store.enteredCodes = []
      store.currentScenarioImage = undefined
      store.callSequence = undefined
      
      expect(hints.getCurrentStep()).toBe('first')
    })

    it('falls back to first when no conditions match', () => {
      store.enteredCodes = ['44']
      store.currentScenarioImage = 'unknown'
      
      expect(hints.getCurrentStep()).toBe('first')
    })
  })
})