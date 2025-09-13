<!-- PhoneCallComponent.vue: A Vue component for displaying an phone call interface with caller information and a call body. -->
<template>
  <div
    class="w-full z-[10010] flex items-center justify-center"
    @click="$emit('close')"
  >
    <div class="w-full h-full flex items-center justify-center p-8">
      <div 
        class="bg-gradient-to-b from-gray-900 to-black text-white rounded-2xl shadow-2xl w-full max-w-3xl h-[70vh] flex flex-col border border-gray-700 overflow-hidden"
        @click.stop
      >
        <!-- Call Header -->
        <div class="bg-gradient-to-r from-green-600 to-green-700 p-4 text-center">
          <div class="text-xs text-green-200 mb-1">{{ t('phone.incomingCall') }}</div>
          <div class="flex items-center justify-center gap-2">
            <div class="w-2 h-2 bg-green-300 rounded-full animate-ping"></div>
            <span class="text-sm font-medium">{{ t('phone.connection') }}</span>
          </div>
        </div>

        <!-- Caller Info -->
        <div class="flex items-center gap-4 p-4 bg-gradient-to-b from-gray-800 to-gray-900">
          <div class="relative flex-shrink-0">
            <img 
              :src="avatar" 
              class="w-16 h-16 rounded-full border-2 border-white shadow-lg" 
              :alt="name"
            />
          </div>
          
          <div class="flex-1">
            <div class="text-lg font-bold text-white mb-1">{{ name }}</div>
            <div class="text-sm text-gray-400">{{ t('phone.media') }}</div>
            
            <!-- Call Title if provided -->
            <div v-if="titleStart || titleMiddle || titleEnd" class="mt-3 bg-gray-800 p-3 rounded-lg">
              <h2 class="text-sm font-semibold">
                <span class="text-white">{{ titleStart }}</span>
                <span class="text-blue-400">{{ titleMiddle }}</span>
                <span class="text-white">{{ titleEnd }}</span>
              </h2>
            </div>
          </div>
        </div>

        <!-- Call Content -->
        <div class="p-4 bg-black flex-1 flex flex-col min-h-0">
          <div class="bg-gray-900 rounded-lg p-4 mb-4 flex-1 overflow-y-auto">
            <p class="text-sm whitespace-pre-line leading-relaxed text-gray-200">{{ body }}</p>
          </div>

          <!-- End Call Button -->
          <div class="flex-shrink-0">
            <button
              class="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2 shadow-lg"
              @click="$emit('close')"
            >
              {{ t('phone.endCall') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// Props (they are required for the component to function) for the phone call component
defineProps({
  avatar: String,
  name: String,
  body: String,
  titleStart: String,
  titleMiddle: String,
  titleEnd: String
})
defineEmits(['close'])
</script>