import { fakeAsync, tick } from '@angular/core/testing';

import { EventTarget } from './eventtarget';
import { EventTargetInterruptSource } from './eventtargetinterruptsource';

describe('core/EventTargetInterruptSource', () => {
  it('emits onInterrupt event when attached and event is fired', fakeAsync(() => {
    const source = new EventTargetInterruptSource(document.body, 'click');
    source.initialize();
    spyOn(source.onInterrupt, 'emit').and.callThrough();
    source.attach();

    const expected = new Event('click');
    document.body.dispatchEvent(expected);

    expect(source.onInterrupt.emit).toHaveBeenCalledTimes(1);

    source.detach();
  }));

  it('emits onInterrupt event when multiple events are specified and one is triggered', fakeAsync(() => {
    const source = new EventTargetInterruptSource(document.body, 'click touch');
    source.initialize();
    spyOn(source.onInterrupt, 'emit').and.callThrough();
    source.attach();

    const expected = new Event('click');
    document.body.dispatchEvent(expected);

    expect(source.onInterrupt.emit).toHaveBeenCalledTimes(1);

    source.detach();
  }));

  it('does not emit onInterrupt event when detached and event is fired', fakeAsync(() => {
    const source = new EventTargetInterruptSource(document.body, 'click');
    source.initialize();
    spyOn(source.onInterrupt, 'emit').and.callThrough();

    // make it interesting by attaching and detaching
    source.attach();
    source.detach();

    const expected = new Event('click');
    document.body.dispatchEvent(expected);

    expect(source.onInterrupt.emit).not.toHaveBeenCalled();
  }));

  it('does not emit onInterrupt event when running on a server', fakeAsync(() => {
    const source = new EventTargetInterruptSource(document.body, 'click');
    const options = { platformId: 'server' as unknown as object };
    source.initialize(options);
    spyOn(source.onInterrupt, 'emit').and.callThrough();

    source.attach();

    const expected = new Event('click');
    document.body.dispatchEvent(expected);

    expect(source.onInterrupt.emit).not.toHaveBeenCalled();

    source.detach();
  }));

  it('should use passive event listeners when passive is true', fakeAsync(() => {
    const source = new EventTargetInterruptSource(document.body, 'click', { passive: true });
    source.initialize();
    spyOn(source.onInterrupt, 'emit').and.callThrough();
    source.attach();

    const expected = new Event('click');
    document.body.dispatchEvent(expected);

    expect(source.onInterrupt.emit).toHaveBeenCalledTimes(1);

    source.detach();
  }));

  it('should throttle target events using the specified throttleDelay value', fakeAsync(() => {
    const source = new EventTargetInterruptSource(document.body, 'click', 500);
    source.initialize();
    spyOn(source.onInterrupt, 'emit').and.callThrough();
    source.attach();

    // two immediate calls should get throttled to only 1 call
    document.body.dispatchEvent(new Event('click'));
    expect(source.onInterrupt.emit).toHaveBeenCalledTimes(1);

    document.body.dispatchEvent(new Event('click'));
    expect(source.onInterrupt.emit).toHaveBeenCalledTimes(1);

    // call halfway through the delay should still only yield one call
    tick(250);
    document.body.dispatchEvent(new Event('click'));
    expect(source.onInterrupt.emit).toHaveBeenCalledTimes(1);

    // the throttle delay has now been met, so the next event should result in an additional
    // call
    tick(250);
    document.body.dispatchEvent(new Event('click'));
    expect(source.onInterrupt.emit).toHaveBeenCalledTimes(2);

    // another 500ms has passed so the next event should result in yet another call
    tick(500);
    document.body.dispatchEvent(new Event('click'));
    expect(source.onInterrupt.emit).toHaveBeenCalledTimes(3);

    // need to detach to remove throttle timers or test will fail
    source.detach();
  }));

  it('should not throttle target events if throttleDelay is 0', fakeAsync(() => {
    const source = new EventTargetInterruptSource(document.body, 'click', 0);
    source.initialize();
    spyOn(source.onInterrupt, 'emit').and.callThrough();
    source.attach();

    document.body.dispatchEvent(new Event('click'));
    expect(source.onInterrupt.emit).toHaveBeenCalledTimes(1);

    document.body.dispatchEvent(new Event('click'));
    expect(source.onInterrupt.emit).toHaveBeenCalledTimes(2);

    tick(250);
    document.body.dispatchEvent(new Event('click'));
    expect(source.onInterrupt.emit).toHaveBeenCalledTimes(3);

    // need to detach to remove throttle timers or test will fail
    source.detach();
  }));

  it('should set default options', () => {
    const target = {} as EventTarget<any>;
    const source = new EventTargetInterruptSource(target, 'click');
    const { throttleDelay, passive } = source.options;

    expect(passive).toBeFalsy();
    expect(throttleDelay).toBe(500);
  });

  it('should set passive flag', () => {
    const target = {} as EventTarget<any>;
    const source = new EventTargetInterruptSource(target, 'click', {
      passive: true
    });
    const { throttleDelay, passive } = source.options;

    expect(passive).toBeTruthy();
    expect(throttleDelay).toBe(500);
  });

  it('should set throttleDelay', () => {
    const target = {} as EventTarget<any>;
    const source = new EventTargetInterruptSource(target, 'click', {
      throttleDelay: 1000
    });
    const { throttleDelay, passive } = source.options;

    expect(passive).toBeFalsy();
    expect(throttleDelay).toBe(1000);
  });

  it('should set all options', () => {
    const target = {} as EventTarget<any>;
    const source = new EventTargetInterruptSource(target, 'click', {
      passive: true,
      throttleDelay: 1000
    });
    const { throttleDelay, passive } = source.options;

    expect(passive).toBeTruthy();
    expect(throttleDelay).toBe(1000);
  });
});
