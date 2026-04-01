import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ChartService } from 'src/app/core/services/chart.service';
import { MenuBasedAccessService } from 'src/app/core/services/menu-based-access.service';

@Component({
  selector: 'app-multiple-dashboard-role-permission',
  templateUrl: './multiple-dashboard-role-permission.component.html',
  styleUrls: ['./multiple-dashboard-role-permission.component.scss']
})
export class MultipleDashboardRolePermissionComponent implements OnInit, OnChanges {

    @Input() getRoleObj : any
    @Output() emitFlagValue = new EventEmitter()
    @Output() resMessage = new EventEmitter();
    isLoading: boolean = true;
    isSubmitFlag: boolean = true;
    isUpdateFlag: boolean = false;
    updateRoleId : any;
    role_id : any;
    
  constructor(private fb: FormBuilder, private chartService : ChartService, private menuBasedAccessService: MenuBasedAccessService) { }
  ngOnChanges(changes: SimpleChanges): void {
    // throw new Error('Method not implemented.');
    let currentValue = changes['getRoleObj'].currentValue;
    this.dashboards = [];
    this.isLoading = true;
    if(!currentValue){
      return ;
    }

    console.log('currentValue', currentValue);


    this.role_id = currentValue.role_id

 
    this.chartService.getAllRoleDashboardPermissionByRoleid(currentValue.role_id).subscribe(
      (res: any) => {
        let rolePermissionObj = res?.data || null;
        console.log('res', res, res?.data);
      
        this.updateRoleId = rolePermissionObj?.id || null;
        let permission_details = rolePermissionObj?.permission_details || [];
        
        // Set flags based on whether permissions exist
        if (this.updateRoleId) {
          this.isSubmitFlag = false;
          this.isUpdateFlag = true;
        } else {
          this.isSubmitFlag = true;
          this.isUpdateFlag = false;
        }
      
        this.chartService.getAllDashboardDetails().subscribe((res: any) => {
          console.log('response', res);
          let dashboardDetails = res?.data || [];
      
          let mergedArray;
          
          if (!permission_details.length) {
            // If there are no permission details, create default objects
            mergedArray = dashboardDetails.map((dashboard : any) => ({
              dashboard_id: dashboard.dashboard_id,
              dashboard_name: dashboard.dashboard_name,
              can_view: false,
              can_download: false,
              can_schedule: false,
              can_create: false,
              can_delete: false,
              can_update: false
            }));
          } else {
            // Otherwise, merge existing permissions
            mergedArray = this.mergeArrays(permission_details, dashboardDetails);
          }
      
          this.dashboards = mergedArray;
          console.log('mergedArray', mergedArray);
          this.isLoading = false;
        });
      },
      (error: any) => {
        // Handle the case when no permissions are given (404 error)
        console.log('Error getting role dashboard permissions', error);
        
        // Check if it's a 404 or "No permissions given" response
        if (error.status === 404 || error.error?.message === "No permissions given") {
          // No permissions exist, so fetch all dashboards with default permissions
          this.updateRoleId = null;
          this.isSubmitFlag = true;
          this.isUpdateFlag = false;
          
          this.chartService.getAllDashboardDetails().subscribe((res: any) => {
            console.log('response (no permissions case)', res);
            let dashboardDetails = res?.data || [];
            
            // Create default objects for all dashboards
            let mergedArray = dashboardDetails.map((dashboard: any) => ({
              dashboard_id: dashboard.dashboard_id,
              dashboard_name: dashboard.dashboard_name,
              can_view: false,
              can_download: false,
              can_schedule: false,
              can_create: false,
              can_delete: false,
              can_update: false
            }));
            
            this.dashboards = mergedArray;
            console.log('mergedArray (no permissions)', mergedArray);
            this.isLoading = false;
          }, (err: any) => {
            console.error('Error fetching dashboard details', err);
            this.isLoading = false;
          });
        } else {
          // Some other error occurred
          console.error('Unexpected error', error);
          this.isLoading = false;
        }
      }
    );
    

  }

  ngOnInit(): void {
    console.log('role info in multiselect dashboards', this.getRoleObj)
  }

 mergeArraysOld(permissionDetails: any[], dashboardDetails: any[]): any[] {
        let mergedArray : any = [];
      
        // Create a map for quick lookup of permission details by dashboard_id
        let permissionMap = new Map();
        permissionDetails.forEach(permission => {
          permissionMap.set(permission.dashboard_id, permission);
        });
      
        // Iterate through the dashboard details and merge with permission details
        dashboardDetails.forEach(dashboard => {
          let dashboardId = dashboard.dashboard_id;
          if (permissionMap.has(dashboardId)) {
            // If the dashboard_id exists in permission details, add it to the merged array
            mergedArray.push(permissionMap.get(dashboardId));
          } else {
            // If the dashboard_id does not exist in permission details, create a new object with default values
            mergedArray.push({
              id: null,
              dashboard_id: dashboard.dashboard_id,
              dashboard_name: dashboard.dashboard_name,
              can_view: false,
              can_download: false,
              can_schedule: false,
              can_create: false,
              can_delete: false,
              can_update: false,
              roleDashboardPermission_id: null
            });
          }
        });
      
        return mergedArray;
 }


 mergeArrays(permissionDetails: any[], dashboardDetails: any[]): any[] {
  let mergedArray: any[] = [];

  // Create a map for quick lookup of permission details by dashboard_id
  let permissionMap = new Map();
  permissionDetails.forEach(permission => {
      permissionMap.set(permission.dashboard_id, permission);
  });

  // Initialize selectAllPermissions flags
  let allCanView = true;
  let allCanCreate = true;
  let allCanUpdate = true;
  let allCanDelete = true;

  // Iterate through dashboard details and merge with permission details
  dashboardDetails.forEach(dashboard => {
      let dashboardId = dashboard.dashboard_id;
      let mergedItem;

      if (permissionMap.has(dashboardId)) {
          mergedItem = permissionMap.get(dashboardId);
      } else {
          mergedItem = {
              id: null,
              dashboard_id: dashboard.dashboard_id,
              dashboard_name: dashboard.dashboard_name,
              can_view: false,
              can_download: false,
              can_schedule: false,
              can_create: false,
              can_delete: false,
              can_update: false,
              roleDashboardPermission_id: null
          };
      }

      // Push the merged object to the array
      mergedArray.push(mergedItem);

      // Check if all checkboxes should be enabled
      allCanView = allCanView && mergedItem.can_view;
      allCanCreate = allCanCreate && mergedItem.can_create;
      allCanUpdate = allCanUpdate && mergedItem.can_update;
      allCanDelete = allCanDelete && mergedItem.can_delete;
  });

  // Update the selectAllPermissions object based on merged data
  this.selectAllPermissions = {
      can_view: allCanView,
      can_create: allCanCreate,
      can_update: allCanUpdate,
      can_delete: allCanDelete,
      can_download: false,
      can_schedule: false,
  };

  return mergedArray;
}



  dashboards: any[] = [
  ];

  selectAllPermissions = {
    can_view: false,
    can_download: false,
    can_schedule: false,
    can_create: false,
    can_update: false,
    can_delete: false
  };
  

  toggleSelectAll(dashboard: any) {
    const newValue = dashboard.selectAll;
    dashboard.can_view = newValue;
    dashboard.can_download = newValue;
    dashboard.can_schedule = newValue;
    dashboard.can_create = newValue;
    dashboard.can_update = newValue;
    dashboard.can_delete = newValue;
  }
  toggleGlobalSelect(permission: 'can_view' | 'can_create' | 'can_update' | 'can_delete') {
    const newValue = this.selectAllPermissions[permission];
    
    this.dashboards.forEach(dashboard => {
      dashboard[permission] = newValue;
    });
  }
  

  

  updatePermissionsOld() {
    console.log(this.dashboards);
    let obj = {
      role_dashboard_permission_details_update_dto : this.dashboards
    }
    console.log('updatePermissions', this.updateRoleId,  obj);

    this.chartService.updateroleBasedDashboardAccess(this.updateRoleId, obj).subscribe(
      (res : any) =>{
      this.resMessage.emit({status : res.success, message : res.message,statusCode : res.status_code });
    
      },
      (err : any) =>{
      const errorMessage = err.error && err.error.message ? err.error.message : err.message;
      this.resMessage.emit({status : false, message : errorMessage, statusCode : err.status})   
      }
    
    )
  }

  updatePermissions() {
    const filteredDashboards = this.dashboards.filter(dashboard => {
      const hasAnyPermission = 
        dashboard.can_view ||
        dashboard.can_download ||
        dashboard.can_schedule ||
        dashboard.can_create ||
        dashboard.can_delete ||
        dashboard.can_update;
  
      // EXCLUDE ONLY if id is null AND all values are false
      if (dashboard.id === null && !hasAnyPermission) {
        return false;
      }
  
      // INCLUDE otherwise
      return true;
    });
  
    let obj = {
      role_dashboard_permission_details_update_dto: filteredDashboards
    };
  
    console.log('updatePermissions', this.updateRoleId, obj);
  
    this.chartService.updateroleBasedDashboardAccess(this.updateRoleId, obj).subscribe(
      (res: any) => {
        this.resMessage.emit({ status: res.success, message: res.message, statusCode: res.status_code });
      },
      (err: any) => {
        const errorMessage = err.error && err.error.message ? err.error.message : err.message;
        this.resMessage.emit({ status: false, message: errorMessage, statusCode: err.status });
      }
    );
  }
  

  submitPermissionsNew(){
  

    let apiObj = {
      "role_id": this.role_id,
      "role_dashboard_permission_details_dto":  this.dashboards
    }
    console.log('submitPermissions', apiObj)


    this.chartService.createRoleBaseDashboardAccess(apiObj).subscribe(
      (res : any) =>{
        console.log('res in ', res)
        this.resMessage.emit({status : res.success, message : res.message,  statusCode : res.status_code});     
      },
      (err : any) =>{
        const errorMessage = err.error && err.error.message ? err.error.message : err.message;
        this.resMessage.emit({status : false, message : errorMessage, statusCode : err.status})   
      }
    )

  }

  submitPermissions() {
    const filteredDashboards = this.dashboards.filter(dashboard =>
      dashboard.can_view ||
      dashboard.can_download ||
      dashboard.can_schedule ||
      dashboard.can_create ||
      dashboard.can_delete ||
      dashboard.can_update
    );
  
    let apiObj = {
      role_id: this.role_id,
      role_dashboard_permission_details_dto: filteredDashboards
    };
  
    console.log('submitPermissions', apiObj);
  
    this.chartService.createRoleBaseDashboardAccess(apiObj).subscribe(
      (res: any) => {
        console.log('res in ', res);
        this.resMessage.emit({ status: res.success, message: res.message, statusCode: res.status_code });
      },
      (err: any) => {
        const errorMessage = err.error && err.error.message ? err.error.message : err.message;
        this.resMessage.emit({ status: false, message: errorMessage, statusCode: err.status });
      }
    );
  }
  
}

