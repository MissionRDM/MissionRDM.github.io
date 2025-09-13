import { useGameInfo } from '@/store/gameInfo'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import hintImageEN14 from '@/assets/en/postits/hint14.png'
import hintImageFR14 from '@/assets/fr/postits/hint14.png'
import hintImageEN16 from '@/assets/en/postits/hint16.png'
import hintImageFR16 from '@/assets/fr/postits/hint16.png'
import callSound from '@/assets/audio/call.mp3'
import { useLevelCompletion } from '@/utils/useLevelCompletion'

import { useRoadmapStore } from '@/store/roadmap'
import { playSound } from '@/utils/playSound'
import stepFoundSound from '@/assets/audio/stepFound.mp3'

export function useGameLogicLvl5(setFeedback) {
    const game = useGameInfo()
    const { t, locale } = useI18n()
    const router = useRouter()
    const roadmap = useRoadmapStore()

    // Handle character calls for level 5
    function handleCharacterCall(character) {
        if (!game.isCharCallable(character.name)) {
            game.startCall(character.name, character.avatar, t('phone.callUnavailable'))
            return
        }

        playSound(callSound)
        const playerName = game.playerName || ''
        
        // Mark character as called
        game.markCharacterAsCalled(character.name)
        
        // Level 5 specific call handling
        if (character.name === 'Santiago') {
            game.startCall(character.name, character.avatar, t('phone.call7', { playerName }))
            game.currentScenarioImage = 'fourth'
        } else if (character.name === 'Jack') {
            game.startCall(character.name, character.avatar, t('phone.call8', { playerName }))
            game.currentScenarioImage = 'seventh'
        } else if (character.name === 'Inès') {
            game.startCall(character.name, character.avatar, t('phone.call9', { playerName }))
            game.activeRiddle = true
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

    // Let's add some debugging to understand what's happening

function handleCodeInput(code) {
    const firstCode = '19'
    const hintCode1  = '3'
    const secondCode = '71' // wrong codes here for this riddle are: 72 and 73
    const thirdCode = '96' // wrong codes here for this riddle are: 93, 94 and 95
    const hintCode3 = '8'
    const fourthCode = '6' // wrong codes here for this riddle are: 12, 35 and 13
    const fifthCode = '84' // wrong codes here for this riddle are: 65 and 18

    // Allow hint codes to be re-entered, but block other duplicates
    const hintCodes = [hintCode3, hintCode1 ]
    const isHintCode = hintCodes.includes(code)

    // Check if the code is already entered (except hint codes)
    if (!isHintCode && game.enteredCodes.includes(code)) {
        setFeedback('error', '')
        return
    }

    // Step 1: first code is 3 and changes the scenario to the second
    if (code === hintCode1 && game.enteredCodes.length === 0) {
        setFeedback('success', '')
        game.firstHintFound = true
        const image = locale.value === 'fr' ? hintImageFR14 : hintImageEN14
        game.showOverlay({type: 'image', src: image,})
        game.currentScenarioImage = 'second'
        return
    }

    // Step 2: second code is 19 and changes the scenario to the third
    if (code === firstCode && game.firstHintFound && !game.enteredCodes.includes(firstCode)) {
        game.removeOverlay(game.overlayId)
        setFeedback('success', '')
        playSound(stepFoundSound)
        roadmap.addEntry('step5', 'step5_1')
        game.currentScenarioImage = 'third'
        game.enteredCodes.push(firstCode)
        //wait 3 seconds and make Santiago callable
        setTimeout(() => {
            game.setCharCallable('Santiago', true, 'outgoing')
        }, 3000)
        return
    }

    // Step 3: Find answer for riddle right answer is 71 wrong answers are 72 and 73
    if (code === secondCode && game.currentScenarioImage === 'fourth') {
        game.setCharCallable('Santiago', false, 'outgoing')
        setFeedback('success', '')
        playSound(stepFoundSound)
        roadmap.addEntry('step5', 'step5_2')
        game.currentScenarioImage = 'fifth'
        game.enteredCodes.push(secondCode)
        return
    }

    // ERROR CHECK 1: Wrong codes for riddle when scenario is 'fourth'
    if (game.currentScenarioImage === 'fourth' && (code === '72' || code === '73')) {    
        // Debug the translation values
        const title = t(`riddle4.title`)
        const message = t(`riddle4.incorrect`)
        try {
            game.showErrorOverlay(title, message)
        } catch (error) {
            console.error('Error showing overlay:', error)
        }
        return
    }

    // Step 5: Find answer for riddle right answer is 96 wrong answers are 93, 94 and 95
    if (code === thirdCode && game.currentScenarioImage === 'fifth' && game.secondHintFound) {
        game.removeOverlay(game.overlayId)
        setFeedback('success', '')
        playSound(stepFoundSound)
        roadmap.addEntry('step5', 'step5_4')
        game.currentScenarioImage = 'sixth'
        //wait 3 seconds and make Jack callable
        setTimeout(() => {
            game.setCharCallable('Jack', true, 'outgoing')
        }, 5000)
        game.enteredCodes.push(thirdCode)
        return
    }

    // ERROR CHECK 2: Wrong codes for riddle when scenario is 'fifth' AND hint is found
    if (game.currentScenarioImage === 'fifth' && game.secondHintFound && (code === '93' || code === '94' || code === '95')) {
        game.showErrorOverlay(
            t(`riddle5.title`),
            t(`riddle5.incorrect${code}`),
        )
        return 
    }

    // Step 6: Find hint hintCode3 (8) and show overlay
    if (code === hintCode3 && game.currentScenarioImage === 'seventh') {
        setFeedback('success', '')
        game.thirdHintFound = true
        const image = locale.value === 'fr' ? hintImageFR16 : hintImageEN16
        game.showOverlay({type: 'image', src: image,})
        return
    }

    // Step 7: Find answer for riddle right answer is 6 wrong answers are 12, 35 and 13
    if (code === fourthCode && game.currentScenarioImage === 'seventh' && game.thirdHintFound) {
        game.setCharCallable('Jack', false, 'outgoing')
        game.removeOverlay(game.overlayId)
        setFeedback('success', '')
        playSound(stepFoundSound)
        roadmap.addEntry('step5', 'step5_3')
        game.currentScenarioImage = 'eighth'
        //wait 3 seconds and make Inès callable
        setTimeout(() => {
            game.setCharCallable('Inès', true, 'incoming')
        }, 3000)
        game.enteredCodes.push(fourthCode)
        return
    }

    // ERROR CHECK 3: Wrong codes for riddle when scenario is 'seventh' AND hint is found
    if (game.currentScenarioImage === 'seventh' && game.thirdHintFound && (code === '12' || code === '35' || code === '13')) {
        game.showErrorOverlay(
            t(`riddle6.title`),
            t(`riddle6.incorrect`),
        )
        return 
    }

    // Step 8: Find answer for riddle right answer is 84 wrong answers are 65 and 18
    if (code === fifthCode && game.currentScenarioImage === 'eighth' && game.activeRiddle) {
        game.setCharCallable('Inès', false, 'incoming')
        setFeedback('success', '')
        game.currentScenarioImage = 'ninth'
        game.enteredCodes.push(fifthCode)
        return
    }

    // ERROR CHECK 4: Wrong codes for riddle when scenario is 'eighth'
    if (game.currentScenarioImage === 'eighth' && (code === '65' || code === '18') && game.activeRiddle) {
        game.showErrorOverlay(
            t(`riddle6.title`), 
            t(`riddle6.incorrect`),
        )
        return
    }

    // If the code does not match any step, show an error
    setFeedback('error', '')
}

    // Function to continue to level 4
    function continueToLevel6() {
        game.showCongratsModal = false
        game.resetAfterLevel()
        game.level = 6
        router.push('/level/6')
    }

    return { 
        handleCodeInput, 
        continueToLevel6,
        handleCharacterCall,
        hasPendingCall,
        getPendingCallType,
        getCharacterCallType,
        answerPendingCall
    }
}