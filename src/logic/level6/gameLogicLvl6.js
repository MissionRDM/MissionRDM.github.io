import { useGameInfo } from '@/store/gameInfo'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import hintImageEN17 from '@/assets/en/postits/hint17.png'
import hintImageFR17 from '@/assets/fr/postits/hint17.png'
import { useRoadmapStore } from '@/store/roadmap'
import { playSound } from '@/utils/playSound'
import stepFoundSound from '@/assets/audio/stepFound.mp3'
import levelSound from '@/assets/audio/level.mp3'
import { useLevelCompletion } from '@/utils/useLevelCompletion'

export function useGameLogicLvl6(setFeedback) {
    const game = useGameInfo()
    const { locale } = useI18n()
    const router = useRouter()
    const roadmap = useRoadmapStore()
    const { completeLevel } = useLevelCompletion()

    function handleCodeInput(code) {
        const firstCode = '2'
        const hintCode1 = '1'
        const finalCode = '1323'

        // Step 1: User enters code '2' change scenario to second 
        if (code === firstCode && game.enteredCodes.length === 0) {
            game.enteredCodes.push(code)
            game.currentScenarioImage = 'second'
            setFeedback('success', '')
            playSound(stepFoundSound)
            roadmap.addEntry('step6', 'step6_1')
            return
        }

        // Step 2: User enters code '1' show overlay with hint
        if (code === hintCode1 && game.currentScenarioImage === 'second' && game.enteredCodes.includes(firstCode)) { 
            setFeedback('success', '')
            game.enteredCodes.push(code)
            game.firstHintFound = true
            const image = locale.value === 'fr' ? hintImageFR17 : hintImageEN17
            game.showOverlay({type: 'image', src: image,})
            game.currentScenarioImage = 'third'
            return
        }

        // User can still enter code 1 to see the hint
        if (code === hintCode1 && game.currentScenarioImage === 'third') {
            setFeedback('success', '')
            const image = locale.value === 'fr' ? hintImageFR17 : hintImageEN17
            game.showOverlay({type: 'image', src: image,})
            return
        }

        // Step 3: User enters code '1323' change scenario to third
        if (code === finalCode && game.currentScenarioImage === 'fourth' && game.enteredCodes.includes(firstCode) && game.firstHintFound) {
            completeLevel6()
            setFeedback('success', '')
            playSound(levelSound)
            game.showCongratsModal = true
            return
        }

        // If the code does not match any step, show an error
        setFeedback('error', '')
    }

    async function completeLevel6() {
        if (game.levelStartTime) {
            try {
                const completionData = await completeLevel(6, game.levelStartTime)
                game.setLevelCompletionData(completionData)
            } catch (error) {
                console.error('Failed to save level completion:', error)
            }
        }
    }

    // Function to continue to level 4
    function continueToEnd() {
        game.showCongratsModal = false
        game.resetAfterLevel()
        game.level = 0
        router.push('/level/end')
    }

    return { 
        handleCodeInput, 
        continueToEnd
    }
}