import { TestBed } from '@angular/core/testing';

import { LogaccessService } from './logaccess.service';

describe('LogaccessService', () => {
  let service: LogaccessService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LogaccessService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
