import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, inject} from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserService } from 'src/app/core/auth-services/user.service';
import { ChartService } from 'src/app/core/services/chart.service';

@Component({
    selector: 'app-user-based-permission',
    templateUrl: './user-based-permission.component.html',
    styleUrls: ['./user-based-permission.component.scss'],
    imports: [FormsModule, ReactiveFormsModule]
})

export class UserBasedPermissionComponent implements OnInit, OnChanges {

  tableForm!: FormGroup;
  @Output() resMessage = new EventEmitter()

  @Input() getUserObj: any;
  userAccessObj: any;
  permissionForm!: FormGroup;
  seletedUserObj : any;

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
    { key: 'dashboardSetup', label: 'Dashboard Setup' },
    { key: 'chatbotSetup', label: 'Show Chatbot' },

    { key: 'createGroupDashboard', label: 'Create Dashboard Group' },

  ];



  rolesArray: any = [];
  usersArray: any = [];
  userObjId: any;
  private readonly fb = inject(FormBuilder);
  private readonly chartService = inject(ChartService);
  private readonly userService = inject(UserService);
  ngOnChanges(changes: SimpleChanges): void {

    let userObj = changes['getUserObj'].currentValue;


    if (userObj != undefined || userObj != null) {
      this.userAccessObj = userObj;
      console.log(userObj);

      this.chartService.getRoleDetailsByRolename(this.userAccessObj.role).subscribe((res: any) => {
        let roleData = res['data'];
        let roleId = roleData.id;

        this.chartService.getUserPermissionByRoleIdUserId(roleId, this.userAccessObj.user_id).subscribe(
          (res: any) => {

            console.log(res);

            if (res.success) {
              let data = res['data'];
              console.log(data)
              this.userObjId = data.id;
              this.seletedUserObj = data;
              let permissionDetials = data.permission_details;
              this.updateFormWithApiData(data);

            } else {
              this.formInit()
            }
          })
      })

    }

  }
  private formNameMapping: { [formName: string]: { id: number, userPermission_id: number } } = {};

  private updateFormWithApiData(apiData: any): void {
    const permissions = apiData.permission_details;

    permissions.forEach((permission: any) => {
      const permissionKey = permission.form_name;

      this.formNameMapping[permissionKey] = {
        id: permission.id,
        userPermission_id: permission.userPermission_id
      };

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
          selectAll: allSelected || permission.selectAll,  // Set selectAll based on condition
        });
      }
    });
  }

  formInit() {

    let userInfoData = this.userService.getUser();
    console.log('userInfoData in role page', userInfoData)



    this.permissionForm = this.fb.group({
      // roleName : [''],
      // username : [''],
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
        tableJoin: this.createPermissionFormGroup(),
        dashboardSetup: this.createPermissionFormGroup(),
        chatbotSetup: this.createPermissionFormGroup(),
        createGroupDashboard: this.createPermissionFormGroup(),
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
        console.log(control)

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

  ngOnInit() {


    this.formInit()
    this.chartService.getAllRolesDetails().subscribe((res: any) => {
      let data = res['data']
      // this.rolesArray = data
    })

    this.chartService.getAllActiveRoleDetails().subscribe((res: any) => {
      // //console.log(res);
      let data = res['data']
      this.rolesArray = data
    })


    let userInfoData = this.userService.getUser();
    console.log('userInfoData in role page', userInfoData)

    // Filter permissions based on role
    // if (userInfoData?.role !== 'superadmin') {
    //   this.permissionRows = this.permissionRows.filter(
    //     (permission) => permission.key !== 'chatbotSetup'
    //   );
    // }

    if (userInfoData?.username !== 'superadmin') {
      this.permissionRows = this.permissionRows.filter(
        (permission) => permission.key !== 'chatbotSetup'
      );
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

  onFormSubmit() {

    let formData = this.permissionForm.value;
    let roleIdObj = this.rolesArray.find((ele: any) => ele.role === this.userAccessObj.role)
    let updatedPermissionsData: any = {
      "role_id": roleIdObj.id,
      "user_id": this.userAccessObj.user_id,
      user_permission_details_dto: []
    };

    for (const permissionKey of Object.keys(formData.permissions)) {
      let permission = formData.permissions[permissionKey];
      let updatedPermissionDetails = {
        form_name: permissionKey,
        can_create: permission.create,
        can_update: permission.update,
        can_view: permission.view,
        can_delete: permission.delete,
        can_download: permission.download,
        selectAll: permission.selectAll
      };
      updatedPermissionsData.user_permission_details_dto.push(updatedPermissionDetails);
    }
    console.log(updatedPermissionsData)
    this.chartService.createUserBaseAccess(updatedPermissionsData).subscribe(
      (res: any) => {
        console.log('res', res);
        this.resMessage.emit({ status: res.success, message: res.message, statusCode: res.status_code })

      },
      (err: any) => {
        console.log('error');
        // this.resMessage.emit({status : err.success, message : err.message})
        const errorMessage = err.error && err.error.message ? err.error.message : err.message;
        this.resMessage.emit({ status: false, message: errorMessage, statusCode: err.status })


      }

    );


  }

  onUpdateFormSubmit() {
    let formData = this.permissionForm.value;
    //console.log(formData)

    let updateObj = {
      "user_permission_details_update_dto": [
        {
          "id": 0,
          "form_name": "string",
          "can_create": true,
          "can_update": true,
          "can_view": true,
          "can_delete": true,
          "can_download": true
        }
      ]
    }
    let updatedPermissionsData: any = {

      user_permission_details_update_dto: []
    };

    for (const permissionKey of Object.keys(formData.permissions)) {
      let permission = formData.permissions[permissionKey];
      const storedInfo = this.formNameMapping[permissionKey];

      let updatedPermissionDetails: any;

      if (storedInfo) {
        updatedPermissionDetails = {
          id: storedInfo.id,
          form_name: permissionKey,
          can_create: permission.create,
          can_update: permission.update,
          can_view: permission.view,
          can_delete: permission.delete,
          can_download: permission.download,
          // userPermission_id : storedInfo.userPermission_id,
          selectAll: permission.selectAll
        };
      } else {
        updatedPermissionDetails = {
          id: 0,
          form_name: permissionKey,
          can_create: permission.create,
          can_update: permission.update,
          can_view: permission.view,
          can_delete: permission.delete,
          can_download: permission.download,
          //  userPermission_id : storedInfo.userPermission_id,
          selectAll: permission.selectAll,

        };
      }

      updatedPermissionsData.user_permission_details_update_dto.push(updatedPermissionDetails);


    }




    console.log(this.userObjId, typeof (this.userObjId));
    console.log(updatedPermissionsData);
    this.chartService.updateUserBasedAccess(this.userObjId, updatedPermissionsData).subscribe(
      (res: any) => {
        console.log(res)
        this.resMessage.emit({ status: res.success, message: res.message, statusCode: res.status_code })


      },
      (err: any) => {
        const errorMessage = err.error && err.error.message ? err.error.message : err.message;
        this.resMessage.emit({ status: false, message: errorMessage, statusCode: err.status })

      }
    )
  }

  onDeleteUserBasedForm() {

    console.log("seletedUserObj :", this.seletedUserObj);

    let id = this.seletedUserObj.id;

    this.chartService.deleteUserBasedAccess(id).subscribe(
      (res: any) => {
        console.log('res', res);
        this.resMessage.emit({ status: res.success, message: res.message, statusCode: res.status_code })

      },
      (err: any) => {
        // this.resMessage.emit({status : false, message : err.message})
        const errorMessage = err.error && err.error.message ? err.error.message : err.message;
        this.resMessage.emit({ status: false, message: errorMessage, statusCode: err.status })

      }
    )
  }


}
