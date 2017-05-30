import { fakeAsync, inject, TestBed, tick } from '@angular/core/testing';

import { MockExpiry } from '../testing/mockexpiry';
import { MockInterruptSource } from '../testing/mockinterruptsource';
import { MockKeepaliveSvc } from '../testing/mockkeepalivesvc';

import { AutoResume, Idle } from './idle';
import { LocalStorageExpiry } from './localstorageexpiry';
import { LocalStorage } from './localstorage';
import { IdleExpiry } from './idleexpiry';
import { KeepaliveSvc } from './keepalivesvc';

describe('core/Idle', () => {

  describe('with LocalStorageExpiry', () => {

    beforeEach(() => {
      TestBed.configureTestingModule(
        { providers: [LocalStorageExpiry, LocalStorage, { provide: IdleExpiry, useExisting: LocalStorageExpiry }, Idle] });
    });

    it('setIdleName() should set idle name', inject([Idle, LocalStorageExpiry], (idle: Idle, exp: LocalStorageExpiry) => {
      idle.setIdleName('demo');
      expect((exp as LocalStorageExpiry).getIdleName()).toBe('demo');
    }));
  });

  describe('without KeepaliveSvc integration', () => {
    beforeEach(() => {
      TestBed.configureTestingModule(
        { providers: [MockExpiry, { provide: IdleExpiry, useExisting: MockExpiry }, Idle] });
    });

    let instance: Idle;
    let expiry: MockExpiry;

    beforeEach(inject([Idle, MockExpiry], (idle: Idle, exp: MockExpiry) => {
      instance = idle;
      expiry = exp;
    }));

    describe('runtime config', () => {
      it('getKeepaliveEnabled() should be false', () => {
        expect(instance.getKeepaliveEnabled()).toBe(false);
      });

      it('setKeepaliveEnabled() should throw', () => {
        expect(() => {
          instance.setKeepaliveEnabled(true);
        })
          .toThrowError(
          'Cannot enable keepalive integration because no KeepaliveSvc has been provided.');
      });

      it('getIdle() should return current value', () => {
        expect(instance.getIdle()).toEqual(20 * 60);
      });

      it('setIdle() should set and return the current value', () => {
        let expected = 500;
        let actual = instance.setIdle(expected);

        expect(actual).toEqual(expected);
      });

      it('setIdleName() when expiry is not instance of LocalStorageExpiry should throw error', () => {
        expect(() => {
          instance.setIdleName('demo');
        })
          .toThrowError(
          'Cannot set expiry key name because no LocalStorageExpiry has been provided.');
      });

      it('setIdle() should throw if argument is less than or equal to zero', () => {
        let expected = new Error('\'seconds\' must be greater zero');

        expect(() => {
          instance.setIdle(0);
        }).toThrow(expected);

        expect(() => {
          instance.setIdle(-1);
        }).toThrow(expected);
      });

      it('getTimeout() should return current value', () => {
        expect(instance.getTimeout()).toEqual(30);
      });

      it('setTimeout() should set and return the current value', () => {
        let expected = 10 * 60;
        let actual = instance.setTimeout(expected);

        expect(actual).toEqual(expected);
      });

      it('setTimeout() should set timeout to 0 if false is specified', () => {
        let expected = 0;
        let actual = instance.setTimeout(false);

        expect(actual).toEqual(expected);
      });

      it('setTimeout() should throw if argument is less than zero', () => {
        expect(() => {
          instance.setTimeout(-1);
        }).toThrow(new Error('\'seconds\' can only be \'false\' or a positive number.'));
      });

      it('setTimeout() should throw if argument \'true\'', () => {
        expect(() => {
          instance.setTimeout(true);
        }).toThrow(new Error('\'seconds\' can only be \'false\' or a positive number.'));
      });

      it('getAutoResume() should return current value', () => {
        expect(instance.getAutoResume()).toEqual(AutoResume.idle);
      });

      it('setAutoResume() should set and return current value', () => {
        let expected = AutoResume.disabled;
        let actual = instance.setAutoResume(expected);

        expect(actual).toEqual(expected);
      });

      it('setInterrupts() should create interrupt subscriptions', () => {
        let source = new MockInterruptSource;
        spyOn(source.onInterrupt, 'subscribe').and.callThrough();
        spyOn(source, 'attach').and.callThrough();

        let subs = instance.setInterrupts([source]);

        expect(subs.length).toBe(1);

        let actual = subs[0];
        expect(actual.source).toBe(source);
        expect(source.onInterrupt.subscribe).toHaveBeenCalled();
        expect(source.attach).not.toHaveBeenCalled();
      });

      it('getInterrupts() should return current subscriptions', () => {
        let source = new MockInterruptSource;
        instance.setInterrupts([source]);

        let subs = instance.getInterrupts();
        expect(subs.length).toBe(1);

        let actual = subs[0];
        expect(actual.source).toBe(source);
      });

      it('clearInterrupts() should unsubscribe and clear all subscriptions', () => {
        let source = new MockInterruptSource;
        spyOn(source, 'detach').and.callThrough();

        instance.setInterrupts([source]);

        instance.clearInterrupts();

        expect(instance.getInterrupts().length).toBe(0);
        expect(source.detach).toHaveBeenCalled();
      });
    });

    describe('watching', () => {
      beforeEach(() => {
        instance.setIdle(3);
      });

      it('stop() should clear timeouts and stop running', fakeAsync(() => {
        spyOn(window, 'clearInterval').and.callThrough();

        instance.watch();
        instance.stop();

        expect(instance.isRunning()).toBe(false);
        expect(window.clearInterval).toHaveBeenCalledTimes(1);
      }));

      it('stop() should clear last expiry', () => {
        instance.watch();
        expect(expiry.last()).not.toBeNull();
        instance.stop();
        expect(expiry.last()).toBeNull();
      });

      it('watch() should clear timeouts and start running', fakeAsync(() => {
        spyOn(window, 'setInterval').and.callThrough();

        instance.watch();

        expect(instance.isRunning()).toBe(true);
        expect(window.setInterval).toHaveBeenCalledTimes(1);

        instance.stop();
      }));

      it('watch() should set expiry', () => {
        let now = new Date();
        expiry.mockNow = now;
        instance.watch();
        expect(expiry.last())
          .toEqual(
          new Date(now.getTime() + ((instance.getIdle() + instance.getTimeout()) * 1000)));
        instance.stop();
      });

      it('watch() should attach all interrupts', () => {
        let source = new MockInterruptSource();

        instance.setInterrupts([source]);
        expect(source.isAttached).toBe(false);

        instance.watch();

        expect(source.isAttached).toBe(true);

        instance.stop();
      });

      it('watch() should detach all interrupts', () => {
        let source = new MockInterruptSource();

        instance.setInterrupts([source]);
        instance.watch();

        expect(source.isAttached).toBe(true);

        instance.stop();

        expect(source.isAttached).toBe(false);
      });

      it('watch() should not idle after IdleInterval has fired if timeout has not elapsed', fakeAsync(() => {
        let source = new MockInterruptSource();

        instance.setTimeout(3);
        instance.setInterrupts([source]);

        expiry.mockNow = new Date();
        instance.watch();

        expect(source.isAttached).toBe(true);

        expiry.mockNow = new Date(expiry.now().getTime() + 30000);
        expiry.last(new Date(expiry.now().getTime() + 33000));
        tick(30000);
        console.log(`${expiry.last()}`);

        expect(instance.isIdling()).toBe(false);
        expect(source.isAttached).toBe(true);

        instance.stop();
      }));

      it('watch() should attach all interrupts when resuming after timeout', fakeAsync(() => {
        let source = new MockInterruptSource();

        instance.setTimeout(3);
        instance.setInterrupts([source]);

        expiry.mockNow = new Date();
        instance.watch();

        expect(source.isAttached).toBe(true);

        expiry.mockNow = new Date(expiry.now().getTime() + instance.getIdle() * 1000);
        tick(30000);
        tick(1000);
        tick(1000);
        tick(1000);

        expect(instance.isIdling()).toBe(true);
        expect(source.isAttached).toBe(false);

        instance.watch();

        expect(source.isAttached).toBe(true);

        instance.stop();
      }));

      it('timeout() should detach all interrupts', () => {
        let source = new MockInterruptSource();

        instance.setInterrupts([source]);
        instance.watch();

        expect(source.isAttached).toBe(true);

        instance.stop();

        expect(source.isAttached).toBe(false);
      });

      it('watch(true) should not set expiry', () => {
        instance.watch(true);
        expect(expiry.last()).toBeUndefined();
        instance.stop();
      });

      it('isIdle() should return true when idle interval elapses, and false after stop() is called',
        fakeAsync(() => {
          expiry.mockNow = new Date();
          instance.watch();
          expect(instance.isIdling()).toBe(false);

          expiry.mockNow = new Date(expiry.now().getTime() + instance.getIdle() * 1000);
          tick(3000);

          expect(instance.isIdling()).toBe(true);

          instance.stop();
          expect(instance.isIdling()).toBe(false);
        }));

      it('should NOT pause interrupts when idle', fakeAsync(() => {
        let source = new MockInterruptSource();

        instance.setInterrupts([source]);
        expiry.mockNow = new Date();
        instance.watch();

        expiry.mockNow = new Date(expiry.now().getTime() + ((instance.getIdle()) * 1000));
        tick(3000);

        expect(instance.isIdling()).toBe(true);

        expect(source.isAttached).toBe(true);

        instance.stop();
      }));

      it('emits an onIdleStart event when the user becomes idle', fakeAsync(() => {
        spyOn(instance.onIdleStart, 'emit').and.callThrough();

        expiry.mockNow = new Date();
        instance.watch();

        expiry.mockNow = new Date(expiry.now().getTime() + instance.getIdle() * 1000);
        tick(3000);

        expect(instance.onIdleStart.emit).toHaveBeenCalledTimes(1);

        instance.stop();
      }));

      it('emits an onIdleStart event if there was no "last" expiry set.', fakeAsync(() => {
        spyOn(instance.onIdleStart, 'emit').and.callThrough();

        expiry.mockNow = new Date();
        instance.watch();

        expiry.mockNow = new Date(expiry.now().getTime() + instance.getIdle() * 1000);
        expiry.last(null);
        tick(3000);

        expect(instance.onIdleStart.emit).toHaveBeenCalledTimes(1);

        instance.stop();
      }));

      it('emits an onIdleEnd event when the user returns from idle', fakeAsync(() => {
        spyOn(instance.onIdleEnd, 'emit').and.callThrough();

        expiry.mockNow = new Date();
        instance.watch();

        expiry.mockNow = new Date(expiry.now().getTime() + instance.getIdle() * 1000);
        tick(3000);
        expect(instance.isIdling()).toBe(true);

        instance.watch();
        expect(instance.onIdleEnd.emit).toHaveBeenCalledTimes(1);

        instance.stop();
      }));

      it('emits an onTimeoutWarning every second during the timeout duration', fakeAsync(() => {
        spyOn(instance.onTimeoutWarning, 'emit').and.callThrough();
        spyOn(instance.onTimeout, 'emit').and.callThrough();

        instance.setTimeout(3);
        expiry.mockNow = new Date();
        instance.watch();

        expiry.mockNow = new Date(expiry.now().getTime() + instance.getIdle() * 1000);
        tick(3000);
        expect(instance.isIdling()).toBe(true);

        expect(instance.onTimeoutWarning.emit).toHaveBeenCalledTimes(1);
        tick(1000);
        expect(instance.onTimeoutWarning.emit).toHaveBeenCalledTimes(2);
        tick(1000);
        expect(instance.onTimeoutWarning.emit).toHaveBeenCalledTimes(3);
        expect(instance.onTimeout.emit).not.toHaveBeenCalled();

        instance.stop();
      }));

      it('emits an onTimeout event when the countdown reaches 0', fakeAsync(() => {
        spyOn(instance.onTimeout, 'emit').and.callThrough();

        instance.setTimeout(3);
        expiry.mockNow = new Date();
        instance.watch();

        expiry.mockNow = new Date(expiry.now().getTime() + instance.getIdle() * 1000);
        tick(3000);
        expect(instance.isIdling()).toBe(true);

        tick(1000);  // going once
        tick(1000);  // going twice
        tick(1000);  // going thrice

        expect(instance.onTimeout.emit).toHaveBeenCalledTimes(1);

        instance.stop();
      }));

      it('emits an onInterrupt event when the countdown ticks and expiry last has been updated', fakeAsync(() => {
        spyOn(instance.onInterrupt, 'emit').and.callThrough();

        instance.setTimeout(3);
        expiry.mockNow = new Date();
        instance.watch();

        expiry.mockNow = new Date(expiry.now().getTime() + instance.getIdle() * 1000);
        tick(3000);
        expect(instance.isIdling()).toBe(true);

        tick(1000);  // going once
        tick(1000);  // going twice
        expiry.last(new Date(expiry.now().getTime() + 6000));
        tick(1000);  // going thrice

        expect(instance.onInterrupt.emit).toHaveBeenCalledTimes(1);

        instance.stop();
      }));

      it('does not emit an onTimeoutWarning when timeout is disabled', fakeAsync(() => {
        spyOn(instance.onTimeoutWarning, 'emit').and.callThrough();

        instance.setTimeout(false);
        expiry.mockNow = new Date();
        instance.watch();

        expiry.mockNow = new Date(expiry.now().getTime() + instance.getIdle() * 1000);
        tick(3000);
        expect(instance.isIdling()).toBe(true);

        tick(1000);
        tick(1000);
        expect(instance.onTimeoutWarning.emit).not.toHaveBeenCalled();

        instance.stop();
      }));

      it('does not emit an onTimeout event timeout is disabled', fakeAsync(() => {
        spyOn(instance.onTimeout, 'emit').and.callThrough();

        instance.setTimeout(false);
        expiry.mockNow = new Date();
        instance.watch();

        expiry.mockNow = new Date(expiry.now().getTime() + instance.getIdle() * 1000);
        tick(3000);
        expect(instance.isIdling()).toBe(true);

        tick(3000);

        expect(instance.onTimeout.emit).not.toHaveBeenCalled();

        instance.stop();
      }));

      it('interrupt() does not call watch() or emit onInterrupt if not running', () => {
        spyOn(instance, 'watch').and.callThrough();
        spyOn(instance.onInterrupt, 'emit').and.callThrough();

        instance.interrupt();

        expect(instance.watch).not.toHaveBeenCalled();
        expect(instance.onInterrupt.emit).not.toHaveBeenCalled();
        instance.stop();
      });

      it('interrupt() emits onInterrupt event and include event arguments', () => {
        spyOn(instance.onInterrupt, 'emit').and.callThrough();
        instance.watch();

        let expected = { test: true };
        instance.interrupt(false, expected);

        expect(instance.onInterrupt.emit).toHaveBeenCalledWith(expected);
        instance.stop();
      });

      it('interrupt() with the force parameter set to true calls watch()', fakeAsync(() => {
        instance.setAutoResume(AutoResume.disabled);
        instance.setIdle(3);

        let now = new Date();
        expiry.mockNow = now;
        instance.watch();
        spyOn(instance, 'watch').and.callThrough();

        expiry.mockNow = new Date(expiry.now().getTime() + instance.getIdle() * 1000);
        tick(3000);

        expect(instance.isIdling()).toBe(true);

        instance.interrupt(true);

        expect(instance.watch).toHaveBeenCalled();

        instance.stop();
      }));

      it('interrupt() with AutoResume.disabled should not call watch() when state is idle',
        fakeAsync(() => {
          instance.setAutoResume(AutoResume.disabled);
          instance.setIdle(3);

          let now = new Date();
          expiry.mockNow = now;
          instance.watch();
          spyOn(instance, 'watch').and.callThrough();

          expiry.mockNow = new Date(expiry.now().getTime() + instance.getIdle() * 1000);
          tick(3000);

          expect(instance.isIdling()).toBe(true);

          instance.interrupt();

          expect(instance.watch).not.toHaveBeenCalled();

          instance.stop();
        }));

      it('interrupt() with AutoResume.disabled should not call watch() when state is not idle',
        fakeAsync(() => {
          instance.setAutoResume(AutoResume.disabled);
          instance.setIdle(3);

          instance.watch();
          spyOn(instance, 'watch').and.callThrough();
          tick(2000);

          expect(instance.isIdling()).toBe(false);

          instance.interrupt();

          expect(instance.watch).not.toHaveBeenCalled();

          instance.stop();
        }));

      it('interrupt() with AutoResume.idle should call watch when state is idle', fakeAsync(() => {
        instance.setAutoResume(AutoResume.idle);
        instance.setIdle(3);

        let now = new Date();
        expiry.mockNow = now;
        instance.watch();
        spyOn(instance, 'watch').and.callThrough();

        expiry.mockNow = new Date(expiry.now().getTime() + instance.getIdle() * 1000);
        tick(3000);

        expect(instance.isIdling()).toBe(true);

        instance.interrupt();

        expect(instance.watch).toHaveBeenCalled();

        instance.stop();
      }));

      it('interrupt() with AutoResume.notIdle should call watch() when state is not idle',
        fakeAsync(() => {
          instance.setAutoResume(AutoResume.notIdle);
          instance.setIdle(3);

          let now = new Date();
          expiry.mockNow = now;
          instance.watch();
          spyOn(instance, 'watch').and.callThrough();

          expiry.mockNow = new Date(expiry.now().getTime() + instance.getIdle() * 1000);
          tick(2000);

          expect(instance.isIdling()).toBe(false);

          instance.interrupt();

          expect(instance.watch).toHaveBeenCalled();

          instance.stop();
        }));

      it('interrupt() with AutoResume.notIdle should not call watch() when state is idle',
        fakeAsync(() => {
          instance.setAutoResume(AutoResume.notIdle);
          instance.setIdle(3);

          expiry.mockNow = new Date();
          instance.watch();
          spyOn(instance, 'watch').and.callThrough();

          expiry.mockNow = new Date(expiry.now().getTime() + instance.getIdle() * 1000);
          tick(3000);

          expect(instance.isIdling()).toBe(true);

          instance.interrupt();

          expect(instance.watch).not.toHaveBeenCalled();

          instance.stop();
        }));

      it('interrupt() should not call watch if expiry has expired', () => {
        instance.setTimeout(3);
        instance.setIdle(3);
        instance.watch();
        spyOn(instance, 'watch').and.callThrough();

        expiry.mockNow = new Date(expiry.last().getTime() + 7000);

        instance.interrupt();

        expect(instance.watch).not.toHaveBeenCalled();
        instance.stop();
      });

      it('interrupt(true) should call watch(true)', () => {
        instance.watch();
        spyOn(instance, 'watch').and.callThrough();

        instance.interrupt(true);
        expect(instance.watch).toHaveBeenCalledWith(true);
        instance.stop();
      });

      it('triggering an interrupt source should call interrupt()', fakeAsync(() => {
        spyOn(instance.onInterrupt, 'emit').and.callThrough();

        let source = new MockInterruptSource;
        instance.setInterrupts([source]);

        instance.watch();
        source.trigger();
        // not sure why I have to pad the call with a tick for onInterrupt to be called
        // possibly because of RxJS throttling
        tick(1);

        expect(instance.onInterrupt.emit).toHaveBeenCalledTimes(1);

        instance.stop();
      }));

      it('ngOnDestroy calls stop() and clearInterrupts()', () => {
        spyOn(instance, 'stop').and.callThrough();
        spyOn(instance, 'clearInterrupts').and.callThrough();

        instance.ngOnDestroy();

        expect(instance.stop).toHaveBeenCalled();
        expect(instance.clearInterrupts).toHaveBeenCalled();
      });
    });
  });

  describe('with KeepaliveSvc integration', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          MockExpiry, { provide: IdleExpiry, useExisting: MockExpiry },
          { provide: KeepaliveSvc, useClass: MockKeepaliveSvc }, Idle
        ]
      });
    });

    let instance: Idle;
    let svc: MockKeepaliveSvc;
    let expiry: MockExpiry;

    beforeEach(inject([Idle, KeepaliveSvc, MockExpiry], (idle: Idle, keepaliveSvc: MockKeepaliveSvc, mockExpiry: MockExpiry) => {
      instance = idle;
      svc = keepaliveSvc;
      expiry = mockExpiry;

      instance.setIdle(3);
      instance.setTimeout(3);
    }));

    describe('runtime config', () => {
      it('getKeepaliveEnabled() should return true by default when service is injected.', () => {
        expect(instance.getKeepaliveEnabled()).toBe(true);
      });

      it('setKeepaliveEnabled() should set and return current value.', () => {
        expect(instance.setKeepaliveEnabled(false)).toBe(false);
      });

      it('setKeepaliveEnabled() should NOT stop the keepalive service when value is false', () => {
        spyOn(svc, 'stop').and.callThrough();

        instance.setKeepaliveEnabled(false);

        expect(svc.stop).not.toHaveBeenCalled();
      });
    });

    describe('watching', () => {
      it('should start keepalive when watch() is called', fakeAsync(() => {
        instance.watch();
        expect(svc.isRunning).toBe(true);

        instance.stop();
      }));

      it('should stop keepalive when stop() is called', fakeAsync(() => {
        instance.watch();
        expect(svc.isRunning).toBe(true);

        instance.stop();

        expect(svc.isRunning).toBe(false);
      }));

      it('should stop keepalive when idle', fakeAsync(() => {
        expiry.mockNow = new Date();
        instance.watch();
        expect(svc.isRunning).toBe(true);

        expiry.mockNow = new Date(expiry.now().getTime() + instance.getIdle() * 1000);
        tick(3000);

        expect(instance.isIdling()).toBe(true);
        expect(instance.isRunning()).toBe(true);
        expect(svc.isRunning).toBe(false);

        instance.stop();
      }));

      it('should stop keepalive when timed out', fakeAsync(() => {
        expiry.mockNow = new Date();
        instance.watch();
        expect(svc.isRunning).toBe(true);

        expiry.mockNow = new Date(expiry.now().getTime() + instance.getIdle() * 1000);
        tick(3000);
        tick(1000);
        tick(1000);
        tick(1000);

        expect(instance.isIdling()).toBe(true);
        expect(instance.isRunning()).toBe(false);
        expect(svc.isRunning).toBe(false);

        instance.stop();
      }));

      it('should immediately ping and restart keepalive when user returns from idle',
        fakeAsync(() => {
          spyOn(svc, 'ping').and.callThrough();
          let now = new Date();
          expiry.mockNow = now;
          instance.watch();
          expect(svc.isRunning).toBe(true);

          expiry.mockNow = new Date(expiry.now().getTime() + instance.getIdle() * 1000);
          tick(3000);

          expect(instance.isIdling()).toBe(true);
          expect(instance.isRunning()).toBe(true);
          expect(svc.isRunning).toBe(false);

          instance.interrupt();

          expect(instance.isIdling()).toBe(false);
          expect(instance.isRunning()).toBe(true);
          expect(svc.isRunning).toBe(true);
          expect(svc.ping).toHaveBeenCalled();

          instance.stop();
        }));
    });
  });
});
