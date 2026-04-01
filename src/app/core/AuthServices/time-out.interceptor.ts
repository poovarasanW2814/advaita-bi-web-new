import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, throwError, timeout } from 'rxjs';

@Injectable()
export class TimeOutInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const timeoutValue = 180000; // Set your desired timeout 10min value in milliseconds

    return next.handle(request).pipe(
      timeout(timeoutValue),
      catchError((error: any) => {
        console.error('Interceptor - Request error:', error);
        if (error instanceof HttpErrorResponse && error.status === 0) {
          console.error('HTTP request timed out:', error);
        }
        return throwError(() => new Observable());
      })
    );
  }
}
