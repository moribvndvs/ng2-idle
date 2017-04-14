import {Injectable} from '@angular/core';
import {IdleExpiry} from './idleexpiry';
import {LocalStorage} from './localstorage';

/*
 * Represents a localStorage store of expiry values.
 * @extends IdleExpiry
 */
@Injectable()
export class LocalStorageExpiry extends IdleExpiry {
  private idleName = 'main';

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

  idling(value?: boolean): boolean {
    if (value !== void 0) {
      this.setIdling(value);
    }
    return this.getIdling();
  }

  /*
   * Gets the idle name.
   * @return The name of the idle.
   */
  getIdleName(): string {
    return this.idleName;
  }

  /*
   * Sets the idle name.
   * @param The name of the idle.
   */
  setIdleName(key: string): void {
    if (key) {
      this.idleName = key;
    }
  }

  private getExpiry(): Date {
    let expiry: string = this.localStorage.getItem(this.idleName + '.expiry');
    if (expiry) {
      return new Date(parseInt(expiry, 10));
    } else {
      return null;
    }
  }

  private setExpiry(value: Date) {
    if (value) {
      this.localStorage.setItem(this.idleName + '.expiry', value.getTime().toString());
    } else {
      this.localStorage.removeItem(this.idleName + '.expiry');
    }
  }

  private getIdling(): boolean {
    let idling: string = this.localStorage.getItem(this.idleName + '.idling');
    if (idling) {
      return idling === 'true';
    } else {
      return false;
    }
  }

  private setIdling(value: boolean) {
    if (value) {
      this.localStorage.setItem(this.idleName + '.idling', value.toString());
    } else {
      this.localStorage.setItem(this.idleName + '.idling', 'false');
    }
  }
}
