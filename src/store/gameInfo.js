import { defineStore } from 'pinia'
import { checkUpdateScenarioImage } from '@/logic/level1/gameLogicLvl1.js'

let overlayId = 0

// This store manages the game state, including player progress, hints, and character interactions
// It provides methods to handle game logic such as starting levels, managing hints, and tracking player actions
// The store also handles character calls, overlays, and feedback messages
export const useGameInfo = defineStore('game', {
  state: () => ({
    level: 1,
    progress: [],
    hintsUsed: {},
    playerName: '',
    showHintModal: false,
    hintModalType: 'clues',
    enteredCodes: [],
    patience: false,
    overlayNotes: [],
    activeMessage: null,
    activeRiddle: null,
    riddleSolved: false,
    overlayId: 0,
    overlayId2: 0,
    overlayId3: 0,
    firstHintFound: false,
    secondHintFound: false,
    shouldShowSantiagoHint: false,
    clickedElement: false,
    callableCharacters: {
      Santiago: false,
      Inès: false,
      Jack: false
    },
    // Track call direction for each character
    characterCallTypes: {
      Santiago: 'outgoing', // 'incoming' or 'outgoing'
      Inès: 'outgoing',
      Jack: 'outgoing'
    },
    callSequence: {
      Santiago: 0,
      Inès: 0,
      Jack: 0
    },
    // Track which characters have been called
    calledCharacters: {
      Santiago: false,
      Inès: false,
      Jack: false
    },
    activeCall: null,
    currentScenarioImage: 'default',
    feedback: {
      type: '',
      message: ''
    },
    // Add congratulations modal state
    showCongratsModal: false,
    // Add error overlay state
    errorOverlayVisible: false,
    errorOverlayData: {
      title: '',
      message: '',
      hint: ''
    },
    levelStartTime: null,
    levelCompletionData: null,
  }),
  
  actions: {
    // Initialize player name from local storage
    initializePlayerName() {
      const savedName = localStorage.getItem('playerName')
      if (savedName) {
        this.playerName = savedName
      }
    },
    // Start a new level and reset the game state
    startLevelTimer(level) {
      this.levelStartTime = Date.now()
    },

    setLevelCompletionData(data) {
      this.levelCompletionData = data
    },
    
    setPlayerName(name) {
      this.playerName = name
      localStorage.setItem('playerName', name)
    },
    
    markRiddleAsSolved() {
      this.riddleSolved = true
      if (this.level == 1) {
        checkUpdateScenarioImage()
      }
    },
    // Set a character as callable with a specific call type
    // Call type can be 'incoming' or 'outgoing'
    setCharCallable(charKey, value, callType = 'outgoing') {
      this.callableCharacters[charKey] = value
      this.characterCallTypes[charKey] = callType
      // When setting a character as callable, reset their called status
      if (value) {
        this.calledCharacters[charKey] = false
      }
    },
    
    // Mark character as called
    markCharacterAsCalled(charKey) {
      this.calledCharacters[charKey] = true
      
      // Handle level 4 specific logic
      if (this.level === 4) {
        this.callSequence[charKey]++
        this.handleLevel4CallStatus(charKey)
      }
    },
    
    // Level 4 specific call status handling
    handleLevel4CallStatus(charKey) {
      if (charKey === 'Inès' && this.callSequence['Inès'] === 1 && this.currentScenarioImage === 'second') {
        this.currentScenarioImage = 'third'
        this.setCharCallable('Inès', false, 'incoming')
      }
      
      if (charKey === 'Santiago' && this.callSequence['Santiago'] === 1 && this.currentScenarioImage === 'fifth') {
        this.currentScenarioImage = 'sixth'
        this.setCharCallable('Santiago', false, 'incoming')
        this.shouldShowSantiagoHint = true
      }
    },
    
    // Check if character has been called
    hasCalledCharacter(charKey) {
      return this.calledCharacters[charKey] || false
    },
    
    // Check if there are pending mandatory calls
    hasPendingMandatoryCalls() {
      return Object.keys(this.callableCharacters).some(char => 
        this.callableCharacters[char] && !this.calledCharacters[char]
      )
    },
    
    // Get call type for character
    getCharacterCallType(charKey) {
      return this.characterCallTypes[charKey] || 'outgoing'
    },
    
    // Get the type of pending call
    getPendingCallType() {
      const pendingChar = Object.keys(this.callableCharacters).find(char => 
        this.callableCharacters[char] && !this.calledCharacters[char]
      )
      return pendingChar ? this.characterCallTypes[pendingChar] : 'outgoing'
    },
    // start the call with a character
    startCall(name, avatar, message, titleMiddle = null) {
      this.activeCall = { name, avatar, body: message, titleMiddle }
    },
    // Getter for the level
    getLvl() {
      return this.level
    },
    // end call with a character
    endCall() {
      this.activeCall = null
    },
    
    showHints(type) {
      this.hintModalType = type
      this.showHintModal = true
    },
    
    closeHints() {
      this.showHintModal = false
    },
    
    isCharCallable(charKey) {
      return this.callableCharacters[charKey] || false
    },
    
    markMessageAsRead() {
      this.activeMessage = null
      this.activeRiddle = null
    },
    
    addCode(code) {
      if (!this.enteredCodes.includes(code)) {
        this.enteredCodes.push(code)
      }
    },
    // Show overlay with a note or image (usually images are used for hints)
    showOverlay(note) {
      this.removeOverlay(this.overlayId3)
      this.removeOverlay(this.overlayId2)
      this.removeOverlay(this.overlayId)
      const id = overlayId++
      const fullNote = typeof note === 'string'
        ? { id, type: 'text', text: note }
        : { ...note, id }
      this.overlayNotes.push(fullNote)
      if (this.overlayId !== 0 && this.overlayId2 !== 0) this.overlayId3 = id
      else if (this.overlayId !== 0) this.overlayId2 = id
      else this.overlayId = id
    },
    // Remove overlay by id
    removeOverlay(id) {
      this.overlayNotes = this.overlayNotes.filter(n => n.id !== id)
      if (this.overlayId === id) this.overlayId = 0
      else if (this.overlayId2 === id) this.overlayId2 = 0
      else if (this.overlayId3 === id) this.overlayId3 = 0
    },
    // Show error overlay with title, message, and optional hint
    // This is used to display errors or incorrect inputs
    showErrorOverlay(title, message, hint = '') {
      this.errorOverlayData = {
        title: title || 'Erreur',
        message,
        hint
      }
      this.errorOverlayVisible = true
    },
    // Close the error overlay
    closeErrorOverlay() {
      this.errorOverlayVisible = false
      this.errorOverlayData = {
        title: '',
        message: '',
        hint: ''
      }
    },
    // Set feedback message and type (success, error, etc.)
    setFeedback(type, message) {
      this.feedback.type = type
      this.feedback.message = message
       
      setTimeout(() => {
        this.feedback.type = ''
        this.feedback.message = ''
      }, 2000)
    },
    // Reset the game state after each level
    resetAfterLevel() {
      this.enteredCodes = []
      this.overlayNotes = []
      this.activeMessage = null
      this.activeRiddle = null
      this.riddleSolved = false
      this.firstHintFound = false
      this.secondHintFound = false
      this.patience = false
      this.currentScenarioImage = 'default'
      this.feedback.type = ''
      this.feedback.message = ''
      this.overlayId = 0
      this.overlayId2 = 0
      this.shouldShowSantiagoHint = false
      this.clickedElement = false
      this.showCongratsModal = false
      // Reset error overlay
      this.errorOverlayVisible = false
      this.errorOverlayData = {
        title: '',
        message: '',
        hint: ''
      }
      // Reset callable characters
      this.callableCharacters = {
        Santiago: false,
        Inès: false,
        Jack: false
      }
      this.levelStartTime = null
      this.levelCompletionData = null
      // Reset call types
      this.characterCallTypes = {
        Santiago: 'outgoing',
        Inès: 'outgoing', 
        Jack: 'outgoing'
      }
      // Reset called characters
      this.calledCharacters = {
        Santiago: false,
        Inès: false,
        Jack: false
      }
      this.callSequence = {
        Santiago: 0,
        Inès: 0,
        Jack: 0
      }
    }
  }
})