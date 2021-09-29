import { fakeAsync } from '@angular/core/testing';

import { StorageInterruptSource } from './storageinterruptsource';

describe('core/StorageInterruptSource', () => {
  it('emits onInterrupt event when attached and event is fired', fakeAsync(() => {
    const source = new StorageInterruptSource();
    source.initialize();
    spyOn(source.onInterrupt, 'emit').and.callThrough();
    source.attach();

    const init: StorageEventInit = {
      key: 'ng2Idle.expiry',
      newValue: '',
      oldValue: null,
      url: 'http://localhost:4200/'
    };

    const expected = new StorageEvent('storage', init);

    window.dispatchEvent(expected);

    expect(source.onInterrupt.emit).toHaveBeenCalledTimes(1);

    source.detach();
  }));

  it('does not emit onInterrupt event when detached and event is fired', fakeAsync(() => {
    const source = new StorageInterruptSource();
    source.initialize();
    spyOn(source.onInterrupt, 'emit').and.callThrough();
    // make it interesting by attaching and detaching
    source.attach();
    source.detach();

    const expected = new StorageEvent('storage');
    window.dispatchEvent(expected);

    expect(source.onInterrupt.emit).not.toHaveBeenCalled();
  }));

  it('does not emit onInterrupt event when attached and key is not ng2Idle.expiry and event is fired', fakeAsync(() => {
    const source = new StorageInterruptSource();
    source.initialize();
    spyOn(source.onInterrupt, 'emit').and.callThrough();
    source.attach();

    const init: StorageEventInit = {
      key: 'otherKey',
      newValue: '',
      oldValue: null,
      url: 'http://localhost:4200/'
    };

    const expected = new StorageEvent('storage', init);

    window.dispatchEvent(expected);

    expect(source.onInterrupt.emit).not.toHaveBeenCalled();

    source.detach();
  }));

  it('does not emit onInterrupt event when running on a server', fakeAsync(() => {
    const source = new StorageInterruptSource();
    const options = { platformId: 'server' as unknown as object };
    source.initialize(options);
    spyOn(source.onInterrupt, 'emit').and.callThrough();

    source.attach();

    const expected = new StorageEvent('storage');
    window.dispatchEvent(expected);

    expect(source.onInterrupt.emit).not.toHaveBeenCalled();

    source.detach();
  }));
});
