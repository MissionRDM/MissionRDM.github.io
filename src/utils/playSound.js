export function playSound(soundPath) {
  // Check if the path looks like an imported module (has blob: or http:)
  const isImportedModule = soundPath.startsWith('blob:') || soundPath.startsWith('http:') || soundPath.startsWith('https:') || soundPath.startsWith('data:')
  
  if (!isImportedModule && !soundPath.startsWith('/')) {
    console.error('Audio path should start with / for public files or be an imported module')
    return
  }

  const audio = new Audio(soundPath)
  
  // Optional: Set volume
  audio.volume = 0.5
  
  audio.play().catch(error => {
    console.error('Error playing sound:', error)
  })
}