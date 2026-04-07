'use client';

import { useMemo, useState, useEffect, useRef } from 'react';
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
import { MoveLog } from '@/components/ui/MoveLog';
import { BirthdayCountdown } from '@/components/ui/BirthdayCountdown';
import { Gallery } from '@/components/sections/Gallery';
import { BirthdayMessages } from '@/components/sections/BirthdayMessages';
import { Timeline } from '@/components/sections/Timeline';
import { Achievements } from '@/components/sections/Achievements';
import { Viewfinder } from '@/components/sections/Viewfinder';
import { HerWords } from '@/components/sections/HerWords';

const SECTION_COMPONENTS: Record<SectionId, React.ComponentType> = {
  gallery: Gallery,
  messages: BirthdayMessages,
  timeline: Timeline,
  achievements: Achievements,
  viewfinder: Viewfinder,
  words: HerWords,
};

const SECTION_TITLES: Record<SectionId, string> = {
  gallery: 'The Gallery',
  messages: 'Messages',
  timeline: 'The Timeline',
  achievements: 'Unlocked',
  viewfinder: 'Through the Lens',
  words: 'Her Words',
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

  const unlockableMap = useMemo(() => {
    const map = new Map<string, (typeof UNLOCKABLE_SQUARES)[0]>();
    UNLOCKABLE_SQUARES.forEach((sq) => map.set(`${sq.row}-${sq.col}`, sq));
    return map;
  }, []);

  const ActiveComponent = activeSection ? SECTION_COMPONENTS[activeSection] : null;

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen p-4">
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

      {/* Progress */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-4 flex gap-2 items-center"
      >
        {UNLOCKABLE_SQUARES.map((sq, i) => (
          <motion.div
            key={sq.section}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5 + i * 0.08 }}
            className={`w-2 h-2 rounded-full transition-all duration-700 ${
              unlockedSections.has(sq.section)
                ? 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.6)]'
                : 'bg-white/10'
            }`}
            title={sq.label}
          />
        ))}
      </motion.div>

      {/* Board */}
      <LayoutGroup>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative grid grid-cols-8 shadow-[0_0_80px_rgba(255,255,255,0.02)]"
          style={{ width: 'min(90vw, 90vh, 560px)', height: 'min(90vw, 90vh, 560px)' }}
        >
          {/* Outer border glow */}
          <div className="absolute -inset-px border border-white/[0.06] pointer-events-none z-10" />
          <div className="absolute -inset-[3px] border border-white/[0.02] pointer-events-none" />

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

      {/* File labels */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="flex justify-between mt-1.5 px-0.5 w-full"
        style={{ maxWidth: 'min(90vw, 90vh, 560px)' }}
      >
        {['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].map((letter) => (
          <span key={letter} className="text-[7px] text-white/[0.07] font-mono w-[12.5%] text-center">
            {letter}
          </span>
        ))}
      </motion.div>

      {/* Status */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-5"
      >
        <AnimatePresence mode="wait">
          {allUnlocked ? (
            <motion.p
              key="complete"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[11px] font-serif text-white/40 tracking-[0.3em]"
            >
              Every square explored
            </motion.p>
          ) : (
            <motion.p
              key="hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[10px] text-white/15 font-sans tracking-[0.2em]"
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
