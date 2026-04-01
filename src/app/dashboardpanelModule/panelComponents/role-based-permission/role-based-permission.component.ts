import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { UserService } from 'src/app/core/AuthServices/user.service';
import { ChartService } from 'src/app/core/services/chart.service';
import { MenuBasedAccessService } from 'src/app/core/services/menu-based-access.service';

@Component({
  selector: 'app-role-based-permission',
  templateUrl: './role-based-permission.component.html',
  styleUrls: ['./role-based-permission.component.scss']
})

export class RoleBasedPermissionComponent implements OnInit, OnChanges {

  tableForm!: FormGroup;

  @Input() getRoleObj : any
  @Output() emitFlagValue = new EventEmitter()
  @Output() resMessage = new EventEmitter()

  permissionForm! : FormGroup;
  successFlag : boolean = true;
  rejectFlag : boolean = false;
  selectedRoleBasedObj : any;

  permissionRows = [
    { key: 'home', label: 'Home' },
    { key: 'createDashboard', label: 'Create Dashboard' },
    { key: 'addRole', label: 'Add Role' },
    { key: 'addUser', label: 'Add User' },
    { key: 'userPermission', label: 'User Permission' },
    { key: 'rolePermission', label: 'Role Permission' },
    { key: 'roleBaseddashboardAccess', label: 'Dashboard Access - Role' },
    { key: 'userBaseddashboardAccess', label: 'Dashboard Access- User' },
    { key: 'dbConnection', label: 'Database Connection' },
    { key: 'fileUploadToDb', label: 'File Upload To Db' },
    { key: 'tableJoin', label: 'Table Join' },
    // { key: 'tableJoin', label: 'Table Join' },
     { key: 'dashboardSetup', label: 'Dashboard Setup' },
     { key: 'chatbotSetup', label: 'Show Chatbot' },
   
     { key: 'createGroupDashboard', label: 'Create Dashboard Group' },
    
  ];

  

  rolesArray : any= [];
  roleValue : any;
  menuBasedAccess : any = {};
  permissionObj : any = {};
  menuBasedPermissionControlArray : any = []
  isUpdateMode: boolean = false;
  updateRoleId! : number;

  selectAllCheckboxChecked = false;

  constructor(private fb: FormBuilder, private chartService : ChartService, private menuBasedAccessService: MenuBasedAccessService, private userService : UserService) {}
  ngOnChanges(changes: SimpleChanges): void {
   let currentValue = changes['getRoleObj'].currentValue;

   if(currentValue != undefined || currentValue != null){
    this.roleValue = currentValue;
    console.log(this.roleValue);

    this.chartService.getroleBasedPermissionByroleId(this.roleValue.role_id).subscribe((res : any) =>{

      if(res.success == true){
         let data = res['data'];
          this.updateRoleId = data.id;
         console.log('res data permission', data);
         this.selectedRoleBasedObj = data;

         this.updateFormWithApiData(data);
      }else{
        this.formInit()
      }
    })

   }

  }

  ngOnInit() {

    this.formInit();
    let userInfoData = this.userService.getUser();
    console.log('userInfoData in role page', userInfoData)

      // Filter permissions based on role
  // if (userInfoData?.role !== 'superadmin') {
  //   this.permissionRows = this.permissionRows.filter(
  //     (permission) => permission.key !== 'chatbotSetup'
  //   );
  // }

        // Filter permissions based on role
        if (userInfoData?.username !== 'superadmin') {
          this.permissionRows = this.permissionRows.filter(
            (permission) => permission.key !== 'chatbotSetup'
          );
        }

  }

  formInit(){
    this.permissionForm = this.fb.group({
      
      permissions: this.fb.group({
        home: this.createPermissionFormGroup(),
        createDashboard: this.createPermissionFormGroup(),
        addRole: this.createPermissionFormGroup(),
        addUser: this.createPermissionFormGroup(),
        userPermission: this.createPermissionFormGroup(),
        rolePermission: this.createPermissionFormGroup(),
        dbConnection: this.createPermissionFormGroup(),
        roleBaseddashboardAccess: this.createPermissionFormGroup(),
        userBaseddashboardAccess: this.createPermissionFormGroup(),
        fileUploadToDb: this.createPermissionFormGroup(),
        tableJoin : this.createPermissionFormGroup(),
        dashboardSetup : this.createPermissionFormGroup(),
        chatbotSetup : this.createPermissionFormGroup(),

        
        createGroupDashboard : this.createPermissionFormGroup(),
        


      }),
    })
  }
  selectAll(permissionKey: any) {
    console.log(permissionKey)
    const permissionGroup = this.permissionForm.get(`permissions.${permissionKey}`);
  
    console.log(permissionGroup)
    if (permissionGroup instanceof FormGroup) {
      Object.keys(permissionGroup.controls).forEach(controlName => {
        const control = permissionGroup.get(controlName);

        if (control instanceof FormControl) {
          control.setValue(true);
        }
      });
    }
  }
  
  toggleAllPermissions(key: string, event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const checked = inputElement.checked;
    const permissionGroup = this.permissionForm.get(['permissions', key]) as FormGroup;
    if (permissionGroup) {
      permissionGroup.get('view')?.setValue(checked);
      permissionGroup.get('create')?.setValue(checked);
      permissionGroup.get('update')?.setValue(checked);
      permissionGroup.get('delete')?.setValue(checked);
       permissionGroup.get('download')?.setValue(checked); // Uncomment if needed
    }
  }
  createPermissionFormGroup() {
    return this.fb.group({
      view: false,
      create: false,
      update: false,
      delete: false,
      download: false,
      selectAll: false, 
    });
  }
  private formNameMapping: { [formName: string]: { id: number, rolePermissionId: number } } = {};

  role_Permission_id : any;
  permission_id : any;



private updateFormWithApiData(apiData: any): void {
  const permissions = apiData.permission_details;
  console.log(permissions)
  permissions.forEach((permission: any) => {
    const permissionKey = permission.form_name;

    this.formNameMapping[permissionKey] = {
      id: permission.id,
      rolePermissionId: permission.rolePermission_id,
    };

    this.role_Permission_id = permission.rolePermission_id;
    this.permission_id = permission.id;

    const formControl = this.permissionForm.get(`permissions.${permissionKey}`);
    if (formControl) {
      const otherValues = [
        permission.can_view,
        permission.can_create,
        permission.can_update,
        permission.can_delete,
        permission.can_download,
      ];

      // Check if all other values are true:
      const allSelected = otherValues.every((value) => value === true);

      formControl.patchValue({
        view: permission.can_view,
        create: permission.can_create,
        update: permission.can_update,
        delete: permission.can_delete,
        download: permission.can_download,
        selectAll: allSelected || permission.selectAll,  // Apply the logic here
      });
    }
  });
}

  onFormSubmit(){
    let formData = this.permissionForm.value;
    console.log(formData)
  let updatedPermissions = [];
  
  let updatedPermissionsData : any = {
    role_id: this.roleValue.role_id,
    role_permission_details_dto: []
  };

  for (const permissionKey of Object.keys(formData.permissions)) {
    const permission = formData.permissions[permissionKey];
    console.log(permission)
    const updatedPermissionDetails = {
      form_name: permissionKey,
      can_create: permission.create,
      can_update: permission.update,
      can_view: permission.view,
      can_delete: permission.delete,
      can_download: permission.download,
      selectAll: permission.selectAll, 
    };
  

    updatedPermissionsData.role_permission_details_dto.push(updatedPermissionDetails);

  }

  console.log(updatedPermissionsData)
    this.chartService.createRoleBaseAcess(updatedPermissionsData).subscribe(
      (res: any) => {
      console.log('res', res);
      this.resMessage.emit({status : res.success, message : res.message, statusCode : res.status_code})

   
    },
    (err : any) =>{
      // this.resMessage.emit({status : false, message : err.message})
      const errorMessage = err.error && err.error.message ? err.error.message : err.message;
      this.resMessage.emit({status : false, message: errorMessage, statusCode : err.status})   

    }
    );



  }
  onUpdateForm(){
   // this.updateroleBasedAccess()

   let formData = this.permissionForm.value;
   console.log(formData)
   
   let updatedPermissionsData : any = {
     role_permission_details_update_dto: []
   };

   for (const permissionKey of Object.keys(formData.permissions)) {
    console.log(permissionKey)
     const permission = formData.permissions[permissionKey];
    console.log(permission)

     const storedInfo = this.formNameMapping[permissionKey];
    console.log(storedInfo)
 

    let updatedPermissionDetails : any;

     if (storedInfo) {
      console.log(storedInfo);
       updatedPermissionDetails = {
          id: storedInfo.id,
          form_name: permissionKey,
          can_create: permission.create,
          can_update: permission.update,
          can_view: permission.view,
          can_delete: permission.delete,
          can_download: permission.download,
          // rolePermission_id: storedInfo.rolePermissionId,
          selectAll: permission.selectAll
      };
      // updatedPermissionsData.role_permission_details_update_dto.push(updatedPermissionDetails);
  } else {
       updatedPermissionDetails = {
          id : 0,
          form_name: permissionKey,
          can_create: permission.create,
          can_update: permission.update,
          can_view: permission.view,
          can_delete: permission.delete,
          can_download: permission.download,
          selectAll: permission.selectAll,
          // rolePermission_id: this.role_Permission_id,

      };
    }

     updatedPermissionsData.role_permission_details_update_dto.push(updatedPermissionDetails);

  
   }


     console.log('updatedPermissionsData', updatedPermissionsData)
 
     this.chartService.updateroleBasedAccess(this.updateRoleId, updatedPermissionsData).subscribe(
      (res: any) => {
      console.log('res', res);
      this.resMessage.emit({status : res.success, message : res.message, statusCode : res.status_code})

     },
     (err : any) =>{
      // this.resMessage.emit({status : false, message : err.message})
      const errorMessage = err.error && err.error.message ? err.error.message : err.message;
      this.resMessage.emit({status : false, message : errorMessage, statusCode : err.status})   

    }
     
     
     );

 
  }

  deletePermission(){
    console.log('selectedRoleBasedObj', this.selectedRoleBasedObj);

    let id = this.selectedRoleBasedObj.id;

    this.chartService.deleteroleBasedAccess(id).subscribe(
      (res : any) =>{
        console.log('res', res);
        this.resMessage.emit({ status: res.success, message: res.message, statusCode: res.status_code })

      },
      (err : any) =>{
    // this.resMessage.emit({status : false, message : err.message})
        const errorMessage = err.error && err.error.message ? err.error.message : err.message;
        this.resMessage.emit({ status: false, message: errorMessage, statusCode: err.status })

      }
    )

  }

}