<!-- PhoneMessageComponent.vue: A Vue component for displaying a phone message interface with sender information and a message body. -->
<template>
  <div class="flex flex-col h-full bg-black text-white rounded-xl overflow-hidden">
    <!-- Header: Contact Info -->
    <div class="flex items-center gap-3 p-4 bg-gray-900 border-b border-gray-700">
      <img
        :src="avatar"
        :alt="name"
        class="w-10 h-10 rounded-full object-cover"
      />
      <div class="flex-1">
        <div class="text-sm font-semibold text-white">{{ name }}</div>
        <div class="text-xs text-gray-400">Message</div>
      </div>
    </div>

    <!-- Message Area -->
    <div class="flex-1 overflow-y-auto p-4 bg-black">
      <!-- Incoming message bubble -->
      <div class="flex items-start gap-2 mb-3">
        <div class="flex-1">
          <div class="bg-gray-800 rounded-2xl rounded-tl-md p-3 shadow-lg">
            <p class="whitespace-pre-line text-sm leading-relaxed text-white">{{ body }}</p>
          </div>
          <div class="text-xs text-gray-500 mt-1 ml-3">
            Just now
          </div>
        </div>
      </div>
    </div>

    <!-- Close Button -->
    <div class="p-4 bg-gray-900 border-t border-gray-700">
      <button
        class="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
        @click="$emit('close')"
      >
        {{ $t ? $t('phone.close') : 'Close' }}
      </button>
    </div>
  </div>
</template>
<script setup>
// Props (they are required for the component to function) for the phone message component
defineProps({
  from: String,
  name: String,
  body: String,
  avatar: String
})
defineEmits(['close'])
</script>