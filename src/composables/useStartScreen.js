import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useGameInfo } from '@/store/gameInfo'
import { useSession } from '@/composables/useSession'

// This composable handles the start screen logic for the game
// It manages the player's name input, session creation, and navigation to the introduction screen
export function useStartScreen() {
  const router = useRouter()
  const game = useGameInfo()
  const { createGameSession } = useSession()
  const playerName = ref('')

  // Load name from localStorage on mount
  onMounted(() => {
    const savedName = localStorage.getItem('playerName')
    if (savedName) {
      playerName.value = savedName
      game.playerName = savedName
    }
    
    // Clear any existing session for fresh start
    localStorage.removeItem('sessionId')
  })

  async function startGame() {
    if (!playerName.value.trim()) {
      return
    }
    
    try {      
      // Create session in Firebase
      await createGameSession(playerName.value.trim())
      
      // Set player name in game store
      game.setPlayerName(playerName.value.trim())
      
      // Navigate to level introduction
      router.push('/introduction')
    } catch (error) {
      console.error('Failed to start game:', error)
    }
  }

  return { playerName, startGame }
}