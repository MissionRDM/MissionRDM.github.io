import { useGameInfo } from '@/store/gameInfo'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import hintImageEN9 from '@/assets/en/postits/hint9.png'
import hintImageFR9 from '@/assets/fr/postits/hint9.png'
import hintImageEN10 from '@/assets/en/postits/hint10.png'
import hintImageFR10 from '@/assets/fr/postits/hint10.png'
import hintImageEN11 from '@/assets/en/postits/hint11.png'
import hintImageFR11 from '@/assets/fr/postits/hint11.png'
import hintImageEN12 from '@/assets/en/postits/hint12.png'
import hintImageFR12 from '@/assets/fr/postits/hint12.png'
import messageSound from '@/assets/audio/message.mp3'
import callSound from '@/assets/audio/call.mp3'
import char2 from '@/assets/characters/char2.png'
import char4 from '@/assets/characters/char4.png'
import { useLevelCompletion } from '@/utils/useLevelCompletion'

import { useRoadmapStore } from '@/store/roadmap'
import { playSound } from '@/utils/playSound'
import stepFoundSound from '@/assets/audio/stepFound.mp3'
import levelSound from '@/assets/audio/level.mp3'

export function useGameLogicLvl4(setFeedback) {

    const game = useGameInfo()
    const { t, locale } = useI18n()
    const router = useRouter()
    const roadmap = useRoadmapStore()
    const { completeLevel } = useLevelCompletion()

    function handleCharacterCall(character) {
        if (!game.isCharCallable(character.name)) {
            game.startCall(character.name, character.avatar, t('phone.callUnavailable'))
            return
        }

        playSound(callSound)
        const playerName = game.playerName || ''
        
        // Mark character as called
        game.markCharacterAsCalled(character.name)
        
        // Handle different call scenarios
        if (character.name === 'Inès' && game.callSequence['Inès'] === 1) {
            game.startCall(character.name, character.avatar, t('phone.call3', { playerName }))
        }
        else if (character.name === 'Santiago' && game.callSequence['Santiago'] === 1) {
            game.startCall(character.name, character.avatar, t('phone.call4', { playerName }), t('roadmap.step4_2'))
            setTimeout(() => {
                roadmap.addEntry('step4', 'step4_2')
                playSound(stepFoundSound)
            }, 3000)
        }
        else if (character.name === 'Santiago' && game.callSequence['Santiago'] === 2) {
            game.startCall(character.name, character.avatar, t('phone.call5', { playerName }), t('roadmap.step4_3'))
            setTimeout(() => {
                roadmap.addEntry('step4', 'step4_3')
                playSound(stepFoundSound)
            }, 3000)
            game.setCharCallable('Santiago', false, 'incoming')
            game.currentScenarioImage = 'seventh'
        }
        else if (character.name === 'Santiago' && game.callSequence['Santiago'] >= 3) {
            // Changed condition to >= 3 to handle multiple calls after the second one
            game.startCall(character.name, character.avatar, t('phone.call6', { playerName }))
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

        const hintCode1 = '4'
        const hintCode2 = '51'
        const secondCode = '23'
        const thirdCode = '81'
        const fourthCode = '1'
        const fifthCode = '61'
        const fifthCodeEN = '17'
        const fifthCodeFR = '32'
        const hintCode3 = '3'
        const messageCode = '47'

        // Allow hint codes to be re-entered, but block other duplicates
        const hintCodes = [hintCode1, hintCode2]
        const isHintCode = hintCodes.includes(code)

        // Check if the code is already entered (except hint codes)
        if (!isHintCode && game.enteredCodes.includes(code)) {
            setFeedback('error', '')
            return
        }

        // Step 2: User enters 4 or 51 → show overlay with hint (only after calling Inès)
        if ((code === hintCode1 || code === hintCode2) && game.currentScenarioImage === 'third' && game.callSequence['Inès'] >= 1) {
            if (code === hintCode1) {
                setFeedback('success', '')
                game.showOverlay({type: 'image', src: locale.value === 'en' ? hintImageEN9 : hintImageFR9,})
                if (!game.enteredCodes.includes(code)) {
                    game.enteredCodes.push(code)
                }
            } else if (code === hintCode2) {
                setFeedback('success', '')
                if (game.enteredCodes.includes(hintCode1)) {
                    game.showOverlay({type: 'image', src: locale.value === 'en' ? hintImageEN11 : hintImageFR11,})
                    if (!game.enteredCodes.includes(code)) {
                        game.enteredCodes.push(code)
                    }
                } else {
                    game.showOverlay({type: 'image', src: locale.value === 'en' ? hintImageEN10 : hintImageFR10,})
                }
            }
            return
        }

        // Step 3: User enters 23 -> Inès sends a message
        if (code === secondCode && game.currentScenarioImage === 'third' && 
            game.enteredCodes.includes(hintCode1) && game.enteredCodes.includes(hintCode2) && 
            game.callSequence['Inès'] >= 1) {
            game.removeOverlay(game.overlayId)
            setFeedback('success', '')
            game.currentScenarioImage = 'fourth'
            game.enteredCodes.push(code)
            playSound(messageSound)
            const playerName = game.playerName || ''
            game.activeMessage = {
                name: 'Inés',
                image: 'ines',
                avatar: char2,
                body: t('phone.messageBodylvl3', { playerName })
            }
            return
        }

        // Step 4: User enters 81 change scenario image
        if (code === thirdCode && game.currentScenarioImage === 'fourth') {
            setFeedback('success', '')
            game.currentScenarioImage = 'fifth'
            game.enteredCodes.push(code)
            // wait 3 seconds and show that user has to call Santiago
            setTimeout(() => {
                game.setCharCallable('Santiago', true, 'outgoing')
                game.callSequence['Santiago'] = 0  
                game.calledCharacters['Santiago'] = false
            }, 5000)
            return
        }

        // Step 5: User enters 1 (only after calling Santiago first time)
        if (code === fourthCode && game.currentScenarioImage === 'sixth' && game.callSequence['Santiago'] >= 1) {
            setFeedback('success', '')
            game.removeOverlay(game.overlayId)
            // show overlay with hint
            game.showOverlay({type: 'image', src: locale.value === 'en' ? hintImageEN12 : hintImageFR12,})
            game.firstHintFound = true
            return
        }

        // Step 5: User enters 61 → remove overlay and Santiago calls again
        if (code === fifthCode && game.currentScenarioImage === 'sixth' && game.firstHintFound && game.callSequence['Santiago'] >= 1) {
            setFeedback('success', '')
            game.removeOverlay(game.overlayId)
            game.setCharCallable('Santiago', true, 'incoming')
            game.calledCharacters['Santiago'] = false  
            game.enteredCodes.push(code)
            return
        }

        // Step 6: user enters 17/32 (only after calling Santiago second time)
        if ((code === fifthCodeEN || code === fifthCodeFR) && game.currentScenarioImage === 'seventh' && 
            game.secondHintFound && game.callSequence['Santiago'] >= 2) {
            //check the language and entered Code
            if ((locale.value === 'en' && code === fifthCodeEN) || (locale.value === 'fr' && code === fifthCodeFR)) {
                setFeedback('success', '')
                game.removeOverlay(game.overlayId)
                //show message from Anne
                playSound(messageSound)
                const playerName = game.playerName || ''
                game.activeMessage = {
                    name: 'Anne',
                    image: 'anne',
                    avatar: char4,
                    body: t('phone.messageBodylvl4', { playerName })
                }
                // NOW make Santiago uncallable after riddle is solved
                game.setCharCallable('Santiago', false, 'outgoing')
                game.currentScenarioImage = 'eighth'
                game.enteredCodes.push(code)
                return
            }
            setFeedback('error', '')
            return
        }

        // If user enters 99 show message again
        if (code === '99' && game.currentScenarioImage === 'eighth' && game.firstHintFound && 
            game.callSequence['Santiago'] >= 2) {
            setFeedback('success', '')
            playSound(messageSound)
            const playerName = game.playerName || ''
            game.activeMessage = {
                name: 'Anne',
                image: 'anne',
                avatar: char4,
                body: t('phone.messageBodylvl4', { playerName })
            }
            return
        }

        // Step 7: User enters 47 → continue to level 5
        if (code === messageCode && game.currentScenarioImage === 'eighth') {
            completeLevel4()
            setFeedback('success', '')
            game.enteredCodes.push(messageCode)
            playSound(levelSound)
            game.showCongratsModal = true
            return
        }

        // If the code does not match any step, show an error
        setFeedback('error', '')
    }

    async function completeLevel4() {
        if (game.levelStartTime) {
        try {
            const completionData = await completeLevel(4, game.levelStartTime)
            game.setLevelCompletionData(completionData)
        } catch (error) {
            console.error('Failed to save level completion:', error)
        }
        }
    }

    // Function to continue to level 5
    function continueToLevel5() {
        game.showCongratsModal = false
        game.resetAfterLevel()
        game.level = 5
        router.push('/level/5')
    }

    return { 
        handleCodeInput, 
        continueToLevel5,
        handleCharacterCall,
        hasPendingCall,
        getPendingCallType,
        getCharacterCallType,
        answerPendingCall
    }
}