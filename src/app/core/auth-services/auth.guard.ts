import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { LogaccessService } from './logaccess.service';
import { MenuBasedAccessService } from '../services/menu-based-access.service';
import { DashboardBasedAccessService } from '../services/dashboard-based-access.service';
import { ChartService } from '../services/chart.service';
import { UserService } from './user.service';

export const authGuard: CanActivateFn = (
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): boolean | UrlTree => {
  const logaccesService = inject(LogaccessService);
  const router = inject(Router);
  const menuBasedAccessService = inject(MenuBasedAccessService);
  const dashboardBasedAccessService = inject(DashboardBasedAccessService);
  const userService = inject(UserService);

  let token = sessionStorage.getItem('authToken');
  let authenticateUser = sessionStorage.getItem('authenticatedUser');
  let userInfoData = userService.getUser();

  let roleName = '';
  if (userInfoData) {
    roleName = userInfoData.username;
  }

  const menuAccess = menuBasedAccessService.getMenuAccessSnapshot();
  const menuBasedPermissionArray = menuAccess?.permission_details ?? [];

  const dashboardAccess = dashboardBasedAccessService.getDashboardAccessSnapshot();
  const dashboardPermissionArray = dashboardAccess?.permission_details ?? [];

  const formName = next.data['formName'];
  const dashboardName = next.params['name'];
  const editDashboardName = next.params['id'];
  const updateUserInfo = next.params['username'];

  if (authenticateUser && token) {
    if (dashboardPermissionArray.length == 0) {
      return true;
    }

    if (roleName === 'superadmin') {
      return true;
    }

    if (formName === 'home') {
      return true;
    }

    if (!dashboardPermissionArray || dashboardPermissionArray.length === 0) {
      router.navigate(['/unauthorized']);
      return false;
    }

    let hasPermission = menuBasedPermissionArray?.some((perm: any) => perm.form_name === formName && perm.can_view);
    let hasUpdateUserPermission = menuBasedPermissionArray?.some((perm: any) => perm.form_name === updateUserInfo && perm.can_update);
    let hasDashboardViewPermission = dashboardPermissionArray?.some((perm: any) => perm.dashboard_id === dashboardName && perm.can_view);
    let hasDashboardEditPermission = dashboardPermissionArray?.some((perm: any) => perm.dashboard_id === editDashboardName && perm.can_update);

    console.log('hasPermission', hasPermission, hasDashboardViewPermission, hasDashboardEditPermission, hasUpdateUserPermission, roleName);

    if (hasPermission || hasDashboardViewPermission || hasDashboardEditPermission || hasUpdateUserPermission) {
      return true;
    } else {
      router.navigate(['/unauthorized']);
      return false;
    }
  } else {
    logaccesService.setRedirectUrl(state.url);
    router.navigate(['/login']);
    return false;
  }
};
