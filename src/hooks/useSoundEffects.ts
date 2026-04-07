'use client';

import { useCallback, useRef } from 'react';

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  return new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
}

export function useSoundEffects() {
  const ctxRef = useRef<AudioContext | null>(null);

  const getCtx = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = getAudioContext();
    }
    return ctxRef.current;
  }, []);

  const playTone = useCallback(
    (freq: number, duration: number, volume = 0.08, type: OscillatorType = 'sine') => {
      const ctx = getCtx();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + duration);
    },
    [getCtx]
  );

  const moveSound = useCallback(() => {
    playTone(600, 0.08, 0.05);
    setTimeout(() => playTone(800, 0.06, 0.04), 50);
  }, [playTone]);

  const unlockSound = useCallback(() => {
    playTone(523, 0.15, 0.06);
    setTimeout(() => playTone(659, 0.15, 0.06), 100);
    setTimeout(() => playTone(784, 0.2, 0.07), 200);
  }, [playTone]);

  const correctSound = useCallback(() => {
    playTone(880, 0.12, 0.05);
    setTimeout(() => playTone(1100, 0.15, 0.05), 80);
  }, [playTone]);

  const wrongSound = useCallback(() => {
    playTone(300, 0.15, 0.04, 'triangle');
    setTimeout(() => playTone(250, 0.2, 0.04, 'triangle'), 100);
  }, [playTone]);

  const flipSound = useCallback(() => {
    playTone(1200, 0.05, 0.03);
  }, [playTone]);

  const matchSound = useCallback(() => {
    playTone(700, 0.1, 0.05);
    setTimeout(() => playTone(900, 0.12, 0.05), 80);
  }, [playTone]);

  const celebrationSound = useCallback(() => {
    [523, 659, 784, 1047].forEach((freq, i) => {
      setTimeout(() => playTone(freq, 0.25, 0.06), i * 120);
    });
  }, [playTone]);

  return { moveSound, unlockSound, correctSound, wrongSound, flipSound, matchSound, celebrationSound };
}
