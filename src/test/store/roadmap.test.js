import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useRoadmapStore } from '@/store/roadmap.js'

// Mock vue-i18n
vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key) => key
  })
}))

describe('Roadmap Store', () => {
  let store

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useRoadmapStore()
  })

  it('initializes with 6 steps', () => {
    expect(store.roadmapSteps).toHaveLength(6)
    expect(store.shouldFlash).toBe(false)
  })

  it('initializes steps with labels and initial entries', () => {
    store.initializeSteps()
    
    const step1 = store.roadmapSteps.find(s => s.key === 'step1')
    expect(step1.items.length).toBeGreaterThan(0)
    expect(step1.label).toBe('roadmap.step1')
  })

  it('adds entries correctly', () => {
    store.initializeSteps()
    store.addEntry('step1', 'step1_test')
    
    const step1 = store.roadmapSteps.find(s => s.key === 'step1')
    expect(step1.items.some(item => item.key === 'step1_test')).toBe(true)
    expect(store.shouldFlash).toBe(true)
  })

  it('prevents duplicate entries', () => {
    store.initializeSteps()
    store.addEntry('step1', 'step1_test')
    store.addEntry('step1', 'step1_test')
    
    const step1 = store.roadmapSteps.find(s => s.key === 'step1')
    const count = step1.items.filter(item => item.key === 'step1_test').length
    expect(count).toBe(1)
  })

  it('handles invalid step key', () => {
    store.initializeSteps()
    store.addEntry('invalid_step', 'test_entry')
    // Should not throw error
  })

  it('detects entry levels correctly', () => {
    store.initializeSteps()
    store.addEntry('step2', 'step2_1_A') // Should be level 2
    
    const step2 = store.roadmapSteps.find(s => s.key === 'step2')
    const entry = step2.items.find(item => item.key === 'step2_1_A')
    expect(entry.level).toBe(2)
  })

  it('resets correctly', () => {
    store.initializeSteps()
    store.addEntry('step1', 'step1_test')
    store.resetRoadmap()
    
    const step1 = store.roadmapSteps.find(s => s.key === 'step1')
    expect(step1.items.some(item => item.key === 'step1_test')).toBe(false)
  })

  it('triggers flash manually', () => {
    store.triggerFlash()
    expect(store.shouldFlash).toBe(true)
  })

  it('handles localStorage errors gracefully', () => {
    // Mock localStorage to throw error
    const originalSetItem = Storage.prototype.setItem
    Storage.prototype.setItem = vi.fn(() => { throw new Error('Storage error') })
    
    store.initializeSteps()
    expect(() => store.addEntry('step1', 'test')).not.toThrow()
    
    // Restore
    Storage.prototype.setItem = originalSetItem
  })
})