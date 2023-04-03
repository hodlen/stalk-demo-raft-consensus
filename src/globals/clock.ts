import { createModel } from 'hox';
import { useCallback, useEffect, useRef, useState } from 'react';

export type GlobalClock = {
  timestamp: number;
  isPlaying: boolean;
  togglePlayState: () => void;
  registerSyncCb: (cb: (timestamp: number) => void) => void;
};

const useGlobalClockImpl = (): GlobalClock => {
  const [timestamp, setTimestamp] = useState(0);
  const [isPlaying, setPlaying] = useState(true);
  const currentTsRef = useRef<number>(Date.now());
  const syncCbs = useRef<((timestamp: number) => void)[]>([]);

  const registerSyncCb = useCallback((cb: (timestamp: number) => void) => {
    syncCbs.current.push(cb);
  }, []);

  useEffect(() => {
    requestAnimationFrame(() => {
      if (!isPlaying) {
        return;
      }
      const now = Date.now();
      const diff = now - currentTsRef.current;
      currentTsRef.current = now;
      setTimestamp((ts) => ts + diff);
      syncCbs.current.forEach((cb) => cb(timestamp));
    });
  });

  const togglePlayState = useCallback(() => {
    // resetting the currentTsRef to the current time
    currentTsRef.current = Date.now();
    setPlaying((playing) => !playing);
  }, []);

  return {
    timestamp,
    isPlaying,
    togglePlayState,
    registerSyncCb,
  };
};

export const useGlobalClock = createModel(useGlobalClockImpl);
