<!-- This is the introduction page for the game which will display the game's introductory text with a typewriter effect. It allows users to read through the introduction and then proceed to the first level. -->
<template>
  <div class="min-h-screen bg-black text-amber-400 font-mono flex items-center justify-center px-6 py-10">
    <div class="max-w-2xl text-lg leading-relaxed w-full">
      <p
        v-for="(para, index) in displayedParagraphs"
        :key="index"
        class="mb-6 text-justify"
      >
        {{ para }}
      </p>

      <p v-if="currentLine" class="mb-6 text-justify">
        {{ currentLine }}<span class="animate-pulse">|</span>
      </p>

      <div class="flex justify-center">
        <!-- Continue button that appears after the introduction is done typing -->
        <button
          v-if="done"
          @click="goToLevel"
          class="mt-6 bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-md font-semibold uppercase transition"
        >
          {{ $t('intro.continue') }}
        </button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useTypewriter } from '@/composables/useTypewriter'

const { t } = useI18n()
const router = useRouter()

const introText = t('intro.text')
const paragraphs = introText.split('\n\n')

const {
  displayedParagraphs,
  currentLine,
  done,
  startTyping
} = useTypewriter(paragraphs)

onMounted(startTyping)

function goToLevel() {
  router.push('/level/1')
}
</script>

