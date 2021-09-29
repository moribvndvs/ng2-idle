import { fakeAsync } from '@angular/core/testing';

import { DocumentInterruptSource } from './documentinterruptsource';

describe('core/DocumentInterruptSource', () => {
  it('emits onInterrupt event when attached and event is fired', fakeAsync(() => {
    const source = new DocumentInterruptSource('click');
    source.initialize();
    spyOn(source.onInterrupt, 'emit').and.callThrough();
    source.attach();

    const expected = new Event('click');
    document.documentElement.dispatchEvent(expected);

    expect(source.onInterrupt.emit).toHaveBeenCalledTimes(1);

    source.detach();
  }));

  it('does not emit events when running on a server', fakeAsync(() => {
    const source = new DocumentInterruptSource('click');
    const options = { platformId: 'server' as unknown as object };
    source.initialize(options);
    spyOn(source.onInterrupt, 'emit').and.callThrough();
    source.attach();

    const expected = new Event('click');
    document.documentElement.dispatchEvent(expected);

    expect(source.onInterrupt.emit).not.toHaveBeenCalled();

    source.detach();
  }));

  it('does not emit onInterrupt event when detached and event is fired', fakeAsync(() => {
    const source = new DocumentInterruptSource('click');
    source.initialize();
    spyOn(source.onInterrupt, 'emit').and.callThrough();

    // make it interesting by attaching and detaching
    source.attach();
    source.detach();

    const expected = new Event('click');
    document.documentElement.dispatchEvent(expected);

    expect(source.onInterrupt.emit).not.toHaveBeenCalled();
  }));

  it('should not emit onInterrupt event when Chrome desktop notifications are visible', fakeAsync(() => {
    const source = new DocumentInterruptSource('mousemove');
    source.initialize();
    spyOn(source.onInterrupt, 'emit').and.callThrough();
    source.attach();

    const expected: any = new Event('mousemove');
    expected.originalEvent = { movementX: 0, movementY: 0 };

    document.documentElement.dispatchEvent(expected);

    expect(source.onInterrupt.emit).not.toHaveBeenCalled();

    source.detach();
  }));

  it('should not emit onInterrupt event on webkit fake mousemove events', fakeAsync(() => {
    const source = new DocumentInterruptSource('mousemove');
    source.initialize();
    spyOn(source.onInterrupt, 'emit').and.callThrough();
    source.attach();

    const expected: any = new Event('mousemove');

    expected.movementX = 0;
    expected.movementY = 0;

    document.documentElement.dispatchEvent(expected);

    expect(source.onInterrupt.emit).not.toHaveBeenCalled();

    source.detach();
  }));

  it('should emit onInterrupt event on webkit real mousemove events', fakeAsync(() => {
    const source = new DocumentInterruptSource('mousemove');
    source.initialize();
    spyOn(source.onInterrupt, 'emit').and.callThrough();
    source.attach();

    const expected: any = new Event('mousemove');

    expected.movementX = 7;
    expected.movementY = 16;

    document.documentElement.dispatchEvent(expected);

    expect(source.onInterrupt.emit).toHaveBeenCalledTimes(1);

    source.detach();
  }));
});
