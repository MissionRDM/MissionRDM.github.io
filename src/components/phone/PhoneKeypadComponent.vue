<!-- PhoneKeypadComponent.vue: A Vue component that represents the phone keypad interface. -->
<template>
  <div class="flex flex-col gap-4 relative">
    <!-- Help + Solution -->
    <div class="grid grid-cols-2 gap-2 text-center relative">
      <button 
        @click="showCluesWithPenalty"
        class="bg-red-600 hover:bg-red-700 py-2 rounded shadow text-sm font-semibold transition-all duration-300"
        :class="{ 'opacity-30 blur-sm': gameLogic.hasPendingCall() }"
      >
        {{ t('phone.help') }}
      </button>
      <button 
        @click="showSolutionsWithPenalty"
        class="bg-yellow-600 hover:bg-yellow-700 py-2 rounded shadow text-sm font-semibold transition-all duration-300"
        :class="{ 'opacity-30 blur-sm': gameLogic.hasPendingCall() }"
      >
        {{ t('phone.solution') }}
      </button>
      
      <!-- Pending Call Alert - Overlaying Help/Solution -->
      <div 
        v-if="gameLogic.hasPendingCall()" 
        class="absolute inset-0 flex items-center justify-center z-10"
      >
        <button 
          @click="gameLogic.answerPendingCall(characters)"
          class="w-full h-full bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg border-2 border-blue-400 shadow-lg hover:from-blue-500 hover:to-purple-500 transition-all duration-300 transform hover:scale-105 animate-pulse"
        >
          <div class="flex items-center gap-2 h-full">
            <div class="w-2 h-2 bg-blue-300 rounded-full animate-ping"></div>
            <div class="flex-1">
              <p class="text-white font-semibold text-xs">
                📞 {{ gameLogic.getPendingCallType() === 'incoming' ? t('phone.incomingCall') : t('phone.outgoingCallRequired') }}
              </p>
              <p class="text-blue-200 text-[10px]">
                {{ gameLogic.getPendingCallType() === 'incoming' ? t('phone.answerCall') : t('phone.makeCall') }}
              </p>
            </div>
          </div>
        </button>
      </div>
    </div>

    <!-- Penalty Confirmation Modal -->
    <div v-if="showPenaltyModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]" @click="closePenaltyModal">
      <div class="bg-gray-800 p-6 rounded-lg max-w-md w-full mx-4 z-[10000] border-2 border-yellow-500 shadow-2xl" @click.stop>
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold text-yellow-400 flex items-center gap-2">
            ⚠️ {{ t('timer.penaltyWarning') }}
          </h3>
          <button @click="closePenaltyModal" class="text-gray-400 hover:text-white text-xl leading-none">
            ✕
          </button>
        </div>
        
        <div class="bg-gray-700 p-4 rounded mb-4 border-l-4 border-yellow-500">
          <p class="text-white text-sm leading-relaxed">
            {{ pendingPenaltyType === 'hint' ? t('timer.hintPenaltyWarning') : t('timer.solutionPenaltyWarning') }}
          </p>
          <div class="mt-2 text-yellow-300 text-xs font-semibold">
            ⏱️ {{ pendingPenaltyType === 'hint' ? '+30 secondes' : '+60 secondes' }}
          </div>
        </div>
        
        <div class="flex gap-3">
          <button 
            @click="confirmPenalty" 
            class="flex-1 bg-red-600 hover:bg-red-700 py-3 rounded text-white font-semibold transition-colors"
          >
            {{ t('timer.acceptPenalty') }}
          </button>
          <button 
            @click="closePenaltyModal" 
            class="flex-1 bg-gray-600 hover:bg-gray-700 py-3 rounded text-white font-semibold transition-colors"
          >
            {{ t('timer.cancel') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Hint Modal -->
    <div v-if="showHintModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]" @click="closeHints">
      <div class="bg-gray-800 p-6 rounded-lg max-w-md w-full mx-4 max-h-96 overflow-y-auto z-[10000]" @click.stop>
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold text-white">
            {{ hintModalType === 'clues' ? t('phone.help') : t('phone.solution') }}
            - Level {{ game.getLvl() }}
          </h3>
          <button @click="closeHints" class="text-gray-400 hover:text-white text-xl leading-none z-[10001]">
            ✕
          </button>
        </div>
        
        <div class="bg-gray-700 p-4 rounded">
          <p class="text-white text-sm whitespace-pre-line">
            {{ hintModalType === 'clues' ? currentHint : currentSolution }}
          </p>
        </div>
        
        <button @click="closeHints" class="w-full mt-4 bg-amber-600 hover:bg-amber-700 py-2 rounded text-white font-semibold">
          {{ t('phone.close') }}
        </button>
      </div>
    </div>

    <!-- Characters -->
    <div class="flex justify-around gap-2">
      <button
        v-for="(char, i) in characters"
        :key="i"
        class="w-12 h-12 rounded-full overflow-hidden relative group transition-all duration-200"
        :class="[
          game.isCharCallable(char.name) && !game.hasCalledCharacter(char.name)
            ? gameLogic.getCharacterCallType(char.name) === 'incoming'
              ? 'ring-4 ring-blue-400 shadow-lg shadow-blue-400/60 hover:shadow-blue-300/80 animate-pulse transition-all' 
              : 'ring-4 ring-green-400 shadow-lg shadow-green-400/60 hover:shadow-green-300/80 animate-pulse transition-all'
            : game.isCharCallable(char.name) && game.hasCalledCharacter(char.name)
            ? 'ring-2 ring-green-400 shadow-lg shadow-green-400/50 hover:shadow-green-300/60 transition-all'
            : 'ring-2 ring-gray-500 opacity-60 grayscale hover:opacity-70'
        ]"
        @click="gameLogic.handleCharacterCall(char)"
      >
        <img :src="char.avatar" alt="Character" class="w-full h-full object-cover" />
        
        <!-- Notification badge for pending calls -->
        <div 
          v-if="game.isCharCallable(char.name) && !game.hasCalledCharacter(char.name)"
          class="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center animate-bounce"
          :class="[
            gameLogic.getCharacterCallType(char.name) === 'incoming' 
              ? 'bg-blue-500' 
              : 'bg-green-500'
          ]"
        >
          <span class="text-white text-xs font-bold">
            {{ gameLogic.getCharacterCallType(char.name) === 'incoming' ? '📞' : '📤' }}
          </span>
        </div>
        
        <!-- Checkmark for completed calls -->
        <div 
          v-if="game.isCharCallable(char.name) && game.hasCalledCharacter(char.name)"
          class="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center"
        >
          <span class="text-white text-xs">✓</span>
        </div>

        <div 
          class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          :class="[
            game.isCharCallable(char.name) 
              ? 'bg-green-500/20' 
              : 'bg-red-500/20'
          ]"
        ></div>
      </button>
    </div>

    <!-- Input Display + Delete -->
    <div class="flex items-center gap-2">
      <div class="flex-1">
        <input
          v-model="input"
          type="text"
          class="w-full px-2 py-1 bg-gray-800 border rounded text-center text-lg tracking-widest transition-all duration-200"
          :class="[
            statusType === 'success' ? 'border-green-500' :
            statusType === 'error' ? 'border-red-500' : 
            gameLogic.hasPendingCall() ? 'border-blue-400 bg-gray-700' : 'border-gray-600'
          ]"
          :placeholder="gameLogic.hasPendingCall() ? (gameLogic.getPendingCallType() === 'incoming' ? t('phone.placeholderIncoming') : t('phone.placeholderOutgoing')) : t('phone.placeholder')"
          readonly
        />
        <p
          v-if="statusMessage"
          :class="[
            'text-sm mt-1 text-center font-semibold',
            statusType === 'success' ? 'text-green-400' : 'text-red-400'
          ]"
        >
          {{ statusMessage }}
        </p>
      </div>
      <button
        @click="deleteLast"
        :disabled="gameLogic.hasPendingCall()"
        class="px-3 py-2 rounded text-sm transition-colors"
        :class="[
          gameLogic.hasPendingCall() 
            ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
            : 'bg-gray-700 hover:bg-gray-600 text-white'
        ]"
      >
        {{ t('phone.delete') }}
      </button>
    </div>

    <!-- Number Pad -->
    <div class="grid grid-cols-3 gap-2">
      <button
        v-for="num in numbers"
        :key="num"
        :disabled="gameLogic.hasPendingCall()"
        class="py-3 rounded-lg text-lg font-bold transition-colors"
        :class="[
          gameLogic.hasPendingCall() 
            ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
            : 'bg-gray-800 hover:bg-gray-700 text-white'
        ]"
        @click="appendNumber(num)"
      >
        {{ num }}
      </button>
    </div>

    <!-- Call / Submit -->
    <button
      :disabled="gameLogic.hasPendingCall()"
      class="w-full py-3 rounded text-base font-semibold transition-colors"
      :class="[
        gameLogic.hasPendingCall() 
          ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
          : 'bg-amber-600 hover:bg-amber-700 text-white'
      ]"
      @click="validateCode"
    >
      {{ gameLogic.hasPendingCall() ? (gameLogic.getPendingCallType() === 'incoming' ? t('phone.answerFirst') : t('phone.callFirst')) : t('phone.enter') }}
    </button>
  </div>
</template>

<script setup>
import { ref, inject } from 'vue'
import { useI18n } from 'vue-i18n'
import { useGameLogic } from '@/logic/useGameLogic.js'
import { useHintsSolutions } from '@/logic/hintsAndSolutions/useHintsSolutions.js'
import char1 from '@/assets/characters/char1.png'
import char2 from '@/assets/characters/char2.png'
import char3 from '@/assets/characters/char3.png'
import { useGameInfo } from '@/store/gameInfo.js'

const game = useGameInfo()
const { t } = useI18n()

// Inject timer from parent (optional)
const timer = inject('timer', null)

// Hints functionality
const {
  currentHint,
  currentSolution,
  showClues,
  showSolutions,
  closeHints,
  showHintModal,
  hintModalType
} = useHintsSolutions()

// Penalty modal state
const showPenaltyModal = ref(false)
const pendingPenaltyType = ref('')
const pendingPenaltyCallback = ref(null)

const input = ref('')
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9]

// Get the appropriate game logic based on current level
const gameLogic = useGameLogic(setFeedback)

const characters = [
  { name: 'Santiago', avatar: char1, key: 'Santiago' },
  { name: 'Inès', avatar: char2, key: 'Inès' },
  { name: 'Jack', avatar: char3, key: 'Jack' }
]

// Function to show clues or solutions with a penalty
const showCluesWithPenalty = () => {
  if (gameLogic.hasPendingCall()) return
  
  showPenaltyModal.value = true
  pendingPenaltyType.value = 'hint'
  pendingPenaltyCallback.value = showClues
}

const showSolutionsWithPenalty = () => {
  if (gameLogic.hasPendingCall()) return
  
  showPenaltyModal.value = true
  pendingPenaltyType.value = 'solution'
  pendingPenaltyCallback.value = showSolutions
}

const confirmPenalty = () => {
  const penaltySeconds = pendingPenaltyType.value === 'hint' ? 30 : 60
  
  // Add penalty to timer
  const timerComponent = timer?.value || timer
  if (timerComponent && timerComponent.addPenalty) {
    timerComponent.addPenalty(penaltySeconds)
  } 
  
  // Execute the original callback
  if (pendingPenaltyCallback.value) {
    pendingPenaltyCallback.value()
  }
  
  closePenaltyModal()
}

const closePenaltyModal = () => {
  showPenaltyModal.value = false
  pendingPenaltyType.value = ''
  pendingPenaltyCallback.value = null
}

// Function to append a number to the input
function appendNumber(num) {
  if (input.value.length >= 6 || gameLogic.hasPendingCall()) return
  input.value += num
}

// Function to delete the last character from the input
function deleteLast() {
  if (gameLogic.hasPendingCall()) return
  input.value = input.value.slice(0, -1)
}

// Function to validate the input code
function validateCode() {
  gameLogic.handleCodeInput(input.value.trim()) 
  input.value = ''
}

const statusMessage = ref('')
const statusType = ref('') 

// Function to set feedback messages
// This function updates the status message and type, and clears them after a timeout
function setFeedback(type, message) {
  statusType.value = type
  statusMessage.value = message
  setTimeout(() => {
    statusMessage.value = ''
    statusType.value = ''
  }, 2000)
}
</script>