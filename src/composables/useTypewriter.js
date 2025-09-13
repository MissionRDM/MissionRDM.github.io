import { ref } from 'vue'

// This composable implements a typewriter effect for displaying paragraphs
// It types out each paragraph character by character at a specified speed
export function useTypewriter(paragraphs, speed = 35, delayBetween = 500) {
  const displayedParagraphs = ref([])
  const currentLine = ref('')
  const done = ref(false)

  let paragraphIndex = 0
  let charIndex = 0

  // Start typing the next paragraph
  // This function types out the characters of the current paragraph one by one
  // When the paragraph is fully typed, it moves to the next one after a delay
  function typeNextParagraph() {
    if (paragraphIndex >= paragraphs.length) {
      done.value = true
      return
    }

    currentLine.value = ''
    charIndex = 0

    const currentParagraph = paragraphs[paragraphIndex]
    const interval = setInterval(() => {
      currentLine.value += currentParagraph[charIndex]
      charIndex++

      if (charIndex >= currentParagraph.length) {
        clearInterval(interval)
        displayedParagraphs.value.push(currentLine.value)
        currentLine.value = ''
        paragraphIndex++
        setTimeout(typeNextParagraph, delayBetween)
      }
    }, speed)
  }

  return {
    displayedParagraphs,
    currentLine,
    done,
    startTyping: typeNextParagraph
  }
}
