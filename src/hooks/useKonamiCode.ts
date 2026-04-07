'use client';

import { useEffect, useState, useCallback } from 'react';

const KONAMI_CODE = [
  'ArrowUp', 'ArrowUp',
  'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight',
  'ArrowLeft', 'ArrowRight',
  'b', 'a',
];

export function useKonamiCode() {
  const [triggered, setTriggered] = useState(false);
  const [index, setIndex] = useState(0);

  const reset = useCallback(() => {
    setTriggered(false);
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === KONAMI_CODE[index]) {
        const next = index + 1;
        if (next === KONAMI_CODE.length) {
          setTriggered(true);
          setIndex(0);
          setTimeout(() => setTriggered(false), 4000);
        } else {
          setIndex(next);
        }
      } else {
        setIndex(0);
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [index]);

  return { triggered, reset };
}
