import { TestBed, inject } from '@angular/core/testing';
import {LocalStorageExpiry} from './localstorageexpiry';
import {LocalStorage} from './localstorage';

let mockLocalStorage = {};

describe('core/LocalStorageExpiry', () => {

  beforeEach(() => {
    TestBed.configureTestingModule(testBedConfiguration());
    initSpyOnLocalStorage();
  });

  it('last() returns the current value', inject([LocalStorageExpiry], (service: LocalStorageExpiry) => {
    expect(service.last()).toBeNull();
  }));

  it('last() sets the specified value', inject([LocalStorageExpiry], (service: LocalStorageExpiry) => {
    let expected = new Date();
    expect(service.last(expected)).toEqual(expected);
    expect(service.last()).toEqual(expected);
  }));

  it('setExpiryKey() sets the key name of expiry', inject([LocalStorageExpiry], (service: LocalStorageExpiry) => {
    expect(service.getExpiryKey()).toBe('expiry');
    service.setExpiryKey('name');
    expect(service.getExpiryKey()).toBe('name');
  }));

  it('setExpiryKey() doesn\'t set expiry key name if param is null', inject([LocalStorageExpiry], (service: LocalStorageExpiry) => {
    expect(service.getExpiryKey()).toBe('expiry');
    service.setExpiryKey(null);
    expect(service.getExpiryKey()).toBe('expiry');
  }));

  it('setExpiryKey() doesn\'t set expiry key name if param is empty', inject([LocalStorageExpiry], (service: LocalStorageExpiry) => {
    expect(service.getExpiryKey()).toBe('expiry');
    service.setExpiryKey('');
    expect(service.getExpiryKey()).toBe('expiry');
  }));

});

function testBedConfiguration() {
  return {
    providers: [
      LocalStorage,
      LocalStorageExpiry
    ]
  };
}

function initSpyOnLocalStorage() {
  spyOn(localStorage, 'getItem').and.callFake((key: string): String => {
    return mockLocalStorage[key] || null;
  });
  spyOn(localStorage, 'removeItem').and.callFake((key: string): void => {
    delete mockLocalStorage[key];
  });
  spyOn(localStorage, 'setItem').and.callFake((key: string, value: string): string => {
    return mockLocalStorage[key] = <string>value;
  });
}
