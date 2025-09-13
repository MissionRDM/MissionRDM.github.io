import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

// This store manages the roadmap for the game, including steps, entries, and localStorage persistence
export const useRoadmapStore = defineStore('roadmap', () => {
  const { t } = useI18n()

  // Top-level steps (visible from start)
  const roadmapSteps = ref([
    { key: 'step1', label: '', items: [] },
    { key: 'step2', label: '', items: [] },
    { key: 'step3', label: '', items: [] },
    { key: 'step4', label: '', items: [] },
    { key: 'step5', label: '', items: [] },
    { key: 'step6', label: '', items: [] }
  ])

  // Flash notification state
  const shouldFlash = ref(false)

  // localStorage key for persistence
  const STORAGE_KEY = 'escape-game-roadmap-entries'

  // Define initial entries with their indentation levels
  const initialEntries = {
    step1: [
      { key: 'step1_1_A', level: 2 },
      { key: 'step1_1_D', level: 2 },
      { key: 'step1_1_H', level: 2 },
      { key: 'step1_4', level: 1 },
      { key: 'step1_5', level: 1 }
    ],
    step4: [
      { key: 'step4_4', level: 1 }
    ],
    step6: [
      { key: 'step6_2', level: 1 }
    ]
  }

  // Set to track initial entry keys for determining if an entry is new
  const initialEntryKeys = new Set()

  // Populate initial entry keys set
  function populateInitialKeys() {
    Object.values(initialEntries).forEach(entries => {
      entries.forEach(entry => {
        initialEntryKeys.add(entry.key)
      })
    })
  }

  // Save current roadmap state to localStorage
  function saveToLocalStorage() {
    try {
      const unlockedEntries = []
      roadmapSteps.value.forEach(step => {
        step.items.forEach(item => {
          // Only save entries that are not part of initial entries
          if (!initialEntryKeys.has(item.key)) {
            unlockedEntries.push({
              stepKey: step.key,
              entryKey: item.key,
              level: item.level,
              isNew: item.isNew
            })
          }
        })
      })
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(unlockedEntries))
    } catch (error) {
      console.error('Failed to save roadmap to localStorage:', error)
    }
  }

  // Load roadmap state from localStorage
  function loadFromLocalStorage() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const unlockedEntries = JSON.parse(saved)
        
        // Add each unlocked entry back to the roadmap
        unlockedEntries.forEach(entry => {
          const step = roadmapSteps.value.find(s => s.key === entry.stepKey)
          if (step) {
            const existingItem = step.items.find(item => item.key === entry.entryKey)
            if (!existingItem) {
              step.items.push({
                text: t(`roadmap.${entry.entryKey}`),
                level: entry.level,
                key: entry.entryKey,
                isNew: entry.isNew
              })
              step.items = sortEntries(step.items)
            }
          }
        })
        
        return true
      }
    } catch (error) {
      console.error('Failed to load roadmap from localStorage:', error)
    }
    return false
  }

  // Clear localStorage
  function clearLocalStorage() {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (error) {
      console.error('Failed to clear roadmap localStorage:', error)
    }
  }

  // Function to sort entries by their key structure
  function sortEntries(entries) {
    return entries.sort((a, b) => {
      const keyA = a.key
      const keyB = b.key
      
      // Split keys into parts for comparison
      const partsA = keyA.split('_')
      const partsB = keyB.split('_')
      
      // Compare each part
      for (let i = 0; i < Math.max(partsA.length, partsB.length); i++) {
        const partA = partsA[i] || ''
        const partB = partsB[i] || ''
        
        // If both parts are numbers, compare numerically
        if (!isNaN(partA) && !isNaN(partB)) {
          const numA = parseInt(partA)
          const numB = parseInt(partB)
          if (numA !== numB) return numA - numB
        }
        // If one is a letter (A-H) and other is number, letter comes after
        else if (partA.match(/^[A-H]$/) && !isNaN(partB)) {
          return 1
        }
        else if (partB.match(/^[A-H]$/) && !isNaN(partA)) {
          return -1
        }
        // If both are letters, compare alphabetically
        else if (partA.match(/^[A-H]$/) && partB.match(/^[A-H]$/)) {
          if (partA !== partB) return partA.localeCompare(partB)
        }
        // Default string comparison
        else {
          if (partA !== partB) return partA.localeCompare(partB)
        }
      }
      
      return 0
    })
  }

  // Set labels and initial entries on initialization
  function initializeSteps() {
    
    // Populate initial keys set first
    populateInitialKeys()
    
    // Clear current items
    roadmapSteps.value.forEach(step => {
      step.items = []
      step.label = t(`roadmap.${step.key}`)
    })
    
    // Add initial entries
    roadmapSteps.value.forEach(step => {
      if (initialEntries[step.key]) {
        const entries = initialEntries[step.key].map(entry => ({
          text: t(`roadmap.${entry.key}`),
          level: entry.level,
          key: entry.key,
          isNew: false // Initial entries are not new
        }))
        
        // Sort entries before adding them
        step.items = sortEntries(entries)
      }
    })
    
    // Try to load saved progress from localStorage
    const hasStoredData = loadFromLocalStorage()
  }

  // Trigger flash notification
  function triggerFlash() {
    shouldFlash.value = true
    setTimeout(() => {
      shouldFlash.value = false
    }, 1000) // Flash for 1 second
  }

  // Add an entry to a step with automatic level detection and sorting
  function addEntry(stepKey, entryKey) {    
    const step = roadmapSteps.value.find(s => s.key === stepKey)
    if (!step) {
      return
    }
    // Trigger flash notification
    triggerFlash()
    const label = t(`roadmap.${entryKey}`)
    const existingItem = step.items.find(item => item.key === entryKey)
    if (!existingItem) {
      // Automatically determine level based on entry key pattern
      let level = 0
      if (entryKey.includes('_')) {
        const parts = entryKey.split('_')
        level = parts.length - 1
        // Special case for A-H sub-items
        if (parts[parts.length - 1].match(/^[A-H]$/)) {
          level = 2
        }
      }
      
      // Determine if this entry is new (not in initial entries)
      const isNew = !initialEntryKeys.has(entryKey)
      
      step.items.push({
        text: label,
        level: level,
        key: entryKey,
        isNew: isNew
      })
      
      // Sort items after adding
      step.items = sortEntries(step.items)
            
      // Save to localStorage after adding
      saveToLocalStorage()
    }
  }

  // Reset all roadmap progress (keep structure but remove all items)
  function resetRoadmap() {    
    // Clear localStorage first
    clearLocalStorage()
    
    roadmapSteps.value.forEach(step => {
      step.items = []
    })
    
    // Re-initialize with initial entries
    initializeSteps()
  }

  // Function to reset to initial state
  function resetToInitial() {
    resetRoadmap()
  }

  return {
    roadmapSteps,
    shouldFlash,
    initializeSteps,
    addEntry,
    resetRoadmap,
    resetToInitial,
    triggerFlash,
    saveToLocalStorage,
    loadFromLocalStorage,
    clearLocalStorage
  }
})