import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanDeactivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { CanComponentDeactivate } from './can-component-deactivate';

@Injectable({
  providedIn: 'root'
})
// export class CanDeactivateGuard implements CanDeactivate<CanComponentDeactivate> {
//   canDeactivate(
//     component: CanComponentDeactivate
//   ): boolean | Observable<boolean> {
//     return component.canDeactivate ? component.canDeactivate() : true;
//   }

// }

export class CanDeactivateGuard implements CanDeactivate<CanComponentDeactivate> {
  canDeactivate(component: CanComponentDeactivate): boolean | Observable<boolean> {
    return component.canDeactivate ? component.canDeactivate() : true;
  }
}