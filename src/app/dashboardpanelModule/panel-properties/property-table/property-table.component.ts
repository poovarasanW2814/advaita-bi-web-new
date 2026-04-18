import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild, inject} from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Freeze, Grid, GridComponent, RowDD, GridModule, PageService, GroupService, SortService, FilterService, ResizeService, ReorderService, ColumnMenuService, ExcelExportService as GridExcelExportService, PdfExportService as GridPdfExportService, ToolbarService as GridToolbarService, RowDDService, FreezeService } from '@syncfusion/ej2-angular-grids';

import { AnimationSettingsModel, Dialog, DialogComponent, DialogModule } from '@syncfusion/ej2-angular-popups';
import { DataManager, UrlAdaptor } from '@syncfusion/ej2-data';
import { ChartService } from 'src/app/core/services/chart.service';
import { DropDownListModule, MultiSelectModule } from '@syncfusion/ej2-angular-dropdowns';
import { NgIf, NgFor } from '@angular/common';
import { SwitchModule, ButtonModule } from '@syncfusion/ej2-angular-buttons';
import { ChartModule } from '@syncfusion/ej2-angular-charts';
import { KanbanModule } from '@syncfusion/ej2-angular-kanban';
import { ColorPickerModule } from '@syncfusion/ej2-angular-inputs';

Grid.Inject(RowDD, Freeze);
// GridComponent.Inject(RowDD, Freeze, Selection);


@Component({
    selector: 'app-property-table',
    templateUrl: './property-table.component.html',
    styleUrls: ['./property-table.component.scss'],
    providers: [PageService, GroupService, SortService, FilterService, ResizeService, ReorderService, ColumnMenuService, GridExcelExportService, GridPdfExportService, GridToolbarService, RowDDService, FreezeService],
    imports: [FormsModule, ReactiveFormsModule, DropDownListModule, NgIf, SwitchModule, MultiSelectModule, ButtonModule, GridModule, ChartModule, KanbanModule, NgFor, ColorPickerModule, DialogModule]
})

export class PropertyTableComponent implements OnInit, OnChanges {

  @Input() getPanelType: any;
  @Input() getPanelObj: any;

  @Output() sendTableObj = new EventEmitter()
  @Output() sendBoxObj = new EventEmitter()
  @ViewChild('defaultDialog')
  defaultDialog!: DialogComponent;
  headerText: any = [{ text: "General" },
  { text: "Measure" }, { text: 'Grouping' }, { text: "Condition" }, { text: "Raw Query" }, { text: "Conditional Formatting" },  { text: "Header formatting " }];

  // headerText: any = [{ text: "General" },
  //   { text: "Measure" },{text : 'Grouping'}, { text: "Condition" },  { text: "Conditional Formatting" }, ];


  tableNameArray: any[] = [];

  isModal: Boolean = true;
  showCloseIcon: Boolean = false;
  visible: Boolean = false;
  animationSettings: AnimationSettingsModel = { effect: 'SlideBottom' };
  target: string = ".control-section";

  showRawQueryDimensionDialog: boolean = false;


  showUpdateButton: boolean = false;
  showAddButton: boolean = true;
  generalForm!: FormGroup;
  fieldDetailsArrayAsArray: any;
  fieldDetailsArray: any[] = [];
  tableIdCount: any = 0;
  tableNameObj: any;
  tableNamesArray: any = []
  tableNameArrayValues: { [key: string]: string[] } = {};
  selectedTableFieldName: any = [];
  ApiPanelSeriesArray: any = [];

  dimensionGroupingArray: any = [];

  columnObj: any;
  idCount: any = 0;

  activeTab: number = 0;
  tabLabels: string[] = ['General', 'Measure', 'Grouping', 'Condition', 'Raw Query', 'Conditional Formatting', 'Header Formatting'];
  selectTab(i: number): void { this.activeTab = i; }

  textAlignOptions: string[] = ['Left', 'Right', 'Center'];
  columnTypeOptions: string[] = ['date', 'number', 'string'];
  levelOptions: number[] = [0,1,2,3,4,5,6,7,8,9,10];
  conditionFormatOptions: any[] = [
    { text: 'Less Than', value: '<' }, { text: 'Between', value: 'Between' },
    { text: 'Less Than Or Equal To', value: '<=' }, { text: 'Greater Than', value: '>' },
    { text: 'Greater Than Or Equal To', value: '>=' }, { text: 'Equals', value: '=' },
    { text: 'Not Equals', value: '!=' }, { text: 'Contains', value: 'contains' },
    { text: 'Not Contains', value: 'notContains' }, { text: 'None', value: 'None' }
  ];
  calculatedValueOptions: any[] = [
    { text: 'Grand Total', value: 'Sum' }, { text: 'Average Count', value: 'Average' }
  ];
  fontStyleOptions: any[] = [
    { text: 'Normal', value: 'normal' }, { text: 'Italic', value: 'italic' }, { text: 'Bold', value: 'bold' }
  ];
  fontWeightOptions: any[] = [
    { text: '100', value: '100' }, { text: '200', value: '200' }, { text: '300', value: '300' },
    { text: '400 (Normal)', value: '400' }, { text: '500', value: '500' }, { text: '600', value: '600' },
    { text: '700 (Bold)', value: '700' }, { text: '800', value: '800' }, { text: '900', value: '900' }
  ];
  ddlFields: any = { text: 'text', value: 'value' };

  get tableFormatOptions(): any[] {
    const type = this.generalForm?.get('fieldDetails.type')?.value;
    if (type === 'date') {
      return [
        { text: 'Year/Month/Date', value: 'yMd' }, { text: 'Month-Year', value: 'MMM-yyyy' },
        { text: 'Year-Month', value: 'yyyy-MMM' }, { text: 'Date-Month-Year', value: 'dd-MM-yyyy' },
        { text: 'Year-Month-Date', value: 'yyyy-MM-dd' }, { text: 'Date/Month/Year', value: 'dd/MM/yyyy' },
        { text: 'YYYY-mmm-dd', value: 'yyyy-MMM-dd' }, { text: 'Date/Month/Year hh:mm', value: 'dd/MM/yyyy hh:mm' }
      ];
    } else if (type === 'number') {
      return [
        { text: 'Percentage', value: 'P' }, { text: 'Currency', value: 'C' }, { text: 'Numeric', value: 'N2' }
      ];
    }
    return [];
  }

  selectionSettings: any = { type: 'Multiple' };
  rowDropSettings: any = { targetID: 'DestGrid' };
  editFieldName: string = "";

  panelSeriesArray: any = [];



  private readonly fb = inject(FormBuilder);
  private readonly chartService = inject(ChartService);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  constructor() {
    this.generalForm = this.fb.group({
          header: [''],
          tableName: ['', [Validators.required]],
          orderBy: [""],
          orderByType: [""],
          groupBy: [""],
          conditions: [""],
          rawQuery: [""],
          autoFitColumns: [true],
          allowGrouping: [''],
          enableBorders : [false],
          is_pagination_enabled: [true],
          allowWrapping: [false],
          enableTooltip : [true],
          fieldDetails: this.fb.group({
            index: [''],
            tableName: [""],
            field: [""],
            headerText: [""],
            textAlign: ["Left"],
            type: [""],
            format: [''],
            expression: [""],
            width: [""],
            textFormatterView: [false],
            enableHyperlink: [false],
            visible: [true],
            isFrozen: [false],
            comment_column : [false],
            unique_column_field : ['']
  }),
      dimension: this.fb.group({
        tableName: [''],
        fieldName: [''],
        level: [0],
        rawQuery: [''],
        levelTitle: ['']
      }),
      formattingCondition: this.fb.group({
        measureField: [''],
        referenceField: [''],
        calculatedValue : [''],
        value1: [],
        value2: [],
        conditionFormat: [],
        BackgroundColor: [''],
        Fontcolor: [''],
        fontSize: [''],
      }),
      dataSource: [],
      headerConditonalFormatting: this.fb.group({
        fieldName: [''],
        backgroundColor: ['#ffffff'],
        color: ['#000000'],
        fontSize: ['16px'],
        fontStyle: ['normal'],
        fontWeight: ['normal']
      })
    })
  }

  connection_id!: number;
  ngOnChanges(changes: SimpleChanges): void {
    let currentValue = changes['getPanelObj'].currentValue;
    if (currentValue != undefined || currentValue != null) {
      this.activeTab = 0;
      let panelsArrData: any = sessionStorage.getItem('createPanelSeriesArray');
      // let panelsArrData: any = localStorage.getItem('createPanelSeriesArray');
      this.panelSeriesArray = panelsArrData
      this.getPanelObj = currentValue;

      if (this.panelSeriesArray) {
        this.panelSeriesArray = JSON.parse(this.panelSeriesArray);
        let matchingPanel = this.panelSeriesArray.find((panel: any) => panel.id === currentValue.id);

        if (matchingPanel) {
          console.log('panel changed currentValue', currentValue)

          matchingPanel = {
            ...matchingPanel,
            connection_id: this.getPanelObj.connection_id
          }

          // console.log('panel changed obj', matchingPanel)
          this.getPanelObj = matchingPanel;

          this.connection_id = matchingPanel.connection_id;
          //  console.log('this.connection_id', this.connection_id)
          // this.chartService.getTableNamesArrary(this.getPanelObj.connection_id).subscribe((res: any) => {
          //   this.tableNamesArray = res['data'];
          //   console.log(res)
          //   this.getServiceData();

          // });
          console.log(' this.getPanelObj', this.getPanelObj)


          // this.onTableDropdown(this.getPanelObj.content.tableName)
          this.generalForm.patchValue({
            header: this.getPanelObj.header || '',
            tableName: this.getPanelObj.content.tableName || '',
            orderBy: this.getPanelObj.content.orderBy || [],
            orderByType: this.getPanelObj.content.orderByType || '',
            groupBy: this.getPanelObj.content.groupBy || [],
            conditions: this.getPanelObj.content.conditions || '',
            rawQuery: this.getPanelObj.content.rawQuery || '',
            autoFitColumns: this.getPanelObj.content.autoFitColumns != null ? this.getPanelObj.content.autoFitColumns : false,
            
            allowGrouping: this.getPanelObj.content.allowGrouping || false,
            enableBorders : this.getPanelObj.content.enableBorders != null ? this.getPanelObj.content.enableBorders : false,
            enableTooltip : this.getPanelObj.content.enableTooltip != null ? this.getPanelObj.content.enableTooltip : true,
            is_pagination_enabled: this.getPanelObj.content.is_pagination_enabled != null ? this.getPanelObj.content.is_pagination_enabled : true,

            allowWrapping: this.getPanelObj.content.allowWrapping != null ? this.getPanelObj.content.allowWrapping : false,



            "formattingCondition": this.getPanelObj.content.formattingCondition || [],
          })
          this.rawQueryValue = this.getPanelObj.content.rawQuery;
          this.conditionValue = this.getPanelObj.content.conditions;
          if (this.getPanelObj.content != undefined) {

            this.fieldDetailsArray = this.getPanelObj.content.matchedFieldDetails ? this.getPanelObj.content.matchedFieldDetails : this.getPanelObj.content.fieldDetails;

            this.conditionalFormatSettingsArray = this.getPanelObj.content.formattingCondition;
            this.headerFeildDetailsArray = this.getPanelObj.content.headerConditonalFormatting ? this.getPanelObj.content.headerConditonalFormatting : [];

          }

          if (matchingPanel.content.dimension) {
            this.dimensionGroupingArray = matchingPanel.content.dimension?.levels;
          } else {
            this.dimensionGroupingArray = [];
          }



          this.chartService.getTableNamesArrary(this.connection_id).subscribe((res: any) => {
            let data = res['data'];
            this.tableNamesArray = data;

            // Fetch the field names based on the patched tableName value
            if (this.getPanelObj.content.tableName) {
              this.onTableDropdown(this.getPanelObj.content.tableName);
            }
          });


        }
      }
    }
  }

  ngOnInit(): void {
    console.log(this.getPanelObj);

    let parseApiPanelSeriesArray = sessionStorage.getItem('ApiPanelSeriesArray')
    // let parseApiPanelSeriesArray = localStorage.getItem('ApiPanelSeriesArray')
    if (parseApiPanelSeriesArray) {
      this.ApiPanelSeriesArray = JSON.parse(parseApiPanelSeriesArray)
    }

  }

  getServiceData() {

  }

  addToTextareaOld(name: string) {
    // this.rawQueryValue += name + ' ';
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


  addToConditionTextareaold(name: string) {
    // this.conditionValue += name + ' ';
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


  addToDimensionTextareaOld(name: string) {
    // this.conditionValue += name + ' ';
    this.rawQueryDimensionValue = (this.rawQueryDimensionValue ?? '') + name + ' ';
  }

  addToDimensionTextarea(name: string) {
    const currentText = this.rawQueryDimensionValue;

    if (name) {
      // Add space before and after the name
      const nameWithSpaces = ` ${name} `;

      // Insert the name (with spaces) at the cursor position
      const beforeCursor = currentText.slice(0, this.dimensioncursorPosition);
      const afterCursor = currentText.slice(this.dimensioncursorPosition);
      this.rawQueryDimensionValue = `${beforeCursor}${nameWithSpaces}${afterCursor}`;

      // Update the cursor position to be after the newly inserted name (including spaces)
      this.dimensioncursorPosition += nameWithSpaces.length;

      // Optionally, restore focus to the textarea and set the cursor position
      const textarea = document.getElementById("pop_chart_rawQuery") as HTMLTextAreaElement;
      if (textarea) {
        textarea.focus();
        textarea.setSelectionRange(this.dimensioncursorPosition, this.dimensioncursorPosition);
      }
    }
  }




  @ViewChild('#grid') gridData!: GridComponent
  onDataBound() {
    this.gridData.autoFitColumns([])
  }
  onSelectCondtionFormatValue(eve: any) {
    let value = eve?.value ?? eve?.target?.value;
    this.selectedConditionType = value
  }
  onDeleteConditionObj(id: any) {
    this.conditionalFormatSettingsArray.splice(id, 1)
  }


  onEditConditionObj(item: any, id: any) {
    console.log(item);
    this.updateConditonBtn = true;
    this.showConditionAddBtn = false;
    let formObj = this.generalForm;
    this.editColumnObjIndex = id;

    this.selectedConditionType = item.conditions
    const fontSizeWithoutPx = item.style.fontSize?.replace('px', '') || '';

    formObj.patchValue({
      formattingCondition: {
        measureField: item.measure || '',
        referenceField: item.referenceField || '',
        value1: item.value1 || '',
        value2: item.value2 || '',
        conditionFormat: item.conditions || '',
        BackgroundColor: item.style.backgroundColor || '',
        Fontcolor: item.style.color || '',
        fontSize: fontSizeWithoutPx,
        calculatedValue : item.calculatedValue || ''
      }
    })
  }
  selectedConditionType!: string;
  showConditionAddBtn: boolean = true;
  updateConditonBtn: boolean = false;
  onUpdateConditonObj() {
    const formattingConditonForm: any = this.generalForm.get('formattingCondition');
    let updatedObj: any = this.generalForm.get('formattingCondition')!.value;

    console.log('updatedObj', updatedObj)
    let defaultFontSize = `${updatedObj.fontSize || 12}px`;
    console.log('defaultFontSize', defaultFontSize)

    updatedObj = {
      measure: updatedObj.measureField,
      referenceField: updatedObj.referenceField,
      value1: updatedObj.value1,
      value2: updatedObj.value2,
      conditions: updatedObj.conditionFormat,
      calculatedValue : updatedObj.calculatedValue,
      style: {
        backgroundColor: updatedObj.BackgroundColor,
        color: updatedObj.Fontcolor,
        fontSize: defaultFontSize
      }
    }
    console.log(updatedObj)
    this.conditionalFormatSettingsArray.splice(this.editColumnObjIndex, 1, updatedObj);

    formattingConditonForm?.reset()

    this.updateConditonBtn = false;
    this.showConditionAddBtn = true;
  }
  conditionalFormatSettingsArray: any = []

  onAddConditionFormat() {
    const formattingConditonForm = this.generalForm.get('formattingCondition');

    console.log('formattingConditonForm:', formattingConditonForm);

    if (formattingConditonForm) {
      let formObject = formattingConditonForm.value;
      console.log(formObject);
      let obj: any = {};
      let defaultFontSize = formObject.fontSize ? `${formObject.fontSize}px` : '12px'
      if (formObject.conditionFormat == 'Between') {
        obj = {
          measure: formObject.measureField,
          referenceField: formObject.referenceField,
          value1: formObject.value1,
          value2: formObject.value2,
          conditions: formObject.conditionFormat,
          calculatedValue : formObject.calculatedValue,
          style: {
            backgroundColor: formObject.BackgroundColor,
            color: formObject.Fontcolor,
            fontSize: defaultFontSize
          }
        }
      } else {
        obj = {
          referenceField: formObject.referenceField,
          measure: formObject.measureField,
          value1: formObject.value1,
          conditions: formObject.conditionFormat,
          style: {
            backgroundColor: formObject.BackgroundColor,
            color: formObject.Fontcolor,
            fontSize: defaultFontSize
          }
        }
      }
      console.log(obj)
      this.conditionalFormatSettingsArray = this.conditionalFormatSettingsArray ? this.conditionalFormatSettingsArray : []
      console.log(this.conditionalFormatSettingsArray)

      this.conditionalFormatSettingsArray.push(obj);
      formattingConditonForm.reset()

    }
  }

  getDirectKeys(tableNameObj: any) {
    if (tableNameObj && tableNameObj !== undefined) {
      return Object.keys(tableNameObj).filter(key => !key.includes('.'));
    } else {
      return [];
    }
  }


  getKeysOfArrayObjects(tableArray: any[]): string[] {
    const keys = new Set<string>();

    for (const object of tableArray) {
      for (const key in object) {
        keys.add(key);
      }
    }

    return Array.from(keys);
  }



  dataSourceArray: any = [];
  headerTextValue: any;
  onFirstDropdownChange(eve: any) {
    debugger
    const dropdownValue = eve.target.value;
    // const tableArray =  this.tableNamesArray[dropdownValue];
    const tableNameControl = this.generalForm.get('tableName');
    const fieldDetailControl = this.generalForm.get('fieldDetails');
    const fieldDetailTableName = fieldDetailControl!.get('field');


    tableNameControl!.setValue(dropdownValue);
    fieldDetailTableName!.setValue(dropdownValue);
    console.log(fieldDetailControl)


    this.chartService.getColumnNameBYTableName(dropdownValue, this.connection_id).subscribe((res: any) => {
      console.log(res);
      let data = res['data']
      this.selectedTableFieldName = Object.keys(data)

    })
    console.log(this.selectedTableFieldName);

  }

  onTableDropdown(dropdownValue: any) {
    if (!dropdownValue) {
      this.selectedTableFieldName = []
      return;
    }
    console.log(dropdownValue, 'firstDropdownValue');
    const tableNameControl = this.generalForm.get('tableName');
    const fieldDetailControl = this.generalForm.get('fieldDetails');
    const fieldDetailTableName = fieldDetailControl!.get('tableName');
    const dimensionTableName = this.generalForm!.get('dimension');
    const dimensionTableNameControl = dimensionTableName!.get('tableName');

    tableNameControl!.setValue(dropdownValue);
    fieldDetailTableName!.setValue(dropdownValue);
    dimensionTableNameControl!.setValue(dropdownValue);
    console.log(fieldDetailControl)

    if (dropdownValue != undefined || dropdownValue != "" || dropdownValue != null) {
      this.chartService.getColumnNameBYTableName(dropdownValue, this.connection_id).subscribe((res: any) => {
        console.log(res);
        let data = res['data'];
        if (data) {
          this.selectedTableFieldName = Object.keys(data);

        }
        // this.selectedTableFieldName = Object.keys(data);

      })
      console.log(this.selectedTableFieldName);
    } else {
      this.selectedTableFieldName = []

    }

  }

  onTableDropdownold(dropdownValue: any) {
    if (!dropdownValue) {
      this.selectedTableFieldName = []; // Reset if no valid dropdown value
      return;
    }

    console.log(dropdownValue, 'firstDropdownValue');

    const tableNameControl = this.generalForm.get('tableName');
    const fieldDetailControl = this.generalForm.get('fieldDetails');
    const fieldDetailTableName = fieldDetailControl?.get('tableName');
    const dimensionTableName = this.generalForm.get('dimension');
    const dimensionTableNameControl = dimensionTableName?.get('tableName');

    tableNameControl?.setValue(dropdownValue);
    fieldDetailTableName?.setValue(dropdownValue);
    dimensionTableNameControl?.setValue(dropdownValue);

    console.log(fieldDetailControl);

    this.chartService.getColumnNameBYTableName(dropdownValue, this.connection_id).subscribe(
      (res: any) => {
        console.log(res);
        let data = res['data'];
        this.selectedTableFieldName = data ? Object.keys(data) : []; // Ensure it's reset if no data
      },
      (error: any) => {
        console.error("Error fetching table fields:", error);
        this.selectedTableFieldName = []; // Reset in case of an error
      }
    );
  }




  onClearConditions() {
    // let currentText = this.conditionValue;
    // let selectedValue = this.dashboardCreationForm.get('conditions')!.value;
    //console.log(currentText)
    // selectedValue = ""

    this.conditionValue = "";
    // this.generalForm.get('conditions')!.reset();
     this.generalForm.get('conditions')!.setValue("");
  }
  onClearRawQuery() {
    this.rawQueryValue = "";
    // this.generalForm.get('rawQuery')!.reset();
     this.generalForm.get('rawQuery')!.setValue("");
  }
  onClearDimensionRawQuery() {
    this.rawQueryDimensionValue = "";
    // let dimensionQueryControl = this.generalForm.get('generalForm')
    // let  dimensionQueryControl.get('dimension')!.reset();
    let dimensionFormGroup: any = this.generalForm.get('dimension');
    dimensionFormGroup.get('rawQuery')!.reset();
  }


  headerTextValueArray: string[] = []; // Array to hold selected header text options
  fieldHeaderPairs: { field: string; headerText: string }[] = []

  onSecondDropdownMeasureChange(eve: any) {

    console.log('eve', eve)

    // const dropdownValue = eve.target.value;
    // const dropdownValue = eve.target.value;
    this.headerTextValue = eve;

    console.log('Selected Fields:', eve);

    // Map selected fields to objects with placeholder header text
    this.fieldHeaderPairs = eve.map((field: any, index: any) => ({
      field,
      headerText: this.headerTextValue[index] || '' // Use the corresponding header text if available
    }));

    console.log('Field-Header Pairs:', this.fieldHeaderPairs);

  }

  onSecondDropdownChange(eve: any) {

    console.log('eve', eve)

    // const dropdownValue = eve.target.value;
    // const dropdownValue = eve.target.value;
    this.headerTextValue = eve;

  }

  onGeneralFormSubmit() {


  }


  onAddColumnToTable() {
    const fieldDetailsForm: any = this.generalForm.get('fieldDetails');

    console.log('Field-Header Pairs onAddColumnToTable:', this.fieldHeaderPairs);

    if (fieldDetailsForm) {
      let formObject = fieldDetailsForm.value;
      console.log(formObject);

      if (!this.fieldDetailsArray) {
        this.fieldDetailsArray = [];
      }

      // Adding index or serial number
      formObject = {
        ...formObject,
        index: this.fieldDetailsArray.length + 1 // Assigning index based on array length
      };

      const startIndex = this.fieldDetailsArray.length + 1;

      const updatedFieldDetails = this.fieldHeaderPairs.map((pair, index) => {
        console.log('pair', pair)
        return {

          "index": startIndex + index,
          "tableName": formObject.tableName,
          "field": pair.field, // Using field from fieldHeaderPairs
          'headerText': pair.headerText, // Using headerText from fieldHeaderPairs
          "textAlign": formObject.textAlign,
          "type": formObject.type,
          "format": formObject.format,
          "expression": formObject.expression,
          "width": formObject.width ? formObject.width : 60,
          "textFormatterView": formObject.textFormatterView,
          "enableHyperlink": formObject.enableHyperlink,
          "visible": formObject.visible,
          "isFrozen": formObject.isFrozen,
          "comment_column" : formObject.comment_column,
          "unique_column_field" : formObject.unique_column_field
        };
      });



      console.log('updatedFieldDetails:', updatedFieldDetails);

      // this.fieldDetailsArray.push(formObject);
      this.fieldDetailsArray.push(...updatedFieldDetails);

      this.fieldDetailsArray = [...this.fieldDetailsArray]
      console.log(this.fieldDetailsArray);

      // Resetting form controls
      for (const controlName in fieldDetailsForm.controls) {
        if (controlName !== 'tableName' && controlName !== 'textAlign' && controlName !== 'visible') {
          // Replace with the actual field name
          fieldDetailsForm.controls[controlName].reset();
        }
      }

      // Triggering change detection
      this.changeDetectorRef.detectChanges();

    } else {
      // Handle if fieldDetailsForm is not found
    }
  }


  conditionValue: any = "";
  rawQueryValue: any = "";

  addTextOld(event: any) {
    const currentText = this.conditionValue;
    const selectedValue = this.generalForm.get('tableName')!.value;
    console.log(selectedValue)
    console.log(currentText)
    const operator = event.target.value;

    if (operator) {
      const updatedText = `${currentText} ${operator}`;
      this.conditionValue = updatedText;
    }
  }

  cursorConditionPosition: number = 0;
  cursorPosition: number = 0;
  dimensioncursorPosition: number = 0;

  updateCursorPositionCondition(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;
    this.cursorConditionPosition = textarea.selectionStart;
  }
  updateCursorPosition(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;
    this.cursorPosition = textarea.selectionStart;
  }

  updateDimensionCursorPosition(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;
    this.dimensioncursorPosition = textarea.selectionStart;
  }


  addText(event: any) {
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
    const selectedValue = this.generalForm.get('tableName')!.value;
    console.log(selectedValue)
    console.log(currentText)
    const operator = event.target.value;

    if (operator) {
      const updatedText = `${currentText} ${operator}`;
      this.rawQueryValue = updatedText;
    }
  }

  addRawQueryTextwithoutspace(event: any) {
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


  rawQueryDimensionValue: string = '';


  addRawQueryDimensionTextOld(event: any) {
    const operator = event.target.value; // Value from the button
    const currentText = this.rawQueryDimensionValue;

    if (operator) {
      // Insert the operator at the cursor position
      const beforeCursor = currentText.slice(0, this.dimensioncursorPosition);
      const afterCursor = currentText.slice(this.dimensioncursorPosition);
      this.rawQueryDimensionValue = `${beforeCursor}${operator}${afterCursor}`;

      // Update the cursor position to be after the newly inserted operator
      this.dimensioncursorPosition += operator.length;

      // Optionally, restore focus to the textarea
      const textarea = document.getElementById("pop_chart_rawQuery") as HTMLTextAreaElement;
      if (textarea) {
        textarea.focus();
        textarea.setSelectionRange(this.dimensioncursorPosition, this.dimensioncursorPosition);
      }
    }
  }

  addRawQueryDimensionText(event: any) {
    const operator = event.target.value; // Value from the button
    const currentText = this.rawQueryDimensionValue;

    if (operator) {
      // Add space before and after the operator
      const operatorWithSpaces = ` ${operator} `;

      // Insert the operator (with spaces) at the cursor position
      const beforeCursor = currentText.slice(0, this.dimensioncursorPosition);
      const afterCursor = currentText.slice(this.dimensioncursorPosition);
      this.rawQueryDimensionValue = `${beforeCursor}${operatorWithSpaces}${afterCursor}`;

      // Update the cursor position to be after the newly inserted operator (including spaces)
      this.dimensioncursorPosition += operatorWithSpaces.length;

      // Optionally, restore focus to the textarea and set the cursor position
      const textarea = document.getElementById("pop_chart_rawQuery") as HTMLTextAreaElement;
      if (textarea) {
        textarea.focus();
        textarea.setSelectionRange(this.dimensioncursorPosition, this.dimensioncursorPosition);
      }
    }
  }




  editColumnObjIndex: any


  onEditColumn(obj: any, id: any) {
    //  debugger
    let fieldDetailsControl = this.generalForm.get('fieldDetails');
    this.editColumnObjIndex = id;
    this.onTableDropdown(obj.tableName)


    fieldDetailsControl?.patchValue(obj)


    this.showUpdateButton = true;
    this.showAddButton = false;

  }

  onUpdateObj() {
    const updatedObj = this.generalForm.get('fieldDetails')!.value;
    let fieldDetailsControl: any = this.generalForm.get('fieldDetails');

    console.log('this.editColumnObjIndex', this.editColumnObjIndex, updatedObj)

    let obj = {
      "index": 1,
      "tableName": "kalyani_vinreport",
      "field": [
        "id"
      ],
      "headerText": "total id",
      "textAlign": "Left",
      "type": "",
      "format": "",
      "expression": "",
      "width": 60,
      "textFormatterView": false,
      "enableHyperlink": false,
      "visible": true,
      isFrozen : true,
      comment_column : false,
      unique_column_field : ''
    }

    if (Array.isArray(updatedObj.field)) {
      // If `field` is an array, take the first element as the field name
      updatedObj.field = updatedObj.field[0] || ''; // Default to an empty string if the array is empty
    }


    console.log('updatedObj', updatedObj)

    this.fieldDetailsArray.splice(this.editColumnObjIndex, 1, updatedObj);

    for (const controlName in fieldDetailsControl.controls) {
      if (controlName !== 'tableName' && controlName !== 'textAlign') { // Replace with the actual field name
        //if (controlName !== 'tableName' &&  controlName !== 'textAlign' && controlName !== 'visible' ) { // Replace with the actual field name
        fieldDetailsControl.controls[controlName].reset();
      }

    }
    // console.log(updatedObj, this.fieldDetailsArray)

    this.fieldDetailsArray = [...this.fieldDetailsArray]
    this.showUpdateButton = false;
    this.showAddButton = true;
  }

  onDeleteColumn(id: any) {
    // console.log(id);
    this.fieldDetailsArray.splice(id, 1)
  }

  submitGroupingButton: boolean = true;
  updateGroupingButton: boolean = false;

  onAddGrouping() {
    const dimensionFormGroup: any = this.generalForm.get('dimension');
    const newObject: any = dimensionFormGroup?.value || {};

    this.dimensionGroupingArray = this.dimensionGroupingArray ? this.dimensionGroupingArray : []


    // Check if the maximum number of objects (4) has been reached
    if (this.dimensionGroupingArray.length >= 10) {
      console.error('Maximum number of groupings reached.');
      return;
    }

    let newLevel: number;

    // If the array is empty, set the level to 0
    if (this.dimensionGroupingArray.length === 0) {
      newLevel = 0;
    } else {
      // Find the maximum level and increment it
      const maxLevel = Math.max(...this.dimensionGroupingArray.map((obj: any) => obj.level));
      newLevel = maxLevel + 1;
    }

    let obj = {
      "tableName": newObject.tableName || '',
      "fieldName": newObject.fieldName || '',
      "level": newLevel,
      "rawQuery": newObject.rawQuery ? newObject.rawQuery.trim() : "",
      "levelTitle": newObject.levelTitle ? newObject.levelTitle.trim() : ""
    };

    this.dimensionGroupingArray.push(obj);

    this.submitGroupingButton = true;
    this.updateGroupingButton = false;

    console.log(' this.dimensionGroupingArray', this.dimensionGroupingArray)

    // Reset form controls except for 'tableName'
    for (const controlName in dimensionFormGroup.controls) {
      if (controlName !== 'tableName') {
        dimensionFormGroup.controls[controlName].reset();
      }
    }
  }


  onUpdateDimensionSeries() {
    let measureConrolValue = this.generalForm.get('dimension')?.value || {};
    console.log(measureConrolValue)

    let level = measureConrolValue.level || 0;

    // Check if level is a string and needs conversion
    if (typeof level === 'string') {
      level = +level; // Convert to number
    }

    // Ensure level is a valid number
    if (isNaN(level)) {
      level = 0;
    }

    let obj = {
      "tableName": measureConrolValue.tableName || '',
      "fieldName": measureConrolValue.fieldName || '',
      "labelName": measureConrolValue.labelName || '',
      "level": level, // Use the processed level value
      "expression": "",
      "rawQuery": measureConrolValue.rawQuery ? measureConrolValue.rawQuery.trim() : "",
      "levelTitle": measureConrolValue.levelTitle ? measureConrolValue.levelTitle.trim() : "",

    };

    console.log(obj)
    this.dimensionGroupingArray.splice(this.editDimensionSeriesIndex, 1, obj);
    this.submitGroupingButton = true;
    this.updateGroupingButton = false;

    const dimensionFormGroup = this.generalForm.get('dimension');
    if (dimensionFormGroup instanceof FormGroup) {
      for (const controlName in dimensionFormGroup.controls) {
        if (controlName !== 'tableName') {
          dimensionFormGroup.controls[controlName].reset();
        }
      }
    }

  }



  selectedDimensionItemLevel: any;
  selectedDimentiontemIndex: any;
  selectedDimensionItem: any;

  onOpenrawQuery(item: any, index: any, level: any) {
    this.selectedDimensionItemLevel = level;
    this.selectedDimentiontemIndex = index;
    this.selectedDimensionItem = item;

    // Assuming dashboardCreationForm is an instance of FormGroup in your component
    const dimensionFormGroup: any = this.generalForm.get('dimension');

    // Check if rawQuery value exists for the given level in the item
    const rawQueryValue = item?.rawQuery && item.level === level ? item.rawQuery : '';

    // Patch the value into the form
    dimensionFormGroup.patchValue({
      // rawQuery: rawQueryValue
      rawQuery: rawQueryValue
    });

    this.showRawQueryDimensionDialog = true;
    console.log(item, index, level);
  }

  onOkButtonClick() {
    // Get the value from the textarea
    const newValue = this.generalForm.value.dimension.rawQuery;
    const newObj = this.generalForm.value;
    console.log(newValue)


    // Update the array at the specified level and index
    if (this.dimensionGroupingArray && this.dimensionGroupingArray[this.selectedDimentiontemIndex]) {
      this.dimensionGroupingArray[this.selectedDimentiontemIndex].rawQuery = newValue || '';
    }

    console.log(this.dimensionGroupingArray)
    // Reset the selected item level and index
    this.selectedDimensionItemLevel = null;
    this.selectedDimentiontemIndex = null;

    this.generalForm.patchValue({
      dimension: {
        rawQuery: '',
        // Add other properties if necessary
      }
    });

    // Close the dialog
    this.showRawQueryDimensionDialog = false;
  }


  editDimensionSeriesIndex: any
  onEditDiemsionSeries(item: any, id: any) {
    console.log(item)
    this.editDimensionSeriesIndex = id;
    this.updateGroupingButton = true;
    this.submitGroupingButton = false;
    // this.onTableDropdown(item.tableName)
    let measureControl = this.generalForm.get('dimension');
    // let measureControl = dashboardObjControl!.get('measure');

    measureControl?.patchValue(item)
  }

  onDeleteDiemnsionSeries(id: any, ele: any) {
    this.dimensionGroupingArray.splice(id, 1)
  }



  filterArrayByKeyNames(array: any[], keyNames: string[]): any[] {
    return array.map((obj) => {
      let newObj: any = {};
      keyNames.forEach((key) => {
        newObj[key] = obj[key];
      });
      return newObj;
    });
  }
  // onRowDrag(eve: any) {
  //   // Destructure for clarity
  //   const { fromIndex, dropIndex } = eve;

  //   // Ensure valid indices (within array bounds)
  //   if (fromIndex < 0 || fromIndex >= this.fieldDetailsArray.length ||
  //     dropIndex < 0 || dropIndex >= this.fieldDetailsArray.length) {
  //     console.warn('Invalid drag indices. Skipping interchange.');
  //     return;
  //   }

  //   // Create a copy to avoid mutation of original array
  //   const updatedArray = this.fieldDetailsArray.slice();

  //   const tempIndex = updatedArray[fromIndex].index;
  //   updatedArray[fromIndex].index = updatedArray[dropIndex].index;
  //   updatedArray[dropIndex].index = tempIndex;

  //   // Swap elements using destructuring assignment
  //   [updatedArray[fromIndex], updatedArray[dropIndex]] = [updatedArray[dropIndex], updatedArray[fromIndex]];

  //   // Update the original array with the modified order
  //   this.fieldDetailsArray = updatedArray;

  //   console.log('Updated fieldDetailsArray:', this.fieldDetailsArray);
  // }
  scrollSpeed = 5;
  onDragStart(eve: any) {
    // console.log('eve',eve)
    let gridElement = document.querySelector(' #mesureGrid .e-gridcontent .e-content') as HTMLElement; // Grid content container
    // console.log('gridElement', gridElement)
    const gridRect = gridElement.getBoundingClientRect();
    // console.log('gridRect', gridRect)

    if (eve.originalEvent.event.clientY < gridRect.top + 50) {
      gridElement.scrollTop -= this.scrollSpeed; // Scroll up
    }

    // Check if the cursor is near the bottom of the grid
    if (eve.originalEvent.event.clientY > gridRect.bottom - 50) {
      gridElement.scrollTop += this.scrollSpeed; // Scroll down
    }

  }

  onRowDrag(eve: any) {
    // Destructure for clarity
    const { fromIndex, dropIndex } = eve;

    // Ensure valid indices (within array bounds)
    if (fromIndex < 0 || fromIndex >= this.fieldDetailsArray.length ||
      dropIndex < 0 || dropIndex >= this.fieldDetailsArray.length) {
      console.warn('Invalid drag indices. Skipping interchange.');
      return;
    }

    // Create a copy to avoid mutation of the original array
    const updatedArray = this.fieldDetailsArray.slice();

    // Extract the dragged item
    const draggedItem = updatedArray.splice(fromIndex, 1)[0];

    // Insert the dragged item at the new position
    updatedArray.splice(dropIndex, 0, draggedItem);

    // Reassign indices to reflect the new order, starting from 1
    updatedArray.forEach((item, index) => {
      item.index = index + 1;
    });

    // Update the original array with the modified order
    this.fieldDetailsArray = updatedArray;

    // console.log('Updated fieldDetailsArray:', this.fieldDetailsArray);
    //  console.log('dropIndex', dropIndex)

    //  if (dropIndex === 0) {
    //   let gridContent = document.querySelector('.e-gridcontent') as HTMLElement;
    //   console.log('gridContent', gridContent)
    //   console.log('gridContent.scrollTop', gridContent.scrollTop)
    //   if (gridContent) {


    //     gridContent.scrollTop = 0;  // Move the scrollbar to the top
    //     console.log('gridContent.scrollTop', gridContent.scrollTop)

    //   }
    // }


  }

  onRowDragMove(eve: any) {
    const gridElement = document.querySelector('.e-grid');

    if (!gridElement) return;

    const gridRect = gridElement.getBoundingClientRect();
    const scrollThreshold = 100;  // The distance from the edge to trigger scrolling

    // console.log(gridElement)
    if (eve.pageY - gridRect.top < scrollThreshold) {
      // Scroll up
      gridElement.scrollTop -= 20;
    } else if (gridRect.bottom - eve.pageY < scrollThreshold) {
      // Scroll down
      gridElement.scrollTop += 20;
    }
  }

  selectedFieldNameModel: any;
  fields: { text: string; value: string } = { text: 'value', value: 'value' };
  editRecord(data: any) {
    console.log(' Data in edit', data);
    console.log('selectedTableFieldName', this.selectedTableFieldName)

    const adjustedIndex = data.index - 1;

    let fieldDetailsControl = this.generalForm.get('fieldDetails');
    this.editColumnObjIndex = adjustedIndex;

    let obj = {
      tableName: data.tableName || '', // Keeping the same tableName as in the form
      index: data.index || '', // Using field from fieldHeaderPairs
      headerText: data.headerText || '', // Using headerText from fieldHeaderPairs
      textAlign: data.textAlign || 'Left', // Default value, can be adjusted as needed
      type: data.type || '', // Default value, can be updated
      format: data.format || '', // Default value, can be updated
      expression: data.expression || '', // Default value, can be updated
      width: data.width || 60, // Default value, can be updated
      textFormatterView: data.textFormatterView != null ? data.textFormatterView : false, // Default value, can be updated

      enableHyperlink: data.enableHyperlink != null ? data.enableHyperlink : false,
      visible: data.visible != null ? data.visible : true ,// Default value, can be adjusted
      isFrozen: data.isFrozen != null ? data.isFrozen : false, // Default value, can be adjusted
      comment_column : data.comment_column != null ? data.comment_column : false,
      unique_column_field : data.unique_column_field || ''
      
    }


    fieldDetailsControl?.patchValue(obj)
    // this.onTableDropdown(data.tableName)

    //  this.selectedFieldNameModel = [data.field];

    this.editFieldName = data.field
    this.headerTextValue = data.headerText;

    console.log('selectedFieldNameModel', this.selectedFieldNameModel)


    // const fieldControl = fieldDetailsControl?.get('field');
    // fieldControl?.setValue(data.field);

    this.showUpdateButton = true;
    this.showAddButton = false;

  }
  deleteRecord(data: any) {
    // console.log(data)
    // console.log(this.fieldDetailsArray)
    const adjustedIndex = data.index - 1;


    let updateArr = this.fieldDetailsArray.filter((ele: any) => ele.index != data.index)

    // const updatedArray = this.fieldDetailsArray.slice(0, adjustedIndex).concat(this.fieldDetailsArray.slice(adjustedIndex + 1));
    this.fieldDetailsArray = updateArr;
    // console.log(this.fieldDetailsArray)


  }



  dataBound(grid: GridComponent) {
    grid.autoFitColumns([])
    setTimeout(() => {
      if (typeof grid.hideSpinner === 'function') {
        grid.hideSpinner();
      }
    });
  }

  headerFeildDetailsArray : any = [];
  editingIndex : any;

  addHeaderConditionFormattingold(){
    let fieldDetailsControl = this.generalForm.get('headerConditonalFormatting');
    let formValue = fieldDetailsControl?.value
    if (formValue && formValue.fontSize) {
      // Ensure fontSize has "px" if it's not already included
      formValue.fontSize = `${formValue.fontSize}px`;
    }
  
    console.log('Updated fieldDetailsControl', formValue);
    this.headerFeildDetailsArray.push(formValue);

  }

  addHeaderConditionFormatting() {
    const fieldDetailsControl = this.generalForm.get('headerConditonalFormatting');
    const formValue = fieldDetailsControl?.value;

    console.log('formValue', formValue)
  
    if (formValue && formValue.fieldName && Array.isArray(formValue.fieldName)) {
      const selectedFieldNames = formValue.fieldName;
  
      selectedFieldNames.forEach((field: string) => {
        const item = {
          fieldName: field,
          backgroundColor: formValue.backgroundColor,
          color: formValue.color,
          fontSize: formValue.fontSize ? `${formValue.fontSize}px` : '',
          fontStyle: formValue.fontStyle,
          fontWeight: formValue.fontWeight
        };
        this.headerFeildDetailsArray.push(item);
      });
  
      console.log('Updated headerFeildDetailsArray:', this.headerFeildDetailsArray);
      fieldDetailsControl.reset()
    }
  }

  

// âœ… Update an existing field
onUpdateHeaderConditonalFormatting() {

  const formattingConditonForm: any = this.generalForm.get('headerConditonalFormatting');
  let updatedObj: any = this.generalForm.get('headerConditonalFormatting')!.value;
  let defaultFontSize = `${updatedObj.fontSize || 12}px`;

  updatedObj  = {
    fieldName: updatedObj.fieldName,
    backgroundColor:  updatedObj.backgroundColor,
    color:  updatedObj.color,
    fontSize:  defaultFontSize,
    fontStyle: updatedObj.fontStyle,
    fontWeight: updatedObj.fontWeight
  }
  this.headerFeildDetailsArray.splice(this.editingIndex, 1, updatedObj);
  formattingConditonForm?.reset()

  this.showUpdateHeaderConditionBtn = false;
  this.showAddHeaderConditionBtn = true;

  // if (this.editingIndex !== null) {
  //   let updatedValue = { ...this.generalForm.value };

  //   // Ensure fontSize has "px" if it's missing
  //   if (updatedValue.fontSize && !updatedValue.fontSize.endsWith('px')) {
  //     updatedValue.fontSize = `${updatedValue.fontSize}px`;
  //   }

  //   this.headerFeildDetailsArray[this.editingIndex] = {
  //     id: this.headerFeildDetailsArray[this.editingIndex].id,
  //     ...updatedValue
  //   };

  //   this.editingIndex = null;
  // }
}

showAddHeaderConditionBtn : boolean = true;
showUpdateHeaderConditionBtn : boolean = false;

onEdit(index: number, item : any) {
  this.editingIndex = index;
  console.log('item', item)

  this.showUpdateHeaderConditionBtn = true;
  this.showAddHeaderConditionBtn = false;

  let fontSize = item.fontSize?.replace('px', '') || ''
  let formObj =  this.generalForm;

  formObj.patchValue({
    headerConditonalFormatting: {
      fieldName: item.fieldName || '',
      backgroundColor:  item.backgroundColor || '#ffffff',
      color:  item.color || '#000000',
      fontSize:  fontSize || '16',
      fontStyle: item.fontStyle || 'normal',
      fontWeight: item.fontWeight || 'normal'
    }
  
  })

}




  // Delete Entry
  onDelete(index: number) {
    this.headerFeildDetailsArray.splice(index, 1);
  }



  onTableFormSubmit() {
    console.log(this.generalForm.value);
    let formValue = this.generalForm.value;

    if (this.generalForm.invalid) {
      console.log(this.generalForm.invalid);
      this.generalForm.markAllAsTouched();  // This will show validation messages for all invalid fields
      return false; // Return false if the form is invalid
    }


    let fieldName = this.fieldDetailsArray?.map((ele: any) => ele.field);
    // console.log(fieldName)
    const filteredArray = this.filterArrayByKeyNames(this.dataSourceArray, fieldName);
    this.dataSourceArray = filteredArray;

    let panelId = this.getPanelObj.id
    let id = panelId + "_tbl_" + this.idCount;

    let panelsArrData: any = sessionStorage.getItem('createPanelSeriesArray');
    // let panelsArrData: any = localStorage.getItem('createPanelSeriesArray');
    this.panelSeriesArray = panelsArrData;

    if (this.panelSeriesArray != null) {
      this.panelSeriesArray = JSON.parse(this.panelSeriesArray)
      let object = this.panelSeriesArray.find((ele: any) => ele.id === this.getPanelObj.id);


      const matchingObjectIndex = Array.isArray(this.panelSeriesArray)
        ? this.panelSeriesArray.findIndex(obj => obj.id === this.getPanelObj.id)
        : -1;
      this.fieldDetailsArray = this.fieldDetailsArray?.map((obj, index) => {
        return {
          ...obj,
          index: index + 1 // Add the index property with a value of index + 1
        };
      });

      const dimension = this.dimensionGroupingArray?.length > 0
        ? { levels: this.dimensionGroupingArray }
        : {};


      let totalObj: any = {
        "tableName": formValue.tableName,
        "title": formValue.header,
        "height": "100%",
        "width": "100%",
        "fieldDetails": this.fieldDetailsArray ? this.fieldDetailsArray : [],
        "headerConditonalFormatting": this.headerFeildDetailsArray ? this.headerFeildDetailsArray : [],
        "dataSource": [],
        "allowSorting": true,
        "is_pagination_enabled": formValue.is_pagination_enabled != null ? formValue.is_pagination_enabled : true,
        "allowWrapping": formValue.allowWrapping != null ? formValue.allowWrapping : false,
        "allowResizing": true,
        "allowTextWrap": true,
        "showColumnMenu": true,
        "groupSettings": {
          "showGroupedColumn": true
        },
        "allowFiltering": true,
        "enableStickyHeader": true,
        "dimension": dimension,
        "formattingCondition": this.conditionalFormatSettingsArray ? this.conditionalFormatSettingsArray : [],
        "autoFitColumns": formValue.autoFitColumns != null ? formValue.autoFitColumns : false,
        "allowGrouping": formValue.allowGrouping != null ? formValue.allowGrouping : false,
        "enableBorders" : formValue.enableBorders != null ? formValue.enableBorders : false,
         enableTooltip : formValue.enableTooltip != null ? formValue.enableTooltip : false,
        "rawQuery": formValue.rawQuery || '',
        "orderBy": formValue.orderBy || [],
        "orderByType": formValue.orderByType || '',
        "groupBy": formValue.groupBy || [],
        "conditions": (formValue.conditions === "" || formValue.conditions === undefined) ? "" : formValue.conditions
      };

      if (formValue.is_pagination_enabled) {
        totalObj["table_pagination"] = {
          "items_per_page": 50,
          "total_pages": null,
          "total_records": null,
          "current_page": 1
        };
      }

      let tableObjApi = {
        "object_id": this.getPanelObj.id,
        "object_setup": {
          "content": {
            ...totalObj,
          }
        },
        "object_type": "table",
        "connection_id": this.connection_id,
      };

      console.log(totalObj)
      console.log(tableObjApi)

      if (matchingObjectIndex !== -1) {
        // Update the existing object with the new data
        this.panelSeriesArray[matchingObjectIndex] = {
          ...this.getPanelObj,
          content: {
            ...totalObj,

          }
        };
      }

      console.log(this.panelSeriesArray)

      let boxObj = this.panelSeriesArray[matchingObjectIndex];
      console.log(boxObj)
      sessionStorage.setItem('createPanelSeriesArray', JSON.stringify(this.panelSeriesArray));

      let tableData = this.chartService.objectPivotCreate(tableObjApi);
      console.log(tableObjApi)

      tableData.subscribe(
        (res: any) => {
          console.log("res", res);

          if (res.success === true) {
            let resobj = res['data'];
            let data = resobj.object_setup.content;

            let dataSource = new DataManager({
              json: data.dataSource,
              adaptor: new UrlAdaptor()
            });


            let selecteddatasource = data.dataSource;


            const dataSourceKeys = data.dataSource && data.dataSource.length > 0
              ? Object.keys(data.dataSource[0])
              : []; // Return an empty array if dataSource is empty

            const filteredFieldDetails = data.fieldDetails
              ? data.fieldDetails.filter((fieldDetail: any) => dataSourceKeys.includes(fieldDetail.field))
              : [];

            let updateObj = {

              ...this.getPanelObj,
              header: formValue.header,
              content: {
                id: "tbl_" + this.idCount,
                // dataSource: dataSource,
                ...data,
                fieldDetails: filteredFieldDetails ? filteredFieldDetails : [],
                matchedFieldDetails: data.fieldDetails
              }
            };

            console.log('updateObj', updateObj)
            console.log('dataSource', dataSource)
            console.log('dataSourceKeys', dataSourceKeys, filteredFieldDetails)

            this.sendBoxObj.emit({ boxObj: updateObj, resObj: { resSuccess: res.success, resMessage: res.message, statusCode: res.status_code } });

            this.generalForm.reset()
          } else {
            let boxObj = this.panelSeriesArray[matchingObjectIndex];

            this.sendBoxObj.emit({ boxObj: boxObj, resObj: { resSuccess: false, resMessage: res.message, statusCode: res.status_code } });
          }

        },

        (err: any) => {
          let boxObj = this.panelSeriesArray[matchingObjectIndex];
          const errorMessage = err.error && err.error.message ? err.error.message : err.message;
          this.sendBoxObj.emit({ boxObj: boxObj, resObj: { resSuccess: false, resMessage: errorMessage, statusCode: err.status } });

        }


      );

    }

    return true;

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

    onCopyRawQueryDimension() {
    const queryText = this.rawQueryDimensionValue || '';

    if (queryText.trim() !== '') {
      navigator.clipboard.writeText(queryText).then(() => {
        this.copyDimensionMessage = "Query copied!";
        setTimeout(() => this.copyDimensionMessage = '', 2000);
      }).catch(err => {
        console.error("Failed to copy: ", err);
        this.copyDimensionMessage = "Failed to copy!";
        setTimeout(() => this.copyDimensionMessage = '', 2000);
      });
    } else {
      this.copyDimensionMessage = "No query to copy!";
      setTimeout(() => this.copyDimensionMessage = '', 2000);
    }
  }


}
