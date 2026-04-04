import { Injectable, ViewChild } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Route, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, catchError, first, forkJoin, map, of, switchMap } from 'rxjs';
import { LogaccessService } from './logaccess.service';
import { MenuBasedAccessService } from '../services/menu-based-access.service';
import { DashboardBasedAccessService } from '../services/dashboard-based-access.service';
import { ChartService } from '../services/chart.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  authToken!: string | null;
  roleName! : string;
  userRolename !: string;

  menuBasedPermissionArray: any = [];
  dashboardPermissionArray : any =  []

  constructor(private LogaccesService: LogaccessService, private router: Router, private menuBasedAccessService: MenuBasedAccessService,  private dashboardBasedAccessService : DashboardBasedAccessService, private chartService : ChartService, private userService : UserService) { }


  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree {
    let token = sessionStorage.getItem('authToken');

    let authenticateUser = sessionStorage.getItem('authenticatedUser');

    let userInfoData = this.userService.getUser();

    if(userInfoData){
      // this.roleName = userInfoData.role
      this.roleName = userInfoData.username

    }

    const menuAccess = this.menuBasedAccessService.getMenuAccessSnapshot();
    this.menuBasedPermissionArray = menuAccess?.permission_details ?? [];

    const dashboardAccess = this.dashboardBasedAccessService.getDashboardAccessSnapshot();
    this.dashboardPermissionArray = dashboardAccess?.permission_details ?? [];

    // console.log('state.url in authgurad', state.url)

    const formName = next.data['formName'];
    const dashboardName = next.params['name'];
    const editDashboardName  = next.params['id'];
    const updateUserInfo  = next.params['username'];

    if (authenticateUser && token) {
      
    //  console.log('dashboardPermissionArray', this.dashboardPermissionArray)

     if ( this.dashboardPermissionArray.length == 0) {
      return true;
     }


      // if (this.roleName === 'superadmin' || this.roleName === 'admin') {
        if (this.roleName === 'superadmin' ) {
        return true;
      }

    //  console.log('dashboardPermissionArray', this.dashboardPermissionArray)


      if (formName === 'home') {
        return true;
      }

      if (!this.dashboardPermissionArray || this.dashboardPermissionArray.length === 0) {
        this.router.navigate(['/unauthorized']);
        return false;
      }

      // Check if the user has permission to view the requested form
      let hasPermission = this.menuBasedPermissionArray?.some((perm: any) => perm.form_name === formName && perm.can_view);


      let hasUpdateUserPermission = this.menuBasedPermissionArray?.some((perm: any) => perm.form_name === updateUserInfo && perm.can_update);

      let hasDashboardViewPermission = this.dashboardPermissionArray?.some((perm: any) => perm.dashboard_id === dashboardName && perm.can_view);


      let hasDashboardEditPermission = this.dashboardPermissionArray?.some((perm: any) => perm.dashboard_id === editDashboardName && perm.can_update);

        console.log('hasPermission', hasPermission, hasDashboardViewPermission, hasDashboardEditPermission, hasUpdateUserPermission, this.roleName)

      if (hasPermission || hasDashboardViewPermission || hasDashboardEditPermission || hasUpdateUserPermission) {
        return true;
      } 
      else {
        // Redirect to the unauthorized page
        this.router.navigate(['/unauthorized']);
      // this.router.navigate(['/login']);
        return false;
        
      }

    } else {
      // Redirect to login page;
      this.LogaccesService.setRedirectUrl(state.url);
      this.router.navigate(['/login']);
      return false;
    }



  }

  // canActivate(
  //   next: ActivatedRouteSnapshot,
  //   state: RouterStateSnapshot
  // ): Observable<boolean | UrlTree> {
  //   let token = sessionStorage.getItem('authToken');
  //   let authenticateUser = sessionStorage.getItem('authenticatedUser');
  //   let userData: any = sessionStorage.getItem('userInformation');
  
  //   if (authenticateUser && token) {
  //     // this.router.navigate(['/login']);
  //     // return of(false);

  //     // this.router.navigate(['/login']);
  //     return of(true);
  //   }
  
  //   if (userData) {
  //     userData = JSON.parse(userData);
  //   } else {
  //     this.router.navigate(['/unauthorized']);
  //     return of(false);
  //   }
  
  //   return forkJoin({
  //     userDetail: this.chartService.getUserDetailByUsername(userData.username),
  //     menuAccess: this.menuBasedAccessService.menuAccess$.pipe(first()),
  //     dashboardAccess: this.dashboardBasedAccessService.dashboardAccess$.pipe(first())
  //   }).pipe(
  //     map(({ userDetail, menuAccess, dashboardAccess }) => {
  //       this.roleName = userDetail?.data?.role;
  //       this.menuBasedPermissionArray = menuAccess?.permission_details || [];
  //       this.dashboardPermissionArray = dashboardAccess?.permission_details || [];

  //       console.log('this.roleName', this.roleName)
  
  //       const formName = next.data['formName'];
  //       const dashboardName = next.params['name'];
  //       const editDashboardName = next.params['id'];
  //       const updateUserInfo = next.params['username'];
  
  //       if (this.roleName === 'superadmin' || this.roleName === 'admin') {
  //         return true;
  //       }
  
  //       if (formName === 'home') {
  //         return true;
  //       }
  
  //       let hasPermission = this.menuBasedPermissionArray.some(
  //         (perm: any) => perm.form_name === formName && perm.can_view
  //       );
  
  //       let hasUpdateUserPermission = this.menuBasedPermissionArray.some(
  //         (perm: any) => perm.form_name === updateUserInfo && perm.can_update
  //       );
  
  //       let hasDashboardViewPermission = this.dashboardPermissionArray.some(
  //         (perm: any) => perm.dashboard_id === dashboardName && perm.can_view
  //       );
  
  //       let hasDashboardEditPermission = this.dashboardPermissionArray.some(
  //         (perm: any) => perm.dashboard_id === editDashboardName && perm.can_update
  //       );
  
  //       if (hasPermission || hasDashboardViewPermission || hasDashboardEditPermission || hasUpdateUserPermission) {
  //         return true;
  //       }
  
  //       this.router.navigate(['/unauthorized']);
  //       return false;
  //     }),
  //     catchError((error) => {
  //       console.error('Error fetching permissions:', error);
  //       this.router.navigate(['/unauthorized']);
  //       return of(false);
  //     })
  //   );
  // }
  
  


//   canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
//     let token = sessionStorage.getItem('authToken');
//     let authenticateUser = sessionStorage.getItem('authenticatedUser');
//     let userData: any = sessionStorage.getItem('userInformation');
    
//     if (userData) {
//       userData = JSON.parse(userData);
//       this.chartService.getUserDetailByUsername(userData.username).subscribe((res: any) => {
//         this.roleName = res['data'].role;
//       });
//     }

//     this.loadPermissions()

//     console.log(this.menuBasedPermissionArray, this.dashboardPermissionArray);
  
//     // Handle asynchronous permission checks from the resolver

//     const formName = next.data['formName'];
//     const dashboardName = next.params['name'];
//     const editDashboardName = next.params['id'];
//     const updateUserInfo = next.params['username'];
  
//     if (authenticateUser && token) {
//       if (this.roleName === 'superadmin') {
//         return true;
//       }
  
//       if (formName === 'home') {
//         return true;
//       }

//       if (!this.dashboardPermissionArray) {
//         // Wait until dashboardPermissionArray is available
//         this.router.navigate(['/unauthorized']);
//         return false; // You can also display a loading indicator here
//       }
  
      
  
//       const hasPermission = this.menuBasedPermissionArray?.some((perm: any) => perm.form_name === formName && perm.can_view);
//       const hasUpdateUserPermission = this.menuBasedPermissionArray?.some((perm: any) => perm.form_name === updateUserInfo && perm.can_update);
//       const hasDashboardViewPermission = this.dashboardPermissionArray?.some((perm: any) => perm.dashboard_id === dashboardName && perm.can_view);
//       const hasDashboardEditPermission = this.dashboardPermissionArray?.some((perm: any) => perm.dashboard_id === editDashboardName && perm.can_update);
  
//       if (hasPermission || hasDashboardViewPermission || hasDashboardEditPermission || hasUpdateUserPermission) {
//         return true;
//       } else {
//         this.router.navigate(['/unauthorized']);
//         return false;
//       }
//     } else {
//       this.router.navigate(['/login']);
//       return false;
//     }
// }




  getAuthToken(): Observable<string | null> {
    // this.authToken = localStorage.getItem('authToken');
    this.authToken = sessionStorage.getItem('authToken');
    return of(this.authToken);
  }

  private loadPermissions() {
    this.menuBasedAccessService.menuAccess$.subscribe((menuAccess) => {

      this.menuBasedPermissionArray = menuAccess?.permission_details ? menuAccess?.permission_details : [];

    });

    this.dashboardBasedAccessService.dashboardAccess$.subscribe((menuAccess) => {

      this.dashboardPermissionArray = menuAccess?.permission_details ? menuAccess?.permission_details : [];

    });
  }

}
