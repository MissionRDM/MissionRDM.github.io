import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useGameLogicLvl6 } from '@/logic/level6/gameLogicLvl6.js'
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

// Mock level completion utility
const mockCompleteLevel = vi.fn()
vi.mock('@/utils/useLevelCompletion', () => ({
  useLevelCompletion: () => ({ completeLevel: mockCompleteLevel })
}))

describe('Game Logic Level 6', () => {
  let store, roadmapStore, setFeedback, logic

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useGameInfo()
    roadmapStore = useRoadmapStore()
    
    // Mock essential store methods
    store.showOverlay = vi.fn()
    store.resetAfterLevel = vi.fn()
    store.removeOverlay = vi.fn()
    store.setLevelCompletionData = vi.fn()
    roadmapStore.addEntry = vi.fn()
    
    setFeedback = vi.fn()
    logic = useGameLogicLvl6(setFeedback)
    mockLocale.value = 'en'
    vi.clearAllMocks()
  })

  // Code handling tests
  it('handles first code (2) correctly', () => {
    store.enteredCodes = []
    logic.handleCodeInput('2')
    
    expect(store.enteredCodes).toContain('2')
    expect(store.currentScenarioImage).toBe('second')
    expect(setFeedback).toHaveBeenCalledWith('success', '')
    expect(roadmapStore.addEntry).toHaveBeenCalledWith('step6', 'step6_1')
  })

  it('rejects first code when codes already entered', () => {
    store.enteredCodes = ['1']
    logic.handleCodeInput('2')
    
    expect(setFeedback).toHaveBeenCalledWith('error', '')
  })

  it('handles hint code (1) correctly when in second scenario', () => {
    store.enteredCodes = ['2']
    store.currentScenarioImage = 'second'
    
    logic.handleCodeInput('1')
    
    expect(store.enteredCodes).toContain('1')
    expect(store.firstHintFound).toBe(true)
    expect(store.currentScenarioImage).toBe('third')
    expect(setFeedback).toHaveBeenCalledWith('success', '')
    expect(store.showOverlay).toHaveBeenCalled()
  })

  it('shows hint overlay when code 1 entered in third scenario', () => {
    store.enteredCodes = ['2', '1']
    store.currentScenarioImage = 'third'
    
    logic.handleCodeInput('1')
    
    expect(setFeedback).toHaveBeenCalledWith('success', '')
    expect(store.showOverlay).toHaveBeenCalled()
    // Should not add to enteredCodes again or change scenario
    expect(store.enteredCodes).toEqual(['2', '1'])
    expect(store.currentScenarioImage).toBe('third')
  })

  it('rejects hint code when first code not entered', () => {
    store.enteredCodes = []
    store.currentScenarioImage = 'second'
    
    logic.handleCodeInput('1')
    
    expect(setFeedback).toHaveBeenCalledWith('error', '')
  })

  it('handles final code (1323) correctly', () => {
    store.enteredCodes = ['2', '1']
    store.currentScenarioImage = 'fourth'
    store.firstHintFound = true
    store.levelStartTime = Date.now()

    logic.handleCodeInput('1323')
    
    expect(setFeedback).toHaveBeenCalledWith('success', '')
    expect(store.showCongratsModal).toBe(true)
    expect(mockCompleteLevel).toHaveBeenCalledWith(6, store.levelStartTime)
  })

  it('rejects final code when conditions not met', () => {
    // Missing first hint
    store.enteredCodes = ['2']
    store.currentScenarioImage = 'fourth'
    store.firstHintFound = false
    
    logic.handleCodeInput('1323')
    expect(setFeedback).toHaveBeenCalledWith('error', '')
    
    // Wrong scenario
    store.enteredCodes = ['2', '1']
    store.currentScenarioImage = 'second'
    store.firstHintFound = true
    
    logic.handleCodeInput('1323')
    expect(setFeedback).toHaveBeenCalledWith('error', '')
    
    // Missing first code
    store.enteredCodes = ['1']
    store.currentScenarioImage = 'fourth'
    store.firstHintFound = true
    
    logic.handleCodeInput('1323')
    expect(setFeedback).toHaveBeenCalledWith('error', '')
  })

  it('rejects invalid codes', () => {
    const invalidCodes = ['999', '', '3', '0', 'abc', '36']
    
    invalidCodes.forEach(code => {
      logic.handleCodeInput(code)
      expect(setFeedback).toHaveBeenCalledWith('error', '')
    })
  })

  it('uses correct hint image based on locale', () => {
    store.enteredCodes = ['2']
    store.currentScenarioImage = 'second'
    
    // Test English locale
    mockLocale.value = 'en'
    logic.handleCodeInput('1')
    
    let overlayCall = store.showOverlay.mock.calls[0][0]
    expect(overlayCall.src).toContain('hint17.png')
    
    // Reset and test French locale
    vi.clearAllMocks()
    store.enteredCodes = ['2']
    store.currentScenarioImage = 'second'
    mockLocale.value = 'fr'
    logic.handleCodeInput('1')
    
    overlayCall = store.showOverlay.mock.calls[0][0]
    expect(overlayCall.src).toContain('hint17.png')
  })

  // Navigation tests
  it('handles navigation to end correctly', () => {
    store.showCongratsModal = true
    logic.continueToEnd()
    
    expect(store.showCongratsModal).toBe(false)
    expect(store.level).toBe(0)
    expect(store.resetAfterLevel).toHaveBeenCalled()
    expect(mockPush).toHaveBeenCalledWith('/level/end')
  })

  // Integration tests
  it('follows complete game flow', () => {
    store.levelStartTime = Date.now()
    
    // Step 1: Enter first code
    store.enteredCodes = []
    logic.handleCodeInput('2')
    expect(store.currentScenarioImage).toBe('second')
    
    // Step 2: Enter hint code
    logic.handleCodeInput('1')
    expect(store.firstHintFound).toBe(true)
    expect(store.currentScenarioImage).toBe('third')
    expect(store.showOverlay).toHaveBeenCalled()
    
    // Step 3: User clicks to change to fourth scenario (this would be done elsewhere)
    store.currentScenarioImage = 'fourth'
    
    // Step 4: Enter final code
    logic.handleCodeInput('1323')
    expect(store.showCongratsModal).toBe(true)
    expect(mockCompleteLevel).toHaveBeenCalledWith(6, store.levelStartTime)
    
    // Step 5: Continue to end
    logic.continueToEnd()
    expect(store.level).toBe(0)
    expect(mockPush).toHaveBeenCalledWith('/level/end')
  })

  it('handles level completion without levelStartTime', () => {
    store.enteredCodes = ['2', '1']
    store.currentScenarioImage = 'fourth'
    store.firstHintFound = true
    store.levelStartTime = null // No start time

    logic.handleCodeInput('1323')
    
    expect(setFeedback).toHaveBeenCalledWith('success', '')
    expect(store.showCongratsModal).toBe(true)
    // Should not call completeLevel when no start time
    expect(mockCompleteLevel).not.toHaveBeenCalled()
  })
})