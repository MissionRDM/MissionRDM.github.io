import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useHintsSolutionsLvl5 } from '@/logic/hintsAndSolutions/level5/useHintsSolutionsLvl5.js'
import { useGameInfo } from '@/store/gameInfo.js'

// Mock vue-i18n
vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: vi.fn((key) => `translated_${key}`)
  })
}))

describe('useHintsSolutionsLvl5', () => {
  let store, hints

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useGameInfo()
    hints = useHintsSolutionsLvl5()
    vi.clearAllMocks()
  })

  describe('getCurrentStep logic', () => {
    it('returns "first" for beginning state', () => {
      store.firstHintFound = false
      
      expect(hints.getCurrentStep()).toBe('first')
    })

    it('returns "third" when code 19 entered in third scenario', () => {
      store.enteredCodes = ['19']
      store.currentScenarioImage = 'third'
      
      expect(hints.getCurrentStep()).toBe('third')
    })

    it('returns "fourth" when in fourth scenario after Santiago call', () => {
      store.enteredCodes = ['19']
      store.currentScenarioImage = 'fourth'
      
      expect(hints.getCurrentStep()).toBe('fourth')
    })

    it('returns "fifth" when code 71 entered but second hint not found', () => {
      store.enteredCodes = ['19', '71']
      store.currentScenarioImage = 'fifth'
      store.secondHintFound = false
      
      expect(hints.getCurrentStep()).toBe('fifth')
    })

    it('returns "sixth" when second hint found with code 71', () => {
      store.enteredCodes = ['19', '71']
      store.currentScenarioImage = 'fifth'
      store.secondHintFound = true
      
      expect(hints.getCurrentStep()).toBe('sixth')
    })

    it('returns "seventh" when code 96 entered in sixth scenario', () => {
      store.enteredCodes = ['96']
      store.currentScenarioImage = 'sixth'
      
      expect(hints.getCurrentStep()).toBe('seventh')
    })

    it('returns "eighth" when in seventh scenario without third hint', () => {
      store.currentScenarioImage = 'seventh'
      store.thirdHintFound = false
      
      expect(hints.getCurrentStep()).toBe('eighth')
    })

    it('returns "ninth" when third hint found in seventh scenario', () => {
      store.currentScenarioImage = 'seventh'
      store.thirdHintFound = true
      
      expect(hints.getCurrentStep()).toBe('ninth')
    })

    it('returns "tenth" when in eighth scenario with inactive riddle', () => {
      store.currentScenarioImage = 'eighth'
      store.activeRiddle = false
      
      expect(hints.getCurrentStep()).toBe('tenth')
    })

    it('returns "eleventh" when in eighth scenario with active riddle', () => {
      store.currentScenarioImage = 'eighth'
      store.activeRiddle = true
      store.enteredCodes = ['6']
      
      expect(hints.getCurrentStep()).toBe('eleventh')
    })

    it('returns "twelfth" for final step', () => {
      store.currentScenarioImage = 'ninth'
      store.enteredCodes = ['84']
      
      expect(hints.getCurrentStep()).toBe('twelfth')
    })

    it('falls back to "first" for unexpected states', () => {
      store.firstHintFound = true
      store.enteredCodes = ['19']
      store.currentScenarioImage = 'invalid'
      
      expect(hints.getCurrentStep()).toBe('first')
    })
  })

  describe('computed properties', () => {
    it('returns translated current hint', () => {
      expect(hints.currentHint.value).toBe('translated_level5.hints.first')
    })

    it('returns translated current solution', () => {
      expect(hints.currentSolution.value).toBe('translated_level5.solutions.first')
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
})