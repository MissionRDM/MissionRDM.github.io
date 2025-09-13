<!-- RoadmapModalComponent.vue: A modal component for displaying the roadmap -->
<template>
  <div v-if="visible" class="fixed inset-0 bg-black bg-opacity-70 z-[9999] flex items-center justify-center">
    <div class="bg-[#121212] p-6 rounded-lg shadow-xl max-w-5xl w-full h-[80vh] overflow-y-auto relative z-[10000]">
      <button
        @click="$emit('close')"
        class="absolute top-4 right-4 text-white text-2xl hover:text-amber-400 transition z-[10001]"
        aria-label="Close"
      >
        &times;
      </button>

      <h2 class="text-2xl font-bold text-white mb-6 text-center tracking-wider">📜 {{ $t('roadmap.title') }}</h2>
      <Roadmap :steps="steps" />
    </div>
  </div>
</template>

<script setup>
import Roadmap from '@/components/roadmap/RoadmapComponent.vue'
defineProps({
  visible: Boolean,
  steps: Array
})
defineEmits(['close'])
</script>