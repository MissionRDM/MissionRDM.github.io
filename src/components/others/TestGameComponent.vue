<!-- TestGameComponent.vue: A Vue component that provides a button to start a test game. It uses Vue Router to navigate to the '/level/quiz' route when the button is clicked. The component includes a styled card with an icon, title, description, and a button. -->
<template>
  <!-- Test Game Card Component -->
  <div class="bg-[#1a1a1a] rounded-lg border border-gray-800 p-6 hover:border-amber-500/20 transition-colors">
    <div class="flex items-center justify-between">
      <div class="flex items-center">
        <div class="w-8 h-8 bg-amber-500/15 rounded-md flex items-center justify-center mr-4">
          <!-- Icon for the test game -->
          <svg class="w-4 h-4 text-amber-400/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M16 10h.01M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z"></path>
          </svg>
        </div>
        
        <!-- Title and description for the test game -->
        <div>
          <div class="flex items-center gap-3 mb-1">
            <h2 class="text-lg font-semibold text-amber-400/80 uppercase tracking-wide">{{ $t('endScreen.testGameTitle') }}</h2>
            <span class="bg-gray-800 text-gray-400 text-xs px-2 py-1 rounded uppercase">{{ $t('endScreen.optional') }}</span>
          </div>
          <p class="text-gray-500 text-sm">{{ $t('endScreen.testGameDescription') }}</p>
        </div>
      </div>
      <!-- Button to start the test game -->
      <button 
        @click="openTestGame"
        class="bg-amber-500/80 hover:bg-amber-500 text-white font-medium py-2 px-4 rounded-md uppercase tracking-wide transition-colors"
      >
        Start
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

// Function to navigate to the test game page
// This function uses Vue Router to push the user to the '/level/quiz' route
const openTestGame = () => {
    router.push('/level/quiz')
}
</script>