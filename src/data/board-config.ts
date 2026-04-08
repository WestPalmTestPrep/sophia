import { BoardSquare, Position } from '@/types';

export const UNLOCKABLE_SQUARES: BoardSquare[] = [
  { row: 1, col: 1, section: 'gallery',      label: 'Unwrap',            icon: '🎁' },
  { row: 1, col: 6, section: 'messages',      label: 'The Rewind',        icon: '◉' },
  { row: 3, col: 3, section: 'timeline',      label: 'The Reading',       icon: '☽' },
  { row: 3, col: 4, section: 'achievements',  label: 'The Puzzle',        icon: '♕' },
  { row: 5, col: 2, section: 'moodboard',     label: 'The Letter',        icon: '✉' },
  { row: 5, col: 5, section: 'sophietok',     label: 'Red Carpet',        icon: '🌟' },
  { row: 6, col: 1, section: 'viewfinder',    label: 'Wish Lanterns',     icon: '🏮' },
  { row: 6, col: 6, section: 'words',         label: 'Constellation',     icon: '⋆' },
];

export const QUEEN_START: Position = { row: 7, col: 4 };
