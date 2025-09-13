<template>
  <div class="min-h-screen bg-[#121212] text-gray-200 p-6 font-mono relative overflow-hidden">
    <!-- Subtle particles -->
    <div class="absolute inset-0 pointer-events-none">
      <div class="absolute top-20 left-1/4 w-1 h-1 bg-amber-400/30 rounded-full animate-pulse"></div>
      <div class="absolute top-32 right-1/3 w-1.5 h-1.5 bg-amber-300/40 rounded-full animate-pulse"
        style="animation-delay: 1s;"></div>
      <div class="absolute top-16 left-2/3 w-1 h-1 bg-yellow-400/25 rounded-full animate-pulse"
        style="animation-delay: 2s;"></div>
      <div class="absolute top-40 right-1/4 w-0.5 h-0.5 bg-amber-500/20 rounded-full animate-pulse"
        style="animation-delay: 3s;"></div>
    </div>

    <div class="max-w-4xl mx-auto relative">

      <!-- Header -->
      <div class="text-center mb-12">
        <div class="inline-flex items-center justify-center w-12 h-12 bg-amber-500/80 rounded-full mb-6">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4"></path>
          </svg>
        </div>

        <h1 class="text-3xl font-bold text-amber-400/90 mb-4 uppercase tracking-widest">
          {{ $t('endScreen.congratulations') }}
        </h1>
        <p class="text-gray-400 max-w-2xl mx-auto leading-relaxed">
          {{ $t('endScreen.congratulationsMessage') }}
        </p>
      </div>

      <!-- Content Cards -->
      <div class="space-y-6">

        <!-- Roadmap Card -->
        <div class="bg-[#1a1a1a] rounded-lg border border-gray-800 p-6 hover:border-amber-500/20 transition-colors">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div class="w-8 h-8 bg-amber-500/15 rounded-md flex items-center justify-center mr-4">
                <svg class="w-4 h-4 text-amber-400/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m0 0L9 7">
                  </path>
                </svg>
              </div>
              <div>
                <h2 class="text-lg font-semibold text-amber-400/80 uppercase tracking-wide">{{
                  $t('endScreen.roadmapTitle') }}</h2>
                <p class="text-gray-500 text-sm">{{ $t('endScreen.roadmapDescription') }}</p>
              </div>
            </div>
            <div class="relative">
              <RoadmapButton @click="showRoadmap = true" class="!static !top-auto !right-auto" />
            </div>
          </div>
        </div>

        <!-- Test Game Card -->
        <TestGameCard />

        <!-- Theory & Resources Card -->
        <TheoryResourcesCard />

        <!-- Contact Card -->
        <ContactFormCard />
      </div>

      <!-- Roadmap Modal -->
      <RoadmapModal :visible="showRoadmap" :steps="roadmap.roadmapSteps" @close="showRoadmap = false" />
      <div class="text-center mt-12 space-y-8">
        <button @click="backToMenu"
          class="bg-gray-700 hover:bg-gray-600 text-gray-300 font-medium py-3 px-8 rounded-md uppercase tracking-wide transition-colors">
          {{ $t('endScreen.backToMenu') }}
        </button>

        <!-- Footer -->
        <footer class="border-t border-gray-800 py-6 px-4">
          <div class="text-gray-500 text-sm leading-relaxed text-center space-y-4">
            <p class="text-gray-500 text-sm mt-2 text-center [&_a]:text-yellow-400 [&_a:hover]:text-yellow-300" v-html=" t('endScreen.EndMsg')"></p>
            <p class="text-gray-500 text-sm">
              {{ $t('endScreen.EndMsg2') }}
            </p>
          </div>
        </footer>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useRoadmapStore } from '@/store/roadmap'
import RoadmapButton from '@/components/roadmap/RoadmapButtonComponent.vue'
import RoadmapModal from '@/components/roadmap/RoadmapModalComponent.vue'
import TheoryResourcesCard from '@/components/others/TheoryResourcesComponent.vue'
import TestGameCard from '@/components/others/TestGameComponent.vue'
import ContactFormCard from '@/components/others/ContactFormComponent.vue'

const router = useRouter()
const roadmap = useRoadmapStore()
const showRoadmap = ref(false)
const { t } = useI18n()

onMounted(() => {
  roadmap.initializeSteps()
})

const backToMenu = () => {
  router.push('/')
}
</script>