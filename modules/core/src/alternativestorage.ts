/*
 * Represents an alternative storage for browser that doesn't support localstorage. (i.e. Safari in
 * private mode)
 * @implements Storage
 */
export class AlternativeStorage implements Storage {
  private storageMap: any = {};

  /*
   * Returns an integer representing the number of data items stored in the storageMap object.
   */
  get length() {
    return Object.keys(this.storageMap).length;
  }

  /*
   * Remove all keys out of the storage.
   */
  clear(): void {
    this.storageMap = {};
  }

  /*
   * Return the key's value
   *
   * @param key - name of the key to retrieve the value of.
   * @return The key's value
   */
  getItem(key: string): string|null {
    if (typeof this.storageMap[key] !== 'undefined') {
      return this.storageMap[key];
    }
    return null;
  }

  /*
   * Return the nth key in the storage
   *
   * @param index - the number of the key you want to get the name of.
   * @return The name of the key.
   */
  key(index: number): string|null {
    return Object.keys(this.storageMap)[index] || null;
  }

  /*
   * Remove a key from the storage.
   *
   * @param key - the name of the key you want to remove.
   */
  removeItem(key: string): void {
    this.storageMap[key] = undefined;
  }

  /*
   * Add a key to the storage, or update a key's value if it already exists.
   *
   * @param key - the name of the key.
   * @param value - the value you want to give to the key.
   */
  setItem(key: string, value: string): void {
    this.storageMap[key] = value;
  }

  [key: string]: any;
  [index: number]: string;
}
