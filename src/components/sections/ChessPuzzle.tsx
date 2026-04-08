'use client';

import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Smothered Mate — White to play, mate in 1
// Board from White's perspective (row 0 = rank 8, row 7 = rank 1)
// Position: White Nc6, Re1, Kg1 vs Black Kg8, Rf8, Rh8, Pf7, Pg7, Ph7
// Solution: Ne7# (smothered mate — king boxed in by own pieces)

type PieceType = 'K' | 'Q' | 'R' | 'B' | 'N' | 'P';
type PieceColor = 'w' | 'b';

interface Piece {
  type: PieceType;
  color: PieceColor;
}

interface BoardState {
  [key: string]: Piece;
}

const PIECE_SYMBOLS: Record<string, string> = {
  wK: '♔', wQ: '♕', wR: '♖', wB: '♗', wN: '♘', wP: '♙',
  bK: '♚', bQ: '♛', bR: '♜', bB: '♝', bN: '♞', bP: '♟',
};

const INITIAL_BOARD: BoardState = {
  // White pieces
  '2-2': { type: 'N', color: 'w' }, // Nc6
  '7-4': { type: 'R', color: 'w' }, // Re1
  '7-6': { type: 'K', color: 'w' }, // Kg1
  // Black pieces
  '0-6': { type: 'K', color: 'b' }, // Kg8
  '0-5': { type: 'R', color: 'b' }, // Rf8
  '0-7': { type: 'R', color: 'b' }, // Rh8
  '1-5': { type: 'P', color: 'b' }, // Pf7
  '1-6': { type: 'P', color: 'b' }, // Pg7
  '1-7': { type: 'P', color: 'b' }, // Ph7
};

type PuzzlePhase = 'intro' | 'playing' | 'solved' | 'wrong';

// Correct move: Knight from c6 to e7 (smothered mate)
const CORRECT_MOVE = { from: '2-2', to: '1-4' }; // Nc6-e7#

interface PuzzleSquareProps {
  row: number;
  col: number;
  piece: Piece | null;
  isLight: boolean;
  isSelected: boolean;
  isHighlighted: boolean;
  isLastMove: boolean;
  onClick: () => void;
}

function PuzzleSquare({ row, col, piece, isLight, isSelected, isHighlighted, isLastMove, onClick }: PuzzleSquareProps) {
  return (
    <motion.div
      className="relative aspect-square flex items-center justify-center cursor-pointer select-none"
      style={{
        backgroundColor: isSelected
          ? 'rgba(212,175,55,0.35)'
          : isHighlighted
          ? 'rgba(212,175,55,0.15)'
          : isLastMove
          ? 'rgba(212,175,55,0.08)'
          : isLight
          ? '#2a2520'
          : '#15120f',
        transition: 'background-color 0.2s',
      }}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.92 }}
    >
      {piece && (
        <span
          className="text-2xl sm:text-4xl leading-none select-none"
          style={{
            color: piece.color === 'w' ? '#d4af37' : '#888',
            filter: piece.color === 'w'
              ? 'drop-shadow(0 0 6px rgba(212,175,55,0.4))'
              : 'drop-shadow(0 0 3px rgba(0,0,0,0.5))',
          }}
        >
          {PIECE_SYMBOLS[`${piece.color}${piece.type}`]}
        </span>
      )}

      {/* Highlight dot for valid moves */}
      {isHighlighted && !piece && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: 'rgba(212,175,55,0.3)' }}
        />
      )}

      {/* Capture indicator on enemy pieces */}
      {isHighlighted && piece && piece.color === 'b' && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{ border: '3px solid rgba(212,175,55,0.4)' }}
        />
      )}
    </motion.div>
  );
}

export function ChessPuzzle() {
  const [board, setBoard] = useState<BoardState>({ ...INITIAL_BOARD });
  const [phase, setPhase] = useState<PuzzlePhase>('intro');
  const [selected, setSelected] = useState<string | null>(null);
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [shakeKey, setShakeKey] = useState(0);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playSound = useCallback((freq: number, duration: number, type: OscillatorType = 'sine') => {
    try {
      if (!audioCtxRef.current) audioCtxRef.current = new AudioContext();
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = freq;
      osc.type = type;
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + duration);
    } catch {}
  }, []);

  const getValidMoves = useCallback((pos: string): string[] => {
    if (phase !== 'playing') return [];

    // Knight on c6 — show all legal knight moves
    if (pos === '2-2') {
      // L-shaped moves from (2,2): (0,1), (0,3), (1,0), (1,4), (3,0), (3,4), (4,1), (4,3)
      // Filter out squares with white pieces
      return ['0-1', '0-3', '1-0', '1-4', '3-0', '3-4', '4-1', '4-3'];
    }

    // Rook on e1 — show some plausible rook moves along the e-file
    if (pos === '7-4') {
      return ['0-4', '1-4', '2-4', '3-4', '4-4', '5-4', '6-4'];
    }

    // King on g1 — show king moves
    if (pos === '7-6') {
      return ['6-5', '6-6', '6-7', '7-5', '7-7'];
    }

    return [];
  }, [phase]);

  const handleSquareClick = useCallback((row: number, col: number) => {
    const key = `${row}-${col}`;
    const piece = board[key];

    if (phase !== 'playing') return;

    // Select a white piece
    if (piece && piece.color === 'w') {
      const moves = getValidMoves(key);
      if (moves.length > 0) {
        setSelected(key);
        playSound(800, 0.05);
      }
      return;
    }

    // Move to target
    if (selected) {
      const validMoves = getValidMoves(selected);
      if (!validMoves.includes(key)) {
        setSelected(null);
        return;
      }

      if (selected === CORRECT_MOVE.from && key === CORRECT_MOVE.to) {
        // Correct! Ne7# — smothered mate!
        const newBoard = { ...board };
        const movingPiece = newBoard[selected];
        delete newBoard[selected];
        newBoard[key] = movingPiece;
        setBoard(newBoard);
        setLastMove({ from: selected, to: key });
        setSelected(null);

        // Victory fanfare
        playSound(523, 0.2);
        setTimeout(() => playSound(659, 0.2), 150);
        setTimeout(() => playSound(784, 0.2), 300);
        setTimeout(() => playSound(1047, 0.4), 450);

        setTimeout(() => setPhase('solved'), 600);
      } else {
        // Wrong move
        setWrongAttempts(w => w + 1);
        setShakeKey(k => k + 1);
        setSelected(null);
        playSound(200, 0.2, 'triangle');
        setPhase('wrong');
        setTimeout(() => setPhase('playing'), 800);
      }
    }
  }, [board, phase, selected, getValidMoves, playSound]);

  const validMoves = selected ? getValidMoves(selected) : [];

  const resetPuzzle = useCallback(() => {
    setBoard({ ...INITIAL_BOARD });
    setPhase('playing');
    setSelected(null);
    setLastMove(null);
    setWrongAttempts(0);
  }, []);

  return (
    <div className="flex flex-col items-center gap-6 py-4 max-w-lg mx-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="text-3xl"
          style={{ color: '#d4af37', filter: 'drop-shadow(0 0 15px rgba(212,175,55,0.4))' }}
        >
          ♛
        </motion.div>
        <p className="font-mono text-[10px] tracking-[0.3em] uppercase" style={{ color: 'rgba(212,175,55,0.65)' }}>
          White to play — Mate in 1
        </p>
      </div>

      {phase === 'intro' ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6"
        >
          <p className="font-serif text-sm sm:text-base text-white/65 leading-relaxed max-w-sm mx-auto">
            I spent way too long setting this puzzle up. You better actually try it. White to move — find the checkmate.
          </p>
          <motion.button
            onClick={() => setPhase('playing')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 rounded-full font-mono text-sm tracking-widest uppercase min-h-[48px]"
            style={{
              background: 'rgba(212,175,55,0.12)',
              border: '1px solid rgba(212,175,55,0.3)',
              color: '#d4af37',
            }}
          >
            Accept the challenge
          </motion.button>
        </motion.div>
      ) : null}

      {/* Chess board */}
      {phase !== 'intro' && (
        <motion.div
          key={shakeKey}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={phase === 'wrong'
            ? { opacity: 1, scale: 1, x: [0, -8, 8, -6, 6, -3, 3, 0] }
            : { opacity: 1, scale: 1, x: 0 }
          }
          transition={phase === 'wrong'
            ? { x: { duration: 0.5 } }
            : { duration: 0.5, type: 'spring' }
          }
          className="w-full max-w-[min(92vw,400px)]"
        >
          <div
            className="grid grid-cols-8 rounded-lg overflow-hidden"
            style={{
              border: '2px solid rgba(212,175,55,0.2)',
              boxShadow: '0 10px 40px rgba(0,0,0,0.5), 0 0 20px rgba(212,175,55,0.05)',
            }}
          >
            {Array.from({ length: 64 }, (_, i) => {
              const row = Math.floor(i / 8);
              const col = i % 8;
              const key = `${row}-${col}`;
              const isLight = (row + col) % 2 === 0;
              const piece = board[key] || null;

              return (
                <PuzzleSquare
                  key={key}
                  row={row}
                  col={col}
                  piece={piece}
                  isLight={isLight}
                  isSelected={selected === key}
                  isHighlighted={validMoves.includes(key)}
                  isLastMove={lastMove ? (lastMove.from === key || lastMove.to === key) : false}
                  onClick={() => handleSquareClick(row, col)}
                />
              );
            })}
          </div>

          {/* File labels */}
          <div className="flex justify-between mt-1 px-1">
            {['a','b','c','d','e','f','g','h'].map(l => (
              <span key={l} className="text-[7px] text-white/30 font-mono w-[12.5%] text-center">{l}</span>
            ))}
          </div>
        </motion.div>
      )}

      {/* Status messages */}
      <AnimatePresence mode="wait">
        {phase === 'playing' && (
          <motion.div key="playing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center space-y-1">
            <p className="font-serif text-sm text-white/60">Your move, White. One move to end it.</p>
            <p className="font-mono text-[9px] text-white/35 tracking-wider">Select a piece, then select where to move</p>
          </motion.div>
        )}
        {phase === 'wrong' && (
          <motion.p key="wrong" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="font-serif text-sm text-red-400/70 italic"
          >
            Nope. Try again.
          </motion.p>
        )}
        {phase === 'solved' && (
          <motion.div
            key="solved"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-4"
          >
            <motion.p
              className="font-serif text-2xl sm:text-3xl tracking-wider"
              style={{ color: '#d4af37', textShadow: '0 0 30px rgba(212,175,55,0.3)' }}
            >
              Checkmate.
            </motion.p>
            <p className="font-serif text-sm text-white/60 italic max-w-sm leading-relaxed">
              Smothered mate — the king&apos;s own pieces trapped it. Alright fine, you got it. Don&apos;t let it go to your head.
            </p>
            {wrongAttempts > 0 && (
              <p className="font-mono text-[9px] text-white/30 tracking-wider">
                Solved with {wrongAttempts} wrong {wrongAttempts === 1 ? 'attempt' : 'attempts'}
              </p>
            )}
            <motion.button
              onClick={resetPuzzle}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 rounded-full font-mono text-[10px] tracking-widest uppercase min-h-[44px]"
              style={{
                border: '1px solid rgba(212,175,55,0.2)',
                color: 'rgba(212,175,55,0.6)',
              }}
            >
              Play again
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
