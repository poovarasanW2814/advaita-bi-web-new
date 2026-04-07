// import { Injectable } from '@angular/core';
// import {
//   HttpRequest,
//   HttpHandler,
//   HttpEvent,
//   HttpInterceptor
// } from '@angular/common/http';
// import { Observable, from } from 'rxjs';
// import { switchMap } from 'rxjs/operators';
// import { LogaccessService } from './logaccess.service';
// import { LoaderService } from '../services/loader.service';

// @Injectable()
// export class TokenInterceptorInterceptor implements HttpInterceptor {
//   private readonly logaccessService = inject(LogaccessService);
//   private readonly loaderService = inject(LoaderService);
//   constructor() {
//     //     console.log(this.logaccessService.getAccessToken())
//   }

//   intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//     this.loaderService.show();
//     //console.log(this.logaccessService.getAccessToken())
//     return this.logaccessService.getAuthToken().pipe(
//       switchMap(authToken => {
//         // console.log(authToken)

//         if (authToken) {
//         //  console.log(authToken)
//           const authRequest = request.clone({
//             setHeaders: { Authorization: `Bearer ${authToken}` }
//           });
//           // this.loaderService.hide();
//           return next.handle(authRequest);
//         } else {
//           this.loaderService.hide();
//           return next.handle(request);
//         }
//       })
//     );
//   }
// }


import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { LogaccessService } from './logaccess.service';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const logaccessService = inject(LogaccessService);
  return logaccessService.getAuthToken().pipe(
    switchMap(authToken => {
      if (authToken) {
        const authRequest = req.clone({
          setHeaders: { Authorization: `Bearer ${authToken}` }
        });
        return next(authRequest);
      } else {
        return next(req);
      }
    })
  );
};


