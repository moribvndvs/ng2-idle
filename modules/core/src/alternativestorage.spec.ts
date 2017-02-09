import { AlternativeStorage } from './alternativestorage';

describe('core/AlternativeStorage', () => {

  let storage: Storage;

  beforeEach(() => {
    storage = new AlternativeStorage();
  });

  it('setItem() and getItem() should works properly', () => {
    expect(storage.getItem('key')).toBeNull();
    storage.setItem('key', 'value');
    expect(storage.getItem('key')).toBe('value');
  });

  it('length() returns current value', () => {
    expect(storage.length).toBe(0);
    storage.setItem('key', 'value');
    expect(storage.length).toBe(1);
  });

  it('clear() must clear current storage', () => {
    storage.setItem('key', 'value');
    expect(storage.length).toBe(1);
    storage.clear();
    expect(storage.length).toBe(0);
  });

  it('key() must return key name ', () => {
    expect(storage.key(0)).toBeNull();
    storage.setItem('key', 'value');
    expect(storage.key(0)).toBe('key');
  });

  it('remove() must remove item', () => {
    storage.setItem('key', 'value');
    storage.removeItem('key');
    expect(storage.getItem('key')).toBeNull();
  });

});
