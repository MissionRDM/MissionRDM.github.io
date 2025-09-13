<!-- TutorialModalComponent.vue: A modal component that displays the tutorial instructions -->
<template>
    <div class="min-h-screen flex items-center justify-center bg-[#121212] text-gray-200 px-4 relative font-mono">

        <div class="w-full max-w-6xl bg-[#202020] rounded-xl border border-gray-700 shadow-[0_0_30px_rgba(255,191,0,0.2)] p-16">
            <h1 class="text-3xl font-bold text-center text-amber-400 mb-8 tracking-widest uppercase">
                {{ $t('tutorial.title') }}
            </h1>
    
            <p class="text-gray-400 mb-6 text-center">
                {{ $t('tutorial.subtitle') }}
            </p>
            <p class="text-gray-400 mb-6 text-center">
                {{ $t('tutorial.instructions') }}
            </p>
            <p class="list-disc list-inside text-gray-400 mb-6 text-center">
                {{ $t('tutorial.step1') }}
            </p>
            <p class="list-disc list-inside text-gray-400 mb-6 text-center">
                {{ $t('tutorial.step2') }}
            </p>
            <p class="list-disc list-inside text-gray-400 mb-6 text-center">
                {{ $t('tutorial.step3') }}
            </p>
            <p class="list-disc list-inside text-gray-400 mb-6 text-center">
                {{ $t('tutorial.step4') }}
            </p>
            <button
                class="bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 rounded-md shadow-md uppercase tracking-wide transition-all duration-150 w-full"
                @click="handleClose"
            >
                {{ $t('tutorial.backToStart') }}
            </button>
        </div>
    </div>
</template>

<script setup>

// Define props and emits
const props = defineProps({
    visible: {
        type: Boolean,
        default: true
    }
})

const emit = defineEmits(['close'])

// Handle close action
const handleClose = () => {
    emit('close')
}
</script>