import { TestBed } from '@angular/core/testing';

import { MenuBasedAccessService } from './menu-based-access.service';

describe('MenuBasedAccessService', () => {
  let service: MenuBasedAccessService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MenuBasedAccessService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
