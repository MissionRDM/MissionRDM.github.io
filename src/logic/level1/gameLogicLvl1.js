import { useGameInfo } from '@/store/gameInfo'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useLevelCompletion } from '@/utils/useLevelCompletion'
import hintImageEN from '@/assets/en/postits/hint1.png'
import hintImageFR from '@/assets/fr/postits/hint1.png'
import hintImageEN2 from '@/assets/en/postits/hint2.png'
import hintImageFR2 from '@/assets/fr/postits/hint2.png'
import char1 from '@/assets/characters/char1.png'
import { useRoadmapStore } from '@/store/roadmap'
import { playSound } from '@/utils/playSound'
import stepFoundSound from '@/assets/audio/stepFound.mp3'
import messageSound from '@/assets/audio/message.mp3'
import callSound from '@/assets/audio/call.mp3'

export function useGameLogicLvl1(setFeedback) {
  const game = useGameInfo()
  const { t, locale } = useI18n()
  const router = useRouter()
  const roadmap = useRoadmapStore()
  const { completeLevel } = useLevelCompletion()

  // Handle character calls for level 1
  function handleCharacterCall(character) {
    if (!game.isCharCallable(character.name)) {
      game.startCall(character.name, character.avatar, t('phone.callUnavailable'))
      return
    }

    playSound(callSound)
    const playerName = game.playerName || ''
    
    // Mark character as called
    game.markCharacterAsCalled(character.name)
    
    // Level 1 specific call handling
    if (game.level === 1) {
      game.startCall(character.name, character.avatar, t('phone.call1', { playerName }))
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
    const hintCode = '8'
    const countCode = '4'
    const hintCode2 = '29'
    const finishLvl1Code = '28'

    // check if the code is already entered
    if (game.enteredCodes.includes(code)) {
      setFeedback('error', '')
      return
    }

    // Step 1: User enters 8 → hint
    if (code === hintCode && !game.enteredCodes.includes(countCode)) {
      const image = locale.value === 'fr' ? hintImageFR : hintImageEN
      setFeedback('success', '')
      game.firstHintFound = true
      game.showOverlay({type: 'image', src: image,})
      return
    }

    // Step 2: User enters 4 → confirm post-it count, save 8 and 4
    if (code === countCode && game.firstHintFound) {
      game.enteredCodes.push('4')
      game.enteredCodes.push('8')
      setFeedback('success', '')
      playSound(stepFoundSound)
      const image2 = locale.value === 'fr' ? hintImageFR2 : hintImageEN2
      game.showOverlay({type: 'image', src: image2,})
      roadmap.addEntry('step1', 'step1_3')
      checkUpdateScenarioImage()
      return
    }

    // Step 3: User enters 29 → Riddle for 1.1
    if (code === hintCode2) {
      game.removeOverlay(game.overlayId)
      game.removeOverlay(game.overlayId2)
      if (game.riddleSolved) {
        setFeedback('error', '')
        if (!game.enteredCodes.includes(hintCode2)) {
          checkUpdateScenarioImage()
        }
        return
      }
      game.secondHintFound = true
      playSound(messageSound)
      const playerName = game.playerName || ''
      game.activeMessage = {
        from: 'S15',
        name: 'Santiago',
        image: 'santiago',
        avatar: char1,
        body: t('phone.messageBodylvl1', { playerName })
      }
      return
    }

    // Step 6: User enters 28 → show congratulations modal
    if (game.currentScenarioImage === 'final' && code === finishLvl1Code) {
      game.enteredCodes.push(finishLvl1Code)
      playSound(stepFoundSound)
      game.currentScenarioImage = 'congrats'
      setFeedback('success', '')
      game.setCharCallable('Santiago', false, 'outgoing')
      roadmap.addEntry('step1', 'step1_2')
      return
    }

    // if user enter 77 / 82 or 25 instead of 26, show error
    if (game.currentScenarioImage === 'final' && (code === '77' || code === '82' || code === '25')) {
      game.showErrorOverlay(
        t(`riddle2.title`),
        t(`riddle2.incorrect${code}`),
      )
      return
    }

    // Invalid entry
    setFeedback('error', '')
  }

  // Function to handle continuing to level 2 from the modal
  function continueToLevel2() {
    game.showCongratsModal = false
    game.resetAfterLevel()
    game.level = 2
    router.push('/level/2')
  }

  return { 
    handleCodeInput, 
    continueToLevel2,
    handleCharacterCall,
    hasPendingCall,
    getPendingCallType,
    getCharacterCallType,
    answerPendingCall
  }
}

export function checkUpdateScenarioImage() {
  // Check if both codes 4 and 29 have been discovered and update scenario image
  const game = useGameInfo()
  if (game.enteredCodes.includes('8') && game.enteredCodes.includes('4') && game.riddleSolved) {
    game.currentScenarioImage = 'updated'
    game.activeMessage = null
    game.activeRiddle = null
  }
}