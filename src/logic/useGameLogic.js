import { useRoute } from 'vue-router'
import { useGameLogicLvl1 } from '@/logic/level1/gameLogicLvl1.js'
import { useGameLogicLvl2 } from '@/logic/level2/gameLogicLvl2.js'
import { useGameLogicLvl3 } from '@/logic/level3/gameLogicLvl3.js'
import { useGameLogicLvl4 } from '@/logic/level4/gameLogicLvl4.js'
import { useGameLogicLvl5 } from '@/logic/level5/gameLogicLvl5.js'
import { useGameLogicLvl6 } from '@/logic/level6/gameLogicLvl6.js'

export function useGameLogic(setFeedback) {
  const route = useRoute()

  // Default implementations for optional methods
  const defaultMethods = {
    handleCharacterCall: () => {},
    hasPendingCall: () => false,
    getPendingCallType: () => 'outgoing',
    getCharacterCallType: () => 'outgoing',
    answerPendingCall: () => {}
  }

  let levelLogic = {}

  if (route.path.includes('/level/1')) {
    levelLogic = useGameLogicLvl1(setFeedback)
  } else if (route.path.includes('/level/2')) {
    levelLogic = useGameLogicLvl2(setFeedback)
  } else if (route.path.includes('/level/3')) {
    levelLogic = useGameLogicLvl3(setFeedback)
  } else if (route.path.includes('/level/4')) {
    levelLogic = useGameLogicLvl4(setFeedback)
  } else if (route.path.includes('/level/5')) {
    levelLogic = useGameLogicLvl5(setFeedback)
  } else if (route.path.includes('/level/6')) {
    levelLogic = useGameLogicLvl6(setFeedback)
  }

  return {
    ...defaultMethods,
    ...levelLogic
  }
}