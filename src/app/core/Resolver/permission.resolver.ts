import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of, forkJoin } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { DashboardBasedAccessService } from '../services/dashboard-based-access.service';
import { MenuBasedAccessService } from '../services/menu-based-access.service';
import { ChartService } from '../services/chart.service';
import { UserService } from '../AuthServices/user.service';


@Injectable({
  providedIn: 'root'
})
export class PermissionResolver implements Resolve<boolean> {
  constructor(
    private menuBasedAccessService: MenuBasedAccessService,
    private dashboardBasedAccessService: DashboardBasedAccessService, private chartService : ChartService, private userService : UserService
  ) {}

   roleName! : string;

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.dashboardBasedAccessService.dashboardAccess$.pipe(
      map((menuAccess) => {
        const formName = route.data['formName'];
        const dashboardId = route.params['name'];

        let userData: any = sessionStorage.getItem('userInformation');
        let userInfoData = this.userService.getUser();

        console.log('userInfoData', userInfoData)

        if(userInfoData){
          // this.roleName = userInfoData.role;
          this.roleName = userInfoData.username;

          let hasPermission = menuAccess?.permission_details?.some((perm: any) => perm.dashboard_id === dashboardId && perm.can_view);
       
          hasPermission = (this.roleName === 'superadmin'  ) ?  true : hasPermission;

          // console.log(this.roleName, hasPermission)

          return !!hasPermission;
        }

        return false


      }),
      catchError(() => {
        return of(false); // Fallback if there is an error fetching the permissions
      })
    );
  }


  
}


