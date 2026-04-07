import { CanDeactivateFn } from '@angular/router';
import { Observable } from 'rxjs';
import { CanComponentDeactivate } from './can-component-deactivate';

export const canDeactivateGuard: CanDeactivateFn<CanComponentDeactivate> = (component): boolean | Observable<boolean> => {
  return component.canDeactivate ? component.canDeactivate() : true;
};