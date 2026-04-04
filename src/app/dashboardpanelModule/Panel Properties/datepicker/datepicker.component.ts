import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TabComponent } from '@syncfusion/ej2-angular-navigations';
import { ChartService } from 'src/app/core/services/chart.service';

@Component({
  selector: 'app-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss'],
  standalone: false
})

export class DatepickerComponent implements OnInit, OnChanges {
  @Input() getPanelObj : any;
  public headerText: any = [{ text: "General" }];
  @ViewChild('tabComponent') tab! : TabComponent


  fieldObjArray : any = [];
  @Output() sendBoxObj = new EventEmitter()
  boxIdCount :any = 0; 
  boxTemplateForm!: FormGroup;

  tableNamesArray : any = [];
  selectedTableFieldName : any[] = [];
  ApiPanelSeriesArray : any[] = [];
  measuresArray : any[] = []
  selectFieldName : string = '';
  isUpdateOperation : boolean = false;
  fieldDetailsForm! : FormGroup;
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
  constructor(private fb : FormBuilder, private chartService : ChartService) { 
    this.boxTemplateForm = this.fb.group({
      tableName : ['', [Validators.required]],
      fieldName : ['', [Validators.required]],
      labelName : [''],
      dateFormat : ['yyyy-MM-dd']
      // dateFormat : ['dd-MMM-yy']
    })
   
  }

  

  ngOnChanges(changes: SimpleChanges): void {
    let currentValue = changes['getPanelObj'].currentValue;
    if (currentValue != undefined || currentValue != null) {
      // this.tab.selectedItem = 0;
      if (this.tab) {
        this.tab.selectedItem = 0;
      }
   //   let panelsArrData: any = localStorage.getItem('createPanelSeriesArray');
      let panelsArrData: any = sessionStorage.getItem('createPanelSeriesArray');
      this.panelSeriesArray = panelsArrData
  
      if(this.panelSeriesArray){
        this.panelSeriesArray = JSON.parse(this.panelSeriesArray);
        // console.log('panel changed obj', currentValue)
        this.getPanelObj = currentValue;
        console.log('before assigning', this.getPanelObj)

        this.connection_id = this.getPanelObj.connection_id;

        let matchingObject= this.panelSeriesArray.find((ele : any) => ele.id === this.getPanelObj.id);
        console.log(matchingObject)

        if(matchingObject){
          // this.getPanelObj = matchingObject;
          this.connection_id = this.getPanelObj.connection_id

          this.getPanelObj = {
            ...matchingObject,
            connection_id: this.connection_id, // Preserve the original connection_id
          };
          
          if (this.getPanelObj.content != undefined || this.getPanelObj) {
          // let filedEditName = this.getPanelObj.content.fieldDetails[0].fieldName
          this.boxTemplateForm.patchValue({
            tableName: this.getPanelObj.content.tableName || '',
            fieldName: this.getPanelObj.content.fieldName || '',
            labelName: this.getPanelObj.content.labelName || '',
            dateFormat: this.getPanelObj.content.dateFormat || 'yyyy-MM-dd'
          });
        }
        
        this.chartService.getTableNamesArrary(this.connection_id).subscribe((res: any) => {
          let data = res['data'];
          this.tableNamesArray = data;

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
  connection_id! : number ;
  ngOnInit(): void {

   
  }


  onFirstDropdownChange(eve : any){
    const dropdownValue = eve.target.value;
    const tableNameControl = this.boxTemplateForm.get('tableName');
    tableNameControl!.setValue(dropdownValue);


    console.log(dropdownValue)
    const tableArray =  this.tableNamesArray[dropdownValue];


    this.chartService.getColumnNameBYTableName(dropdownValue, this.connection_id).subscribe((res : any)=>{
      console.log(res);
      let data = res['data']
      // for(let )
      this.selectedTableFieldName =  Object.keys(data)
    })

  }


  onTableDropdown(dropdownValue: any) {
    if (!dropdownValue) {
      this.selectedTableFieldName = []
      return;
    }
  
    console.log(dropdownValue, 'firstDropdownValue');
    
    // Ensure that tableName is set in the form control
    this.boxTemplateForm.patchValue({
      tableName: dropdownValue || ''
    });
    
    if (dropdownValue != undefined && dropdownValue != "" && dropdownValue != null) {
      this.chartService.getColumnNameBYTableName(dropdownValue, this.connection_id).subscribe((res: any) => {
        console.log(res);
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
  onSecondDropdownChange(eve : any){
    // let dropdownValue = eve.target.value;
    let dropdownValue = eve;
    let labelNameControl = this.boxTemplateForm.get('labelName');

    labelNameControl!.setValue(dropdownValue);
    this.selectFieldName = dropdownValue
  }
  onMesureAdd(){
    const tableNameControl = this.boxTemplateForm.get('tableName');
    const fieldNameControl = this.boxTemplateForm.get('fieldName');
    const labelNameControl = this.boxTemplateForm.get('labelName');

    let obj = {
      tableName : tableNameControl?.value,
      fieldName : fieldNameControl?.value,
      labelName : labelNameControl?.value,
    }
    console.log(obj)
    console.log(labelNameControl?.value)

    this.measuresArray.push(obj)

  }

  onBoxFormSubmit(){


    let formObj = this.boxTemplateForm.value;
    let id = this.getPanelObj.id;

    if (this.boxTemplateForm.invalid) {
      console.log(this.boxTemplateForm.invalid);
      this.boxTemplateForm.markAllAsTouched();  // This will show validation messages for all invalid fields
      return false; // Return false if the form is invalid
    }
  

    if(this.boxTemplateForm.valid){
      console.log(formObj)

      // let panelsArrData: any = localStorage.getItem('createPanelSeriesArray');
      let panelsArrData: any = sessionStorage.getItem('createPanelSeriesArray');

      
      this.panelSeriesArray = panelsArrData;
  
      if(this.panelSeriesArray){
        this.panelSeriesArray = JSON.parse(this.panelSeriesArray)
        let object = this.panelSeriesArray.find((ele : any) => ele.id === id);
        console.log(object)
  
        
      const matchingObjectIndex = Array.isArray(this.panelSeriesArray)
      ? this.panelSeriesArray.findIndex(obj => obj.id === id)
      : -1;
      console.log(matchingObjectIndex)
      let boxApiObj =  {
        "object_id":id,
        "object_setup": {
          "content": {
            "id": id + '_datePicker_' + this.boxIdCount,
            "tableName":  formObj.tableName || '',
            "fieldName":  formObj.fieldName || '',
            "labelName":  formObj.labelName || '',
            // "fieldDetails": this.measuresArray,
            "dateFormat": formObj.dateFormat || 'yyyy-MM-dd',
          },
          "panelType": "datePicker"
        },
        "object_type": "datePicker",
        "connection_id": this.connection_id,
      }
  
       console.log(boxApiObj, 'datePicker')
       if (matchingObjectIndex !== -1) {
        // Update the existing object with the new data
        this.panelSeriesArray[matchingObjectIndex] = {
          ...this.getPanelObj,
          header : formObj.title,
          content : {
            "id": id + '_datePicker_' + this.boxIdCount,
            "tableName":  formObj.tableName || '',
            "fieldName":  formObj.fieldName || '',
            "labelName":  formObj.labelName || '',
            // "fieldDetails": this.measuresArray,
            "dateFormat": formObj.dateFormat || 'yyyy-MM-dd',
          }
        };
      }
      console.log(this.panelSeriesArray)
        // localStorage.setItem('createPanelSeriesArray', JSON.stringify(this.panelSeriesArray));
        sessionStorage.setItem('createPanelSeriesArray', JSON.stringify(this.panelSeriesArray));
        
    
       this.chartService.objectPivotCreate(boxApiObj).subscribe(
        (res : any) =>{
        // console.log(res);
    
        if(res.success){
          let resobj = res['data'];
  
          let data = resobj.content;
          if(data == undefined || data != undefined){
            console.log(data)
            let boxObj = { 
            ...this.getPanelObj,
            header : data.labelName,
            content : {
             ...data,   
            }
            
           }
           console.log(boxObj)
      
           this.sendBoxObj.emit({ boxObj: boxObj, resObj: { resSuccess: res.success, resMessage: res.message , statusCode : res.status_code} });
    
          }
        }else{
          let boxObj = this.panelSeriesArray[matchingObjectIndex]
          this.sendBoxObj.emit({ boxObj: boxObj, resObj: { resSuccess: false, resMessage: res.message, statusCode : res.status_code } });
        }
       },
       (err : any) =>{
        let boxObj = this.panelSeriesArray[matchingObjectIndex]
        //  this.sendBoxObj.emit({ boxObj: boxObj, resObj: { resSuccess: false, resMessage: "Something Went wrong, Please reload the page" } });
        const errorMessage = err.error && err.error.message ? err.error.message : err.message;
         this.sendBoxObj.emit({ boxObj: boxObj, resObj: { resSuccess: false, resMessage: errorMessage, statusCode : err.status } });
        }
       )
      }

    }

    return true;



  }



}
