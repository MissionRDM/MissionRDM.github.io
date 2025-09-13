import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useGameLogic } from '@/logic/useGameLogic.js'

// Mock the router
const mockRoute = { path: '/level/1' }
vi.mock('vue-router', () => ({
  useRoute: () => mockRoute
}))

// Mock level functions
const mockLevel1 = { handleCodeInput: vi.fn(), continueToLevel2: vi.fn() }
const mockLevel2 = { handleCodeInput: vi.fn(), continueToLevel3: vi.fn() }
const mockLevel3 = { handleCodeInput: vi.fn(), continueToLevel4: vi.fn() }
const mockLevel4 = { handleCodeInput: vi.fn(), continueToLevel5: vi.fn() }
const mockLevel5 = { handleCodeInput: vi.fn(), continueToLevel6: vi.fn() }
const mockLevel6 = { handleCodeInput: vi.fn(), continueToEnd: vi.fn() }

vi.mock('@/logic/level1/gameLogicLvl1.js', () => ({ useGameLogicLvl1: () => mockLevel1 }))
vi.mock('@/logic/level2/gameLogicLvl2.js', () => ({ useGameLogicLvl2: () => mockLevel2 }))
vi.mock('@/logic/level3/gameLogicLvl3.js', () => ({ useGameLogicLvl3: () => mockLevel3 }))
vi.mock('@/logic/level4/gameLogicLvl4.js', () => ({ useGameLogicLvl4: () => mockLevel4 }))
vi.mock('@/logic/level5/gameLogicLvl5.js', () => ({ useGameLogicLvl5: () => mockLevel5 }))
vi.mock('@/logic/level6/gameLogicLvl6.js', () => ({ useGameLogicLvl6: () => mockLevel6 }))

describe('useGameLogic', () => {
  let setFeedback

  beforeEach(() => {
    setActivePinia(createPinia())
    setFeedback = vi.fn()
    vi.clearAllMocks()
  })

  // Test all level routes
  it('routes to correct level logic', () => {
    const levels = [
      { path: '/level/1', mock: mockLevel1, method: 'continueToLevel2' },
      { path: '/level/2', mock: mockLevel2, method: 'continueToLevel3' },
      { path: '/level/3', mock: mockLevel3, method: 'continueToLevel4' },
      { path: '/level/4', mock: mockLevel4, method: 'continueToLevel5' },
      { path: '/level/5', mock: mockLevel5, method: 'continueToLevel6' },
      { path: '/level/6', mock: mockLevel6, method: 'continueToEnd' }
    ]

    levels.forEach(({ path, mock, method }) => {
      mockRoute.path = path
      const result = useGameLogic(setFeedback)
      expect(result.handleCodeInput).toBe(mock.handleCodeInput)
      expect(result[method]).toBe(mock[method])
    })
  })

  // Test level paths with additional segments
  it('handles level paths with additional segments', () => {
    mockRoute.path = '/level/1/hints'
    const result = useGameLogic(setFeedback)
    expect(result.handleCodeInput).toBe(mockLevel1.handleCodeInput)
  })

  // Test default behavior for non-matching paths
  it('returns default methods for non-matching paths', () => {
    const nonMatchingPaths = ['/level/999', '/home', '', '/level/', '/level/abc']
    
    nonMatchingPaths.forEach(path => {
      mockRoute.path = path
      const result = useGameLogic(setFeedback)
      
      // Should have default methods
      expect(typeof result.handleCharacterCall).toBe('function')
      expect(typeof result.hasPendingCall).toBe('function')
      expect(result.hasPendingCall()).toBe(false)
      expect(result.getPendingCallType()).toBe('outgoing')
      expect(result.getCharacterCallType()).toBe('outgoing')
      
      // Should NOT have handleCodeInput (not in defaults)
      expect(result.handleCodeInput).toBeUndefined()
      
      // Default functions should not throw
      expect(() => result.handleCharacterCall({})).not.toThrow()
      expect(() => result.answerPendingCall([])).not.toThrow()
    })
  })

  // Test method delegation
  it('delegates methods to correct level', () => {
    mockRoute.path = '/level/1'
    const { handleCodeInput } = useGameLogic(setFeedback)
    
    handleCodeInput('test')
    expect(mockLevel1.handleCodeInput).toHaveBeenCalledWith('test')
  })

  // Test method merging (defaults + level methods)
  it('merges default and level methods correctly', () => {
    mockRoute.path = '/level/1'
    const result = useGameLogic(setFeedback)
    
    // Should have both default and level methods
    expect(result.handleCodeInput).toBe(mockLevel1.handleCodeInput) // from level
    expect(typeof result.hasPendingCall).toBe('function') // from defaults
    expect(result.continueToLevel2).toBe(mockLevel1.continueToLevel2) // from level
  })
})