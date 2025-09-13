import { useGameInfo } from '@/store/gameInfo'
import { useRoute } from 'vue-router'
import { useHintsSolutionsLvl1 } from '@/logic/hintsAndSolutions/level1/useHintsSolutionsLvl1.js'
import { useHintsSolutionsLvl2 } from '@/logic/hintsAndSolutions/level2/useHintsSolutionsLvl2.js'
import { useHintsSolutionsLvl3 } from '@/logic/hintsAndSolutions/level3/useHintsSolutionsLvl3.js'
import { useHintsSolutionsLvl4 } from '@/logic/hintsAndSolutions/level4/useHintsSolutionsLvl4.js'
import { useHintsSolutionsLvl5 } from '@/logic/hintsAndSolutions/level5/useHintsSolutionsLvl5.js'
import { useHintsSolutionsLvl6 } from '@/logic/hintsAndSolutions/level6/useHintsSolutionsLvl6.js'

export function useHintsSolutions() {
    const game = useGameInfo()
    const route = useRoute()
    // Determine current step based on your exact game logic and pass it to the composable of the corresponding level
    if (route.path.includes('/level/1')) {
        return useHintsSolutionsLvl1()
    }
    if (route.path.includes('/level/2')) {
        return useHintsSolutionsLvl2()
    }
    if (route.path.includes('/level/3')) {
        return useHintsSolutionsLvl3()
    }
    if (route.path.includes('/level/4')) {
        return useHintsSolutionsLvl4()
    }
    if (route.path.includes('/level/5')) {
        return useHintsSolutionsLvl5()
    }
    if (route.path.includes('/level/6')) {
        return useHintsSolutionsLvl6()
    }
    
}