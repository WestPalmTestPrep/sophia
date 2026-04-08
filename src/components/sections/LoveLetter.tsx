'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LETTER_TEXT = `Sophia,

I'm not gonna lie — I can't believe I built you a whole website. An entire website. With animations and sound effects. This is more effort than I've put into anything in my life and I need you to acknowledge that.

Alright let's get into it. In July you're officially becoming a Stamatakis, which means I'm contractually obligated to talk shit at every family dinner from now until we're old. Consider this my opening statement.

Let's talk about your resume because it's honestly ridiculous. Vogue? VOGUE?? Most people put "proficient in Microsoft Excel" on their LinkedIn and you just casually got quoted in Vogue. "It's almost curated to be so uncurated looking." Meanwhile the rest of us are out here slapping a filter on our food pics. Relax.

Then there's the whole "I'm moving to Florida" saga. NYC to West Palm Beach with no safety net? That's not a career move, that's a bet. And you didn't just land on your feet — you built PAV Photography, PAV Weddings, AND @sophitness_ because apparently running one business is for amateurs. Pick a struggle.

Going from Nassau CC to FIT to interning at AS IF Magazine to running three businesses is legitimately insane. You speedran the whole thing while the rest of us were still trying to figure out what we wanted to do with our lives. Not gonna lie, it's lowkey intimidating.

But real talk for a second — you're one of the most down-to-earth people I know. For someone whose whole brand is luxury fine art photography, you're surprisingly normal. And I mean that as a compliment. None of it went to your head. The kid from Camp Saint-Paul with a camera is still in there, she just has a Vogue feature now.

Anyway. My brother is punching way above his weight class and everybody knows it. Welcome to the family. I'll be the brother-in-law who roasts you at every opportunity but also built you a website with a chess engine in it, so it evens out.

Happy Birthday. Go outside or something. Actually don't — you'd probably photograph a leaf and sell it as fine art.

♛

— Nick (the one who built the website, in case that wasn't obvious)`;

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
          minHeight: 'min(60vh, 500px)',
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
          className="relative p-5 sm:p-10 overflow-y-auto"
          style={{ maxHeight: '70vh' }}
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
                  A letter from your future brother-in-law
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
            ✦ Sealed with chaos ✦
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
