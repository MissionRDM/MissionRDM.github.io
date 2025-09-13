import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useGameLogicLvl1, checkUpdateScenarioImage } from '@/logic/level1/gameLogicLvl1.js'
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

// Mock level completion
vi.mock('@/utils/useLevelCompletion', () => ({
  useLevelCompletion: () => ({ completeLevel: vi.fn() })
}))

describe('Game Logic Level 1', () => {
  let store, roadmapStore, setFeedback, logic

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useGameInfo()
    roadmapStore = useRoadmapStore()
    
    // Mock essential store methods
    store.showOverlay = vi.fn()
    store.resetAfterLevel = vi.fn()
    store.setCharCallable = vi.fn()
    store.removeOverlay = vi.fn()
    store.showErrorOverlay = vi.fn()
    store.startCall = vi.fn()
    store.markCharacterAsCalled = vi.fn()
    store.isCharCallable = vi.fn()
    store.hasPendingMandatoryCalls = vi.fn()
    store.getPendingCallType = vi.fn()
    store.getCharacterCallType = vi.fn()
    store.hasCalledCharacter = vi.fn()
    roadmapStore.addEntry = vi.fn()
    
    // Initialize store properties
    store.enteredCodes = []
    store.firstHintFound = false
    store.secondHintFound = false
    store.riddleSolved = false
    store.currentScenarioImage = 'initial'
    store.showCongratsModal = false
    store.level = 1
    store.playerName = ''
    store.activeMessage = null
    store.activeRiddle = null
    
    setFeedback = vi.fn()
    logic = useGameLogicLvl1(setFeedback)
    mockLocale.value = 'en'
    vi.clearAllMocks()
  })

  // Code handling tests
  it('rejects duplicate codes', () => {
    store.enteredCodes = ['8']
    logic.handleCodeInput('8')
    expect(setFeedback).toHaveBeenCalledWith('error', '')
  })

  it('handles hint code (8)', () => {
    logic.handleCodeInput('8')
    expect(store.firstHintFound).toBe(true)
    expect(setFeedback).toHaveBeenCalledWith('success', '')
    expect(store.showOverlay).toHaveBeenCalled()
  })

  it('handles count code (4) when hint found', () => {
    store.firstHintFound = true
    logic.handleCodeInput('4')
    expect(store.enteredCodes).toContain('4')
    expect(store.enteredCodes).toContain('8')
    expect(roadmapStore.addEntry).toHaveBeenCalledWith('step1', 'step1_3')
    expect(setFeedback).toHaveBeenCalledWith('success', '')
  })

  it('rejects count code (4) when hint not found', () => {
    store.firstHintFound = false
    logic.handleCodeInput('4')
    expect(setFeedback).toHaveBeenCalledWith('error', '')
  })

  it('handles second hint code (29)', () => {
    store.riddleSolved = false
    store.playerName = 'TestPlayer'
    logic.handleCodeInput('29')
    
    expect(store.secondHintFound).toBe(true)
    expect(store.activeMessage.name).toBe('Santiago')
    expect(mockT).toHaveBeenCalledWith('phone.messageBodylvl1', { playerName: 'TestPlayer' })
  })

  it('rejects second hint code (29) when riddle already solved', () => {
    store.riddleSolved = true
    logic.handleCodeInput('29')
    expect(setFeedback).toHaveBeenCalledWith('error', '')
  })

  it('handles finish level code (28) in final scenario', () => {
    store.currentScenarioImage = 'final'
    logic.handleCodeInput('28')
    expect(store.enteredCodes).toContain('28')
    expect(store.currentScenarioImage).toBe('congrats')
    expect(store.setCharCallable).toHaveBeenCalledWith('Santiago', false, 'outgoing')
    expect(roadmapStore.addEntry).toHaveBeenCalledWith('step1', 'step1_2')
    expect(setFeedback).toHaveBeenCalledWith('success', '')
  })

  it('handles error codes in final scenario', () => {
    store.currentScenarioImage = 'final'
    
    const errorCodes = ['77', '82', '25']
    
    errorCodes.forEach((code) => {
      logic.handleCodeInput(code)
      expect(store.showErrorOverlay).toHaveBeenCalledWith(
        'riddle2.title',
        `riddle2.incorrect${code}`
      )
    })
  })

  it('rejects invalid inputs', () => {
    const invalidInputs = ['999', '', '123']
    
    invalidInputs.forEach(input => {
      logic.handleCodeInput(input)
      expect(setFeedback).toHaveBeenCalledWith('error', '')
    })
  })

  // Character call tests
  it('handles character calls when callable', () => {
    const character = { name: 'Santiago', avatar: 'avatar.png' }
    store.level = 1
    store.playerName = 'TestPlayer'
    store.isCharCallable.mockReturnValue(true)
    
    logic.handleCharacterCall(character)
    expect(store.markCharacterAsCalled).toHaveBeenCalledWith('Santiago')
    expect(store.startCall).toHaveBeenCalledWith('Santiago', 'avatar.png', 'phone.call1')
  })

  it('handles character calls when not callable', () => {
    const character = { name: 'Santiago', avatar: 'avatar.png' }
    store.isCharCallable.mockReturnValue(false)
    
    logic.handleCharacterCall(character)
    expect(store.startCall).toHaveBeenCalledWith('Santiago', 'avatar.png', 'phone.callUnavailable')
  })

  // Utility functions
  it('returns pending call info', () => {
    store.hasPendingMandatoryCalls.mockReturnValue(true)
    store.getPendingCallType.mockReturnValue('incoming')
    store.getCharacterCallType.mockReturnValue('outgoing')
    
    expect(logic.hasPendingCall()).toBe(true)
    expect(logic.getPendingCallType()).toBe('incoming')
    expect(logic.getCharacterCallType('Santiago')).toBe('outgoing')
  })

  it('handles pending call answer', () => {
    const characters = [
      { name: 'Santiago', avatar: 'avatar.png' },
      { name: 'Maria', avatar: 'avatar2.png' }
    ]
    
    store.isCharCallable.mockImplementation((name) => name === 'Santiago')
    store.hasCalledCharacter.mockReturnValue(false)
    
    logic.answerPendingCall(characters)
    expect(store.markCharacterAsCalled).toHaveBeenCalledWith('Santiago')
  })

  it('handles navigation to level 2', () => {
    store.showCongratsModal = true
    logic.continueToLevel2()
    
    expect(store.showCongratsModal).toBe(false)
    expect(store.level).toBe(2)
    expect(store.resetAfterLevel).toHaveBeenCalled()
    expect(mockPush).toHaveBeenCalledWith('/level/2')
  })
})

describe('checkUpdateScenarioImage', () => {
  let store

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useGameInfo()
    store.enteredCodes = []
    store.riddleSolved = false
    store.currentScenarioImage = 'initial'
    store.activeMessage = null
    store.activeRiddle = null
  })

  it('updates scenario when conditions are met', () => {
    store.enteredCodes = ['8', '4']
    store.riddleSolved = true
    store.activeMessage = { some: 'message' }
    store.activeRiddle = { some: 'riddle' }
    
    checkUpdateScenarioImage()
    
    expect(store.currentScenarioImage).toBe('updated')
    expect(store.activeMessage).toBe(null)
    expect(store.activeRiddle).toBe(null)
  })

  it('does not update when conditions not met', () => {
    store.enteredCodes = ['8']
    store.riddleSolved = false
    store.currentScenarioImage = 'initial'
    
    checkUpdateScenarioImage()
    expect(store.currentScenarioImage).toBe('initial')
  })
})