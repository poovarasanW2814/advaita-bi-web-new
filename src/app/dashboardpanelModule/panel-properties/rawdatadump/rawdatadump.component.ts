import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild, inject} from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TabComponent, TabModule } from '@syncfusion/ej2-angular-navigations';
import { ChartService } from 'src/app/core/services/chart.service';
import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';
import { NgIf, NgFor } from '@angular/common';
import { ColorPickerModule } from '@syncfusion/ej2-angular-inputs';

@Component({
    selector: 'app-rawdatadump',
    templateUrl: './rawdatadump.component.html',
    styleUrls: ['./rawdatadump.component.scss'],
    imports: [TabModule, FormsModule, ReactiveFormsModule, DropDownListModule, NgIf, ColorPickerModule, NgFor]
})
export class RawdatadumpComponent implements OnInit, OnChanges {
  @Input() getPanelObj: any;
  @Output() sendBoxObj = new EventEmitter()
  connection_id!: number;
  tableNamesArray: any[] = [];
  selectedTableFieldName: any[] = []
  form!: FormGroup;
  iconFields: any = { text: 'PanelType', iconCss: 'Class', value: 'Class' };
  public headerText: any = [{ text: "General" },
  { text: "Raw Query" }, {text : "Last RefreshData Query"}];
  @ViewChild('tabComponent') tab!: TabComponent


  panelTypeDataArray: any[] = [
    { Class: 'fas fa-chart-bar', PanelType: 'Chart', Id: '1' },
    { Class: 'fas fa-signal', PanelType: 'Signal', Id: '2' },
    { Class: 'fas fa-dollar-sign', PanelType: 'Doller', Id: '3' },
    { Class: 'fas fa-rupee-sign', PanelType: 'Rupee', Id: '4' },
    { Class: 'fas fa-comments', PanelType: 'Comments', Id: '5' },
    { Class: 'fas fa-user', PanelType: 'User', Id: '6' },
    { Class: 'fas fa-percentage', PanelType: 'Percentage', Id: '7' },
    { Class: 'fas fa-plus', PanelType: 'Plus', Id: '8' },
    { Class: 'fas fa-percentage', PanelType: 'Percentage', Id: '9' },
    { Class: 'fas fa-phone', PanelType: 'phone', Id: '10' },
    { Class: 'fas fa-voicemail', PanelType: 'VoiceMail', Id: '11' },

  ];
  rawQueryValue: string = '';
  lastRefreshDataQuery : string = '';



  private readonly fb = inject(FormBuilder);
  private readonly chartService = inject(ChartService);
  private readonly cdr = inject(ChangeDetectorRef);
  constructor() {
    this.createForm()
  }


  ngOnChanges(changes: SimpleChanges): void {
    // this.createForm()

    if (this.tab) {
      this.tab.selectedItem = 0;
    }

    let currentValue = changes['getPanelObj'].currentValue;
    let panelsArrData: any = sessionStorage.getItem('createPanelSeriesArray');
    // let panelsArrData: any = localStorage.getItem('createPanelSeriesArray');

    if (panelsArrData) {
      panelsArrData = JSON.parse(panelsArrData)
      const matchingPanel = panelsArrData.find((panel: any) => panel.id === currentValue.id);

      if (matchingPanel) {

        this.connection_id = this.getPanelObj.connection_id;

        // this.getPanelObj = matchingPanel;

        this.getPanelObj = {
          ...matchingPanel,
          connection_id: this.connection_id, // Preserve the original connection_id
        };


        if(this.getPanelObj.content != undefined || this.getPanelObj.content != null){
          this.form.patchValue({
            tableName: this.getPanelObj.content.tableName || '',
            labelName: this.getPanelObj.content.labelName || '',
            backgroundColor: this.getPanelObj.content.backgroundColor || '#CDC1FF',
            textColor: this.getPanelObj.content.textColor || '#000000',
            textSize: this.getPanelObj.content.textSize || '16',
            rawQuery: this.getPanelObj.content.rawQuery || '',
            title: this.getPanelObj.content.title || '',
            boxIcon: this.getPanelObj.content.boxIcon || '',
            iconFontsize: this.getPanelObj.content.iconFontsize || '',
            iconFontColor: this.getPanelObj.content.iconFontColor || '',
            lastDataRefreshQuery: this.getPanelObj.content.lastDataRefreshQuery || '',
            lastUpdateDateTime: this.getPanelObj.content.lastUpdateDateTime || ''
          });
          console.log('this.getPanelObj in box object', this.getPanelObj)


          this.rawQueryValue = this.getPanelObj.content.rawQuery ? this.getPanelObj.content.rawQuery : '';
          this.lastRefreshDataQuery =  this.getPanelObj.content.lastDataRefreshQuery ? this.getPanelObj.content.lastDataRefreshQuery : '';
        }

        this.chartService.getTableNamesArrary(this.connection_id).subscribe((res: any) => {

          if(res){
            let data = res['data'];
            this.tableNamesArray = data;
  
            if (this.getPanelObj.content.tableName) {
              this.onTableDropdown(this.getPanelObj.content.tableName);
            }else{
              this.selectedTableFieldName = [];
  
            }
          }

          // Trigger change detection after setting form values
          // this.cdr.detectChanges();

        });


      }
    }
  }

  addRawQueryTextOld(event: any) {
    const currentText = this.rawQueryValue;
    const selectedValue = this.form.get('tableName')!.value;

    const operator = event.target.value;

    if (operator) {
      const updatedText = `${currentText} ${operator}`;
      this.rawQueryValue = updatedText;
    }
  }

  addLastRefreshQueryTextOld(event: any) {
    const currentText = this.lastRefreshDataQuery;
    const selectedValue = this.form.get('lastDataRefreshQuery')!.value;

    const operator = event.target.value;

    if (operator) {
      const updatedText = `${currentText} ${operator}`;
      this.lastRefreshDataQuery = updatedText;
    }
  }

  addLastRefreshQueryTextWithoutSpace(event: any) {
    const operator = event.target.value || ""; // Replace "YourValue" with a default value if necessary
    const currentText = this.lastRefreshDataQuery;

    console.log('currentText', currentText)
  
    console.log('operator', operator)
    if (operator) {
      // Insert the operator at the cursor position
      const beforeCursor = currentText.slice(0, this.cursorConditionPosition);
      const afterCursor = currentText.slice(this.cursorConditionPosition);
      this.lastRefreshDataQuery = `${beforeCursor}${operator}${afterCursor}`;

    console.log('operator', operator)

  
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

  addLastRefreshQueryText(event: any) {
    const operator = event.target.value || ""; // Value from the button, or default if necessary
    const currentText = this.lastRefreshDataQuery;
  
    console.log('currentText', currentText);
    console.log('operator', operator);
  
    if (operator) {
      // Add spaces before and after the operator
      const operatorWithSpaces = ` ${operator} `;
  
      // Insert the operator with spaces at the cursor position
      const beforeCursor = currentText.slice(0, this.cursorConditionPosition);
      const afterCursor = currentText.slice(this.cursorConditionPosition);
      this.lastRefreshDataQuery = `${beforeCursor}${operatorWithSpaces}${afterCursor}`;
  
      console.log('Updated Query', this.lastRefreshDataQuery);
  
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
  


  addToTextareaOld(name: string) {
    this.rawQueryValue = (this.rawQueryValue ?? '') + name + ' ';

  }

  addToTextareaWithoutSpace(name: string) {
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



  addToRefreshTExtAreaOld(name: string) {
    this.lastRefreshDataQuery = (this.lastRefreshDataQuery ?? '') + name + ' ';

  }

  addToRefreshTExtArea(name: string) {
    const textToAdd = ` ${name} `; // Add spaces before and after the name
    const currentText = this.lastRefreshDataQuery ?? '';
  
    // Insert the text at the cursor position
    const beforeCursor = currentText.slice(0, this.cursorConditionPosition);
    const afterCursor = currentText.slice(this.cursorConditionPosition);
    this.lastRefreshDataQuery = `${beforeCursor}${textToAdd}${afterCursor}`;
  
    // Update the cursor position to be after the newly added text
    this.cursorConditionPosition += textToAdd.length;
  
    // Optionally, restore focus to the textarea
    const textarea = document.getElementById("pop_chart_condition") as HTMLTextAreaElement;
    if (textarea) {
      textarea.focus();
      textarea.setSelectionRange(this.cursorConditionPosition, this.cursorConditionPosition);
    }
  }
  

  addRawQueryTextWIthoutSpace(event: any) {
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



  onClearRawQuery() {
    this.rawQueryValue = ""; // Set to empty string
    this.form.get('rawQuery')!.setValue("")
  }

  onClearLastDataRefreshQuery() {
    this.lastRefreshDataQuery = ""; // Set to empty string
    this.form.get('lastDataRefreshQuery')!.setValue("")
  }

  onTableDropdown(dropdownValue: any) {

    console.log('dropdownValue', dropdownValue)
    if (!dropdownValue) {
      this.selectedTableFieldName = []
      return;
    }
    const tableNameControl = this.form.get('tableName');
    tableNameControl!.setValue(dropdownValue);

    if (dropdownValue != undefined || dropdownValue != "" || dropdownValue != null) {
      this.chartService.getColumnNameBYTableName(dropdownValue, this.connection_id).subscribe((res: any) => {
        console.log(res);
        if (res) {
          let data: any = res['data'];
          let objdata: any = Object.keys(data)
          this.selectedTableFieldName = Object.keys(data);

        }
      });
    } else {
      this.selectedTableFieldName = []; // Reset the field name array if no table name is selected
    }
  }

  ngOnInit(): void {
    // this.createForm()
  }

  createForm(){
    this.form = this.fb.group({
      tableName: ['', Validators.required],
      labelName: [''],
      backgroundColor: ['#CDC1FF'],
      textColor: ['#000000'],
      textSize: ['16'],
      rawQuery: ['', Validators.required],
      title: [''],
      boxIcon: [''],
      iconFontsize: [''],
      iconFontColor: [''],
      dataSource: [],
      lastDataRefreshQuery: [""],
      lastUpdateDateTime: [""]
    });
  }


  onSubmit1() {
    // debugger
    console.log(this.form.invalid)

    if (this.form.invalid) {
      console.log(this.form.invalid)

      this.form.markAllAsTouched();  // This will show validation messages for all invalid fields
      return;
    }

    let boxObj = this.form.value;
    console.log(this.form.value);
    console.log(boxObj)
    this.getPanelObj = {
      ...this.getPanelObj,
      header: boxObj.labelName,
      content: {
        "dataSource": [],
        height: "100%",
        widht: '100%',
        "tableName": boxObj.tableName,
        rawQuery: boxObj.rawQuery ? boxObj.rawQuery : "",

        selectedValues_dataSource: this.getPanelObj.selectedValues_dataSource ? this.getPanelObj.selectedValues_dataSource : [],
        ...boxObj,
        lastDataRefreshQuery: boxObj.lastDataRefreshQuery ? boxObj.lastDataRefreshQuery : "",
        lastUpdateDateTime: boxObj.lastUpdateDateTime
      }
    };
    if (this.form.valid) {

      console.log(this.getPanelObj)

      let panelsArrData: any = sessionStorage.getItem('createPanelSeriesArray');
      // let panelsArrData: any = localStorage.getItem('createPanelSeriesArray');
      if (panelsArrData != null) {
        panelsArrData = JSON.parse(panelsArrData)
        // let object = panelsArrData.find((ele : any) => ele.id === this.getPanelObj.id);
        let matchingObjectIndex = Array.isArray(panelsArrData)
          ? panelsArrData.findIndex(obj => obj.id === this.getPanelObj.id)
          : -1;

        panelsArrData[matchingObjectIndex] = this.getPanelObj

      }
      // Save the updated array back to sessionStorage
      sessionStorage.setItem('createPanelSeriesArray', JSON.stringify(panelsArrData));
      // localStorage.setItem('createPanelSeriesArray', JSON.stringify(panelsArrData));

      this.sendBoxObj.emit({ boxObj: this.getPanelObj, resObj: { resSuccess: true, resMessage: "", statusCode: 200 } });


    }



  }

  onSubmitOld() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();  // Display validation errors
      return false;  // Indicate the form is invalid
    }
    let boxObj = this.form.value;

    this.getPanelObj = {
      ...this.getPanelObj,
      header: boxObj.labelName,
      content: {
        dataSource: [],
        height: "100%",
        width: '100%',
        tableName: boxObj.tableName,
        rawQuery: boxObj.rawQuery ? boxObj.rawQuery : "",
        selectedValues_dataSource: this.getPanelObj.selectedValues_dataSource || [],

        lastDataRefreshQuery: boxObj.lastDataRefreshQuery != undefined || boxObj.lastDataRefreshQuery != null ? boxObj.lastDataRefreshQuery : "",
        lastUpdateDateTime: boxObj.lastUpdateDateTime,
        ...boxObj,

      }
    };
    console.log(boxObj.lastDataRefreshQuery)
    if (this.form.valid) {


      // Update sessionStorage and emit the success event
      let panelsArrData: any = sessionStorage.getItem('createPanelSeriesArray');
      if (panelsArrData != null) {
        panelsArrData = JSON.parse(panelsArrData);
        let matchingObjectIndex = Array.isArray(panelsArrData)
          ? panelsArrData.findIndex(obj => obj.id === this.getPanelObj.id)
          : -1;
        panelsArrData[matchingObjectIndex] = this.getPanelObj;
      }
      sessionStorage.setItem('createPanelSeriesArray', JSON.stringify(panelsArrData));

      console.log(this.getPanelObj)
      this.sendBoxObj.emit({ boxObj: this.getPanelObj, resObj: { resSuccess: true, resMessage: "", statusCode: 200 } });

      return true;  // Indicate the form is valid
    }

    return false;  // Default return in case other conditions are not met
  }
  onSubmit() {
    if (this.form.invalid) {
        this.form.markAllAsTouched();  // Display validation errors
        return false;  // Indicate the form is invalid
    }

    let boxObj = {
        ...this.form.value,
        lastDataRefreshQuery: this.form.value.lastDataRefreshQuery || "",
        rawQuery: this.form.value.rawQuery || "",
        lastUpdateDateTime: this.form.value.lastUpdateDateTime || ""
      
    };

    this.getPanelObj = {
        ...this.getPanelObj,
        header: boxObj.labelName,
        content: {
            dataSource: [],
            height: "100%",
            width: '100%',
            tableName: boxObj.tableName,
            rawQuery: boxObj.rawQuery ,
            selectedValues_dataSource: this.getPanelObj.selectedValues_dataSource || [],
            lastDataRefreshQuery: boxObj.lastDataRefreshQuery,
            lastUpdateDateTime: boxObj.lastUpdateDateTime ,
            ...boxObj,
        }
    };

    console.log(boxObj.lastDataRefreshQuery);

    if (this.form.valid) {
        let panelsArrData: any = sessionStorage.getItem('createPanelSeriesArray');
        // let panelsArrData: any = localStorage.getItem('createPanelSeriesArray');
        if (panelsArrData != null) {
            panelsArrData = JSON.parse(panelsArrData);
            let matchingObjectIndex = Array.isArray(panelsArrData)
                ? panelsArrData.findIndex(obj => obj.id === this.getPanelObj.id)
                : -1;
            panelsArrData[matchingObjectIndex] = this.getPanelObj;
        }
        sessionStorage.setItem('createPanelSeriesArray', JSON.stringify(panelsArrData));
        // localStorage.setItem('createPanelSeriesArray', JSON.stringify(panelsArrData));

        console.log(this.getPanelObj);
        this.sendBoxObj.emit({ boxObj: this.getPanelObj, resObj: { resSuccess: true, resMessage: "", statusCode: 200 } });

        return true;  // Indicate the form is valid
    }
    return false;  // Default return in case other conditions are not met
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

