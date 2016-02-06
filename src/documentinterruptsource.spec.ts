import {it, injectAsync} from 'angular2/testing';
import {DocumentInterruptSource} from './documentinterruptsource';

export function main() {
  describe('DocumentInterruptSource', () => {

    it('emits onInterrupt event when attached and event is fired', injectAsync([], () => {
         let source = new DocumentInterruptSource('click');
         source.attach();

         return new Promise((pass, fail) => {
           let expected = new Event('click');

           source.onInterrupt.subscribe(() => { pass(); });

           document.documentElement.dispatchEvent(expected);
         });
       }), 300);

    it('does not emit onInterrupt event when detached and event is fired', injectAsync([], () => {
         let source = new DocumentInterruptSource('click');

         // make it interesting by attaching and detaching
         source.attach();
         source.detach();

         return new Promise((pass, fail) => {
           let expected = new Event('click');

           source.onInterrupt.subscribe((actual) => { fail(); });

           document.documentElement.dispatchEvent(expected);

           // HACK: try to give it a chance to fail first, if it's going to fail
           setTimeout(pass, 200);
         });
       }), 300);

    it('should not emit onInterrupt event when Chrome desktop notifications are visible',
       injectAsync([], () => {
         let source = new DocumentInterruptSource('mousemove');

         source.attach();

         return new Promise((pass, fail) => {
           let expected: any = new Event('mousemove');

           expected.originalEvent = {movementX: 0, movementY: 0};

           source.onInterrupt.subscribe((actual) => { fail(); });

           document.documentElement.dispatchEvent(expected);

           // HACK: try to give it a chance to fail first, if it's going to fail
           setTimeout(pass, 200);
         });
       }), 300);

    it('should not emit onInterrupt event on webkit fake mousemove events', injectAsync([], () => {
         let source = new DocumentInterruptSource('mousemove');

         source.attach();

         return new Promise((pass, fail) => {
           let expected: any = new Event('mousemove');

           expected.movementX = 0;
           expected.movementY = 0;

           source.onInterrupt.subscribe((actual) => { fail(); });

           document.documentElement.dispatchEvent(expected);

           // HACK: try to give it a chance to fail first, if it's going to fail
           setTimeout(pass, 200);
         });
       }), 300);
  });
}
