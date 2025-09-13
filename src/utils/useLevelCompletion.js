import { inject, unref } from 'vue'
import { useSession } from '@/composables/useSession'

export function useLevelCompletion() {
  const { saveLevelTime, getAverageTime } = useSession()
  const rawTimerRef = inject('timer', null)

  const completeLevel = async (levelNumber, startTime = null) => {
    // unwrap in case it was provided as a ref
    const timer = unref(rawTimerRef)

    // get the true start time (timer or fallback)
    const actualStartTime = startTime
      ?? (timer?.getStartTime?.() ?? Date.now())

    // figure out total seconds, using timer if available
    const totalSeconds = timer?.getCurrentTimeInSeconds?.()
      ?? Math.round((Date.now() - actualStartTime) / 1000)

    // convert back to ms for consistency
    const finalTimeSpent = totalSeconds * 1000

    try {
      await saveLevelTime(levelNumber, finalTimeSpent)
      const averageTime = await getAverageTime(levelNumber)
      
      // Calculate performance metrics
      const timeInSeconds = Math.round(finalTimeSpent / 1000)
      const avgInSeconds = averageTime ? Math.round(averageTime / 1000) : null
      
      return {
        timeSpent: finalTimeSpent,
        averageTime,
        timeInSeconds,
        avgInSeconds,
        isAboveAverage: averageTime ? finalTimeSpent < averageTime : null,
        hasTimer: !!timer
      }
      
     } catch (error) {
      console.error('Error completing level:', error)
    }
  }

  const addTimePenalty = (seconds) => {
    const timer = unref(rawTimerRef)
    if (timer?.addPenalty) {
      timer.addPenalty(seconds)
    }
  }

  return {
    completeLevel,
    addTimePenalty
  }
}