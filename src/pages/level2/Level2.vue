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

    <div class="flex flex-col lg:flex-row gap-6 items-center justify-center w-full max-w-7xl">
      
      <transition name="fade">
        <PhoneCall
          v-if="game.activeCall"
          :name="game.activeCall.name"
          :avatar="game.activeCall.avatar"
          :body="game.activeCall.body"
          @close="game.endCall()"
          class="absolute top-4 left-1/2 transform -translate-x-1/2 z-50"
        />
      </transition>

      <!-- Congratulations Modal -->
      <CongratsModal
        v-if="game.showCongratsModal"
        :visible="game.showCongratsModal"
        :level="2"
        :steps="congratsSteps"
        @continue="handleContinueToLevel3"
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
import { useGameLogicLvl2 } from '@/logic/level2/gameLogicLvl2.js'
import Timer from '@/components/others/TimerComponent.vue'
import Phone from '@/components/phone/PhoneComponent.vue'
import PhoneMessage from '@/components/messageAndCall/PhoneMessageComponent.vue'
import PhoneKeypad from '@/components/phone/PhoneKeypadComponent.vue'
import ScenarioDisplay from '@/components/scenario/ScenarioScreenComponent.vue'
import PhoneCall from '@/components/messageAndCall/PhoneCallComponent.vue'
import CongratsModal from '@/components/others/CongratsModalComponent.vue'
import LevelClickableAreasComponent from '@/components/riddle/LevelClickableAreasComponent.vue'
import EnScenario from '@/assets/en/lvl2/scenario1.png'
import EnScenario2 from '@/assets/en/lvl2/scenario1.2.png'
import FrScenario from '@/assets/fr/lvl2/scenario1.png'
import FrScenario2 from '@/assets/fr/lvl2/scenario1.2.png'
import FrScenario3 from '@/assets/fr/lvl2/scenario1.3.png'
import EnScenario3 from '@/assets/en/lvl2/scenario1.3.png'
import EnScenario4 from '@/assets/en/lvl2/scenario1.4.png'
import FrScenario4 from '@/assets/fr/lvl2/scenario1.4.png'
import EnScenario5 from '@/assets/en/lvl2/scenario1.5.png'
import FrScenario5 from '@/assets/fr/lvl2/scenario1.5.png'
import EnScenarioFinal from '@/assets/en/lvl2/scenario1.6.png'
import FrScenarioFinal from '@/assets/fr/lvl2/scenario1.6.png'
import EnMainScenario from '@/assets/en/lvl2/scenario1.7.png'
import FrMainScenario from '@/assets/fr/lvl2/scenario1.7.png'
import { useRoadmapStore } from '@/store/roadmap'
import TutorialButton from '@/components/tutorial/TutorialButtonComponent.vue'
import TutorialModal from '@/components/tutorial/TutorialModalComponent.vue'
import { useSession } from '@/composables/useSession'

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
  game.level = 2
  game.initializePlayerName()
  
  // Restore session if exists
  await restoreSession()
  
  // Start level timer
  game.startLevelTimer(2)

  if (!hasAnyItems) {
    roadmap.initializeSteps()
  } 
})

// Initialize game logic
const setFeedback = (type, message) => game.setFeedback(type, message)
const { continueToLevel3 } = useGameLogicLvl2(setFeedback)

function handleMessageClose() {
  game.activeMessage = null
  if (!game.riddleSolved) {
    game.activeRiddle = true
  }
}

function handleContinueToLevel3() {
  continueToLevel3()
}

// Get congratulations steps from roadmap entries completed in level 2
const congratsSteps = computed(() => [
  {
    label: t('roadmap.step2'),
    items: [
      t('roadmap.step2_1'),
      t('roadmap.step2_2'),
      t('roadmap.step2_3')
    ]
  }
])

const images = {
  en: { default: EnScenario, second: EnScenario2, third: EnScenario3, fourth: EnScenario4, fifth: EnScenario5, final: EnScenarioFinal, main: EnMainScenario },
  fr: { default: FrScenario, second: FrScenario2, third: FrScenario3, fourth: FrScenario4, fifth: FrScenario5, final: FrScenarioFinal, main: FrMainScenario }
}

const scenarioImage = computed(() => {
  const lang = locale.value
  const state = game.currentScenarioImage || 'default'
  return images[lang]?.[state] || images[lang].default
})
</script>