import {
  it,
  inject,
  injectAsync,
  beforeEach,
  beforeEachProviders,
  fakeAsync,
  tick
} from 'angular2/testing';

import {Idle, AutoResume} from './idle';
import {MockInterruptSource} from './mocks/mockinterruptsource';

export function main() {
  describe('Idle', () => {
    beforeEachProviders(() => [Idle]);

    let instance: Idle;

    beforeEach(inject([Idle], (idle: Idle) => { instance = idle; }));

    describe('runtime config', () => {
      it('getIdle() should return current value',
         () => { expect(instance.getIdle()).toEqual(20 * 60); });

      it('setIdle() should set and return the current value', () => {
        let expected = 500;
        let actual = instance.setIdle(expected);

        expect(actual).toEqual(expected);
      });

      it('setIdle() should throw if argument is less than or equal to zero', () => {
        let expected = new Error('\'seconds\' must be greater zero');

        expect(() => { instance.setIdle(0); }).toThrow(expected);

        expect(() => { instance.setIdle(-1); }).toThrow(expected);
      });

      it('getTimeout() should return current value',
         () => { expect(instance.getTimeout()).toEqual(30); });

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

      it('getAutoResume() should return current value',
         () => { expect(instance.getAutoResume()).toEqual(AutoResume.idle); });

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
        expect(source.attach).toHaveBeenCalled();
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
      beforeEach(() => { instance.setIdle(3); });

      it('stop() should clear timeouts and stop running', <any>fakeAsync((): void => {
           spyOn(window, 'clearInterval').and.callThrough();

           instance.watch();
           instance.stop();

           expect(instance.isRunning()).toBe(false);
           expect(window.clearInterval).toHaveBeenCalledTimes(1);
         }));

      it('watch() should clear timeouts and start running', <any>fakeAsync((): void => {
           spyOn(window, 'setInterval').and.callThrough();

           instance.watch();

           expect(instance.isRunning()).toBe(true);
           expect(window.setInterval).toHaveBeenCalledTimes(1);

           instance.stop();
         }));

      it('isIdle() should return true when idle interval elapses, and false after stop() is called',
         <any>fakeAsync((): void => {
           instance.watch();
           expect(instance.isIdling()).toBe(false);

           tick(3000);

           expect(instance.isIdling()).toBe(true);

           instance.stop();
           expect(instance.isIdling()).toBe(false);
         }));

      it('emits an onIdleStart event when the user becomes idle', <any>fakeAsync((): void => {
           spyOn(instance.onIdleStart, 'emit').and.callThrough();

           instance.watch();
           tick(3000);

           expect(instance.onIdleStart.emit).toHaveBeenCalledTimes(1);

           instance.stop();
         }));

      it('emits an onIdleEnd event when the user returns from idle', <any>fakeAsync((): void => {
           spyOn(instance.onIdleEnd, 'emit').and.callThrough();

           instance.watch();
           tick(3000);
           expect(instance.isIdling()).toBe(true);

           instance.watch();
           expect(instance.onIdleEnd.emit).toHaveBeenCalledTimes(1);

           instance.stop();
         }));

      it('emits an onTimeoutWarning every second during the timeout duration',
         <any>fakeAsync((): void => {
           spyOn(instance.onTimeoutWarning, 'emit').and.callThrough();
           spyOn(instance.onTimeout, 'emit').and.callThrough();

           instance.setTimeout(3);
           instance.watch();
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

      it('emits an onTimeout event when the countdown reaches 0', <any>fakeAsync((): void => {
           spyOn(instance.onTimeout, 'emit').and.callThrough();

           instance.setTimeout(3);
           instance.watch();
           tick(3000);
           expect(instance.isIdling()).toBe(true);

           tick(1000);  // going once
           tick(1000);  // going twice
           tick(1000);  // going thrice

           expect(instance.onTimeout.emit).toHaveBeenCalledTimes(1);

           instance.stop();
         }));

      it('does not emit an onTimeoutWarning when timeout is disabled', <any>fakeAsync((): void => {
           spyOn(instance.onTimeoutWarning, 'emit').and.callThrough();

           instance.setTimeout(false);
           instance.watch();
           tick(3000);
           expect(instance.isIdling()).toBe(true);

           tick(1000);
           tick(1000);
           expect(instance.onTimeoutWarning.emit).not.toHaveBeenCalled();

           instance.stop();
         }));

      it('does not emit an onTimeout event timeout is disabled', <any>fakeAsync((): void => {
           spyOn(instance.onTimeout, 'emit').and.callThrough();

           instance.setTimeout(false);
           instance.watch();
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
      });

      it('interrupt() emits onInterrupt event and include event arguments', () => {
        spyOn(instance.onInterrupt, 'emit').and.callThrough();
        instance.watch();

        let expected = {test: true};
        instance.interrupt(false, expected);

        expect(instance.onInterrupt.emit).toHaveBeenCalledWith(expected);
      });

      it('interrupt() with the force parameter set to true calls watch()',
         <any>fakeAsync((): void => {
           instance.setAutoResume(AutoResume.disabled);
           instance.setIdle(3);

           instance.watch();
           spyOn(instance, 'watch').and.callThrough();
           tick(3000);

           expect(instance.isIdling()).toBe(true);

           instance.interrupt(true);

           expect(instance.watch).toHaveBeenCalled();

           instance.stop();
         }));

      it('interrupt() with AutoResume.disabled should not call watch() when state is idle',
         <any>fakeAsync((): void => {
           instance.setAutoResume(AutoResume.disabled);
           instance.setIdle(3);

           instance.watch();
           spyOn(instance, 'watch').and.callThrough();
           tick(3000);

           expect(instance.isIdling()).toBe(true);

           instance.interrupt();

           expect(instance.watch).not.toHaveBeenCalled();

           instance.stop();
         }));

      it('interrupt() with AutoResume.disabled should not call watch() when state is not idle',
         <any>fakeAsync((): void => {
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

      it('interrupt() with AutoResume.idle should call watch when state is idle',
         <any>fakeAsync((): void => {
           instance.setAutoResume(AutoResume.idle);
           instance.setIdle(3);

           instance.watch();
           spyOn(instance, 'watch').and.callThrough();
           tick(3000);

           expect(instance.isIdling()).toBe(true);

           instance.interrupt();

           expect(instance.watch).toHaveBeenCalled();

           instance.stop();
         }));

      it('interrupt() with AutoResume.notIdle should call watch() when state is not idle',
         <any>fakeAsync((): void => {
           instance.setAutoResume(AutoResume.notIdle);
           instance.setIdle(3);

           instance.watch();
           spyOn(instance, 'watch').and.callThrough();
           tick(2000);

           expect(instance.isIdling()).toBe(false);

           instance.interrupt();

           expect(instance.watch).toHaveBeenCalled();

           instance.stop();
         }));

      it('interrupt() with AutoResume.notIdle should not call watch() when state is idle',
         <any>fakeAsync((): void => {
           instance.setAutoResume(AutoResume.notIdle);
           instance.setIdle(3);

           instance.watch();
           spyOn(instance, 'watch').and.callThrough();
           tick(3000);

           expect(instance.isIdling()).toBe(true);

           instance.interrupt();

           expect(instance.watch).not.toHaveBeenCalled();

           instance.stop();
         }));

      it('triggering an interrupt source should call interrupt()', injectAsync([], () => {
           let source = new MockInterruptSource;
           instance.setInterrupts([source]);

           // HACK: not sure how to test this; infer that if onInterrupt is called, the call pattern
           // worked
           return new Promise((pass, fail) => {
             instance.onInterrupt.subscribe(() => { pass(); });

             instance.watch();
             source.trigger();
           });
         }), 300);

      it('ngOnDestroy calls stop() and clearInterrupts()', () => {
        spyOn(instance, 'stop').and.callThrough();
        spyOn(instance, 'clearInterrupts').and.callThrough();

        instance.ngOnDestroy();

        expect(instance.stop).toHaveBeenCalled();
        expect(instance.clearInterrupts).toHaveBeenCalled();
      });
    });
  });
}
