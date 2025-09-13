<!-- QuizGameAreaComponent.vue: A component that displays the quiz game area with a scenario image and clickable objects -->
<template>
  <div class="p-6">
    <div class="text-center mb-8">
      <h2 class="text-2xl font-bold text-amber-400 mb-2 uppercase tracking-wide">
        {{ $t('emergencyGame.subtitle') }}
      </h2>
      <p class="text-gray-400 [&_a]:text-yellow-400 [&_a:hover]:text-yellow-300" v-html="t('emergencyGame.description')"></p>
    </div>

    <!-- Use existing ScenarioComponent with clickable areas -->
    <div class="relative max-w-6xl mx-auto">
      <ScenarioComponent :imageSrc="emergencyRoomImage" class="w-full">
        <!-- Clickable areas for game objects using slots -->
        <template #clickable-areas>
          <div
            v-for="(obj, id) in gameObjects"
            :key="id"
            @click="$emit('objectClick', id)"
            :class="[
              'absolute cursor-pointer transition-all duration-300 rounded-lg z-40',
              obj.bgClass || '',
              completedQuizzes.has(id) 
                ? 'border-green-400 bg-green-500/50 shadow-lg shadow-green-500/50' 
                : `${obj.hoverClass} border-transparent`
            ]"
            :style="obj.position"
          >
            <!-- Completion checkmark -->
            <div v-if="completedQuizzes.has(id)" class="absolute top-2 right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-2 border-white shadow-lg">
              <span class="text-sm text-white font-bold">✓</span>
            </div>
          </div>
        </template>
      </ScenarioComponent>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import ScenarioComponent from '@/components/scenario/ScenarioScreenComponent.vue'
import MainImage from '@/assets/endQuiz/mainscenario.png'

const { t } = useI18n()

defineProps({
  gameObjects: {
    type: Object,
    required: true
  },
  completedQuizzes: {
    type: Set,
    required: true
  }
})

defineEmits(['objectClick'])

const emergencyRoomImage = MainImage
</script>