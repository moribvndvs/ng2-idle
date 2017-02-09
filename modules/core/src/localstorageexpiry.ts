import { Injectable, Optional } from '@angular/core';
import { IdleExpiry } from './idleexpiry';
import { LocalStorage } from './localstorage';

/*
 * Represents a localStorage store of expiry values.
 * @extends IdleExpiry
 */
@Injectable()
export class LocalStorageExpiry extends IdleExpiry {

  private expiryKey: string = 'expiry';

  constructor(private localStorage: LocalStorage) {
    super();
  }

  /*
   * Gets or sets the last expiry date in localStorage.
   * If localStorage doesn't work correctly (i.e. Safari in private mode), we store the expiry value in memory.
   * @param value - The expiry value to set; omit to only return the value.
   * @return The current expiry value.
   */
  last(value?: Date): Date {
    if (value !== void 0) {
      this.setExpiry(value);
    }
    return this.getExpiry();
  }

  /*
   * Gets the expiry key name.
   * @return The name of the expiry key.
   */
  getExpiryKey(): string {
    return this.expiryKey;
  }

  /*
   * Sets the expiry key name.
   * @param The name of the expiry key.
   */
  setExpiryKey(key: string): void {
    if (key) {
      this.expiryKey = key;
    }
  }

  private getExpiry(): Date {
    let expiry: string = this.localStorage.getItem(this.expiryKey);
    if (expiry) {
      return new Date(parseInt(expiry, 10));
    } else {
      return null;
    }
  }

  private setExpiry(value: Date) {
    this.localStorage.setItem(this.expiryKey, value.getTime().toString());
  }

}
