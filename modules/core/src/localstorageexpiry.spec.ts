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
