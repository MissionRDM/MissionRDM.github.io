<!-- PhoneComponent.vue: A Vue component that serves as a styled phone container for other components. It includes a slot for content insertion. -->
<template>
  <div class="bg-gray-900 text-white p-4 rounded-2xl shadow-lg w-full max-w-xs mx-auto flex flex-col gap-4 font-mono border-4 border-black h-[450px]">
    <slot />
  </div>
</template>
