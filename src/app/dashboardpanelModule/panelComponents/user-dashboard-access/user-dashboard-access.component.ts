import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { fileItems } from '@syncfusion/ej2/filemanager';
import { UserService } from 'src/app/core/AuthServices/user.service';
import { ChartService } from 'src/app/core/services/chart.service';

@Component({
  selector: 'app-user-dashboard-access',
  templateUrl: './user-dashboard-access.component.html',
  styleUrls: ['./user-dashboard-access.component.scss'],
  standalone: false
})


export class UserDashboardAccessComponent implements OnInit, OnChanges {

  tableForm!: FormGroup;
  @Output() resMessage = new EventEmitter()

  permissionForm!: FormGroup;
  @Input() userBasedDashboardId: any;
  @Output() responseMsg = new EventEmitter();
  resString: string = ""

  rolesArray: any = [];
  usersArray: any = [];
  editRolePermissionIndex: any;
  updateUserPermissionIndex!: number
  message!: string;
  success: boolean = false;
  displayPopup: boolean = false;
  roleId !: number;
  constructor(private fb: FormBuilder, private chartService: ChartService, private route: ActivatedRoute,  private userService: UserService) { }

  dashboard_Name: string = '';
  dashboard_id: any;
  allDashboardAccessDetail: any = [];
  userFields: any = { text: 'username', value: 'username' };
  rolefields: any = { text: 'role', value: 'role' }

  ngOnChanges(changes: SimpleChanges): void {
    let currentValue = changes['userBasedDashboardId'].currentValue
    if (currentValue != undefined) {
      this.userBasedDashboardId = currentValue;
      this.dashboard_Name = currentValue.dashboard_name,
        this.dashboard_id = currentValue.dashboard_id;

      this.formInit()
    // Reset form when a new dashboard is assigned
      this.permissionForm.reset();
      console.log('currentValue', currentValue)


      // this.chartService.getAllActiveRoleDetails().subscribe((res: any) => {
      //   let data = res['data'];
      //   this.rolesArray = data
      // })

      let userInfoData = this.userService.getUser();
      console.log('userInfoData',  userInfoData)
  
      this.chartService.getAllActiveRoleDetails().subscribe((res : any) =>{
        ////console.log(res);
        let data = res['data']
  
        if(userInfoData.role == 'superadmin'){
          this.rolesArray = data;
        }else{
        this.rolesArray  = data.filter((user: any) => user.role !== 'superadmin');
        }
      })

      

      this.chartService.getallActiveUserDetails().subscribe((res: any) => {
        this.usersArray = res['data'];
        this.filteredUsersArray = this.usersArray
      })


    }
  }

  ngOnInit() {
  }

  formInit(roleName?: any, userName?: any) {
    //console.log(roleName, userName)
    this.permissionForm = this.fb.group({
      roleName: [roleName || ''],
      username: [userName || ''],
      permissions: this.fb.group({
        can_view: [false],
        can_download: [false],
        can_schedule: [false],
        can_create: [false],
        can_update: [false],
        can_delete: [false],
        allSelect: [false]
      }),
    })
  }

  filteredUsersArray: any[] = []; // Add this property to hold the filtered users
  roleName: string = '';
  userName: string = '';
  onSelectRole(eve: any) {
    console.log('eve', eve);
    let value = eve.itemData.role;
    this.roleName = value
    this.formInit(this.roleName);

    this.chartService.getRoleDetailsByRolename(value).subscribe((res: any) => {
      let data = res['data'];
      this.roleId = data.id
    })

    if (value) {
      this.filteredUsersArray = this.usersArray.filter((ele: any) => ele.role === value);
      //console.log(this.filteredUsersArray);
    } else if (value === '') {
      this.filteredUsersArray = this.usersArray;
    } else {
      this.filteredUsersArray = this.usersArray;
    }
  }
  submitflag: boolean = true;
  updateFlag: boolean = false;
  @Output() resFlag = new EventEmitter<any>();
  MatchedObject: any;
  role_id: any;
  user_id: any;

  onSelectUser(eve: any) {
    let val = eve.itemData.username;
    let userobj: any;
    this.chartService.getUserDetailByUsername(val).subscribe((res: any) => {
      let data = res['data'];
      userobj = data;
      this.userName = data.username;
      this.user_id = data.user_id;

      this.chartService.getAllUserDashboardPermissionByRoleidUserId(this.roleId, data.user_id).subscribe((res: any) => {

        if (res.success) {
          let resData = res['data'];
          this.updateUserPermissionIndex = resData.id
          let obj = resData.permission_details.find((ele: any) => ele.dashboard_id === this.dashboard_id);
          if (obj != undefined) {
            this.editRolePermissionIndex = obj.id;
            this.MatchedObject = obj
            console.log('this.MatchedObject', this.MatchedObject, 'this.roleId', this.roleId, 'data.user_id', data.user_id)

            const otherValues = [
              obj.can_view,
              obj.can_create,
              obj.can_update,
              obj.can_delete,
              obj.can_download,
            ];

            const allSelected = otherValues.every((value) => value === true);

            this.permissionForm.patchValue({
              roleName: this.roleName,
              username: userobj.username,
              permissions: {
                can_view: obj.can_view,
                can_download: obj.can_download,
                can_schedule: obj.can_schedule,
                can_create: obj.can_create,
                can_delete: obj.can_delete,
                can_update: obj.can_update,
                allSelect: allSelected || obj.allSelect,
              }
            });

            this.submitflag = false;
            this.updateFlag = true;
            this.resFlag.emit({ submit: this.submitflag, update: this.updateFlag })
          } else {
            this.formInit(this.roleName, userobj.username);
            this.submitflag = true;
            this.updateFlag = false;
            this.resFlag.emit({ submit: this.submitflag, update: this.updateFlag })
          }
        } else {
          this.formInit(this.roleName, userobj.username);
          this.submitflag = true;
          this.updateFlag = false;
          this.resFlag.emit({ submit: this.submitflag, update: this.updateFlag })
        }
      })
    })

  }

  onDelete() {
    console.log(this.roleId, this.user_id, this.MatchedObject)
    this.chartService.deleteDashboardPermissionByRoleUserPermissionId(this.roleId, this.user_id, this.MatchedObject.id).subscribe(
      
      (res: any) => {
      console.log('deleted res', res);

      this.resMessage.emit({ status: res.success, message: res.message, statusCode : res.status_code  });
    },
    (err : any) =>{
      const errorMessage = err.error && err.error.message ? err.error.message : err.message;
      this.resMessage.emit({ status: err.success, message: errorMessage, statusCode : err.status  })

    }
  
  )

  }

  selectAll(event: any) {
    const checked = event.target.checked;
    const dashboardPermission = this.permissionForm.get('permissions') as FormGroup;
    if (dashboardPermission) {
      Object.keys(dashboardPermission.controls).forEach(controlName => {
        dashboardPermission.get(controlName)!.setValue(checked);
      });
    }
  }

  onFormSubmit() {
    const formData = this.permissionForm.value;
    let roleName = formData.roleName;
    let role_Id: number;
    let updatedPermissionsData: any;
    this.chartService.getRoleDetailsByRolename(roleName).subscribe(
      (res: any) => {
        let data = res['data'];
        //console.log(data)
        this.roleId = data.id;

        this.chartService.getUserDetailByUsername(formData.username).subscribe(
          (res: any) => {

            let data = res['data'];
            //console.log(data)
            let user_id = data.user_id

            updatedPermissionsData = {
              "role_id": this.roleId,
              "user_id": user_id,
              user_dashboard_permission_details_dto: [
                {
                  "dashboard_id": this.dashboard_id,
                  "dashboard_name": this.dashboard_Name,
                  "can_view": formData.permissions.can_view,
                  "can_download": formData.permissions.can_download,
                  "can_create": formData.permissions.can_create,
                  "can_update": formData.permissions.can_update,
                  "can_delete": formData.permissions.can_delete,
                  "can_schedule": true,
                  "allSelect": formData.permissions.allSelect
                }
              ]
            };


            this.chartService.createUserBaseDashboardAcess(updatedPermissionsData).subscribe({
              next: (res: any) => {
                //console.log(res);
                this.resMessage.emit({ status: res.success, message: res.message, statusCode : res.status_code  })
              },
              error: (err: any) => {
                //this.resMessage.emit({ status: err.success, message: err.message })
                const errorMessage = err.error && err.error.message ? err.error.message : err.message;
                this.resMessage.emit({ status: err.success, message: errorMessage, statusCode : err.status  })
              },
            
            });
          }
        )

      }
    )

   // this.rolesArray = []



  }

  onformUpdate() {
    const formData = this.permissionForm.value;
    let obj = {
      "user_dashboard_permission_details_update_dto": [
        {
          "id": 0,
          "dashboard_id": "string",
          "dashboard_name": "string",
          "can_view": true,
          "can_download": true,
          "can_schedule": true,
          "can_create": true,
          "can_delete": true,
          "can_update": true
        }
      ]
    }
    let updatedPermissionsData: any = {

      "user_dashboard_permission_details_update_dto": [
        {
          "id": this.editRolePermissionIndex,
          "dashboard_id": this.dashboard_id,
          "dashboard_name": this.dashboard_Name,
          "can_view": formData.permissions.can_view,
          "can_download": formData.permissions.can_download,
          "can_create": formData.permissions.can_create,
          "can_update": formData.permissions.can_update,
          "can_delete": formData.permissions.can_delete,
          "can_schedule": true,
          "allSelect": formData.permissions.allSelect

        }
      ]
    };




    this.chartService.updateuserBasedDashboardAccess(this.updateUserPermissionIndex, updatedPermissionsData).subscribe(
      (res: any) => {
        this.resMessage.emit({ status: res.success, message: res.message, statusCode : res.status_code  })

      },
      (err: any) => {
      //  this.resMessage.emit({ status: err.success, message: err.message })
      const errorMessage = err.error && err.error.message ? err.error.message : err.message;
      this.resMessage.emit({ status: err.success, message: errorMessage, statusCode : err.status  })

      }
    );
  }


}
