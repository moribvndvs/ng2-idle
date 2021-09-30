export interface NodeStyleEventEmitter {
  addListener: (eventName: string | symbol, handler: NodeEventHandler) => this;
  removeListener: (eventName: string | symbol, handler: NodeEventHandler) => this;
}
export declare type NodeEventHandler = (...args: any[]) => void;
export interface NodeCompatibleEventEmitter {
  addListener: (eventName: string, handler: NodeEventHandler) => void | {};
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
