import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useGameLogicLvl4 } from '@/logic/level4/gameLogicLvl4'
import { useGameInfo } from '@/store/gameInfo'
import { useRoadmapStore } from '@/store/roadmap'

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

// Mock level completion utility
const mockCompleteLevel = vi.fn()
vi.mock('@/utils/useLevelCompletion', () => ({
  useLevelCompletion: () => ({ completeLevel: mockCompleteLevel })
}))

describe('Game Logic Level 4', () => {
  let store, roadmapStore, setFeedback, logic

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useGameInfo()
    roadmapStore = useRoadmapStore()
    
    // Mock essential store methods
    store.showOverlay = vi.fn()
    store.removeOverlay = vi.fn()
    store.resetAfterLevel = vi.fn()
    store.setLevelCompletionData = vi.fn()
    store.startCall = vi.fn()
    store.isCharCallable = vi.fn()
    store.markCharacterAsCalled = vi.fn()
    store.setCharCallable = vi.fn()
    store.hasCalledCharacter = vi.fn()
    store.hasPendingMandatoryCalls = vi.fn()
    store.getPendingCallType = vi.fn()
    store.getCharacterCallType = vi.fn()
    roadmapStore.addEntry = vi.fn()
    
    setFeedback = vi.fn()
    logic = useGameLogicLvl4(setFeedback)
    mockLocale.value = 'en'
    vi.clearAllMocks()
  })

  it('rejects duplicate non-hint codes', () => {
    store.enteredCodes = ['44']
    logic.handleCodeInput('44')
    expect(setFeedback).toHaveBeenCalledWith('error', '')
  })

  it('handles hint codes correctly', () => {
    store.enteredCodes = []
    store.currentScenarioImage = 'third'
    store.callSequence = { 'Inès': 1 }
    
    logic.handleCodeInput('4')
    
    expect(setFeedback).toHaveBeenCalledWith('success', '')
    expect(store.showOverlay).toHaveBeenCalled()
    expect(store.enteredCodes).toContain('4')
  })

  it('handles message trigger code (23)', () => {
    store.enteredCodes = ['4', '51']
    store.currentScenarioImage = 'third'
    store.callSequence = { 'Inès': 1 }
    store.playerName = 'TestPlayer'
    
    logic.handleCodeInput('23')
    
    expect(setFeedback).toHaveBeenCalledWith('success', '')
    expect(store.currentScenarioImage).toBe('fourth')
    expect(store.activeMessage).toBeDefined()
  })

  it('handles final code (47) and completes level', () => {
    store.currentScenarioImage = 'eighth'
    store.levelStartTime = Date.now()
    
    logic.handleCodeInput('47')
    
    expect(setFeedback).toHaveBeenCalledWith('success', '')
    expect(store.showCongratsModal).toBe(true)
    expect(mockCompleteLevel).toHaveBeenCalledWith(4, store.levelStartTime)
  })

  // Character call tests
  it('handles unavailable character call', () => {
    const character = { name: 'TestChar', avatar: 'test.png' }
    store.isCharCallable.mockReturnValue(false)
    
    logic.handleCharacterCall(character)
    
    expect(store.startCall).toHaveBeenCalledWith(
      character.name, 
      character.avatar, 
      'phone.callUnavailable'
    )
  })

  it('handles Santiago calls with scenario changes', () => {
    const character = { name: 'Santiago', avatar: 'santiago.png' }
    store.isCharCallable.mockReturnValue(true)
    store.callSequence = { 'Santiago': 2 }
    
    logic.handleCharacterCall(character)
    
    expect(store.setCharCallable).toHaveBeenCalledWith('Santiago', false, 'incoming')
    expect(store.currentScenarioImage).toBe('seventh')
  })

  // Language-specific codes
  it('handles language-specific codes correctly', () => {
    store.currentScenarioImage = 'seventh'
    store.secondHintFound = true
    store.callSequence = { 'Santiago': 2 }
    store.overlayId = 'test-overlay'
    store.enteredCodes = []
    store.playerName = 'TestPlayer'
    mockLocale.value = 'en'
    
    logic.handleCodeInput('17')
    
    expect(setFeedback).toHaveBeenCalledWith('success', '')
    expect(store.currentScenarioImage).toBe('eighth')
    expect(store.enteredCodes).toContain('17')
  })

  it('rejects wrong language code', () => {
    store.currentScenarioImage = 'seventh'
    store.secondHintFound = true
    store.callSequence = { 'Santiago': 2 }
    mockLocale.value = 'en'
    
    logic.handleCodeInput('32') // French code in English mode
    
    expect(setFeedback).toHaveBeenCalledWith('error', '')
  })

  // Utility functions
  it('checks for pending calls', () => {
    store.hasPendingMandatoryCalls.mockReturnValue(true)
    expect(logic.hasPendingCall()).toBe(true)
  })

  it('gets pending call type', () => {
    store.getPendingCallType.mockReturnValue('incoming')
    expect(logic.getPendingCallType()).toBe('incoming')
  })

  // Level completion
  it('continues to level 5', () => {
    store.showCongratsModal = true
    
    logic.continueToLevel5()
    
    expect(store.showCongratsModal).toBe(false)
    expect(store.resetAfterLevel).toHaveBeenCalled()
    expect(store.level).toBe(5)
    expect(mockPush).toHaveBeenCalledWith('/level/5')
  })

  // Error cases
  it('rejects codes in wrong scenario', () => {
    store.currentScenarioImage = 'initial'
    store.callSequence = { 'Inès': 1 }
    
    logic.handleCodeInput('4') // Hint code in wrong scenario
    
    expect(setFeedback).toHaveBeenCalledWith('error', '')
  })

  it('rejects invalid codes', () => {
    const invalidCodes = ['999', 'abc', '']
    
    invalidCodes.forEach(code => {
      logic.handleCodeInput(code)
      expect(setFeedback).toHaveBeenCalledWith('error', '')
    })
  })

  // Additional key coverage tests
  it('handles repeat message code (99)', () => {
    store.currentScenarioImage = 'eighth'
    store.firstHintFound = true
    store.callSequence = { 'Santiago': 2 }
    store.playerName = 'TestPlayer'
    
    logic.handleCodeInput('99')
    
    expect(setFeedback).toHaveBeenCalledWith('success', '')
    expect(store.activeMessage.name).toBe('Anne')
  })

  it('handles level completion without start time', () => {
    store.currentScenarioImage = 'eighth'
    store.levelStartTime = null
    
    logic.handleCodeInput('47')
    
    expect(setFeedback).toHaveBeenCalledWith('success', '')
    expect(store.showCongratsModal).toBe(true)
    expect(mockCompleteLevel).not.toHaveBeenCalled()
  })

  it('handles code 81 scenario change', () => {
    store.currentScenarioImage = 'fourth'
    store.enteredCodes = []
    
    logic.handleCodeInput('81')
    
    expect(setFeedback).toHaveBeenCalledWith('success', '')
    expect(store.currentScenarioImage).toBe('fifth')
    expect(store.enteredCodes).toContain('81')
  })

  it('handles code 1 and 61 sequence', () => {
    // Test code 1
    store.currentScenarioImage = 'sixth'
    store.callSequence = { 'Santiago': 1 }
    store.overlayId = 'test-overlay'
    
    logic.handleCodeInput('1')
    
    expect(setFeedback).toHaveBeenCalledWith('success', '')
    expect(store.firstHintFound).toBe(true)
    
    // Test code 61
    store.enteredCodes = []
    logic.handleCodeInput('61')
    
    expect(setFeedback).toHaveBeenCalledWith('success', '')
    expect(store.setCharCallable).toHaveBeenCalledWith('Santiago', true, 'incoming')
    expect(store.enteredCodes).toContain('61')
  })

  it('handles Santiago first call with roadmap', () => {
    const character = { name: 'Santiago', avatar: 'santiago.png' }
    store.isCharCallable.mockReturnValue(true)
    store.callSequence = { 'Santiago': 1 }
    store.playerName = 'TestPlayer'
    
    logic.handleCharacterCall(character)
    
    expect(store.startCall).toHaveBeenCalledWith(
      'Santiago', 
      'santiago.png', 
      'phone.call4', 
      'roadmap.step4_2'
    )
  })

  it('handles French language codes', () => {
    store.currentScenarioImage = 'seventh'
    store.secondHintFound = true
    store.callSequence = { 'Santiago': 2 }
    store.enteredCodes = []
    mockLocale.value = 'fr'
    
    logic.handleCodeInput('32')
    
    expect(setFeedback).toHaveBeenCalledWith('success', '')
    expect(store.currentScenarioImage).toBe('eighth')
  })

  it('allows re-entering hint codes', () => {
    store.enteredCodes = ['4']
    store.currentScenarioImage = 'third'
    store.callSequence = { 'Inès': 1 }
    
    logic.handleCodeInput('4') // Re-enter hint code
    
    expect(setFeedback).toHaveBeenCalledWith('success', '')
    expect(store.showOverlay).toHaveBeenCalled()
  })

  it('handles hint code 51 with different overlays', () => {
    store.currentScenarioImage = 'third'
    store.callSequence = { 'Inès': 1 }
    store.enteredCodes = ['4'] // First hint already entered
    
    logic.handleCodeInput('51')
    
    expect(setFeedback).toHaveBeenCalledWith('success', '')
    expect(store.showOverlay).toHaveBeenCalled()
  })

  it('gets character call type', () => {
    store.getCharacterCallType.mockReturnValue('outgoing')
    
    expect(logic.getCharacterCallType('Santiago')).toBe('outgoing')
  })
})