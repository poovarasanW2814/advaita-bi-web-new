import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit, ViewChild, inject} from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AnimationSettingsModel, DialogComponent, DialogModule } from '@syncfusion/ej2-angular-popups';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/core/auth-services/user.service';
import { ChartService } from 'src/app/core/services/chart.service';
import { DashboardBasedAccessService } from 'src/app/core/services/dashboard-based-access.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { MenuBasedAccessService } from 'src/app/core/services/menu-based-access.service';
import { PopupService } from 'src/app/core/services/popup.service';
import { RoleDashboardAccessComponent } from '../role-dashboard-access/role-dashboard-access.component';
import { UserDashboardAccessComponent } from '../user-dashboard-access/user-dashboard-access.component';
import { NgIf, NgFor, NgStyle } from '@angular/common';

interface Dashboard {
  dashboard_id: string;
  dashboard_name: string;
  description?: string;
  group_name: string[];
  icon?: string;
  [key: string]: any; // For any additional properties
}

interface Group {
  icon?: string;
  id: string;
  group_name: string;
  dashboards: Dashboard[];
  group_description?: string;
  header_background_color?: string,
  body_background_color?: string,
}


@Component({
    selector: 'app-view-grouped-dashboard',
    templateUrl: './view-grouped-dashboard.component.html',
    styleUrls: ['./view-grouped-dashboard.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgIf, FormsModule, RouterLink, NgFor, NgStyle, DialogModule, ReactiveFormsModule, RoleDashboardAccessComponent, UserDashboardAccessComponent]
})


export class ViewGroupedDashboardComponent implements OnInit, OnDestroy {
  sidebarDashboards: Dashboard[] = [];

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly chartService = inject(ChartService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly menuBasedAccessService = inject(MenuBasedAccessService);
  private readonly dashboardBasedAccessService = inject(DashboardBasedAccessService);
  private readonly popupService = inject(PopupService);
  private readonly loaderService = inject(LoaderService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly userService = inject(UserService);

  dialogHeader: string = '';
  dialogCloseIcon: Boolean = true;
  dialogWidth: string = '500px';
  dialogContent: string = '';
  dialogType: 'copy' | 'role' | 'user' = 'copy';
  dialogVisible: boolean = false;
  dialogdragging: Boolean = true;
  animationSettings: AnimationSettingsModel = { effect: 'None' };
  isModal: Boolean = true;
  target: string = '.grouping-target';
  showCloseIcon: Boolean = false;
  visible: Boolean = false;
  dashboardDataList: Group[] = [];
  flattenedDashboards: Dashboard[] = [];
  unGroupedDashboards: Dashboard[] = [];
  availableDashboards: Dashboard[] = [];
  showToaster: boolean = false;
  toasterMessage: string = '';
  toasterType: 'success' | 'error' = 'success';
  role_id !: number;
  user_id !: number;
  role: any;
  selectedDashboard: any = null;
  dashboardBasedPermssionArray: any[] = []
  copyDashboardForm!: FormGroup;
  roleDashboardPermissionObj: any;
  userDashboardPermissionObj: any;
  isGroupedView: boolean = false;
  //role dashboard permission

  @ViewChild('roleBasedDialog') roleBasedDialog!: RoleDashboardAccessComponent;
  roleDashboardObj: any = {};
  roleSubmitFlag: boolean = true;
  roleUpdateFlag: boolean = false;

  //user dashboard permission 
  userDashboardObj: any = {};
  @ViewChild('userBasedDialog') userBasedDialog!: UserDashboardAccessComponent;
  userSubmitFlag: boolean = true;
  userUpdateFlag: boolean = false;
  permissionObj: any;
  userPermissionViewObj: any;
  rolePermissionViewObj: any;

   imageUrls = [
    './../../../../assets/images/db2.jpg',
    './../../../../assets/images/db3.jpg',
    './../../../../assets/images/db4.jpg',
    './../../../../assets/images/db5.jpg',
    './../../../../assets/images/db6.jpg',
    './../../../../assets/images/db7.jpg',
    './../../../../assets/images/db8.jpg',
    './../../../../assets/images/db9.jpg',


  ];
  imageFlag: boolean = true;
  isListview: boolean = true;
  isCardView: boolean = false;

  private applyDashboardSetup(data: any): void {
    if (!data) {
      return;
    }

    this.imageFlag = data.show_image;
    this.dashboardView(data.display_type);
  }

  private loadDefaultDashboardSetup(): void {
    this.chartService.getDashboardSetupByUserId(1).subscribe({
      next: (res: any) => {
        this.applyDashboardSetup(res?.data);
      },
      error: (err: any) => {
        console.log('Default dashboard setup fetch failed', err);
      }
    });
  }

  toggleView() {
    this.isGroupedView = !this.isGroupedView;
  }

  toggleListCardView() {
    this.isListview = !this.isListview;
  }

  dashboardView(displayType : string){
    const normalizedDisplayType = (displayType || '').toLowerCase();

    this.isGroupedView = false;

    if(normalizedDisplayType === 'card'){
      this.isCardView = true;
      this.isListview = false;
    }else if(normalizedDisplayType === 'list'){
      this.isCardView = false;
      this.isListview = true;
    }else if(normalizedDisplayType === 'group' || normalizedDisplayType === 'grouped'){
      this.isCardView = false;
      this.isListview = false;
      this.isGroupedView = true;
    }
  }

  private menuAccessSub!: Subscription;

  menuBasedPermissionControlArray : any;
  ngOnInit(): void {

    let userInfoData = this.userService.getUser();
    this.role = userInfoData.username;
    console.log('userInfoData', userInfoData);

    let userData: any = sessionStorage.getItem('userInformation');

    
    this.menuAccessSub = this.menuBasedAccessService.menuAccess$.subscribe((menuAccess) => {
      let menuBasedAccess = menuAccess;
      let menuBasedPermissionControlArray = menuBasedAccess?.permission_details;

      const formNameToFind = 'home';
      const permissionDetailsForHome = menuBasedPermissionControlArray?.find(
        (permission: any) => permission.form_name === formNameToFind
      );

      if (permissionDetailsForHome) {
        this.permissionObj = permissionDetailsForHome
      }

      const permissionDetailsForUserPermission = menuBasedPermissionControlArray?.find(
        (permission: any) => permission.form_name === 'userPermission'
      );

      if (permissionDetailsForUserPermission) {
        this.userPermissionViewObj = permissionDetailsForUserPermission
      }

      const permissionDetailsForrolePermission = menuBasedPermissionControlArray?.find(
        (permission: any) => permission.form_name === 'rolePermission'
      );

      if (permissionDetailsForrolePermission) {
        this.rolePermissionViewObj = permissionDetailsForrolePermission
      }


      const roleDashboardPermssions = menuBasedPermissionControlArray?.find(
        (permission: any) => permission.form_name === 'roleBaseddashboardAccess'
      );


      const userDashboardPermssions = menuBasedPermissionControlArray?.find(
        (permission: any) => permission.form_name === 'userBaseddashboardAccess'
      );



      if (roleDashboardPermssions) {
        this.roleDashboardPermissionObj = roleDashboardPermssions
      }

      if (userDashboardPermssions) {
        this.userDashboardPermissionObj = userDashboardPermssions
      }

      

      const dashboardSetupPermissionArray = menuBasedPermissionControlArray?.find(
        (permission: any) => permission.form_name === 'dashboardSetup'
      );

      if (dashboardSetupPermissionArray) {
        this.dashboardSetupPermissionObj = roleDashboardPermssions
      }


    });


    let dashboardBasedLocalStorageData = this.dashboardBasedAccessService.updatedashboardAccessFromLocalStorage();
    this.isListview=false
    console.log('dashboardBasedLocalStorageData', dashboardBasedLocalStorageData);

    let role_id = dashboardBasedLocalStorageData?.role_id ? userInfoData.role_id : userInfoData.role_id ;
    let user_id = dashboardBasedLocalStorageData?.user_id ? userInfoData?.user_id : null;

  
    console.log(role_id, user_id)

     if (userInfoData.username == 'superadmin') {
      console.log('Role is superadmin, fetching all dashboard details directly...');
      this.loadDashboardData();

      }else if (role_id && user_id) {

      this.chartService.getAllUserDashboardPermissionByRoleidUserId(role_id, user_id)
      .subscribe({

        next: (res:any) => {

          if (res.success && res.data) {

            let data = res.data;
            this.dashboardBasedPermssionArray = data?.permission_details || [];
            this.dashboardBasedAccessService.setdashboardAccess(data);
            this.loadDashboardData();

          } else {

            // FALLBACK TO ROLE PERMISSION
            this.getAllRoledashboardPermissionDetailsArray(role_id);

          }
        },

        error: (err:any) => {

          console.log('User permission not found â†’ loading role permission');

          // MAIN FIX
          this.getAllRoledashboardPermissionDetailsArray(role_id);

        }

      });
      
    } else {
      this.chartService.getAllRoleDashboardPermissionByRoleid(role_id).subscribe((res: any) => {
        console.log('Role-based permission_details', res);

        if (res.success) {
          let data = res['data']
          let dashboardBasedPermssionArray = res['data']?.permission_details || [];
          console.log('Role-based permission_details', res['data']);
          this.dashboardBasedAccessService.setdashboardAccess(data);
          this.dashboardBasedPermssionArray = dashboardBasedPermssionArray
          this.loadDashboardData();

        }else{
        this.loaderService.hide();
        this.popupService.showPopup({
          message: res.message,
          statusCode: res.status,
          status: false
        });
        }
      },

      (err:any) => {
        console.log('error', err)
        this.loaderService.hide();
        const errorMessage = err.error && err.error.message ? err.error.message : err.message;
        this.popupService.showPopup({
          message: errorMessage,
          statusCode: err.status,
          status: false
        });
        // this.showToasterMessage(err.message, 'error')
      }
    );
    }

    this.chartService.getDashboardSetupByUserId(userInfoData.user_id).subscribe({
      next: (res: any) => {
        const data = res?.data;

        if (res?.success && data != null) {
          this.applyDashboardSetup(data);
        } else {
          this.loadDefaultDashboardSetup();
        }
      },
      error: (err: any) => {
        console.log('User dashboard setup fetch failed', err);
        this.loadDefaultDashboardSetup();
      }
    })

    this.chartService.setTitle('Grouped Dashboards');

    this.copyDashboardForm = this.formBuilder.group({
      dashboard_name: ['', Validators.required],
      description: ['']
    });

  }

  ngOnDestroy(): void {
    this.menuAccessSub?.unsubscribe();
  }

  dashboardSetupPermissionObj : any;
  


  getAllRoledashboardPermissionDetailsArray(role_id: any) {
    this.chartService.getAllRoleDashboardPermissionByRoleid(role_id).subscribe((res: any) => {
      if (res.success) {
        let data = res['data'];
        this.dashboardBasedPermssionArray = res['data']?.permission_details || [];
        this.dashboardBasedAccessService.setdashboardAccess(data);
        this.loadDashboardData();
      } else {

        this.dashboardBasedPermssionArray = [];
        this.loadDashboardData();
      }
    });
  }



  getAllUserDashboardsPermissionsArray(role_id: any, user_id: any, role: any) {
    if (this.role === 'superadmin') {
      this.loadDashboardData();
      return;
    }

    this.chartService.getAllUserDashboardPermissionByRoleidUserId(role_id, user_id).subscribe((res: any) => {
      if (res.success) {
        let data = res['data'];
        let dashboardBasedPermssionArray = data?.permission_details || [];

        const allFalse = dashboardBasedPermssionArray.every((obj: any) => !obj.can_view);

        if (allFalse) {
          this.getAllRoledashboardPermissionDetailsArray(role_id);
        } else {
          this.dashboardBasedPermssionArray = data?.permission_details;
          this.dashboardBasedAccessService.setdashboardAccess(data);
          this.loadDashboardData();
        }
      } 
      else {
        // this.getAllRoledashboardPermissionDetailsArray(role_id);
      }
    });
  }

  loadDashboardData() {
    this.loaderService.show()
    this.chartService.getAllDashboardDetailsWithEmptyData().subscribe(
      (res: any) => {
      console.log('res in grouping page', res);
      const dashboardData = res['data'];
      this.unGroupedDashboards = res['data'];
      this.availableDashboards = [...this.unGroupedDashboards]; // Store all dashboards

      if (this.role === 'superadmin') {
        this.processDashboardData(dashboardData);
        this.loaderService.hide();
        this.cdr.detectChanges();
        return;
      }

      // For others, ensure permission array is available
      if (!this.dashboardBasedPermssionArray || this.dashboardBasedPermssionArray.length === 0) {
        console.warn('dashboardBasedPermssionArray not available yet.');
        this.loaderService.hide();
        this.cdr.detectChanges();
        return;
      }

        const matchedDashboards = dashboardData
        .map((dashboard: any) => {
          const permission = this.dashboardBasedPermssionArray.find(
            p => p.dashboard_id === dashboard.dashboard_id
          );
          
          if (!permission) return null;

          return {
            ...permission,
            ...dashboard,
          };
        })
        .filter(Boolean);

        console.log('res in matchedDashboards', matchedDashboards);
        this.processDashboardData(matchedDashboards);
        this.loaderService.hide();
        this.cdr.markForCheck();
        this.cdr.detectChanges();
    
    },
    (err:any) => {
      console.log('error', err)
      this.loaderService.hide();
      this.cdr.detectChanges();
      const errorMessage = err.error && err.error.message ? err.error.message : err.message;
      this.popupService.showPopup({
        message: errorMessage,
        statusCode: err.status,
        status: false
      });
    }
  );
  }

// old code
  // processDashboardData(dashboardData: any[]) {
  //   const groupedDashboards: any[] = [];
  //   const uniqueGroupNames: Set<string> = new Set();

  //   const colorPairs = [
  //     { header: 'rgb(100 164 230 / 84%)', body: 'rgb(190 212 235 / 63%)' }, // Dark Blue & Light Gray
  //     { header: '10% center rgb(232 53 97 / 94%)', body: 'rgb(231, 129, 154) 10%' }, // Dark Blue & Light Blue

  //     { header: 'rgb(69 231 69)', body: 'rgb(163 230 163 / 84%)' }, // Dark Green & Light Green
  //     { header: 'rgb(230 100 151 / 84%)', body: 'rgb(235 190 220 / 63%)' }, // Dark Red & Light Red
  //     { header: 'rgb(227 230 100 / 84%)', body: 'rgb(234 236 155 / 38%)' }, // Dark Purple & Light Purple
  //     { header: 'rgb(185 239 40 / 84%)', body: 'rgb(212 236 148 / 55%)' }, // Dark Orange & Light Orange
  //     { header: 'rgb(245, 165, 5)', body: 'rgb(240, 204, 132) 10%' }, // Dark Teal & Light Teal
  //     { header: 'rgb(227, 30, 79) 10%', body: 'rgb(231, 129, 154) 10%' }, // Dark Blue & Light Blue
  //     { header: '#2AFADF', body: 'rgb(151, 248, 235)' }, // Dark Red & Light Pink
  //     { header: '#4C83FF', body: 'rgb(165, 190, 249) 100%)' }, // Dark Purple & Light Lavender
  //     { header: '#654321', body: '#ffcc99' }, // Dark Brown & Light Peach
  //   ];

  //   const backgroundColors = [
  //     "linear-gradient(135deg, #252c42 10%, #3a39c4 100%)",
  //     "linear-gradient(135deg, #F12711 10%, #F5AF19 100%)",
  //     "linear-gradient(135deg, #cc208e 10%, #6713d2 100%)",
  //     "linear-gradient(135deg, #ff0844 10%, #ffb199 100%)",
  //     "linear-gradient(135deg, #2AFADF 10%, #4C83FF 100%)"
  //   ];
  
  //     // Assign image URL and background color
  //  dashboardData = dashboardData.map((item: any, index: number) => ({
  //   ...item,
  //   imageUrl: this.imageUrls[index % this.imageUrls.length],
  //   backgroundColor: backgroundColors[index % backgroundColors.length],
  //   imageFlag: this.imageFlag // assuming imageFlag is defined in your class
  // }));
  

  // this.unGroupedDashboards = [...dashboardData];
  //  this.dashboardListWithPermission = [...this.unGroupedDashboards]
  //   const groupColorMap = new Map<string, { header: string; body: string }>();
  //   let colorIndex = 0;

  //   dashboardData.forEach((dashboard: any) => {
  //     if (this.role !== 'superadmin' && !dashboard.can_view) {
  //       return; // Only non-superadmins are restricted
  //     }
  //     const groupNames = dashboard.group_name;

  //     if (!groupNames) return;

  //     groupNames.forEach((groupName: string) => {
  //       if (!groupName || typeof groupName !== 'string' || groupName.trim() === '') return;

  //       uniqueGroupNames.add(groupName);

  //       // Assign a unique color pair per group
  //       if (!groupColorMap.has(groupName)) {
  //         groupColorMap.set(groupName, colorPairs[colorIndex % colorPairs.length]);
  //         colorIndex++;
  //       }

  //       let group = groupedDashboards.find(g => g.group_name === groupName);

  //       if (!group) {
  //         const color = groupColorMap.get(groupName);

  //         group = {
  //           id: (groupedDashboards.length + 1).toString(),
  //           group_name: groupName,
  //           header_background_color: color?.header,
  //           body_background_color: color?.body,

  //           dashboards: []
  //         };
  //         groupedDashboards.push(group);
  //       }

  //       if (!group.dashboards.find((d: any) => d.dashboard_id === dashboard.dashboard_id)) {
  //         group.dashboards.push(dashboard);
  //       }
  //     });
  //   });

  //   this.dashboardDataList = groupedDashboards;
  //   this.fullDashboardDataList = this.dashboardDataList

  //   console.log('dashboard list', this.dashboardDataList);
  //   this.updateFlattenedDashboards();

  //        // Force change detection after processing
  //   this.cdr.markForCheck();
  //   setTimeout(() => this.cdr.detectChanges(), 0);
  // }
  processDashboardData(dashboardData: any[]) {
    const groupedDashboards: any[] = [];
    const uniqueGroupNames: Set<string> = new Set();
  
    const colorPairs = [
      { header: 'rgb(100 164 230 / 84%)', body: 'rgb(190 212 235 / 63%)' }, // Dark Blue & Light Gray
      { header: '10% center rgb(232 53 97 / 94%)', body: 'rgb(231, 129, 154) 10%' }, // Dark Blue & Light Blue
      { header: 'rgb(69 231 69)', body: 'rgb(163 230 163 / 84%)' }, // Dark Green & Light Green
      { header: 'rgb(230 100 151 / 84%)', body: 'rgb(235 190 220 / 63%)' }, // Dark Red & Light Red
      { header: 'rgb(227 230 100 / 84%)', body: 'rgb(234 236 155 / 38%)' }, // Dark Purple & Light Purple
      { header: 'rgb(185 239 40 / 84%)', body: 'rgb(212 236 148 / 55%)' }, // Dark Orange & Light Orange
      { header: 'rgb(245, 165, 5)', body: 'rgb(240, 204, 132) 10%' }, // Dark Teal & Light Teal
      { header: 'rgb(227, 30, 79) 10%', body: 'rgb(231, 129, 154) 10%' }, // Dark Blue & Light Blue
      { header: '#2AFADF', body: 'rgb(151, 248, 235)' }, // Dark Red & Light Pink
      { header: '#4C83FF', body: 'rgb(165, 190, 249) 100%)' }, // Dark Purple & Light Lavender
      { header: '#654321', body: '#ffcc99' }, // Dark Brown & Light Peach
    ];
  
    const backgroundColors = [
      "linear-gradient(135deg, #252c42 10%, #3a39c4 100%)",
      "linear-gradient(135deg, #F12711 10%, #F5AF19 100%)",
      "linear-gradient(135deg, #cc208e 10%, #6713d2 100%)",
      "linear-gradient(135deg, #ff0844 10%, #ffb199 100%)",
      "linear-gradient(135deg, #2AFADF 10%, #4C83FF 100%)"
    ];
  
    const processAndGroupDashboards = (dashboards: any[]) => {
      dashboards.forEach((dashboard, index) => {
        dashboard.backgroundColor = backgroundColors[index % backgroundColors.length];
        dashboard.imageFlag = this.imageFlag;
      });
  
      this.unGroupedDashboards = [...dashboards];
      this.dashboardListWithPermission = [...this.unGroupedDashboards];
      this.sidebarDashboards = [...this.unGroupedDashboards];
      const groupColorMap = new Map<string, { header: string; body: string }>();
      let colorIndex = 0;
  
      dashboards.forEach((dashboard: any) => {
        if (this.role !== 'superadmin' && !dashboard.can_view) {
          return; // Only non-superadmins are restricted
        }
        const groupNames = dashboard.group_name;
  
        if (!groupNames) return;
  
        groupNames.forEach((groupName: string) => {
          if (!groupName || typeof groupName !== 'string' || groupName.trim() === '') return;
  
          uniqueGroupNames.add(groupName);
  
          if (!groupColorMap.has(groupName)) {
            groupColorMap.set(groupName, colorPairs[colorIndex % colorPairs.length]);
            colorIndex++;
          }
  
          let group = groupedDashboards.find(g => g.group_name === groupName);
  
          if (!group) {
            const color = groupColorMap.get(groupName);
  
            group = {
              id: (groupedDashboards.length + 1).toString(),
              group_name: groupName,
              header_background_color: color?.header,
              body_background_color: color?.body,
              dashboards: []
            };
            groupedDashboards.push(group);
          }
  
          if (!group.dashboards.find((d: any) => d.dashboard_id === dashboard.dashboard_id)) {
            group.dashboards.push(dashboard);
          }
        });
      });
  
      this.dashboardDataList = groupedDashboards;
      this.fullDashboardDataList = this.dashboardDataList;
  
      console.log('dashboard list', this.dashboardDataList);
      this.updateFlattenedDashboards();
  
      this.cdr.markForCheck();
      this.cdr.detectChanges();
    };
  
    // Show dashboards immediately with placeholder/default images
    processAndGroupDashboards(dashboardData);
    
    // Then fetch and update images asynchronously
    const dashboardsWithImage = dashboardData.filter(d => d.is_image === true);
    if (dashboardsWithImage.length === 0) {
      return;
    }
  
    dashboardsWithImage.forEach(dashboard => {
      this.chartService.getDashboardImageById(dashboard.dashboard_id).subscribe({
        next: (res: any) => {
          if (res?.data?.dashboard_image) {
            dashboard.dashboard_image = res.data.dashboard_image;
            // Trigger change detection after each image is loaded
            this.cdr.detectChanges();
          }
        },
        error: err => {
          console.error(`Failed to load image for dashboard ${dashboard.dashboard_id}`, err);
        }
      });
    });
  }
// new code
// processDashboardData(dashboardData: any[]) {
//   const groupedDashboards: any[] = [];
//   const uniqueGroupNames: Set<string> = new Set();

//   const colorPairs = [
//     { header: 'linear-gradient(140deg, #73cfd7ff -12.54%, #3fe3f1ff -12.54%)', body: 'rgb(190 212 235 / 63%)' },
//     { header: 'linear-gradient(140deg, #e3a06dff -12.54%, rgba(218, 115, 68, 0.9) 109.98%)', body: 'rgba(227, 172, 131, 1)' },
//     { header: 'linear-gradient(140deg, #8ecf8eff -12.54%, rgba(89, 192, 89, 0.9) 109.98%)', body: 'rgb(163 230 163)' },
//     { header: 'linear-gradient(140deg, #d08ba7ff -12.54%, rgba(194, 105, 148, 0.9) 109.98%)', body: 'rgb(235 190 220)' },
//     { header: 'linear-gradient(140deg, #d5d68bff -12.54%, rgba(197, 197, 103, 0.9) 109.98%)', body: 'rgb(234 236 155)' },
//     { header: 'linear-gradient(140deg, #b8ca84ff -12.54%, #ceed78ff -12.54%)', body: 'rgb(212 236 148)' },
//     { header: 'linear-gradient(140deg, #cab07cff -12.54%, rgba(183, 146, 90, 0.9) 109.98%)', body: 'rgba(221, 199, 155, 1)' },
//     { header: 'linear-gradient(140deg, #c483c2ff -12.54%, rgba(228, 99, 235, 0.9) 109.98%)', body: 'rgba(218, 158, 208, 1)' },
//     { header: 'linear-gradient(140deg, #93d2c9ff -12.54%, rgba(105, 183, 205, 0.9) 109.98%)', body: 'rgba(164, 221, 214, 1)' },
//     { header: 'linear-gradient(140deg, #a9b5d2ff -12.54%, rgba(108, 141, 216, 0.9) 109.98%)', body: 'rgba(172, 184, 212, 1)' },
//     { header: 'linear-gradient(140deg, #d6b696ff -12.54%, rgba(191, 144, 97, 0.9) 109.98%)', body: '#dcc2a9ff' },
//   ];

//   const backgroundColors = [
//     "linear-gradient(135deg, rgb(240, 204, 132) 10%, rgb(47, 35, 45) 100%)",
//     "linear-gradient(135deg, #e94b3aff 10%, #F5AF19 100%)",
//     "linear-gradient(135deg, #cc3796ff 10%, #7733cfff 100%)",
//     "linear-gradient(135deg, rgb(231, 129, 154) 10%, #ffb199 100%)",
//     "linear-gradient(135deg, rgb(151, 248, 235) 10%, rgb(165, 190, 249) 100%)"
//   ];

//   // Create a map to track dashboard colors by group
//   const groupColorMap = new Map<string, { header: string; body: string }>();
//   let groupColorIndex = 0;

//   // First pass: assign group colors
//   dashboardData.forEach((dashboard: any) => {
//     const groupNames = dashboard.group_name;
//     if (!groupNames || !Array.isArray(groupNames)) return;

//     groupNames.forEach((groupName: string) => {
//       if (!groupName || typeof groupName !== 'string' || groupName.trim() === '') return;
      
//       if (!groupColorMap.has(groupName)) {
//         groupColorMap.set(groupName, colorPairs[groupColorIndex % colorPairs.length]);
//         groupColorIndex++;
//       }
//     });
//   });

//   // Second pass: apply colors to dashboards
//   dashboardData = dashboardData.map((item: any, index: number) => {
//     // Get the first group's color, or use index-based color if no group
//     let dashboardColor = colorPairs[index % colorPairs.length];
    
//     if (item.group_name && Array.isArray(item.group_name) && item.group_name.length > 0) {
//       const firstGroup = item.group_name[0];
//       const groupColor = groupColorMap.get(firstGroup);
//       if (groupColor) {
//         dashboardColor = groupColor;
//       }
//     }

//     return {
//       ...item,
//       imageUrl: this.imageUrls[index % this.imageUrls.length],
//       backgroundColor: backgroundColors[index % backgroundColors.length],
//       header_background_color: dashboardColor.header,
//       body_background_color: dashboardColor.body,
//       imageFlag: this.imageFlag
//     };
//   });

//   this.unGroupedDashboards = [...dashboardData];
//   this.dashboardListWithPermission = [...this.unGroupedDashboards];

//   // Build grouped structure
//   dashboardData.forEach((dashboard: any) => {
//     if (this.role !== 'superadmin' && !dashboard.can_view) {
//       return;
//     }
    
//     const groupNames = dashboard.group_name;
//     if (!groupNames) return;

//     groupNames.forEach((groupName: string) => {
//       if (!groupName || typeof groupName !== 'string' || groupName.trim() === '') return;

//       uniqueGroupNames.add(groupName);

//       let group = groupedDashboards.find(g => g.group_name === groupName);

//       if (!group) {
//         const color = groupColorMap.get(groupName);

//         group = {
//           id: (groupedDashboards.length + 1).toString(),
//           group_name: groupName,
//           header_background_color: color?.header,
//           body_background_color: color?.body,
//           dashboards: []
//         };
//         groupedDashboards.push(group);
//       }

//       if (!group.dashboards.find((d: any) => d.dashboard_id === dashboard.dashboard_id)) {
//         group.dashboards.push(dashboard);
//       }
//     });
//   });

//   this.dashboardDataList = groupedDashboards;
//   this.fullDashboardDataList = this.dashboardDataList;

//   // console.log('dashboard list with colors', this.dashboardDataList);
//   // console.log('ungrouped dashboards with colors', this.unGroupedDashboards);
  
//   this.updateFlattenedDashboards();

//   // Force change detection after processing
//   this.cdr.markForCheck();
//   setTimeout(() => this.cdr.detectChanges(), 0);
// }
  private updateFlattenedDashboards() {
    this.flattenedDashboards = this.dashboardDataList.reduce((acc: any[], group: any) => {
      return [...acc, ...group.dashboards];
    }, []);
  }

  dashboardListWithPermission : any = []


  @HostListener('window:scroll')
  @HostListener('window:resize')
  onWindowScrollOrResize() {
    // this.updatePopupPosition();
    // this.showPopupMessage()
  }

  private updatePopupPosition() {
    let popup = document.querySelector('.toaster') as HTMLElement;
    if (popup) {
      // Show 20px from the top of the viewport, accounting for scroll
      popup.style.top = `${window.scrollY + 80}px`;
  
      // Align to the right with some margin
      popup.style.right = `20px`;
  
      // Reset left to avoid conflicts
      popup.style.left = 'auto';
  
      // // Make sure positioning is correct
      // popup.style.position = 'absolute';
    }
  }
  

  showToasterMessage(message: string, type: 'success' | 'error' = 'success') {
    this.toasterMessage = message;
    this.toasterType = type;
    this.showToaster = true;
    // setTimeout(() => {
    //   this.showToaster = false;
    // }, 5000);
  }

  showToasterMessage1(message: string, type: 'success' | 'error' = 'success') {
    this.toasterMessage = message;
    this.toasterType = type;
    this.showToaster = true;
  
    const toasterEl = document.querySelector('.toaster') as HTMLElement;
    
    if (toasterEl) {
      // Set initial styles for the toaster
      toasterEl.classList.remove('show'); // Ensure it's hidden at first
      toasterEl.style.right = '-400px'; // Start from off-screen (right: -400px)
      
      // Optional logic for screen width
      const screenWidth = window.innerWidth;
      const rightOffset = screenWidth < 500 ? 10 : 20;
      const topOffset = 150; // Always 150px from top
      
      toasterEl.style.top = `${topOffset}px`;
      toasterEl.style.right = `${rightOffset}px`;
  
      // Trigger slide-in by adding the 'show' class after a small delay
      setTimeout(() => {
        toasterEl.classList.add('show'); // Animate the toaster sliding in
      }, 10); // A small delay to ensure the styles are applied
  
      // Hide the toaster after 5 seconds by removing the 'show' class
      setTimeout(() => {
        toasterEl.classList.remove('show'); // Slide the toaster out
        this.showToaster = false; // Update the state if needed
      }, 3000); // After 5 seconds, hide the toaster
    }
  }
  
  


  searchQuery: string = '';
  fullDashboardDataList: any = [];

  // onSearch(): void {
  //   const query = this.searchQuery.toLowerCase().trim();
  //   let data = this.unGroupedDashboards
  //   this.unGroupedDashboards = this.availableDashboards.filter(d =>
  //     d.dashboard_name.toLowerCase().includes(query)
  //   );

  //   // Filter dashboardDataList
  //   this.dashboardDataList = this.fullDashboardDataList.map((group: any) => {
  //     const filteredArray = group.dashboards.filter((d: any) =>
  //       d.dashboard_name.toLowerCase().includes(query)
  //     );
  //     return {
  //       ...group,
  //       dashboards: filteredArray
  //     };
  //   }).filter((group: any) => group.dashboards.length > 0); // remove empty groups


  // }
// old code
  // onSearch(): void {
  //   const query = this.searchQuery.toLowerCase().trim();
  //   let data = this.unGroupedDashboards;


  //   // this.unGroupedDashboards = this.availableDashboards.filter(d =>
  //   //   d.dashboard_name.toLowerCase().includes(query)
  //   // );

  //   this.unGroupedDashboards = this.dashboardListWithPermission.filter((d : any) =>
  //     d.dashboard_name.toLowerCase().includes(query)
  //   );


  //   // Filter dashboardDataList
  //   this.dashboardDataList = this.fullDashboardDataList.map((group: any) => {
  //     const filteredArray = group.dashboards.filter((d: any) =>
  //       d.dashboard_name.toLowerCase().includes(query)
  //     );
  //     return {
  //       ...group,
  //       dashboards: filteredArray
  //     };
  //   }).filter((group: any) => group.dashboards.length > 0); // remove empty groups
  //   console.log('data in this.this.dashboardDataList', this.dashboardDataList)



  // }
// new code
onSearch(): void {
  const query = this.searchQuery.toLowerCase().trim();

  // Filter ungrouped dashboards
  this.unGroupedDashboards = this.dashboardListWithPermission.filter((d: any) =>
    d.dashboard_name.toLowerCase().includes(query)
  );

  if (query === '') {
    this.dashboardDataList = JSON.parse(JSON.stringify(this.fullDashboardDataList));
    if (this.selectedGroup) {
      const originalGroup = this.fullDashboardDataList.find(
        (g: any) => g.group_name === this.selectedGroup.group_name
      );
      if (originalGroup) {
        this.selectedGroup = JSON.parse(JSON.stringify(originalGroup));
      }
    }
  } else {
    // Filter dashboardDataList
    this.dashboardDataList = this.fullDashboardDataList.map((group: any) => {
      const filteredDashboards = group.dashboards.filter((d: any) =>
        d.dashboard_name.toLowerCase().includes(query)
      );
      return {
        ...group,
        dashboards: filteredDashboards
      };
    }).filter((group: any) => group.dashboards.length > 0); // Remove empty groups
    if (this.selectedGroup) {
      const filteredGroup = this.dashboardDataList.find(
        (g: any) => g.group_name === this.selectedGroup.group_name
      );
      
      if (filteredGroup) {
        this.selectedGroup = {
          ...this.selectedGroup,
          dashboards: filteredGroup.dashboards
        };
      } else {
        this.selectedGroup = null;
      }
    }
  }

  console.log('Filtered dashboardDataList:', this.dashboardDataList);
  console.log('Selected group after filter:', this.selectedGroup);
}

  showDialog(dashboard: any, type: 'copy' | 'role' | 'user') {
    this.selectedDashboard = dashboard;
    this.dialogType = type;

    switch (type) {
      case 'copy':
        this.dialogHeader = 'Copy Dashboard';
        this.dialogWidth = '500px';
        this.dialogContent = 'copy';
        this.copyDashboardForm.patchValue({
          dashboard_name: dashboard.dashboard_name,
          description: dashboard.description
        });
        // This will be used to determine which template to show
        break;
      case 'role':
        this.dialogHeader = 'Role Dashboard Permission';
        this.dialogWidth = '800px';
        this.dialogContent = 'role';

        this.roleDashboardObj = {
          "dashboard_id": dashboard.dashboard_id,
          "dashboard_name": dashboard.dashboard_name,
        }

        this.roleSubmitFlag = true;
        this.roleUpdateFlag = false;

        break;
      case 'user':
        this.dialogHeader = 'User Dashboard Permission';
        this.dialogWidth = '800px';
        this.dialogContent = 'user';
        this.userDashboardObj = {
          "dashboard_id": dashboard.dashboard_id,
          "dashboard_name": dashboard.dashboard_name,
        }
        this.userSubmitFlag = true;
        this.userUpdateFlag = false;
        break;
    }

    this.dialogVisible = true;
  }

  resFlag(eve: any) {
    console.log('eve in resFlag', eve)
    this.roleSubmitFlag = eve.submit;
    this.roleUpdateFlag = eve.update;
  }

  resUserFlag(eve: any) {
    console.log(eve)
    this.userSubmitFlag = eve.submit;
    this.userUpdateFlag = eve.update;
  }


  getResponseMessage(eve: any) {
    console.log('eve res loader', eve)
    this.loaderService.hide();
    // this.showToasterMessage(eve.message, eve.status ? 'success' : 'error');
    this.popupService.showPopup({
      message: eve.message,
      statusCode: eve.statusCode,
      status: eve.status
    });
    if (eve.status === true || eve.status === 'true') {
    this.refreshDashboardPermissions();
  }

  }

  refreshDashboardPermissions() {
  const userInfoData = this.userService.getUser();
  const role_id = userInfoData.role_id;
  // const user_id = this.dashboardBasedAccessService.updatedashboardAccessFromLocalStorage()?.user_id 
  //   ? userInfoData?.user_id 
  //   : null;

  const user_id = userInfoData.user_id;

  // If superadmin, just reload
  if (userInfoData.username === 'superadmin') {
    this.loadDashboardData();
    return;
  }

  // If user has specific permissions
  if (role_id && user_id) {
    this.chartService.getAllUserDashboardPermissionByRoleidUserId(role_id, user_id).subscribe(
      (res: any) => {
        if (res.success) {
          this.dashboardBasedPermssionArray = res['data']?.permission_details || [];
          this.dashboardBasedAccessService.setdashboardAccess(res['data']);
          this.loadDashboardData(); // Reload with new permissions
        }
      }
    );
  } 
  // If only role permissions
  else {
    this.chartService.getAllRoleDashboardPermissionByRoleid(role_id).subscribe(
      (res: any) => {
        if (res.success) {
          this.dashboardBasedPermssionArray = res['data']?.permission_details || [];
          this.dashboardBasedAccessService.setdashboardAccess(res['data']);
          this.loadDashboardData(); // Reload with new permissions
        }
      }
    );
  }
  }
  onRoleBasedAccessSubmit() {
    this.roleBasedDialog.onFormSubmit();
    this.dialogVisible = false;
    this.loaderService.show()
  }
  onUpdateRoleBasedAccess() {
    this.roleBasedDialog.onUpdateForm();
    this.dialogVisible = false;
    this.loaderService.show()
  }

  delteRolePermission() {
    this.roleBasedDialog.onDelete();
    this.dialogVisible = false;
    this.loaderService.show()
  }
  onUserBasedAccessSubmit() {
    this.userBasedDialog.onFormSubmit()
    this.loaderService.show()
    this.dialogVisible = false;

  }


  onUserUpdateDashboardAccess() {
    this.dialogVisible = false;

    this.userBasedDialog.onformUpdate()
    // this.showUserPopup = false;
    this.loaderService.show()

  }

  deleteUserPermission() {
    this.userBasedDialog.onDelete();
    this.dialogVisible = false;

    this.loaderService.show()
  }



  onRolePermissionSubmit() {
    // Implement role permission submission logic here
    this.dialogVisible = false;

    //this.showToasterMessage('Role permissions updated successfully');
  }

  onDialogClose() {
    this.dialogVisible = false;
    this.selectedDashboard = null;
  }

  onDialogSubmit() {
    switch (this.dialogType) {
      case 'copy':
        this.onCopyDashboardSubmit();
        break;
      // case 'role':
      //   this.onRolePermissionSubmit();
      //   break;
      // case 'user':
      //   this.onUserPermissionSubmit();
      //   break;
      // case 'user':
      //   this.onUserPermissionSubmit();
      //   break;

    }
  }

  onDeleteClickOld(obj: any) {
    let id = obj.dashboard_id;
    let deleteMessage = window.confirm('Do you want to delete the dashboard');
    this.loaderService.show();

    if (deleteMessage) {
      this.chartService.deleteDashboardById(id).subscribe(
        (res => {
          console.log(res);
          this.loaderService.hide();
          this.showToasterMessage(res.message);

        }),
        (err: HttpErrorResponse) => {
          this.loaderService.hide();
          const errorMessage = err.error && err.error.message ? err.error.message : err.message;
          this.showToasterMessage(errorMessage);

        }

      );
    } else {
      this.loaderService.hide()
      console.log('Deletion canceled');
    }

  }

  // onDeleteClick(obj: any) {
  //   const id = obj.dashboard_id;
  //   const deleteMessage = window.confirm('Do you want to delete the dashboard');

  //   if (!deleteMessage) {
  //     this.loaderService.hide();
  //     console.log('Deletion canceled');
  //     return;
  //   }

  //   this.loaderService.show();

  //   this.chartService.deleteDashboardById(id).subscribe(
  //     (res: any) => {
  //       this.loaderService.hide();

  //       // âœ… Show success/error toaster based on response
  //       // this.showToasterMessage(res.message, res.success ? 'success' : 'error');
  //       this.popupService.showPopup({
  //         message: res.message,
  //         statusCode: res.status_code,
  //         status: res.success
  //       });

  //       if (res.success) {
  //         // âœ… Remove from unGroupedDashboards
  //         this.unGroupedDashboards = this.unGroupedDashboards.filter(d => d.dashboard_id !== id);

  //         // âœ… Remove from availableDashboards
  //         this.availableDashboards = this.availableDashboards.filter(d => d.dashboard_id !== id);

  //         // âœ… Remove from grouped dashboards
  //         if (obj.group_name && obj.group_name.length > 0) {
  //           obj.group_name.forEach((groupName: string) => {
  //             const group = this.dashboardDataList.find(g => g.group_name === groupName);
  //             if (group) {
  //               group.dashboards = group.dashboards.filter((d: any) => d.dashboard_id !== id);
  //             }
  //           });
  //         }

  //         // âœ… Update sessionStorage
  //         // sessionStorage.setItem('dashboardList', JSON.stringify(this.unGroupedDashboards));
  //       }
  //     },
  //     (err: HttpErrorResponse) => {
  //       this.loaderService.hide();
  //       // this.showToasterMessage(err.message, 'error');
  //       this.popupService.showPopup({
  //         message: err.message,
  //         statusCode: err.status,
  //         status: false
  //       });
  //     }
  //   );
  // }
onDeleteClick(obj: any) {
  const id = obj.dashboard_id;

  if (!window.confirm('Do you want to delete the dashboard?')) {
    return;
  }

  this.loaderService.show();

  this.chartService.deleteDashboardById(id).subscribe(
    (res: any) => {
      this.loaderService.hide();

      this.popupService.showPopup({
        message: res.message,
        statusCode: res.status_code,
        status: res.success
      });

      if (res.success === true || res.success === 'true') {

        // âœ… Ungrouped dashboards
        this.unGroupedDashboards = this.unGroupedDashboards
          .filter(d => d.dashboard_id !== id);

        // âœ… Available dashboards
        this.availableDashboards = this.availableDashboards
          .filter(d => d.dashboard_id !== id);

        // âœ… Grouped dashboards (IMPORTANT)
        this.dashboardDataList = this.dashboardDataList.map(group => {
          return {
            ...group,
            dashboards: group.dashboards.filter(
              (d: any) => d.dashboard_id !== id
            )
          };
        });

        // ðŸ”¥ Force UI refresh if OnPush
        this.cdr.detectChanges();
      }
    },
    (err: HttpErrorResponse) => {
      this.loaderService.hide();
      const errorMessage = err.error && err.error.message ? err.error.message : err.message;
      this.popupService.showPopup({
        message: errorMessage,
        statusCode: err.status,
        status: false
      });
    }
  );
}


  // onCopyDashboardSubmit() {
  //   const uniqueID = 'dashboard_' + Date.now();

  //   let formValue = this.copyDashboardForm.value;

  //   console.log('formValue', formValue);
  //   console.log('selectedDashboard', this.selectedDashboard);

  //   this.loaderService.show();

  //   this.chartService.getDashboardById(this.selectedDashboard.dashboard_id).subscribe(
  //     (apiRes: any) => {
  //       console.log('Fetched dashboard from API:', apiRes);
  //     }
  //   );

  //   // Prepare the copied dashboard object
  //   const copiedDashboard = {
  //     ...this.selectedDashboard,
  //     dashboard_id: uniqueID,
  //     dashboard_name: formValue.dashboard_name,
  //     description: formValue.description,
  //     dashboard_setup: {
  //       dashboardObj: {
  //         ...this.selectedDashboard.dashboard_setup.dashboardObj,
  //         //  ...apiRes.dashboard_setup?.dashboardObj
  //       }
  //     }
  //   };

  //   // Call the API to create the dashboard
  //   this.chartService.postDashboardCreationObj(copiedDashboard).subscribe(
  //     (res: any) => {
  //       console.log('dashboard api obj', res);
  //       this.loaderService.hide();

  //       this.dialogVisible = false;

  //     // Then show popup
  //     setTimeout(() => {
  //       this.popupService.showPopup({
  //         message: res.message,
  //         statusCode: res.status_code,
  //         status: res.success
  //       });
  //     }, 100);
  //       // // this.showToasterMessage(res.message, res.success ? 'success' : 'error');
  //       // this.popupService.showPopup({
  //       //   message: res.message,
  //       //   statusCode: res.status_code,
  //       //   status: res.success
  //       // });

  //     if (res.success === true || res.success === 'true') {

  //       const newDashboard = { ...copiedDashboard };

  //       this.unGroupedDashboards = [...this.unGroupedDashboards, newDashboard];
  //       this.availableDashboards = [...this.availableDashboards, newDashboard];

  //       if (this.selectedDashboard.group_name?.length) {
  //         this.selectedDashboard.group_name.forEach((groupName: any) => {
  //           const group = this.dashboardDataList.find(g => g.group_name === groupName);
  //           if (group) {
  //             group.dashboards = [...group.dashboards, newDashboard];
  //           }
  //         });
  //       }

  //       this.cdr.detectChanges(); // ðŸ”¥ force UI update if needed
      
  //        // // âœ… Save to sessionStorage
  //       // sessionStorage.setItem('dashboardList', JSON.stringify(this.unGroupedDashboards));

  //       }


  //       // // âœ… Close dialog
  //       this.dialogVisible = false;
  //     },
  //     (err: HttpErrorResponse) => {
  //       this.loaderService.hide();

  //       // this.showToasterMessage(err.message, 'error');
  //       // this.popupService.showPopup({
  //       //   message: err.message,
  //       //   statusCode: err.status,
  //       //   status: false
  //       // });
  //        this.dialogVisible = false;

  //     setTimeout(() => {
  //       this.popupService.showPopup({
  //         message: err.message,
  //         statusCode: err.status,
  //         status: false
  //       });
  //     }, 100);
        
  //     }
  //   );
  // }

onCopyDashboardSubmit() {
  const uniqueID = 'dashboard_' + Date.now();
  const formValue = this.copyDashboardForm.value;

  this.dialogVisible = false;
  this.cdr.detectChanges();

  this.loaderService.show();

  this.chartService.getDashboardDetailsById(this.selectedDashboard.dashboard_id).subscribe(
    (apiRes: any) => {
      console.log('Fetched complete dashboard from API:', apiRes);

      const fetchedDashboard = apiRes.data || apiRes;


      const copiedDashboard = {
        ...fetchedDashboard,
        dashboard_id: uniqueID,
        dashboard_name: formValue.dashboard_name,
        description: formValue.description,
      };

      console.log('Copied dashboard object:', copiedDashboard);


      const newDashboard = { ...copiedDashboard };
      
      this.unGroupedDashboards = [...this.unGroupedDashboards, newDashboard];
      this.availableDashboards = [...this.availableDashboards, newDashboard];
      this.sidebarDashboards = [...this.sidebarDashboards, newDashboard];
      this.dashboardListWithPermission = [...this.dashboardListWithPermission, newDashboard];


      if (newDashboard.group_name?.length) {
        newDashboard.group_name.forEach((groupName: any) => {
          const group = this.dashboardDataList.find(g => g.group_name === groupName);
          if (group) {
            group.dashboards = [...group.dashboards, newDashboard];
          }
        });
      }


      this.fullDashboardDataList = this.dashboardDataList.map(group => ({
        ...group,
        dashboards: [...group.dashboards]
      }));

      this.updateFlattenedDashboards();


      if (this.selectedGroup && newDashboard.group_name?.includes(this.selectedGroup.group_name)) {
        this.selectedGroup.dashboards = [...this.selectedGroup.dashboards, newDashboard];
      }

      this.loaderService.hide();
      this.cdr.detectChanges();
      


      this.chartService.postDashboardCreationObj(copiedDashboard).subscribe(
        (res: any) => {
          console.log('Dashboard creation response:', res);

          this.popupService.showPopup({
            message: res.message,
            statusCode: res.status_code,
            status: res.success
          });

          if (res.success === true || res.success === 'true') {
            if (this.role !== 'superadmin') {
              this.refreshDashboardPermissions();
            }
          } else {
            this.unGroupedDashboards = this.unGroupedDashboards.filter(d => d.dashboard_id !== uniqueID);
            this.availableDashboards = this.availableDashboards.filter(d => d.dashboard_id !== uniqueID);
            this.sidebarDashboards = this.sidebarDashboards.filter(d => d.dashboard_id !== uniqueID);
            this.dashboardListWithPermission = this.dashboardListWithPermission.filter((d: { dashboard_id: any; }) => d.dashboard_id !== uniqueID);

            this.dashboardDataList = this.dashboardDataList.map(group => ({
              ...group,
              dashboards: group.dashboards.filter((d: any) => d.dashboard_id !== uniqueID)
            }));

            this.fullDashboardDataList = this.dashboardDataList.map(group => ({
              ...group,
              dashboards: [...group.dashboards]
            }));

            this.updateFlattenedDashboards();
            this.cdr.detectChanges();
          }
        },
        (err: HttpErrorResponse) => {
          console.error('Error creating dashboard:', err);

          this.popupService.showPopup({
            message: err.error?.message || err.message || 'Failed to create dashboard',
            statusCode: err.status,
            status: false
          });

          this.unGroupedDashboards = this.unGroupedDashboards.filter(d => d.dashboard_id !== uniqueID);
          this.availableDashboards = this.availableDashboards.filter(d => d.dashboard_id !== uniqueID);
          this.sidebarDashboards = this.sidebarDashboards.filter(d => d.dashboard_id !== uniqueID);
          this.dashboardListWithPermission = this.dashboardListWithPermission.filter((d: { dashboard_id: string; }) => d.dashboard_id !== uniqueID);


          this.dashboardDataList = this.dashboardDataList.map(group => ({
            ...group,
            dashboards: group.dashboards.filter((d: any) => d.dashboard_id !== uniqueID)
          }));

          this.fullDashboardDataList = this.dashboardDataList.map(group => ({
            ...group,
            dashboards: [...group.dashboards]
          }));

          this.updateFlattenedDashboards();
          this.cdr.detectChanges();
        }
      );
    },
    (fetchErr: HttpErrorResponse) => {
      console.error('Error fetching original dashboard:', fetchErr);
      this.loaderService.hide();

      this.popupService.showPopup({
        message: 'Failed to fetch dashboard details for copying',
        statusCode: fetchErr.status,
        status: false
      });
    }
  );
}



  onUserPermissionSubmit() {
    // Implement user permission submission logic here
    this.dialogVisible = false;
    // this.showToasterMessage('User permissions updated successfully');
  }
  

  selectedGroup: any = null;
  viewDashboards(group: any): void {
  if (this.searchQuery.trim() !== '') {
    const query = this.searchQuery.toLowerCase().trim();
    const filteredDashboards = group.dashboards.filter((d: any) =>
      d.dashboard_name.toLowerCase().includes(query)
    );
    this.selectedGroup = {
      ...group,
      dashboards: filteredDashboards
    };
  } else {
    this.selectedGroup = { ...group };
  }
  }

  backToGroups() {
    this.selectedGroup = null;
  }


}


