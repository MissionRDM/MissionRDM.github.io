import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useGameLogicLvl5 } from '@/logic/level5/gameLogicLvl5.js'
import { useGameInfo } from '@/store/gameInfo.js'
import { useRoadmapStore } from '@/store/roadmap.js'

// Mock router
const mockPush = vi.fn()
vi.mock('vue-router', () => ({
  useRouter: () => ({ push: mockPush })
}))

// Mock i18n
const mockLocale = { value: 'en' }
const mockT = vi.fn((key) => key)
vi.mock('vue-i18n', () => ({
  useI18n: () => ({ t: mockT, locale: mockLocale })
}))

// Mock sound utilities
vi.mock('@/utils/playSound', () => ({
  playSound: vi.fn()
}))

describe('Game Logic Level 5', () => {
  let store, roadmapStore, setFeedback, logic

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useGameInfo()
    roadmapStore = useRoadmapStore()
    
    // Initialize store properties
    store.currentScenarioImage = 'default'
    store.enteredCodes = []
    store.secondHintFound = false
    store.thirdHintFound = false
    store.activeRiddle = false
    store.showCongratsModal = false
    store.level = 5
    store.playerName = 'TestPlayer'
    
    // Mock essential store methods
    store.showOverlay = vi.fn()
    store.removeOverlay = vi.fn()
    store.showErrorOverlay = vi.fn()
    store.resetAfterLevel = vi.fn()
    store.setCharCallable = vi.fn()
    store.startCall = vi.fn()
    store.markCharacterAsCalled = vi.fn()
    store.isCharCallable = vi.fn()
    store.hasPendingMandatoryCalls = vi.fn()
    store.getPendingCallType = vi.fn()
    store.getCharacterCallType = vi.fn()
    store.hasCalledCharacter = vi.fn()
    roadmapStore.addEntry = vi.fn()
    
    setFeedback = vi.fn()
    logic = useGameLogicLvl5(setFeedback)
    mockLocale.value = 'en'
    vi.clearAllMocks()
  })

  // Code handling tests
  it('rejects duplicate codes (except hint codes)', () => {
    store.enteredCodes = ['71']  
    logic.handleCodeInput('71') 
    expect(setFeedback).toHaveBeenCalledWith('error', '')
    
    // Clear the mock before testing hint codes
    vi.clearAllMocks()
    
    // Hint codes should be allowed to re-enter
    store.currentScenarioImage = 'seventh' 
    logic.handleCodeInput('8')
    expect(setFeedback).toHaveBeenCalledWith('success', '')
  })

  it('handles first code (3) correctly', () => {
    store.currentScenarioImage = 'default'

    logic.handleCodeInput('3')

    expect(store.currentScenarioImage).toBe('second')
    expect(setFeedback).toHaveBeenCalledWith('success', '')
    // Note: enteredCodes is NOT updated by the logic
  })

  it('rejects code (19) in wrong scenario', () => {
    store.currentScenarioImage = 'second' // Wrong scenario
    
    logic.handleCodeInput('19')
    
    expect(setFeedback).toHaveBeenCalledWith('error', '')
  })

  it('handles second code (71) in fourth scenario', () => {
    store.currentScenarioImage = 'fourth'
    
    logic.handleCodeInput('71')
    
    expect(store.currentScenarioImage).toBe('fifth')
    expect(setFeedback).toHaveBeenCalledWith('success', '')
    expect(roadmapStore.addEntry).toHaveBeenCalledWith('step5', 'step5_2')
    expect(store.setCharCallable).toHaveBeenCalledWith('Santiago', false, 'outgoing')
  })

  it('handles error codes for second riddle (72, 73)', () => {
    store.currentScenarioImage = 'fourth'
    
    const errorCodes = ['72', '73']
    errorCodes.forEach(code => {
      vi.clearAllMocks()
      logic.handleCodeInput(code)
      expect(store.showErrorOverlay).toHaveBeenCalledWith('riddle4.title', 'riddle4.incorrect')
    })
  })

  it('handles third code (96) with conditions', () => {
    store.currentScenarioImage = 'fifth'
    store.secondHintFound = true
    
    logic.handleCodeInput('96')
    
    expect(store.currentScenarioImage).toBe('sixth')
    expect(setFeedback).toHaveBeenCalledWith('success', '')
    expect(roadmapStore.addEntry).toHaveBeenCalledWith('step5', 'step5_4')
    expect(store.removeOverlay).toHaveBeenCalled()
  })

  it('rejects third code (96) without secondHintFound', () => {
    store.currentScenarioImage = 'fifth'
    store.secondHintFound = false
    
    logic.handleCodeInput('96')
    
    expect(setFeedback).toHaveBeenCalledWith('error', '')
    expect(store.currentScenarioImage).toBe('fifth') // Should not change
  })

  it('handles error codes for third riddle (93, 94, 95)', () => {
    store.currentScenarioImage = 'fifth'
    store.secondHintFound = true
    
    const errorCodes = ['93', '94', '95']
    errorCodes.forEach(code => {
      vi.clearAllMocks()
      logic.handleCodeInput(code)
      expect(store.showErrorOverlay).toHaveBeenCalledWith('riddle5.title', `riddle5.incorrect${code}`)
    })
  })

  it('handles third hint code (8) in seventh scenario', () => {
    store.currentScenarioImage = 'seventh'
    
    logic.handleCodeInput('8')
    
    expect(store.thirdHintFound).toBe(true)
    expect(setFeedback).toHaveBeenCalledWith('success', '')
    expect(store.showOverlay).toHaveBeenCalled()
  })

  it('handles fourth code (6) with conditions', () => {
    store.currentScenarioImage = 'seventh'
    store.thirdHintFound = true
    
    logic.handleCodeInput('6')
    
    expect(store.currentScenarioImage).toBe('eighth')
    expect(setFeedback).toHaveBeenCalledWith('success', '')
    expect(roadmapStore.addEntry).toHaveBeenCalledWith('step5', 'step5_3')
    expect(store.setCharCallable).toHaveBeenCalledWith('Jack', false, 'outgoing')
  })

  it('rejects fourth code (6) without thirdHintFound', () => {
    store.currentScenarioImage = 'seventh'
    store.thirdHintFound = false
    
    logic.handleCodeInput('6')
    
    expect(setFeedback).toHaveBeenCalledWith('error', '')
    expect(store.currentScenarioImage).toBe('seventh') // Should not change
  })

  it('handles error codes for fourth riddle (12, 35, 13)', () => {
    store.currentScenarioImage = 'seventh'
    store.thirdHintFound = true
    
    const errorCodes = ['12', '35', '13']
    errorCodes.forEach(code => {
      vi.clearAllMocks()
      logic.handleCodeInput(code)
      expect(store.showErrorOverlay).toHaveBeenCalledWith('riddle6.title', 'riddle6.incorrect')
    })
  })

  it('handles fifth code (84) in eighth scenario', () => {
    store.currentScenarioImage = 'eighth'
    store.activeRiddle = true
    
    logic.handleCodeInput('84')
    
    expect(store.currentScenarioImage).toBe('ninth')
    expect(setFeedback).toHaveBeenCalledWith('success', '')
    expect(store.setCharCallable).toHaveBeenCalledWith('Inès', false, 'incoming')
  })

  it('rejects fifth code (84) without activeRiddle', () => {
    store.currentScenarioImage = 'eighth'
    store.activeRiddle = false
    
    logic.handleCodeInput('84')
    
    expect(setFeedback).toHaveBeenCalledWith('error', '')
    expect(store.currentScenarioImage).toBe('eighth') // Should not change
  })

  it('handles error codes for fifth riddle (65, 18)', () => {
    store.currentScenarioImage = 'eighth'
    store.activeRiddle = true
    
    const errorCodes = ['65', '18']
    errorCodes.forEach(code => {
      vi.clearAllMocks()
      logic.handleCodeInput(code)
      expect(store.showErrorOverlay).toHaveBeenCalledWith('riddle6.title', 'riddle6.incorrect')
    })
  })

  // Character call tests
  it('handles character calls correctly', () => {
    const character = { name: 'Santiago', avatar: 'avatar.png' }
    
    // When callable
    store.isCharCallable.mockReturnValue(true)
    logic.handleCharacterCall(character)
    
    expect(store.markCharacterAsCalled).toHaveBeenCalledWith('Santiago')
    expect(store.startCall).toHaveBeenCalledWith('Santiago', 'avatar.png', 'phone.call7')
    expect(store.currentScenarioImage).toBe('fourth')
    
    // Reset for second test
    vi.clearAllMocks()
    
    // When not callable
    store.isCharCallable.mockReturnValue(false)
    logic.handleCharacterCall(character)
    expect(store.startCall).toHaveBeenCalledWith('Santiago', 'avatar.png', 'phone.callUnavailable')
  })

  it('handles different character calls', () => {
    store.isCharCallable.mockReturnValue(true)
    
    // Jack call
    logic.handleCharacterCall({ name: 'Jack', avatar: 'jack.png' })
    expect(store.startCall).toHaveBeenCalledWith('Jack', 'jack.png', 'phone.call8')
    expect(store.currentScenarioImage).toBe('seventh')
    
    // Reset for next test
    vi.clearAllMocks()
    store.isCharCallable.mockReturnValue(true)
    
    // Inès call
    logic.handleCharacterCall({ name: 'Inès', avatar: 'ines.png' })
    expect(store.startCall).toHaveBeenCalledWith('Inès', 'ines.png', 'phone.call9')
    expect(store.activeRiddle).toBe(true)
  })

  // Utility function tests
  it('returns pending call info correctly', () => {
    store.hasPendingMandatoryCalls.mockReturnValue(true)
    store.getPendingCallType.mockReturnValue('incoming')
    store.getCharacterCallType.mockReturnValue('outgoing')
    
    expect(logic.hasPendingCall()).toBe(true)
    expect(logic.getPendingCallType()).toBe('incoming')
    expect(logic.getCharacterCallType('Santiago')).toBe('outgoing')
  })

  it('handles pending call answer', () => {
    const characters = [
      { name: 'Santiago', avatar: 'santiago.png' },
      { name: 'Jack', avatar: 'jack.png' }
    ]
    
    store.isCharCallable.mockImplementation(name => name === 'Santiago')
    store.hasCalledCharacter.mockReturnValue(false)
    
    logic.answerPendingCall(characters)
    
    expect(store.markCharacterAsCalled).toHaveBeenCalledWith('Santiago')
  })

  it('handles navigation to level 6', () => {
    store.showCongratsModal = true
    logic.continueToLevel6()
    
    expect(store.showCongratsModal).toBe(false)
    expect(store.level).toBe(6)
    expect(store.resetAfterLevel).toHaveBeenCalled()
    expect(mockPush).toHaveBeenCalledWith('/level/6')
  })

  it('rejects invalid codes', () => {
    const invalidCodes = ['999', '', '0', 'abc']
    
    invalidCodes.forEach(code => {
      vi.clearAllMocks()
      logic.handleCodeInput(code)
      expect(setFeedback).toHaveBeenCalledWith('error', '')
    })
  })
})