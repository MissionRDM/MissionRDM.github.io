<!-- TheoryResourcesComponent.vue: A Vue component that provides links to a PDF guide and an external resource related to the theory of the game. It uses Vue I18n for localization and computed properties to determine the correct URLs based on the selected language. -->
<template>
  <!-- Theory Resources Card Component -->
  <div class="bg-[#1a1a1a] rounded-lg border border-gray-800 p-6 hover:border-amber-500/20 transition-colors">
    <div class="flex items-center mb-6">
      <div class="w-8 h-8 bg-amber-500/15 rounded-md flex items-center justify-center mr-4">
        <!-- Icon for the theory resources -->
        <svg class="w-4 h-4 text-amber-400/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253">
          </path>
        </svg>
        <!-- Title and description for the theory resources -->
      </div>
      <h2 class="text-lg font-semibold text-amber-400/80 uppercase tracking-wide">{{ $t('endScreen.theoryTitle') }}</h2>
    </div>

    <p class="text-gray-500 text-sm leading-relaxed">{{ $t('endScreen.theoryDescription') }}</p>
    <div class="h-4"></div>
    <!-- Buttons to view the PDF and open the external link -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <button @click="openPDF"
        class="bg-amber-500/80 hover:bg-amber-500 text-white font-medium py-3 px-4 rounded-md uppercase tracking-wide transition-colors">
        {{ $t('endScreen.viewPDF') }}
      </button>

      <button @click="openExternalLink"
        class="bg-gray-700 hover:bg-gray-600 text-gray-200 font-medium py-3 px-4 rounded-md uppercase tracking-wide transition-colors">
        {{ $t('endScreen.openLink') }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

// Computed property to determine the PDF URL based on the selected language
// This property checks the current locale and returns the appropriate URL for the PDF guide
const pdfUrl = computed(() => {
  const lang = locale.value
  return lang === 'fr'
    ? 'https://hevs.allinone.io/media/document/22/mission-gdr-2024-guide-complementaire.pdf'
    : 'https://hevs.allinone.io/media/document/22/mission-rdm-2024-complementary-guide.pdf'
})

// Function to open the PDF in a new tab
// This function uses the computed pdfUrl to open the PDF guide in a new browser tab
const openPDF = () => {
  window.open(pdfUrl.value, '_blank')
}

// Function to open an external link based on the selected language
// This function checks the current locale and opens the corresponding external resource link in a new tab
const openExternalLink = () => {
  const lang = locale.value
  const url = lang === 'fr'
    ? 'https://doi.org/10.5281/zenodo.6391188'
    : 'https://doi.org/10.5281/zenodo.7985732'
  window.open(url, '_blank')
}
</script>