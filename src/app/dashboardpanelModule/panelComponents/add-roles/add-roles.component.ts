import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component, HostListener, OnInit, ViewChild, inject} from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ChartService } from 'src/app/core/services/chart.service';
import { MenuBasedAccessService } from 'src/app/core/services/menu-based-access.service';
import { RoleBasedPermissionComponent } from '../role-based-permission/role-based-permission.component';
import { GridComponent, GridModule, PageService, GroupService, SortService, FilterService, ResizeService, ReorderService, ColumnMenuService, ExcelExportService as GridExcelExportService, PdfExportService as GridPdfExportService, ToolbarService as GridToolbarService } from '@syncfusion/ej2-angular-grids';
import { LoaderService } from 'src/app/core/services/loader.service';
import { HttpErrorResponse } from '@angular/common/http';
import { PopupService } from 'src/app/core/services/popup.service';
import { MultipleDashboardRolePermissionComponent } from '../multiple-dashboard-role-permission/multiple-dashboard-role-permission.component';
import { NgIf, NgStyle, NgFor } from '@angular/common';
import { ButtonModule, SwitchModule } from '@syncfusion/ej2-angular-buttons';
import { ChartModule } from '@syncfusion/ej2-angular-charts';
import { KanbanModule } from '@syncfusion/ej2-angular-kanban';

@Component({
    selector: 'app-add-roles',
    templateUrl: './add-roles.component.html',
    animations: [
        trigger('placeholderAnimation', [
            state('initial', style({
                top: '20px'
            })),
            state('focused', style({
                top: '-10px'
            })),
            transition('initial => focused', animate('200ms ease-in')),
            transition('focused => initial', animate('200ms ease-out'))
        ])
    ],
    styleUrls: ['./add-roles.component.scss'],
    providers: [PageService, GroupService, SortService, FilterService, ResizeService, ReorderService, ColumnMenuService, GridExcelExportService, GridPdfExportService, GridToolbarService],
    imports: [FormsModule, NgIf, ButtonModule, GridModule, ChartModule, KanbanModule, NgStyle, ReactiveFormsModule, SwitchModule, RoleBasedPermissionComponent, NgFor, MultipleDashboardRolePermissionComponent]
})

export class AddRolesComponent implements OnInit {

  registrationForm!: FormGroup;

  @ViewChild(RoleBasedPermissionComponent) RoleBasedPermissionComponent!: RoleBasedPermissionComponent;
  @ViewChild(MultipleDashboardRolePermissionComponent) MultipleDashboardRolePermissionComponent!: MultipleDashboardRolePermissionComponent;

  showDefaultDialog = false;
  showRoleDialog = false;
  showDbPermissionDialog = false;
  showMultipleDbPermission = false;
  isModalClosing = false;

  private openModal(modalFlag: 'showDefaultDialog' | 'showRoleDialog' | 'showDbPermissionDialog' | 'showMultipleDbPermission'): void {
    (this as any)[modalFlag] = true;
    document.body.classList.add('ar-modal-open');
  }

  private closeModalWithAnimation(modalFlag: 'showDefaultDialog' | 'showRoleDialog' | 'showDbPermissionDialog' | 'showMultipleDbPermission'): void {
    this.isModalClosing = true;
    setTimeout(() => {
      (this as any)[modalFlag] = false;
      this.isModalClosing = false;
      if (!this.showDefaultDialog && !this.showRoleDialog && !this.showDbPermissionDialog && !this.showMultipleDbPermission) {
        document.body.classList.remove('ar-modal-open');
      }
    }, 250);
  }

  
  sendRoleObj: any;
  sendRoleObjToPermissionPage : any;
  formTitle: string = "Add Role";
  initialPage = { pageSizes: true, pageCount: 4 };


  dialogCloseIcon: Boolean = true;
  dialogWidth: string = '400px';
  dialogdragging: Boolean = true;
  isModal: Boolean = true;
  target: string = '.control-section';
  visible: Boolean = false;
  submitFlag: boolean = true;
  updateFlag: boolean = false;

  menuBasedAccess: any = {};
  permissionObj: any = {};
  menuBasedPermissionControlArray: any = []

  dialogBtnClick = (): void => {
    this.initForm()
    this.isActiveToggle = true;
    this.submitFlag = true;
    this.updateFlag = false;
    this.openModal('showDefaultDialog');
    this.formTitle = "Add Role"
  }

  closeDefaultDialog(): void {
    this.closeModalWithAnimation('showDefaultDialog');
  }

  closeRoleDialog(): void {
    this.closeModalWithAnimation('showRoleDialog');
  }

  closeDbPermissionDialog(): void {
    this.closeModalWithAnimation('showDbPermissionDialog');
  }

  closeMultipleDbPermission(): void {
    this.closeModalWithAnimation('showMultipleDbPermission');
  }

  roleDialogBox_show(): void {
    this.openModal('showRoleDialog');
  }

  roleDbPermissionDlgBox_show(): void {
    this.openModal('showDbPermissionDialog');
  }

  showMultipleDbPermission_open(): void {
    this.openModal('showMultipleDbPermission');
  }

  dialogClose = (): void => {
  }

  dialogOpen = (): void => {
  }

  successResFlag: boolean = false;
  errorResFlag: boolean = false;

  registeredUsersArray: any = []
  roleBasedAccessObj: any;
  roleDashboardPermissionObj : any;
  userRoleInfo : any;
  isActiveToggle: boolean = true;

  private readonly formBuilder = inject(FormBuilder);
  private readonly chartService = inject(ChartService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly menuBasedAccessService = inject(MenuBasedAccessService);
  private readonly loaderService = inject(LoaderService);
  private readonly popupService = inject(PopupService);

  ngOnInit() {
    this.initForm();
    this.menuBasedAccessService.menuAccess$.subscribe((menuAccess) => {
      this.menuBasedAccess = menuAccess;
      this.menuBasedPermissionControlArray = this.menuBasedAccess?.permission_details
      const formNameToFind = 'addRole';
      const permissionDetailForROle = this.menuBasedPermissionControlArray?.find(
        (permission: any) => permission.form_name === formNameToFind
      );
      const permissionDetailsForUserBasedAccess = this.menuBasedPermissionControlArray?.find(
        (permission: any) => permission.form_name === "rolePermission"
      );
      this.roleBasedAccessObj = permissionDetailsForUserBasedAccess
      if (permissionDetailForROle) {
        this.permissionObj = permissionDetailForROle
      } else {
        console.log('Permission details not found for "addRole"');
      }

      const roleDashboardPermssions  = this.menuBasedPermissionControlArray?.find(
        (permission: any) => permission.form_name === 'roleBaseddashboardAccess'
      );


      if (roleDashboardPermssions) {
        this.roleDashboardPermissionObj = roleDashboardPermssions
      }



    });


    let userData: any = sessionStorage.getItem('userInformation');

    if (userData) {
      userData = JSON.parse(userData);
      let userName = userData.username;
      this.userRoleInfo = userName;

      this.loaderService.show();
      this.loadRoles();





    //   this.chartService.getUserDetailByUsername(userData.username).subscribe(
    //     (res: any) => {
    //     console.log('user res', res);
    //     let userInfo = res['data'];
    //     this.userRoleInfo = userInfo;
    //    console.log('isRoleSuperadmin', userInfo)

    //     if (userInfo.username == 'superadmin') {
    //       this.loaderService.show()

    //       this.chartService.getAllRolesDetails().subscribe(
    //         (res: any) => {
    //           this.loaderService.hide()


    //           if (res.success) {
    //             this.registeredUsersArray = res['data'];
    //             this.filteredRolesArray = this.registeredUsersArray.sort((a: { id: number; }, b: { id: number; }) => b.id - a.id)

                
    //             sessionStorage.setItem('rolesArray', JSON.stringify(this.registeredUsersArray))
    //           } else {
    //             this.loaderService.hide()
    //             // this.showPopup(res.success, '35px', res.message)
    //             this.popupService.showPopup({
    //               message: res.message,
    //               statusCode: res.status_code,
    //               status : res.success
    //             });
    //           }

    //         },
         
    //         (err: HttpErrorResponse) => {

    //           this.loaderService.hide();
    //           // this.showPopup(false, '35px', "Something Went wrong, Please reload the page");

              
    //         this.popupService.showPopup({
    //           message: err.message,
    //           statusCode: err.status,
    //           status :false
    //         });
    //         }


    //       )

    //     } else {
    //       console.log('isRoleSuperadmin no', userInfo)
    //       this.loaderService.show()

    //       this.chartService.getAllActiveRoleDetails().subscribe(
    //         (res: any) => {
    //           this.loaderService.hide()

    //           console.log('Active Roles', res['data'])

    //           if (res.success) {
    //             this.registeredUsersArray = res['data'];
    //             console.log('before role remve', this.registeredUsersArray)
    //             this.registeredUsersArray = res['data'].filter((user: any) => user.role !== 'superadmin');
    //             console.log('after role remve', this.registeredUsersArray)


    //             // this.registeredUsersArray = [data, ...this.registeredUsersArray].sort((a, b) => b.id - a.id);
    //             this.filteredRolesArray = this.registeredUsersArray.sort((a: { id: number; }, b: { id: number; }) => b.id - a.id)

    //             // this.filteredRolesArray = this.registeredUsersArray;

    //             sessionStorage.setItem('rolesArray', JSON.stringify(this.registeredUsersArray))
    //           } else {
    //             this.loaderService.hide()
    //             // this.showPopup(res.success, '35px', res.message)
    //             this.popupService.showPopup({
    //               message: res.message,
    //               statusCode: res.status_code,
    //               status : res.success
    //             });
    //           }

    //         },
    
    //         (err: HttpErrorResponse) => {

    //           this.loaderService.hide();
    //           // this.showPopup(false, '35px', "Something Went wrong, Please reload the page");

    //           this.popupService.showPopup({
    //             message: err.message,
    //             statusCode: err.status,
    //             status :false
    //           });
    //         }


    //       )
    //     }
    //   },
    //   (err: HttpErrorResponse) => {

    //     this.loaderService.hide();
    //     // this.showPopup(false, '35px', "Something Went wrong, Please reload the page");

    //     this.popupService.showPopup({
    //       message: err.message,
    //       statusCode: err.status,
    //       status :false
    //     });
    //   }

    // )
    }

    this.getRolesArrayDataFromLocalStorage()

  }

  @ViewChild('grid') grid!: GridComponent;

  dataBound(item: any) {
    this.grid.autoFitColumns([]);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (window.innerWidth <= 768) {
      this.grid.autoFitColumns([]);
    }
  }

  closePopup(): void {
    const popup = document.getElementById('popup');
    const backdrop = document.getElementById('backdrop');

    if (popup && backdrop) {
      popup.style.display = 'none';
      backdrop.style.display = 'none';
      this.refreshPage()
    }
  }

  onLoad(): void {
    (this.grid as GridComponent).adaptiveDlgTarget = document.getElementsByClassName('e-mobile-content')[0] as HTMLElement;
  }

  showPopup(status: any, fontSize: string = '40px', resMessage: string): void {
    const popup = document.getElementById('popup');
    const backdrop = document.getElementById('backdrop');
    const popupMessage = document.getElementById('popup-message');

    if (popup && backdrop && popupMessage) {
      const iconClass = status === true ? 'fa-check-circle' : 'fa-times-circle';
      const iconColor = status === true ? 'green' : 'red';

      // Use innerHTML for the icon
      popupMessage.innerHTML = `<span style="color: ${iconColor};"><i class="fas ${iconClass}" style="font-size: ${fontSize};"></i></span>`;

      // Create a separate element for status (h5) and resMessage (h6)
      const statusElement = document.createElement('h5');
      statusElement.textContent = status === true ? 'Success' : 'Error';
      popupMessage.appendChild(statusElement);

      const messageElement = document.createElement('div');
      messageElement.innerHTML = `<h6>${resMessage}</h6>`;
      popupMessage.appendChild(messageElement);

      // Calculate the top position based on the current scroll position
      const scrollTop = document.documentElement.scrollTop;
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      const popupHeight = popup.offsetHeight;

      const topPosition = Math.max(0, scrollTop + windowHeight / 2 - popupHeight / 2);

      // Apply the calculated position to the popup
      popup.style.top = topPosition + 'px';
      popup.style.display = 'block';

      backdrop.style.display = 'block';
    }
  }

  initForm() {
    this.registrationForm = this.formBuilder.group({
      role: ['', [Validators.required]],
      description: ['']
    });

  }

  private getRolesArrayDataFromLocalStorage() {
    let panelData = sessionStorage.getItem('rolesArray');
    if (panelData !== null) {
      this.registeredUsersArray = JSON.parse(panelData);
      this.filteredRolesArray = this.registeredUsersArray
    } else {
      this.registeredUsersArray = [];
    }
  }

  loadRoles() {
    if (this.userRoleInfo === 'superadmin') {
      this.chartService.getAllRolesDetails().subscribe(
        (res: any) => {
          this.loaderService.hide();
          if (res.success) {
            this.registeredUsersArray = res['data'];
            this.filteredRolesArray = this.registeredUsersArray.sort((a: { id: number; }, b: { id: number; }) => b.id - a.id);
            sessionStorage.setItem('rolesArray', JSON.stringify(this.registeredUsersArray));
          }
        },
        (err: HttpErrorResponse) => {
          this.loaderService.hide();
        }
      );
    } else {
      this.chartService.getAllActiveRoleDetails().subscribe(
        (res: any) => {
          this.loaderService.hide();
          if (res.success) {
            this.registeredUsersArray = res['data'].filter((user: any) => user.role !== 'superadmin');
            this.filteredRolesArray = this.registeredUsersArray.sort((a: { id: number; }, b: { id: number; }) => b.id - a.id);
            sessionStorage.setItem('rolesArray', JSON.stringify(this.registeredUsersArray));
          }
        },
        (err: HttpErrorResponse) => {
          this.loaderService.hide();
        }
      );
    }
  }

  editRecord(data: any) {
    this.submitFlag = false;
    this.updateFlag = true;
    this.formTitle = "Update Role"

    console.log(data)
    this.openModal('showDefaultDialog');

    this.chartService.getRoleDetailsByRolename(data.role).subscribe((res: any) => {
      let data = res['data'];
      this.editColumnObjIndex = data.id;
      console.log(data);
      let apiObj = {
        "role": data.role || '',
        "description": data.description || '',
        "role_id": data.id || '',
        is_active: data.is_active != null ? data.is_active : true
      };
      this.isActiveToggle = apiObj.is_active != null ? apiObj.is_active : true;
      this.registrationForm.patchValue({
        role: apiObj.role || '',
        description: apiObj.description || ''
      });
    });
  }

  filterTerm: string = '';
  filteredRolesArray: any = [];


  onSearchChange(eve: any) {
    console.log('typed value', this.filterTerm);
    console.log('userRoleInfo', this.userRoleInfo);
    console.log('filteredRolesArray', this.filteredRolesArray);
    console.log('registeredUsersArray', this.registeredUsersArray);

    if(this.userRoleInfo !== 'superadmin'){
      this.registeredUsersArray = this.registeredUsersArray.filter((user: any) => user.role !== 'superadmin');
    }


    this.filteredRolesArray = this.registeredUsersArray.filter((user: any) =>
      user.role.toLowerCase().includes(this.filterTerm.toLowerCase())
    );

    console.log('this.filteredUsersArray after filtering', this.filteredRolesArray);

  }




  updateRolePermissionBtn: boolean = false;
  submitRolePermissionBtn: boolean = true;

  onRoleFormClick(data: any) {
    console.log(data);
    let matchRoleId = this.registeredUsersArray.find((ele: any) => ele.role === data.role);
    console.log(matchRoleId)
    let obj = {
      role_id: matchRoleId.id,
      role: matchRoleId.role
    }
    this.roleDialogBox_show();
    this.sendRoleObj = obj;
    
    this.chartService.getroleBasedPermissionByroleId(obj.role_id).subscribe((res: any) => {
      console.log('res data permission', res);

      if (res.success == true) {
        // let data = res['data'];
        this.updateRolePermissionBtn = true;
        this.submitRolePermissionBtn = false;
      } else {
        this.updateRolePermissionBtn = false;
        this.submitRolePermissionBtn = true;
      }
    })


  }


  roleErrorMessage: string = '';
  roleValid: boolean = false;

  onRoleSerach(eve: any) {
    let val = eve.target.value;
    console.log(val);

    if (val) {
      this.chartService.getRoleDetailsByRolename(val).subscribe(
        (res: any) => {
          console.log(res);
          if (res.success) {
            // Role is valid
            this.roleValid = true;
            this.roleErrorMessage = "Role is already exist"; // Clear the error message
          } else {
            this.roleValid = false;
            this.roleErrorMessage = ''
          }
        },
        (err: any) => {
          console.log(err)
        }
      );
    }

  }


  onUpdateRolebasedForm() {
    this.RoleBasedPermissionComponent.onUpdateForm();
    this.showRoleDialog = false;
    this.formTitle = "Add Role"

    // this.refreshPage()
  }

  onDeleteRolebasedForm(){
    this.RoleBasedPermissionComponent.deletePermission();
    this.showRoleDialog = false;
  }


  deleteRecord(user: any) {
    let deleteMessage = window.confirm("Do you want to delete the Role ");

    if (deleteMessage) {
      this.loaderService.show()

      // First fetch role details to get reliable id, then delete by id
      this.chartService.getRoleDetailsByRolename(user.role).subscribe(
        (roleRes: any) => {
          const roleId = roleRes['data']?.id;
          if (!roleId) {
            this.loaderService.hide();
            this.popupService.showPopup({
              message: 'Unable to find role ID for deletion',
              statusCode: 404,
              status: false
            });
            return;
          }

          this.chartService.deleteRoleById(roleId).subscribe(
            (res: any) => {
              this.loaderService.hide()
              this.loadRoles();

              this.popupService.showPopup({
                message: res.message,
                statusCode: res.status_code,
                status: res.success
              });
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

    } else {
      console.log('Cancel the delete');
    }
  }



  onInputFocus(event: FocusEvent) {
    const input = event.target as HTMLInputElement;
    input.classList.add('focused');
  }

  onInputBlur(event: any) {
    const input = event.target as HTMLInputElement;
    input.classList.remove('focused');
  }

  resMessage: string = '';
  message!: string;
  success: boolean = false;
  displayPopup: boolean = false;

  onSubmit() {
    // Submit the form to your backend server here;
    let formValue = this.registrationForm.value

    Object.keys(formValue).forEach((key) => {
      const controlValue = formValue[key];
      if (typeof controlValue === 'string') {
        formValue[key] = controlValue.trim();
      }
    });

    console.log('formValue', formValue);
    if (this.registrationForm.valid) {

      let apiObj = {
        "is_active": this.isActiveToggle,
        role: formValue.role || '',
        description: formValue.description || ''
      }
      console.log('apiObj', apiObj);

      // this.chartService.getRoleDetailsByRolename(apiObj.role).subscribe(
      //   (res: any) => {
      //     let data = res['data'];
      //     console.log(data)
      //   }
      // )

      let roleNameObj = this.registeredUsersArray.find((ele: any) => ele.role == apiObj.role);
      console.log(roleNameObj)
      if (roleNameObj) {
        alert("Role is already exists")
      } else {
        this.loaderService.show()

        this.chartService.createRole(apiObj).subscribe(
          (res: any) => {
            console.log('res', res);
            this.showDefaultDialog = false;
            this.registrationForm.reset({ role: '', description: '' });
            this.isActiveToggle = true;
            this.loadRoles();

            this.popupService.showPopup({
              message: res.message,
              statusCode: res.status_code,
              status : res.success
            });
     
          },
        
          (err: HttpErrorResponse) => {

            this.loaderService.hide();
            const errorMessage = err.error && err.error.message ? err.error.message : err.message;
            this.popupService.showPopup({
              message: errorMessage,
              statusCode: err.status,
              status :false
            });
          }
        
        );
      }
    }
  }

  editColumnObjIndex: any;
  // onEditClick(obj: any, id: any) {
  //   this.submitFlag = false;
  //   this.updateFlag = true;
  //   console.log(obj, id, this.registeredUsersArray);
  //   this.editColumnObjIndex = id;
  //   // let objId = this.registeredUsersArray.find((ele : any) => ele.id == id);
  //   this.defaultDialog.show()
  //   this.registrationForm.patchValue(obj);

  // }
  onUpdate() {
    const updatedObj = this.registrationForm.value;
    this.submitFlag = true;
    this.updateFlag = false;
    this.showDefaultDialog = false;
    console.log(updatedObj)

    if (this.registrationForm.valid) {
      let apiObj = {
        "role": updatedObj.role || '',
        "description": updatedObj.description || '',
        "is_active": this.isActiveToggle
      };

      this.loaderService.show()
      this.chartService.updateRoleById(this.editColumnObjIndex, apiObj).subscribe(
        (res: any) => {

          this.loaderService.hide()
          this.loadRoles();

          this.popupService.showPopup({
            message: res.message,
            statusCode: res.status_code,
            status : res.success
          });


        },
    
        (err: HttpErrorResponse) => {

          this.loaderService.hide();
        //  this.showPopup(false, '35px', "Something Went wrong, Please reload the page");
          const errorMessage = err.error && err.error.message ? err.error.message : err.message;
          this.popupService.showPopup({
            message: errorMessage,
            statusCode: err.status,
            status :false
          });
         }
      );
    }
  }

  refreshPage() {
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }
  onRoleBasedFormSubmit() {
    this.RoleBasedPermissionComponent.onFormSubmit();
    this.showRoleDialog = false;
    // this.refreshPage()
  }
  getResponseMessage(eve: any) {

    // this.showPopup(eve.status, '35px', eve.message)
    this.popupService.showPopup({
      message: eve.message,
      statusCode: eve.statusCode,
      status :eve.status
    });


  }

RoleName : string = "";
dashboardPermissionsList : any
openDashboardPopup(data : any){
    console.log('data', data);
    this.RoleName = "Dashboard Permissions For Role : " +  data.role
    this.roleDbPermissionDlgBox_show();

    this.chartService.getAllRoleDashboardPermissionByRoleid(data.id).subscribe(
      (res: any) => {
        let  permission_details = res['data']?.permission_details;
        console.log('permission_details', permission_details);
        this.dashboardPermissionsList = permission_details
      },
      (error: any) => {
        // Handle the case when no permissions are given (404 error)
        console.log('Error getting role dashboard permissions', error);
        
        // Check if it's a 404 or "No permissions given" response
        if (error.status === 404 || error.error?.message === "No permissions given") {
          // No permissions exist
          this.dashboardPermissionsList = [];
        } else {
          // Some other error occurred
          console.error('Unexpected error', error);
          this.dashboardPermissionsList = [];
        }
      }
    )
}

isSubmitDashboardFlag: boolean = true;
isUpdateDashboardFlag: boolean = false;
 onRoledashboardFormClick(data : any){
    console.log('data in multiselect dashboard', data)
    this.RoleName = "Dashboard Permissions For Role : " + data.role

    let matchRoleId = this.registeredUsersArray.find((ele: any) => ele.role === data.role);
    console.log(matchRoleId)
    let obj = {
      role_id: matchRoleId.id,
      role: matchRoleId.role
    }
    this.showMultipleDbPermission_open();
    this.sendRoleObjToPermissionPage = obj;

    // this.chartService.getAllRoleDashboardPermissionByRoleid(currentValue.role_id)
    this.chartService.getAllRoleDashboardPermissionByRoleid(obj.role_id).subscribe(
      (res: any) => {
        console.log('res data permission', res);

        if (res.success == true) {
          // let data = res['data'];
          this.isUpdateDashboardFlag = true;
          this.isSubmitDashboardFlag = false;
        } else {
          this.isUpdateDashboardFlag = false;
          this.isSubmitDashboardFlag = true;
        }
      },
      (error: any) => {
        // Handle the case when no permissions are given (404 error)
        console.log('Error getting role dashboard permissions', error);
        
        // Check if it's a 404 or "No permissions given" response
        if (error.status === 404 || error.error?.message === "No permissions given") {
          // No permissions exist, so show Submit button
          this.isUpdateDashboardFlag = false;
          this.isSubmitDashboardFlag = true;
        } else {
          // Some other error occurred
          console.error('Unexpected error', error);
          this.isUpdateDashboardFlag = false;
          this.isSubmitDashboardFlag = true;
        }
      }
    )
    
}

onDashboardRoleSubmit(){
  this.MultipleDashboardRolePermissionComponent.submitPermissions();
  this.showMultipleDbPermission = false;
 
}

onDashboardRoleUpdate(){
  this.MultipleDashboardRolePermissionComponent.updatePermissions();
  this.showMultipleDbPermission = false;
 
}


}


