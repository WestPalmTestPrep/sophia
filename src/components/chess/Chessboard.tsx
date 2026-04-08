'use client';

import { useMemo, useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChessNavigation } from '@/hooks/useChessNavigation';
import { useKonamiCode } from '@/hooks/useKonamiCode';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { UNLOCKABLE_SQUARES } from '@/data/board-config';
import { SectionId } from '@/types';
import { Square } from './Square';
import { QueenPiece } from './QueenPiece';
import { SectionWrapper } from '@/components/ui/SectionWrapper';
import { Confetti } from '@/components/ui/Confetti';
import { CelebrationOverlay } from '@/components/ui/CelebrationOverlay';
import { ParticleField } from '@/components/ui/ParticleField';
import { AuroraBackground } from '@/components/ui/AuroraBackground';
import { MoveLog } from '@/components/ui/MoveLog';
import { BirthdayCountdown } from '@/components/ui/BirthdayCountdown';
import { BoardEffects } from '@/components/ui/BoardEffects';
import { GiftUnwrap } from '@/components/sections/GiftUnwrap';
import { Rewind } from '@/components/sections/Rewind';
import { TarotReading } from '@/components/sections/TarotReading';
import { ChessPuzzle } from '@/components/sections/ChessPuzzle';
import { WishLanterns } from '@/components/sections/WishLanterns';
import { Constellation } from '@/components/sections/Constellation';
import { LoveLetter } from '@/components/sections/LoveLetter';
import { RedCarpet } from '@/components/sections/RedCarpet';

const SECTION_COMPONENTS: Record<SectionId, React.ComponentType> = {
  gallery: GiftUnwrap,
  messages: Rewind,
  timeline: TarotReading,
  achievements: ChessPuzzle,
  viewfinder: WishLanterns,
  words: Constellation,
  moodboard: LoveLetter,
  sophietok: RedCarpet,
};

const SECTION_TITLES: Record<SectionId, string> = {
  gallery: 'Unwrap',
  messages: 'The Rewind',
  timeline: 'The Reading',
  achievements: 'The Puzzle',
  viewfinder: 'Wish Lanterns',
  words: 'The Constellation',
  moodboard: 'The Letter from Nick',
  sophietok: 'Red Carpet',
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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.matchMedia('(pointer: coarse)').matches);
  }, []);

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

  // 3D tilt on mouse move — disabled on touch devices
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isMobile || !boardRef.current) return;
    const rect = boardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const rotateX = ((e.clientY - centerY) / (rect.height / 2)) * -4;
    const rotateY = ((e.clientX - centerX) / (rect.width / 2)) * 4;
    setTilt({ x: rotateX, y: rotateY });
  }, [isMobile]);

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 });
  }, []);

  const unlockableMap = useMemo(() => {
    const map = new Map<string, (typeof UNLOCKABLE_SQUARES)[0]>();
    UNLOCKABLE_SQUARES.forEach((sq) => map.set(`${sq.row}-${sq.col}`, sq));
    return map;
  }, []);

  const ActiveComponent = activeSection ? SECTION_COMPONENTS[activeSection] : null;
  const progress = unlockedSections.size / UNLOCKABLE_SQUARES.length;

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[100dvh] p-2 sm:p-4 pb-20 sm:pb-4">
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

      {/* Progress tracker */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-4 sm:mb-6 flex flex-wrap justify-center gap-2 sm:gap-3 items-center max-w-[90vw]"
      >
        {UNLOCKABLE_SQUARES.map((sq, i) => {
          const found = unlockedSections.has(sq.section);
          return (
            <motion.div
              key={sq.section}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 + i * 0.08, type: 'spring', stiffness: 300 }}
              className="relative flex items-center gap-1.5"
            >
              <div
                className={`w-2 h-2 rounded-full transition-all duration-700 flex-shrink-0 ${
                  found
                    ? 'bg-[#d4af37]'
                    : 'bg-white/15 ring-1 ring-white/10'
                }`}
              />
              <span
                className={`font-mono text-[7px] sm:text-[8px] tracking-wider uppercase transition-all duration-500 hidden sm:inline ${
                  found ? 'text-[rgba(212,175,55,0.6)]' : 'text-white/25'
                }`}
              >
                {sq.label}
              </span>
              {found && (
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
          );
        })}
      </motion.div>

      {/* Board with 3D perspective tilt */}
      <div
        style={{ perspective: '1200px' }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
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
              width: 'min(96vw, 85vh, 720px)',
              height: 'min(96vw, 85vh, 720px)',
              transformStyle: 'preserve-3d',
              boxShadow: `
                0 0 80px rgba(212,175,55,0.03),
                0 40px 80px rgba(0,0,0,0.5),
                0 0 1px rgba(212,175,55,0.1)
              `,
            }}
          >
            {/* Outer border glow — intensifies as more sections unlock */}
            <div
              className="absolute -inset-px pointer-events-none z-10 transition-all duration-1000"
              style={{
                border: `1px solid rgba(212,175,55,${0.06 + progress * 0.2})`,
                boxShadow: progress > 0.5
                  ? `0 0 ${progress * 20}px rgba(212,175,55,${progress * 0.06})`
                  : 'none',
              }}
            />
            <div
              className="absolute -inset-[3px] pointer-events-none transition-all duration-1000"
              style={{
                border: `1px solid rgba(212,175,55,${0.02 + progress * 0.08})`,
              }}
            />

            {/* Board sparkle effects layer */}
            <BoardEffects progress={progress} />

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
              const isValid = isValidQueenMove(row, col);

              return (
                <Square
                  key={key}
                  row={row}
                  col={col}
                  isLight={isLight}
                  unlockConfig={unlockConfig}
                  isValidMove={isValid}
                  isUnlocked={unlockConfig ? unlockedSections.has(unlockConfig.section) : false}
                  onClick={() => moveQueen(row, col)}
                />
              );
            })}

            {/* Queen piece — rendered once, animates position */}
            <QueenPiece row={queenPosition.row} col={queenPosition.col} />
          </motion.div>
      </div>

      {/* File labels */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="flex justify-between mt-2 px-0.5 w-full"
        style={{ maxWidth: 'min(96vw, 85vh, 720px)' }}
      >
        {['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].map((letter) => (
          <span key={letter} className="text-[8px] text-white/40 font-mono w-[12.5%] text-center">
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
              style={{ color: 'rgba(212, 175, 55, 0.85)' }}
            >
              Every square explored
            </motion.p>
          ) : (
            <motion.div
              key="hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center space-y-1"
            >
              <p className="text-[11px] text-white/60 font-sans tracking-[0.2em]">
                Move the queen to the glowing squares
              </p>
              <p className="text-[9px] font-mono tracking-wider" style={{ color: 'rgba(212,175,55,0.5)' }}>
                {unlockedSections.size} / {UNLOCKABLE_SQUARES.length} discovered
              </p>
            </motion.div>
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
