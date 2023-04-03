import { noop } from 'lodash';
import React from 'react';
import { GlobalClock, useGlobalClock } from '../globals/clock';

type GlobalClockContext = GlobalClock;

export const globalClockContext = React.createContext<GlobalClockContext>({
  timestamp: 0,
  isPlaying: true,
  togglePlayState: noop,
  registerSyncCb: noop,
});

export const GlobalClockProvider: React.FunctionComponent<{
  children: React.ReactChild;
}> = ({ children }) => {
  const globalClock = useGlobalClock();
  return (
    <globalClockContext.Provider value={globalClock}>
      {children}
    </globalClockContext.Provider>
  );
};
