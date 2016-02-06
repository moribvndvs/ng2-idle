import {it, injectAsync} from 'angular2/testing';
import {EventTargetInterruptSource} from './eventtargetinterruptsource';

export function main() {
  describe('EventTargetInterruptSource', () => {

    it('emits onInterrupt event when attached and event is fired', injectAsync([], () => {
         let source = new EventTargetInterruptSource(document.body, 'click');
         source.attach();

         return new Promise((pass, fail) => {
           let expected = new Event('click');

           source.onInterrupt.subscribe(() => { pass(); });

           document.body.dispatchEvent(expected);
         });
       }), 300);

    it('does not emit onInterrupt event when detached and event is fired', injectAsync([], () => {
         let source = new EventTargetInterruptSource(document.body, 'click');

         // make it interesting by attaching and detaching
         source.attach();
         source.detach();

         return new Promise((pass, fail) => {
           let expected = new Event('click');

           source.onInterrupt.subscribe((actual) => { fail(); });

           document.body.dispatchEvent(expected);

           // HACK: try to give it a chance to fail first, if it's going to fail
           setTimeout(pass, 200);
         });
       }), 300);
  });
}
