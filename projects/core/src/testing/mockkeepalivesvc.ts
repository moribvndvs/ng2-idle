import { KeepaliveSvc } from '../lib/keepalivesvc';

export class MockKeepaliveSvc extends KeepaliveSvc {
  isRunning = false;

  start(): void {
    this.isRunning = true;
  }

  stop(): void {
    this.isRunning = false;
  }

  ping(): void {
    // do nothing
  }
}
