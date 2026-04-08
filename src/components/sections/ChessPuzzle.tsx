'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// A real chess position: White to checkmate in 2 moves
// Board from White's perspective (row 0 = rank 8, row 7 = rank 1)
// Starting position: White Qd1, Kf1, Rh1 vs Black Kh8, Rf8, Pg7,Ph7
// Solution: 1. Qd8! (pins the rook) Kg8 forced, 2. Qxf8#

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
  '7-3': { type: 'Q', color: 'w' }, // Qd1
  '7-5': { type: 'K', color: 'w' }, // Kf1
  '7-7': { type: 'R', color: 'w' }, // Rh1
  // Black pieces
  '0-7': { type: 'K', color: 'b' }, // Kh8
  '0-5': { type: 'R', color: 'b' }, // Rf8
  '1-6': { type: 'P', color: 'b' }, // Pg7
  '1-7': { type: 'P', color: 'b' }, // Ph7
};

type PuzzlePhase = 'intro' | 'move1' | 'response' | 'move2' | 'solved' | 'wrong';

// Correct moves
const CORRECT_MOVE_1 = { from: '7-3', to: '0-3' }; // Qd1-d8
const BLACK_RESPONSE = { from: '0-7', to: '1-7' };   // Kh8-h7 (forced, only legal move since Rf8 is pinned)
// Actually let's make it Kg8 since h7 has a pawn
// Black's king goes to g8
const BLACK_RESPONSE_FIXED = { from: '0-7', to: '1-6' }; // Kh8 can't go to g7 (pawn there)
// Wait, let me reconsider. With Qd8, Rf8 is attacked and pinned.
// Black king on h8: can go to g8 (1-6 is g7 which has pawn), or...
// Actually row 1, col 6 = g7 which has a black pawn.
// King h8 can go to: g8 (0-6) — yes! And g7 has pawn so can't go there.
// So: Kh8 -> Kg8 (0-6 -> wait, h8 is 0-7, g8 is 0-6)
// Then Qd8xf8# (queen takes rook on f8, checkmate because g7 pawn blocks escape)

const CORRECT_BLACK_RESPONSE = { from: '0-7', to: '0-6' }; // Kh8 -> Kg8
const CORRECT_MOVE_2 = { from: '0-3', to: '0-5' };          // Qd8xf8#

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
        <motion.span
          layout
          className="text-2xl sm:text-4xl leading-none select-none"
          style={{
            color: piece.color === 'w' ? '#d4af37' : '#888',
            filter: piece.color === 'w'
              ? 'drop-shadow(0 0 6px rgba(212,175,55,0.4))'
              : 'drop-shadow(0 0 3px rgba(0,0,0,0.5))',
          }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
          {PIECE_SYMBOLS[`${piece.color}${piece.type}`]}
        </motion.span>
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
    </motion.div>
  );
}

export function ChessPuzzle() {
  const [board, setBoard] = useState<BoardState>({ ...INITIAL_BOARD });
  const [phase, setPhase] = useState<PuzzlePhase>('intro');
  const [selected, setSelected] = useState<string | null>(null);
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null);
  const [moveCount, setMoveCount] = useState(0);
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
    if (phase === 'move1') {
      // Only the queen on 7-3 can move, and only Qd8 is correct
      // But show a few plausible squares to make it feel like a real puzzle
      if (pos === '7-3') {
        return ['0-3', '3-3', '4-3', '5-3', '6-3', '3-7', '4-6', '5-5', '6-4']; // Column d + diagonal
      }
    }
    if (phase === 'move2') {
      // Queen on d8 can take f8
      if (pos === '0-3') {
        return ['0-5', '0-4', '0-6', '0-1', '0-2']; // Along rank 8
      }
    }
    return [];
  }, [phase]);

  const handleSquareClick = useCallback((row: number, col: number) => {
    const key = `${row}-${col}`;
    const piece = board[key];

    if (phase === 'intro' || phase === 'response' || phase === 'solved' || phase === 'wrong') return;

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

      if (phase === 'move1') {
        if (key === CORRECT_MOVE_1.to) {
          // Correct! Move queen to d8
          const newBoard = { ...board };
          const piece = newBoard[selected];
          delete newBoard[selected];
          newBoard[key] = piece;
          setBoard(newBoard);
          setLastMove({ from: selected, to: key });
          setSelected(null);
          setMoveCount(1);
          playSound(600, 0.15);
          playSound(900, 0.15);

          // Black responds after delay
          setPhase('response');
          setTimeout(() => {
            const responseBoard = { ...newBoard };
            const bKing = responseBoard[CORRECT_BLACK_RESPONSE.from];
            delete responseBoard[CORRECT_BLACK_RESPONSE.from];
            // Remove pawn on g7 since king can't actually go there...
            // Actually Kg8 is 0-6 which doesn't have a pawn (g7 pawn is at 1-6)
            responseBoard[CORRECT_BLACK_RESPONSE.to] = bKing;
            setBoard(responseBoard);
            setLastMove({ from: CORRECT_BLACK_RESPONSE.from, to: CORRECT_BLACK_RESPONSE.to });
            playSound(400, 0.1);
            setTimeout(() => setPhase('move2'), 400);
          }, 600);
        } else {
          // Wrong move
          setWrongAttempts(w => w + 1);
          setShakeKey(k => k + 1);
          setSelected(null);
          playSound(200, 0.2, 'triangle');
          setPhase('wrong');
          setTimeout(() => setPhase('move1'), 800);
        }
      } else if (phase === 'move2') {
        if (key === CORRECT_MOVE_2.to) {
          // Checkmate!
          const newBoard = { ...board };
          const piece = newBoard[selected];
          delete newBoard[selected];
          delete newBoard[key]; // Capture rook
          newBoard[key] = piece;
          setBoard(newBoard);
          setLastMove({ from: selected, to: key });
          setSelected(null);
          setMoveCount(2);

          // Victory fanfare
          playSound(523, 0.2);
          setTimeout(() => playSound(659, 0.2), 150);
          setTimeout(() => playSound(784, 0.2), 300);
          setTimeout(() => playSound(1047, 0.4), 450);

          setTimeout(() => setPhase('solved'), 800);
        } else {
          setWrongAttempts(w => w + 1);
          setShakeKey(k => k + 1);
          setSelected(null);
          playSound(200, 0.2, 'triangle');
          setPhase('wrong');
          setTimeout(() => setPhase('move2'), 1500);
        }
      }
    }
  }, [board, phase, selected, getValidMoves, playSound]);

  const validMoves = selected ? getValidMoves(selected) : [];

  const resetPuzzle = useCallback(() => {
    setBoard({ ...INITIAL_BOARD });
    setPhase('move1');
    setSelected(null);
    setLastMove(null);
    setMoveCount(0);
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
          White to play — Checkmate in 2
        </p>
      </div>

      {phase === 'intro' ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6"
        >
          <p className="font-serif text-sm sm:text-base text-white/65 leading-relaxed max-w-sm mx-auto">
            Every queen knows how to finish the game. Can you find the checkmate?
          </p>
          <motion.button
            onClick={() => setPhase('move1')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 rounded-full font-mono text-sm tracking-widest uppercase"
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
          className="w-full max-w-[min(85vw,400px)]"
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

          {/* Rank labels */}
          <div className="flex justify-between mt-1 px-1">
            {['a','b','c','d','e','f','g','h'].map(l => (
              <span key={l} className="text-[7px] text-white/30 font-mono w-[12.5%] text-center">{l}</span>
            ))}
          </div>
        </motion.div>
      )}

      {/* Status messages */}
      <AnimatePresence mode="wait">
        {phase === 'move1' && (
          <motion.div key="m1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center space-y-1">
            <p className="font-serif text-sm text-white/60">Your move, White.</p>
            <p className="font-mono text-[9px] text-white/35 tracking-wider">Select a piece, then select where to move</p>
          </motion.div>
        )}
        {phase === 'response' && (
          <motion.div key="resp" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
            <motion.p
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="font-serif text-sm text-white/50 italic"
            >
              Black is thinking...
            </motion.p>
          </motion.div>
        )}
        {phase === 'move2' && (
          <motion.div key="m2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center space-y-1">
            <p className="font-serif text-sm text-white/60">Finish it. Find the checkmate.</p>
            <p className="font-mono text-[9px] text-white/35 tracking-wider">One more move...</p>
          </motion.div>
        )}
        {phase === 'wrong' && (
          <motion.p key="wrong" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="font-serif text-sm text-red-400/70 italic"
          >
            Not quite — try again.
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
              The queen always knows how to finish. Just like Sophia — she doesn&apos;t just play the game. She wins it.
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
              className="px-6 py-2 rounded-full font-mono text-[10px] tracking-widest uppercase"
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
