export const gameObjects = {
  // Left computer screens - Data Backup Crisis (Blue theme)
  computer: { 
    position: { top: '11%', left: '0%', width: '14%', height: '24%' }, 
    bgClass: '', 
    hoverClass: 'hover:bg-blue-400/10 hover:border-blue-300/20',
    color: 'blue'
  },
  // Books on top right shelf - Data Cleaning (Green theme)
  books: { 
    position: { top: '2%', right: '7%', width: '13%', height: '7%', transform: 'rotate(-4deg)' }, 
    bgClass: '', 
    hoverClass: 'hover:bg-green-400/10 hover:border-green-300/20',
    color: 'green'
  },
  // File storage/cabinet on bottom left - File Naming (Purple theme)
  cabinet: { 
    position: { bottom: '20%', left: '2%', width: '17%', height: '8%', transform: 'rotate(-8deg)' }, 
    bgClass: '', 
    hoverClass: 'hover:bg-purple-400/10 hover:border-purple-300/20',
    color: 'purple'
  },
  // Central RDM Lifecycle board - Lifecycle Order (Yellow theme)
  lifecycle: { 
    position: { top: '14.5%', left: '30.3%', width: '32%', height: '41%' }, 
    bgClass: '', 
    hoverClass: 'hover:bg-yellow-400/10 hover:border-yellow-300/20',
    color: 'yellow'
  },
  // Coffee cup - Documentation (Red theme)
  coffee: { 
    position: { bottom: '24%', left: '61%', width: '5%', height: '13%' }, 
    bgClass: '', 
    hoverClass: 'hover:bg-red-400/10 hover:border-red-300/20',
    color: 'red'
  },
  // Tablet on right showing Repository Selection (Orange theme)
  tablet: { 
    position: { bottom: '18%', right: '10%', width: '18%', height: '29%', transform: 'rotate(8deg)' }, 
    bgClass: '', 
    hoverClass: 'hover:bg-orange-400/10 hover:border-orange-300/20',
    color: 'orange'
  }
}

export const quizzes = {
  // Computer screens (left) - Backup quiz
  computer: { 
    id: 'computer', 
    title: 'emergencyGame.quizzes.computer.title', 
    question: 'emergencyGame.quizzes.computer.question', 
    options: [
      'emergencyGame.quizzes.computer.options.0',
      'emergencyGame.quizzes.computer.options.1', 
      'emergencyGame.quizzes.computer.options.2',
      'emergencyGame.quizzes.computer.options.3'
    ], 
    correctAnswer: 1, 
    color: 'blue' 
  },
  // Books (top right) - Data cleaning quiz
  books: { 
    id: 'books', 
    title: 'emergencyGame.quizzes.books.title', 
    question: 'emergencyGame.quizzes.books.question', 
    options: [
      'emergencyGame.quizzes.books.options.0', 
      'emergencyGame.quizzes.books.options.1', 
      'emergencyGame.quizzes.books.options.2'
    ], 
    correctAnswer: 1, 
    color: 'green' 
  },
  // File cabinet (bottom left) - File naming quiz
  cabinet: { 
    id: 'cabinet', 
    title: 'emergencyGame.quizzes.cabinet.title', 
    question: 'emergencyGame.quizzes.cabinet.question', 
    options: [
      'emergencyGame.quizzes.cabinet.options.0', 
      'emergencyGame.quizzes.cabinet.options.1', 
      'emergencyGame.quizzes.cabinet.options.2', 
      'emergencyGame.quizzes.cabinet.options.3',
      'emergencyGame.quizzes.cabinet.options.4'
    ], 
    correctAnswer: 2, 
    color: 'purple' 
  },
  // Central RDM board - Lifecycle quiz
  lifecycle: { 
    id: 'lifecycle', 
    title: 'emergencyGame.quizzes.mouse.title', 
    question: 'emergencyGame.quizzes.mouse.question', 
    options: [
      'emergencyGame.quizzes.mouse.options.0', 
      'emergencyGame.quizzes.mouse.options.1', 
      'emergencyGame.quizzes.mouse.options.2', 
      'emergencyGame.quizzes.mouse.options.3'
    ], 
    correctAnswer: 0, 
    color: 'yellow' 
  },
  // Tablet (right) - Repository selection quiz
  tablet: { 
    id: 'tablet', 
    title: 'emergencyGame.quizzes.server.title', 
    question: 'emergencyGame.quizzes.server.question', 
    options: [
      'emergencyGame.quizzes.server.options.0', 
      'emergencyGame.quizzes.server.options.1', 
      'emergencyGame.quizzes.server.options.2', 
      'emergencyGame.quizzes.server.options.3',
      'emergencyGame.quizzes.server.options.4',
      'emergencyGame.quizzes.server.options.5'
    ], 
    correctAnswer: 5, 
    color: 'orange' 
  },
  // Coffee/workspace area - Documentation quiz
  coffee: { 
    id: 'coffee', 
    title: 'emergencyGame.quizzes.phone.title', 
    question: 'emergencyGame.quizzes.phone.question', 
    options: [
      'emergencyGame.quizzes.phone.options.0', 
      'emergencyGame.quizzes.phone.options.1', 
      'emergencyGame.quizzes.phone.options.2', 
      'emergencyGame.quizzes.phone.options.3',
      'emergencyGame.quizzes.phone.options.4'
    ], 
    correctAnswer: 4, 
    color: 'red' 
  }
}
