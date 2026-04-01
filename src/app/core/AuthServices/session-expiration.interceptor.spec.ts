import { TestBed } from '@angular/core/testing';

import { SessionExpirationInterceptor } from './session-expiration.interceptor';

describe('SessionExpirationInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      SessionExpirationInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: SessionExpirationInterceptor = TestBed.inject(SessionExpirationInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
