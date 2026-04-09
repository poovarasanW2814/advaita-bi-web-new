import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, inject} from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink } from '@angular/router';
import { ButtonComponent, ButtonModule } from '@syncfusion/ej2-angular-buttons';
import { AnimationModel } from '@syncfusion/ej2-angular-charts';
import { MenuItemModel } from '@syncfusion/ej2-angular-navigations';
import { DialogComponent, AnimationSettingsModel, DialogModule } from '@syncfusion/ej2-angular-popups';
import { ChartService } from 'src/app/core/services/chart.service';
import { DashboardBasedAccessService } from 'src/app/core/services/dashboard-based-access.service';
import { MenuBasedAccessService } from 'src/app/core/services/menu-based-access.service';
import { RoleDashboardAccessComponent } from '../role-dashboard-access/role-dashboard-access.component';
import { UserDashboardAccessComponent } from '../user-dashboard-access/user-dashboard-access.component';
import { PopupService } from 'src/app/core/services/popup.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { v4 as uuidv4 } from 'uuid';
import { HttpErrorResponse } from '@angular/common/http';
import { PopupComponent } from '../../panel-properties/popup/popup.component';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/core/auth-services/user.service';
import { NgIf, NgFor, NgStyle } from '@angular/common';
import { FilterPipe } from '../../services/filter.pipe';


@Component({
    selector: 'app-dashbord-homepage',
    templateUrl: './dashbord-homepage.component.html',
    styleUrls: ['./dashbord-homepage.component.scss'],
    imports: [FormsModule, NgIf, NgFor, RouterLink, NgStyle, ButtonModule, DialogModule, RoleDashboardAccessComponent, UserDashboardAccessComponent, ReactiveFormsModule, FilterPipe]
})


export class DashbordHomepageComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('roleDialogBox')
  roleDialogBox!: DialogComponent;


  @ViewChild('defaultDialog')
  defaultDialog!: DialogComponent;

  @ViewChild('userDialogBox')
  userDialogBox!: DialogComponent;

  @ViewChild('dashboardPopup')
  dashboardPopup!: DialogComponent;


  @ViewChild('responseMessageDialog')
  responseMessageDialog!: DialogComponent;

  @ViewChild('dialogBtn')
  dialogBtn!: ButtonComponent;

  @ViewChild('userBasedDialog') userBasedDialog!: UserDashboardAccessComponent;
  @ViewChild('roleBasedDialog') roleBasedDialog!: RoleDashboardAccessComponent;
  @ViewChild(PopupComponent) PopupComponent!: PopupComponent;

  @ViewChild('cardView') cardView: any;
  @ViewChild('listView') listView: any;

  dashboardDetailArray: any = [];
  dashboardArray: any = [];

  loaderFlag: boolean = true
  isIndeterminate?: boolean = true;
  animation: AnimationModel = { enable: true, duration: 2000, delay: 0 };
  value: number = 40;
  userSubmitFlag: boolean = true;
  userUpdateFlag: boolean = false;
  message!: string;
  success: boolean = false;
  displayPopup: boolean = false;
  menuBasedAccess: any = {};
  permissionObj: any = {};
  menuBasedPermissionControlArray: any = [];
  dashboardBasedAccess: any = {};
  dashboardPermissionObj: any = {};
  dashboardBasedPermssionArray: any = [];
  submitFlag: boolean = true;
  updateFlag: boolean = false;

  listviewIcon: boolean = true;
  cardViewIcon: boolean = false;
  listViewVisible: boolean = false;
  cardViewVisible: boolean = true;
  imageFlag: boolean = true;
  isListview: boolean = true
  isCardView: boolean = false;
  selectedView = 'cardView';
  sendDashboardId: any = {};
  userBasedPermissionFlag: boolean = false;
  roleBasedPermissionFLag: boolean = false;
  roleDashboardObj: any = {};
  showChildComponent: boolean = false;
  showUserPopup: boolean = false;
  dialogCloseIcon: Boolean = true;
  dialogWidth: string = '300px';
  dialogdragging: Boolean = true;
  isModal: Boolean = true;
  target: string = '.control-section';
  showCloseIcon: Boolean = false;
  visible: Boolean = false;
  resvisible: Boolean = false;
  messageBackgroundColor: string = '';
  responseMessage: string = '';
  userInformationData: any = {}

  dashboardCreationForm!: FormGroup;
  groupedDashboardArray: any = [];



  dialogBtnClick = (): void => {
    this.defaultDialog.show();
    this.dialogOpen();
  }

  animationSettings: AnimationSettingsModel = { effect: 'Zoom' };

  menuItems: MenuItemModel[] = [
    {
      text: 'Settings',
      iconCss: 'fa-solid fa-ellipsis-vertical',
      items: [
        { text: 'View', iconCss: 'bi bi-eye icon' },
        { text: 'Edit', iconCss: 'bi bi-pencil-square icon' },
        { text: 'Delete', iconCss: 'bi bi-trash icon' },
        { text: 'Role Dashboard', iconCss: 'bi bi-person-lock icon' },
        { text: 'User Dashboard', iconCss: 'bi bi-person-lock icon' },

      ]
    },
  ];



  private imageUrls = [
    // './../../../../assets/images/db1.jpg',
    './../../../../assets/images/db2.jpg',
    './../../../../assets/images/db3.jpg',
    './../../../../assets/images/db4.jpg',
    './../../../../assets/images/db5.jpg',
    './../../../../assets/images/db6.jpg',
    './../../../../assets/images/db7.jpg',
    './../../../../assets/images/db8.jpg',
    './../../../../assets/images/db9.jpg',
    // './../../../../assets/images/db10.jpg',
    // './../../../../assets/images/db11.jpg',
    // './../../../../assets/images/db12.jpg',

  ];



  private routerSubscription!: Subscription;

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
  ngOnDestroy(): void {


  }

  userPermissionViewObj: any;
  rolePermissionViewObj: any;

  roleDashboardPermissionObj: any;
  userDashboardPermissionObj: any;
  orgPropertiesData: any;

  ngOnInit(): void {


    let orgProp: any = sessionStorage.getItem('orgPropertiesObj');

    if (orgProp) {
      orgProp = JSON.parse(orgProp);
      this.orgPropertiesData = orgProp
      console.log('orgProp in homepage', orgProp)

    }

    //this.popupService.closePopup();
    this.dashboardCreationForm = this.formBuilder.group({
      dashboard_name: ['', Validators.required],
      description: [''],
      dashboard_image: [''],
      specific_cache_exp: [''],
      version: [''],
    })


    this.menuBasedAccessService.menuAccess$.subscribe((menuAccess) => {
      this.menuBasedAccess = menuAccess;
      this.menuBasedPermissionControlArray = this.menuBasedAccess?.permission_details;
      // console.log('this.menuBasedPermissionControlArray', this.menuBasedPermissionControlArray)

      const formNameToFind = 'home';
      const permissionDetailsForHome = this.menuBasedPermissionControlArray?.find(
        (permission: any) => permission.form_name === formNameToFind
      );

      if (permissionDetailsForHome) {
        this.permissionObj = permissionDetailsForHome
      }

      const permissionDetailsForUserPermission = this.menuBasedPermissionControlArray?.find(
        (permission: any) => permission.form_name === 'userPermission'
      );

      if (permissionDetailsForUserPermission) {
        this.userPermissionViewObj = permissionDetailsForUserPermission
      }

      const permissionDetailsForrolePermission = this.menuBasedPermissionControlArray?.find(
        (permission: any) => permission.form_name === 'rolePermission'
      );

      if (permissionDetailsForrolePermission) {
        this.rolePermissionViewObj = permissionDetailsForrolePermission
      }


      const roleDashboardPermssions = this.menuBasedPermissionControlArray?.find(
        (permission: any) => permission.form_name === 'roleBaseddashboardAccess'
      );

      //  console.log('roleDashboardPermssions', roleDashboardPermssions)

      const userDashboardPermssions = this.menuBasedPermissionControlArray?.find(
        (permission: any) => permission.form_name === 'userBaseddashboardAccess'
      );

      //  console.log('userBaseddashboardAccess', userDashboardPermssions)

      if (roleDashboardPermssions) {
        this.roleDashboardPermissionObj = roleDashboardPermssions
      }

      if (userDashboardPermssions) {
        this.userDashboardPermissionObj = userDashboardPermssions
      }


    });


    let dashboardBasedLocalStorageData = this.dashboardBasedAccessService.updatedashboardAccessFromLocalStorage();

    // if (dashboardBasedLocalStorageData) {
    //   this.dashboardBasedAccess = dashboardBasedLocalStorageData;
    //   console.log('this.dashboardBasedAccess', this.dashboardBasedAccess)

    //   this.dashboardBasedPermssionArray = this.dashboardBasedAccess?.permission_details;
    //   //console.log(this.dashboardBasedPermssionArray)

    //   const role_id = this.dashboardBasedAccess?.role_id;
    //   const user_id = this.dashboardBasedAccess?.user_id;

    //   if (role_id && user_id) {
    //     // If both role_id and user_id exist, call the user permission method
    //     this.getAllUserDashboardsPermissionsArray(role_id, user_id);
    //   } else if (role_id) {
    //     // If only role_id exists, call the role permission method
    //     this.getAllRoledashboardPermissionDetailsArray(role_id);
    //   }
    // }


    // if(userData){
    //   userData = JSON.parse(userData);

    //   const role_id = userData?.role_id;
    //   const user_id = userData?.user_id;

    //   if (role_id && user_id) {
    //     // If both role_id and user_id exist, call the user permission method
    //     this.getAllUserDashboardsPermissionsArray(role_id, user_id);
    //   } else if (role_id) {
    //     // If only role_id exists, call the role permission method
    //     this.getAllRoledashboardPermissionDetailsArray(role_id);
    //   }
    // }
    let userInfoData = this.userService.getUser();
    this.userInformationData = userInfoData;

    let userData: any = sessionStorage.getItem('userInformation');

    if (userData) {
      userData = JSON.parse(userData);
      console.log('userData in homepa...ge', userData)

      const role_id = userData?.role_id;
      const user_id = userData?.user_id;
      this.getAllUserDashboardsPermissionsArray(role_id, user_id, this.userInformationData.username);

    }

    console.log('userInfoData in homepage', userData)
    console.log('this.userInformationData in homepage', this.userInformationData)

    if (userInfoData) {

      this.chartService.getDashboardSetupByUserId(userInfoData.user_id).subscribe((res: any) => {

        let data = res['data'];

        if (data != null) {
          let view = data.display_type;
          let imgFlag = data.show_image;
          this.imageFlag = imgFlag;
          // console.log('img flag in if condition', this.imageFlag)
          this.toggleView(view);
        } else {
          this.chartService.getDashboardSetupByUserId(1).subscribe((res: any) => {
            // console.log('res for superadmin', res);

            let data = res['data'];
            let view = data.display_type;
            let imgFlag = data.show_image;
            this.imageFlag = imgFlag;
            // console.log('img flag in else condition', this.imageFlag)

            // console.log(this.imageFlag)
            this.toggleView(view);
          })
        }

      })
    }

    // this.getAllDashboardDetails()
  }


  currentDashboardObj: any = {}
  copyDashboard(obj: any) {
    console.log('copied obj', obj)
    this.dashboardPopup.show()
    // this.dashboardCreationForm.patchValue(obj);

    this.dashboardCreationForm.patchValue({
      dashboard_name: obj.dashboard_name,
      description: obj.description
    });

    this.currentDashboardObj = obj;
  }

  createDashboard() {
    let formValue = this.dashboardCreationForm.value;
    let uniqueID = uuidv4();
    // console.log('formValue', formValue);
    console.log('this.currentDashboardObj', this.currentDashboardObj);

    console.log('this.currentDashboardObj.specific_cache_exp', this.currentDashboardObj.specific_cache_exp)

    let dashboardApiObj = {
      "dashboard_id": "dashboard_" + uniqueID,
      "dashboard_name": formValue.dashboard_name,
      "dashboard_setup": {
        "dashboardObj": {
          "allowFloating": false,
          "allowDragging": true,
          "showGridLines": true,
          "cellAspectRatio": "100/80",
          "cellSpacing": [10, 10],
          "allowResizing": true,
          "connection_id": this.currentDashboardObj.dashboard_setup.dashboardObj.connection_id,
          "roleMapping": this.currentDashboardObj.dashboard_setup.dashboardObj.roleMapping,
          "panels": this.currentDashboardObj.dashboard_setup.dashboardObj.panels,
          "initialFilterObj": this.currentDashboardObj.dashboard_setup.dashboardObj.initialFilterObj
        }
      },
      "group_name": this.currentDashboardObj.group_name ?this.currentDashboardObj.group_name : [],
      "specific_cache_exp": this.currentDashboardObj.specific_cache_exp,
      "version": this.currentDashboardObj.version ? this.currentDashboardObj.version : null,
      "image_name": this.currentDashboardObj.image_name,
      'dashboard_image': this.currentDashboardObj.dashboard_image,
      "description": formValue.description ? formValue.description : "",
      "is_active": this.currentDashboardObj.is_active ? this.currentDashboardObj.is_active : true
    }


    console.log('Updated Dashboard:', dashboardApiObj);
    this.dashboardPopup.hide()
    this.chartService.postDashboardCreationObj(dashboardApiObj).subscribe(
      (res: any) => {
        console.log('dashboard api obj', res);
        // this.showPopup(res.success, '35px', res.message);
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
    )
  }

  getAllDashboardDetailsOld() {

    this.loaderService.show();

    const backgroundColors = ["linear-gradient(135deg, #252c42 10%, #3a39c4 100%)",
      "linear-gradient(135deg, #F12711 10%, #F5AF19 100%)",
      " linear-gradient(135deg, #cc208e 10%, #6713d2 100%)",
      " linear-gradient(135deg, #ff0844 10%, #ffb199 100%)",
      "linear-gradient(135deg, #2AFADF 10%, #4C83FF 100%)"
    ];
    this.chartService.getAllDashboardDetails().subscribe(
      (res: any) => {

        if (res.success) {
          console.log('Dashboard Details', res);

          this.loaderService.hide();
          this.dashboardDetailArray = res['data'];

          this.dashboardDetailArray = res['data'].map((item: any, index: number) => {
            return {
              ...item,
              imageUrl: this.imageUrls[index % this.imageUrls.length],
              backgroundColor: backgroundColors[index % backgroundColors.length],
              imageFlag: this.imageFlag // assuming imageFlag is part of the item
            };
          });

          console.log(this.dashboardDetailArray)
        } else {

          this.loaderService.hide();
          this.popupService.showPopup({
            message: res.message,
            statusCode: res.status_code,
            status: res.success
          });
        }

      }
      ,
      (err: HttpErrorResponse) => {
        console.log(err);
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


  getAllDashboardDetails() {
    this.loaderService.show();

    const backgroundColors = [
      "linear-gradient(135deg, #252c42 10%, #3a39c4 100%)",
      "linear-gradient(135deg, #F12711 10%, #F5AF19 100%)",
      "linear-gradient(135deg, #cc208e 10%, #6713d2 100%)",
      "linear-gradient(135deg, #ff0844 10%, #ffb199 100%)",
      "linear-gradient(135deg, #2AFADF 10%, #4C83FF 100%)"
    ];

    // this.chartService.getAllDashboardDetails().subscribe((res : any) =>{
    //   console.log('res in homePage', res)
    // })

    this.chartService.getAllDashboardDetailsWithEmptyData().subscribe(
      (res: any) => {
        this.loaderService.hide();

        if (res.success) {
          console.log("Dashboard Details", res);

          // Fetch all dashboards
          let allDashboards = res["data"];

          // Check if the user is a superadmin
          if (this.userInformationData.username === 'superadmin') {
            // If superadmin, show all dashboards without filtering
            this.dashboardDetailArray = allDashboards;
            console.log("this.dashboardDetailArray for superadmin", this.dashboardDetailArray);


          } else {
            // If not superadmin, filter dashboards based on permissions
            this.dashboardDetailArray = allDashboards.filter((dashboard: any) => {
              const permission = this.dashboardBasedPermssionArray.find(
                (perm: any) => perm.dashboard_id === dashboard.dashboard_id
              );
              return permission && permission.can_view === true;
            });
            console.log("this.dashboardDetailArray for other role", this.dashboardDetailArray);

          }

          // Map with additional properties
          this.dashboardDetailArray = this.dashboardDetailArray.map((item: any, index: number) => ({
            ...item,
            imageUrl: this.imageUrls[index % this.imageUrls.length],
            backgroundColor: backgroundColors[index % backgroundColors.length],
            imageFlag: this.imageFlag, // assuming imageFlag is part of the item
          }));

          console.log(this.dashboardDetailArray);


        } else {
          this.popupService.showPopup({
            message: res.message,
            statusCode: res.status_code,
            status: res.success
          });
        }
      },
      (err: HttpErrorResponse) => {
        console.log(err);
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

  selectedGroup: any = null;

  selectGroup(group: any) {
    this.selectedGroup = group;
  }

  clearSelectedGroup() {
    this.selectedGroup = null;
  }

  toggleView(viewToShow: string) {
    // console.log('hello')
    if (viewToShow === 'card') {
      this.cardView.nativeElement.style.display = 'block';
      this.listView.nativeElement.style.display = 'none';
      this.listviewIcon = true;
      this.cardViewIcon = false;
    } else {
      console.log(this.listviewIcon, this.cardViewIcon)

      this.cardView.nativeElement.style.display = 'none';
      this.listView.nativeElement.style.display = 'block';
      this.listviewIcon = false;
      this.cardViewIcon = true;

      console.log(this.listviewIcon, this.cardViewIcon)
    }
  }



  onListChange(eve: any) {
    let target = eve.target.value
    this.selectedView = target;

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


  refreshPage() {
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
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



  filteredDashboardDetailArray: any[] = [];
  filterTerm: string = '';

  filterData(event: any) {
    this.filterTerm = event.target.value.toLowerCase();
  }


  sendDashboardObj(name: string) {
    this.router.navigate(['/sidebar/panel/panelView', name]);
  }

  refreshAllDashboards() {

    this.loaderService.show();

    let confirmMsg = window.confirm('Do you want to delete Cache')

    if (confirmMsg) {


      this.chartService.deleteAllCache().subscribe(
        (res: any) => {
          console.log(res)
          this.loaderService.hide();
          this.showPopup(res.success, '35px', res.message)
          //  setTimeout(() => {
          //   this.closePopup();
          // }, 5000);
          this.popupService.showPopup({
            message: res.message,
            statusCode: res.status_code,
            status: res.success
          });
        },

        (err: any) => {

          this.loaderService.hide();
          // this.showPopup(false, '35px', err.message)
          const errorMessage = err.error && err.error.message ? err.error.message : err.message;
          this.popupService.showPopup({
            message: errorMessage,
            statusCode: err.status_code,
            status: false
          }

          );

        }

      )
    } else {
      this.loaderService.hide();

    }
  }


  onDashboardRefresh(dashboard_id: string) {
    console.log('id', dashboard_id)

    this.loaderService.show();

    this.chartService.deleteDashboardCache(dashboard_id).subscribe(
      (res: any) => {
        console.log(res)

        this.loaderService.hide();

        this.popupService.showPopup({
          message: res.message,
          statusCode: res.status_code,
          status: res.success
        });

      },


      (err: any) => {

        this.loaderService.hide();
        // this.showPopup(false, '35px', err.message)
        const errorMessage = err.error && err.error.message ? err.error.message : err.message;
        this.popupService.showPopup({
          message: errorMessage,
          statusCode: err.status_code,
          status: false
        });

      }


    )
  }



  onClick() {

  }
  getPermissionById(dashboardId: string): any {
    if (this.dashboardBasedPermssionArray && this.dashboardBasedPermssionArray.length > 0) {
      return this.dashboardBasedPermssionArray.find((permission: any) => permission.dashboard_id === dashboardId);
    }
    return null; // or handle it in a way that fits your logic
  }

  onViewClick(obj: any) {
    console.log(obj)
    let name = obj.dashboard_name;
    let id = obj.dashboard_id;
    this.router.navigate(['/sidebar/panel/panelView', id]);
  }


  onEditClick(obj: any) {
    let id = obj.dashboard_id;
    this.router.navigate(['/sidebar/panel/edit', id]);
  }




  onCancelPopup() {
    if (this.userBasedPermissionFlag) {
    } else if (this.roleBasedPermissionFLag) {
    }
    this.showChildComponent = false

    this.roleDialogBox.hide();
  }

  onUserBasedAccess(obj: any) {
    console.log('obj', obj)
    this.sendDashboardId = {
      "dashboard_id": obj.dashboard_id,
      "dashboard_name": obj.dashboard_name,
    }

    this.showUserPopup = true;
    this.userDialogBox.show();
    this.userSubmitFlag = true;
    this.userUpdateFlag = false;

  }



  onRoleBasedAcess(obj: any) {

    this.roleDashboardObj = {
      "dashboard_id": obj.dashboard_id,
      "dashboard_name": obj.dashboard_name,
    }
    console.log(obj)
    this.showChildComponent = true
    this.roleDialogBox.show();
    this.submitFlag = true;
    this.updateFlag = false;

  }
  resFlag(eve: any) {
    console.log(eve)

    this.submitFlag = eve.submit;
    this.updateFlag = eve.update;
  }

  resUserFlag(eve: any) {
    console.log(eve)
    this.userSubmitFlag = eve.submit;
    this.userUpdateFlag = eve.update;
  }


  onRoleBasedAccessSubmit() {
    this.roleBasedDialog.onFormSubmit();
    this.roleDialogBox.hide();
    this.loaderService.show()
  }

  onUserBasedAccessSubmit() {
    this.userBasedDialog.onFormSubmit()
    this.userDialogBox.hide();
    this.loaderService.show()

  }
  onUpdateRoleBasedAccess() {
    this.roleBasedDialog.onUpdateForm();
    this.roleDialogBox.hide();
    // this.showChildComponent = false
    this.loaderService.show()
  }

  delteRolePermission() {
    this.roleBasedDialog.onDelete();
    this.roleDialogBox.hide();
    this.loaderService.show()
  }

  deleteUserPermission() {
    this.userBasedDialog.onDelete();
    this.userDialogBox.hide();
    this.loaderService.show()
  }


  onUserUpdateDashboardAccess() {
    this.userDialogBox.hide();
    this.userBasedDialog.onformUpdate()
    // this.showUserPopup = false;
    this.loaderService.show()

  }

  onDeleteClick(obj: any) {
    let id = obj.dashboard_id;
    let deleteMessage = window.confirm('Do you want to delete the dashboard');
    this.loaderService.show();

    if (deleteMessage) {
      this.chartService.deleteDashboardById(id).subscribe(
        (res => {
          console.log(res);
          this.loaderService.hide();

          // this.showPopup(res.success, '35px', res.message);
          this.popupService.showPopup({
            message: res.message,
            statusCode: res.status_code,
            status: res.success
          });
          this.chartService.getAllDashboardDetails().subscribe((updatedData: any) => {
            this.dashboardDetailArray = updatedData['data'];
          });
        }),


        (err: HttpErrorResponse) => {

          this.loaderService.hide();
          // this.showPopup(false, '35px', err.message)
          const errorMessage = err.error && err.error.message ? err.error.message : err.message;
          this.popupService.showPopup({
            message: errorMessage,
            statusCode: err.status,
            status: false
          });

        }

      );
    } else {
      this.loaderService.hide()
      console.log('Deletion canceled');
    }

  }

  getResponseMessage(eve: any) {
    console.log('eve res loader', eve)
    this.loaderService.hide();

    this.popupService.showPopup({
      message: eve.message,
      statusCode: eve.statusCode,
      status: eve.status
    });
    // }

    this.showUserPopup = true;

  }




  ngAfterViewInit() {
    // console.log('PopupComponent instance:', this.PopupComponent);
  }


  showMessage(message: string, messageType: string) {
    this.responseMessage = message;

    if (messageType === 'success') {
      this.messageBackgroundColor = 'success';
    } else if (messageType === 'error') {
      this.messageBackgroundColor = 'error';
    } else {
      this.messageBackgroundColor = ''; // You can set a default color or leave it empty
    }



  }

  closeMessage() {
    this.responseMessageDialog.hide();
    this.responseMessage = '';
    this.messageBackgroundColor = '';
  }
  dialogClose = (): void => {
  }

  dialogOpen = (): void => {
  }

  getAllRoledashboardPermissionDetailsArray(role_id: any) {
    console.log('getAllRoledashboardPermissionDetailsArray', role_id)
    this.chartService.getAllRoleDashboardPermissionByRoleid(role_id).subscribe(
      (res: any) => {
      console.log('Role-based permission_details', res);

      if (res.success) {
        let data = res['data']
        this.dashboardBasedPermssionArray = res['data']?.permission_details || [];
        console.log('Role-based permission_details', res['data']);
        this.dashboardBasedAccessService.setdashboardAccess(data);
        this.getAllDashboardDetails()

      } else {

        this.popupService.showPopup({
          message: res.message,
          statusCode: res.status_code,
          status: res.success
        });

        // this.dashboardBasedPermssionArray = [];

      }
    },
    (err : any) =>{
      const errorMessage = err.error && err.error.message ? err.error.message : err.message;
      this.popupService.showPopup({
        message: errorMessage,
        statusCode: 500,
        status: false
      });

    }
  
  
  );
  }

  getAllUserDashboardsPermissionsArray(role_id: any, user_id: any, role: any) {
    // this.loaderService.show();


    // If role is superadmin, skip all checks and directly fetch dashboard details
    if (role === 'superadmin') {
      console.log("Role is superadmin, fetching all dashboard details directly...", role);
      this.getAllDashboardDetails();
      return;
    }

    console.log('role getAllUserDashboardsPermissionsArray', role, role_id, user_id)


    this.chartService.getAllUserDashboardPermissionByRoleidUserId(role_id, user_id).subscribe((res: any) => {
      console.log('res in permission', res )
      if (res.success) {
        let data = res['data'];
        this.dashboardBasedPermssionArray = data?.permission_details || [];

        console.log('User-based permission_details', res['data']);

        // Check if all permission values are false for every object in the array
        const allFalse = this.dashboardBasedPermssionArray.every((obj: any) =>
          !obj.can_view &&
          !obj.can_download &&
          !obj.can_schedule &&
          !obj.can_create &&
          !obj.can_delete &&
          !obj.can_update
        );

        if (allFalse) {
          console.log("All user permissions are false, fetching role-based permissions...");
          this.getAllRoledashboardPermissionDetailsArray(role_id);
        } else {
          this.getAllDashboardDetails()

          this.dashboardBasedAccessService.setdashboardAccess(data);
        }

      } else {
        this.dashboardBasedPermssionArray = [];
        // console.error('Failed to fetch user-based permissions', res.message);
        // If fetching user permissions fails, call role-based permissions
        this.getAllRoledashboardPermissionDetailsArray(role_id);
      }
    });
  }


  getAllUserDashboardsPermissionsArrayOld(role_id: any, user_id: any) {
    this.chartService.getAllUserDashboardPermissionByRoleidUserId(role_id, user_id).subscribe((res: any) => {
      if (res.success) {
        let data = res['data']
        this.dashboardBasedPermssionArray = res['data']?.permission_details || [];
        this.dashboardBasedAccessService.setdashboardAccess(data);
        this.getAllDashboardDetails()

        console.log('User-based permission_details', res['data']);
      } else {
        this.dashboardBasedPermssionArray = [];
        console.error('Failed to fetch user-based permissions', res.message);
      }
    });
  }


}
