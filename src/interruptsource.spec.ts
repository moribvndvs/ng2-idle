import {it} from '@angular/core/testing';
import {MockInterruptSource} from './mocks/mockinterruptsource';


export function main() {
  describe('InterruptSource', () => {

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
  });
}
