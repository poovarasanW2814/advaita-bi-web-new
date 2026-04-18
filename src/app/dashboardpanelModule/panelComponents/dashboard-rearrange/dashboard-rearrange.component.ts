
import { Component, OnInit, ViewChild, inject} from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent, ButtonModule, SwitchModule } from '@syncfusion/ej2-angular-buttons';
import { DragEventArgs, ListBoxComponent, ListBoxModule, DropDownListModule, MultiSelectModule } from '@syncfusion/ej2-angular-dropdowns';
import { AnimationSettingsModel, DialogComponent, DialogModule } from '@syncfusion/ej2-angular-popups';
import { Draggable } from '@syncfusion/ej2/base';
import { ChartService } from 'src/app/core/services/chart.service';
import { MenuBasedAccessService } from 'src/app/core/services/menu-based-access.service';
import { ItemModel } from '@syncfusion/ej2-angular-splitbuttons';
import { LoaderService } from 'src/app/core/services/loader.service';
import { PopupService } from 'src/app/core/services/popup.service';
import { Router } from '@angular/router';
import { NgIf, NgFor } from '@angular/common';


@Component({
    selector: 'app-dashboard-rearrange',
    templateUrl: './dashboard-rearrange.component.html',
    styleUrls: ['./dashboard-rearrange.component.scss'],
    imports: [NgIf, ButtonModule, ListBoxModule, DialogModule, FormsModule, ReactiveFormsModule, NgFor, SwitchModule, DropDownListModule, MultiSelectModule]
})
export class DashboardRearrangeComponent implements OnInit {

  @ViewChild('listbox1') listObj1!: ListBoxComponent; 
  showSetupDialog: boolean = false;
  showGroupingDialog: boolean = false;
  @ViewChild('dialogBtn')dialogBtn!: ButtonComponent;

  fields: FieldSettingsModel = { text: 'dashboard_name', description : 'description', value: 'dashboard_index'};

  dashboardSetupForm! : FormGroup;
  draggedItemIndex!: number;
  imageHeight: number = 100;
  dashboardDataList : any = []
  itemColors: string[] = [];
  menuBasedPermissionControlArray : any = [];
  usersArray : any = [];
  menuBasedAccess : any =  {};
  permissionObj : any = {};
  submitFlag : boolean = true;
  updateFlag : boolean = false;
  superadminObj : any;

   items: ItemModel[] = [
    {
      text: 'DB Backup',
      // iconCss: 'bi bi-person-gear',
    },
    {
      text: 'Empty DB',
      // iconCss: 'bi bi-power'
    }];

  private readonly chartService = inject(ChartService);
  private readonly menuBasedAccessService = inject(MenuBasedAccessService);
  private readonly fb = inject(FormBuilder);
  private readonly loaderService = inject(LoaderService);
  private readonly popupService = inject(PopupService);
  private readonly router = inject(Router);


   colors: string[] = [
    "linear-gradient(135deg, #AFF1DA 10%, #F9EA8F 100%);",
    "linear-gradient(135deg, #feada6 10%, #f5efef 100%);",
   " linear-gradient(135deg, #FFD3A5 10%, #FD6585 100%);",
    "linear-gradient(135deg, #69FF97 10%, #00E4FF 100%);",
    "linear-gradient(135deg, #81FBB8 10%, #28C76F 100%);",
   " linear-gradient(135deg, #FFF3B0 10%, #CA26FF 100%);",
   " linear-gradient(135deg, #9795f0 10%, #fbc8d4 100%);",
   " linear-gradient(135deg, #89D4CF 10%, #734AE8 100%);",
   " linear-gradient(135deg, #F5CBFF 10%, #C346C2 100%);",
    "linear-gradient(135deg, #64b3f4 10%, #c2e59c 100%);",

   ]; 

   formInit(){
    this.dashboardSetupForm = this.fb.group({
      user_id : ['',  Validators.required],
      display_type : ['',  Validators.required],
      all_cache_exp : 10,
      version_enabled : [false, Validators.required],
      enable_cache : [2, Validators.required],
      show_image : [true, Validators.required],
     // all_cache_exp: [this.isSuperadmin ? '' : this.superadminObj?.all_cache_exp, Validators.required],
    })
   }

   isRoleSuperadmin : string = ""

   ngOnInit(): void {

    let userData : any =  sessionStorage.getItem('userInformation');
    if(userData){
     userData = JSON.parse(userData);
    }
    this.userObj = userData;
    this.isSuperadmin = userData?.username === 'superadmin' || userData?.user_id == 1;
    console.log(this.isSuperadmin)
     console.log(userData)
    this.chartService.getDashboardSetupByUserId(userData.user_id).subscribe((res : any) =>{
      console.log(res);
      let data = res['data'];
      if(data){
        this.submitFlag  = false;
        this.updateFlag  = true;
        this.dashboardSetupForm.patchValue(
          {
            user_id : data.user_id,
            display_type : data.display_type,
       
            show_image :data.show_image,
          }
        );

        this.setupId = data.id;

      }else{
        this.submitFlag  = true;
        this.updateFlag  = false;
      }
    })


    if(userData){
      this.chartService.getUserDetailByUsername(userData.username).subscribe((res : any) =>{
        console.log('user res', res);
        this.userInfoObj = res['data'];
        this.isRoleSuperadmin = this.userInfoObj.username
        console.log('isRoleSuperadmin', this.isRoleSuperadmin)

      })
    }

    this.formInit()
    this.groupingFormInit()
    const images = [   './../../../../assets/images/db1.jpg',
    './../../../../assets/images/db2.jpg',
    './../../../../assets/images/db3.jpg',
    './../../../../assets/images/db4.jpg',
    './../../../../assets/images/db5.jpg',
    './../../../../assets/images/db6.jpg',
    './../../../../assets/images/db7.jpg',
    './../../../../assets/images/db8.jpg',
    './../../../../assets/images/db9.jpg',
    './../../../../assets/images/db10.jpg',
    './../../../../assets/images/db11.jpg',
    './../../../../assets/images/db12.jpg',
    ];


    let imgIndex = 0; // Index to keep track of the current image
    this.loaderService.show();
    
    this.chartService.getAllDashboardDetails().subscribe(
      (res: any) => {
        console.log(res['data']);
        const data = res['data'];
  

        this.loaderService.hide();

        this.dashboardDataList = data.map((item: any, index: number) => {
          const backgroundImg = images[imgIndex];
          imgIndex = (imgIndex + 1) % images.length; // Update index for next iteration or loop back to the start
          const backgroundColor = this.colors[index % this.colors.length]; // Select color based on index
          return {
              ...item,
              backgroundImg,
              backgroundColor,
              groupName : 'Trends'
          };
      });
      },
      (err:any) =>{
        this.loaderService.hide();
        const errorMessage = err.error && err.error.message ? err.error.message : err.message;
        this.popupService.showPopup({
          message: errorMessage,
          statusCode: err.status,
          status :false
        });
      }
    );

    this.chartService.getallActiveUserDetails().subscribe((res : any) =>{
      let data = res['data'];
      this.usersArray = data
    })


    this.menuBasedAccessService.menuAccess$.subscribe((menuAccess) => {
      this.menuBasedAccess = menuAccess;
      this.menuBasedPermissionControlArray = this.menuBasedAccess?.permission_details
      const formNameToFind = 'dashboardSetup';
      const permissionDetailsForHome = this.menuBasedPermissionControlArray?.find(
        (permission : any) => permission.form_name === formNameToFind
      );
      console.log( permissionDetailsForHome)
    
      if (permissionDetailsForHome) {
        //console.log('Permission details for "home":', permissionDetailsForHome);
       this.permissionObj = permissionDetailsForHome
      } 

      const permissionDetailsForCreateGroup = this.menuBasedPermissionControlArray?.find(
        (permission : any) => permission.form_name === 'createGroupDashboard'
      );
      console.log('permissionDetailsForCreateGroup', permissionDetailsForCreateGroup)
      if (permissionDetailsForCreateGroup) {
        //console.log('Permission details for "home":', permissionDetailsForHome);
       this.groupPermissionObj = permissionDetailsForCreateGroup
      } 
    });


    this.chartService.getDashboardSetupByUserId(1).subscribe((res : any) =>{
      console.log('res for superadmin', res);
      let data = res['data'];

      if(data){
        this.superadminObj= data;
        this.dashboardSetupForm.patchValue(
          {
            user_id : data.user_id,
           display_type : data.display_type,
            all_cache_exp : data.all_cache_exp,
            version_enabled :data.version_enabled ,
            enable_cache : data.enable_cache,
            show_image :data.show_image,
          }
        );
      }else{
        this.formInit()
      }
    })


  }

  userInfoObj : any ;
  groupPermissionObj : any = {};
  closePopup(): void {
    const popup = document.getElementById('popup');
    const backdrop = document.getElementById('backdrop');

    if (popup && backdrop) {
      popup.style.display = 'none';
      backdrop.style.display = 'none';
    }
  }
 
   isDownloading = false;


  onDbSelect(eve: any) {
    this.loaderService.show();

    if (this.isDownloading) return;
  
    this.isDownloading = true;
    console.log('onDbSelect called');
    const selectedValue = eve.item.properties.text;
    console.log('selectedValue', selectedValue);
  
    if (selectedValue == "DB Backup") {
      this.chartService.getDbFilewithData().subscribe(
        (response: Blob) => {
          this.loaderService.hide();

          const a = document.createElement('a');
          const objectUrl = URL.createObjectURL(response);
          console.log('response', response);
          console.log('objectUrl', objectUrl);
          a.href = objectUrl;
          a.download = 'Syntheta_config(backup).db';
          a.click();
          URL.revokeObjectURL(objectUrl);
          this.isDownloading = false;
        },
        error => {
          this.loaderService.hide();

          console.error('File download error:', error);
          this.isDownloading = false;
        }
      );
    } else {
      this.chartService.getDbFileWithoutData().subscribe(
        (response: Blob) => {
          this.loaderService.hide();

          const a = document.createElement('a');
          const objectUrl = URL.createObjectURL(response);
          a.href = objectUrl;
          a.download = 'syntheta_config(new).db';
          a.click();
          URL.revokeObjectURL(objectUrl);
          this.isDownloading = false;
        },
        error => {
          this.loaderService.hide();

          console.error('File download error:', error);
          this.isDownloading = false;
        }
      );
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
      const statusElement = document.createElement('h4');
      statusElement.textContent = status === true ? 'Success' : 'Error';
      popupMessage.appendChild(statusElement);


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



  onDragStart(args: any): void {
    if (args.items && args.items.length > 0) {
      const draggedItem = args.items[0];
      this.draggedItemIndex = this.dashboardDataList.findIndex(
        (x: any) => x.dashboard_index === draggedItem.dashboard_index
      );
      console.log('onDragStart - draggedItemIndex:', this.draggedItemIndex);
      console.log('Dragged item:', draggedItem);
    } else {
      this.draggedItemIndex = -1;
    }
  }


    onDropOld(args: any): void {
      console.log('before dragging', this.dashboardDataList);

      const currentIndex = args.currentIndex;
      const previousIndex = args.previousIndex;

      if (currentIndex !== previousIndex) {
          // Retrieve the items from your data source using the provided indices
          const item1 = this.dashboardDataList[previousIndex];
          const item2 = this.dashboardDataList[currentIndex];

          console.log(item1, item2)
          // Swap the indices
          const tempDashboardIndex = item1.dashboard_index;
          item1.dashboard_index = item2.dashboard_index;
          item2.dashboard_index = tempDashboardIndex;

          console.log(item1.dashboard_index, item2.dashboard_index )
          // Create a new array with the modified items
          const updatedList = [...this.dashboardDataList];
          updatedList[previousIndex] = item2;
          updatedList[currentIndex] = item1;

          // Update the original array
          this.dashboardDataList = updatedList;
      }

      console.log('after dragging', this.dashboardDataList);
    }


      //  created one
  onDrop(args: any): void {
    console.log('onDrop triggered', args);
    console.log('before dragging', this.dashboardDataList);

    let dropIndex = -1;

    if (args.target) {
      const targetText = args.target.innerText?.trim();
      console.log("Drop target text:", targetText);

      dropIndex = this.dashboardDataList.findIndex(
        (x: any) => x.dashboard_name.trim() === targetText
      );
    }

    console.log('Calculated dropIndex:', dropIndex);

    if (dropIndex < 0 || this.draggedItemIndex < 0) {
      console.log('Invalid drop, skipping');
      return;
    }

    if (this.draggedItemIndex === dropIndex) {
      console.log('Dropped in the same position, skipping');
      return;
    }

    const updatedList = [...this.dashboardDataList];
    const [draggedItem] = updatedList.splice(this.draggedItemIndex, 1);
    updatedList.splice(dropIndex, 0, draggedItem);

    updatedList.forEach((item, index) => {
      item.dashboard_index = index;
    });

    this.dashboardDataList = updatedList;

    console.log('after dragging', this.dashboardDataList);
  }

  onDrag(args : any){
    // console.log('drag event start', args)
  }

  onDashboardRearrange(){
    console.log(this.dashboardDataList);
    this.loaderService.show();

    this.chartService.updateDashboardIndexs(this.dashboardDataList).subscribe(
      (res : any) =>{
      console.log('res' , res)
      this.loaderService.hide();

      // this.showPopup(res.success, '40px', res.message)
      this.popupService.showPopup({
        message: res.message,
        statusCode: res.status_code,
        status : res.success
      });
    },

    (err : any) =>{
      this.loaderService.hide();
      const errorMessage = err.error && err.error.message ? err.error.message : err.message;
      this.popupService.showPopup({
        message: errorMessage,
        statusCode: err.status,
        status :false
      });

    }
  
  )
  }

   dialogHeader: string = 'Dashboard Setup';
   dialogCloseIcon: Boolean = true;
   dialogWidth: string = '500px';
   contentData: string = 'This is a dialog with draggable support.';
   dialogdragging: Boolean = true;
   animationSettings: AnimationSettingsModel = { effect: 'None' };
   isModal: Boolean = true;
   target: string = '.control-section';
   showCloseIcon: Boolean = false;
   visible: Boolean = false;

    setupId! : number
    userObj : any;
    isSuperadmin: boolean = false;

dialogBtnClick() {
  this.showSetupDialog = true;
  let userData : any =  sessionStorage.getItem('userInformation');
  // this.userObj = userData;
  if(userData){
   userData = JSON.parse(userData);
  console.log('userData', userData)
  this.isSuperadmin = userData?.username === 'superadmin' || userData?.user_id === 1;

  this.chartService.getDashboardSetupByUserId(userData.user_id).subscribe((res : any) =>{
    console.log(res);
    let data = res['data'];
    if(data){
      this.submitFlag  = false;
      this.updateFlag  = true;
      this.dashboardSetupForm.patchValue(data);
      this.setupId = data.id;
       if(!this.isSuperadmin){
         this.toggleUpdateMode(this.isUpdateMode);
        }
    }else{
      this.submitFlag  = true;
      this.updateFlag  = false;
    }
  })
  }

  
}

isUpdateMode: boolean = true;

createDashboardSetup(){
  let formValue = this.dashboardSetupForm.value
  console.log(formValue);
  this.loaderService.show();

  this.showSetupDialog = false;
  this.chartService.createDashboardSetup(formValue).subscribe(
    (res : any) =>{
      console.log(res)
      this.loaderService.hide();
      this.popupService.showPopup({
        message: res.message,
        statusCode: res.status_code,
        status : res.success
      });

    }
    ,
    (err : any) =>{
      this.loaderService.hide();
      const errorMessage = err.error && err.error.message ? err.error.message : err.message;
      this.popupService.showPopup({
        message: errorMessage,
        statusCode: err.status,
        status :false
      });

    }
  )
}
toggleUpdateMode(isUpdate: boolean): void {
  this.isUpdateMode = isUpdate;
  console.log(this.isUpdateMode)
  if (this.isUpdateMode) {
    this.dashboardSetupForm.controls['user_id'].disable();
  } else {
    this.dashboardSetupForm.controls['user_id'].enable();
  }
}
updateDashboardSetup(){
  let formValue = this.dashboardSetupForm.value
  console.log(this.setupId,formValue )
  this.showSetupDialog = false;
  this.loaderService.show();

 this.chartService.updateDashboardSetup(this.setupId, formValue).subscribe(
  (res : any) =>{
    console.log(res)
    this.loaderService.hide();
    this.popupService.showPopup({
      message: res.message,
      statusCode: res.status_code,
      status : res.success
    });
  },
  (err: any) =>{
    this.loaderService.hide();
    const errorMessage = err.error && err.error.message ? err.error.message : err.message;
    this.popupService.showPopup({
      message: errorMessage,
      statusCode: err.status,
      status :false
    });
  }
 )
}


 dialogClose = (): void => {
    this.dialogBtn.element.style.display = 'block';
}

 dialogOpen = (): void => {
    this.dialogBtn.element.style.display = 'none';
}

openGroupingModal(){
  this.router.navigate(['/sidebar/panel/groupingDashboard']);
}

groupForm!: FormGroup;
groupNames = [{ name: 'Create New' },{ name: 'Marketing' }, { name: 'Sales' }, { name: 'Support' }];
isCustomGroup = false;

groupingFormInit(){
  this.groupForm = this.fb.group({
    groupName: ['', Validators.required],
    customGroupName: [''],
    dashboardNames: [[], Validators.required]
  });
}

onGroupChange(event: any) {
  const selectedGroup = event.value;
  console.log('selectedGroup', selectedGroup)
  const exists = this.groupNames.some(group => group.name === selectedGroup);

  if(selectedGroup == 'Create New'){
    this.isCustomGroup = true;
    return;
  }
  this.isCustomGroup = !exists;

  // clear custom group input if existing group selected
  if (!this.isCustomGroup) {
    this.groupForm.get('customGroupName')?.setValue('');
  }
}

onSubmit() {
  const formValue = this.groupForm.value;
  console.log('formValue', formValue);
  console.log('this.dashboardList', this.dashboardDataList);

  const finalGroupName = formValue.groupName !== 'Create New'
    ? formValue.groupName
    : formValue.customGroupName;

  // Update all dashboards with groupName for selected ones, empty for others
  const updatedDashboards = this.dashboardDataList.map((d: any) => {
    const isSelected = formValue.dashboardNames.includes(d.dashboard_id);
    return {
      ...d,
      groupName: isSelected ? finalGroupName : ''
    };
  });

  console.log('Final Updated Dashboards:', updatedDashboards);

}

}



export interface FieldSettingsModel {
  text?: string;
  value?: string;
  iconCss?: string;
  groupBy?: string;
  /**
   * Allows additional attributes such as title, disabled, etc., to configure the elements
   * in various ways to meet the criteria.
   *
   * @default null
   */
  htmlAttributes?: { [key: string]: string };
  description?: string;
  customClass?: string;
  url?: string;
  isDisabled?: boolean;
}


