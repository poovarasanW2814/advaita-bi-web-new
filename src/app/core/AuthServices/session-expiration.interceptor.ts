import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError, EMPTY } from 'rxjs';
import { Router } from '@angular/router';

export const sessionExpirationInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if ((error.status === 401 || error.status === 400) &&
          error.error && error.error.message === 'Token expired') {
        sessionStorage.clear();
        localStorage.clear();
        router.navigate(['/login']);
        return EMPTY;
      }
      return throwError(() => error);
    })
  );
};
