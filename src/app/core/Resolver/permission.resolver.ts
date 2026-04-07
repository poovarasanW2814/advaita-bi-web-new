import { inject } from '@angular/core';
import { ResolveFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { DashboardBasedAccessService } from '../services/dashboard-based-access.service';
import { UserService } from '../AuthServices/user.service';

export const permissionResolver: ResolveFn<boolean> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<boolean> => {
  const dashboardBasedAccessService = inject(DashboardBasedAccessService);
  const userService = inject(UserService);

  return dashboardBasedAccessService.dashboardAccess$.pipe(
    map((menuAccess) => {
      const dashboardId = route.params['name'];
      const userInfoData = userService.getUser();

      console.log('userInfoData', userInfoData);

      if (userInfoData) {
        const roleName = userInfoData.username;
        let hasPermission = menuAccess?.permission_details?.some((perm: any) => perm.dashboard_id === dashboardId && perm.can_view);
        hasPermission = (roleName === 'superadmin') ? true : hasPermission;
        return !!hasPermission;
      }

      return false;
    }),
    catchError(() => of(false))
  );
};


