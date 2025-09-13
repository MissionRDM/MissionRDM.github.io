<!-- QuizModalComponent.vue: A modal component for displaying quiz questions and options. -->
<template>
  <div v-if="visible" class="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
    <div class="bg-[#1a1a1a] rounded-xl border border-gray-700 max-w-4xl w-full h-[85vh] flex flex-col">
      
      <!-- Fixed Header -->
      <div class="text-center p-6 pb-4 border-b border-gray-700/50">
        <div class="text-4xl mb-3">{{ emoji }}</div>
        <h3 class="text-xl font-bold text-amber-400 uppercase tracking-wide">
          {{ $t(quiz.title) }}
        </h3>
        <div v-if="isCompleted" class="mt-2 text-green-400 text-base">
          {{ $t('emergencyGame.modal.completed') }}
        </div>
      </div>
      
      <!-- Scrollable Content Area -->
      <div class="flex-1 overflow-y-auto p-6">
        <div class="mb-6">
          <p class="text-gray-300 leading-relaxed text-base whitespace-pre-line">
            {{ $t(quiz.question) }}
          </p>
        </div>
        
        <!-- Show options only if not completed -->
        <div v-if="!isCompleted" class="space-y-3 mb-6">
          <button 
            v-for="(option, index) in quiz.options" 
            :key="index"
            @click="selectedAnswer = index"
            :class="[
              'w-full text-left p-4 rounded-lg border transition-all duration-200 text-base',
              selectedAnswer === index 
                ? 'border-amber-500 bg-amber-500/20' 
                : 'border-gray-600 hover:border-gray-500 bg-gray-800/50'
            ]"
          >
            <span class="text-gray-300">{{ $t(option) }}</span>
          </button>
        </div>

        <!-- Show correct answer if completed -->
        <div v-else class="mb-6 p-4 bg-green-900/30 border border-green-600/50 rounded-lg">
          <p class="text-green-300 font-semibold text-base">{{ $t('emergencyGame.modal.correctAnswer') }}</p>
          <p class="text-gray-300 mb-3 text-base">{{ $t(quiz.options[quiz.correctAnswer]) }}</p>
          
          <!-- Show sequence for RDM lifecycle quiz -->
          <div v-if="quiz.id === 'mouse'" class="mt-4 p-3 bg-amber-900/30 border border-amber-600/50 rounded-lg">
            <p class="text-amber-300 text-sm font-bold mb-2">
              {{ $t('emergencyGame.quizzes.mouse.sequenceHint.title') }}
            </p>
            <p class="text-amber-200 text-sm mb-3">
              {{ $t('emergencyGame.quizzes.mouse.sequenceHint.subtitle') }}
            </p>
            <div class="flex gap-2 text-sm flex-wrap justify-center">
              <span 
                v-for="(step, index) in $t('emergencyGame.quizzes.mouse.sequenceHint.steps')"
                :key="index"
                :class="getStepColorClass(index)"
                class="px-3 py-2 rounded"
              >
                {{ step }}
              </span>
            </div>
          </div>
        </div>
        
        <div v-if="quizError" class="mb-4 p-3 bg-red-900/50 border border-red-600/50 rounded-lg text-red-300 text-center text-base">
          {{ $t(quizError) }}
        </div>
      </div>
      
      <!-- Fixed Footer with Buttons -->
      <div class="p-6 pt-4 border-t border-gray-700/50">
        <div class="flex gap-4">
          <button 
            @click="$emit('close')" 
            class="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-200 font-medium py-3 px-6 rounded-lg uppercase tracking-wide transition-colors text-base"
          >
            {{ $t('emergencyGame.modal.close') }}
          </button>
          <button 
            v-if="!isCompleted"
            @click="$emit('submit')"
            :disabled="selectedAnswer === null"
            class="flex-1 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-600 text-white font-medium py-3 px-6 rounded-lg uppercase tracking-wide transition-colors text-base"
          >
            {{ $t('emergencyGame.modal.submit') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

// Props and Emits
// Define the props for the quiz modal component
const props = defineProps({
  visible: Boolean,
  quiz: Object,
  selectedAnswer: Number,
  quizError: String,
  isCompleted: Boolean,
  emoji: String
})

// Emit events for close, submit, and update selected answer
// This allows the parent component to handle these events
const emit = defineEmits(['close', 'submit', 'update:selectedAnswer'])

const selectedAnswer = computed({
  get: () => props.selectedAnswer,
  set: (value) => emit('update:selectedAnswer', value)
})

// const to get the color class for each step in the sequence
// This function returns a color class based on the index of the step
const getStepColorClass = (index) => {
  const colors = [
    'bg-green-600/40',
    'bg-blue-600/40', 
    'bg-yellow-600/40',
    'bg-purple-600/40',
    'bg-red-600/40',
    'bg-orange-600/40'
  ]
  return colors[index] || 'bg-gray-600/40'
}
</script>