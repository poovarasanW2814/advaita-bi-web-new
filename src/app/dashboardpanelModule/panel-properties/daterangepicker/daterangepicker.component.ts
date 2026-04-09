import { formatDate } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild, inject} from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TabComponent } from '@syncfusion/ej2-angular-navigations';
import { ChartService } from 'src/app/core/services/chart.service';
import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';
import { SwitchModule } from '@syncfusion/ej2-angular-buttons';

@Component({
    selector: 'app-daterangepicker',
    templateUrl: './daterangepicker.component.html',
    styleUrls: ['./daterangepicker.component.scss'],
    imports: [FormsModule, ReactiveFormsModule, DropDownListModule, SwitchModule]
})

export class DaterangepickerComponent implements OnInit, OnChanges {
  @Input() getPanelObj: any;
  public headerText: any = [{ text: "General" }];
  @ViewChild('tabComponent') tab! : TabComponent


  @Output() sendBoxObj = new EventEmitter()
  boxIdCount: any = 0;
  boxTemplateForm!: FormGroup;

  tableNamesArray: any = [];
  selectedTableFieldName: any[] = [];
  measuresArray: any[] = []
  selectFieldName: string = '';
  fieldDetailsForm!: FormGroup;
  
  public formatData: string[] = [
    'yyyy-MM-dd',              // 2024-12-01 (MySQL DATE format)
    'yyyy-MM-dd HH:mm:ss',     // 2024-12-01 14:30:45 (MySQL DATETIME)
    'yyyy-MM-dd HH:mm',        // 2024-12-01 14:30 (DateTime without seconds)
    'dd-MM-yyyy',              // 01-12-2024 (European)
    'dd-MM-yyyy HH:mm:ss',     // 01-12-2024 14:30:45 (European DateTime)
    'MM/dd/yyyy',              // 12/01/2024 (US format)
    'MM/dd/yyyy HH:mm:ss',     // 12/01/2024 02:30:45 PM (US DateTime)
    'dd/MM/yyyy',              // 01/12/2024 (European with slashes)
    'dd-MMM-yyyy',             // 01-Dec-2024 (Short month)
    'dd-MMM-yyyy HH:mm',       // 01-Dec-2024 14:30 (Readable DateTime)
    'MMM dd, yyyy'             // Dec 01, 2024 (Readable)
  ];
  panelSeriesArray: any = [];
  public today: Date = new Date();
  public currentYear: number = this.today.getFullYear();
  public currentMonth: number = this.today.getMonth();
  public currentDay: number = this.today.getDate();
  public minDate: Object = new Date(this.currentYear, this.currentMonth, 15);
  public maxDate: Object =  new Date(this.currentYear, this.currentMonth+1, 15);


  private readonly fb = inject(FormBuilder);
  private readonly chartService = inject(ChartService);
  constructor() {
    this.boxTemplateForm = this.fb.group({
          tableName: ['', [Validators.required]],
          fieldName: ['', [Validators.required]],
          labelName: [''],
          // dateFormat: ['dd-MMM-yy', [Validators.required]],
          dateFormat: ['yyyy-MM-dd'],
          isInitialFilter : false,
          // minDate : [''],
          // maxDate : [''],
          minDays : [0],
          maxDays : [''],
  })


  }

  ngOnChanges(changes: SimpleChanges): void {
    let currentValue = changes['getPanelObj'].currentValue;
    if (currentValue != undefined || currentValue != null) {
      // this.tab.selectedItem = 0;
      if (this.tab) {
        this.tab.selectedItem = 0;
      }
      this.getPanelObj = currentValue;
      this.connection_id = this.getPanelObj.connection_id;
      // console.log('before assigning', this.getPanelObj)

      let panelsArrData: any = sessionStorage.getItem('createPanelSeriesArray');

      this.panelSeriesArray = panelsArrData

      if (this.panelSeriesArray) {
        this.panelSeriesArray = JSON.parse(this.panelSeriesArray);

        const matchingPanel = this.panelSeriesArray.find((panel: any) => panel.id === currentValue.id);

        if (matchingPanel) {
          this.getPanelObj = matchingPanel;

         this.getPanelObj = {
          ...matchingPanel,
          connection_id: this.connection_id, // Preserve the original connection_id
        };


          if (this.getPanelObj.content != undefined) {
           
            this.boxTemplateForm.patchValue({
              tableName: this.getPanelObj.content.tableName || '',
              fieldName: this.getPanelObj.content.fieldDetails?.fieldName || '',
              labelName: this.getPanelObj.content.fieldDetails?.labelName || '',
              dateFormat: this.getPanelObj.content.dateFormat || 'yyyy-MM-dd',
              "minDays" : 0,
              "maxDays" : this.getPanelObj.content.maxDays || 0,
              isInitialFilter: this.getPanelObj.content.isInitialFilter != null ? this.getPanelObj.content.isInitialFilter : false,

            });
          }

          this.chartService.getTableNamesArrary(this.connection_id).subscribe((res: any) => {
            let data = res['data'];
            this.tableNamesArray = data;
  
            // Fetch the field names based on the patched tableName value
            if (this.getPanelObj.content.tableName) {
              this.onTableDropdown(this.getPanelObj.content.tableName);
            }else{
               this.selectedTableFieldName = [];

            }
          });

        }

      }


    }
  }
  connection_id!: number;
  ngOnInit(): void {
  }

  onDateBlur(controlName: string) {
    const dateControl = this.boxTemplateForm.get(controlName);
    if (dateControl && dateControl.value) {
      // Convert the date value to your desired format
      const formattedDate = this.formatDate(dateControl.value);
      // console.log(formattedDate)
      dateControl.setValue(formattedDate);
    }
  }

  formatDate(date: string): string {
    // Your custom logic to format the date, you may use Angular's formatDate or any other library
    const formattedDate = formatDate(date, 'yyyy-MM-dd', 'en-US');
    return formattedDate;

  }
  onFirstDropdownChange(eve: any) {
    const dropdownValue = eve.target.value;
    const tableNameControl = this.boxTemplateForm.get('tableName');
    tableNameControl!.setValue(dropdownValue);

    const tableArray = this.tableNamesArray[dropdownValue];
    this.chartService.getColumnNameBYTableName(dropdownValue, this.connection_id).subscribe((res: any) => {
      // console.log(res);
      let data = res['data']
      // for(let )
      this.selectedTableFieldName = Object.keys(data)
    })

  }
  // onTableDropdown(dropdownValue: any) {
  //   // const dropdownValue = eve.target.value;
  //   const tableNameControl = this.boxTemplateForm.get('tableName');
  //   tableNameControl!.setValue(dropdownValue);
  //   if (!dropdownValue) {
  //     return;
  //   }

  //   if (dropdownValue != undefined || dropdownValue != "" || dropdownValue != null) {
  //     this.chartService.getColumnNameBYTableName(dropdownValue, this.connection_id).subscribe((res: any) => {
  //       console.log(res);
  //       if (res && res.data) { // Check if response and data are defined
  //         const data = res['data'];
  //         this.selectedTableFieldName = Object.keys(data);
  //       }

  //     })
  //   }else{
  //     this.selectedTableFieldName =  []

  //   }
  // }
  onTableDropdown(dropdownValue: any) {
    if (!dropdownValue) {
      this.selectedTableFieldName = []
      return;
    }
    // console.log(dropdownValue, 'firstDropdownValue');
    
    // Ensure that tableName is set in the form control
    this.boxTemplateForm.patchValue({
      tableName: dropdownValue || ''
    });
    
    if (dropdownValue != undefined && dropdownValue != "" && dropdownValue != null) {
      this.chartService.getColumnNameBYTableName(dropdownValue, this.connection_id).subscribe((res: any) => {
        // console.log(res);
        let data = res['data'];
        this.selectedTableFieldName = Object.keys(data);
  
        // Patch the fieldName if it's present in the selectedTableFieldName array
        const currentFieldName = this.getPanelObj.content.fieldDetails?.fieldName;
        if (currentFieldName && this.selectedTableFieldName.includes(currentFieldName)) {
          this.boxTemplateForm.patchValue({
            fieldName: currentFieldName || ''
          });
        }
      });
    } else {
      this.selectedTableFieldName = [];
    }
  }
  
  onSecondDropdownChange(eve: any) {
    // let dropdownValue = eve.target.value;
    let dropdownValue = eve;
    let labelNameControl = this.boxTemplateForm.get('labelName');

    labelNameControl!.setValue(dropdownValue);
    this.selectFieldName = dropdownValue
  }

  onBoxFormSubmit1() {

    let formObj = this.boxTemplateForm.value;

    if (this.boxTemplateForm.invalid) {
      console.log(this.boxTemplateForm.invalid)

      this.boxTemplateForm.markAllAsTouched();  // This will show validation messages for all invalid fields
      return;
    }
  
    // if(this.boxTemplateForm.valid){
      let id = this.getPanelObj.id;
   //   console.log(formObj)
      // let panelsArrData: any = localStorage.getItem('createPanelSeriesArray');
      let panelsArrData: any = sessionStorage.getItem('createPanelSeriesArray');
      this.panelSeriesArray = panelsArrData;
  
      let fieldDetails = {
        tableName: formObj.tableName,
        fieldName: formObj.fieldName,
        labelName: formObj.labelName,
      }

      if(this.boxTemplateForm.valid){
    //  console.log(fieldDetails)
       if (this.panelSeriesArray) {
      this.panelSeriesArray = JSON.parse(this.panelSeriesArray)
      // let object = this.panelSeriesArray.find((ele: any) => ele.id === id);
      // console.log(object)

      const matchingObjectIndex = Array.isArray(this.panelSeriesArray)
        ? this.panelSeriesArray.findIndex(obj => obj.id === id)
        : -1;

        console.log('this.connection_id', this.connection_id)
        //console.log('matchingObjectIndex', matchingObjectIndex)
      let boxApiObj = {
        "object_id": id,
        "object_setup": {
          "content": {
            "id": id + '_dateRangePicker_' + this.boxIdCount,
            "tableName": formObj.tableName || '',
            "title": formObj.title || '',
            "fieldDetails": fieldDetails,
            "dateFormat": formObj.dateFormat || 'yyyy-MM-dd',
            "minDays" : 0,
            "maxDays" : formObj.maxDays || 0,
            "isInitialFilter": formObj.isInitialFilter != null ? formObj.isInitialFilter : false,

            // "minDate" : formObj.minDate,
            // "maxDate" : formObj.maxDate
          },
          "panelType": "dateRangePicker"
        },
        "object_type": "dateRangePicker",
        "connection_id": this.connection_id
      }

      console.log('this.getPanelObj', this.getPanelObj)
      if (matchingObjectIndex !== -1) {
        // Update the existing object with the new data
        this.panelSeriesArray[matchingObjectIndex] = {
          header: formObj.title,
          "connection_id": this.connection_id,
          ...this.getPanelObj,
     

          content: {
            "id": id + '_dateRangePicker_' + this.boxIdCount,
            "tableName": formObj.tableName || '',
            "fieldDetails": fieldDetails,
            "dateFormat": formObj.dateFormat || 'yyyy-MM-dd',
            // "minDays" :formObj.minDays ? formObj.minDays : 0,
             "minDays" : 0,
            "maxDays" : formObj.maxDays || 0,
            "isInitialFilter": formObj.isInitialFilter != null ? formObj.isInitialFilter : false,

            // "minDate" : formObj.minDate,
            // "maxDate" : formObj.maxDate
          }
        };
      }

      console.log('this.panelSeriesArray', this.panelSeriesArray)
      // localStorage.setItem('createPanelSeriesArray', JSON.stringify(this.panelSeriesArray));
      sessionStorage.setItem('createPanelSeriesArray', JSON.stringify(this.panelSeriesArray));

      this.chartService.objectPivotCreate(boxApiObj).subscribe(
        (res: any) => {
        console.log(res);

        if(res.success === true){
          let resobj = res['data'];

          // let data = resobj.content;
         let data = resobj.content ? resobj.content : resobj.object_setup.content
;
          if (data == undefined || data != undefined) {
            console.log(data)
            let boxObj = {
              ...this.getPanelObj,
              // header: formObj.title,
              header : data.fieldDetails.labelName,
              content: {
                ...data,
              }
  
            }
            console.log('boxObj',boxObj )
            // this.sendBoxObj.emit({ boxObj: boxObj, message: res.success });
            this.sendBoxObj.emit({ boxObj: boxObj, resObj: { resSuccess: res.success, resMessage: res.message, statusCode : res.status_code  } });
  
          }
        }else{

          let boxObj = this.panelSeriesArray[matchingObjectIndex]
          console.log('boxObj',boxObj )

          // this.sendBoxObj.emit({ boxObj: boxObj, resObj: { resSuccess: false, resMessage: res.message } });

          this.sendBoxObj.emit({ boxObj: boxObj, resObj: { resSuccess: res.success, resMessage: res.message, statusCode : res.status_code } });
        
        }
      },
      (err : any) =>{
        let boxObj = this.panelSeriesArray[matchingObjectIndex]
        //  this.sendBoxObj.emit({ boxObj: boxObj, resObj: { resSuccess: false, resMessage: "Something Went wrong, Please reload the page"} });
        const errorMessage = err.error && err.error.message ? err.error.message : err.message;
         this.sendBoxObj.emit({ boxObj: boxObj, resObj: { resSuccess: false, resMessage: errorMessage, statusCode : err.status } });
      }
      )
       }
       
      }

  
    // }
  }

  onBoxFormSubmit() {
    let formObj = this.boxTemplateForm.value;
  
    // Step 1: Validate form
    if (this.boxTemplateForm.invalid) {
      console.log(this.boxTemplateForm.invalid);
      this.boxTemplateForm.markAllAsTouched();  // This will show validation messages for all invalid fields
      return false; // Return false if the form is invalid
    }
  
    // Step 2: Form is valid, proceed with processing
    let id = this.getPanelObj.id;
    let panelsArrData: any = sessionStorage.getItem('createPanelSeriesArray');
    this.panelSeriesArray = panelsArrData;
  
    let fieldDetails = {
      tableName: formObj.tableName || '',
      fieldName: formObj.fieldName || '',
      labelName: formObj.labelName || '',
    };
  
    // Step 3: Check if the form is valid
    if (this.boxTemplateForm.valid) {
      if (this.panelSeriesArray) {
        this.panelSeriesArray = JSON.parse(this.panelSeriesArray);
  
        const matchingObjectIndex = Array.isArray(this.panelSeriesArray)
          ? this.panelSeriesArray.findIndex(obj => obj.id === id)
          : -1;
  
        console.log('this.connection_id', this.connection_id);
        
        let boxApiObj = {
          "object_id": id,
          "object_setup": {
            "content": {
              "id": id + '_dateRangePicker_' + this.boxIdCount,
              "tableName": formObj.tableName || '',
              "title": formObj.title || '',
              "fieldDetails": fieldDetails,
              "dateFormat": formObj.dateFormat || 'yyyy-MM-dd',
              "minDays": 0,
              "maxDays": formObj.maxDays || 0,
              "isInitialFilter": formObj.isInitialFilter != null ? formObj.isInitialFilter : false,
            },
            "panelType": "dateRangePicker"
          },
          "object_type": "dateRangePicker",
          "connection_id": this.connection_id
        };
  
        console.log('this.getPanelObj', this.getPanelObj);
  
        // Step 4: Update panelSeriesArray if matching index found
        if (matchingObjectIndex !== -1) {
          this.panelSeriesArray[matchingObjectIndex] = {
            header: formObj.title,
            "connection_id": this.connection_id,
            ...this.getPanelObj,
            content: {
              "id": id + '_dateRangePicker_' + this.boxIdCount,
              "tableName": formObj.tableName || '',
              "fieldDetails": fieldDetails,
              "dateFormat": formObj.dateFormat || 'yyyy-MM-dd',
              "minDays": 0,
              "maxDays": formObj.maxDays || 0,
              "isInitialFilter": formObj.isInitialFilter != null ? formObj.isInitialFilter : false,
            }
          };
        }
  
        console.log('this.panelSeriesArray', this.panelSeriesArray);
        sessionStorage.setItem('createPanelSeriesArray', JSON.stringify(this.panelSeriesArray));
  
        // Step 5: Make API call
        this.chartService.objectPivotCreate(boxApiObj).subscribe(
          (res: any) => {
            console.log(res);
  
            if (res.success === true) {
              let resobj = res['data'];
              let data = resobj.content;
  
              if (data) {
                console.log(data);
                let boxObj = {
                  ...this.getPanelObj,
                  header: data.fieldDetails.labelName,
                  content: {
                    ...data,
                  }
                };
                console.log('boxObj', boxObj);
                this.sendBoxObj.emit({ boxObj: boxObj, resObj: { resSuccess: res.success, resMessage: res.message, statusCode: res.status_code } });
              }
            } else {
              let boxObj = this.panelSeriesArray[matchingObjectIndex];
              console.log('boxObj', boxObj);
              this.sendBoxObj.emit({ boxObj: boxObj, resObj: { resSuccess: res.success, resMessage: res.message, statusCode: res.status_code } });
            }
          },
          (err: any) => {
            let boxObj = this.panelSeriesArray[matchingObjectIndex];
            const errorMessage = err.error && err.error.message ? err.error.message : err.message;
            this.sendBoxObj.emit({ boxObj: boxObj, resObj: { resSuccess: false, resMessage: errorMessage, statusCode: err.status } });
          }
        );
      }
    }
    return true; // Return true if form is valid and successfully processed
  }
  

}
