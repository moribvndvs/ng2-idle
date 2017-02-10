import {MockExpiry} from '../testing/mockexpiry';

describe('core/IdleExpiry', () => {

  let instance = new MockExpiry();

  it('now() returns current date', () => {
    let expected = Date.now();
    jasmine.clock().mockDate(new Date(expected));
    let actual = instance.now();
    expect(actual.getTime()).toBe(expected);
  });

  it('id() sets to specified value', () => {
    let expected = new Date(1234);
    instance.id(expected);
    expect(instance.id()).toBe(expected);
  });

  it('id() when empty value should throw error', () => {
    expect(() => { instance.id(''); }).toThrowError('A value must be specified for the ID.');
  });

  it('id() returns default value', () => {
    let expected = new Date();
    jasmine.clock().mockDate(expected);
    instance = new MockExpiry();
    let actual = instance.id();

    expect(actual).toEqual(expected);
  });

  it('idling() returns the current value', () => {
    expect(instance.idling()).toBeFalsy();
  });

  it('idling() sets the specified value', () => {
    let expected = true;
    expect(instance.idling(expected)).toEqual(expected);
    expect(instance.idling()).toEqual(expected);
  });

  it('idling() with null param return null', () => {
    let expected = null;
    expect(instance.idling(expected)).toEqual(expected);
    expect(instance.idling()).toEqual(expected);
  });

  it('isExpired() returns true if last() is less than or equal to now', () => {
    let date = new Date();
    instance.last(date);
    instance.mockNow = instance.lastDate;

    expect(instance.isExpired()).toBe(true);

    instance.mockNow = new Date(instance.lastDate.getTime() + 1000);
    expect(instance.isExpired()).toBe(true);
  });

  it('isExpired() returns false if last() is greater than now', () => {
    instance.last(new Date(new Date().getTime() + 1000));
    instance.mockNow = new Date();

    expect(instance.isExpired()).toBe(false);
  });

  it('isExpired() returns false if last() is null', () => {
    instance.last(null);
    expect(instance.isExpired()).toBe(false);
  });

});
