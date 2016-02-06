import {it, injectAsync} from 'angular2/testing';
import {WindowInterruptSource} from './windowinterruptsource';

export function main() {
  describe('WindowInterruptSource', () => {

    it('emits onInterrupt event when attached and event is fired', injectAsync([], () => {
         let source = new WindowInterruptSource('focus');
         source.attach();

         return new Promise((pass, fail) => {
           let expected = new Event('focus');

           source.onInterrupt.subscribe(() => { pass(); });

           window.dispatchEvent(expected);
         });
       }), 300);

    it('does not emit onInterrupt event when detached and event is fired', injectAsync([], () => {
         let source = new WindowInterruptSource('focus');

         // make it interesting by attaching and detaching
         source.attach();
         source.detach();

         return new Promise((pass, fail) => {
           let expected = new Event('focus');

           source.onInterrupt.subscribe((actual) => { fail(); });

           window.dispatchEvent(expected);

           // HACK: try to give it a chance to fail first, if it's going to fail
           setTimeout(pass, 200);
         });
       }), 300);
  });
}
