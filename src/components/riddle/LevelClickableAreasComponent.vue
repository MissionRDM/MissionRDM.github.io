<!-- LevelClickableAreasComponent.vue: A Vue component that renders clickable areas for different game levels. -->
<template>
  <!-- Level 1 Visible Clickable Elements -->
  <template v-if="game.level === 1">
    <!-- First clickable element - middle -->
    <div v-if="canShowElement1" class="absolute top-[15%] right-[41%] transform -translate-x-1/2
             w-[4%] h-[6%]
             cursor-pointer transition-colors duration-200 z-40" 
         @click="handleElement1Click" 
         :title="$t('click.one')">
    </div>

    <!-- Second clickable element - Position depends on language -->
    <div v-if="canShowElement2" 
         :class="element2PositionClass" 
         class="w-[15%] h-[3%] cursor-pointer transition-colors duration-200 z-40" 
         @click="handleElement2Click" 
         :title="$t('click.two')">
    </div>

    <!-- Third clickable element - bottom middle -->
    <div v-if="canShowElement3" class="absolute bottom-[2%] right-[33%] transform -translate-x-1/2
            w-[15%] h-[4%]
            cursor-pointer transition-colors duration-200 z-40" 
         @click="handleElement3Click"
         :title="$t('click.three')">
    </div>
  </template>

  <!-- Level 2 Clickable Elements -->
  <template v-if="game.level === 2">
    <!-- Level 2 - bottom left -->
    <div v-if="canShowLvl2" class="absolute bottom-[8%] left-[8%]
            w-[3%] h-[5%]
            cursor-pointer transition-colors duration-200 z-40" 
         @click="handleElementLvl2Click"
         :title="$t('click.four')">
    </div>
  </template>

  <!-- Level 3 Clickable Elements -->
  <template v-if="game.level === 3">
    <!-- Level 3 - clickable calendar -->
    <div v-if="canShowLvl3Click1" class="absolute bottom-[52.3%] left-[7.5%]
            w-[1.5%] h-[3%]
            cursor-pointer transition-colors duration-200 z-40 rounded-lg" 
         @click="handleElementLvl3Click1"
         :title="$t('click.six')">
    </div>

    <!-- Level 3 - clickable post it -->
    <div v-if="canShowLvl3Click3" class="absolute top-[18%] right-[38%]
            w-[3%] h-[6%]
            cursor-pointer transition-colors duration-200 z-40" 
         @click="handleElementLvl3Click3"
         :title="$t('click.five')">
    </div>
  </template>

  <!-- Level 4 Clickable Elements -->
  <template v-if="game.level === 4">
    <!-- Level 4 - clickable element -->
    <div v-if="canShowLvl4Click1" class="absolute top-[53.5%] right-[45%]
            w-[3%] h-[5%]
            cursor-pointer transition-colors duration-200 z-40" 
         @click="handleElementLvl4Click1"
         :title="$t('click.one')">
    </div>

    <!-- Level 4 - second clickable elemnt (email) -->
     <div v-if="canShowLvl4Click2" class="absolute top-[24%] right-[39.5%]
            w-[14%] h-[12%]
            cursor-pointer transition-colors duration-200 z-40" 
          @click="handleElementLvl4Click2"
          :title="$t('click.seven')">
    </div>
  </template>

  <!-- Level 5 Clickable Elements -->
  <template v-if="game.level === 5">
    <!-- Level 5 - clickable element on tablet -->
    <div v-if="canShowLvl5Click1" class="absolute bottom-[11%] right-[0%]
            w-[14%] h-[19%]
            cursor-pointer transition-colors duration-200 z-40" 
         @click="handleElementLvl5Click1"
         :title="$t('click.nine')">
    </div>

    <!-- Level 5 - clickable message from Jack -->
    <div v-if="canShowLvl5Click2" class="absolute top-[6%] right-[28.5%]
            w-[12%] h-[9%]
            cursor-pointer transition-colors duration-200 z-40" 
         @click="handleElementLvl5Click2"
         :title="$t('click.seven')">
    </div>
  </template> 

  <!-- Level 6 Clickable Elements -->
  <template v-if="game.level === 6">
    <!-- Level 6 Clickable area for "See more details" -->
    <div v-if="canClickForDetails" class="absolute top-[25%] right-[43%] w-[9%] h-[2%]
            cursor-pointer px-4 py-2
            cursor-pointer transition-colors duration-200 z-40" 
         @click="handleImageClick"
         title="Click to see more details">
    </div>
  </template>
</template>

<script setup>
import { useGameInfo } from '@/store/gameInfo'
import { useClickableElements } from '@/composables/useClickableElements'

const game = useGameInfo()

// Extract ALL logic to composable
const {
  // Level 1
  canShowElement1,
  canShowElement2,
  canShowElement3,
  handleElement1Click,
  handleElement2Click,
  handleElement3Click,
  
  // Level 2
  canShowLvl2,
  handleElementLvl2Click,
  
  // Level 3
  canShowLvl3Click1,
  canShowLvl3Click3,
  handleElementLvl3Click1,
  handleElementLvl3Click3,
  
  // Level 4
  canShowLvl4Click1,
  canShowLvl4Click2,
  handleElementLvl4Click1,
  handleElementLvl4Click2,
  
  // Level 5
  canShowLvl5Click1,
  canShowLvl5Click2,
  handleElementLvl5Click1,
  handleElementLvl5Click2,
  
  // Level 6
  canClickForDetails,
  handleImageClick,
  
  // Styles
  element2PositionClass
} = useClickableElements()
</script>