import { Component, HostListener, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AnimationModel } from '@syncfusion/ej2-angular-charts';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { DialogComponent, AnimationSettingsModel } from '@syncfusion/ej2-angular-popups';
import { ChartService } from 'src/app/core/services/chart.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { MenuBasedAccessService } from 'src/app/core/services/menu-based-access.service';
import { PopupService } from 'src/app/core/services/popup.service';

@Component({
  selector: 'app-join-table',
  templateUrl: './join-table.component.html',
  styleUrls: ['./join-table.component.scss']
})

export class JoinTableComponent implements OnInit {
  [x: string]: any;

  registrationForm!: FormGroup;

  @ViewChild('defaultDialog')
  defaultDialog!: DialogComponent;

  rolesArray: string[] = ['Admin', 'Agent', 'Associate', 'Team Lead', 'Analyst', 'Business Head', 'Manager', 'Intern']


  dialogHeader: string = 'Drag Me!!!';
  dialogCloseIcon: Boolean = true;
  dialogWidth: string = '850px';
  contentData: string = 'This is a dialog with draggable support.';
  dialogdragging: Boolean = true;
  animationSettings: AnimationSettingsModel = { effect: 'None' };
  isModal: Boolean = true;
  target: string = '.control-section';
  showCloseIcon: Boolean = false;
  visible: Boolean = false;
  submitFlag: boolean = true;
  updateFlag: boolean = false;

  activeUsersArray: any = [];

  dialogBtnClick = (): void => {
    this.defaultDialog.show();
    this.formInit();
    this.submitFlag = true;
    this.updateFlag = false;
    this.dialogOpen();
  }

  dialogClose = (): void => {
  }

  dialogOpen = (): void => {
  }

  rowIndex!: number;
  registeredUsersArray: any = []
  tableNamesArray: any = [];
  tableJoinsArray: any = []
  menuBasedAccess: any = {};
  permissionObj: any = {};
  menuBasedPermissionControlArray: any = [];

  constructor(private formBuilder: FormBuilder, private chartService: ChartService, private route: ActivatedRoute, private router: Router, private menuBasedAccessService: MenuBasedAccessService, private renderer: Renderer2, private loaderService: LoaderService, private popupService: PopupService) { }

  screenWidth!: number;
  myForm!: FormGroup;
  @ViewChild('grid') grid!: GridComponent

  ngOnInit() {

    this.screenWidth = window.innerWidth;

    console.log('initial width', this.screenWidth)

    // this.loaderFlag = true;
    // const backdrop = document.getElementById('backdrop');

    // if ( backdrop) {
    //   backdrop.style.display = 'block';
    // }
    this.formInit()
    this.loaderService.show();


    this.chartService.getAllTableJoins().subscribe(
      (res: any) => {
        console.log(res);
        this.loaderService.hide();

        if (res.success) {



          this.tableJoinsArray = res['data'];

        } else {
          // this.showPopup(res.success, '30', res.message)
          this.popupService.showPopup({
            message: res.message,
            statusCode: res.status_code,
            status: res.success
          });
        }
      },

      (err: any) => {
        this.loaderService.hide();
        const errorMessage = err.error && err.error.message ? err.error.message : err.message;
        // this.showPopup(false, '35px', "Something Went wrong, Please reload the page");
        this.popupService.showPopup({
          message: errorMessage,
          statusCode: err.status,
          status: false
        });
      }
    )


    this.chartService.getAllDbConncetionDetails().subscribe((res: any) => {
      let resData = res['data'];
      // console.log(resData)
      this.connectionDetailsArray = resData;
    })

    this.menuBasedAccessService.menuAccess$.subscribe((menuAccess) => {
      this.menuBasedAccess = menuAccess;
      this.menuBasedPermissionControlArray = this.menuBasedAccess?.permission_details
      const formNameToFind = 'tableJoin';
      const permissionDetailsForHome = this.menuBasedPermissionControlArray?.find(
        (permission: any) => permission.form_name === formNameToFind
      );
      console.log(permissionDetailsForHome)

      if (permissionDetailsForHome) {
        //console.log('Permission details for "home":', permissionDetailsForHome);
        this.permissionObj = permissionDetailsForHome
      }
    });


  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (window.innerWidth <= 768) {
      console.log('hello')
      // Only trigger auto-fit columns for mobile devices
      this.grid.autoFitColumns([]);

    }
  }


  formInit() {
    this.myForm = this.formBuilder.group({
      table_join_name: ['', Validators.required],
      connection_id: ['', Validators.required],
      databaseName: ['', Validators.required],
      primaryTableName: ['', Validators.required],
      secondaryTableName: ['', Validators.required],
      primary_table_alias: ['', Validators.required],
      secondary_table_alias: ['', Validators.required],
      join_type: ['', Validators.required],
      tableJointsArr: this.formBuilder.array([this.createFieldSetArr()])
    });
  }
  refreshPage() {
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }
  connectionDetailsArray: any[] = [];

  // createFieldSetArr() {
  //   return this.formBuilder.group({
  //     primary_table_param: [''],
  //     secondary_table_param: [''],
  //     operator: ['']
  //   });
  // }
  createFieldSetArr(param: any = null) {
    return this.formBuilder.group({
      primary_table_param: [param ? param.primary_table_param : '', Validators.required],
      secondary_table_param: [param ? param.secondary_table_param : '', Validators.required],
      operator: [param ? param.operator : '', Validators.required],
      id: [param ? param.id : '', Validators.required],
      table_join_id: [param ? param.table_join_id : '', Validators.required]
    });
  }
  connectionId: any;
  databaseNameArr: any = []
  onConnectionNameSelect(event: any) {
    const connectionId = event.target.value;
    console.log(connectionId)
    if (connectionId) {
      // const [connectionName, connectionId] = selectedValue.split('-');
      // Do something with connectionName and connectionId
      console.log(connectionId);
      this.connectionId = connectionId;
      console.log('connectionId', this.connectionId);

      // this.chartService.getAllDatabaseNameById(connectionId).subscribe((res: any) => {
      //   console.log(res, 'res ')
      //   let data = res['data'];
      //   this.databaseNameArr = data.databases
      // })

      this.chartService.getTableNamesArrary(connectionId).subscribe((res: any) => {
        console.log(res, 'res ')
        let data = res['data'];
        this.tableNamesArray = data;

        console.log(this.tableNamesArray)
      })
    }
  }
  getTableNames() {
    this.chartService.getTableNamesArrary(this.connectionId).subscribe((res: any) => {
      console.log(res, 'res ')
      let data = res['data'];
      this.tableNamesArray = data;

      console.log(this.tableNamesArray)
    })
  }
  addTableJoint() {
    const jointFieldArr = this.myForm.get('tableJointsArr') as FormArray;
    jointFieldArr.push(this.createFieldSetArr());
  }
  removeTableJoint(index: number) {
    const jointFieldArr = this.myForm.get('tableJointsArr') as FormArray;
    jointFieldArr.removeAt(index);
  }
  get tableJointsArrControls() {
    return (this.myForm.get('tableJointsArr') as FormArray).controls;
  }


  join_id!: number;
  paramId!: number;
  table_join_id!: number;
  editObj: any;

  onEditJoin(eve: any) {
    let data = eve;
    console.log(data);
    this.defaultDialog.show();
    this.submitFlag = false;
    this.updateFlag = true;

    this.chartService.getJoinDetailsByJoinId(data.id).subscribe(
      (res: any) => {
        console.log(res);
        let data = res['data'];
        this.join_id = data.join_id;
        let obj = {
          "table_join_name": data.table_join_name,
          "primary_tableName": data.primary_table,
          "secondary_tableName": data.secondary_table,
          "primary_table_alias": data.primary_table_alias,
          "secondary_table_alias": data.secondary_table_alias,
          "connection_id": (data.connection_id),
          "join_type": data.join_type,
          "is_active": true,
          "join_parameters": data.parameter_details.map((field: any) => ({
            "primary_table_param": field.primary_table_param,
            "secondary_table_param": field.secondary_table_param,
            "operator": field.operator,
            "id": field.id,
            "table_join_id": field.table_join_id
          }))
        };
        const tableJointsArrControl = this.myForm.get('tableJointsArr') as FormArray;

        // Clear existing controls
        while (tableJointsArrControl.length !== 0) {
          tableJointsArrControl.removeAt(0);
        }

        // Add new controls based on obj.join_parameters
        obj.join_parameters.forEach((param: any) => {
          const control = this.createFieldSetArr(param);
          tableJointsArrControl.push(control);
        });
        console.log(obj);
        this.editObj = obj
        this.connectionId = obj.connection_id;
        this.onTableDropdown(obj.primary_tableName);
        this.onTableTwoDropdown(obj.secondary_tableName);
        this.getTableNames()
        // Patch the values to the form
        this.myForm.patchValue({
          table_join_name: obj.table_join_name || '',
          connection_id: obj.connection_id || '', // Add the correct value if available
          databaseName: '', // Add the correct value if available
          primaryTableName: obj.primary_tableName || '',
          secondaryTableName: obj.secondary_tableName || '',
          primary_table_alias: obj.primary_table_alias || '',
          secondary_table_alias: obj.secondary_table_alias || '',

          join_type: obj.join_type || '',
          tableJointsArr: obj.join_parameters.map((param: any) => ({
            primary_table_param: param.primary_table_param || '',
            secondary_table_param: param.secondary_table_param || '',
            operator: param.operator || '',
            id: param.id || '',
            table_join_id: param.table_join_id || ''
          }))
        });
      }
    );
  }

  updateTableJoin() {
    this.submitFlag = true;
    this.updateFlag = false;
    let formObj = this.myForm.value;
    this.loaderService.show();


    console.log(formObj)
    let obj = {
      "table_join_name": formObj.table_join_name || '',
      "connection_id": formObj.connection_id || '',
      "table_name": [
        formObj.primaryTableName || '', formObj.secondaryTableName || ''
      ],
      "primary_table": formObj.primaryTableName || '',
      "secondary_table": formObj.secondaryTableName || '',
      "primary_table_alias": formObj.primary_table_alias || '',
      "secondary_table_alias": formObj.secondary_table_alias || '',
      "join_type": formObj.join_type || '',
      "is_active": true,
      // "join_parameters": formObj.tableJointsArr
      "join_parameters": formObj.tableJointsArr.map((param: any) => ({
        primary_table_param: param.primary_table_param || '',
        secondary_table_param: param.secondary_table_param || '',
        operator: param.operator || '',
        id: param.id || null, // Use null if id doesn't exist
        table_join_id: param.table_join_id || formObj.join_id // Use null if table_join_id doesn't exist
      }))
    }

    console.log(this.editObj)
    console.log(obj)

    this.chartService.updateJoinDetailByJoinId(this.join_id, obj).subscribe(
      (res: any) => {
        console.log(res);
        this.loaderService.hide();
        //  this.showPopup(res.success, '30', res.message)
        this.popupService.showPopup({
          message: res.message,
          statusCode: res.status_code,
          status: res.success
        });

      },
      (err: any) => {
        this.loaderService.hide();

        // this.showPopup(false, '35px', "Something Went wrong, Please reload the page");
        const errorMessage = err.error && err.error.message ? err.error.message : err.message;

        this.popupService.showPopup({
          message: errorMessage,
          statusCode: err.status,
          status: false
        });
      }

    )
    this.defaultDialog.hide()
  }

  onTableDropdown(dropdownValue: any) {
    console.log(dropdownValue, this.connectionId)

    if (!dropdownValue) {
      return;
    }
    if (dropdownValue != undefined || dropdownValue != "" || dropdownValue != null) {
      this.chartService.getColumnNameBYTableName(dropdownValue, this.connectionId).subscribe((res: any) => {
        console.log(res);
        if (res) {
          let data = res['data']
          this.selectedTableFieldName = Object.keys(data)
        }

      })
      console.log(this.selectedTableFieldName);
    }

  }

  onTableTwoDropdown(dropdownValue: any) {
    console.log(dropdownValue, this.connectionId)

    if (!dropdownValue) {
      return;
    }
    if (dropdownValue != undefined || dropdownValue != "" || dropdownValue != null) {
      this.chartService.getColumnNameBYTableName(dropdownValue, this.connectionId).subscribe((res: any) => {
        console.log(res);
        if (res) {
          let data = res['data']
          // for(let )
          this.selectedSecondaryTableFieldNameArr = Object.keys(data)
        }

      })
      console.log(this.selectedSecondaryTableFieldNameArr);
    }

  }

  onDeleteJoin(eve: any) {
    console.log(eve);
    let data = eve;
    this.loaderService.show();

    this.chartService.deleteTableJoinDetial(data.id).subscribe(
      (res: any) => {
        console.log(res)
        this.loaderService.hide();
        //  this.showPopup(res.success, '30', res.message)
        this.popupService.showPopup({
          message: res.message,
          statusCode: res.status_code,
          status: res.success
        });

      },
      (err: any) => {
        this.loaderService.hide();
        // this.showPopup(err.success, '30', err.message)
        // this.showPopup(false, '35px', "Something Went wrong, Please reload the page");
        // console.log(err)
        const errorMessage = err.error && err.error.message ? err.error.message : err.message;
        this.popupService.showPopup({
          message: errorMessage,
          statusCode: err.status,
          status: false
        });
      }
    )
  }
  selectedTableFieldName: any = [];
  selectedSecondaryTableFieldNameArr: any = []

  onSubmit() {
    const formData = this.myForm.value;
    console.log(formData);
    this.loaderService.show();

    let obj = {
      "table_join_name": formData.table_join_name || '',
      "table_name": [formData.primaryTableName || '', formData.secondaryTableName || ''],
      "primary_table": formData.primaryTableName || '',
      "secondary_table": formData.secondaryTableName || '',
      "primary_table_alias": formData.primary_table_alias || '',
      "secondary_table_alias": formData.secondary_table_alias || '',
      "join_type": formData.join_type || '',
      "connection_id": +(formData.connection_id || 0),
      "is_active": true,
      "join_parameters": formData.tableJointsArr.map((field: any) => ({
        "primary_table_param": field.primary_table_param || '',
        "secondary_table_param": field.secondary_table_param || '',
        "operator": field.operator || ''
      }))

    };
    console.log(obj);

    this.chartService.createTableJoin(obj).subscribe(
      (res: any) => {
        this.loaderService.hide();
        //  this.showPopup(res.success, '30', res.message)

        this.defaultDialog.hide()
        this.popupService.showPopup({
          message: res.message,
          statusCode: res.status_code,
          status: res.success
        });
      },
      (err: any) => {
        this.loaderService.hide();
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

  public animation: AnimationModel = { enable: true, duration: 2000, delay: 0 };

  loaderFlag: boolean = false;
  closePopup(): void {
    const popup = document.getElementById('popup');
    const backdrop = document.getElementById('backdrop');
    // this.refreshPage()
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
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      const popupHeight = popup.offsetHeight;

      const topPosition = Math.max(0, scrollTop + windowHeight / 2 - popupHeight / 2);

      // Apply the calculated position to the popup
      popup.style.top = topPosition + 'px';
      popup.style.display = 'block';

      backdrop.style.display = 'block';
    }
  }




}