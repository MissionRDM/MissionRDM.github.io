<!-- CongratsModalComponent.vue: A Vue component for displaying a congratulatory modal with level completion details, achievements, and roadmap steps. -->
<template>
  <div v-if="visible" class="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center animate-fadeIn">
    <div class="bg-gradient-to-br from-[#1b1b1b] via-[#2a2a2a] to-[#1b1b1b] text-white rounded-2xl p-6 w-[95vw] sm:w-[85vw] md:w-[70vw] lg:w-[55vw] xl:w-[45vw] max-h-[95vh] sm:max-h-[85vh] overflow-y-auto relative border border-amber-400/30 shadow-2xl animate-slideUp">

      <!-- Celebration particles effect -->
      <div class="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
        <div class="absolute top-0 left-1/4 w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style="animation-delay: 0.1s;"></div>
        <div class="absolute top-10 right-1/4 w-1 h-1 bg-amber-300 rounded-full animate-bounce" style="animation-delay: 0.3s;"></div>
        <div class="absolute top-5 left-3/4 w-1.5 h-1.5 bg-yellow-500 rounded-full animate-bounce" style="animation-delay: 0.5s;"></div>
      </div>

      <!-- Main title with celebration -->
      <div class="text-center mb-6">
        <div class="text-4xl mb-2 animate-bounce">🎉</div>
        <h2 class="text-3xl font-bold bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400 bg-clip-text text-transparent mb-2 animate-pulse">
          {{ t('congrats.title') }}
        </h2>
        <div class="text-amber-300/80 text-base">
          {{ t('congrats.subtitle', { level: level }) }}
        </div>
      </div>

      <!-- Medal section with enhanced design -->
      <div class="flex justify-center mb-6">
        <div class="relative">
          <!-- Medal glow effect -->
          <div class="absolute inset-0 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full blur-xl opacity-60 animate-pulse scale-110"></div>
          
          <!-- Main medal -->
          <div class="relative w-24 h-24 bg-gradient-to-br from-yellow-400 via-amber-500 to-yellow-600 rounded-full flex items-center justify-center shadow-2xl text-4xl font-bold border-4 border-white transform hover:scale-105 transition-transform duration-300">
            <div class="absolute inset-2 bg-gradient-to-br from-yellow-300 to-amber-400 rounded-full flex items-center justify-center">
              <span class="text-white drop-shadow-lg">{{ level }}</span>
            </div>
            
            <!-- Medal highlights -->
            <div class="absolute top-3 left-8 w-4 h-4 bg-white/30 rounded-full blur-sm"></div>
            <div class="absolute top-6 right-6 w-2 h-2 bg-white/50 rounded-full"></div>
          </div>
        </div>
      </div>

      <!-- Achievement section -->
      <div class="bg-gradient-to-r from-green-900/30 to-emerald-900/30 rounded-xl p-4 mb-6 border border-green-500/30">
        <div class="flex items-center justify-center mb-2">
          <h3 class="text-xl font-bold text-green-400">{{ t('congrats.achievement') }}</h3>
        </div>
        <p class="text-center text-green-200/80 text-sm">
          {{ t('congrats.message') }}
        </p>
      </div>

      <!-- Time Performance Message -->
      <div v-if="completionData" class="bg-gradient-to-r from-blue-900/30 to-cyan-900/30 rounded-xl p-4 mb-6 border border-blue-500/30">
        <div class="text-center">
          <p class="text-blue-200 text-sm leading-relaxed">
            {{ getPerformanceMessage() }}
          </p>
        </div>
      </div>
      
      <!-- Roadmap Steps with hierarchy -->
      <div class="space-y-4 mb-6">
        <div
          v-for="(step, index) in steps"
          :key="index"
          class="bg-gradient-to-r from-[#2a2a2a] to-[#333333] rounded-xl p-4 border border-gray-600/50 shadow-lg hover:shadow-xl transition-shadow duration-300"
        >
          <div class="flex items-start">
            <div class="flex-1">
              <h4 class="text-base font-semibold text-amber-300 mb-2 flex items-center">
                {{ step.label }}
              </h4>
              <ul class="space-y-1">
                <li 
                  v-for="(item, i) in step.items" 
                  :key="i"
                  class="text-xs text-gray-300 flex items-start"
                  :class="getItemIndentation(item)"
                >
                  <span class="text-green-400 mr-2 mt-0.5 text-xs">●</span>
                  <span>{{ item }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Continue Button with styling -->
      <button
        @click="$emit('continue')"
        class="w-full py-3 bg-gradient-to-r from-green-600 via-green-500 to-green-600 hover:from-green-500 hover:via-green-400 hover:to-green-500 rounded-xl text-white text-lg font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border border-green-400/30"
      >
        <span class="flex items-center justify-center">
          {{ t('congrats.continue') }}
        </span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { useGameInfo } from '@/store/gameInfo'
import { computed } from 'vue'

const { t } = useI18n()
const game = useGameInfo()

const props = defineProps({
  visible: Boolean,
  level: Number,
  steps: Array
})

defineEmits(['continue'])

const completionData = computed(() => game.levelCompletionData)

// Function to format time in a user-friendly way (e.g., "2 minutes and 30 seconds") 
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  if (mins === 0) {
    return `${secs} second${secs !== 1 ? 's' : ''}`
  } else if (secs === 0) {
    return `${mins} minute${mins !== 1 ? 's' : ''}`
  } else {
    return `${mins} minute${mins !== 1 ? 's' : ''} and ${secs} second${secs !== 1 ? 's' : ''}`
  }
}

// Generate a complete performance message with time, average, and level information
// This function checks if the completion data is available and formats the message accordingly
function getPerformanceMessage() {
  if (!completionData.value) return ''
  
  const { timeInSeconds, avgInSeconds, isAboveAverage, level: currentLevel } = completionData.value
  const levelNum = currentLevel || props.level
  
  const timeFormatted = formatTime(timeInSeconds)
  let message = t('congrats.timeMessage', { time: timeFormatted, level: levelNum })
  
  if (avgInSeconds) {
    const avgFormatted = formatTime(avgInSeconds)
    message += t('congrats.averageMessage', { avgTime: avgFormatted })
    
    if (isAboveAverage) {
      message += t('congrats.fastMessage')
    } else {
      message += t('congrats.thoroughMessage')
    }
  } else {
    message += t('congrats.noDataMessage')
  }
  
  return message
}

// Function to add proper indentation for sub-items (A, B, C, etc.)
function getItemIndentation(item) {
  // Check if the item starts with a letter followed by a dot (like "A. ", "B. ")
  const hasSubLetter = /^[A-Z]\.\s/.test(item)
  return hasSubLetter ? 'ml-6' : 'ml-0'
}
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { 
    opacity: 0;
    transform: translateY(50px) scale(0.95);
  }
  to { 
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}

.animate-slideUp {
  animation: slideUp 0.4s ease-out;
}

.clip-ribbon {
  clip-path: polygon(0% 0%, 100% 0%, 90% 100%, 10% 100%);
}

.clip-ribbon-small {
  clip-path: polygon(0% 0%, 100% 0%, 85% 100%, 15% 100%);
}
</style>