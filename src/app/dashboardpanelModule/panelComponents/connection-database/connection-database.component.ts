import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component, OnInit, ViewChild, inject} from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AnimationModel } from '@syncfusion/ej2-angular-charts';
import { MessageComponent } from '@syncfusion/ej2-angular-notifications';
import { DialogComponent, AnimationSettingsModel, DialogModule } from '@syncfusion/ej2-angular-popups';
import { ChartService } from 'src/app/core/services/chart.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { MenuBasedAccessService } from 'src/app/core/services/menu-based-access.service';
import { PopupService } from 'src/app/core/services/popup.service';
import { ButtonModule } from '@syncfusion/ej2-angular-buttons';
import { NgStyle } from '@angular/common';

@Component({
    selector: 'app-connection-database',
    templateUrl: './connection-database.component.html',
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
    styleUrls: ['./connection-database.component.scss'],
    imports: [FormsModule, ButtonModule, DialogModule, ReactiveFormsModule, NgStyle]
})

export class ConnectionDatabaseComponent implements OnInit {

  registrationForm!: FormGroup;
  connectionForm!: FormGroup;

  @ViewChild('defaultDialog')
  defaultDialog!: DialogComponent;


  dialogCloseIcon: Boolean = true;
  dialogWidth: string = '850px';
  contentData: string = 'This is a dialog with draggable support.';
  dialogdragging: Boolean = true;
  animationSettings: AnimationSettingsModel = { effect: 'SlideBottom' };
  isModal: Boolean = true;
  target: string = '.control-section';
  showCloseIcon: Boolean = false;
  visible: Boolean = false;
  submitFlag: boolean = true;
  updateFlag: boolean = false;
  message: string = "";
  success: boolean = false;
  displayPopup: boolean = false;
  rolesArray: string[] = []
  loaderFlag: boolean = true;
  isIndeterminate?: boolean;
  animation: AnimationModel = { enable: true, duration: 2000, delay: 0 };
  count: number = 0;
  updateIndex: any;
  registeredUsersArray: any = [];
  dbConnectionArr: any = [];
  errorMessage: any;
  formTitle: string = 'Add Database Connection '
  filterTerm: string = '';
  menuBasedAccess: any = {};
  permissionObj: any = {};
  menuBasedPermissionControlArray: any = []

  activeUsersArray: any = [];

  dialogBtnClick = (): void => {
    this.initForm();
    this.submitFlag = true;
    this.updateFlag = false;
    this.defaultDialog.show();
    // this.message = "";
    this.dialogOpen();
    this.formTitle = 'Add Database Connection '
    // this.messageBackgroundColor = ''
    this.isMessageVisible = false
  }

  dialogClose = (): void => {
  }

  dialogOpen = (): void => {
  }




  private readonly formBuilder = inject(FormBuilder);
  private readonly chartService = inject(ChartService);
  private readonly menuBasedAccessService = inject(MenuBasedAccessService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly popupService = inject(PopupService);
  private readonly loaderService = inject(LoaderService);

  ngOnInit() {

    const localStorageData = this.menuBasedAccessService.updateMenuAccessFromLocalStorage();

    if (localStorageData) {
      this.menuBasedAccess = localStorageData;
      this.menuBasedPermissionControlArray = this.menuBasedAccess?.permission_details
      const formNameToFind = 'dbConnection';
      const permissionDetailsForHome = this.menuBasedPermissionControlArray?.find(
        (permission: any) => permission.form_name === formNameToFind
      );

      if (permissionDetailsForHome) {
        console.log('Permission details for "dbConnection":', permissionDetailsForHome);
        this.permissionObj = permissionDetailsForHome
      } else {
        console.log('Permission details not found for "dbConnection"');
      }
      console.log('this.menuBasedAccess from Localstroage', this.menuBasedAccess)
    } else {
      this.menuBasedAccessService.menuAccess$.subscribe((menuAccess) => {
        this.menuBasedAccess = menuAccess;
        this.menuBasedPermissionControlArray = this.menuBasedAccess?.permission_details

        console.log('this.menuBasedAccess from subjectData', this.menuBasedAccess)

      });

    }


    this.initForm()
    // const backdrop : any = document.getElementById('backdrop');

    // if ( backdrop) {
    //   // backdrop.style.display = 'none';
    //   backdrop.style.display = 'block';
    // }
    this.loaderService.show();

    this.chartService.getAllDbConncetionDetails().subscribe(
      (res: any) => {
        console.log('All dashboard details', res)
        if (res) {
          this.loaderService.hide();

          this.registeredUsersArray = res['data']
          this.dbConnectionArr = this.registeredUsersArray
          // this.loaderFlag = false;
          // backdrop.style.display = 'none';

        }
      },
      (err: any) => {
        this.loaderService.hide();

       // this.showPopup(false, '35px', "Something Went wrong, Please reload the page");
        const errorMessage = err.error && err.error.message ? err.error.message : err.message;
        this.popupService.showPopup({
          message: errorMessage,
          statusCode: err.status,
          status :false
        });
      }
    )
    this.getRolesArrayDataFromLocalStorage()
  }

  initForm() {
    this.connectionForm = this.formBuilder.group({
      connection_name: ['', Validators.required],
      host_ip_or_name: ['', Validators.required],
      port: [0, Validators.required],
      user_name: ['', Validators.required],
      password: ['', Validators.required],
      schema_name: ['', Validators.required],
      default_database_name: ['', Validators.required],
      database_type: ['', Validators.required]
    });
  }

  onConnectionNameSerach(eve: any) {
    let val = eve.target.value;
  }

  onSearch(eve: any) {
    let val = eve.target.value;
    // this.dbConnectionArr =  this.registeredUsersArray 
    this.dbConnectionArr = this.registeredUsersArray.filter((connectionObj: any) =>
      connectionObj.connection_name.toLowerCase().includes(this.filterTerm.toLowerCase())
    );

  }

  @ViewChild('msg_error_icon') public msgError!: MessageComponent;
  isMessageVisible: boolean = false;
  messageBackgroundColor: string = '';


  showMessage(message: string, messageType: string) {
    this.message = message;
    // this.messageBackgroundColor = backgroundColor;
    this.isMessageVisible = true;

    if (messageType === 'success') {
      this.messageBackgroundColor = 'success';
    } else if (messageType === 'error') {
      this.messageBackgroundColor = 'error';
    } else {
      this.messageBackgroundColor = ''; // You can set a default color or leave it empty
    }


    // // Automatically close the message after a certain duration (e.g., 5 seconds)
    // // setTimeout(() => {
    // //   this.closeMessage();
    // // }, 5000);
  }

  closeMessage() {
    this.isMessageVisible = false;
    this.message = '';
    this.messageBackgroundColor = '';
  }

  isLoading : boolean = false;


  onTestDbConnectionold() {
    let formValue = this.connectionForm.value

    let obj = {
      "connection_name": formValue.connection_name,
      "host_ip_or_name": formValue.host_ip_or_name,
      "port": +(formValue.port),
      "user_name": formValue.user_name,
      "password": formValue.password,
      "schema_name": formValue.schema_name,
      "database_type": formValue.database_type,
      "default_database_name": formValue.default_database_name,
      "is_active": true
    }

    this.chartService.testDbConnection(obj).subscribe(
      (res: any) => {
        console.log(res, res.status);
        this.isMessageVisible = true
        // this.showMessage(this.message, res.status)


        if (res.success === true) {
          this.messageBackgroundColor = 'success';
          this.message = "Test is successfull"
          console.log(" this.messageBackgroundColor", this.messageBackgroundColor);

        } else if (res.success === false) {
          this.messageBackgroundColor = 'error';
          this.message = res.message;

          console.log(" this.messageBackgroundColor", this.messageBackgroundColor);

        } else {
          this.messageBackgroundColor = ''; // You can set a default color or leave it empty
        }

      },

      (err: any) => {

        this.messageBackgroundColor = 'error';
        this.message = "Something Went wrong, Please reload the page";

      }
    
    )



  }

  onTestDbConnection() {
    this.isLoading = true; // Show loader
  
    const formValue = this.connectionForm.value;
  
    const obj = {
      connection_name: formValue.connection_name || '',
      host_ip_or_name: formValue.host_ip_or_name || '',
      port: +(formValue.port || 0),
      user_name: formValue.user_name || '',
      password: formValue.password || '',
      schema_name: formValue.schema_name || '',
      database_type: formValue.database_type || '',
      default_database_name: formValue.default_database_name || '',
      is_active: true
    };
  
    this.chartService.testDbConnection(obj).subscribe(
      (res: any) => {
        this.isLoading = false; // Hide loader
        this.isMessageVisible = true;
  
        if (res.success) {
          this.messageBackgroundColor = 'success';
          this.message = "Test is successful";
        } else {
          this.messageBackgroundColor = 'error';
          this.message = res.message;
        }
      },
      (err: any) => {
        this.isLoading = false; // Hide loader
        this.messageBackgroundColor = 'error';
        this.message = "Something went wrong, please reload the page";
      }
    );
  }

  
  editDbObj(item: any, id: any) {
    console.log(item)
    this.editColumnObjIndex = item.connection_id;
    this.submitFlag = false;
    this.updateFlag = true;
    this.updateIndex = id;
    this.defaultDialog.show();
    this.isMessageVisible = false;

    this.message = "";
    this.formTitle = 'Update Database Connection '

    this.chartService.getDbConnectionDetailById(item.connection_id).subscribe((res: any) => {
      let data = res['data']
       console.log('data', data)

      // this.connectionForm.patchValue(data);

      this.connectionForm.patchValue({
        connection_name: data.connection_name || '',
        host_ip_or_name: data.host_ip_or_name || '',
        port: data.port || 0,
        user_name: data.user_name || '',
        schema_name: data.schema_name || '',
        default_database_name: data.default_database_name || '',
        database_type: data.database_type || '',
  
        // Explicitly assign an empty string to the password field
        password: ''
      });

    })
    //console.log(item, id)
  }

  private getRolesArrayDataFromLocalStorage() {
    let panelData = sessionStorage.getItem('dataBaseConnectionArray');
    if (panelData !== null) {
      this.registeredUsersArray = JSON.parse(panelData);

    } else {
      this.registeredUsersArray = [];
    }
  }
  dataStateChange(event: any) {

  }
  public editRecord(data: any): void {

    this.submitFlag = false;
    this.updateFlag = true;
    this.editColumnObjIndex = data.connection_id;
    this.defaultDialog.show()

    let obj = {
      "connection_name": data.connection_name || '',
      "host_ip_or_name": data.host_ip_or_name || '',
      "port": data.port || 0,
      "user_name": data.user_name || '',
      "connection_id": data.connection_id || '',
      "password": data.password || '',
      "schema_name": data.schema_name || '',
      "default_database_name": data.default_database_name || '',
      "database_type": data.database_type || '',
      "is_active": true
    }
    // console.log(obj)
    this.connectionForm.patchValue({
      connection_name: obj.connection_name || '',
      host_ip_or_name: obj.host_ip_or_name || '',
      port: obj.port || 0,
      user_name: obj.user_name || '',
      connection_id: obj.connection_id || '',
      password: obj.password || '',
      schema_name: obj.schema_name || '',
      default_database_name: obj.default_database_name || '',
      database_type: obj.database_type || ''
    });
  }
  deleteDbObj(item: any, id: any) {

    let dltMessage = window.confirm('Do you want to delete the Connection Name')

    if (dltMessage) {
      this.loaderService.show();

      this.chartService.deleteDBConnection(item.connection_id).subscribe(
        (res: any) => {
         
          console.log(res)
          this.loaderService.hide();

          this.registeredUsersArray.splice(id, 1);
          this.dbConnectionArr = this.registeredUsersArray
          sessionStorage.setItem('dataBaseConnectionArray', JSON.stringify(this.registeredUsersArray));
         // this.showPopup(res.success, '35px', res.message)

          this.popupService.showPopup({
            message: res.message,
            statusCode: res.status_code,
            status : res.success
          });

        },

        (err: any) => {
          this.loaderService.hide();
          const errorMessage = err.error && err.error.message ? err.error.message : err.message;
          this.popupService.showPopup({
            message: errorMessage,
            statusCode: err.status,
            status :false
          });

        }
        )
    } else {
      console.log('Connection Name not deleted')
    }



  }
  //  deleteRecord(data: any): void {

  //   let obj = {
  //     "connection_name": data.connection_name,
  //     "connection_id" :  data.connection_id,
  //     "host_ip_or_name": data.host_ip_or_name,
  //     "port": data.port,
  //     "user_name": data.user_name,
  //     "password": data.password,
  //     "schema_name": data.schema_name,
  //     "default_database_name": data.default_database_name,
  //     "database_type" : data.database_type,
  //     "is_active": true
  //   }
  //   this.chartService.deleteDBConnection(obj.connection_id).subscribe((res : any) =>{
  //    // console.log('res', res)
  //   })

  // }
  onInputFocus(event: FocusEvent) {
    const input = event.target as HTMLInputElement;
    input.classList.add('focused');
  }

  onInputBlur(event: any) {
    const input = event.target as HTMLInputElement;
    input.classList.remove('focused');
  }

  onSubmit() {
    this.getRolesArrayDataFromLocalStorage()

    let formValue = this.connectionForm.value;

    if (this.connectionForm.valid) {
      let obj = {
        "connection_name": formValue.connection_name || '',
        "host_ip_or_name": formValue.host_ip_or_name || '',
        "port": +(formValue.port || 0),
        "user_name": formValue.user_name || '',
        "password": formValue.password || '',
        "schema_name": formValue.schema_name || '',
        "database_type": formValue.database_type || '',
        "default_database_name": formValue.default_database_name || '',
        "is_active": true
      }



      let connectionNameObj = this.registeredUsersArray.find((ele: any) => ele.connection_name == obj.connection_name);
      this.message = "";
      if (connectionNameObj) {
        alert("Connection Name is already exists.")
      } else {
        this.loaderService.show()
        this.chartService.createDatabase(obj).subscribe(
          (res: any) => {
            this.defaultDialog.hide()
            // this.registeredUsersArray.push(obj);
            this.loaderService.hide()

            this.registeredUsersArray = [...this.registeredUsersArray]

            sessionStorage.setItem('dataBaseConnectionArray', JSON.stringify(this.registeredUsersArray));
            this.connectionForm.reset()
           // this.showPopup(res.success, '35px', res.message)
            this.popupService.showPopup({
              message: res.message,
              statusCode: res.status_code,
              status : res.success
            });
    
          },
          (err: any) => {
            this.loaderService.hide()
            const errorMessage = err.error && err.error.message ? err.error.message : err.message;
            this.popupService.showPopup({
              message: errorMessage,
              statusCode: err.status,
              status :false
            });
          }

        )
      }
    }
  }

  editColumnObjIndex: any;

  refreshPage() {
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
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

      popupMessage.innerHTML = `<span style="color: ${iconColor};"><i class="fas ${iconClass}" style="font-size: ${fontSize};"></i></span>`;

      const statusElement = document.createElement('h5');
      statusElement.textContent = status === true ? 'Success' : 'Error';
      popupMessage.appendChild(statusElement);

      const messageElement = document.createElement('div');
      messageElement.innerHTML = `<h6>${resMessage}</h6>`;
      popupMessage.appendChild(messageElement);

      const scrollTop = document.documentElement.scrollTop;
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      const popupHeight = popup.offsetHeight;

      const topPosition = Math.max(0, scrollTop + windowHeight / 2 - popupHeight / 2);

      popup.style.top = topPosition + 'px';
      popup.style.display = 'block';

      backdrop.style.display = 'block';
    }
  }
  onUpdate() {
    const updatedObj = this.connectionForm.value;
    console.log(this.editColumnObjIndex)

    let obj = {
      "connection_name": updatedObj.connection_name || '',
      'connection_id': this.editColumnObjIndex || '',
      "host_ip_or_name": updatedObj.host_ip_or_name || '',
      "port": updatedObj.port || 0,
      "user_name": updatedObj.user_name || '',
      "password": updatedObj.password || '',
      "schema_name": updatedObj.schema_name || '',
      "database_type": updatedObj.database_type || '',
      "default_database_name": updatedObj.default_database_name || '',

    }

    this.submitFlag = true;
    this.updateFlag = false;
    // console.log(obj.connection_id)

    this.loaderService.show()
    this.message = "";

    this.chartService.updateDbConnection(obj.connection_id, obj).subscribe(

      (res: any) => {
        console.log(res);
        this.loaderService.hide()
       // this.showPopup(res.success, '35px', res.message)
        this.registeredUsersArray.splice(this.updateIndex, 1, obj);
        this.popupService.showPopup({
          message: res.message,
          statusCode: res.status_code,
          status : res.success
        });
      },
      (err: any) => {

        this.loaderService.hide()
        const errorMessage = err.error && err.error.message ? err.error.message : err.message;
        this.popupService.showPopup({
          message: errorMessage,
          statusCode: err.status,
          status :false
        });
     
      }

    )

    this.connectionForm.reset();
    this.defaultDialog.hide()
  }



}
