import { TestBed } from '@angular/core/testing';

import { PasswordRestrictService } from './password-restrict.service';

describe('PasswordRestrictService', () => {
  let service: PasswordRestrictService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PasswordRestrictService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
