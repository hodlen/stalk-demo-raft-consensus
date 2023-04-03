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

  return {
    timestamp,
    isPlaying,
    togglePlayState: () => setPlaying((playing) => !playing),
    registerSyncCb,
  };
};

export const useGlobalClock = createModel(useGlobalClockImpl);
