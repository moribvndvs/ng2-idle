import {it} from '@angular/core/testing';
import {SimpleExpiry} from './simpleexpiry';

export function main() {
  describe('IdleExpiry', () => {

    let instance = new SimpleExpiry();

    it('last() returns the current value', () => { expect(instance.last()).toBeNull(); });

    it('last() sets the specified value', () => {
      let expected = new Date();
      expect(instance.last(expected)).toEqual(expected);
      expect(instance.last()).toEqual(expected);
    });
  });
}
