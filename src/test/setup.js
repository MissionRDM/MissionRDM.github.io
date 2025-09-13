import { vi } from 'vitest'

// Create mock functions that we can access
const mockPush = vi.fn()
const mockUseRoute = vi.fn(() => ({ path: '/level/1' }))
const mockUseRouter = vi.fn(() => ({ push: mockPush }))

// Mock vue-router
vi.mock('vue-router', () => ({
  useRouter: mockUseRouter,
  useRoute: mockUseRoute,
}))

// Mock vue-i18n
vi.mock('vue-i18n', () => ({
  useI18n: vi.fn(() => ({
    t: vi.fn(key => key),
    locale: { value: 'en' },
  })),
}))

// Mock assets and sounds
vi.mock('@/utils/playSound', () => ({ playSound: vi.fn() }))
vi.mock('@/assets/en/postits/hint1.png', () => ({ default: 'hint1.png' }))
vi.mock('@/assets/fr/postits/hint1.png', () => ({ default: 'hint1.png' }))
vi.mock('@/assets/en/postits/hint2.png', () => ({ default: 'hint2.png' }))
vi.mock('@/assets/fr/postits/hint2.png', () => ({ default: 'hint2.png' }))
vi.mock('@/assets/characters/char1.png', () => ({ default: 'char1.png' }))
vi.mock('@/assets/audio/stepFound.mp3', () => ({ default: 'step.mp3' }))
vi.mock('@/assets/audio/message.mp3', () => ({ default: 'message.mp3' }))
vi.mock('@/assets/audio/level.mp3', () => ({ default: 'level.mp3' }))

// Export mocks for use in tests
global.mockRouter = { useRoute: mockUseRoute, useRouter: mockUseRouter, push: mockPush }