import { noop } from 'lodash';
import React from 'react';

type GlobalClockContext = {
  timestamp: number;
  forward: (ms: number) => void;
  // reset: () => void;
};

export const globalClockContext = React.createContext<GlobalClockContext>({
  timestamp: 0,
  forward: noop,
});

export class GlobalClockProvider extends React.Component<
  { children: React.ReactChild },
  GlobalClockContext
> {
  state = {
    timestamp: 0,
    forward: (ms: number) => {
      this.setState((state) => ({ timestamp: state.timestamp + ms }));
    },
  };

  render() {
    return (
      <globalClockContext.Provider value={this.state}>
        {this.props.children}
      </globalClockContext.Provider>
    );
  }
}
