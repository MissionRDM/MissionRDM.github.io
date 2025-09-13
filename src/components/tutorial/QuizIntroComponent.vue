<!-- QuizIntroComponent.vue: A Vue component that displays an introduction screen for an emergency game. It includes a title, description, and buttons to return to the end screen or start the challenge. -->
<template>
  <div v-if="visible" class="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
    <div class="bg-[#1a1a1a] rounded-xl border border-red-600/50 max-w-6xl w-full max-h-[90vh] flex flex-col">
      <!-- Fixed header -->
      <div class="text-center p-8 pb-6 flex-shrink-0">
        <div class="text-4xl mb-4">🚨</div>
        <h1 class="text-2xl font-bold text-red-400 mb-4 uppercase tracking-wide">
          {{ $t('emergencyGame.title') }}
        </h1>
      </div>
      
      <!-- Scrollable content -->
      <div class="flex-1 overflow-y-auto px-8">
        <div class="space-y-4 text-gray-300 leading-relaxed mb-8">
          <!-- Email content -->
          <div class="bg-gray-900/30 rounded-lg p-6 mb-6">
            <p class="text-gray-300 font-medium whitespace-pre-line italic">
              {{ $t('emergencyGame.introduction.message') }}
            </p>
          </div>
          <p>{{ $t('emergencyGame.introduction.context') }}</p>
          <p>{{ $t('emergencyGame.introduction.urgency') }}</p>
          <p>{{ $t('emergencyGame.introduction.security') }}</p>
        </div>
      </div>
      
      <!-- Fixed footer with buttons -->
      <div class="p-8 pt-6 flex-shrink-0">
        <div class="flex gap-4">
          <button 
            @click="$emit('returnEndScreen')" 
            class="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-200 font-bold py-3 px-6 rounded-lg uppercase tracking-wide transition-colors"
          >
            {{ $t('emergencyGame.introduction.return') }}
          </button>
          <button 
            @click="$emit('startChallenge')" 
            class="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg uppercase tracking-wide transition-colors"
          >
            {{ $t('emergencyGame.introduction.handleMyself') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

defineProps({
  visible: {
    type: Boolean,
    required: true
  }
})

defineEmits(['returnEndScreen', 'startChallenge'])
</script>