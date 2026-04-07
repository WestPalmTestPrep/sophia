import { QuizQuestion, QuizResult } from '@/types';

export const quizQuestions: QuizQuestion[] = [
  {
    id: '1',
    question: 'Where did Sophia study photography?',
    options: ['NYU', 'FIT NYC', 'Parsons', 'SVA'],
    correctIndex: 1,
    explanation: 'Sophia studied at the Fashion Institute of Technology in New York City!',
  },
  {
    id: '2',
    question: 'What is Sophia\'s personal tagline?',
    options: ['Born to Create', 'Naturally Unexpected', 'Vision First', 'Frame by Frame'],
    correctIndex: 1,
    explanation: '"Naturally Unexpected" — it defines everything she does.',
  },
  {
    id: '3',
    question: 'Which city did Sophia move to from NYC?',
    options: ['Los Angeles', 'Chicago', 'West Palm Beach', 'Austin'],
    correctIndex: 2,
    explanation: 'She made the bold move to West Palm Beach, Florida!',
  },
  {
    id: '4',
    question: 'What high-end publication did Sophia intern at?',
    options: ['Vanity Fair', 'AS IF Magazine', 'W Magazine', 'Elle'],
    correctIndex: 1,
    explanation: 'AS IF Magazine — a high-end fashion and culture publication in Brooklyn.',
  },
  {
    id: '5',
    question: 'What board game does Sophia love?',
    options: ['Monopoly', 'Scrabble', 'Chess', 'Backgammon'],
    correctIndex: 2,
    explanation: 'Chess! The queen of the board, naturally.',
  },
  {
    id: '6',
    question: 'What is Sophia\'s photography brand called?',
    options: ['Sophia Shots', 'PAV Photography', 'SP Studios', 'Pavlatos Visual'],
    correctIndex: 1,
    explanation: 'PAV Photography — photographer, creative director, fine artist.',
  },
  {
    id: '7',
    question: 'Which magazine interviewed Sophia about Gen Z wedding trends?',
    options: ['Brides', 'Vogue', 'Martha Stewart Weddings', 'Harper\'s Bazaar'],
    correctIndex: 1,
    explanation: 'Vogue! She was featured discussing shifting Gen Z wedding trends.',
  },
  {
    id: '8',
    question: 'What is Sophia\'s Greek surname heritage?',
    options: ['Italian', 'Spanish', 'Greek', 'French'],
    correctIndex: 2,
    explanation: 'The Pavlatos name carries Greek heritage — Greek goddess status!',
  },
  {
    id: '9',
    question: 'What does Sophia say photography is?',
    options: ['A hobby', 'A luxury — hers is an investment', 'Just a job', 'A passion project'],
    correctIndex: 1,
    explanation: '"Most photography is a luxury, mine is an investment."',
  },
  {
    id: '10',
    question: 'What type of weddings does PAV Weddings specialize in?',
    options: ['Rustic barn', 'Fine art editorial', 'Beach casual', 'Traditional'],
    correctIndex: 1,
    explanation: 'Fine art editorial wedding photography — whimsical and emotionally resonant.',
  },
];

export const quizResults: QuizResult[] = [
  { minScore: 0,  maxScore: 3,  title: 'Pawn',   description: 'You\'re just getting to know Sophia. Keep exploring!' },
  { minScore: 4,  maxScore: 5,  title: 'Knight',  description: 'Not bad! You know some moves, but there\'s more to discover.' },
  { minScore: 6,  maxScore: 7,  title: 'Bishop',  description: 'Impressive diagonal thinking! You really know Sophia.' },
  { minScore: 8,  maxScore: 8,  title: 'Rook',    description: 'Straight to the point — you\'re in Sophia\'s inner circle.' },
  { minScore: 9,  maxScore: 10, title: 'Queen',   description: 'You ARE Sophia. Or her best friend. Either way, crown earned.' },
];
