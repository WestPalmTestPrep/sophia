'use client';

import { useMemo, useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { useChessNavigation } from '@/hooks/useChessNavigation';
import { useKonamiCode } from '@/hooks/useKonamiCode';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { UNLOCKABLE_SQUARES } from '@/data/board-config';
import { SectionId } from '@/types';
import { Square } from './Square';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { Confetti } from '@/components/ui/Confetti';
import { CelebrationOverlay } from '@/components/ui/CelebrationOverlay';
import { ParticleField } from '@/components/ui/ParticleField';
import { AuroraBackground } from '@/components/ui/AuroraBackground';
import { MoveLog } from '@/components/ui/MoveLog';
import { BirthdayCountdown } from '@/components/ui/BirthdayCountdown';
import { ScratchCards } from '@/components/sections/ScratchCards';
import { PavWrapped } from '@/components/sections/PavWrapped';
import { SpinWheel } from '@/components/sections/SpinWheel';
import { Achievements } from '@/components/sections/Achievements';
import { Viewfinder } from '@/components/sections/Viewfinder';
import { HerWords } from '@/components/sections/HerWords';
import { MoodBoard } from '@/components/sections/MoodBoard';
import { SophieTok } from '@/components/sections/SophieTok';

const SECTION_COMPONENTS: Record<SectionId, React.ComponentType> = {
  gallery: ScratchCards,
  messages: PavWrapped,
  timeline: SpinWheel,
  achievements: Achievements,
  viewfinder: Viewfinder,
  words: HerWords,
  moodboard: MoodBoard,
  sophietok: SophieTok,
};

const SECTION_TITLES: Record<SectionId, string> = {
  gallery: 'Golden Tickets',
  messages: 'PAV Wrapped',
  timeline: 'Spin the Wheel',
  achievements: 'Unlocked',
  viewfinder: 'Through the Lens',
  words: 'Her Words',
  moodboard: 'Mood Board',
  sophietok: 'SophieTok',
};

export function Chessboard() {
  const {
    queenPosition,
    activeSection,
    unlockedSections,
    allUnlocked,
    moveHistory,
    moveQueen,
    closeSection,
    isValidQueenMove,
  } = useChessNavigation();

  const { triggered: konamiTriggered } = useKonamiCode();
  const { moveSound, unlockSound, celebrationSound } = useSoundEffects();
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationShown, setCelebrationShown] = useState(false);
  const prevQueenPos = useRef(queenPosition);
  const prevSection = useRef(activeSection);
  const boardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (prevQueenPos.current.row !== queenPosition.row || prevQueenPos.current.col !== queenPosition.col) {
      moveSound();
      prevQueenPos.current = queenPosition;
    }
  }, [queenPosition, moveSound]);

  useEffect(() => {
    if (activeSection && activeSection !== prevSection.current) {
      unlockSound();
    }
    prevSection.current = activeSection;
  }, [activeSection, unlockSound]);

  useEffect(() => {
    if (allUnlocked && !celebrationShown) {
      setCelebrationShown(true);
      setTimeout(() => {
        setShowCelebration(true);
        celebrationSound();
      }, 600);
    }
  }, [allUnlocked, celebrationShown, celebrationSound]);

  // 3D tilt on mouse move
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!boardRef.current) return;
    const rect = boardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const rotateX = ((e.clientY - centerY) / (rect.height / 2)) * -4;
    const rotateY = ((e.clientX - centerX) / (rect.width / 2)) * 4;
    setTilt({ x: rotateX, y: rotateY });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 });
  }, []);

  const unlockableMap = useMemo(() => {
    const map = new Map<string, (typeof UNLOCKABLE_SQUARES)[0]>();
    UNLOCKABLE_SQUARES.forEach((sq) => map.set(`${sq.row}-${sq.col}`, sq));
    return map;
  }, []);

  const ActiveComponent = activeSection ? SECTION_COMPONENTS[activeSection] : null;

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen p-4">
      <AuroraBackground />
      <ParticleField />
      <Confetti active={konamiTriggered} />
      <Confetti active={showCelebration} />

      <AnimatePresence>
        {showCelebration && (
          <CelebrationOverlay onDismiss={() => setShowCelebration(false)} />
        )}
      </AnimatePresence>

      <MoveLog moves={moveHistory} />
      <BirthdayCountdown />

      {/* Progress dots with gold glow */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-6 flex gap-3 items-center"
      >
        {UNLOCKABLE_SQUARES.map((sq, i) => (
          <motion.div
            key={sq.section}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5 + i * 0.08, type: 'spring', stiffness: 300 }}
            className="relative"
          >
            <div
              className={`w-2 h-2 rounded-full transition-all duration-700 ${
                unlockedSections.has(sq.section)
                  ? 'bg-[#d4af37]'
                  : 'bg-white/10'
              }`}
            />
            {unlockedSections.has(sq.section) && (
              <div
                className="absolute inset-0 rounded-full animate-ping"
                style={{
                  backgroundColor: 'rgba(212,175,55,0.3)',
                  animationDuration: '2s',
                  animationIterationCount: '1',
                }}
              />
            )}
          </motion.div>
        ))}
      </motion.div>

      {/* Board with 3D perspective tilt */}
      <div
        style={{ perspective: '1200px' }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <LayoutGroup>
          <motion.div
            ref={boardRef}
            initial={{ opacity: 0, scale: 0.85, rotateX: 15 }}
            animate={{
              opacity: 1,
              scale: 1,
              rotateX: tilt.x,
              rotateY: tilt.y,
            }}
            transition={{
              opacity: { duration: 0.8 },
              scale: { duration: 1, ease: [0.22, 1, 0.36, 1] },
              rotateX: { type: 'spring', stiffness: 100, damping: 30 },
              rotateY: { type: 'spring', stiffness: 100, damping: 30 },
            }}
            className="relative grid grid-cols-8 overflow-visible"
            style={{
              width: 'min(90vw, 85vh, 720px)',
              height: 'min(90vw, 85vh, 720px)',
              transformStyle: 'preserve-3d',
              boxShadow: `
                0 0 80px rgba(212,175,55,0.03),
                0 40px 80px rgba(0,0,0,0.5),
                0 0 1px rgba(212,175,55,0.1)
              `,
            }}
          >
            {/* Outer border glow - gold tinted */}
            <div
              className="absolute -inset-px pointer-events-none z-10"
              style={{
                border: '1px solid rgba(212,175,55,0.08)',
              }}
            />
            <div
              className="absolute -inset-[3px] pointer-events-none"
              style={{
                border: '1px solid rgba(212,175,55,0.03)',
              }}
            />

            {/* Reflection effect under the board */}
            <div
              className="absolute left-[5%] right-[5%] -bottom-[2px] h-[40%] pointer-events-none"
              style={{
                background: 'linear-gradient(to bottom, rgba(212,175,55,0.02), transparent)',
                filter: 'blur(20px)',
                transform: 'translateZ(-1px)',
              }}
            />

            {Array.from({ length: 64 }, (_, i) => {
              const row = Math.floor(i / 8);
              const col = i % 8;
              const isLight = (row + col) % 2 === 0;
              const key = `${row}-${col}`;
              const unlockConfig = unlockableMap.get(key);
              const hasQueen = queenPosition.row === row && queenPosition.col === col;
              const isValid = isValidQueenMove(row, col);

              return (
                <Square
                  key={key}
                  row={row}
                  col={col}
                  isLight={isLight}
                  unlockConfig={unlockConfig}
                  hasQueen={hasQueen}
                  isValidMove={isValid}
                  isUnlocked={unlockConfig ? unlockedSections.has(unlockConfig.section) : false}
                  onClick={() => isValid && moveQueen(row, col)}
                />
              );
            })}
          </motion.div>
        </LayoutGroup>
      </div>

      {/* File labels */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="flex justify-between mt-2 px-0.5 w-full"
        style={{ maxWidth: 'min(90vw, 85vh, 720px)' }}
      >
        {['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].map((letter) => (
          <span key={letter} className="text-[8px] text-white/20 font-mono w-[12.5%] text-center">
            {letter}
          </span>
        ))}
      </motion.div>

      {/* Status */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-6"
      >
        <AnimatePresence mode="wait">
          {allUnlocked ? (
            <motion.p
              key="complete"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[11px] font-serif tracking-[0.3em]"
              style={{ color: 'rgba(212, 175, 55, 0.6)' }}
            >
              Every square explored
            </motion.p>
          ) : (
            <motion.p
              key="hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[11px] text-white/40 font-sans tracking-[0.2em]"
            >
              Move the queen to explore
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Section overlay */}
      <AnimatePresence>
        {activeSection && ActiveComponent && (
          <SectionWrapper
            key={activeSection}
            title={SECTION_TITLES[activeSection]}
            onClose={closeSection}
          >
            <ActiveComponent />
          </SectionWrapper>
        )}
      </AnimatePresence>
    </div>
  );
}
