'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { quizQuestions, quizResults } from '@/data/quiz';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { cn } from '@/lib/utils';

type QuizPhase = 'intro' | 'playing' | 'results';

export function Quiz() {
  const [phase, setPhase] = useState<QuizPhase>('intro');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const { correctSound, wrongSound } = useSoundEffects();

  const currentQuestion = quizQuestions[currentIndex];
  const isCorrect = selectedAnswer === currentQuestion?.correctIndex;

  function handleAnswer(index: number) {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
    if (index === currentQuestion.correctIndex) {
      setScore((s) => s + 1);
      correctSound();
    } else {
      wrongSound();
    }
  }

  function nextQuestion() {
    if (currentIndex < quizQuestions.length - 1) {
      setCurrentIndex((i) => i + 1);
      setSelectedAnswer(null);
    } else {
      setPhase('results');
    }
  }

  function restart() {
    setPhase('intro');
    setCurrentIndex(0);
    setScore(0);
    setSelectedAnswer(null);
  }

  const result = quizResults.find((r) => score >= r.minScore && score <= r.maxScore);

  return (
    <div className="max-w-xl mx-auto">
      <AnimatePresence mode="wait">
        {phase === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center space-y-8 py-12"
          >
            <h3 className="font-serif text-2xl text-white/90 tracking-wider">
              How well do you know Sophia?
            </h3>
            <p className="text-white/40 font-sans text-sm">
              10 questions. Answer wisely.
            </p>
            <button
              onClick={() => setPhase('playing')}
              className="px-8 py-3 border border-white/20 text-white/80 font-sans text-sm tracking-widest uppercase hover:bg-white/5 transition-colors"
            >
              Begin
            </button>
          </motion.div>
        )}

        {phase === 'playing' && currentQuestion && (
          <motion.div
            key={`q-${currentIndex}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6 py-8"
          >
            <p className="text-xs text-white/30 font-sans tracking-widest">
              Move {currentIndex + 1} of {quizQuestions.length}
            </p>

            <h3 className="font-serif text-xl text-white/90">
              {currentQuestion.question}
            </h3>

            <div className="space-y-3">
              {currentQuestion.options.map((option, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(i)}
                  disabled={selectedAnswer !== null}
                  className={cn(
                    'w-full text-left px-5 py-3 border font-sans text-sm transition-all duration-300',
                    selectedAnswer === null
                      ? 'border-white/10 text-white/70 hover:border-white/30 hover:bg-white/5'
                      : i === currentQuestion.correctIndex
                      ? 'border-green-500/50 bg-green-500/10 text-green-400'
                      : selectedAnswer === i
                      ? 'border-red-500/50 bg-red-500/10 text-red-400'
                      : 'border-white/5 text-white/20'
                  )}
                >
                  {option}
                </button>
              ))}
            </div>

            {selectedAnswer !== null && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {currentQuestion.explanation && (
                  <p className="text-sm text-white/50 font-sans italic">
                    {currentQuestion.explanation}
                  </p>
                )}
                <button
                  onClick={nextQuestion}
                  className="px-6 py-2 border border-white/20 text-white/70 font-sans text-sm tracking-wider hover:bg-white/5 transition-colors"
                >
                  {currentIndex < quizQuestions.length - 1 ? 'Next Move' : 'See Results'}
                </button>
              </motion.div>
            )}
          </motion.div>
        )}

        {phase === 'results' && result && (
          <motion.div
            key="results"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6 py-12"
          >
            <p className="text-6xl">{score >= 9 ? '♛' : score >= 6 ? '♝' : '♟'}</p>
            <div>
              <h3 className="font-serif text-3xl text-white/90 tracking-wider">
                {result.title}
              </h3>
              <p className="text-white/60 font-sans text-lg mt-2">
                {score} / {quizQuestions.length}
              </p>
            </div>
            <p className="text-white/40 font-sans text-sm max-w-sm mx-auto">
              {result.description}
            </p>
            <button
              onClick={restart}
              className="px-8 py-3 border border-white/20 text-white/70 font-sans text-sm tracking-widest uppercase hover:bg-white/5 transition-colors"
            >
              Play Again
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
