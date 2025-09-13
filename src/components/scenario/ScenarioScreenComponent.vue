<!-- ScenarioScreenComponent.vue: A Vue component that displays the scenario screen with a roadmap button, scenario image, and overlay notes. -->
<template>
  <div class="relative w-full max-w-[90vw] sm:max-w-[80vw] lg:max-w-[70vw] xl:max-w-[60vw] mx-auto 
           bg-[#1f1f1f] rounded-lg overflow-hidden shadow-lg 
           flex items-center justify-center">
    <!-- Roadmap Button -->
    <RoadmapButton @click="handleRoadmapClick" />

    <!-- ROADMAP HINT - Only shown in level 1 -->
    <div 
      v-if="game.level === 1 && showRoadmapHint" 
      class="absolute top-4 right-20 z-30 flex items-center animate-bounce"
    >
      <span class="text-amber-400 text-sm font-bold mr-2 whitespace-nowrap bg-gray-800 px-3 py-2 rounded-lg border border-amber-400 shadow-lg">
        {{ $t('hints.checkRoadmap') }}
      </span>
      <!-- Fallback arrow if SVG fails -->
      <span class="text-amber-400 text-xl">→</span>
    </div>

    <!-- Roadmap Modal -->
    <RoadmapModal :visible="showRoadmap" :steps="roadmap.roadmapSteps" @close="showRoadmap = false" />

    <!-- Overlay Notes -->
    <div
      v-for="note in game.overlayNotes"
      :key="note.id"
      class="absolute top-8 left-4 right-4 z-50 pointer-events-auto flex justify-center"
    >
      <!-- TEXT Overlay -->
      <div
        v-if="note.type === 'text'"
        class="relative bg-yellow-200 text-black px-3 py-3 sm:px-4 sm:py-3 rounded shadow font-semibold 
               text-sm sm:text-base lg:text-lg w-full max-w-[85%]"
      >
        <button
          class="absolute top-2 right-2 text-black hover:text-red-600 text-lg font-bold leading-none"
          @click="game.removeOverlay(note.id)"
        >
          &times;
        </button>
        <div class="pr-6 break-words">{{ note.text }}</div>
      </div>

      <!-- IMAGE Overlay -->
      <div v-else-if="note.type === 'image'" class="relative w-full max-w-[85%]">
        <button
          class="absolute top-2 right-2 text-white bg-black bg-opacity-70 hover:bg-opacity-90 p-1 rounded-full z-10 text-lg font-bold leading-none"
          @click="game.removeOverlay(note.id)"
        >
          &times;
        </button>
        <img
          :src="note.src"
          :alt="note.alt || 'Hint'"
          class="w-full h-auto max-h-[70vh] object-contain rounded-lg shadow-2xl border-2 sm:border-4 border-amber-400"
        />
      </div>
    </div>

    <!-- Main Scenario Image -->
    <img
      :src="imageSrc"
      alt="Scenario"
      class="max-h-[80vh] w-auto object-contain"
    />
    
    <slot name="clickable-areas"></slot>
    <slot></slot>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import RoadmapButton from '@/components/roadmap/RoadmapButtonComponent.vue'
import RoadmapModal from '@/components/roadmap/RoadmapModalComponent.vue'
import { useRoadmapStore } from '@/store/roadmap'
import { useGameInfo } from '@/store/gameInfo'
import { useI18n } from 'vue-i18n'

const game = useGameInfo()
const roadmap = useRoadmapStore()
const showRoadmap = ref(false)
const { t } = useI18n()

// ROADMAP HINT - Only for level 1
const showRoadmapHint = ref(false)

defineProps({
  imageSrc: String
})

// Handle roadmap click
const handleRoadmapClick = () => {
  showRoadmap.value = true
  // Hide hint when roadmap is clicked
  if (game.level === 1) {
    showRoadmapHint.value = false
  }
}

onMounted(() => {
  roadmap.initializeSteps()
  
  // ROADMAP HINT - Only show in level 1
  if (game.level === 1) {
    setTimeout(() => {
      showRoadmapHint.value = true
      
      // Auto-hide hint after 8 seconds
      setTimeout(() => {
        showRoadmapHint.value = false
      }, 8000)
    }, 500)
  }
})
</script>