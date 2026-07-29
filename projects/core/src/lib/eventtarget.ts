export interface NodeStyleEventEmitter {
  addListener: (eventName: string | symbol, handler: NodeEventHandler) => this;
  removeListener: (eventName: string | symbol, handler: NodeEventHandler) => this;
}
// These types intentionally mirror rxjs's own `fromEvent` typings (any[] / {})
// so that this union stays structurally assignable to its overloads.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export declare type NodeEventHandler = (...args: any[]) => void;
export interface NodeCompatibleEventEmitter {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  addListener: (eventName: string, handler: NodeEventHandler) => void | {};
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  removeListener: (eventName: string, handler: NodeEventHandler) => void | {};
}
export interface JQueryStyleEventEmitter {
  on: (eventName: string, handler: () => void) => void;
  off: (eventName: string, handler: () => void) => void;
}
export interface HasEventTargetAddRemove<E> {
  addEventListener(type: string, listener: ((evt: E) => void) | null, options?: boolean | AddEventListenerOptions): void;
  removeEventListener(type: string, listener?: ((evt: E) => void) | null, options?: EventListenerOptions | boolean): void;
}
export declare type EventTargetLike<T> =
  HasEventTargetAddRemove<T> |
  NodeStyleEventEmitter |
  NodeCompatibleEventEmitter |
  JQueryStyleEventEmitter;
export declare type EventTarget<T> = EventTargetLike<T> | ArrayLike<EventTargetLike<T>>;
