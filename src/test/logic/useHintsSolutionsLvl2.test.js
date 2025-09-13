import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useHintsSolutionsLvl2 } from '@/logic/hintsAndSolutions/level2/useHintsSolutionsLvl2.js'
import { useGameInfo } from '@/store/gameInfo.js'

// Mock vue-i18n
vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: vi.fn((key) => `translated_${key}`)
  })
}))

describe('useHintsSolutionsLvl2', () => {
  let store, hints

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useGameInfo()
    hints = useHintsSolutionsLvl2()
    vi.clearAllMocks()
  })

  describe('getCurrentStep logic', () => {
    it('returns "first" when no codes entered', () => {
      store.enteredCodes = []
      
      expect(hints.getCurrentStep()).toBe('first')
    })

    it('returns "second" when code 9 is entered', () => {
      store.enteredCodes = ['9']
      
      expect(hints.getCurrentStep()).toBe('second')
    })

    it('returns "third" when codes 9 and 15 are entered', () => {
      store.enteredCodes = ['9', '15']
      
      expect(hints.getCurrentStep()).toBe('third')
    })

    it('returns "fourth" when codes up to 31 are entered', () => {
      store.enteredCodes = ['9', '15', '31']
      
      expect(hints.getCurrentStep()).toBe('fourth')
    })

    it('returns "fifth" when codes up to 1 are entered', () => {
      store.enteredCodes = ['9', '15', '31', '1']
      
      expect(hints.getCurrentStep()).toBe('fifth')
    })

    it('returns "sixth" when codes up to 36 are entered', () => {
      store.enteredCodes = ['9', '15', '31', '1', '36']
      
      expect(hints.getCurrentStep()).toBe('sixth')
    })

    it('returns "sixth" when first hint is found', () => {
      store.enteredCodes = ['9', '15', '31', '1', '36']
      store.firstHintFound = true

      expect(hints.getCurrentStep()).toBe('sixth')
    })

    it('handles codes in different order correctly', () => {
      store.enteredCodes = ['31', '9', '15']
      
      expect(hints.getCurrentStep()).toBe('fourth')
    })
  })

  describe('computed properties', () => {
    it('returns translated current hint', () => {
      expect(hints.currentHint.value).toBe('translated_level2.hints.first')
    })

    it('returns translated current solution', () => {
      expect(hints.currentSolution.value).toBe('translated_level2.solutions.first')
    })

    it('updates hint when game state changes', () => {
      store.enteredCodes = ['9']
      
      expect(hints.currentHint.value).toBe('translated_level2.hints.second')
    })

    it('updates solution when game state changes', () => {
      store.enteredCodes = ['9', '15']
      
      expect(hints.currentSolution.value).toBe('translated_level2.solutions.third')
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
    it('handles empty enteredCodes array', () => {
      store.enteredCodes = []
      
      expect(hints.getCurrentStep()).toBe('first')
      expect(hints.currentHint.value).toBe('translated_level2.hints.first')
    })

    it('handles missing firstHintFound property', () => {
      store.enteredCodes = ['9', '15', '31', '1', '36']
      store.firstHintFound = undefined
      
      expect(hints.getCurrentStep()).toBe('sixth')
    })

    it('prioritizes firstHintFound over codes', () => {
      store.enteredCodes = ['9']
      store.firstHintFound = true
      
      expect(hints.getCurrentStep()).toBe('second')
    })

    it('handles complex state combinations correctly', () => {
      store.enteredCodes = ['36', '31']
      store.firstHintFound = false
      
      expect(hints.getCurrentStep()).toBe('sixth')
    })
  })
})