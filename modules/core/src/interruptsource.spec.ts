import { MockInterruptSource } from '../testing/mockinterruptsource';
import { fakeAsync } from '@angular/core/testing';
import { EventTargetInterruptSource, InterruptArgs } from '..';

describe('core/InterruptSource', () => {

  it('attach() sets isAttached to true', () => {
    let source = new MockInterruptSource(null, null);
    source.attach();

    expect(source.isAttached).toBe(true);
  });

  it('attach() sets isAttached to false', () => {
    let source = new MockInterruptSource(null, null);
    source.attach();
    source.detach();

    expect(source.isAttached).toBe(false);
  });

  it('emits onInterrupt event outside the angular zone', fakeAsync(() => {
    let source = new EventTargetInterruptSource(document.body, 'click');
    let fakeNgZone = Zone.current.fork({
      name: 'angular',
      properties: {
        isAngularZone: true
      }
    });

    spyOn(source.onInterrupt, 'emit').and.callThrough();
    source.onInterrupt.subscribe((args: InterruptArgs) => {
      expect(Zone.current.name).not.toBe('angular');
      expect(Zone.current.get('isAngularZone')).toBeFalsy();
    });

    fakeNgZone.run(() => {
      source.attach();
      document.body.dispatchEvent(new Event('click'));
      source.detach();
    });

    expect(source.onInterrupt.emit).toHaveBeenCalled();
  }));
});
