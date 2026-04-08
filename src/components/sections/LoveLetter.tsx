'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LETTER_TEXT = `Dear Sophia,

I've been trying to figure out how to say this for a while now.

I could list your accomplishments — the Vogue feature, the three brands, the move to Florida that everyone doubted. I could talk about how you turned a camera into a career and a career into an empire.

But that's not what I want to say.

What I want to say is this: you make the people around you feel like anything is possible. Not because you say it, but because you live it. Every day. Without asking for permission.

You left New York when everyone said stay. You started PAV when the market said wait. You launched @sophitness_ because you don't do one thing — you do everything.

And somehow, through all of it, you stayed you. The girl from Camp Saint-Paul who just wanted to capture the world. Except now the world is paying attention.

So here's to another year of being naturally unexpected. Another year of proving them wrong. Another year of golden hours and bold moves and chess games where you're always the queen.

Happy Birthday, Sophia.

The board is yours.

♛`;

const TYPING_SPEED = 35;
const PAUSE_AFTER_PERIOD = 400;
const PAUSE_AFTER_COMMA = 150;
const PAUSE_AFTER_NEWLINE = 300;
const PAUSE_AFTER_DOUBLE_NEWLINE = 600;

export function LoveLetter() {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [started, setStarted] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);
  const [complete, setComplete] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef(0);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Cursor blink
  useEffect(() => {
    const interval = setInterval(() => setCursorVisible((v) => !v), 530);
    return () => clearInterval(interval);
  }, []);

  // Typewriter sound
  const playKeystroke = useCallback(() => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContext();
      }
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      // Randomize for organic feel
      osc.frequency.value = 800 + Math.random() * 600;
      osc.type = 'sine';
      gain.gain.setValueAtTime(0.015, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.05);
    } catch {
      // Audio not available
    }
  }, []);

  const startTyping = useCallback(() => {
    if (started) return;
    setStarted(true);
    setIsTyping(true);
  }, [started]);

  // Skip to end
  const skipToEnd = useCallback(() => {
    if (complete) return;
    setDisplayedText(LETTER_TEXT);
    setIsTyping(false);
    setComplete(true);
    indexRef.current = LETTER_TEXT.length;
  }, [complete]);

  // Typing effect
  useEffect(() => {
    if (!isTyping) return;

    const typeNext = () => {
      if (indexRef.current >= LETTER_TEXT.length) {
        setIsTyping(false);
        setComplete(true);
        return;
      }

      const char = LETTER_TEXT[indexRef.current];
      const nextChar = LETTER_TEXT[indexRef.current + 1];
      indexRef.current++;

      setDisplayedText(LETTER_TEXT.slice(0, indexRef.current));

      if (char !== '\n' && char !== ' ') {
        playKeystroke();
      }

      // Auto-scroll
      if (containerRef.current) {
        const el = containerRef.current;
        el.scrollTop = el.scrollHeight;
      }

      // Determine delay for next character
      let delay = TYPING_SPEED + Math.random() * 20 - 10;

      if (char === '.' || char === '!' || char === '?') {
        delay = PAUSE_AFTER_PERIOD;
      } else if (char === ',') {
        delay = PAUSE_AFTER_COMMA;
      } else if (char === '\n' && nextChar === '\n') {
        delay = PAUSE_AFTER_DOUBLE_NEWLINE;
      } else if (char === '\n') {
        delay = PAUSE_AFTER_NEWLINE;
      } else if (char === '—') {
        delay = 200;
      }

      setTimeout(typeNext, delay);
    };

    const startDelay = setTimeout(typeNext, 300);
    return () => clearTimeout(startDelay);
  }, [isTyping, playKeystroke]);

  return (
    <div className="flex flex-col items-center gap-6 py-4 max-w-2xl mx-auto">
      {/* Paper */}
      <motion.div
        initial={{ opacity: 0, y: 20, rotateX: 5 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 0.8 }}
        className="relative w-full rounded-sm overflow-hidden"
        style={{
          background:
            'linear-gradient(180deg, #1a1816 0%, #141210 50%, #100e0c 100%)',
          border: '1px solid rgba(212,175,55,0.15)',
          boxShadow:
            '0 20px 60px rgba(0,0,0,0.5), 0 0 1px rgba(212,175,55,0.1), inset 0 0 80px rgba(0,0,0,0.3)',
          minHeight: '60vh',
        }}
      >
        {/* Paper texture overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='0.8' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
            backgroundSize: '200px 200px',
          }}
        />

        {/* Fold line */}
        <div
          className="absolute left-0 right-0 top-1/3 h-px pointer-events-none"
          style={{
            background:
              'linear-gradient(90deg, transparent, rgba(212,175,55,0.06), transparent)',
          }}
        />

        {/* Content area */}
        <div
          ref={containerRef}
          className="relative p-6 sm:p-10 overflow-y-auto"
          style={{ maxHeight: '65vh' }}
        >
          {!started ? (
            <motion.div
              className="flex flex-col items-center justify-center py-20 gap-6 cursor-pointer"
              onClick={startTyping}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Wax seal */}
              <motion.div
                animate={{
                  boxShadow: [
                    '0 0 20px rgba(212,175,55,0.2)',
                    '0 0 40px rgba(212,175,55,0.3)',
                    '0 0 20px rgba(212,175,55,0.2)',
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{
                  background:
                    'radial-gradient(circle, #c9a82c 0%, #8a6914 60%, #6b5210 100%)',
                  border: '2px solid rgba(212,175,55,0.5)',
                }}
              >
                <span
                  className="text-3xl"
                  style={{
                    filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))',
                    color: '#1a1408',
                  }}
                >
                  ♛
                </span>
              </motion.div>

              <div className="text-center space-y-2">
                <p
                  className="font-serif text-lg tracking-wider italic"
                  style={{ color: 'rgba(212,175,55,0.7)' }}
                >
                  A letter for Sophia
                </p>
                <motion.p
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="font-mono text-[9px] tracking-[0.4em] uppercase text-white/50"
                >
                  Tap the seal to open
                </motion.p>
              </div>
            </motion.div>
          ) : (
            <div className="relative" onClick={!complete ? skipToEnd : undefined}>
              <pre
                className="font-serif text-sm sm:text-base leading-relaxed tracking-wide whitespace-pre-wrap"
                style={{ color: 'rgba(212,175,55,0.8)' }}
              >
                {displayedText}
                {!complete && (
                  <span
                    className="inline-block w-[2px] h-[1.1em] align-middle ml-0.5"
                    style={{
                      backgroundColor: cursorVisible
                        ? 'rgba(212,175,55,0.8)'
                        : 'transparent',
                      transition: 'background-color 0.1s',
                    }}
                  />
                )}
              </pre>

              {/* Skip hint */}
              {isTyping && !complete && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 5 }}
                  className="text-center mt-6 font-mono text-[9px] text-white/30 tracking-widest uppercase cursor-pointer"
                >
                  Tap to skip ahead
                </motion.p>
              )}
            </div>
          )}
        </div>

        {/* Bottom edge shadow */}
        <div
          className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
          style={{
            background: 'linear-gradient(to top, #100e0c, transparent)',
          }}
        />
      </motion.div>

      {/* Completion */}
      <AnimatePresence>
        {complete && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="font-mono text-[9px] text-white/40 tracking-widest uppercase"
          >
            ✦ Sealed with love ✦
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
