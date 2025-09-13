import { useGameInfo } from '@/store/gameInfo'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import hintImageEN4 from '@/assets/en/postits/hint4.png'
import hintImageFR4 from '@/assets/fr/postits/hint4.png'
import hintImageEN5 from '@/assets/en/postits/hint5.png'
import hintImageFR5 from '@/assets/fr/postits/hint5.png'
import hintImageEN6 from '@/assets/en/postits/hint6.png'
import hintImageFR6 from '@/assets/fr/postits/hint6.png'
import hintImageEN7 from '@/assets/en/postits/hint7.png'
import hintImageFR7 from '@/assets/fr/postits/hint7.png'
import callSound from '@/assets/audio/call.mp3'
import { useLevelCompletion } from '@/utils/useLevelCompletion'
import { useRoadmapStore } from '@/store/roadmap'
import { playSound } from '@/utils/playSound'
import stepFoundSound from '@/assets/audio/stepFound.mp3'
import levelSound from '@/assets/audio/level.mp3'

export function useGameLogicLvl3(setFeedback) {
    const game = useGameInfo()
    const { t, locale } = useI18n()
    const router = useRouter()
    const roadmap = useRoadmapStore()
    const { completeLevel } = useLevelCompletion()

    // Handle character calls for level 3
    function handleCharacterCall(character) {
        if (!game.isCharCallable(character.name)) {
            game.startCall(character.name, character.avatar, t('phone.callUnavailable'))
            return
        }

        playSound(callSound)
        const playerName = game.playerName || ''
        
        // Mark character as called
        game.markCharacterAsCalled(character.name)
        
        // Level 3 specific call handling
        if (game.level === 3) {
            game.startCall(character.name, character.avatar, t('phone.call2', { playerName }))
        }
    }

    // Check if there are pending calls
    function hasPendingCall() {
        return game.hasPendingMandatoryCalls()
    }

    // Get pending call type
    function getPendingCallType() {
        return game.getPendingCallType()
    }

    // Get character call type
    function getCharacterCallType(charName) {
        return game.getCharacterCallType(charName)
    }

    // Handle pending call answer
    function answerPendingCall(characters) {
        const pendingChar = characters.find(char => 
            game.isCharCallable(char.name) && !game.hasCalledCharacter(char.name)
        )
        
        if (pendingChar) {
            handleCharacterCall(pendingChar)
        }
    }

    function handleCodeInput(code) {
        const hintCode1 = '17'
        const firstCode = '33'
        const hintCode3 = '57'
        const hintCode4 = '58'
        const hintCode5 = '59'
        const thirdCode = '77'
        const fourthCode = '22'
        const fifthCode = '64'
        const continueLvl4 = '99'

        // Allow hint codes to be re-entered, but block other duplicates
        const hintCodes = [hintCode3, hintCode4, hintCode5]
        const isHintCode = hintCodes.includes(code)
        
        // check if the code is already entered (except hint codes)
        if (!isHintCode && game.enteredCodes.includes(code)) {
            setFeedback('error', '')
            return
        }

        // Step 1: User enters 17 → show overlay with hint
        if (code === hintCode1 && game.enteredCodes.length === 0) {
            setFeedback('success', '')
            game.firstHintFound = true
            playSound(stepFoundSound)
            roadmap.addEntry('step3', 'step3_1')
            const image = locale.value === 'fr' ? hintImageFR4 : hintImageEN4
            game.showOverlay({type: 'image', src: image,})
            return
        }

        // Step 2: User enters 33 → save 33 and 17 and update currentScenarioImage to second
        if (code === firstCode && game.firstHintFound) {
            game.enteredCodes.push(hintCode1)
            game.enteredCodes.push(firstCode)
            game.firstHintFound = false
            game.currentScenarioImage = 'second'
            setFeedback('success', '')
            game.removeOverlay(game.overlayId)
            return
        }

        // when the user enter hintCode3 (57), show the hint with file 57
        if (code === hintCode3 && game.currentScenarioImage === 'fourth') {
            // Only add to enteredCodes if not already there
            if (!game.enteredCodes.includes(hintCode3)) {
                game.enteredCodes.push(hintCode3)
            }
            game.showOverlay({type: 'image', src: locale.value === 'en' ? hintImageEN5 : hintImageFR5,})
            setFeedback('success', '')
            return
        }

        // when the user enter hintCode4 (58), show the hint with file 58
        if (code === hintCode4 && game.currentScenarioImage === 'fourth') {
            // Only add to enteredCodes if not already there
            if (!game.enteredCodes.includes(hintCode4)) {
                game.enteredCodes.push(hintCode4)
            }
            game.showOverlay({type: 'image', src: locale.value === 'en' ? hintImageEN6 : hintImageFR6,})
            setFeedback('success', '')
            return
        }

        // when the user enter hintCode5 (59), show the hint with file 59
        if (code === hintCode5 && game.currentScenarioImage === 'fourth') {
            // Only add to enteredCodes if not already there
            if (!game.enteredCodes.includes(hintCode5)) {
                game.enteredCodes.push(hintCode5)
            }
            game.showOverlay({type: 'image', src: locale.value === 'en' ? hintImageEN7 : hintImageFR7,})
            setFeedback('success', '')
            return
        }

        // if user enters 77 before he found 57, 58 and 59, show an error
        if ((code === thirdCode || code === '76' || code === '78') && (!game.enteredCodes.includes(hintCode3) || !game.enteredCodes.includes(hintCode4) || !game.enteredCodes.includes(hintCode5))) {
            setFeedback('error', '')
            return
        }

        // Step 4: User enters 77 → save 77 and update currentScenarioImage to fifth
        if (code === thirdCode && game.currentScenarioImage === 'fourth') {
            game.removeOverlay(game.overlayId)
            game.removeOverlay(game.overlayId2)
            game.removeOverlay(game.overlayId3)
            game.setCharCallable('Inès', false, 'incoming')
            game.enteredCodes.push(thirdCode)
            game.currentScenarioImage = 'fifth'
            setFeedback('success', '')
            return
        }

        // if user enter 76 or 78 instead of 77, show an error
        if (((code === '76' || code === '78') && game.currentScenarioImage === 'fourth')) {
            game.showErrorOverlay(
                t(`riddle3.title`),
                t(`riddle3.incorrect${code}`),
            )
        }

        // Step 5: User enters 22 → save 22 and update currentScenarioImage to sixth
        if (code === fourthCode && game.currentScenarioImage === 'fifth') {
            game.enteredCodes.push(fourthCode)
            game.currentScenarioImage = 'sixth'
            playSound(stepFoundSound)
            roadmap.addEntry('step3', 'step3_3')
            setFeedback('success', '')
            return
        }

        // Step 6: User enters 64 → save 64 and update currentScenarioImage to seventh
        if (code === fifthCode && game.currentScenarioImage === 'sixth') {
            game.enteredCodes.push(fifthCode)
            game.currentScenarioImage = 'final'
            setFeedback('success', '')
            return
        }

        // Step 8: User enters 99 → continue to level 4
        if (code === continueLvl4 && game.currentScenarioImage === 'final' && game.secondHintFound) {
            completeLevel3()
            game.secondHintFound = false
            setFeedback('success', '')
            game.enteredCodes.push(continueLvl4)
            playSound(levelSound)
            game.showCongratsModal = true
            return
        }

        // If the code does not match any step, show an error
        setFeedback('error', '')
    }

    async function completeLevel3() {
        if (game.levelStartTime) {
        try {
            const completionData = await completeLevel(3, game.levelStartTime)
            game.setLevelCompletionData(completionData)
        } catch (error) {
            console.error('Failed to save level completion:', error)
        }
        }
    }

    // Function to continue to level 4
    function continueToLevel4() {
        game.showCongratsModal = false
        game.resetAfterLevel()
        game.level = 4
        router.push('/level/4')
    }

    return { 
        handleCodeInput, 
        continueToLevel4,
        handleCharacterCall,
        hasPendingCall,
        getPendingCallType,
        getCharacterCallType,
        answerPendingCall
    }
}