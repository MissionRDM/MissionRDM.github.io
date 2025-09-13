<!-- RoadmapComponent.vue: A Vue component that displays a roadmap with steps and items. It uses props to receive the steps data and methods to determine the styling of each item based on its level and status. -->
<template>
  <div class="grid gap-6 text-white">
    <!-- Roadmap Steps -->
    <div
      v-for="(step, index) in steps"
      :key="index"
      class="p-5 rounded-xl bg-[#1a1a1a] border border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-200"
    >
      <div class="flex items-center justify-between mb-2">
        <h3 class="text-lg font-semibold text-amber-400 tracking-wide">
          {{ step.label }}
        </h3>
      </div>

      <!-- Step Items -->
      <div v-if="step.items.length" class="text-sm space-y-1">
        <div 
          v-for="(item, i) in step.items" 
          :key="i"
          :class="[
            getIndentationClass(item),
            getEntryColorClass(item)
          ]"
          class="flex items-start transition-colors duration-300"
        >
          <span 
            class="mr-2 flex-shrink-0" 
            :class="getBulletColorClass(item)"
          >
            {{ getBulletSymbol(item) }}
          </span>
          <span 
            :class="item.isNew ? 'font-medium' : ''"
          >
            {{ typeof item === 'string' ? item : item.text }}
          </span>
        </div>
      </div>

      <p v-else class="italic text-gray-500 text-sm">{{ $t('roadmap.entries') }}</p>
    </div>
  </div>
</template>

<script setup>
  defineProps({
    steps: Array
  })

  // Function to determine indentation level
  function getIndentationClass(item) {
    const level = typeof item === 'object' ? item.level : 0
    
    switch(level) {
      case 1:
        // Sub-steps like 1.1, 1.2
        return 'ml-4' 
      case 2:
        // Sub-sub-steps like A., B., C.
        return 'ml-8'
      default:
        // Main level
        return 'ml-0' 
    }
  }

  // Function to get text color class based on whether entry is new
  function getEntryColorClass(item) {
    if (typeof item === 'object' && item.isNew) {
      return 'text-yellow-500'
    }
    return 'text-gray-300'
  }

  // Function to get bullet color class based on whether entry is new
  function getBulletColorClass(item) {
    if (typeof item === 'object' && item.isNew) {
      return 'text-yellow-400'
    }
    return 'text-gray-400'
  }

  // Function to get different bullet symbols based on level
  function getBulletSymbol(item) {
    const level = typeof item === 'object' ? item.level : 0
    
    switch(level) {
      case 1:
        // Arrow for sub-steps
        return '▸' 
      // Circle for sub-sub-steps
      case 2:
        return '◦' 
      default:
        // Main items use a dot
        return '•' 
    }
  }
</script>