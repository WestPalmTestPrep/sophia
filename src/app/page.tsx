'use client';

import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Phase } from '@/types';
import { LandingScreen } from '@/components/landing/LandingScreen';
import { Chessboard } from '@/components/chess/Chessboard';
import { GrainOverlay } from '@/components/ui/GrainOverlay';

export default function Home() {
  const [phase, setPhase] = useState<Phase>('landing');

  return (
    <main className="min-h-screen bg-black text-white">
      <GrainOverlay />
      <AnimatePresence mode="wait">
        {phase === 'landing' ? (
          <LandingScreen key="landing" onComplete={() => setPhase('board')} />
        ) : (
          <Chessboard key="board" />
        )}
      </AnimatePresence>
    </main>
  );
}
