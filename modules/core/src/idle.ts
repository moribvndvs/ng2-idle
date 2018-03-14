import {EventEmitter, Injectable, NgZone, OnDestroy, Optional} from '@angular/core';

import {IdleExpiry} from './idleexpiry';
import {Interrupt} from './interrupt';
import {InterruptArgs} from './interruptargs';
import {InterruptSource} from './interruptsource';
import {KeepaliveSvc} from './keepalivesvc';
import {LocalStorageExpiry} from './localstorageexpiry';


/*
 * Indicates the desired auto resume behavior.
 */
export enum AutoResume {
  /*
   * Auto resume functionality will be disabled.
   */
  disabled,
  /*
   * Can resume automatically even if they are idle.
   */
  idle,
  /*
   * Can only resume automatically if they are not yet idle.
   */
  notIdle
}

/**
 * A service for detecting and responding to user idleness.
 */
@Injectable()
export class Idle implements OnDestroy {
  private idle: number = 20 * 60;  // in seconds
  private timeoutVal = 30;         // in seconds
  private autoResume: AutoResume = AutoResume.idle;
  private interrupts: Array<Interrupt> = new Array;
  private running = false;
  private idling: boolean;
  private idleHandle: any;
  private timeoutHandle: any;
  private countdown: number;
  private keepaliveEnabled = false;
  private keepaliveSvc: KeepaliveSvc;

  public onIdleStart: EventEmitter<any> = new EventEmitter;
  public onIdleEnd: EventEmitter<any> = new EventEmitter;
  public onTimeoutWarning: EventEmitter<number> = new EventEmitter<number>();
  public onTimeout: EventEmitter<number> = new EventEmitter<number>();
  public onInterrupt: EventEmitter<any> = new EventEmitter;

  [key: string]: any;

  constructor(private expiry: IdleExpiry, private zone: NgZone, @Optional() keepaliveSvc?: KeepaliveSvc) {
    if (keepaliveSvc) {
      this.keepaliveSvc = keepaliveSvc;
      this.keepaliveEnabled = true;
    }
    this.setIdling(false);
  }

  /*
   * Sets the idle name for localStorage.
   * Important to set if multiple instances of Idle with LocalStorageExpiry
   * @param The name of the idle.
   */
  setIdleName(key: string): void {
    if (this.expiry instanceof LocalStorageExpiry) {
      this.expiry.setIdleName(key);
    } else {
      throw new Error(
        'Cannot set expiry key name because no LocalStorageExpiry has been provided.');
    }
  }

  /*
   * Returns whether or not keepalive integration is enabled.
   * @return True if integration is enabled; otherwise, false.
   */
  getKeepaliveEnabled(): boolean {
    return this.keepaliveEnabled;
  }

  /*
   * Sets and returns whether or not keepalive integration is enabled.
   * @param True if the integration is enabled; otherwise, false.
   * @return The current value.
   */
  setKeepaliveEnabled(value: boolean): boolean {
    if (!this.keepaliveSvc) {
      throw new Error(
        'Cannot enable keepalive integration because no KeepaliveSvc has been provided.');
    }

    return this.keepaliveEnabled = value;
  }

  /*
   * Returns the current timeout value.
   * @return The timeout value in seconds.
   */
  getTimeout(): number {
    return this.timeoutVal;
  }

  /*
   * Sets the timeout value.
   * @param seconds - The timeout value in seconds. 0 or false to disable timeout feature.
   * @return The current value. If disabled, the value will be 0.
   */
  setTimeout(seconds: number|boolean): number {
    if (seconds === false) {
      this.timeoutVal = 0;
    } else if (typeof seconds === 'number' && seconds >= 0) {
      this.timeoutVal = seconds;
    } else {
      throw new Error('\'seconds\' can only be \'false\' or a positive number.');
    }

    return this.timeoutVal;
  }

  /*
   * Returns the current idle value.
   * @return The idle value in seconds.
   */
  getIdle(): number {
    return this.idle;
  }

  /*
   * Sets the idle value.
   * @param seconds - The idle value in seconds.
   * @return The idle value in seconds.
   */
  setIdle(seconds: number): number {
    if (seconds <= 0) {
      throw new Error('\'seconds\' must be greater zero');
    }

    return this.idle = seconds;
  }

  /*
   * Returns the current autoresume value.
   * @return The current value.
   */
  getAutoResume(): AutoResume {
    return this.autoResume;
  }

  setAutoResume(value: AutoResume): AutoResume {
    return this.autoResume = value;
  }

  /*
   * Sets interrupts from the specified sources.
   * @param sources - Interrupt sources.
   * @return The resulting interrupts.
   */
  setInterrupts(sources: Array<InterruptSource>): Array<Interrupt> {
    this.clearInterrupts();

    let self = this;

    for (let source of sources) {
      let sub = new Interrupt(source);
      sub.subscribe((args: InterruptArgs) => {
        self.interrupt(args.force, args.innerArgs);
      });

      this.interrupts.push(sub);
    }

    return this.interrupts;
  }

  /*
   * Returns the current interrupts.
   * @return The current interrupts.
   */
  getInterrupts(): Array<Interrupt> {
    return this.interrupts;
  }

  /*
   * Pauses, unsubscribes, and clears the current interrupt subscriptions.
   */
  clearInterrupts(): void {
    for (let sub of this.interrupts) {
      sub.pause();
      sub.unsubscribe();
    }

    this.interrupts.length = 0;
  }

  /*
   * Returns whether or not the service is running i.e. watching for idleness.
   * @return True if service is watching; otherwise, false.
   */
  isRunning(): boolean {
    return this.running;
  }

  /*
   * Returns whether or not the user is considered idle.
   * @return True if the user is in the idle state; otherwise, false.
   */
  isIdling(): boolean {
    return this.idling;
  }

  /*
   * Starts watching for inactivity.
   */
  watch(skipExpiry?: boolean): void {
    this.safeClearInterval('idleHandle');
    this.safeClearInterval('timeoutHandle');

    let timeout = !this.timeoutVal ? 0 : this.timeoutVal;
    if (!skipExpiry) {
      let value = new Date(this.expiry.now().getTime() + ((this.idle + timeout) * 1000));
      this.expiry.last(value);
    }

    if (this.idling) {
      this.toggleState();
    }
    if (!this.running) {
      this.startKeepalive();
      this.toggleInterrupts(true);
    }

    this.running = true;

    let watchFn = () => {
      this.zone.run(() => {
        let diff = this.getExpiryDiff(timeout);
        if (diff > 0) {
          this.safeClearInterval('idleHandle');
          this.setIdleIntervalOutsideOfZone(watchFn, diff);
        } else {
          this.toggleState();
        }
      });
    };

    this.setIdleIntervalOutsideOfZone(watchFn, this.idle * 1000);
  }

  /*
   * Allows protractor tests to call waitForAngular without hanging
   */
  setIdleIntervalOutsideOfZone(watchFn: () => void, frequency: number): void {
    this.zone.runOutsideAngular(() => {
      this.idleHandle = setInterval(watchFn, frequency);
    });
  }

  /*
   * Stops watching for inactivity.
   */
  stop(): void {
    this.stopKeepalive();

    this.toggleInterrupts(false);

    this.safeClearInterval('idleHandle');
    this.safeClearInterval('timeoutHandle');

    this.setIdling(false);
    this.running = false;

    this.expiry.last(null);
  }

  /*
   * Forces a timeout event and state.
   */
  timeout(): void {
    this.stopKeepalive();

    this.toggleInterrupts(false);

    this.safeClearInterval('idleHandle');
    this.safeClearInterval('timeoutHandle');

    this.setIdling(true);
    this.running = false;
    this.countdown = 0;

    this.onTimeout.emit(null);
  }

  /*
   * Signals that user activity has occurred.
   * @param force - Forces watch to be called, unless they are timed out.
   * @param eventArgs - Optional source event arguments.
   */
  interrupt(force?: boolean, eventArgs?: any): void {
    if (!this.running) {
      return;
    }

    if (this.timeoutVal && this.expiry.isExpired()) {
      this.timeout();
      return;
    }
    this.onInterrupt.emit(eventArgs);

    if (force === true || this.autoResume === AutoResume.idle ||
      (this.autoResume === AutoResume.notIdle && !this.expiry.idling())) {
      this.watch(force);
    }
  }

  private setIdling(value: boolean): void {
    this.idling = value;
    this.expiry.idling(value);
  }

  private toggleState(): void {
    this.setIdling(!this.idling);

    if (this.idling) {
      this.onIdleStart.emit(null);
      this.stopKeepalive();

      if (this.timeoutVal > 0) {
        this.countdown = this.timeoutVal;
        this.doCountdown();
        this.setTimoutIntervalOutsideZone(() => {
          this.doCountdownInZone();
        }, 1000);
      }
    } else {
      this.toggleInterrupts(true);
      this.onIdleEnd.emit(null);
      this.startKeepalive();
    }

    this.safeClearInterval('idleHandle');
  }

  private setTimoutIntervalOutsideZone(intervalFn: () => void, frequency: number) {
    this.zone.runOutsideAngular(() => {
      this.timeoutHandle = setInterval(() => {
        intervalFn();
      }, frequency);
    });
  }

  private toggleInterrupts(resume: boolean): void {
    for (let interrupt of this.interrupts) {
      if (resume) {
        interrupt.resume();
      } else {
        interrupt.pause();
      }
    }
  }

  private getExpiryDiff(timeout: number): number {
    let now: Date = this.expiry.now();
    let last: Date = this.expiry.last() || now;
    return last.getTime() - now.getTime() - (timeout * 1000);
  }

  private doCountdownInZone(): void {
    this.zone.run(() => {
      this.doCountdown();
    });
  }

  private doCountdown(): void {
    let timeout = !this.timeoutVal ? 0 : this.timeoutVal;
    let diff = this.getExpiryDiff(timeout);
    if (diff > 0) {
      this.safeClearInterval('timeoutHandle');
      this.interrupt(true);
      return;
    }

    if (!this.idling) {
      return;
    }

    if (this.countdown <= 0) {
      this.timeout();
      return;
    }

    this.onTimeoutWarning.emit(this.countdown);
    this.countdown--;
  }

  private safeClearInterval(handleName: string): void {
    const handle = this[handleName];
    if (handle !== null && typeof handle !== 'undefined') {
      clearInterval(this[handleName]);
      this[handleName] = null;
    }
  }

  private startKeepalive(): void {
    if (!this.keepaliveSvc || !this.keepaliveEnabled) {
      return;
    }

    if (this.running) {
      this.keepaliveSvc.ping();
    }

    this.keepaliveSvc.start();
  }

  private stopKeepalive(): void {
    if (!this.keepaliveSvc || !this.keepaliveEnabled) {
      return;
    }

    this.keepaliveSvc.stop();
  }

  /*
   * Called by Angular when destroying the instance.
   */
  ngOnDestroy(): void {
    this.stop();
    this.clearInterrupts();
  }
}
