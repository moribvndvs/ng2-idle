import { fakeAsync } from '@angular/core/testing';

import { DocumentInterruptSource } from './documentinterruptsource';

describe('core/DocumentInterruptSource', () => {

  it('emits onInterrupt event when attached and event is fired', fakeAsync(() => {
    let source = new DocumentInterruptSource('click');
    spyOn(source.onInterrupt, 'emit').and.callThrough();
    source.attach();

    let expected = new Event('click');
    document.documentElement.dispatchEvent(expected);

    expect(source.onInterrupt.emit).toHaveBeenCalledTimes(1);

    source.detach();
  }));

  it('does not emit onInterrupt event when detached and event is fired', fakeAsync(() => {
    let source = new DocumentInterruptSource('click');
    spyOn(source.onInterrupt, 'emit').and.callThrough();

    // make it interesting by attaching and detaching
    source.attach();
    source.detach();

    let expected = new Event('click');
    document.documentElement.dispatchEvent(expected);

    expect(source.onInterrupt.emit).not.toHaveBeenCalled();
  }));

  it('should not emit onInterrupt event when Chrome desktop notifications are visible',
    fakeAsync(() => {
      let source = new DocumentInterruptSource('mousemove');
      spyOn(source.onInterrupt, 'emit').and.callThrough();
      source.attach();

      let expected: any = new Event('mousemove');
      expected.originalEvent = { movementX: 0, movementY: 0 };

      document.documentElement.dispatchEvent(expected);

      expect(source.onInterrupt.emit).not.toHaveBeenCalled();

      source.detach();
    }));

  it('should not emit onInterrupt event on webkit fake mousemove events', fakeAsync(() => {
    let source = new DocumentInterruptSource('mousemove');
    spyOn(source.onInterrupt, 'emit').and.callThrough();
    source.attach();

    let expected: any = new Event('mousemove');

    expected.movementX = 0;
    expected.movementY = 0;

    document.documentElement.dispatchEvent(expected);

    expect(source.onInterrupt.emit).not.toHaveBeenCalled();

    source.detach();
  }));


  it('should emit onInterrupt event on webkit real mousemove events', fakeAsync(() => {
    let source = new DocumentInterruptSource('mousemove');
    spyOn(source.onInterrupt, 'emit').and.callThrough();
    source.attach();

    let expected: any = new Event('mousemove');

    expected.movementX = 7;
    expected.movementY = 16;

    document.documentElement.dispatchEvent(expected);

    expect(source.onInterrupt.emit).toHaveBeenCalledTimes(1);

    source.detach();
  }));
});
