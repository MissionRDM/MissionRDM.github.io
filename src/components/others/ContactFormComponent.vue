<!-- ContactFormComponent.vue: A Vue component for displaying a contact form with fields for name, email, and message, and handling form submission via email. -->
<template>
  <!-- Contact Form Section -->
  <div class="bg-[#1a1a1a] rounded-lg border border-gray-800 p-6 hover:border-amber-500/20 transition-colors">
    <div class="flex items-center mb-6">
      <div class="w-8 h-8 bg-amber-500/15 rounded-md flex items-center justify-center mr-4">
        <svg class="w-4 h-4 text-amber-400/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
        </svg>
      </div>
      <h3 class="text-lg font-semibold text-amber-400/80 uppercase tracking-wide">{{ $t('endScreen.contactTitle') }}</h3>
    </div>
    
    <!-- Contact Form with name, email, and message fields -->
    <form @submit.prevent="submitContactForm" class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input 
          v-model="contactForm.name"
          type="text" 
          required
          class="w-full px-4 py-3 bg-[#111111] border border-gray-800 rounded-md text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 transition-colors"
          :placeholder="$t('endScreen.namePlaceholder')"
        />
        <input 
          v-model="contactForm.email"
          type="email" 
          required
          class="w-full px-4 py-3 bg-[#111111] border border-gray-800 rounded-md text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 transition-colors"
          :placeholder="$t('endScreen.emailPlaceholder')"
        />
      </div>
      
      <textarea 
        v-model="contactForm.message"
        required
        rows="3"
        class="w-full px-4 py-3 bg-[#111111] border border-gray-800 rounded-md text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 transition-colors resize-none"
        :placeholder="$t('endScreen.messagePlaceholder')"
      ></textarea>
      
      <!-- Submit Button -->
      <button 
        type="submit"
        :disabled="isSubmitting"
        class="w-full bg-amber-500/80 hover:bg-amber-500 disabled:bg-gray-600 text-white font-medium py-3 rounded-md uppercase tracking-wide transition-colors"
      >
        {{ isSubmitting ? $t('endScreen.sending') : $t('endScreen.sendMessage') }}
      </button>
    </form>
    
    <!-- Status Messages after submission -->
    <div v-if="contactStatus === 'success'" class="mt-4 p-3 bg-green-800/30 border border-green-600/50 rounded-md text-green-300 text-center">
      {{ $t('endScreen.messageSent') }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const isSubmitting = ref(false)
const contactStatus = ref('')
const contactForm = ref({
  name: '',
  email: '',
  message: ''
})

// Function to handle form submission
// This function constructs a mailto link with the form data and opens it in a new window
const submitContactForm = async () => {
  isSubmitting.value = true
  contactStatus.value = ''
  
  try {
    const subject = encodeURIComponent('Feedback from Mission RDM Game')
    const body = encodeURIComponent(
      `Name: ${contactForm.value.name}\nEmail: ${contactForm.value.email}\n\nMessage:\n${contactForm.value.message}`
    )
    
    const mailtoLink = `mailto:openscience.bibliosante@hevs.ch?subject=${subject}&body=${body}`
    window.open(mailtoLink)
    
    contactStatus.value = 'success'
    
    setTimeout(() => {
      contactForm.value = { name: '', email: '', message: '' }
      contactStatus.value = ''
    }, 3000)
    
  } catch (error) {
    console.error('Error:', error)
    contactStatus.value = 'error'
  } finally {
    isSubmitting.value = false
  }
}
</script>