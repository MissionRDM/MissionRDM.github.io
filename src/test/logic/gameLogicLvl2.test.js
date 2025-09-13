import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useGameLogicLvl2 } from '@/logic/level2/gameLogicLvl2.js'
import { useGameInfo } from '@/store/gameInfo.js'
import { useRoadmapStore } from '@/store/roadmap.js'

// Mock the router
const mockPush = vi.fn()
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mockPush
  })
}))

// Mock i18n with a mutable locale ref
const mockLocale = { value: 'en' }
vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: vi.fn(),
    locale: mockLocale
  })
}))

// Mock sound utilities
vi.mock('@/utils/playSound', () => ({
  playSound: vi.fn()
}))

describe('Game Logic Level 2', () => {
  let store, roadmapStore, setFeedback, logic

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useGameInfo()
    roadmapStore = useRoadmapStore()
    
    // Mock store methods that need to be spies
    store.showOverlay = vi.fn()
    store.resetAfterLevel = vi.fn()
    roadmapStore.addEntry = vi.fn()
    
    setFeedback = vi.fn()
    logic = useGameLogicLvl2(setFeedback)
    
    // Reset locale to English for each test
    mockLocale.value = 'en'
    
    vi.clearAllMocks()
  })

  it('rejects duplicate codes', () => {
    store.enteredCodes = ['9']
    logic.handleCodeInput('9')
    expect(setFeedback).toHaveBeenCalledWith('error', '')
  })

  it('handles first code (9) - updates to second scenario', () => {
    logic.handleCodeInput('9')
    expect(store.enteredCodes).toContain('9')
    expect(store.currentScenarioImage).toBe('second')
    expect(setFeedback).toHaveBeenCalledWith('success', '')
    expect(roadmapStore.addEntry).toHaveBeenCalledWith('step2', 'step2_2')
  })

  it('handles second code (15) - progresses to third scenario', () => {
    store.currentScenarioImage = 'second'
    logic.handleCodeInput('15')
    expect(store.enteredCodes).toContain('15')
    expect(store.currentScenarioImage).toBe('third')
    expect(setFeedback).toHaveBeenCalledWith('success', '')
  })

  it('handles third code (31) - progresses to fourth scenario', () => {
    store.currentScenarioImage = 'third'
    logic.handleCodeInput('31')
    expect(store.enteredCodes).toContain('31')
    expect(store.currentScenarioImage).toBe('fourth')
    expect(setFeedback).toHaveBeenCalledWith('success', '')
    expect(roadmapStore.addEntry).toHaveBeenCalledWith('step2', 'step2_3')
  })

  it('handles fourth code (1) - progresses to fifth scenario', () => {
    store.currentScenarioImage = 'fourth'
    logic.handleCodeInput('1')
    expect(store.enteredCodes).toContain('1')
    expect(store.currentScenarioImage).toBe('fifth')
    expect(setFeedback).toHaveBeenCalledWith('success', '')
  })

  it('handles fifth code (36) - progresses to final scenario', () => {
    store.currentScenarioImage = 'fifth'
    logic.handleCodeInput('36')
    expect(store.enteredCodes).toContain('36')
    expect(store.currentScenarioImage).toBe('final')
    expect(setFeedback).toHaveBeenCalledWith('success', '')
    expect(roadmapStore.addEntry).toHaveBeenCalledWith('step2', 'step2_1')
  })

  it('handles hint code (7)', () => {
    store.currentScenarioImage = 'final'
    logic.handleCodeInput('7')
    expect(setFeedback).toHaveBeenCalledWith('success', '')
    expect(store.currentScenarioImage).toBe('main')
  })

  it('handles continue code (11) - progresses to level 3', () => {
    store.currentScenarioImage = 'main'
    logic.handleCodeInput('11')
    expect(setFeedback).toHaveBeenCalledWith('success', '')
    expect(store.enteredCodes).toContain('11')
    expect(store.showCongratsModal).toBe(true)
  })

  it('rejects continue code (11) when hint is not found', () => {
    store.currentScenarioImage = 'final'
    store.firstHintFound = false
    logic.handleCodeInput('11')
    expect(setFeedback).toHaveBeenCalledWith('error', '')
    expect(store.showCongratsModal).not.toBe(true)
  })

  it('rejects codes in wrong sequence', () => {
    // Try second code without being in second scenario
    logic.handleCodeInput('15')
    expect(setFeedback).toHaveBeenCalledWith('error', '')
    expect(store.enteredCodes).not.toContain('15')
  })

  it('rejects invalid codes', () => {
    logic.handleCodeInput('999')
    expect(setFeedback).toHaveBeenCalledWith('error', '')
  })

  it('continues to level 3 from modal', () => {
    store.showCongratsModal = true
    logic.continueToLevel3()
    
    expect(store.showCongratsModal).toBe(false)
    expect(store.level).toBe(3)
    expect(store.resetAfterLevel).toHaveBeenCalled()
    expect(mockPush).toHaveBeenCalledWith('/level/3')
  })

  it('progresses through complete sequence', () => {
    // Complete sequence test
    logic.handleCodeInput('9')
    expect(store.currentScenarioImage).toBe('second')
    
    logic.handleCodeInput('15')
    expect(store.currentScenarioImage).toBe('third')
    
    logic.handleCodeInput('31')
    expect(store.currentScenarioImage).toBe('fourth')
    
    logic.handleCodeInput('1')
    expect(store.currentScenarioImage).toBe('fifth')
    
    logic.handleCodeInput('36')
    expect(store.currentScenarioImage).toBe('final')
  })
})