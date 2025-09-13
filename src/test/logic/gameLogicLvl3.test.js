import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useGameLogicLvl3 } from '@/logic/level3/gameLogicLvl3.js'
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

describe('Game Logic Level 3', () => {
  let store, roadmapStore, setFeedback, logic

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useGameInfo()
    roadmapStore = useRoadmapStore()
    
    // Mock essential store methods
    store.showOverlay = vi.fn()
    store.showErrorOverlay = vi.fn()
    store.resetAfterLevel = vi.fn()
    store.removeOverlay = vi.fn()
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
    logic = useGameLogicLvl3(setFeedback)
    mockLocale.value = 'en'
    vi.clearAllMocks()
  })

  // Initial progression tests
  it('handles first hint code (17)', () => {
    logic.handleCodeInput('17')
    expect(store.firstHintFound).toBe(true)
    expect(roadmapStore.addEntry).toHaveBeenCalledWith('step3', 'step3_1')
    expect(store.showOverlay).toHaveBeenCalledWith({
      type: 'image',
      src: expect.any(String)
    })

    // Should reject when codes already entered
    store.enteredCodes = ['33']
    logic.handleCodeInput('17')
    expect(setFeedback).toHaveBeenCalledWith('error', '')
  })

  it('handles first code (33) correctly', () => {
    // Should work when hint found
    store.firstHintFound = true
    logic.handleCodeInput('33')
    expect(store.enteredCodes).toContain('17')
    expect(store.enteredCodes).toContain('33')
    expect(store.currentScenarioImage).toBe('second')
    
    // Should reject without hint
    store.firstHintFound = false
    logic.handleCodeInput('33')
    expect(setFeedback).toHaveBeenCalledWith('error', '')
  })

  it('handles hint codes (57, 58, 59)', () => {
    // Set up the correct conditions for hint codes to work
    store.currentScenarioImage = 'fourth'
    
    const hintCodes = ['57', '58', '59']
    
    hintCodes.forEach(code => {
      logic.handleCodeInput(code)
      expect(store.enteredCodes).toContain(code)
      expect(store.showOverlay).toHaveBeenCalledWith({
        type: 'image',
        src: expect.any(String)
      })
    })

    // Should allow re-entering hint codes
    logic.handleCodeInput('57')
    expect(setFeedback).toHaveBeenCalledWith('success', '')

    // Should reject when currentScenarioImage is not 'fourth'
    store.currentScenarioImage = 'second'
    logic.handleCodeInput('58')
    expect(setFeedback).toHaveBeenCalledWith('error', '')
  })

  it('handles code 77 progression', () => {
    store.enteredCodes = ['57', '58', '59']
    store.currentScenarioImage = 'fourth'
    store.firstHintFound = true
    
    logic.handleCodeInput('77')
    expect(store.currentScenarioImage).toBe('fifth')
    expect(store.removeOverlay).toHaveBeenCalledTimes(3)
    expect(store.setCharCallable).toHaveBeenCalledWith('Inès', false, 'incoming')

    // Should reject when hint codes missing
    store.enteredCodes = ['57', '58'] // Missing '59'
    logic.handleCodeInput('77')
    expect(setFeedback).toHaveBeenCalledWith('error', '')
  })

  it('handles error codes with overlays', () => {
    store.enteredCodes = ['57', '58', '59']
    store.currentScenarioImage = 'fourth'
    
    const errorCodes = [
      { code: '76', message: 'riddle3.incorrect76' },
      { code: '78', message: 'riddle3.incorrect78' }
    ]
    
    errorCodes.forEach(({ code, message }) => {
      logic.handleCodeInput(code)
      expect(store.showErrorOverlay).toHaveBeenCalledWith('riddle3.title', message)
    })
  })

  it('rejects invalid inputs', () => {
    const invalidInputs = ['999', '', '22']
    store.currentScenarioImage = 'fourth'
    
    invalidInputs.forEach(input => {
      logic.handleCodeInput(input)
      expect(setFeedback).toHaveBeenCalledWith('error', '')
    })
  })

  it('handles final code (99) to complete level', () => {
    // Set up the required conditions for the final step
    store.currentScenarioImage = 'final'
    store.secondHintFound = true
    
    logic.handleCodeInput('99')
    
    expect(store.enteredCodes).toContain('99')
    expect(setFeedback).toHaveBeenCalledWith('success', '')
    expect(store.showCongratsModal).toBe(true)
    expect(store.secondHintFound).toBe(false)
    
    // Should reject when conditions aren't met
    vi.clearAllMocks()
    store.secondHintFound = false  // Missing required condition
    
    logic.handleCodeInput('99')
    expect(setFeedback).toHaveBeenCalledWith('error', '')
  })

  // Character call tests
  it('handles character calls', () => {
    const character = { name: 'Inès', avatar: 'avatar.png' }
    store.level = 3
    store.playerName = 'TestPlayer'
    
    // When callable
    store.isCharCallable.mockReturnValue(true)
    logic.handleCharacterCall(character)
    expect(store.markCharacterAsCalled).toHaveBeenCalledWith('Inès')
    expect(store.startCall).toHaveBeenCalledWith('Inès', 'avatar.png', 'phone.call2')
    
    // When not callable
    store.isCharCallable.mockReturnValue(false)
    logic.handleCharacterCall(character)
    expect(store.startCall).toHaveBeenCalledWith('Inès', 'avatar.png', 'phone.callUnavailable')
  })

  // Utility functions
  it('returns pending call info', () => {
    store.hasPendingMandatoryCalls.mockReturnValue(true)
    store.getPendingCallType.mockReturnValue('incoming')
    store.getCharacterCallType.mockReturnValue('outgoing')
    
    expect(logic.hasPendingCall()).toBe(true)
    expect(logic.getPendingCallType()).toBe('incoming')
    expect(logic.getCharacterCallType('Inès')).toBe('outgoing')
  })

  it('handles navigation to level 4', () => {
    store.showCongratsModal = true
    logic.continueToLevel4()
    
    expect(store.showCongratsModal).toBe(false)
    expect(store.level).toBe(4)
    expect(store.resetAfterLevel).toHaveBeenCalled()
    expect(mockPush).toHaveBeenCalledWith('/level/4')
  })
})