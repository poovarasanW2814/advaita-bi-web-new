import { TestBed } from '@angular/core/testing';

import { TimeOutInterceptor } from './time-out.interceptor';

describe('TimeOutInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      TimeOutInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: TimeOutInterceptor = TestBed.inject(TimeOutInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
