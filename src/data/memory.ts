import { MemoryCard } from '@/types';

const pairs = [
  { pairId: '1', content: '📸', label: 'Camera' },
  { pairId: '2', content: '♛',  label: 'Queen' },
  { pairId: '3', content: '🗽', label: 'NYC' },
  { pairId: '4', content: '🌴', label: 'Palm Beach' },
  { pairId: '5', content: '💪', label: 'Fitness' },
  { pairId: '6', content: '🏛', label: 'Greece' },
  { pairId: '7', content: '✨', label: 'Naturally Unexpected' },
  { pairId: '8', content: '👑', label: 'Vogue' },
];

export const memoryCards: MemoryCard[] = pairs.flatMap((pair) => [
  { id: `${pair.pairId}a`, ...pair },
  { id: `${pair.pairId}b`, ...pair },
]);
