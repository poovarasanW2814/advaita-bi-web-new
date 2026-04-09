import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild, inject} from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TabComponent, TabModule } from '@syncfusion/ej2-angular-navigations';
import { Draggable } from '@syncfusion/ej2/base';
import { ChartService } from 'src/app/core/services/chart.service';
import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';
import { NgIf, NgFor } from '@angular/common';

@Component({
    selector: 'app-listbox-properties',
    templateUrl: './listbox-properties.component.html',
    styleUrls: ['./listbox-properties.component.scss'],
    imports: [TabModule, FormsModule, ReactiveFormsModule, DropDownListModule, NgIf, NgFor]
})

export class ListboxPropertiesComponent implements OnInit, OnChanges {
  @Input() getPanelObj : any;
  // public headerText: any = [{ text: "General" },
  // { text: "Fields" }, { text: "Condition" }];
  public headerText: any = [{ text: "General" }, { text: "Condition" },  { text: "Raw Query" }];
  @ViewChild('selectedtablelist',{static: false})element:any;
  @ViewChild('expression',{static: false})element1: any;
  showUpdateButton: boolean = false;
  showAddButton: boolean = true;
  connection_id! : number
  fieldObjArray : any = [];
  @Output() sendBoxObj = new EventEmitter()
  boxIdCount :any = 0; 
  boxTemplateForm!: FormGroup;
  @ViewChild('tabComponent') tab! : TabComponent

  tableNamesArray : any = [];
  selectedTableFieldName : any[] = [];
  ApiPanelSeriesArray : any[] = [];
  measuresArray : any[] = []
  selectFieldName : string = '';
  isUpdateOperation : boolean = false;
  fieldDetailsForm! : FormGroup;
  panelSeriesArray: any;
  rawQueryValue : string = "";


  private readonly fb = inject(FormBuilder);
  private readonly chartService = inject(ChartService);
  constructor() {
    this.boxTemplateForm = this.fb.group({
          tableName : ['', [Validators.required]],
          fieldName : ['', [Validators.required]],
          labelName : [''],
          title : [''],
          conditions : [''],
          orderByType : [''],
          rawQuery :['']
          // groupBy : ['']
  })
   
  }

  ngOnChanges(changes: SimpleChanges): void {
    let currentValue = changes['getPanelObj'].currentValue;
    if (currentValue != undefined || currentValue != null) {
      let panelsArrData: any = sessionStorage.getItem('createPanelSeriesArray');
      // let panelsArrData: any = localStorage.getItem('createPanelSeriesArray');

      
      this.panelSeriesArray = panelsArrData
      this.getPanelObj = currentValue;
      // this.tab.selectedItem = 0;
      if (this.tab) {
        this.tab.selectedItem = 0;
      }
      if(this.panelSeriesArray){

        this.panelSeriesArray = JSON.parse(this.panelSeriesArray)
        const matchingPanel = this.panelSeriesArray.find((panel : any) => panel.id === currentValue.id);
  
        if(matchingPanel){
          this.getPanelObj = currentValue;
          this.connection_id = this.getPanelObj.connection_id;
    
          this.getPanelObj = {
            ...matchingPanel,
            connection_id: this.connection_id, // Preserve the original connection_id
          };
          
          if (this.getPanelObj.content != undefined || this.getPanelObj) {
            // this.onTableDropdown(this.getPanelObj.content.tableName)
            this.boxTemplateForm.patchValue({
              conditions: this.getPanelObj.content.conditions || '',
              title: this.getPanelObj.header || '',
              // groupBy: this.getPanelObj.content.groupBy,
              tableName: this.getPanelObj.content.tableName || '',
              orderByType: this.getPanelObj.content.orderByType || '',
              rawQuery: this.getPanelObj.content.rawQuery || '',
              
              fieldName : this.getPanelObj.content.fieldDetails?.fieldName || '',
              labelName : this.getPanelObj.content.fieldDetails?.labelName || '',

              
            });
    
          }

          this.rawQueryValue =  this.getPanelObj.content.rawQuery || "";
          this.conditionValue =  this.getPanelObj.content.conditions || "";

          this.chartService.getTableNamesArrary(this.connection_id).subscribe((res: any) => {
            let data = res['data'];
            this.tableNamesArray = data;
  
            // Fetch the field names based on the patched tableName value
            if (this.getPanelObj.content.tableName) {
              this.onTableDropdown(this.getPanelObj.content.tableName);
            }else{
              this.selectedTableFieldName = []
            }
          });
        }

        }
      }
  }

  ngOnInit(): void {

  }

  
  cursorConditionPosition: number = 0;
cursorPosition: number = 0;

updateCursorPositionCondition(event: Event) {
  const textarea = event.target as HTMLTextAreaElement;
  this.cursorConditionPosition = textarea.selectionStart;
}
updateCursorPosition(event: Event) {
  const textarea = event.target as HTMLTextAreaElement;
  this.cursorPosition = textarea.selectionStart;
}
  
  addRawQueryTextOld(event: any) {
    const currentText = this.rawQueryValue;
    const selectedValue = this.boxTemplateForm.get('tableName')!.value;

    const operator = event.target.value;

    console.log('added raw query', operator);
    console.log(' this.rawQueryValue',  this.rawQueryValue);
  
    if (operator) {
      const updatedText = `${currentText} ${operator}`;
      this.rawQueryValue = updatedText;
    }
  }

  addRawQueryTextWithoutSpace(event: any) {
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

  addRawQueryText(event: any) {
    const operator = event.target.value; // Value from the button
    const currentText = this.rawQueryValue;
  
    if (operator) {
      // Insert the operator with spaces before and after at the cursor position
      const beforeCursor = currentText.slice(0, this.cursorPosition);
      const afterCursor = currentText.slice(this.cursorPosition);
      const operatorWithSpaces = ` ${operator} `; // Add spaces before and after the operator
  
      this.rawQueryValue = `${beforeCursor}${operatorWithSpaces}${afterCursor}`;
  
      // Update the cursor position to be after the newly inserted operator and spaces
      this.cursorPosition += operatorWithSpaces.length;
  
      // Optionally, restore focus to the textarea
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


  onClearConditions(){

     this.conditionValue = "";
    //  this.boxTemplateForm.get('conditions')!.reset();
    this.boxTemplateForm.get('conditions')!.setValue("");

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
  // onTableDropdown(dropdownValue : any){
  //   if(!dropdownValue) {
  //     return;
  //   }
  //   console.log(dropdownValue, 'firstDropdownValue');
  //   const tableNameControl = this.boxTemplateForm.get('tableName');
  //   tableNameControl!.setValue(dropdownValue);

  //   if(dropdownValue != undefined || dropdownValue != "" || dropdownValue != null){
  //     this.chartService.getColumnNameBYTableName(dropdownValue, this.connection_id).subscribe((res : any)=>{
  //       console.log(res);
  //       let data = res['data']
  //       // for(let )
  //       this.selectedTableFieldName =  Object.keys(data)
  //     })
      
  //   }else{
  //     this.selectedTableFieldName = []
  //   }


  
  // }

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


  onBoxFormSubmit(){


    let formObj = this.boxTemplateForm.value;
    let id = this.getPanelObj.id;
    console.log(formObj);
    if (this.boxTemplateForm.invalid) {
      console.log(this.boxTemplateForm.invalid);
      this.boxTemplateForm.markAllAsTouched();  // This will show validation messages for all invalid fields
      return false; // Return false if the form is invalid
    }

    let panelsArrData: any = sessionStorage.getItem('createPanelSeriesArray');
    // let panelsArrData: any = localStorage.getItem('createPanelSeriesArray');

    
    this.panelSeriesArray = panelsArrData;

    if(this.panelSeriesArray != null){
      this.panelSeriesArray = JSON.parse(this.panelSeriesArray)
      let object = this.panelSeriesArray.find((ele : any) => ele.id === id);
      console.log(object)

      
    const matchingObjectIndex = Array.isArray(this.panelSeriesArray)
    ? this.panelSeriesArray.findIndex(obj => obj.id === id)
    : -1;
    console.log(matchingObjectIndex)
   
    let fieldDetailsObj = {
      tableName : formObj.tableName || '',
      fieldName : formObj.fieldName || '',
      labelName : formObj.labelName || '',
    }

    let boxApiObj =  {
      "object_id":id,
      "object_setup": {
        "content": {
          "id": id + '_listBox_' + this.boxIdCount,
          height :"130px",
          widht : '100%',
          "dataSource": [],
          "tableName":  formObj.tableName || '',
          "conditions" : formObj.conditions || '',
          "orderByType" : formObj.orderByType || '',
          "rawQuery" : formObj.rawQuery || '',
          "fieldDetails": fieldDetailsObj
        },
        "panelType": "listbox"
      },
      "object_type": "listbox",
      "connection_id" : this.connection_id
    }

    console.log(boxApiObj)
    if (matchingObjectIndex !== -1) {
      // Update the existing object with the new data
      this.panelSeriesArray[matchingObjectIndex] = {
        ...this.getPanelObj,
        header : formObj.title,
        content : {
          "id": id + '_listBox_' + this.boxIdCount,         
          "dataSource": [],
          height :"130px",
          widht : '100%',
          "tableName":  formObj.tableName || '',
          "conditions" : formObj.conditions || '',      
          "fieldDetails": fieldDetailsObj,
          "orderByType" : formObj.orderByType || '',
          "rawQuery" : formObj.rawQuery || '',
          

          
        }
      };
    }
    console.log(this.panelSeriesArray)
      // Save the updated array back to sessionStorage
      sessionStorage.setItem('createPanelSeriesArray', JSON.stringify(this.panelSeriesArray));
    // localStorage.setItem('createPanelSeriesArray', JSON.stringify(this.panelSeriesArray));

    
  
     this.chartService.objectPivotCreate(boxApiObj).subscribe(
      (res : any) =>{
  
        if(res.success === true){
          let resobj = res['data'];
          let data = resobj.object_setup.content;
          console.log(data)
         let boxObj = { 
         ...this.getPanelObj,
         header : formObj.title,
         content : {
          ...data,   
         }
        }
    
       this.sendBoxObj.emit({ boxObj: boxObj, resObj: { resSuccess: res.success, resMessage: res.message,  statusCode : res.status_code } });
    
        } else{
          let boxObj = this.panelSeriesArray[matchingObjectIndex]
        //  this.sendBoxObj.emit({ boxObj: boxObj, resObj: { resSuccess: res.success, resMessage: res.message } });
       
          this.sendBoxObj.emit({ boxObj: boxObj, resObj: { resSuccess: res.success, resMessage: res.message, statusCode : res.status_code } });
        }
     },
     (err : any) =>{
      let boxObj = this.panelSeriesArray[matchingObjectIndex]
      const errorMessage = err.error && err.error.message ? err.error.message : err.message;
      this.sendBoxObj.emit({ boxObj: boxObj, resObj: { resSuccess: false, resMessage: errorMessage,  statusCode : err.status } });
       

    }
     )
    }

    return true
  }


  conditionValue : any;

  addTextOld(event: any) {
    const currentText = this.conditionValue;
    const selectedValue = this.boxTemplateForm.get('tableName')!.value;

    const operator = event.target.value;
  
    if (selectedValue) {
      const updatedText = `${currentText}  ${operator}`;
      this.conditionValue = updatedText;
    }
  }

  
  addTextWIthoutSpace(event: any) {
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

  addText(event: any) {
    const operator = event.target.value || ""; // Value from the button, or default if needed
    const currentText = this.conditionValue;
  
    if (operator) {
      // Add spaces before and after the operator
      const operatorWithSpaces = ` ${operator} `;
      
      // Insert the operator with spaces at the cursor position
      const beforeCursor = currentText.slice(0, this.cursorConditionPosition);
      const afterCursor = currentText.slice(this.cursorConditionPosition);
      this.conditionValue = `${beforeCursor}${operatorWithSpaces}${afterCursor}`;
  
      // Update the cursor position to be after the newly inserted operator and spaces
      this.cursorConditionPosition += operatorWithSpaces.length;
  
      // Optionally, restore focus to the textarea
      const textarea = document.getElementById("pop_chart_condition") as HTMLTextAreaElement;
      if (textarea) {
        textarea.focus();
        textarea.setSelectionRange(this.cursorConditionPosition, this.cursorConditionPosition);
      }
    }
  }
  
  
  ngAfterViewInit() {
    if(this.element){
      let draggable: Draggable =
      new Draggable(this.element.nativeElement,{ clone: false });
      console.log(draggable);


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
