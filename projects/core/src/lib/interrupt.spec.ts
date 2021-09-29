import { MockInterruptSource } from '../testing/mockinterruptsource';

import { EventTargetInterruptSource } from './eventtargetinterruptsource';
import { Interrupt } from './interrupt';

describe('core/Interrupt', () => {
  it('initializes the interrupt source during interrupt construction', () => {
    const source = new EventTargetInterruptSource(document.body, 'click');
    spyOn(source, 'initialize').and.callThrough();
    const instance = new Interrupt(source);
    expect(source.initialize).toHaveBeenCalledTimes(1);
    expect(instance).toBeInstanceOf(Interrupt);
  });

  it('initializes the interrupt source during interrupt construction and passes through the interrupt options', () => {
    const source = new EventTargetInterruptSource(document.body, 'click');
    spyOn(source, 'initialize').and.callThrough();
    const options = { platformId: 'browser' as unknown as object };
    const instance = new Interrupt(source, options);
    expect(source.initialize).toHaveBeenCalledTimes(1);
    expect(source.initialize).toHaveBeenCalledWith(options);
    expect(instance).toBeInstanceOf(Interrupt);
  });

  it('skips interrupt source initialization when the interrupt source does not have an initializer', () => {
    const source = new MockInterruptSource();
    const instance = new Interrupt(source);
    expect(instance).toBeInstanceOf(Interrupt);
  });
});
