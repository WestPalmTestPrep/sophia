import { BoardSquare, Position } from '@/types';

export const UNLOCKABLE_SQUARES: BoardSquare[] = [
  { row: 1, col: 1, section: 'gallery',      label: 'Golden Tickets',    icon: '✦' },
  { row: 1, col: 6, section: 'messages',      label: 'The Rewind',        icon: '◉' },
  { row: 3, col: 3, section: 'timeline',      label: 'The Reading',       icon: '☽' },
  { row: 3, col: 4, section: 'achievements',  label: 'The Awards',        icon: '♕' },
  { row: 5, col: 2, section: 'moodboard',     label: 'The Letter',        icon: '✉' },
  { row: 5, col: 5, section: 'sophietok',     label: 'The Collection',    icon: '◮' },
  { row: 6, col: 1, section: 'viewfinder',    label: 'Through the Lens',  icon: '◎' },
  { row: 6, col: 6, section: 'words',         label: 'Constellation',     icon: '⋆' },
];

export const QUEEN_START: Position = { row: 7, col: 4 };
