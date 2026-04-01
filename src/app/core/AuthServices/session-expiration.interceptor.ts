import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, tap, catchError, throwError, EMPTY } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class SessionExpirationInterceptor implements HttpInterceptor {

  // constructor() {}

  // intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
  //   return next.handle(request);
  // }

  constructor(private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // Handle HTTP error responses - only redirect if status is 400/401 AND message is "Token expired"
        if ((error.status === 401 || error.status === 400) && 
            error.error && error.error.message === 'Token expired') {
          sessionStorage.clear();
          localStorage.clear();
          this.router.navigate(['/login']);
          // Return EMPTY to complete the observable without error, preventing popup display
          return EMPTY;
        }
        // For all other errors, let them propagate normally to show in popup
        return throwError(() => error);
      })
    );
  }
}
