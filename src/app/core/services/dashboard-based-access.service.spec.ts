import { TestBed } from '@angular/core/testing';

import { DashboardBasedAccessService } from './dashboard-based-access.service';

describe('DashboardBasedAccessService', () => {
  let service: DashboardBasedAccessService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DashboardBasedAccessService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
