import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild, inject} from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl, ValidationErrors, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TabComponent, TabModule } from '@syncfusion/ej2-angular-navigations';
import { DataManager } from '@syncfusion/ej2-data';
import { Draggable } from '@syncfusion/ej2/base';
import { ChartService } from 'src/app/core/services/chart.service';
import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';
import { NgIf, NgFor } from '@angular/common';
import { ColorPickerModule } from '@syncfusion/ej2-angular-inputs';
import { SwitchModule } from '@syncfusion/ej2-angular-buttons';

@Component({
    selector: 'app-property-box',
    templateUrl: './property-box.component.html',
    styleUrls: ['./property-box.component.scss'],
    imports: [TabModule, FormsModule, ReactiveFormsModule, DropDownListModule, NgIf, ColorPickerModule, SwitchModule, NgFor]
})

export class PropertyBoxComponent implements OnInit, OnChanges {
  @Input() getPanelObj : any;
  @Output() sendBoxObj = new EventEmitter()

  @ViewChild('tabComponent') tab! : TabComponent
  public headerText: any = [{ text: "General" },
  { text: "Measure" }, { text: "Condition" }, { text: "Raw Query" }];
  @ViewChild('selectedtablelist',{static: false})element:any;
  @ViewChild('expression',{static: false})element1: any;
  showUpdateButton: boolean = false;
  showAddButton: boolean = true;

  fieldObjArray : any = [];
  boxIdCount :any = 0; 
  boxTemplateForm!: FormGroup;
  rawQueryValue : string = "";
  tableNamesArray : any = [];
  selectedTableFieldName : any[] = [];
  ApiPanelSeriesArray : any[] = [];
  measuresArray : any[] = []
  selectFieldName : string = '';
  isUpdateOperation : boolean = false;
  fieldDetailsForm! : FormGroup;

  private readonly fb = inject(FormBuilder);
  private readonly chartService = inject(ChartService);
  constructor() {
    this.onFormInit()
  }

  onFormInit(){
    this.boxTemplateForm = this.fb.group({
      tableName : ['', [Validators.required]],
      fieldName : [''],
      labelName : [''],
      title : [''],
      rawQuery : [''],
      backgroundColor : ['#A1D6B2'],
      expression : [''],  
      conditions : [''],
      groupBy : [''],
      labelfontSize : [''],
      labelFontColor : [''],
      valueFontSize : [''],
      ValueFontColor : [''],
      boxIcon : [''],
      iconFontsize : [''],
      iconFontColor : [''],
      valueFormat : [''],
      enableClickFilter : [false]
    })
   
  }

   rawQueryOrExpressionRequired(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const rawQuery = control.get('rawQuery')?.value;
      const expression = control.get('expression')?.value;
      return (rawQuery || expression) ? null : { rawQueryOrExpressionRequired: true };
    };
  }

  iconFields: any = { text: 'PanelType', iconCss: 'Class', value: 'Class' };
  panelTypeDataArray: any[] = [
    { Class: 'select', PanelType: 'Select', Id: '1' },

    { Class: 'fas fa-signal', PanelType: 'Signal', Id: '2' },
    { Class: 'fas fa-dollar-sign', PanelType: 'Dollar', Id: '3' },
    { Class: 'fas fa-rupee-sign', PanelType: 'Rupee', Id: '4' },
    { Class: 'fas fa-comments', PanelType: 'Comments', Id: '5' },
    { Class: 'fas fa-user', PanelType: 'User', Id: '6' },
    { Class: 'fas fa-percentage', PanelType: 'Percentage', Id: '7' },
    { Class: 'fas fa-plus', PanelType: 'Plus', Id: '8' },
    { Class: 'fas fa-phone', PanelType: 'Phone', Id: '9' },
    { Class: 'fas fa-voicemail', PanelType: 'VoiceMail', Id: '10' },
    { Class: 'fas fa-check-circle', PanelType: 'Success', Id: '11' },
    { Class: 'fas fa-exclamation-triangle', PanelType: 'Warning', Id: '12' },
    { Class: 'fas fa-heart', PanelType: 'Favorites', Id: '13' },
    { Class: 'fas fa-clock', PanelType: 'Time', Id: '14' },
    { Class: 'fas fa-tachometer-alt', PanelType: 'Performance', Id: '15' },
    { Class: 'fas fa-shopping-cart', PanelType: 'Sales', Id: '16' },
    { Class: 'fas fa-eye', PanelType: 'Views', Id: '17' },
    { Class: 'fas fa-calendar', PanelType: 'Calendar', Id: '18' },
    { Class: 'fas fa-cogs', PanelType: 'Settings', Id: '19' },
    { Class: 'fas fa-bullseye', PanelType: 'Target', Id: '20' },
    { Class: 'fas fa-lightbulb', PanelType: 'Ideas', Id: '21' },
    { Class: 'fas fa-wallet', PanelType: 'Budget', Id: '22' },
    { Class: 'fas fa-chart-line', PanelType: 'Trend', Id: '23' },
    { Class: 'fas fa-users', PanelType: 'Team', Id: '24' },
    { Class: 'fas fa-envelope', PanelType: 'Email', Id: '25' },
    { Class: 'fas fa-database', PanelType: 'Database', Id: '26' },
    { Class: 'fas fa-sync', PanelType: 'Sync', Id: '27' },
    { Class: 'fas fa-trash', PanelType: 'Delete', Id: '28' },
    { Class: 'fas fa-edit', PanelType: 'Edit', Id: '29' },
    { Class: 'fas fa-download', PanelType: 'Download', Id: '30' },
    { Class: 'fas fa-upload', PanelType: 'Upload', Id: '31' },
    { Class: 'fas fa-filter', PanelType: 'Filter', Id: '32' },
    { Class: 'fas fa-search', PanelType: 'Search', Id: '33' },
    { Class: 'fas fa-info-circle', PanelType: 'Info', Id: '34' },
    { Class: 'fas fa-question-circle', PanelType: 'Help', Id: '35' },
    { Class: 'fas fa-star', PanelType: 'Star', Id: '36' },
    { Class: 'fas fa-bell', PanelType: 'Notifications', Id: '37' },
    { Class: 'fas fa-map-marker-alt', PanelType: 'Location', Id: '38' },
    { Class: 'fas fa-link', PanelType: 'Link', Id: '39' },


    { Class: 'fas fa-chart-bar', PanelType: 'Chart', Id: '40' },


    { Class: 'fas fa-arrow-up', PanelType: 'Growth', Id: '41' },
    { Class: 'fas fa-arrow-down', PanelType: 'Decline', Id: '42' },
    { Class: 'fas fa-check', PanelType: 'Success', Id: '43' },
    { Class: 'fas fa-exclamation', PanelType: 'Warning', Id: '44' },
    { Class: 'fas fa-times', PanelType: 'Error', Id: '45' },
    { Class: 'fas fa-dollar-sign', PanelType: 'Revenue', Id: '46' },
    { Class: 'fas fa-chart-line', PanelType: 'Line Graph', Id: '47' },
    { Class: 'fas fa-heartbeat', PanelType: 'Health', Id: '48' },
    { Class: 'fas fa-battery-full', PanelType: 'Energy', Id: '49' },
    { Class: 'fas fa-thumbs-up', PanelType: 'Approval', Id: '50' },
  ];


 formatOptions = [
  { label: 'None', value: 'none' },
  { label: 'Currency (USD)', value: 'currency-usd' },
  { label: 'Currency (INR)', value: 'currency-inr' },
  { label: 'Percent', value: 'percent' },
  { label: 'Decimal', value: 'decimal' },
  { label: 'Scientific', value: 'scientific' },
  { label: 'Custom (with commas)', value: 'custom' }
];


 onDrop(event: any) {
  const draggedItemText = event.dataTransfer.getData('text/plain');
  const textarea = event.target.closest('textarea');

  if (textarea) {
    textarea.value += draggedItemText;
  }
}

  ngOnChanges(changes: SimpleChanges): void {
    let currentValue = changes['getPanelObj'].currentValue;
    console.log(currentValue);
    
    if (currentValue != undefined || currentValue != null) {
  
      if (this.tab) {
        this.tab.selectedItem = 0;
      }
      let panelsArrData: any = sessionStorage.getItem('createPanelSeriesArray');
      // let panelsArrData: any = localStorage.getItem('createPanelSeriesArray');
      this.panelSeriesArray = panelsArrData

      this.selectedTableFieldName = []
      if (this.panelSeriesArray) {
        this.panelSeriesArray = JSON.parse(panelsArrData)!; // Non-null assertion here
  
        const matchingPanel = this.panelSeriesArray.find((panel : any) => panel.id === currentValue.id);
        console.log('matchingPanel', matchingPanel)

       console.log(this.getPanelObj.connection_id, matchingPanel.connection_id
        )

        if (matchingPanel) {
          // this.getPanelObj = matchingPanel;
          this.connection_id = this.getPanelObj.connection_id;

          this.getPanelObj = {
            ...matchingPanel,
            connection_id: this.connection_id, // Preserve the original connection_id
          };
    
          if (this.getPanelObj.content != undefined) {
            this.boxTemplateForm.patchValue({
              backgroundColor: this.getPanelObj.content.backgroundColor || '',
              conditions: this.getPanelObj.content.conditions || '',
              title: this.getPanelObj.header || '',
              groupBy: this.getPanelObj.content.groupBy || [],
              tableName: this.getPanelObj.content.tableName || '',
              rawQuery: this.getPanelObj.content.rawQuery || '',
              boxIcon : this.getPanelObj.content.boxIcon || '',
              iconFontsize : this.getPanelObj.content.iconFontsize || '',
              iconFontColor : this.getPanelObj.content.iconFontColor || '',
              enableClickFilter : this.getPanelObj.content?.enableClickFilter != null ? this.getPanelObj.content.enableClickFilter : false
            });
  
            this.rawQueryValue = this.getPanelObj.content.rawQuery;
            this.conditionValue = this.getPanelObj.content.conditions;
            this.measuresArray = this.getPanelObj.content.fieldDetails || [];
            this.connection_id = this.getPanelObj.connection_id;


          }else{
            this.onFormInit()
            this.measuresArray =  [];
            this.selectedTableFieldName = []
          }

           this.chartService.getTableNamesArrary(this.connection_id).subscribe((res: any) => {
            let data = res['data'];
            this.tableNamesArray = data;

            console.log('tableres', res)
  
            if (this.getPanelObj.content.tableName) {
              this.onTableDropdown(this.getPanelObj.content.tableName);
            }
           });

        }
      } else {
      }
    }
  }

  loadData(connection_id : any): void {
    this.isLoadingData = true;
    this.chartService.getTableNamesArrary(connection_id).subscribe(
      (res: any) => {
        this.tableNamesArray = res['data'];
        this.isLoadingData = false;
      },
      (error) => {
        console.error('Error loading data:', error);
        this.apiError = true;
        this.isLoadingData = false;
      }
    );
  }
  
  isLoadingData: boolean = false;
  apiError: boolean = false;
  
  panelSeriesArray : any = []
  private getPanelArrayDataFromLocalStorage() {
    let panelData = sessionStorage.getItem('panelSeriesArray');
    // let panelData = localStorage.getItem('panelSeriesArray');
    if (panelData !== null) {
      this.panelSeriesArray = JSON.parse(panelData);
 } else {
      this.panelSeriesArray = [];
    }
  }
  connection_id!: number;
  ngOnInit(): void {
    let parseApiPanelSeriesArray =  sessionStorage.getItem('ApiPanelSeriesArray')
    // let parseApiPanelSeriesArray =  localStorage.getItem('ApiPanelSeriesArray')
    if(parseApiPanelSeriesArray){
      this.ApiPanelSeriesArray = JSON.parse(parseApiPanelSeriesArray)
    }
    
   
  }
  selecting(eve : any){
  }
  selectedTableName! : string;
  onTableDropownChange(){
  }

  dataManager: DataManager =  new DataManager;

  onTableDropdown(dropdownValue: any) {

    console.log('dropdownValue', dropdownValue)

    if (!dropdownValue) {
      this.selectedTableFieldName = []
      return;
    }
    const tableNameControl = this.boxTemplateForm.get('tableName');
    tableNameControl!.setValue(dropdownValue);
  
    if (dropdownValue != undefined || dropdownValue != "" || dropdownValue != null) {
      this.chartService.getColumnNameBYTableName(dropdownValue, this.connection_id).subscribe((res: any) => {
       console.log(res);
        if (res) {
          let data : any = res['data'];
          let objdata : any =  Object.keys(data)

          this.selectedTableFieldName = Object.keys(data);
          this.dataManager = objdata
          console.log(' this.dataManager',  this.dataManager)
       
        }
      });
    } else {
      this.selectedTableFieldName = []; // Reset the field name array if no table name is selected
    }
  }
  

  onSecondDropdownChange(eve : any){
    let dropdownValue = eve;

    console.log('eve', eve)
    let labelNameControl = this.boxTemplateForm.get('labelName');

    labelNameControl!.setValue(dropdownValue);
    this.selectFieldName = dropdownValue
  }

  addToTextareaOld(name: string) {
    this.rawQueryValue = (this.rawQueryValue ?? '') + name + ' ';

  }
  addToTextarea(name: string) {
    // const operator = name + ' ';
    const operator = ' ' + name + ' ';
   
    const currentText = this.rawQueryValue;
  
    if (operator) {
      // Insert the operator at the cursor position
      const beforeCursor = currentText.slice(0, this.cursorPosition);
      const afterCursor = currentText.slice(this.cursorPosition);
      this.rawQueryValue = `${beforeCursor}${operator}${afterCursor}`;
  
      // Update the cursor position to be after the newly inserted operator
      this.cursorPosition += operator.length;
  
      // Optionally, restore focus to the textarea
      const textarea = document.getElementById("pop_chart_expression") as HTMLTextAreaElement;
      if (textarea) {
        textarea.focus();
        textarea.setSelectionRange(this.cursorPosition, this.cursorPosition);
      }
    }
  }

  
  addToConditionTextareaOld(name: string) {
    this.conditionValue = (this.conditionValue ?? '') + name + ' ';

  }
  addToConditionTextarea(name: string) {
    const currentText = this.conditionValue || '';
    
    // Split the text into parts before and after the cursor
    const beforeCursor = currentText.slice(0, this.cursorConditionPosition);
    const afterCursor = currentText.slice(this.cursorConditionPosition);
    
    // Insert the new value (name) at the cursor position
    // this.conditionValue = `${beforeCursor}${name} ${afterCursor}`;
    // // Update the cursor position to be after the newly inserted name
    // this.cursorConditionPosition += name.length + 1; // +1 to account for the space

    this.conditionValue = `${beforeCursor} ${name} ${afterCursor}`;
  
    // Update the cursor position to be after the newly inserted name (including spaces)
    this.cursorConditionPosition += name.length + 2; // +2 to account for the spaces before and after
 
    // Optionally, restore focus to the textarea and set the cursor position
    const textarea = document.getElementById("pop_chart_condition") as HTMLTextAreaElement;
    if (textarea) {
      textarea.focus();
      textarea.setSelectionRange(this.cursorConditionPosition, this.cursorConditionPosition);
    }
  }
  
  
  onMesureAdd(){
    const tableNameControl = this.boxTemplateForm.get('tableName');
    const fieldNameControl = this.boxTemplateForm.get('fieldName');
    const labelNameControl = this.boxTemplateForm.get('labelName');
    const expressionControl = this.boxTemplateForm.get('expression');
    const labelfontSizeControl = this.boxTemplateForm.get('labelfontSize');
    const labelFontColorControl = this.boxTemplateForm.get('labelFontColor');
    const valueFontSizeControl = this.boxTemplateForm.get('valueFontSize');
    const ValueFontColorControl = this.boxTemplateForm.get('ValueFontColor');
    const ValueFormatControl = this.boxTemplateForm.get('valueFormat');

    let obj = {
      tableName : tableNameControl?.value,
      fieldName : fieldNameControl?.value,
      labelName : labelNameControl?.value,
      expression : expressionControl?.value,
      labelfontSize : labelfontSizeControl?.value  ? labelfontSizeControl?.value + 'px' : '12px' ,
      labelFontColor : labelFontColorControl?.value,
      valueFontSize : valueFontSizeControl?.value  ?  valueFontSizeControl?.value + 'px'  : '18px' ,
      ValueFontColor : ValueFontColorControl?.value,
      valueFormat : ValueFormatControl?.value,
    }

    this.measuresArray.push(obj)

    const fieldsToReset = [
      'fieldName',
      'labelName',
      'expression',
      'valueFormat',
      'labelfontSize',
      'labelFontColor',
      'valueFontSize',
      'ValueFontColor',
     
    ];

    fieldsToReset.forEach(field => {
      if (this.boxTemplateForm.controls[field]) {
        this.boxTemplateForm.get(field)!.reset();
      }
    });

  }
  editObjId : any
  onEditColumn(obj : any, id : any){
    let formObj = this.boxTemplateForm;

    this.editObjId = id;
    
   console.log(formObj.value)
    this.showUpdateButton = true;
    this.showAddButton = false;

    const fontSizeNumeric = parseInt(obj.labelfontSize);
    const ValuefontSizeNumeric = parseInt(obj.valueFontSize);
    formObj.patchValue({
        tableName: obj.tableName || '',
        fieldName: obj.fieldName || '',
        labelName: obj.labelName || '',
        expression: obj.expression || '',
        labelfontSize: fontSizeNumeric || '', // Set only the numeric part
        labelFontColor: obj.labelFontColor || '',
        valueFontSize: ValuefontSizeNumeric || '',
        
        ValueFontColor: obj.ValueFontColor || '',
        valueFormat : obj.valueFormat || '',
    });
  }
  onUpdateColumn(){

    const updatedObj = {
      tableName: this.boxTemplateForm.value.tableName,
      fieldName: this.boxTemplateForm.value.fieldName,
      labelName: this.boxTemplateForm.value.labelName,
      expression: this.boxTemplateForm.value.expression,
      labelfontSize : this.boxTemplateForm.value.labelfontSize  ?  this.boxTemplateForm.value.labelfontSize + 'px' : '12px',
      labelFontColor : this.boxTemplateForm.value.labelFontColor,
      valueFontSize : this.boxTemplateForm.value.valueFontSize  ? this.boxTemplateForm.value.valueFontSize + 'px' : '18px',
      ValueFontColor : this.boxTemplateForm.value.ValueFontColor,
      valueFormat : this.boxTemplateForm.value.valueFormat,
      
    };
  
    console.log('updatedObj', updatedObj)
    this.measuresArray[this.editObjId] = updatedObj;
    this.showUpdateButton = false;
    this.showAddButton = true;
    const fieldsToReset = [
      'fieldName',
      'labelName',
      'expression',
      'valueFormat',
      'labelfontSize',
      'labelFontColor',
      'valueFontSize',
      'ValueFontColor',
     
    ];

    fieldsToReset.forEach(field => {
      if (this.boxTemplateForm.controls[field]) {
        this.boxTemplateForm.get(field)!.reset();
      }
    });
  }
  onDeleteColumn(id : any){

    this.measuresArray.splice(id, 1)

  }
  onClearConditions(){

     this.conditionValue = "";
    //  this.boxTemplateForm.get('conditions')!.reset();
     this.boxTemplateForm.get('conditions')!.setValue("");
   }
   
  onBoxFormSubmit(){
    let formObj = this.boxTemplateForm.value;
    let id = this.getPanelObj.id;
    let panelsArrData: any = sessionStorage.getItem('createPanelSeriesArray');
    // let panelsArrData: any = localStorage.getItem('createPanelSeriesArray');
    this.panelSeriesArray = panelsArrData;

    if (this.boxTemplateForm.invalid) {
      console.log(this.boxTemplateForm.invalid);
      this.boxTemplateForm.markAllAsTouched();  // This will show validation messages for all invalid fields
      return false; // Return false if the form is invalid
    }


    if(this.panelSeriesArray != null){
      this.panelSeriesArray = JSON.parse(this.panelSeriesArray)
      let object = this.panelSeriesArray.find((ele : any) => ele.id === id);

    const matchingObjectIndex = Array.isArray(this.panelSeriesArray)
    ? this.panelSeriesArray.findIndex(obj => obj.id === id)
    : -1;

      
    let boxApiObj =  {
      "object_id":id,
      "object_setup": {
        "content": {
          "id": id + '_box_' + this.boxIdCount,
          "dataSource": [],
          "tableName":  formObj.tableName,         
          "rawQuery" : formObj.rawQuery || '',
          "conditions" : formObj.conditions || '',
          "groupBy" : formObj.orderBy || [],
          "fieldDetails": this.measuresArray,
          boxIcon : formObj.boxIcon ,
          iconFontsize : formObj.iconFontsize ,
          iconFontColor : formObj.iconFontColor,
          backgroundColor : formObj.backgroundColor,
          enableClickFilter : formObj.enableClickFilter
        }
      },
      "connection_id": this.connection_id,
      "object_type": "box"
    }

     let createObj = {
      ...this.getPanelObj,
      header : formObj.title,
      content : {
        "id": id + '_box_' + this.boxIdCount,
        "dataSource": [],
        "tableName":  formObj.tableName,
        "conditions" : formObj.conditions || '',
        "groupBy" : formObj.orderBy || [],
        "rawQuery" : this.getPanelObj.content.rawQuery || '',
        "fieldDetails": this.measuresArray,
        'boxIcon' : formObj.boxIcon,
        'iconFontsize' : formObj.iconFontsize ,
        iconFontColor : formObj.iconFontColor ,
        backgroundColor : formObj.backgroundColor,
        enableClickFilter : formObj.enableClickFilter
      }
    };
    

    if (matchingObjectIndex !== -1) {
      this.panelSeriesArray[matchingObjectIndex] = {
        ...this.getPanelObj,
        header : formObj.title,
        content : {
          "id": id + '_box_' + this.boxIdCount,
          "dataSource": [],
          "tableName":  formObj.tableName,
          "conditions" : formObj.conditions || '',
          "groupBy" : formObj.orderBy || [],
          "rawQuery" : formObj.rawQuery || '',
          "fieldDetails": this.measuresArray,
          'boxIcon' : formObj.boxIcon,
          'iconFontsize' : formObj.iconFontsize ,
          iconFontColor : formObj.iconFontColor,
          backgroundColor : formObj.backgroundColor,
          enableClickFilter : formObj.enableClickFilter
        }
      };
    }
    sessionStorage.setItem('createPanelSeriesArray', JSON.stringify(this.panelSeriesArray));
    // localStorage.setItem('createPanelSeriesArray', JSON.stringify(this.panelSeriesArray));
  
    this.chartService.objectPivotCreate(boxApiObj).subscribe(
      (res : any) =>{

      if(res.success === true){
        let resobj = res['data'];
        let data = resobj.object_setup.content;

        console.log('res', res)
        
        let processDataSource1 = (dataSource: any[], rawQuery: string, fieldDetails : any[]): any[] => {
          
        console.log('res', dataSource, fieldDetails)
         
          if (rawQuery && rawQuery.trim() !== "") {
           let modifiedData = dataSource.map((ele: any) => {
              const key = Object.keys(ele)[0];
              let value = ele[key];
              console.log('key', key,'value', value )
              
              fieldDetails.forEach((obj: any) => {
                console.log('obj.fieldName', obj.fieldName,'ele.index', ele.index )
                if (obj.fieldName == ele.index) {

                  value = this.applyFormat(value, obj.valueFormat);
                console.log('obj.fieldName in condition', obj.fieldName,'ele.index', ele.index )

                }
              });
              console.log('value in if condition', value)
        
              const processedItem: any = {
                "0": value,  // Apply formatted value here
                "index": ele.index,
              };
        
              return processedItem;
            });

            console.log('modifiedData in if condition', modifiedData)
        
            dataSource =  modifiedData;
            return dataSource;
           } else {

            let modifiedData = dataSource.map((ele: any) => {
              const key = Object.keys(ele)[0];
              let value = ele[key];
              fieldDetails.forEach((obj: any) => {
                if (obj.fieldName.toLowerCase() == ele.index.toLowerCase()) {
                  value = this.applyFormat(value, obj.valueFormat);
                }

                // if (obj.fieldName && ele.index && obj.fieldName.trim().toLowerCase() === ele.index.trim().toLowerCase()) {
                //   value = this.applyFormat(value, obj.valueFormat);
                // }
              });


            console.log('value in else condition', value)

        
              const processedItem: any = {
                "0": value,  // Apply formatted value here
                "index": ele.index,
              };
        
              return processedItem;
            });

            console.log('modifiedData in else condition', modifiedData)

            dataSource =  modifiedData;

            return dataSource;
          }

          
        }

        let processDataSource = (dataSource: any[], rawQuery: string, fieldDetails: any[]): any[] => {
          console.log('res', dataSource, fieldDetails);

          let modifiedData = dataSource.map((ele: any) => {
            const key = Object.keys(ele)[0];
            let value = ele[key];

            fieldDetails.forEach((obj: any) => {
                console.log('obj.fieldName', obj.fieldName, 'ele.index', ele.index);

                // Add null/undefined checks
                if (obj.fieldName && ele.index && obj.fieldName.toLowerCase() === ele.index.toLowerCase()) {
                    value = this.applyFormat(value, obj.valueFormat);
                }
            });

            console.log('value in if condition', value);

            const processedItem: any = {
                "0": value, // Apply formatted value here
                "index": ele.index || null, // Handle missing index
            };

            return processedItem;
        });

        console.log('modifiedData in if condition', modifiedData);

        return modifiedData;
      
          // if (rawQuery && rawQuery.trim() !== "") {
          //     let modifiedData = dataSource.map((ele: any) => {
          //         const key = Object.keys(ele)[0];
          //         let value = ele[key];
      
          //         fieldDetails.forEach((obj: any) => {
          //             console.log('obj.fieldName', obj.fieldName, 'ele.index', ele.index);
      
          //             // Add null/undefined checks
          //             if (obj.fieldName && ele.index && obj.fieldName.toLowerCase() === ele.index.toLowerCase()) {
          //                 value = this.applyFormat(value, obj.valueFormat);
          //             }
          //         });
      
          //         console.log('value in if condition', value);
      
          //         const processedItem: any = {
          //             "0": value, // Apply formatted value here
          //             "index": ele.index || null, // Handle missing index
          //         };
      
          //         return processedItem;
          //     });
      
          //     console.log('modifiedData in if condition', modifiedData);
      
          //     return modifiedData;
          // } else {
          //     let modifiedData = dataSource.map((ele: any) => {
          //         const key = Object.keys(ele)[0];
          //         let value = ele[key];
      
          //         fieldDetails.forEach((obj: any) => {
          //             // Add null/undefined checks
          //             if (obj.fieldName && ele.index && obj.fieldName.toLowerCase() === ele.index.toLowerCase()) {
          //                 value = this.applyFormat(value, obj.valueFormat);
          //             }
          //         });
      
          //         console.log('value in else condition', value);
      
          //         const processedItem: any = {
          //             "0": value, // Apply formatted value here
          //             "index": ele.index || null, // Handle missing index
          //         };
      
          //         return processedItem;
          //     });
      
          //     console.log('modifiedData in else condition', modifiedData);
      
          //     return modifiedData;
          // }
      };
      

        console.log('processDataSource', data.dataSource, data.rawQuery, data.fieldDetails)
        let boxObj = { 
          ...this.getPanelObj,
          header: formObj.title,
          content: {
            backgroundColor: formObj.backgroundColor,
            ...data,
           // dataSource: processDataSource(data.dataSource, data.rawQuery, data.fieldDetails),
          }
        }

        // Modify the dataSource based on the format
        boxObj.content.dataSource = boxObj.content.dataSource.map((item : any) => {
          let updatedItem = { ...item }; // Clone the object to prevent mutation

          // Iterate through fieldDetails and match fieldName with keys in dataSource object
          boxObj.content.fieldDetails.forEach((field : any) => {
              let key = field.fieldName; // The field name from fieldDetails

              if (updatedItem.hasOwnProperty(key)) { 
                  // If formatting is defined, apply it; otherwise, keep the original value
                  updatedItem[key] = field.valueFormat 
                      ? this.applyFormat(updatedItem[key], field.valueFormat) 
                      : updatedItem[key];
              }
          });

          return updatedItem;
        });

        // Log the updated object for verification
        console.log(boxObj);

       this.sendBoxObj.emit({ boxObj: boxObj, resObj: { resSuccess: res.success, resMessage: res.message ,statusCode: res.status_code} });
        console.log('boxObj', boxObj )

    
       this.boxTemplateForm.reset()
      }else{
        let boxObj = this.panelSeriesArray[matchingObjectIndex]
        console.log('resMessage', res.message,  res.status_code )
        this.sendBoxObj.emit({ boxObj: boxObj, resObj: { resSuccess: res.success, resMessage: res.message ,statusCode: res.status_code} });

      }
     },
     (err : any) =>{
      let boxObj = this.panelSeriesArray[matchingObjectIndex];
      const errorMessage = err.error && err.error.message ? err.error.message : err.message;
      console.log('resMessage', errorMessage , err.status)
      this.sendBoxObj.emit({ boxObj: boxObj, resObj: { resSuccess: false, resMessage: errorMessage,  statusCode: err.status } });
     }
     )

    }

    return true

  }

  applyFormat(value: any, format: any) {
    console.log('format applyFormat', value, format)
    switch (format) {
      case 'currency-usd':
        value = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
        break;
      case 'currency-inr':
        value = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value);
        break;
       case 'percent':
          // if (value > 1) {
          //     // Value is already a percentage
          //     value = `${value}%`;
          //     console.log('value in if', value)

          // } else {
          //     // Value is a decimal, format it as percentage
          //     value = new Intl.NumberFormat('en-US', { style: 'percent', maximumFractionDigits: 2 }).format(value);
          //     console.log('value in else', value)

          // }

         value = `${parseFloat(value).toString()}%`;

          break;
      
      case 'decimal':
        value = new Intl.NumberFormat('en-US', { style: 'decimal', maximumFractionDigits: 2 }).format(value);
        break;
      case 'scientific':
        value = value.toExponential(2);
        break;
      case 'custom':
        value = value.toLocaleString('en-US');
        break;
      case 'round-2':
        value = (Math.round(value * 100) / 100).toFixed(2);
        break;
      case 'round-3':
        value = (Math.round(value * 1000) / 1000).toFixed(3);
        break;
      default:
        value = value;
    }
    return value;
  }
  

  onUpdateBtn(){
    let formObj = this.boxTemplateForm.value;
    let boxObj = { 
      ...this.getPanelObj,
      header : formObj.title,
      content : {
       id : this.getPanelObj.content.id,
       dataSource : [],
       tableName : formObj.tableName,
       conditions : formObj.conditions,
       groupBy : formObj.orderBy ,
       backgroundColor : formObj.backgroundColor,
       fieldDetails : this.measuresArray
       
      }
     }

     this.sendBoxObj.emit(boxObj)

  }
  onformClick(){
    let formObj = this.boxTemplateForm.value;
  }
  conditionValue : any;
  sqlValue : any;

  cursorConditionPosition: number = 0;
  cursorPosition: number = 0;

  addTextOld(event: any) {
    const currentText = this.conditionValue;
    const selectedValue = this.boxTemplateForm.get('tableName')!.value;

    const operator = event.target.value;
  
    if (selectedValue) {
      const updatedText = `${currentText}  ${operator}`;
      this.conditionValue = updatedText;
    }
  }

  addSqlQueryTextWithoutText(event: any) {
    const operator = event.target.value || ""; // Replace "YourValue" with a default value if necessary
    const currentText = this.conditionValue;
  
    if (operator) {
      // Insert the operator at the cursor position
      const beforeCursor = currentText.slice(0, this.cursorConditionPosition);
      const afterCursor = currentText.slice(this.cursorConditionPosition);
      this.conditionValue = `${beforeCursor}${operator}${afterCursor}`;
  
      // Update the cursor position to be after the newly inserted operator
      this.cursorConditionPosition += operator.length;
  
      // Optionally, restore focus to the textarea
      const textarea = document.getElementById("pop_chart_condition") as HTMLTextAreaElement;
      if (textarea) {
        textarea.focus();
        textarea.setSelectionRange(this.cursorConditionPosition, this.cursorConditionPosition);
      }
    }
  }

  addSqlQueryText(event: any) {
    const operator = event.target.value || ""; // Replace "YourValue" with a default value if necessary
    const currentText = this.conditionValue;
  
    if (operator) {
      // Add space before and after the operator
      const operatorWithSpaces = ` ${operator} `;
  
      // Insert the operator (with spaces) at the cursor position
      const beforeCursor = currentText.slice(0, this.cursorConditionPosition);
      const afterCursor = currentText.slice(this.cursorConditionPosition);
      this.conditionValue = `${beforeCursor}${operatorWithSpaces}${afterCursor}`;
  
      // Update the cursor position to be after the newly inserted operator (including spaces)
      this.cursorConditionPosition += operatorWithSpaces.length;
  
      // Optionally, restore focus to the textarea and set the cursor position
      const textarea = document.getElementById("pop_chart_condition") as HTMLTextAreaElement;
      if (textarea) {
        textarea.focus();
        textarea.setSelectionRange(this.cursorConditionPosition, this.cursorConditionPosition);
      }
    }
  }
  

  addRawQueryTextOld(event: any) {
    const currentText = this.rawQueryValue;
    const selectedValue = this.boxTemplateForm.get('tableName')!.value;

    const operator = event.target.value;
  
    if (operator) {
      const updatedText = `${currentText} ${operator} `;
      this.rawQueryValue = updatedText;
    }
  }


  addRawQueryTextWithouSpace(event: any) {
    const operator = event.target.value; // Value from the button
    const currentText = this.rawQueryValue;
  
    if (operator) {

      
      // Insert the operator at the cursor position
      const beforeCursor = currentText.slice(0, this.cursorPosition);
      const afterCursor = currentText.slice(this.cursorPosition);
      this.rawQueryValue = `${beforeCursor}${operator}${afterCursor}`;
  
      // Update the cursor position to be after the newly inserted operator
      this.cursorPosition += operator.length;
  
      // Optionally, restore focus to the textarea
      const textarea = document.getElementById("pop_chart_expression") as HTMLTextAreaElement;
      if (textarea) {
        textarea.focus();
        textarea.setSelectionRange(this.cursorPosition, this.cursorPosition);
      }
    }
  }
  
  addRawQueryTextWithoutSpace(event: any) {
    const operator = event.target.value; // Value from the button
    const currentText = this.rawQueryValue;
  
    if (operator) {
      // Add space before and after the operator
      const operatorWithSpaces = ` ${operator} `;
  
      // Insert the operator (with spaces) at the cursor position
      const beforeCursor = currentText.slice(0, this.cursorPosition);
      const afterCursor = currentText.slice(this.cursorPosition);
      this.rawQueryValue = `${beforeCursor}${operatorWithSpaces}${afterCursor}`;
  
      // Update the cursor position to be after the newly inserted operator (including spaces)
      this.cursorPosition += operatorWithSpaces.length;
  
      // Optionally, restore focus to the textarea and set the cursor position
      const textarea = document.getElementById("pop_chart_expression") as HTMLTextAreaElement;
      if (textarea) {
        textarea.focus();
        textarea.setSelectionRange(this.cursorPosition, this.cursorPosition);
      }
    }
  }
  
  addRawQueryText(event: any) {
    const operator = event.target.value; // Value from the button
    const currentText = this.rawQueryValue;
  
    if (operator) {
      // Add space before and after the operator
      const operatorWithSpaces = ` ${operator} `;
  
      // Insert the operator (with spaces) at the cursor position
      const beforeCursor = currentText.slice(0, this.cursorPosition);
      const afterCursor = currentText.slice(this.cursorPosition);
      this.rawQueryValue = `${beforeCursor}${operatorWithSpaces}${afterCursor}`;
  
      // Update the cursor position to be after the newly inserted operator (including spaces)
      this.cursorPosition += operatorWithSpaces.length;
  
      // Optionally, restore focus to the textarea and set the cursor position
      const textarea = document.getElementById("pop_chart_expression") as HTMLTextAreaElement;
      if (textarea) {
        textarea.focus();
        textarea.setSelectionRange(this.cursorPosition, this.cursorPosition);
      }
    }
  }
  


  onClearRawQuery(){
    this.rawQueryValue = "";
    // this.boxTemplateForm.get('rawQuery')!.reset();
     this.boxTemplateForm.get('rawQuery')!.setValue("");
   }


  addSqlQueryTexOldt(event: any) {
    const currentText = this.conditionValue;
    const selectedValue = this.boxTemplateForm.get('tableName')!.value;

    const operator = event.target.value;

    if (operator) {
     
      const updatedText = `${currentText}  ${operator}`;
      this.conditionValue = updatedText;
    }
  }

  


  updateCursorPositionCondition(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;
    this.cursorConditionPosition = textarea.selectionStart;
  }
  updateCursorPosition(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;
    this.cursorPosition = textarea.selectionStart;
  }

  ngAfterViewInit() {
    if(this.element){
      let draggable: Draggable =
      new Draggable(this.element.nativeElement,{ clone: false });

    }
 
}

  
  copyMessage: string = '';
  copyDimensionMessage: string = '';

  onCopyRawQuery() {
    const queryText = this.rawQueryValue || '';

    if (queryText.trim() !== '') {
      navigator.clipboard.writeText(queryText).then(() => {
        this.copyMessage = "Query copied!";
        setTimeout(() => this.copyMessage = '', 2000);
      }).catch(err => {
        console.error("Failed to copy: ", err);
        this.copyMessage = "Failed to copy!";
        setTimeout(() => this.copyMessage = '', 2000);
      });
    } else {
      this.copyMessage = "No query to copy!";
      setTimeout(() => this.copyMessage = '', 2000);
    }
  }


}
