import { SimpleExpiry } from './simpleexpiry';

describe('core/IdleExpiry', () => {
  const instance = new SimpleExpiry();

  it('last() returns the current value', () => {
    expect(instance.last()).toBeNull();
  });

  it('last() sets the specified value', () => {
    const expected = new Date();
    expect(instance.last(expected)).toEqual(expected);
    expect(instance.last()).toEqual(expected);
  });
});
