import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useHintsSolutions } from '@/logic/hintsAndSolutions/useHintsSolutions.js'

// Mock vue-router
const mockRoute = { path: '/level/1' }
vi.mock('vue-router', () => ({
  useRoute: () => mockRoute
}))

// Mock the level-specific hints modules
const mockLevel1 = {
  currentHint: { value: 'level1-hint' },
  currentSolution: { value: 'level1-solution' },
  getCurrentStep: vi.fn(),
  showClues: vi.fn(),
  showSolutions: vi.fn()
}

const mockLevel2 = {
  currentHint: { value: 'level2-hint' },
  currentSolution: { value: 'level2-solution' },
  getCurrentStep: vi.fn(),
  showClues: vi.fn(),
  showSolutions: vi.fn()
}

const mockLevel3 = {
  currentHint: { value: 'level3-hint' },
  currentSolution: { value: 'level3-solution' },
  getCurrentStep: vi.fn(),
  showClues: vi.fn(),
  showSolutions: vi.fn()
}

const mockLevel4 = {
  currentHint: { value: 'level4-hint' },
  currentSolution: { value: 'level4-solution' },
  getCurrentStep: vi.fn(),
  showClues: vi.fn(),
  showSolutions: vi.fn()
}

const mockLevel5 = {
  currentHint: { value: 'level5-hint' },
  currentSolution: { value: 'level5-solution' },  
  getCurrentStep: vi.fn(),
  showClues: vi.fn(),
  showSolutions: vi.fn()
}

const mockLevel6 = {
  currentHint: { value: 'level6-hint' },
  currentSolution: { value: 'level6-solution' },
  getCurrentStep: vi.fn(),
  showClues: vi.fn(),
  showSolutions: vi.fn()
}

vi.mock('@/logic/hintsAndSolutions/level1/useHintsSolutionsLvl1.js', () => ({
  useHintsSolutionsLvl1: vi.fn(() => mockLevel1)
}))

vi.mock('@/logic/hintsAndSolutions/level2/useHintsSolutionsLvl2.js', () => ({
  useHintsSolutionsLvl2: vi.fn(() => mockLevel2)
}))

vi.mock('@/logic/hintsAndSolutions/level3/useHintsSolutionsLvl3.js', () => ({
  useHintsSolutionsLvl3: vi.fn(() => mockLevel3)
}))

vi.mock('@/logic/hintsAndSolutions/level4/useHintsSolutionsLvl4.js', () => ({
  useHintsSolutionsLvl4: vi.fn(() => mockLevel4)
}))

vi.mock('@/logic/hintsAndSolutions/level5/useHintsSolutionsLvl5.js', () => ({
  useHintsSolutionsLvl5: vi.fn(() => mockLevel5)
}))

vi.mock('@/logic/hintsAndSolutions/level6/useHintsSolutionsLvl6.js', () => ({
  useHintsSolutionsLvl6: vi.fn(() => mockLevel6)
}))

describe('useHintsSolutions Router', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('routes to level 1 hints and solutions', () => {
    mockRoute.path = '/level/1'
    
    const result = useHintsSolutions()
    
    expect(result).toBe(mockLevel1)
    expect(result.currentHint.value).toBe('level1-hint')
    expect(result.currentSolution.value).toBe('level1-solution')
  })

  it('routes to level 2 hints and solutions', () => {
    mockRoute.path = '/level/2'
    
    const result = useHintsSolutions()
    
    expect(result).toBe(mockLevel2)
    expect(result.currentHint.value).toBe('level2-hint')
    expect(result.currentSolution.value).toBe('level2-solution')
  })

  it('routes to level 3 hints and solutions', () => {
    mockRoute.path = '/level/3'
    
    const result = useHintsSolutions()
    
    expect(result).toBe(mockLevel3)
    expect(result.currentHint.value).toBe('level3-hint')
    expect(result.currentSolution.value).toBe('level3-solution')
  })

  it('routes to level 4 hints and solutions', () => {
    mockRoute.path = '/level/4'
    
    const result = useHintsSolutions()
    
    expect(result).toBe(mockLevel4)
    expect(result.currentHint.value).toBe('level4-hint')
    expect(result.currentSolution.value).toBe('level4-solution')
  })

  it('routes to level 5 hints and solutions', () => {
    mockRoute.path = '/level/5'

    const result = useHintsSolutions()

    expect(result).toBe(mockLevel5)
    expect(result.currentHint.value).toBe('level5-hint')
    expect(result.currentSolution.value).toBe('level5-solution')
  })

  it('routes to level 6 hints and solutions', () => {
    mockRoute.path = '/level/6'

    const result = useHintsSolutions()

    expect(result).toBe(mockLevel6)
    expect(result.currentHint.value).toBe('level6-hint')
    expect(result.currentSolution.value).toBe('level6-solution')
  })

  it('handles level 1 with additional path segments', () => {
    mockRoute.path = '/level/1/hints'
    
    const result = useHintsSolutions()
    
    expect(result).toBe(mockLevel1)
  })

  it('handles level 2 with additional path segments', () => {
    mockRoute.path = '/level/2/solutions'
    
    const result = useHintsSolutions()
    
    expect(result).toBe(mockLevel2)
  })

  it('handles level 3 with additional path segments', () => {
    mockRoute.path = '/level/3/overview'
    
    const result = useHintsSolutions()
    
    expect(result).toBe(mockLevel3)
  })

  it('handles level 4 with additional path segments', () => {
    mockRoute.path = '/level/4/overview'
    
    const result = useHintsSolutions()
    
    expect(result).toBe(mockLevel4)
  })

  it('handles level 5 with additional path segments', () => {
    mockRoute.path = '/level/5/overview'
    const result = useHintsSolutions()
    expect(result).toBe(mockLevel5)
  })

  it('handles level 6 with additional path segments', () => {
    mockRoute.path = '/level/6/overview'
    const result = useHintsSolutions()
    expect(result).toBe(mockLevel6)
  })

  it('returns undefined for non-level paths', () => {
    mockRoute.path = '/home'
    
    const result = useHintsSolutions()
    
    expect(result).toBeUndefined()
  })

  it('returns undefined for invalid level paths', () => {
    mockRoute.path = '/level/'
    
    const result = useHintsSolutions()
    
    expect(result).toBeUndefined()
  })

  it('returns undefined for level with non-numeric identifier', () => {
    mockRoute.path = '/level/abc'
    
    const result = useHintsSolutions()
    
    expect(result).toBeUndefined()
  })

  it('handles edge case paths', () => {
    // Test various edge cases
    const testCases = [
      '/levels/1', // wrong path format
      '/level', // incomplete path
      '/home', // completely different path
      '/level/abc' // non-numeric level
    ]

    testCases.forEach(path => {
      mockRoute.path = path
      const result = useHintsSolutions()
      expect(result).toBeUndefined()
    })
  })
})