<template>
  <div class="min-h-screen bg-[#1b1b1b] text-white p-4 sm:p-6 flex items-center justify-center">
    <!-- Inner content layout -->

    <!-- Tutorial Modal - Show as overlay when visible -->
    <div v-if="showTutorial" class="fixed inset-0 z-[9999] bg-black bg-opacity-50">
      <TutorialModal :visible="showTutorial" @close="showTutorial = false" />
    </div>

    <!-- Tutorial Button (Top Right) -->
    <div class="absolute top-4 right-4 z-40">
      <TutorialButton @click="showTutorial = true" />
    </div>

    <!-- Main Game Area -->
    <div class="flex flex-col lg:flex-row gap-6 items-center justify-center w-full max-w-7xl">
      
      <transition name="fade">
        <PhoneCall
          v-if="game.activeCall"
          :name="game.activeCall.name"
          :avatar="game.activeCall.avatar"
          :body="game.activeCall.body"
          :title-middle="game.activeCall.titleMiddle"
          @close="game.endCall()"
          class="absolute top-4 left-1/2 transform -translate-x-1/2 z-50"
        />
      </transition>

      <!-- Congratulations Modal -->
      <CongratsModal
        v-if="game.showCongratsModal"
        :visible="game.showCongratsModal"
        :level="4"
        :steps="congratsSteps"
        @continue="handleContinueToLevel5"
      />

      <!-- Sidebar: Timer + Phone -->
      <div class="flex flex-col gap-4 w-full max-w-sm lg:w-[300px]">
        <Timer ref="timerRef" />
        <Phone>
          <PhoneMessage
            v-if="game.activeMessage"
            :from="game.activeMessage.from"
            :name="game.activeMessage.name"
            :avatar="game.activeMessage.avatar"
            :body="game.activeMessage.body"
            @close="handleMessageClose"
          />

          <PhoneKeypad v-else />
        </Phone>
        
      </div>

      <!-- Main Scenario Area -->
      <div class="w-full">
        <ScenarioDisplay :imageSrc="scenarioImage">
          <template #clickable-areas>
            <LevelClickableAreasComponent />
          </template>
        </ScenarioDisplay>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, provide } from 'vue'
import { useI18n } from 'vue-i18n'
import { useGameInfo } from '@/store/gameInfo'
import Timer from '@/components/others/TimerComponent.vue'
import Phone from '@/components/phone/PhoneComponent.vue'
import PhoneMessage from '@/components/messageAndCall/PhoneMessageComponent.vue'
import PhoneKeypad from '@/components/phone/PhoneKeypadComponent.vue'
import ScenarioDisplay from '@/components/scenario/ScenarioScreenComponent.vue'
import PhoneCall from '@/components/messageAndCall/PhoneCallComponent.vue'
import CongratsModal from '@/components/others/CongratsModalComponent.vue'
import EnScenario from '@/assets/en/lvl4/scenario1.png'
import FrScenario from '@/assets/fr/lvl4/scenario1.png'
import EnScenario2 from '@/assets/en/lvl4/scenario1.2.png'
import FrScenario2 from '@/assets/fr/lvl4/scenario1.2.png'
import EnScenario3 from '@/assets/en/lvl4/scenario1.3.png'
import FrScenario3 from '@/assets/fr/lvl4/scenario1.3.png'
import EnScenario4 from '@/assets/en/lvl4/scenario1.4.png'
import FrScenario4 from '@/assets/fr/lvl4/scenario1.4.png'
import EnScenario5 from '@/assets/en/lvl4/scenario1.5.png'
import FrScenario5 from '@/assets/fr/lvl4/scenario1.5.png'
import EnScenario6 from '@/assets/en/lvl4/scenario1.6.png'
import FrScenario6 from '@/assets/fr/lvl4/scenario1.6.png'
import EnScenario7 from '@/assets/en/lvl4/scenario1.7.png'
import FrScenario7 from '@/assets/fr/lvl4/scenario1.7.png'
import EnScenario8 from '@/assets/en/lvl4/scenario1.8.png'
import FrScenario8 from '@/assets/fr/lvl4/scenario1.8.png'
import TutorialButton from '@/components/tutorial/TutorialButtonComponent.vue'
import TutorialModal from '@/components/tutorial/TutorialModalComponent.vue'
import { useGameLogicLvl4 } from '@/logic/level4/gameLogicLvl4.js'
import { useRoadmapStore } from '@/store/roadmap'
import { useSession } from '@/composables/useSession'
import LevelClickableAreasComponent from '@/components/riddle/LevelClickableAreasComponent.vue'

// Timer ref to provide to children
const timerRef = ref(null)

// Provide timer to child components
provide('timer', computed(() => timerRef.value))

const { locale, t } = useI18n()
const roadmap = useRoadmapStore()
const showTutorial = ref(false)

const game = useGameInfo()
const { restoreSession } = useSession()

onMounted(async () => {  
  // Always ensure roadmap is initialized (will load from localStorage if available)
  const hasAnyItems = roadmap.roadmapSteps.some(step => step.items.length > 0)
  game.level = 4
  game.initializePlayerName()
  
  // Restore session if exists
  await restoreSession()
  
  // Start level timer
  game.startLevelTimer(4)

  if (!hasAnyItems) {
    roadmap.initializeSteps()
  } 
})


// Initialize game logic
const setFeedback = (type, message) => game.setFeedback(type, message)
const { continueToLevel5 } = useGameLogicLvl4(setFeedback)

function handleMessageClose() {
  game.activeMessage = null
  if (!game.riddleSolved) {
    game.activeRiddle = true
  }
}

function handleContinueToLevel5() {
  continueToLevel5()
}

// Get congratulations steps from roadmap entries completed in level 1
const congratsSteps = computed(() => [
  {
    label: t('roadmap.step4'),
    items: [
      t('roadmap.step4_1'),
      t('roadmap.step4_2'),
      t('roadmap.step4_3'),
      t('roadmap.step4_4'),
    ]
  }
])

const images = {
  en: { default: EnScenario, second: EnScenario2, third: EnScenario3, fourth: EnScenario4, fifth: EnScenario5, sixth: EnScenario6, seventh: EnScenario7, eighth: EnScenario8 },
  fr: { default: FrScenario, second: FrScenario2, third: FrScenario3, fourth: FrScenario4, fifth: FrScenario5, sixth: FrScenario6, seventh: FrScenario7, eighth: FrScenario8 }
}

const scenarioImage = computed(() => {
  const lang = locale.value
  const state = game.currentScenarioImage || 'default'
  return images[lang]?.[state] || images[lang].default
})

</script>