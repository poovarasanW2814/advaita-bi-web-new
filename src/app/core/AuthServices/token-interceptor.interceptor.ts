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
//   constructor(private logaccessService: LogaccessService,
//     private loaderService: LoaderService
//   ) {
//     console.log(this.logaccessService.getAccessToken())
    
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


import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap, finalize, tap } from 'rxjs/operators';
import { LogaccessService } from './logaccess.service';
import { LoaderService } from '../services/loader.service';
import { PopupService } from '../services/popup.service';
import { Router } from '@angular/router';

@Injectable()
export class TokenInterceptorInterceptor implements HttpInterceptor {
  constructor(
    private logaccessService: LogaccessService,
    private loaderService: LoaderService,
    private popupService : PopupService,
    private router: Router
  ) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // const currentUrl = this.router.url;
    const currentUrl = window.location.href;
    return this.logaccessService.getAuthToken().pipe(
      switchMap(authToken => {
        if (authToken) {
          const authRequest = request.clone({
            setHeaders: { Authorization: `Bearer ${authToken}`
          }
          });

          // let headersConfig: { [name: string]: string } = {
          //   app_url: currentUrl // <-- Add current route here
          // };
  
          // if (authToken) {
          //   headersConfig['Authorization'] = `Bearer ${authToken}`;
          // }
  
          // const authRequest = request.clone({
          //   setHeaders: headersConfig
          // });


          return next.handle(authRequest).pipe(
            tap(
              (event: HttpEvent<any>) => {
              },
              (error: any) => {
      
              },
              () => {
            
              }
            )
          );
        } else {
          return next.handle(request);
        }
      })
    );
  }
}


