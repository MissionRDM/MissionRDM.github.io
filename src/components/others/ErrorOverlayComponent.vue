<!-- ErrorOverlayComponent.vue: A Vue component for displaying an error overlay with a message, title, and optional hint. It includes a close button and an animated shake effect. --> 
<template>
  <div
    v-if="visible"
    class="fixed inset-0 bg-black/70 z-[10010] flex items-center justify-center font-mono"
    @click.self="$emit('close')"
  >
    <div class="bg-[#1b1b1b] rounded-lg shadow-[0_0_30px_rgba(255,0,0,0.3)] border-2 border-red-500 max-w-md w-[90vw] mx-4 relative animate-shake">
      <!-- Close button -->
      <button
        @click="$emit('close')"
        class="absolute top-3 right-3 text-gray-400 hover:text-white text-xl font-bold transition-colors"
      >
        &times;
      </button>

      <!-- Error Icon -->
      <div class="text-center pt-6 pb-4">
        <div class="mx-auto w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mb-4">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 class="text-xl font-bold text-red-400 mb-2 tracking-wide uppercase">
          {{ title || 'Erreur' }}
        </h3>
      </div>

      <!-- Error Message -->
      <div class="px-6 pb-6">
        <div class="bg-[#2a1a1a] border border-red-800 p-4 rounded-lg mb-4">
          <p class="text-gray-200 text-sm leading-relaxed whitespace-pre-line">
            {{ message }}
          </p>
        </div>

        <!-- Hint section (optional) -->
        <div v-if="hint" class="bg-[#1a1a2a] border border-amber-800 p-3 rounded-lg mb-4">
          <div class="flex items-center mb-2">
            <svg class="w-4 h-4 text-amber-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <span class="text-amber-400 text-xs font-semibold uppercase tracking-wide">Indice</span>
          </div>
          <p class="text-amber-200 text-xs">
            {{ hint }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>

// Props and emits for the error overlay component
defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: 'Erreur'
  },
  message: {
    type: String,
    required: true
  },
  hint: {
    type: String,
    default: ''
  }
})

defineEmits(['close'])
</script>

<style scoped>
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
  20%, 40%, 60%, 80% { transform: translateX(2px); }
}

.animate-shake {
  animation: shake 0.5s ease-in-out;
}
</style>