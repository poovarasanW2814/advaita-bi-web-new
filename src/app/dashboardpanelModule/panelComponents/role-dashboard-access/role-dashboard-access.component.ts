import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, inject} from '@angular/core';
import { FormGroup, FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/core/AuthServices/user.service';
import { ChartService } from 'src/app/core/services/chart.service';
import { MenuBasedAccessService } from 'src/app/core/services/menu-based-access.service';
import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';

@Component({
    selector: 'app-role-dashboard-access',
    templateUrl: './role-dashboard-access.component.html',
    styleUrls: ['./role-dashboard-access.component.scss'],
    imports: [FormsModule, ReactiveFormsModule, DropDownListModule]
})


export class RoleDashboardAccessComponent implements OnInit, OnChanges {

  tableForm!: FormGroup;
  @Output() resMessage = new EventEmitter();
  @Output() resDeleteMessage = new EventEmitter();


  permissionForm! : FormGroup;

  @Input()
  dashboardId!: string;
  roleDashboardPermsission! : FormGroup;
  message! : string;
  success: boolean = false;
  displayPopup: boolean = false;
  rolesArray : any= [];
  dashboard_Name : string = '';
  dashboard_id : any;
  dashboardObj : any;
  editRolePermissionIndex : any;

  private readonly fb = inject(FormBuilder);
  private readonly chartService = inject(ChartService);
  private readonly route = inject(ActivatedRoute);
  private readonly menuBasedAccessService = inject(MenuBasedAccessService);
  private readonly userService = inject(UserService);;


  ngOnChanges(changes: SimpleChanges): void {
    let currentValue = changes['dashboardId'].currentValue
    if(currentValue != undefined){
      this.dashboardObj = currentValue;
        //console.log(this.dashboard_id);
          this.dashboard_Name = this.dashboardObj.dashboard_name,
          this.dashboard_id = this.dashboardObj.dashboard_id;
          this.formInit();
          this.permissionForm.reset()

          this.chartService.getAllRoleBasedDashboardAccess().subscribe((res : any) =>{
            console.log(res)
          })
    }
  }

  updatePermissionId! : number ;
  submitflag : boolean = true;
  updateFlag : boolean = false;
  @Output() resFlag = new EventEmitter<any>();

  MatchedObject : any;
  role_id : any;
  rolefields: any = { text: 'role', value: 'role' }
  roleDashboardPermissionObj  : any;


  onRoleChangeEvent(event : any){
    // let val = event.target.value
    let val = event.itemData.role;

    this.chartService.getRoleDetailsByRolename(val).subscribe((res : any) =>{
       console.log('res', res);
      let role_Obj = res['data'];

      this.chartService.getAllRoleDashboardPermissionByRoleid(role_Obj.id).subscribe((res : any) =>{
        console.log('total res', res['data']);

        if(res.success){
          let allDbPermission = res['data'];
          this.role_id = allDbPermission.role_id;

          this.updatePermissionId = allDbPermission.id;

          console.log('allDbPermission', allDbPermission);


          allDbPermission.permission_details.find((ele : any) => {
            //console.log(ele, this.dashboard_id)
          });
          let matchObj = allDbPermission.permission_details.find((ele : any) => ele.dashboard_id == this.dashboard_id);
  
  
          if(matchObj){
              // let permissionObj = matchObj.permission_details[0];
              this.editRolePermissionIndex = matchObj.id

              const otherValues = [
                matchObj.can_view,
                matchObj.can_create,
                matchObj.can_update,
                matchObj.can_delete,
                matchObj.can_download,
              ];
        
              // // Check if all other values are true:
              const allSelected = otherValues.every((value) => value === true);
        

              this.permissionForm.patchValue({
                roleName: role_Obj.role,  // Set your default role or select a role based on the object
                role_dashboard_permission_details_dto: {
                  can_view : matchObj.can_view ,
                  can_download : matchObj.can_download ,
                  can_schedule : matchObj.can_schedule ,
                  can_create : matchObj.can_create ,
                  can_delete : matchObj.can_delete ,
                  can_update : matchObj.can_update  ,
                  selectAll :allSelected || matchObj.selectAll
                }
              });
              // //console.log(Object.values(permissionObj))
              this.MatchedObject = matchObj;

              this.submitflag  = false;
              this.updateFlag  = true;
              //console.log(this.submitflag)
              this.resFlag.emit({submit : this.submitflag, update : this.updateFlag})
          }else{
  
              this.formInit(val);
              this.submitflag  = true;
              this.updateFlag  = false;
              this.resFlag.emit({submit : this.submitflag, update : this.updateFlag})
          }
        }else{
  
          this.formInit(val);
          this.submitflag  = true;
          this.updateFlag  = false;
          this.resFlag.emit({submit : this.submitflag, update : this.updateFlag})
      }
     })
    })

  }
  ngOnInit() {
  

    this.formInit()

    // this.chartService.getAllRolesDetails().subscribe((res : any) =>{
    //   ////console.log(res);
    //   let data = res['data']
    //   // this.rolesArray = data
    // })



    
    let userInfoData = this.userService.getUser();
    console.log('userInfoData',  userInfoData)

    this.chartService.getAllActiveRoleDetails().subscribe((res : any) =>{
      ////console.log(res);
      let data = res['data']

      if(userInfoData.role == 'superadmin'){
      console.log(' data in superadmin', data);
        
        this.rolesArray = data;
      }else{
      this.rolesArray  = data.filter((user: any) => user.role !== 'superadmin');
      }
    })


    // this.chartService.getAllActiveRoleDetails().subscribe((res: any) => {
    //   let data = res['data'];
    //   console.log('this.userInfoData',  this.userInfoData);
      
    //   if(userInfoData.role == 'superadmin'){
    //    this.rolesObjArr = data;

    //    this.rolesArray = data.map((ele: any) => ele.role)
    //   }else{
    //     this.rolesObjArr  = data.filter((user: any) => user.role !== 'superadmin');
    //     console.log( 'this.rolesObjArr',  this.rolesObjArr   )
 
    //    this.rolesArray = data.map((ele: any) => ele.role)
    //   }

    // })




    this.menuBasedAccessService.menuAccess$.subscribe((menuAccess) => {
     let  menuBasedAccess = menuAccess;
      let menuBasedPermissionControlArray = menuBasedAccess?.permission_details;


      const roleDashboardPermssions  = menuBasedPermissionControlArray?.find(
        (permission: any) => permission.form_name === 'roleBaseddashboardAccess'
      );

      console.log('roleDashboardPermssions', roleDashboardPermssions)

      if (roleDashboardPermssions) {
        this.roleDashboardPermissionObj = roleDashboardPermssions
      }
    });
  }
  onDelete(){
    console.log(   this.role_id , this.MatchedObject)
    this.chartService.deleteRoleIdBasedDashboardAceessByRoleId( this.role_id,this.MatchedObject.id).subscribe(
      (res : any) =>{
      this.resMessage.emit({status : res.success, message : res.message, statusCode : res.status_code});
    },
  
    (err : any) =>{
      const errorMessage = err.error && err.error.message ? err.error.message : err.message;
      this.resMessage.emit({status : false, message : errorMessage, statusCode : err.status})

    }
  )


  }
  formInit(selectedRole?: string) {
    this.permissionForm = this.fb.group({
      roleName: [selectedRole || ''],  // Use selectedRole if provided, otherwise an empty string
      role_dashboard_permission_details_dto: this.fb.group({
        can_view: [false],
        can_download: [false],
        can_schedule: [false],
        can_create: [false],
        can_update: [false],
        can_delete: [false],
        selectAll: [false],
      })
    });
  }
  

  selectAll(event : any) {
    const checked = event.target.checked;
    const dashboardPermission = this.permissionForm.get('role_dashboard_permission_details_dto') as FormGroup;
    if (dashboardPermission) {
      Object.keys(dashboardPermission.controls).forEach(controlName => {
        dashboardPermission.get(controlName)!.setValue(checked);
      });
    }
  }


  
  onFormSubmit(){
    // ////console.log(this.permissionForm.value);
    let formValue = this.permissionForm.value;
    
    let roleObj = this.rolesArray.find((ele : any) => ele.role === formValue.roleName);
    // ////console.log(roleObj)

    let apiObj = {
      "role_id": roleObj.id,
      "role_dashboard_permission_details_dto": [
        {
          "dashboard_id":this.dashboard_id,
          "dashboard_name":  this.dashboard_Name,
          ...formValue.role_dashboard_permission_details_dto
        }
        ]
    }
    console.log(apiObj)


    this.chartService.createRoleBaseDashboardAccess(apiObj).subscribe(
      (res : any) =>{
        console.log('res in ', res)
        this.resMessage.emit({status : res.success, message : res.message,  statusCode : res.status_code});     
      },
      (err : any) =>{
        // this.resMessage.emit({status : err.success, message : err.message})
        const errorMessage = err.error && err.error.message ? err.error.message : err.message;
        this.resMessage.emit({status : false, message : errorMessage, statusCode : err.status})   
      }
    )

  }
  onUpdateForm(){
 
  let formValue = this.permissionForm.value;
    ////console.log(formValue)
    let apiObj = {
      "role_dashboard_permission_details_update_dto": [
        {
          "id" : this.editRolePermissionIndex,
          "dashboard_id":this.dashboard_id,
          "dashboard_name":  this.dashboard_Name,
          ...formValue.role_dashboard_permission_details_dto
        }
        ]
    }
    console.log('apiObj' , apiObj)
    this.chartService.updateroleBasedDashboardAccess(this.updatePermissionId, apiObj).subscribe(
      (res : any) =>{
      this.resMessage.emit({status : res.success, message : res.message,statusCode : res.status_code });
    
      },
      (err : any) =>{
      const errorMessage = err.error && err.error.message ? err.error.message : err.message;
      this.resMessage.emit({status : false, message : errorMessage, statusCode : err.status})   
      }
    
    )
    this.permissionForm.reset()
  }


}
