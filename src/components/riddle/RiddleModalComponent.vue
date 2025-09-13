<!-- RiddleModalComponent.vue: A modal component for displaying riddles with input fields and feedback -->
<template>
  <!-- Riddle Modal: Displays a riddle with input fields for answers, feedback messages, and an image if provided. -->
  <div v-if="visible" class="fixed inset-0 bg-black/70 z-[9999] flex items-center justify-center">
    <div class="bg-[#1b1b1b] text-white rounded-lg p-4 w-[90vw] sm:w-[70vw] lg:w-[50vw] max-h-[90vh] overflow-y-auto relative z-[10000]">
      <button @click="$emit('close')" class="absolute top-2 right-2 text-white hover:text-red-400 z-[10001]">&times;</button>
      <h2 class="text-lg font-bold mb-4 text-amber-400">{{ title }}</h2>
      <img v-if="image" :src="image" alt="Riddle" class="mb-4 rounded border border-amber-400 max-w-[600px] max-h-[400px] object-contain mx-auto" />
      <p class="mb-2">{{ question }}</p>
      
      <!-- Input fields for user guesses -->
      <div v-for="(input, index) in guessList" :key="index" class="mb-2">
        <input
          v-model="guessList[index]"
          type="text"
          class="w-full px-3 py-1.5 bg-gray-800 border rounded text-white"
          :class="{ 'border-green-500': inputStates[index] === 'success', 'border-red-500': inputStates[index] === 'error' }"
          :placeholder="getPlaceholderText(index)"
        />
      </div>
      <!-- Submit button for checking answers -->
      <button class="mt-3 w-full bg-amber-600 hover:bg-amber-700 py-2 rounded text-sm" @click="checkAnswer">
        {{ $t('riddle.submit') }}
      </button>
      <!-- Feedback message area -->
      <div v-if="feedback" class="mt-4 p-2 rounded" :class="{ 'bg-green-900': feedbackType === 'success', 'bg-red-900': feedbackType === 'error' }">
        <p :class="feedbackType === 'success' ? 'text-green-400' : 'text-red-400'">{{ feedback }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useGameInfo } from '@/store/gameInfo'
import {useRoadmapStore} from '@/store/roadmap'
import { playSound } from '@/utils/playSound'
import stepFoundSound from '@/assets/audio/stepFound.mp3'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// Props: Define the properties that the component accepts
// These include visibility, title, question, placeholders, image, correct answers, and feedback messages
const props = defineProps({
  visible: Boolean,
  title: String,
  question: String,
  placeholder: String,
  placeholder2: { type: Array, default: () => [] }, 
  image: String,
  correctAnswers: { type: [Array, String], default: () => [] },
  successMessage: String,
  failureMessage: String
})

// Emits: Define the events that the component can emit
// This allows the parent component to listen for these events, such as closing the modal
const emit = defineEmits(['close'])
const game = useGameInfo()
const inputStates = ref([])
const guessList = ref([])
const feedback = ref('')
const feedbackType = ref('')
const roadmap = useRoadmapStore()

const correctAnswers = computed(() => 
  Array.isArray(props.correctAnswers) 
    ? props.correctAnswers.map(a => a.toLowerCase())
    : typeof props.correctAnswers === 'string'
      ? props.correctAnswers.split(',').map(a => a.trim().toLowerCase())
      : []
)

// Function to get placeholder text
function getPlaceholderText(index) {
  // Try to get the specific placeholder key (placeholder2_1, placeholder2_2, etc.)
  const placeholderKey = `riddle1.placeholder2_${index + 1}`
  const specificPlaceholder = t(placeholderKey)
  
  // If translation exists and isn't the key itself, use it
  if (specificPlaceholder && specificPlaceholder !== placeholderKey) {
    return `${props.placeholder} ${specificPlaceholder}`
  }
  
  // Fallback to numbering
  return `${props.placeholder} ${index + 1}`
}

// Watcher to initialize guessList and inputStates when correctAnswers changes
watch(correctAnswers, () => {
  guessList.value = correctAnswers.value.map(() => '')
  inputStates.value = correctAnswers.value.map(() => '')
}, { immediate: true })

// Watcher to reset input states when guessList changes
watch(guessList, () => {
  inputStates.value = inputStates.value.map(() => '')
}, { deep: true })

// Function to check the user's answers against the correct answers
// This function compares the user's input with the correct answers and provides feedback
function checkAnswer() {
  const userAnswers = guessList.value.map(a => a.trim().toLowerCase())
  userAnswers.forEach((answer, index) => {
    inputStates.value[index] = answer === correctAnswers.value[index] ? 'success' : 'error'
  })

  const allMatch = correctAnswers.value.every((answer, index) => userAnswers[index] === answer)
  feedbackType.value = allMatch ? 'success' : 'error'
  feedback.value = allMatch ? props.successMessage : props.failureMessage

  if (allMatch) {
    setTimeout(() => {
      playSound(stepFoundSound)
      feedback.value = ''
      feedbackType.value = ''
      inputStates.value = inputStates.value.map(() => '')
      game.markRiddleAsSolved()
      roadmap.addEntry('step1', 'step1_1')
      roadmap.addEntry('step1', 'step1_1_B')
      roadmap.addEntry('step1', 'step1_1_C')
      roadmap.addEntry('step1', 'step1_1_E')
      roadmap.addEntry('step1', 'step1_1_F')
      roadmap.addEntry('step1', 'step1_1_G')
      game.markMessageAsRead()
      emit('close')
    }, 2000)
  }
}
</script>