import { Component, HostListener, OnInit, ViewChild, inject} from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogComponent, AnimationSettingsModel, DialogModule } from '@syncfusion/ej2-angular-popups';

import { ChartService } from 'src/app/core/services/chart.service';
import { MenuBasedAccessService } from 'src/app/core/services/menu-based-access.service';
import { UserBasedPermissionComponent } from '../user-based-permission/user-based-permission.component';
import { passwordValidator } from 'src/app/core/services/custom-validators';
import { GridComponent, GridModule } from '@syncfusion/ej2-angular-grids';
import { AnimationModel, ChartModule } from '@syncfusion/ej2-angular-charts';
import { LoaderService } from 'src/app/core/services/loader.service';
import { passwordMatchValidator } from 'src/app/core/services/passwordMatch-validator';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { PopupService } from 'src/app/core/services/popup.service';
import { MultipleDashboardUserPermissionComponent } from '../multiple-dashboard-user-permission/multiple-dashboard-user-permission.component';
import { UserService } from 'src/app/core/AuthServices/user.service';
import { CustomPasswordValidator } from 'src/app/core/services/password_validator';
import { NgIf, NgStyle, NgClass, NgFor } from '@angular/common';
import { ButtonModule, SwitchModule } from '@syncfusion/ej2-angular-buttons';
import { KanbanModule } from '@syncfusion/ej2-angular-kanban';
import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';


@Component({
    selector: 'app-add-users',
    templateUrl: './add-users.component.html',
    styleUrls: ['./add-users.component.scss'],
    imports: [FormsModule, NgIf, ButtonModule, GridModule, ChartModule, KanbanModule, NgStyle, DialogModule, ReactiveFormsModule, DropDownListModule, NgClass, NgFor, SwitchModule, UserBasedPermissionComponent, MultipleDashboardUserPermissionComponent]
})

export class AddUsersComponent implements OnInit {

  registrationForm!: FormGroup;
  resetPasswordForm!: FormGroup;

  @ViewChild('defaultDialog')
  defaultDialog!: DialogComponent;
  @ViewChild('roleDialogBox')
  roleDialogBox!: DialogComponent;
  @ViewChild('userUploadPopup')
  userUploadPopup!: DialogComponent;


  sendUserObj: any;

  dialogCloseIcon: Boolean = true;
  dialogWidth: string = '850px';
  dialogdragging: Boolean = true;
  animationSettings: AnimationSettingsModel = { effect: 'SlideBottom' };
  isModal: Boolean = true;
  target: string = '.control-section';
  showCloseIcon: Boolean = false;
  visible: Boolean = false;
  submitFlag: boolean = true;
  updateFlag: boolean = false;
  updateRolePermissionBtn: boolean = false;
  submitRolePermissionBtn: boolean = true;
  public animation: AnimationModel = { enable: true, duration: 2000, delay: 0 };

  loaderFlag: boolean = false;
  FormTitle: string = "Add User";
  filterTerm: string = '';
  filterRoleTerm: string = '';

  isRegistedPasswordVisible : boolean = false;



  @ViewChild(UserBasedPermissionComponent) UserBasedPermissionComponent!: UserBasedPermissionComponent;
  @ViewChild(MultipleDashboardUserPermissionComponent) MultipleDashboardUserPermissionComponent!: MultipleDashboardUserPermissionComponent;


  activeUsersArray: any = [];

  dialogBtnClick = (): void => {
    this.initForm()
    this.defaultDialog.show();
    this.submitFlag = true;
    this.updateFlag = false;
    this.FormTitle = 'Add User';
    this.registrationForm.reset();

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

  rolesArray: string[] = []
  menuBasedAccess: any = {};
  permissionObj: any = {};
  menuBasedPermissionControlArray: any = []

  registeredUsersArray: any = []
  rolesObjArr: any = [];
  filteredUsersArray: any = [];
  role_id: any;
  userInfoData : any ;

  private readonly formBuilder = inject(FormBuilder);
  private readonly chartService = inject(ChartService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly menuBasedAccessService = inject(MenuBasedAccessService);
  private readonly loaderService = inject(LoaderService);
  private readonly popupService = inject(PopupService);
  private readonly userService = inject(UserService);

  userBasedAcessObj: any;
  userDashboardPermissionObj: any
  ngOnInit() {

    this.initForm();

    this.menuBasedAccessService.menuAccess$.subscribe((menuAccess) => {
      this.menuBasedAccess = menuAccess;
      this.menuBasedPermissionControlArray = this.menuBasedAccess?.permission_details;
      const formNameToFind = 'addUser';
      const permissionDetailsForHome = this.menuBasedPermissionControlArray?.find(
        (permission: any) => permission.form_name === formNameToFind
      );
      console.log('permissionDetailsForHome', permissionDetailsForHome)
      const permissionDetailsForUserBasedAccess = this.menuBasedPermissionControlArray?.find(
        (permission: any) => permission.form_name === "userPermission"
      );
      console.log('permissionDetailsForUserBasedAccess', permissionDetailsForUserBasedAccess)

      this.userBasedAcessObj = permissionDetailsForUserBasedAccess;

      console.log('this.userBasedAcessObj', this.userBasedAcessObj)

      if (permissionDetailsForHome) {
        this.permissionObj = permissionDetailsForHome
      } else {
        console.log('Permission details not found for "addUser"');
      }

      const userDashboardPermssions = this.menuBasedPermissionControlArray?.find(
        (permission: any) => permission.form_name === 'userBaseddashboardAccess'
      );

      //  console.log('userBaseddashboardAccess', userDashboardPermssions)


      if (userDashboardPermssions) {
        this.userDashboardPermissionObj = userDashboardPermssions
      }

    })

    let userData: any = sessionStorage.getItem('userInformation');


    if (userData) {
      userData = JSON.parse(userData);
      this.userInfoData = userData
      console.log('userInfoData in add user page', userData,  this.userInfoData);
      let userName = userData.username;

      if(userName == 'superadmin'){
        this.chartService.getAllUsersDetails().subscribe(

          (res: any) => {
            this.loaderService.hide()

            if (res.success) {

              this.registeredUsersArray = res['data'];
              this.filteredUsersArray = this.registeredUsersArray;

              this.filteredUsersArray = this.filteredUsersArray.sort((a: any, b: any) => b.user_id - a.user_id)
              sessionStorage.setItem('usersArray', JSON.stringify(this.registeredUsersArray));

            } else {
              // this.showPopup(res.success, '35px', res.message)
              this.popupService.showPopup({
                message: res.message,
                statusCode: res.status_code,
                status: res.success
              });

            }
          },

          (err: any) => {
            this.loaderService.hide()
            const errorMessage = err.error && err.error.message ? err.error.message : err.message;
            this.popupService.showPopup({
              message: errorMessage,
              statusCode: err.status,
              status: false
            });
          }
        )
      }else{
        this.chartService.getallActiveUserDetails().subscribe(

          (res: any) => {
            this.loaderService.hide()

            console.log('active users for other users', res)
            if (res.success) {
              this.registeredUsersArray = res['data'];
              this.filteredUsersArray = this.registeredUsersArray;
              this.filteredUsersArray = this.filteredUsersArray.filter((user: any) => user.role !== 'superadmin');

              this.filteredUsersArray = this.filteredUsersArray.sort((a: any, b: any) => b.user_id - a.user_id)

              sessionStorage.setItem('usersArray', JSON.stringify(this.registeredUsersArray));
            } else {
              //this.showPopup(res.success, '35px', res.message)

              this.popupService.showPopup({
                message: res.message,
                statusCode: res.status_code,
                status: res.success
              });


            }
          },


          (err: any) => {
            this.loaderService.hide()
            // this.showPopup(false, '35px', "Something Went wrong, Please reload the page");
            const errorMessage = err.error && err.error.message ? err.error.message : err.message;
            this.popupService.showPopup({
              message: errorMessage,
              statusCode: err.status,
              status: false
            });
          }
        )
      }
      // this.chartService.getUserDetailByUsername(userData.username).subscribe((res: any) => {
      //   let data = res['data'];

      //   console.log('res of username', data);

      //   if (data.role == 'superadmin') {
      //     this.chartService.getAllUsersDetails().subscribe(

      //       (res: any) => {
      //         console.log('all users', res)
      //         this.loaderService.hide()

      //         if (res.success) {

      //           this.registeredUsersArray = res['data'];
      //           this.filteredUsersArray = this.registeredUsersArray;

      //           this.filteredUsersArray = this.filteredUsersArray.sort((a: any, b: any) => b.user_id - a.user_id)
      //           sessionStorage.setItem('usersArray', JSON.stringify(this.registeredUsersArray));

      //         } else {
      //           // this.showPopup(res.success, '35px', res.message)
      //           this.popupService.showPopup({
      //             message: res.message,
      //             statusCode: res.status_code,
      //             status: res.success
      //           });

      //         }
      //       },

      //       (err: any) => {
      //         this.loaderService.hide()

      //         this.popupService.showPopup({
      //           message: err.message,
      //           statusCode: err.status,
      //           status: false
      //         });
      //       }
      //     )
      //   } else {
      //     this.chartService.getallActiveUserDetails().subscribe(

      //       (res: any) => {
      //         this.loaderService.hide()

      //         console.log('active users for other users', res)
      //         if (res.success) {
      //           this.registeredUsersArray = res['data'];
      //           this.filteredUsersArray = this.registeredUsersArray;
      //           this.filteredUsersArray = this.filteredUsersArray.filter((user: any) => user.role !== 'superadmin');

      //           this.filteredUsersArray = this.filteredUsersArray.sort((a: any, b: any) => b.user_id - a.user_id)

      //           sessionStorage.setItem('usersArray', JSON.stringify(this.registeredUsersArray));
      //         } else {
      //           //this.showPopup(res.success, '35px', res.message)

      //           this.popupService.showPopup({
      //             message: res.message,
      //             statusCode: res.status_code,
      //             status: res.success
      //           });


      //         }
      //       },


      //       (err: any) => {
      //         this.loaderService.hide()
      //         // this.showPopup(false, '35px', "Something Went wrong, Please reload the page");
      //         this.popupService.showPopup({
      //           message: err.message,
      //           statusCode: err.status,
      //           status: false
      //         });
      //       }
      //     )
      //   }
      // })
    }

    let userInfoData = this.userService.getUser();
    console.log('userInfoData',  userInfoData)
    this.userInfoData = userInfoData;


    this.chartService.getAllActiveRoleDetails().subscribe((res: any) => {
      let data = res['data'];
      console.log('this.userInfoData',  this.userInfoData);
      
      if(userInfoData.username == 'superadmin'){
       this.rolesObjArr = data;

       this.rolesArray = data.map((ele: any) => ele.role)
      }else{
        this.rolesObjArr  = data.filter((user: any) => user.role !== 'superadmin');
        console.log( 'this.rolesObjArr',  this.rolesObjArr   )
 
       this.rolesArray = data.map((ele: any) => ele.role)
      }

    })

    this.loaderService.show()

    // this.resetPasswordForm = this.formBuilder.group({
    //   confirm_password: ['', [Validators.required, Validators.minLength(8), CustomPasswordValidator]],
    //   new_password: ['', [Validators.required, Validators.minLength(8), CustomPasswordValidator]],
    // });

    

    // this.getRolesArrayDataFromLocalStorage()

    this.initPasswordForm()

    if (this.updateFlag) {

     this.originalUserName = this.registrationForm.get('username')?.value || '';

    }


  }


  private initPasswordForm(): void {
    this.resetPasswordForm = this.formBuilder.group(
      {
        new_password: ['', [
          Validators.required, 
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
        ]],
        confirm_password: ['', [
          Validators.required, 
          Validators.minLength(8)
        ]]
      },
      { validators: this.passwordMatchValidator }
    );
  }

  downloadUsers(){

         this.chartService.getAllUsersDetails().subscribe(

          (res: any) => {
            // this.loaderService.hide()

            if (res.success) {

              this.registeredUsersArray = res['data'];

                      // Map and transform user data
        const users = this.registeredUsersArray.map((user: any) => {
          return {
            id : user.user_id,
            username: user.username,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            rolename: user.role ,// Rename 'role' to 'rolename'
            is_active: user.is_active,
            password : ''
            // password is not available in response, so skipped
          };
        });



              const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(users);

                // Create a workbook
                const workbook: XLSX.WorkBook = {
                  Sheets: { 'Users': worksheet },
                  SheetNames: ['Users']
                };

                // Write workbook to buffer
                const excelBuffer: any = XLSX.write(workbook, {
                  bookType: 'xlsx',
                  type: 'array'
                });

                // Call your existing method
                this.saveAsExcelFile(excelBuffer, 'users');
            } else {
              // this.showPopup(res.success, '35px', res.message)
              this.popupService.showPopup({
                message: res.message,
                statusCode: res.status_code,
                status: res.success
              });

            }
          },

          (err: any) => {
            this.loaderService.hide()
            const errorMessage = err.error && err.error.message ? err.error.message : err.message;
            this.popupService.showPopup({
              message: errorMessage,
              status: false
            });
          }
        )
  }

  initForm() {
    this.registrationForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      role: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required, 
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      ]],
      // password: ['', [Validators.required, Validators.minLength(6)]],
      isActive: true,
      confirmPassword: ['', [
        Validators.required, 
        Validators.minLength(8)
      ]]
    },
      { validator: passwordMatchValidator('password', 'confirmPassword') });
  }


  onSearchChange(eve: any) {
    console.log('typed value', this.filterTerm);
    console.log('entered value', eve.target.value);

    if(this.userInfoData.username == 'superadmin'){
      this.registeredUsersArray = this.registeredUsersArray
    }else{
      this.registeredUsersArray = this.registeredUsersArray.filter((user: any) => user.role !== 'superadmin');

    }
    
    this.filteredUsersArray = this.registeredUsersArray.filter((user: any) =>
      user.username.toLowerCase().includes(this.filterTerm.toLowerCase())
    );

    console.log('this.filteredUsersArray after filtering', this.filteredUsersArray);

  }

  filteredRolesArray: any = [];


  onSearchRoleChange(eve: any) {

    // console.log('this.registeredUsersArray', this.registeredUsersArray);

    if(this.userInfoData.username == 'superadmin'){
      this.registeredUsersArray = this.registeredUsersArray
    }else{
      this.registeredUsersArray = this.registeredUsersArray.filter((user: any) => user.role !== 'superadmin');

    }
    this.filteredUsersArray = this.registeredUsersArray.filter((user: any) =>
      user.role && user.role.toLowerCase().includes(this.filterRoleTerm.toLowerCase())
    );

    // console.log('filterRoleTerm after filtering', this.filteredUsersArray);

  }


  rolefields: any = { text: 'role', value: 'role' }

  initialPage = { pageSizes: true, pageCount: 4 };
  email: string = '';
  tableHeight: string = '420'
  isEmailValid: boolean = false;
  onEmailCheck(eve: any) {
    console.log('Email ', eve.target.value);
    let value = eve.target.value;


    this.chartService.getUserDetailbyEmail(value).subscribe(
      (res: any) => {
        console.log('res of email', res);
        let data = res['data'];


        if (res.success) {
          // Role is valid
          this.isEmailValid = true;
          this.email = "Email is already exists"; // Clear the error message
        } else {
          this.isEmailValid = false;
          this.email = ''
        }
      },

      (err: any) => {
        this.isEmailValid = false;
        this.email = ""
      }

    )
  }


  private getRolesArrayDataFromLocalStorage() {
    let panelData = sessionStorage.getItem('usersArray');
    if (panelData !== null) {
      this.registeredUsersArray = JSON.parse(panelData);
      this.filteredUsersArray = this.registeredUsersArray;


    } else {
      this.registeredUsersArray = [];
    }
  }

  @ViewChild('grid') grid!: GridComponent

  onDataBound() {
    this.grid.autoFitColumns([])
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (window.innerWidth <= 768) {
      // Only trigger auto-fit columns for mobile devices
      this.grid.autoFitColumns([]);

    }
  }

   editRecord(data: any): void {

    console.log('Edit Record:', data);
    this.submitFlag = false;
    this.updateFlag = true;
    console.log(data.user_id, typeof (data.user_id))
    this.defaultDialog.show()
    this.FormTitle = 'Update User'

    this.chartService.getUserDetailsById(data.user_id).subscribe((res: any) => {
      let dataObj = res['data'];
      console.log(res)

      // let roleObj = this.rolesObjArr.find((ele: any) => ele.role === dataObj.role);
      this.editColumnObjIndex = data.user_id;
       this.originalUserName = dataObj.username; 
       
      let obj = {
        username: dataObj.username || '',
        firstName: dataObj.first_name || '',
        lastName: dataObj.last_name || '',
        role: dataObj.role || '',
        // role:dataObj.role + '-' + roleObj.id,   
        email: dataObj.email || '',
        password: dataObj.password || '',
        isActive: dataObj.is_active != null ? dataObj.is_active : true,
        confirmPassword: dataObj.confirmPassword || ''
      }
      console.log(obj)
      // this.registrationForm.patchValue(obj);

          setTimeout(() => {
      this.registrationForm.patchValue({
        username: obj.username || '',
        firstName: obj.firstName || '',
        lastName: obj.lastName || '',
        role: obj.role || '',
        email: obj.email || '',
        password: obj.password || '',
        isActive: obj.isActive != null ? obj.isActive : true,
        confirmPassword: obj.confirmPassword || ''
      });
    });
    })
  }

  onUserBasedFormSubmit() {
    this.UserBasedPermissionComponent.onFormSubmit();
    this.roleDialogBox.hide()
  }
  onRoleFormClick(data: any) {
    console.log(data);
    let obj = {
      username: data.username,
      role: data.role,
      user_id: data.user_id
    }
    this.sendUserObj = obj;
    // let roleObj = this.rolesObjArr.find((ele : any) => ele.role === obj.role);
    // let userObj = this.registeredUsersArray.find((ele : any) => ele.username === obj.username);
    this.roleDialogBox.show();

    this.chartService.getRoleDetailsByRolename(data.role).subscribe((res: any) => {
      let roleData = res['data'];
      let roleId = roleData.id;

      this.chartService.getUserPermissionByRoleIdUserId(roleId, data.user_id).subscribe((res: any) => {

        console.log(res);

        if (res.success) {
          this.updateRolePermissionBtn = true;
          this.submitRolePermissionBtn = false;
        } else {
          this.updateRolePermissionBtn = false;
          this.submitRolePermissionBtn = true;
        }


      })
    })

    // console.log(this.registeredUsersArray, this.rolesObjArr);


    // this.chartService.getUserBasePermissionByUserId(data.user_id).subscribe((res : any) =>{
    //   console.log(res);
    //   let data = res['data'];
    // })

    // this.chartService.geAlltUserBasedAccess().subscribe((res : any) =>{
    //  // console.log(res);
    //   let data = res['data'];
    //   let matchedUser = data.find((ele : any) => ele.role_id === roleObj.id && ele.user_id === obj.user_id);
    //   console.log(matchedUser)

    //   if(matchedUser){
    //     console.log('success res', res);
    //     this.updateRolePermissionBtn = true;
    //     this.submitRolePermissionBtn = false;
    //   }else{
    //     this.updateRolePermissionBtn = false;
    //         this.submitRolePermissionBtn = true;
    //   }
    // })

  }
  onUpdateUserPermission() {

    this.UserBasedPermissionComponent.onUpdateFormSubmit();
    this.roleDialogBox.hide()

  }

  onDeleteUserPermission() {
    this.UserBasedPermissionComponent.onDeleteUserBasedForm();
    this.roleDialogBox.hide()

  }


  


  public deleteRecord(data: any): void {
    console.log(data)
    const userConfirmed = window.confirm('Do you want to delete the user');
    if (userConfirmed) {
      // User clicked "OK"
      this.loaderService.show()
      this.chartService.deleteUserByUserId(data.user_id).subscribe(
        (res: any) => {
          this.loaderService.hide()
          // this.showPopup(res.success, '35px', res.message)
          this.popupService.showPopup({
            message: res.message,
            statusCode: res.status_code,
            status: res.success
          });


        },

        (err: any) => {
          this.loaderService.hide()
          // this.showPopup(false, '35px', "Something Went wrong, Please reload the page");
          const errorMessage = err.error && err.error.message ? err.error.message : err.message;
          this.popupService.showPopup({
            message: errorMessage,
            statusCode: err.status,
            status: false
          });
        }
      );

    } else {

      //  sessionStorage.setItem('usersArray', JSON.stringify(this.registeredUsersArray));
    }
  }



  getResponseMessage(eve: any) {
    this.displayPopup = true;
    // this.showPopup(eve.status, '35px', eve.message)
    this.popupService.showPopup({
      message: eve.message,
      statusCode: eve.statusCode,
      status: eve.status
    });

  }
  // onInputFocus(event: FocusEvent) {
  //   const input = event.target as HTMLInputElement;
  //   input.classList.add('focused');
  // }

  onInputFocus(event: any) {
    const inputEl = event?.element;
    if (inputEl && inputEl.classList) {
      inputEl.classList.add('focused-input'); // replace with your class
    }
  }
  

  onInputBlur(event: any) {
    const input = event?.target as HTMLInputElement;
    // input.classList.remove('focused');
    if (input && input.classList) {
      input.classList.remove('focused');

    }
  }
  // message! : string;
  // success: boolean = false;
  displayPopup: boolean = false;

  showMandatoryAlert() {
    alert('Please fill in all mandatory fields before submitting the form.'); // Replace with preferred alert method (e.g., custom modal)
  }

  onSubmit() {

    let formValue = this.registrationForm.value;

    const [role, role_id] = formValue.role.split('-');
    console.log(role, role_id, formValue)

    this.chartService.getRoleDetailsByRolename(formValue.role).subscribe(

      (res: any) => {
        console.log(res);
        let data = res['data'];
        let roleId = data.id;

        if (this.registrationForm.valid) {
          let obj = {
            "username": formValue.username || '',
            "email": formValue.email || '',
            "first_name": formValue.firstName || '',
            "last_name": formValue.lastName || '',
            "password": formValue.password || '',
            "role_id": roleId || '',
            "role": role || '',
            "is_active": true,
          }

          this.loaderService.show()
          this.chartService.registerUser(obj).subscribe(
            (res: any) => {
              console.log(' user res', res);
              this.defaultDialog.hide()
              this.loaderService.hide()
              this.popupService.showPopup({
                message: res.message,
                statusCode: res.status_code,
                status: res.success
              });

              if (res.success) {
                let data = res['data'];
                this.registeredUsersArray.push(obj);
                this.registeredUsersArray = [...this.registeredUsersArray];
                this.filteredUsersArray = this.registeredUsersArray;
                this.filteredUsersArray = this.filteredUsersArray.sort((a: any, b: any) => b.user_id - a.user_id)
                sessionStorage.setItem('usersArray', JSON.stringify(this.registeredUsersArray));

              }



            },


            (err: any) => {
              this.loaderService.hide()
              const errorMessage = err.error && err.error.message ? err.error.message : err.message;
              this.popupService.showPopup({
                message: errorMessage,
                statusCode: err.status,
                status: false
              });
            }
          );



        }
      }

    )


  }


  editColumnObjIndex: any;
  @ViewChild('roleDbPermissionDlgBox')
  roleDbPermissionDlgBox!: DialogComponent;

  @ViewChild('multipleDbPermission')
  multipleDbPermission!: DialogComponent;

  @ViewChild('resetPasswordPopup')
  resetPasswordPopup!: DialogComponent;
  

  dashboardPermissionsList: any[] = [];
  UserName: string = '';




  refreshPage() {
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }
  onUpdate() {
    const updatedObj = this.registrationForm.value;
    console.log(this.editColumnObjIndex);

    console.log('updatedObj',this.registrationForm.valid, updatedObj)

    this.chartService.getRoleDetailsByRolename(updatedObj.role).subscribe(

      (res: any) => {
        console.log(res);
        let data = res['data'];
        let roleId = data.id;


        let obj: any = {
          "username": updatedObj.username || '',
          "email": updatedObj.email || '',
          "first_name": updatedObj.firstName || '',
          "last_name": updatedObj.lastName || '',
          "role_id": roleId || '',
          "role": updatedObj.role || '',
          "is_active": updatedObj.isActive != null ? updatedObj.isActive : true,
          // "password" : null
        };
  
        // Set password based on role
        if (this.userInfoData.role === 'superadmin') {
          obj.password = updatedObj.password || '';
        } else {
          obj.password = updatedObj.password ? updatedObj.password : null;
        }

        console.log('update user obj', obj)
        this.loaderService.show()

        this.chartService.updateUserById(this.editColumnObjIndex, obj).subscribe(

          (res: any) => {
            console.log(res);
            this.loaderService.hide()

            //  this.showPopup(res.success, '35px', 'User updated successfully')

            this.defaultDialog.hide();
            this.submitFlag = true;
            this.updateFlag = false;
            this.popupService.showPopup({
              message: res.message,
              statusCode: res.status_code,
              status: res.success
            });


          },

          (err: any) => {
            this.loaderService.hide()
            // this.showPopup(false, '35px', "Something Went wrong, Please reload the page");
            const errorMessage = err.error && err.error.message ? err.error.message : err.message;
            this.popupService.showPopup({
              message: errorMessage,
              statusCode: err.status,
              status: false
            });
          }

        )
      })

  }
  userNameValue: string = '';
  roleErrorMessage: string = '';
  roleValid: boolean = false;
  originalUserName: string = '';

  // onCheckUserName(event: any) {
  //   console.log(event.target.value)
  //   console.log(this.updateFlag)

  //   let value = event.target.value;

  // if (this.updateFlag && value === this.originalUserName) {
  //   return;
  // }
  //   if (value) {
  //     this.chartService.getUserDetailByUsername(value).subscribe(

  //       (res: any) => {
  //         console.log(res);
  //         if (res.success) {
  //           // Role is valid
  //           this.roleValid = true;
  //           this.roleErrorMessage = "User already exists"; // Clear the error message
  //         } else {
  //           this.roleValid = false;
  //           this.roleErrorMessage = ''
  //         }
  //       },
  //       (err: any) => {
  //         console.log(err)
  //       }

  //     )
  //   }


  // }

    onCheckUserName(event: any) {
    console.log(event.target.value);
    console.log(this.updateFlag);

    const value = event.target.value?.trim();

    if (document.activeElement !== event.target) {
      console.log("Input not focused â€” skipping validation");
      return;
    }

    if (this.updateFlag && value === this.originalUserName) {
      console.log("Username not changed â€” skipping validation");
      return;
    }


    if (!value) {
      this.roleValid = false;
      this.roleErrorMessage = '';
      return;
    }

    this.chartService.getUserDetailByUsername(value).subscribe(
      (res: any) => {
        console.log("API response:", res);

        if (res.success) {
          this.roleValid = true;
          this.roleErrorMessage = "User already exists";
        } else {
          this.roleValid = false;
          this.roleErrorMessage = '';
        }
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  

  //upload users option code
  // expectedHeaders = ['username', 'email', 'first_name', 'last_name', 'rolename', 'password'];
  expectedHeaders = ['username', 'email', 'first_name', 'last_name', 'rolename', 'password', 'is_active'];

  headerValidationMessage: string = '';
  isValidFile: boolean = false;
  openUserPopup() {
    this.userUploadPopup.show()
  }
  downloadTemplate(): void {
    this.exportAsExcelFile();
  }

  // Handle file input change


  fileName: string = '';
  fileType: string = '';
  base64StringValue: any = '';

  onFileChange(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.fileName = file.name;
      //  this.fileType = file.type;
      console.log('this.fileType ', this.fileType)
      const validMimeTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
        'application/vnd.ms-excel', // .xls
        'text/csv' // .csv
      ];

      const validExtensions = ['xls', 'xlsx', 'csv'];  // Supported extensions
      let fileExtension: any = this.fileName.split('.').pop()?.toLowerCase(); // Extract extension and convert to lowercase
      this.fileType = fileExtension;

      console.log('fileExtension', fileExtension)
      if (!validMimeTypes.includes(this.fileType) && !validExtensions.includes(fileExtension)) {
        alert('Invalid file type. Only xls, xlsx, and csv are supported.');
        return;
      }


      this.importFromExcel(file).then((data) => {
        const headers = data[0]; // Get the first row as headers
        console.log('headers', headers);
        console.log('requiredHeaders', file)
        if (this.validateHeaders(headers)) {
          // Remove the header row and process the remaining data
          data.shift();
          // this.uploadedUsers = data;
          // this.headerValidationMessage = 'Headers match! File is valid for upload.';
          this.isValidFile = true;
          console.log(this.headerValidationMessage)

          this.convertFileToBase64(file)

        } else {
          this.headerValidationMessage = 'Headers do not match! Please upload a valid file.';
          this.isValidFile = false;
          alert(this.headerValidationMessage)


        }
      }).catch(error => {
        console.error('Error reading excel file', error);
      });
    }
  }

  handleUpload(event: any) {
    console.log(event)
    const file = event.target.files[0];


    if (file) {
      this.fileName = file.name
      const reader = new FileReader();

      reader.onload = () => {
        const base64String = reader.result?.toString().split(',')[1];
        this.base64StringValue = base64String;

        console.log('fileName', this.fileName)
        console.log('this.base64StringValue', this.base64StringValue)
      };

      reader.readAsDataURL(file);
    }

  }



  // Convert the file to base64
  convertFileToBase64(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result?.toString().split(',')[1];
      this.base64StringValue = base64String;

      // console.log('File Name:', this.fileName);
      // console.log('Base64 String Value:', this.base64StringValue);

      // Here, you can pass this.base64StringValue and this.fileName to your API
    };
    reader.readAsDataURL(file);  // Read the file as base64
  }

  onUsersUpdateUpload(){
  let obj = {
      "file_base64": this.base64StringValue,
      "file_type": this.fileType
    }
    this.loaderService.show()

    console.log('obj', obj)
    this.userUploadPopup.hide()
    this.chartService.updateBulkUsers(obj).subscribe(
      (res: any) => {
        console.log('res', res)
        this.loaderService.hide()
        //  this.showPopup(res.success, '35px', res.message)
        this.popupService.showPopup({
          message: res.message,
          statusCode: res.status_code,
          status: res.success
        });

      },


      (err: any) => {
        this.loaderService.hide()
        // this.showPopup(false, '35px', err.message)
        // this.showPopup(false, '35px', "Something Went wrong, Please reload the page");
        const errorMessage = err.error && err.error.message ? err.error.message : err.message;
        this.popupService.showPopup({
          message: errorMessage,
          statusCode: err.status,
          status: false
        });
      }
    )
  }

  onUsersUpload() {
    let obj = {
      "file_base64": this.base64StringValue,
      "file_type": this.fileType
    }

    this.userUploadPopup.hide()
    this.chartService.uploadBulkUsers(obj).subscribe(
      (res: any) => {
        //  this.showPopup(res.success, '35px', res.message)
        this.popupService.showPopup({
          message: res.message,
          statusCode: res.status_code,
          status: res.success
        });

      },


      (err: any) => {
        this.loaderService.hide()
        // this.showPopup(false, '35px', err.message)
        // this.showPopup(false, '35px', "Something Went wrong, Please reload the page");
        const errorMessage = err.error && err.error.message ? err.error.message : err.message;
        this.popupService.showPopup({
          message: errorMessage,
          statusCode: err.status,
          status: false
        });
      }
    )
  }

  validateHeadersOld(headers: any[]): boolean {
    if (headers.length !== this.expectedHeaders.length) {
      return false;
    }
    for (let i = 0; i < headers.length; i++) {
      if (headers[i].trim().toLowerCase() !== this.expectedHeaders[i].trim().toLowerCase()) {
        return false;
      }
    }
    return true;
  }

  validateHeaders(headers: any[]): boolean {
  const requiredHeaders = ['username', 'email', 'first_name', 'last_name', 'rolename', 'password'];

  // 'username', 'email', 'first_name', 'last_name', 'rolename', 'password'
  const optionalHeaders = ['is_active', 'user_id'];

  // const normalizedHeaders = headers.map(h => h.trim().toLowerCase());
  const normalizedHeaders = requiredHeaders.map(h => h.trim().toLowerCase());

  // Check all required headers are present
  for (let required of requiredHeaders) {
    console.log('required', required)
    if (!normalizedHeaders.includes(required)) {
      return false;
    }
  }

  // No alert needed for missing optional headers
  return true;
}



  exportAsExcelFile(): void {
    const headers = [
      ['username', 'email', 'first_name', 'last_name', 'rolename', 'password']
    ];

    const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(headers);

    // Set cell format to text for all the header cells and ensure it's treated as text
    const range = XLSX.utils.decode_range(worksheet['!ref']!); // Get range of the sheet
    for (let col = range.s.c; col <= range.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col }); // Get cell address for the header row
      if (!worksheet[cellAddress]) continue; // Skip if no cell found

      // Set the cell type to string and force text formatting
      worksheet[cellAddress].t = 's';  // 's' stands for string (text)
      worksheet[cellAddress].z = '@';  // '@' is the format code for text in Excel
    }

    const workbook: XLSX.WorkBook = { Sheets: { 'User Template': worksheet }, SheetNames: ['User Template'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    this.saveAsExcelFile(excelBuffer, 'user_template');
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: 'application/octet-stream' });
    saveAs(data, `${fileName}.xlsx`);
  }

  exportAsExcelFilenew(): void {
    const headers = [
      ['username', 'email', 'first_name', 'last_name', 'rolename', 'password']
    ];

    const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(headers);

    // Set cell format to text for all header cells
    const range = XLSX.utils.decode_range(worksheet['!ref']!); // Get range of the sheet
    for (let col = range.s.c; col <= range.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col }); // Get cell address for the header row
      const cell = worksheet[cellAddress];
      if (!cell) continue; // Skip if no cell found

      // Set cell type to string and format to Text
      cell.t = 's';  // 's' for string (text)
      cell.z = '@';  // '@' for text formatting in Excel
    }

    const workbook: XLSX.WorkBook = { Sheets: { 'User Template': worksheet }, SheetNames: ['User Template'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    this.saveAsExcelFile(excelBuffer, 'user_template');
  }

  private saveAsExcelFilenew(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: 'application/octet-stream' });
    saveAs(data, `${fileName}.xlsx`);
  }

  importFromExcelold(file: File): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const reader: FileReader = new FileReader();
      reader.onload = (e: any) => {
        const bstr: string = e.target.result;
        const workbook: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
        const sheetName: string = workbook.SheetNames[0];
        const worksheet: XLSX.WorkSheet = workbook.Sheets[sheetName];
        const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        resolve(jsonData);
      };
      reader.onerror = (error) => reject(error);
      reader.readAsBinaryString(file);
    });
  }

  importFromExcel(file: File): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const reader: FileReader = new FileReader();
      reader.onload = (e: any) => {
        const bstr: string = e.target.result;
        const workbook: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
        const sheetName: string = workbook.SheetNames[0];
        const worksheet: XLSX.WorkSheet = workbook.Sheets[sheetName];

        // Convert the worksheet to JSON and enforce text format
        const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, {
          header: 1 // Read rows as arrays for raw data
        });

        // Force all cell values to be treated as text
        const textFormattedData = jsonData.map(row =>
          row.map((cell: any) => (cell !== undefined && cell !== null) ? String(cell).trim() : '')
        );

        resolve(textFormattedData);
      };
      reader.onerror = (error) => reject(error);
      reader.readAsBinaryString(file);
    });
  }

  openDashboardPopup(data: any) {
    console.log('data', data);
    this.roleDbPermissionDlgBox.show();
    let roleId: any;
    this.UserName = 'Dashboard Permissions for User :- ' + data.username
    this.chartService.getRoleDetailsByRolename(data.role).subscribe((res: any) => {
      roleId = res['data'].id;
      console.log('roleId', res['data']);
      this.chartService.getAllUserDashboardPermissionByRoleidUserId(roleId, data.user_id).subscribe((res: any) => {
        let permission_details = res['data']?.permission_details;
        console.log('permission_details', res['data']);
        this.dashboardPermissionsList = permission_details

      })

    })
    console.log('roleId', roleId);

  }

  sendUserDashboardObj: any;
  isSubmitUserDashboardFlag: boolean = true;
  isUpdateUserDashboardFlag: boolean = false;
  openDashboardPermissionPopup(data: any) {
    console.log('data', data)
    this.multipleDbPermission.show();
    let roleId: any;
    this.UserName = 'Dashboard Permissions for User :- ' + data.username;

    this.chartService.getRoleDetailsByRolename(data.role).subscribe((res: any) => {
      console.log('res in role', res)
      roleId = res['data'].id;
      console.log('roleId', res['data']);
      let obj = {
        username: data.username,
        role_id: roleId,
        user_id: data.user_id
      }
      this.sendUserDashboardObj = obj;

      this.chartService.getAllUserDashboardPermissionByRoleidUserId(roleId, data.user_id).subscribe((res: any) => {
        if (res.success == true) {
          // let data = res['data'];
          this.isUpdateUserDashboardFlag = true;
          this.isSubmitUserDashboardFlag = false;
        } else {
          this.isUpdateUserDashboardFlag = false;
          this.isSubmitUserDashboardFlag = true;
        }

      })

    })
  }

  onDashboardRoleUserSubmit() {
    this.MultipleDashboardUserPermissionComponent.submitPermissions();
    this.multipleDbPermission.hide();

  }

  onDashboardRoleUserUpdate() {
    this.MultipleDashboardUserPermissionComponent.updatePermissions();
    this.multipleDbPermission.hide();

  }

  // code for reset password

  selectedUserInfo! : any;
  resetPasswordHeader : string = 'Reset Password for :- '
  openResetPasswordDialog(data : any){
    this.resetPasswordPopup.show();
    this.resetPasswordHeader = 'Reset Password for :- ' + data.username;
    console.log('data in users', data)
    this.selectedUserInfo = data;
    this.resetPasswordForm.reset()
  }

  isPasswordVisible = false; // Initially, password is hidden
  isRegistedConfirmPasswordVisible = false;

  isResetPasswordVisible : boolean = false;
  isResetConfirmPasswordVisible : boolean = false;


  toggleResetPasswordVisibility(input: HTMLInputElement) {
    this.isResetPasswordVisible = !this.isResetPasswordVisible;
    // Ensure text security matches the visibility state
    (input.style as any).webkitTextSecurity = this.isResetPasswordVisible ? 'none' : 'disc';
  }

  toggleResetConfirmPasswordVisibility(input: HTMLInputElement) {
    this.isResetConfirmPasswordVisible = !this.isResetConfirmPasswordVisible;
    // Ensure text security matches the visibility state
    (input.style as any).webkitTextSecurity = this.isResetConfirmPasswordVisible ? 'none' : 'disc';
  }


  toggleRegisterPasswordVisibility(input : HTMLInputElement){
    console.log('input password', input)
    this.isRegistedPasswordVisible = !this.isRegistedPasswordVisible;

    (input.style as any).webkitTextSecurity = this.isRegistedPasswordVisible ? 'none' : 'disc';

  }

  toggleRegisterConfirmPasswordVisibility(input : HTMLInputElement){
    this.isRegistedConfirmPasswordVisible = !this.isRegistedConfirmPasswordVisible;
    (input.style as any).webkitTextSecurity = this.isRegistedConfirmPasswordVisible ? 'none' : 'disc';
 
  }


  onPasswordResetSubmit() {
    if (this.resetPasswordForm.valid) {
      const formValue = this.resetPasswordForm.value;
      this.loaderService.show();

      console.log('formValue', formValue)

      this.chartService.ResetPassword(this.selectedUserInfo.user_id, {
        confirm_password: formValue.confirm_password,
        new_password: formValue.new_password
      }).subscribe({
        next: (res: any) => {
          this.loaderService.hide();
          this.resetPasswordPopup.hide();

          this.popupService.showPopup({
            message: res.message,
            statusCode: res.status_code,
            status: res.success
          });
          if (res.success) {
            this.visible = false;
            this.resetPasswordForm.reset();
          }
        },
        error: (err: any) => {
          this.loaderService.hide();
          this.resetPasswordPopup.hide();
          const errorMessage = err.error && err.error.message ? err.error.message : err.message;
          this.popupService.showPopup({
            message: errorMessage,
            statusCode: err.status,
            status: false
          });
        }
      });

    this.resetPasswordForm.reset()

    }
  }

  passwordRequirements = {
    minLength: 'Minimum 8 characters required',
    uppercase: 'At least one uppercase letter required',
    lowercase: 'At least one lowercase letter required',
    number: 'At least one number required',
    special: 'At least one special character required'
  };
  showPasswordRequirements = false;

  shouldShowPasswordMismatch(): boolean {
    const newPassword = this.resetPasswordForm.get('new_password')?.value;
    const confirmPassword = this.resetPasswordForm.get('confirm_password')?.value;
    // console.log('newPassword', newPassword,'confirmPassword', confirmPassword )
    return newPassword && confirmPassword && newPassword !== confirmPassword;
  }

  togglePasswordRequirements(event: Event) {
    event.stopPropagation(); // Prevent the document click event from firing
    this.showPasswordRequirements = !this.showPasswordRequirements;
  }

  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('new_password')?.value;
    const confirmPassword = form.get('confirm_password')?.value;
    return newPassword === confirmPassword ? null : { passwordMismatch: true };
  }

  getPasswordErrors(field: string): string[] {
    const control = this.resetPasswordForm.get(field);
    const errors: string[] = [];
    
    if (control?.errors && (control.dirty || control.touched)) {
      if (control.errors['required']) {
        errors.push('This field is required');
      }
      if (control.errors['minlength']) {
        errors.push(this.passwordRequirements.minLength);
      }
      if (control.errors['pattern']) {
        const value = control.value || '';
        if (!/[A-Z]/.test(value)) {
          errors.push(this.passwordRequirements.uppercase);
        }
        if (!/[a-z]/.test(value)) {
          errors.push(this.passwordRequirements.lowercase);
        }
        if (!/\d/.test(value)) {
          errors.push(this.passwordRequirements.number);
        }
        if (!/[@$!%*?&]/.test(value)) {
          errors.push(this.passwordRequirements.special);
        }
      }
    }
    
    return errors;
  }


  getRegisteredPasswordErrors(field: string): string[] {
    const control = this.registrationForm.get(field);
    const errors: string[] = [];
    
    if (control?.errors && (control.dirty || control.touched)) {
      if (control.errors['required']) {
        errors.push('This field is required');
      }
      if (control.errors['minlength']) {
        errors.push(this.passwordRequirements.minLength);
      }
      if (control.errors['pattern']) {
        const value = control.value || '';
        if (!/[A-Z]/.test(value)) {
          errors.push(this.passwordRequirements.uppercase);
        }
        if (!/[a-z]/.test(value)) {
          errors.push(this.passwordRequirements.lowercase);
        }
        if (!/\d/.test(value)) {
          errors.push(this.passwordRequirements.number);
        }
        if (!/[@$!%*?&]/.test(value)) {
          errors.push(this.passwordRequirements.special);
        }
      }
    }
    
    return errors;
  }


  // onInputFocus(event: FocusEvent) {
  //   const input = event.target as HTMLInputElement;
  //   input.classList.add('focused');
  // }

  // onInputBlur(event: FocusEvent) {
  //   const input = event.target as HTMLInputElement;
  //   input.classList.remove('focused');
  // }



}
