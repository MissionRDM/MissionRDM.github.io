import { v4 as uuid } from 'uuid'
import { db } from "@/services/firebase"
import { ref, set, get, update } from "firebase/database"
import { ref as vueRef } from 'vue'

// Create a global session ref that's shared across all instances
const globalSession = vueRef(null)

export function useSession() {
  // Return the same session ref every time
  const session = globalSession
  
  const createGameSession = async (playerName) => {
    try {
      const sessionId = uuid()
      
      // Create session data for Firebase
      const firebaseSessionData = { id: sessionId }
      
      // Save to Firebase
      await set(ref(db, `/${sessionId}`), firebaseSessionData)
      
      // Store full session data in the global session ref
      session.value = { 
        id: sessionId, 
        playerName: playerName,
        startTime: Date.now() 
      }
      
      // Store session ID in localStorage 
      localStorage.setItem('sessionId', sessionId)
      
      return sessionId
    } catch (error) {
      throw error
    }
  }

  const saveLevelTime = async (level, timeSpent) => {
    if (!session.value) {
      return
    }
    
    try {
      const sessionId = session.value.id
      
      // Check if this session already completed this level
      const existingLevelRef = ref(db, `/${sessionId}/levels/${level}`)
      const existingSnapshot = await get(existingLevelRef)
      
      let shouldUpdateAverage = false
      let timeToUseForAverage = timeSpent
      let timeToSave = timeSpent
      
      if (existingSnapshot.exists()) {
        // Session already completed this level
        const existingTime = existingSnapshot.val().timeSpent
        
        if (timeSpent > existingTime) {
          // New time is slower (higher), save it and update average
          shouldUpdateAverage = true
          timeToUseForAverage = timeSpent - existingTime // Only add the difference
          timeToSave = timeSpent // Save the longer time
        } else {
          // New time is faster, keep existing time in DB
          timeToSave = existingTime // Keep the longer time
        }
      } else {
        // First time completing this level for this session
        shouldUpdateAverage = true
      }
      
      // Save only the longest time to database
      await set(ref(db, `/${sessionId}/levels/${level}`), {
        timeSpent: timeToSave,
        completedAt: Date.now()
      })
      
      // Only update average if needed
      if (shouldUpdateAverage) {
        await updateAverageTime(level, timeToUseForAverage)
      }
      
    } catch (error) {
      console.error('Error saving level time:', error)
    }
  }

  // Update the average time for a level
  // This function calculates the new average based on the total time and count of submissions
  const updateAverageTime = async (level, timeSpent) => {
    try {
      const avgRef = ref(db, `/averages/level_${level}`)
      const snapshot = await get(avgRef)
      
      if (snapshot.exists()) {
        const data = snapshot.val()
        
        const newCount = data.count + 1
        const newTotal = data.totalTime + timeSpent
        const newAverage = newTotal / newCount
        
        await update(avgRef, {
          count: newCount,
          totalTime: newTotal,
          average: newAverage
        })
        
      } else {
        await set(avgRef, {
          count: 1,
          totalTime: timeSpent,
          average: timeSpent
        })
        
      }
    } catch (error) {
      console.error('Error updating average time:', error)
    }
  }

  // Get the average time for a level
  // This function retrieves the average time from Firebase for a specific level
  const getAverageTime = async (level) => {
    try {
      const avgRef = ref(db, `/averages/level_${level}`)
      const snapshot = await get(avgRef)
      
      if (snapshot.exists()) {
        const average = snapshot.val().average
        return average
      }
      return null
    } catch (error) {
      return null
    }
  }

  // Restore session from localStorage
  // This function checks if a session ID exists in localStorage and retrieves the session data from Firebase
  // If the session exists, it restores the session to the global session ref
  const restoreSession = async () => {
    const sessionId = localStorage.getItem('sessionId')
    
    if (sessionId) {
      try {
        const sessionRef = ref(db, `/${sessionId}`)
        const snapshot = await get(sessionRef)
        
        if (snapshot.exists()) {
          // Restore to global session
          session.value = { id: sessionId, ...snapshot.val() }
          return session.value
        } else {
        }
      } catch (error) {
      }
    }
    return null
  }

  return {
    session,
    createGameSession,
    saveLevelTime,
    getAverageTime,
    restoreSession
  }
}