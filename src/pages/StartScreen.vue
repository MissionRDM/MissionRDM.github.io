<template>
  <div class="min-h-screen bg-[#121212] text-gray-200 font-mono flex flex-col">
    <!-- Tutorial Modal - Show as overlay when visible -->
    <div v-if="showTutorial" class="fixed inset-0 z-[9999]">
      <TutorialModal :visible="showTutorial" :asModal="true" @close="showTutorial = false" />
    </div>

    <!-- Main Content Area -->
    <div class="flex-1 flex items-center justify-center px-4">
      <LanguageToggle />

      <!-- Escape Game Panel -->
      <div class="w-full max-w-lg bg-[#202020] rounded-xl border border-gray-700 shadow-[0_0_30px_rgba(255,191,0,0.2)] p-10">
        <h1 class="text-4xl font-bold text-center text-amber-400 mb-10 tracking-widest uppercase leading-snug">
          {{ $t('startScreen.title') }}
        </h1>
        <p class="text-gray-400 mb-6 text-center">
          {{ $t('startScreen.subtitle') }}
        </p>
        <label for="playerName" class="block text-base font-semibold mb-3 text-gray-400 tracking-wide">
          {{ $t('startScreen.enterName') }}
        </label>
        <input
          id="playerName"
          v-model="playerName"
          type="text"
          class="w-full border border-gray-700 bg-[#1a1a1a] text-white rounded-md px-4 py-3 mb-6 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-inner placeholder-gray-500"
          :placeholder="$t('startScreen.namePlaceholder')"
        />

        <!-- Player name validation message -->
        <p v-if="playerName.trim() && !validatePlayerName(playerName)" class="text-red-500 text-sm mt-2 text-center">
          {{ $t('startScreen.nameError') }}
        </p>

        <div class="flex flex-col space-y-4">
          <button
            class="bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 rounded-md shadow-md uppercase tracking-wide transition-all duration-150"
            @click="startGame"
            :disabled="!playerName.trim() || !validatePlayerName(playerName)"
          >
            {{ $t('startScreen.startGame') }}
          </button>
          <button
            class="bg-gray-700 hover:bg-gray-600 text-gray-200 font-semibold py-3 rounded-md shadow-inner uppercase transition-all duration-150"
            @click="showTutorial = true"
          >
            {{ $t('startScreen.tutorial') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="border-t border-gray-800 py-6 px-4">
      <div class="text-gray-500 text-sm leading-relaxed text-center space-y-4">
        <p class="text-gray-500 text-sm mt-2 text-center [&_a]:text-yellow-400 [&_a:hover]:text-yellow-300" v-html="t('endScreen.EndMsg')"></p>
        <p class="text-gray-500 text-sm">
          Contact: <a href="mailto:openscience.bibliosante@hevs.ch" class="text-amber-400 hover:text-amber-300 underline transition-colors duration-200">openscience.bibliosante@hevs.ch</a>
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useStartScreen } from '@/composables/useStartScreen'
import LanguageToggle from '@/components/others/LanguageToggleComponent.vue'
import TutorialModal from '@/components/tutorial/TutorialModalComponent.vue'
import { useI18n } from 'vue-i18n'
import { useRoadmapStore } from '@/store/roadmap'

const { playerName, startGame } = useStartScreen()
const { t } = useI18n()
const showTutorial = ref(false)

// Player name can only contain letters and numbers, and must not be empty
const validatePlayerName = (name) => {
  if (!name || name.trim().length === 0) {
    return false
  }
  return /^[a-zA-Z0-9]+$/.test(name.trim())
}

onMounted(() => {
  const roadmapStore = useRoadmapStore()
  roadmapStore.resetRoadmap()
})
</script>