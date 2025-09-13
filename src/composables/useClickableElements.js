import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useGameInfo } from '@/store/gameInfo'
import { useRoadmapStore } from '@/store/roadmap'
import { useLevelCompletion } from '@/utils/useLevelCompletion'
import { playSound } from '@/utils/playSound'

// Import all assets
import levelSound from '@/assets/audio/level.mp3'
import messageSound from '@/assets/audio/message.mp3'
import stepFoundSound from '@/assets/audio/stepFound.mp3'
import char2 from '@/assets/characters/char2.png'
import hintImageEN3 from '@/assets/en/postits/hint3.png'
import hintImageFR3 from '@/assets/fr/postits/hint3.png'
import hintImageEN8 from '@/assets/en/postits/hint8.png'
import hintImageFR8 from '@/assets/fr/postits/hint8.png'
import hintImageEN13 from '@/assets/en/postits/hint13.png'
import hintImageFR13 from '@/assets/fr/postits/hint13.png'
import hintImageEN15 from '@/assets/en/postits/hint15.png'
import hintImageFR15 from '@/assets/fr/postits/hint15.png'

// Function to handle all clickable elements in the game
// This composable manages the logic for clickable elements across different levels of the game
export function useClickableElements() {
  const game = useGameInfo()
  const roadmap = useRoadmapStore()
  const { t, locale } = useI18n()
  const { completeLevel } = useLevelCompletion()

  // === LEVEL 1 LOGIC ===
  //click on the first folder
  const canShowElement1 = computed(() => {
    return game.level === 1 && game.currentScenarioImage === 'updated'
  })

  //click on the second folder
  const canShowElement2 = computed(() => {
    return game.level === 1 && game.currentScenarioImage === 'third'
  })

  //click on the third folder to show the congratulations modal
  const canShowElement3 = computed(() => {
    return game.level === 1 && game.currentScenarioImage === 'congrats'
  })

  // Handle click on first folder
  // This function checks if the first folder can be clicked and updates the game state accordingly
  function handleElement1Click() {
    if (!canShowElement1.value) return
    
    game.removeOverlay(game.overlayId)
    game.removeOverlay(game.overlayId2)
    game.currentScenarioImage = 'third'
    game.riddleSolved = false
  }

  // Handle click on second folder
  // This function checks if the second folder can be clicked and updates the game state accordingly
  function handleElement2Click() {
    if (!canShowElement2.value) return
    
    game.currentScenarioImage = "final"
    game.setCharCallable('Santiago', true, 'outgoing')
  }

  // Handle click on third folder
  // This function checks if the third folder can be clicked and shows the congratulations modal
  function handleElement3Click() {
    if (!canShowElement3.value) return
    
    playSound(levelSound)
    game.showCongratsModal = true
    completeLevel1()
  }

  // Function to complete level 1 and save completion data
  // This function is called when the player completes level 1
  async function completeLevel1() {
    if (game.levelStartTime) {
      try {
        const completionData = await completeLevel(1, game.levelStartTime)
        game.setLevelCompletionData(completionData)
      } catch (error) {
        console.error('Failed to save level completion:', error)
      }
    }
  }

  // === LEVEL 2 LOGIC ===
  // Click on post-it note behind the plant to show hint
  const canShowLvl2 = computed(() => {
    return game.level === 2 && game.currentScenarioImage === 'main'
  })

  // Handle click on the post-it note
  // This function checks if the post-it note can be clicked and shows the hint image
  function handleElementLvl2Click() {
    if (!canShowLvl2.value) return
    game.firstHintFound = true
    const image = locale.value === 'en' ? hintImageEN3 : hintImageFR3
    game.showOverlay({ type: 'image', src: image })
  }

  // === LEVEL 3 LOGIC ===
  // Click on the 19 in the calendar
  const canShowLvl3Click1 = computed(() => {
    return game.level === 3 && game.currentScenarioImage === 'second'
  })

  // Click on the post-it note on the wall
  const canShowLvl3Click3 = computed(() => {
    return game.level === 3 && game.currentScenarioImage === 'final'
  })

  // Handle click on the 19 in the calendar
  // This function checks if the calendar can be clicked and updates the game state accordingly
  function handleElementLvl3Click1() {
    if (!canShowLvl3Click1.value) return
    
    game.clickedElement = true
    game.currentScenarioImage = 'third'
    
    // Schedule message from Inès
    setTimeout(() => {
      playSound(messageSound)
      const playerName = game.playerName || ''
      game.activeMessage = {
        from: 'S15',
        name: 'Inès',
        image: 'ines',
        avatar: char2,
        body: t('phone.messageBodylvl2', { playerName })
      }
      game.patience = true
      game.currentScenarioImage = 'fourth'
      roadmap.addEntry('step3', 'step3_2')
      game.setCharCallable('Inès', true, 'incoming')
    }, 12000)
  }

  // Handle click on the post-it note on the wall
  // This function checks if the post-it note can be clicked and shows the hint image
  function handleElementLvl3Click3() {
    if (!canShowLvl3Click3.value) return
    
    game.showOverlay({ 
      type: 'image', 
      src: locale.value === 'en' ? hintImageEN8 : hintImageFR8 
    })
    game.secondHintFound = true
  }

  // === LEVEL 4 LOGIC ===
  // Click on the folder on the screen
  const canShowLvl4Click1 = computed(() => {
    return game.level === 4 && game.currentScenarioImage === 'default'
  })

  // Click on the mail received from Santiago
  const canShowLvl4Click2 = computed(() => {
    return game.level === 4 && game.currentScenarioImage === 'seventh'
  })

  // Handle click on the folder on the screen
  // This function checks if the folder can be clicked and updates the game state accordingly
  function handleElementLvl4Click1() {
    if (!canShowLvl4Click1.value) return
    
    playSound(stepFoundSound)
    roadmap.addEntry('step4', 'step4_1')
    game.currentScenarioImage = 'second'
    
    // Schedule character callable
    setTimeout(() => {
      game.setCharCallable('Inès', true, 'outgoing')
      game.callSequence['Inès'] = 0  
      game.calledCharacters['Inès'] = false
    }, 5000)
  }

  // Handle click on the mail received from Santiago
  // This function checks if the mail can be clicked and shows the hint image
  function handleElementLvl4Click2() {
    if (!canShowLvl4Click2.value) return
    
    game.setCharCallable('Santiago', true, 'outgoing')
    game.calledCharacters['Santiago'] = false
    game.showOverlay({
      type: 'image', 
      src: locale.value === 'en' ? hintImageEN13 : hintImageFR13
    })
    game.secondHintFound = true
  }

  // === LEVEL 5 LOGIC ===
  // Click on the tablet 
  const canShowLvl5Click1 = computed(() => {
    return game.level === 5 && game.currentScenarioImage === 'ninth'
  })

  // Click on the email received from Jack
  const canShowLvl5Click2 = computed(() => {
    return game.level === 5 && game.currentScenarioImage === 'fifth'
  })

  // Handle click on the tablet
  // This function checks if the tablet can be clicked and shows the hint image
  function handleElementLvl5Click1() {
    if (!canShowLvl5Click1.value) return
    completeLevel5()
    playSound(levelSound)
    game.showCongratsModal = true
  }

  // Handle click on the email received from Jack
  // This function checks if the email can be clicked and updates the game state accordingly
  function handleElementLvl5Click2() {
    if (!canShowLvl5Click2.value) return
    
    game.secondHintFound = true
    const image = locale.value === 'fr' ? hintImageFR15 : hintImageEN15
    game.showOverlay({ type: 'image', src: image })
  }

  // Function to complete level 5 and save completion data
  // This function is called when the player completes level 5
  async function completeLevel5() {
        if (game.levelStartTime) {
            try {
                const completionData = await completeLevel(5, game.levelStartTime)
                game.setLevelCompletionData(completionData)
            } catch (error) {
                console.error('Failed to save level completion:', error)
            }
        }
    }

  // === LEVEL 6 LOGIC ===
  // Click on the screen on See more details
  const canClickForDetails = computed(() => {
    return game.currentScenarioImage === 'third' && game.level === 6
  })

  // Handle click on the screen to see more details
  // This function checks if the screen can be clicked and updates the game state accordingly
  function handleImageClick() {
    if (!canClickForDetails.value) return
    
    game.currentScenarioImage = 'fourth'
  }

  // Level 2 is a special case where the position of the clickable element changes based on the language
  const element2PositionClass = computed(() => {
    if (locale.value === 'fr') {
      return 'absolute top-[32%] left-[29%] transform -translate-x-1/2'
    } else {
      return 'absolute top-[68%] left-[26%] transform -translate-x-1/2'
    }
  })

  return {
    // Level 1
    canShowElement1,
    canShowElement2,
    canShowElement3,
    handleElement1Click,
    handleElement2Click,
    handleElement3Click,
    
    // Level 2
    canShowLvl2,
    handleElementLvl2Click,
    
    // Level 3
    canShowLvl3Click1,
    canShowLvl3Click3,
    handleElementLvl3Click1,
    handleElementLvl3Click3,
    
    // Level 4
    canShowLvl4Click1,
    canShowLvl4Click2,
    handleElementLvl4Click1,
    handleElementLvl4Click2,
    
    // Level 5
    canShowLvl5Click1,
    canShowLvl5Click2,
    handleElementLvl5Click1,
    handleElementLvl5Click2,
    
    // Level 6
    canClickForDetails,
    handleImageClick,
    
    // Styles
    element2PositionClass
  }
}