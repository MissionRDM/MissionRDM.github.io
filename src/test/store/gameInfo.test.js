import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useGameInfo } from '@/store/gameInfo.js'

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn()
}
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage })

describe('GameInfo Store', () => {
  let store

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useGameInfo()
    vi.clearAllMocks()
  })

  // Initialization and player management
  it('initializes with correct defaults', () => {
    expect(store.level).toBe(1)
    expect(store.enteredCodes).toEqual([])
    expect(store.riddleSolved).toBe(false)
    expect(store.callableCharacters.Santiago).toBe(false)
    expect(store.currentScenarioImage).toBe('default')
    expect(store.showCongratsModal).toBe(false)
    expect(store.patience).toBe(false)
  })

  // Code and riddle management
  it('manages codes correctly', () => {
    store.addCode('123')
    store.addCode('456')
    expect(store.enteredCodes).toEqual(['123', '456'])
    
    // Duplicate code should not be added
    store.addCode('123')
    expect(store.enteredCodes.filter(c => c === '123')).toHaveLength(1)
  })

  it('manages riddle state', () => {
    store.level = 1
    store.markRiddleAsSolved()
    expect(store.riddleSolved).toBe(true)
    
    store.level = 2
    store.markRiddleAsSolved()
    expect(store.riddleSolved).toBe(true)
  })

  // Character call management
  it('manages character calls and call types', () => {
    // Set character as callable with type
    store.setCharCallable('Santiago', true, 'incoming')
    expect(store.isCharCallable('Santiago')).toBe(true)
    expect(store.getCharacterCallType('Santiago')).toBe('incoming')
    expect(store.hasCalledCharacter('Santiago')).toBe(false)
    
    // Setting callable should reset called status
    store.calledCharacters.Santiago = true
    store.setCharCallable('Santiago', true)
    expect(store.calledCharacters.Santiago).toBe(false)
    
    // Mark character as called
    store.markCharacterAsCalled('Santiago')
    expect(store.hasCalledCharacter('Santiago')).toBe(true)
  })

  it('handles pending mandatory calls', () => {
    store.setCharCallable('Santiago', true, 'incoming')
    expect(store.hasPendingMandatoryCalls()).toBe(true)
    expect(store.getPendingCallType()).toBe('incoming')
    
    store.markCharacterAsCalled('Santiago')
    expect(store.hasPendingMandatoryCalls()).toBe(false)
    
    // Default call type for unknown character
    expect(store.getCharacterCallType('Unknown')).toBe('outgoing')
  })

  // Level 4 specific logic
  it('handles level 4 call sequences', () => {
    store.level = 4
    
    // Inès call sequence
    store.currentScenarioImage = 'second'
    store.markCharacterAsCalled('Inès')
    expect(store.callSequence.Inès).toBe(1)
    expect(store.currentScenarioImage).toBe('third')
    expect(store.callableCharacters.Inès).toBe(false)
    
    // Santiago call sequence
    store.currentScenarioImage = 'fifth'
    store.markCharacterAsCalled('Santiago')
    expect(store.callSequence.Santiago).toBe(1)
    expect(store.currentScenarioImage).toBe('sixth')
    expect(store.shouldShowSantiagoHint).toBe(true)
    
    // Should not trigger in wrong scenario
    store.currentScenarioImage = 'initial'
    store.markCharacterAsCalled('Inès')
    expect(store.currentScenarioImage).toBe('initial')
  })

  // Call, hint, and overlay management
  it('manages active calls', () => {
    store.startCall('Santiago', 'avatar.png', 'Hello')
    expect(store.activeCall.name).toBe('Santiago')
    expect(store.activeCall.avatar).toBe('avatar.png')
    expect(store.activeCall.body).toBe('Hello')

    store.startCall('Inès', 'avatar2.png', 'Hi there', 'Middle Title')
    expect(store.activeCall.titleMiddle).toBe('Middle Title')
    
    store.endCall()
    expect(store.activeCall).toBeNull()
  })

  it('manages hints modal', () => {
    store.showHints('solutions')
    expect(store.showHintModal).toBe(true)
    expect(store.hintModalType).toBe('solutions')

    store.closeHints()
    expect(store.showHintModal).toBe(false)
  })

  it('manages overlay system', () => {
    // Text overlay
    store.showOverlay('Test note')
    const lastOverlay = store.overlayNotes[store.overlayNotes.length - 1]
    expect(store.overlayNotes).toContainEqual({
      id: lastOverlay.id,
      type: 'text',
      text: 'Test note'
    })
    const firstOverlayId = lastOverlay.id
    
    // Object overlay - this may replace the previous overlay
    const overlayObject = { type: 'image', src: 'test.png', title: 'Test' }
    store.showOverlay(overlayObject)
    const imageOverlay = store.overlayNotes[store.overlayNotes.length - 1]
    expect(imageOverlay.type).toBe('image')
    expect(imageOverlay.src).toBe('test.png')
    
    // Remove overlay - use the current overlay ID
    const currentOverlayId = store.overlayId || store.overlayId2 || imageOverlay.id
    store.removeOverlay(currentOverlayId)
    
    // Check that overlay was removed (exact count may vary based on implementation)
    const remainingOverlays = store.overlayNotes.filter(overlay => overlay.id === currentOverlayId)
    expect(remainingOverlays).toHaveLength(0)
  })

  it('manages error overlay', () => {
    // Show with all parameters
    store.showErrorOverlay('Test Title', 'Test message', 'Test hint')
    expect(store.errorOverlayVisible).toBe(true)
    expect(store.errorOverlayData.title).toBe('Test Title')
    expect(store.errorOverlayData.message).toBe('Test message')
    expect(store.errorOverlayData.hint).toBe('Test hint')

    // Default title when empty/null
    store.showErrorOverlay('', 'Message')
    expect(store.errorOverlayData.title).toBe('Erreur')
    
    store.showErrorOverlay(null, 'Message')
    expect(store.errorOverlayData.title).toBe('Erreur')
    
    // Close overlay
    store.closeErrorOverlay()
    expect(store.errorOverlayVisible).toBe(false)
    expect(store.errorOverlayData.title).toBe('')
  })

  it('manages feedback with timeout', () => {
    vi.useFakeTimers()
    
    store.setFeedback('success', 'Well done!')
    expect(store.feedback.type).toBe('success')
    expect(store.feedback.message).toBe('Well done!')

    vi.advanceTimersByTime(2000)
    expect(store.feedback.type).toBe('')
    expect(store.feedback.message).toBe('')
    
    vi.useRealTimers()
  })

  // Message and utility functions
  it('manages message and riddle state', () => {
    store.activeMessage = { from: 'Test', body: 'Test message' }
    store.activeRiddle = { question: 'Test riddle' }
    
    store.markMessageAsRead()
    expect(store.activeMessage).toBeNull()
    expect(store.activeRiddle).toBeNull()
  })

  it('returns current level', () => {
    expect(store.getLvl()).toBe(1)
    store.level = 3
    expect(store.getLvl()).toBe(3)
  })

  // Reset functionality
  it('resets comprehensively after level', () => {
    vi.useFakeTimers()
    
    // Set up complex state
    store.enteredCodes = ['123', '456']
    store.riddleSolved = true
    store.firstHintFound = true
    store.patience = true
    store.currentScenarioImage = 'final'
    store.showCongratsModal = true
    store.setCharCallable('Santiago', true, 'incoming')
    store.markCharacterAsCalled('Santiago')
    store.errorOverlayVisible = true
    store.shouldShowSantiagoHint = true
    store.setFeedback('success', 'Test message')
    
    store.resetAfterLevel()
    
    // Verify complete reset
    expect(store.enteredCodes).toEqual([])
    expect(store.riddleSolved).toBe(false)
    expect(store.firstHintFound).toBe(false)
    expect(store.patience).toBe(false)
    expect(store.currentScenarioImage).toBe('default')
    expect(store.showCongratsModal).toBe(false)
    expect(store.callableCharacters.Santiago).toBe(false)
    expect(store.calledCharacters.Santiago).toBe(false)
    expect(store.characterCallTypes.Santiago).toBe('outgoing')
    expect(store.callSequence.Santiago).toBe(0)
    expect(store.errorOverlayVisible).toBe(false)
    expect(store.shouldShowSantiagoHint).toBe(false)
    
    // Verify timer cleanup
    vi.advanceTimersByTime(3000)
    expect(store.feedback.type).toBe('')
    
    vi.useRealTimers()
  })

  // Edge cases
  it('handles edge cases gracefully', () => {
    // Empty character keys
    expect(store.getCharacterCallType('')).toBe('outgoing')
    expect(store.hasCalledCharacter('')).toBe(false)
    
    // Level 4 logic when not in level 4
    store.level = 1
    store.markCharacterAsCalled('Santiago')
    expect(store.callSequence.Santiago).toBe(0)
  })
})