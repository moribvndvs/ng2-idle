import { InterruptSource } from './interruptsource';

/*
 * A class for expressing arguments to interrupt events.
 */
export class InterruptArgs {
  constructor(
    public source: InterruptSource,
    public innerArgs: unknown,
    public force = false
  ) {}
}
