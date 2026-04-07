import { BoardSquare, Position } from '@/types';

export const UNLOCKABLE_SQUARES: BoardSquare[] = [
  { row: 1, col: 1, section: 'gallery',      label: 'The Gallery',       icon: '◐' },
  { row: 1, col: 6, section: 'messages',      label: 'Messages',          icon: '◉' },
  { row: 3, col: 3, section: 'timeline',      label: 'Timeline',          icon: '◈' },
  { row: 3, col: 4, section: 'achievements',  label: 'Achievements',      icon: '◇' },
  { row: 6, col: 1, section: 'viewfinder',    label: 'Through the Lens',  icon: '◎' },
  { row: 6, col: 6, section: 'words',         label: 'Her Words',         icon: '◆' },
];

export const QUEEN_START: Position = { row: 7, col: 4 };
