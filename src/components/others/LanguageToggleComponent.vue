<!-- LanguageToggleComponent.vue: A Vue component for toggling between English and French languages. It uses Vue I18n for localization and stores the selected language in localStorage. -->
<template>
  <div class="absolute top-4 right-4">
    <select
      v-model="currentLocale"
      @change="changeLanguage"
      class="bg-[#1f1f1f] border border-gray-600 text-white px-3 py-1 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
    >
      <option value="en">🇬🇧 English</option>
      <option value="fr">🇫🇷 Français</option>
    </select>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'

const { locale } = useI18n()
const currentLocale = ref(locale.value)

// Function updates the locale and saves it to localStorage
function changeLanguage() {
  locale.value = currentLocale.value
  localStorage.setItem('lang', locale.value)
}
</script>
