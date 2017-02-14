/*
 * Represents a base class for types that provide expiry detection for the Idle service.
 */
export abstract class IdleExpiry {
  protected idValue: any;
  protected idlingValue: boolean;

  constructor() {
    this.idValue = new Date();
    this.idlingValue = false;
  }

  /*
   * Gets or sets a unique ID for the window
   * @param id - The id.
   * @return The current id.
   */
  id(value?: any): any {
    if (value !== void 0) {
      if (!value) {
        throw new Error('A value must be specified for the ID.');
      }

      this.idValue = value;
    }

    return this.idValue;
  }

  /*
   * Gets or sets the last expiry date.
   * @param value - The value to set.
   * @return The last expiry value.
   */
  abstract last(value?: Date): Date;

  /*
   * Gets or sets the idling value.
   * @param value - The value to set.
   * @return The idling value.
   */
  idling(value?: boolean): boolean {
    if (value !== void 0) {
      this.idlingValue = value;
    }

    return this.idlingValue;
  }

  /*
   * Returns the current Date.
   * @return The current Date.
   */
  now(): Date {
    return new Date();
  }

  /*
   * Returns whether or not it is expired.
   * @return True if expired; otherwise, false.
   */
  isExpired(): boolean {
    let expiry = this.last();
    return expiry != null && expiry <= this.now();
  }
}
