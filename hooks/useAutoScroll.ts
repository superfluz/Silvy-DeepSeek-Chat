'use client';

import { useState, useCallback } from 'react';

/**
 * Custom hook to manage auto-scroll behavior.
 * Detects when the user manually scrolls up and pauses auto-scroll.
 */
export function useAutoScroll() {
  const [isUserScrolling, setIsUserScrolling] = useState(false);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const threshold = 100;
    const isNearBottom =
      el.scrollHeight - el.scrollTop - el.clientHeight < threshold;
    setIsUserScrolling(!isNearBottom);
  }, []);

  return { isUserScrolling, handleScroll };
}
