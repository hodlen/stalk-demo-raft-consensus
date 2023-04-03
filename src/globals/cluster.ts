import { RaftCluster } from '../raft/cluster';
import { useGlobalClock } from './clock';

export const CLUSTER = ((window as any).cluster = new RaftCluster({
  numberOfServers: 5,
  bindTimeSyncCb: (cb) => {
    useGlobalClock.data.registerSyncCb(cb);
  },
}));
