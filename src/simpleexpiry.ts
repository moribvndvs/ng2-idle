import {IdleExpiry} from './idleexpiry';

/*
 * Represents a simple in-memory store of expiry values.
 * @extends IdleExpiry
 */
export class SimpleExpiry extends IdleExpiry {
  private lastValue: Date = null;

  constructor() {
    super();
  }

  /*
   * Gets or sets the last expiry date.
   * @param value - The expiry value to set; omit to only return the value.
   * @return The current expiry value.
   */
  last(value?: Date): Date {
    if (value !== void 0) {
      this.lastValue = value;
    }

    return this.lastValue;
  }
}
