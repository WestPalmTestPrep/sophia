export type SectionId = 'gallery' | 'messages' | 'timeline' | 'achievements' | 'viewfinder' | 'words';

export type Phase = 'landing' | 'board';

export interface Position {
  row: number;
  col: number;
}

export interface BoardSquare {
  row: number;
  col: number;
  section: SectionId;
  label: string;
  icon: string;
}

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  caption?: string;
  year?: number;
}

export interface BirthdayMessage {
  id: string;
  from: string;
  message: string;
  relationship?: string;
}

export interface TimelineEvent {
  id: string;
  year: number;
  title: string;
  description: string;
  category: 'education' | 'career' | 'personal' | 'achievement';
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'photography' | 'fitness' | 'chess' | 'life' | 'fashion';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlocked: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

export interface QuizResult {
  minScore: number;
  maxScore: number;
  title: string;
  description: string;
}

export interface MemoryCard {
  id: string;
  pairId: string;
  content: string;
  label: string;
}
