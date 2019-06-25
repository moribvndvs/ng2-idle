export abstract class KeepaliveSvc {
  abstract start(): void;
  abstract stop(): void;
  abstract ping(): void;
}
