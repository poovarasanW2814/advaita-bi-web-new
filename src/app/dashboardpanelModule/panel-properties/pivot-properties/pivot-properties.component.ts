import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild, inject} from '@angular/core';
import { FormGroup, FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { hide } from '@syncfusion/ej2/treemap';
import { ChartService } from 'src/app/core/services/chart.service';
import { DropDownListModule, MultiSelectModule } from '@syncfusion/ej2-angular-dropdowns';
import { SwitchModule, ButtonModule } from '@syncfusion/ej2-angular-buttons';
import { NgIf, NgFor } from '@angular/common';
import { ColorPickerModule } from '@syncfusion/ej2-angular-inputs';

@Component({
    selector: 'app-pivot-properties',
    templateUrl: './pivot-properties.component.html',
    styleUrls: ['./pivot-properties.component.scss'],
    imports: [FormsModule, ReactiveFormsModule, DropDownListModule, SwitchModule, NgIf, NgFor, MultiSelectModule, ColorPickerModule, ButtonModule]
})


export class PivotPropertiesComponent implements OnInit, OnChanges {
  activeTab: number = 0;
  tabLabels: string[] = ['General', 'Fields', 'Condition', 'Raw Query', 'Cond. Format', 'Header Format', 'Chart Props'];
  selectTab(i: number): void { this.activeTab = i; }

  ddlFields: any = { text: 'text', value: 'value' };

  grandTotalAverageTypeOptions: any[] = [
    { text: 'Average with visible data', value: 'AverageWithZero' },
    { text: 'Average excluding 0', value: 'AverageWithoutZero' },
    { text: 'Average with all data', value: 'AverageWithAllData' }
  ];
  displayOptions: any[] = [
    { text: 'Table', value: 'table' }, { text: 'Chart', value: 'chart' }, { text: 'Both', value: 'both' }
  ];
  chartTypeOptions: any[] = [
    { text: 'Column', value: 'Column' }, { text: 'Bar', value: 'Bar' },
    { text: 'Line', value: 'Line' }, { text: 'Area', value: 'Area' },
    { text: 'Scatter', value: 'Scatter' }, { text: 'Polar', value: 'Polar' },
    { text: 'Stacking Column', value: 'StackingColumn' }, { text: 'Stacking Bar', value: 'StackingBar' },
    { text: 'Stacking Area', value: 'StackingArea' }, { text: 'Stacking Line', value: 'StackingLine' },
    { text: 'Step Line', value: 'StepLine' }, { text: 'Step Area', value: 'StepArea' },
    { text: 'Spline', value: 'Spline' }, { text: 'Spline Area', value: 'SplineArea' },
    { text: 'Stacking Column 100%', value: 'StackingColumn100' }, { text: 'Stacking Bar 100%', value: 'StackingBar100' },
    { text: 'Stacking Area 100%', value: 'StackingArea100' }, { text: 'Stacking Line 100%', value: 'StackingLine100' },
    { text: 'Bubble', value: 'Bubble' }, { text: 'Pareto', value: 'Pareto' },
    { text: 'Radar', value: 'Radar' }, { text: 'Pie', value: 'Pie' },
    { text: 'Doughnut', value: 'Doughnut' }, { text: 'Funnel', value: 'Funnel' },
    { text: 'Pyramid', value: 'Pyramid' }
  ];
  fieldTypeOptions: string[] = ['Column', 'Value', 'Row', 'format'];
  formatTypeOptions: any[] = [
    { text: 'CalculatedField', value: 'CalculatedField' }, { text: 'String', value: 'string' },
    { text: 'Date', value: 'date' }, { text: 'Number', value: 'Number' },
    { text: 'Currency', value: 'Currency' }, { text: 'Percentage', value: 'Percentage' }
  ];
  sortingOrderOptions: string[] = ['Ascending', 'Descending'];
  sortingTypeOptions: any[] = [
    { text: 'Alphabetical', value: 'string' }, { text: 'Alphanumeric', value: 'number' }
  ];
  pivotConditionOptions: any[] = [
    { text: 'Less Than', value: 'LessThan' }, { text: 'Between', value: 'Between' },
    { text: 'Less Than Or Equal To', value: 'LessThanOrEqualTo' },
    { text: 'Greater Than', value: 'GreaterThan' },
    { text: 'Greater Than Or Equal To', value: 'GreaterThanOrEqualTo' },
    { text: 'Equals', value: 'Equals' }, { text: 'Not Equals', value: 'NotEquals' }
  ];
  referenceValueOptions: any[] = [
    { text: 'Grand Total', value: 'grandTotal' }, { text: 'Grand Average Total', value: 'grandAverage' }
  ];
  fontStyleOptions: any[] = [
    { text: 'Normal', value: 'normal' }, { text: 'Italic', value: 'italic' }, { text: 'Bold', value: 'bold' }
  ];
  fontWeightOptions: any[] = [
    { text: '100', value: '100' }, { text: '200', value: '200' }, { text: '300', value: '300' },
    { text: '400 (Normal)', value: '400' }, { text: '500', value: '500' }, { text: '600', value: '600' },
    { text: '700 (Bold)', value: '700' }, { text: '800', value: '800' }, { text: '900', value: '900' }
  ];
  scrollbarPercentageOptions: any[] = [
    { text: '1%', value: '0.01' }, { text: '2%', value: '0.02' }, { text: '3%', value: '0.03' },
    { text: '4%', value: '0.04' }, { text: '5%', value: '0.05' }, { text: '6%', value: '0.06' },
    { text: '7%', value: '0.07' }, { text: '8%', value: '0.08' }, { text: '9%', value: '0.09' },
    { text: '10%', value: '0.1' }, { text: '20%', value: '0.2' }, { text: '30%', value: '0.3' },
    { text: '40%', value: '0.4' }, { text: '50%', value: '0.5' }, { text: '60%', value: '0.6' },
    { text: '70%', value: '0.7' }, { text: '80%', value: '0.8' }, { text: '90%', value: '0.9' },
    { text: '100%', value: '1' }
  ];

  get pivotFormatOptions(): any[] {
    const ft = this.selectedFormatType;
    if (ft === 'Number') return [
      { text: 'Number (0 decimal)', value: 'N0' }, { text: 'Number (1 decimal)', value: 'N1' },
      { text: 'Number (2 decimals)', value: 'N2' }, { text: 'Number (with commas)', value: '#,##0' }
    ];
    if (ft === 'Currency') return [
      { text: 'Currency (0 decimal)', value: 'C0' }, { text: 'Currency (1 decimal)', value: 'C1' },
      { text: 'Currency (2 decimals)', value: 'C2' }
    ];
    if (ft === 'Percentage') return [
      { text: 'Percentage (0 decimal)', value: 'P0' }, { text: 'Percentage (1 decimal)', value: 'P1' },
      { text: 'Percentage (2 decimals)', value: 'P2' },
      { text: 'Percent (0 decimal)', value: "###0 '%'" }, { text: 'Percent (1 decimal)', value: "###0.0 '%'" },
      { text: 'Percent (2 decimals)', value: "###0.00 '%'" }, { text: 'Percent (3 decimals)', value: "###0.000 '%'" }
    ];
    if (ft === 'date') return [
      { text: 'Month', value: 'MMMM' }, { text: 'Year', value: 'yyyy' },
      { text: 'Year-Month', value: 'yyyy-MMM' }, { text: 'Month-Year', value: 'MMM-yyyy' },
      { text: 'Year-Month-Date', value: 'yyyy-MM-dd' }, { text: 'Month-Year-Date', value: 'MM-yyyy-dd' },
      { text: 'Date/Month/Year', value: 'dd/MM/yyyy' }, { text: 'YYYY-mmm-dd', value: 'yyyy-MMM-dd' },
      { text: 'Date/Month/Year hh:mm', value: 'dd/MM/yyyy hh:mm' }
    ];
    return [];
  }


  @ViewChild('defaultDialog')
  defaultDialog!: DialogComponent;

  @Input() getPanelType: any;
  @Input() getPanelObj: any;
  @Output() sendTableObj = new EventEmitter()
  @Output() sendBoxObj = new EventEmitter()

  expressionFlag: boolean = false;
  headerText: any = [{ text: "General" }, { text: "Fields" },
  { text: "Condition" }, { text: "Raw Query" }, { text: "Conditional Formatting" },{text:"Header Formatting"},{text:"Chart Props"}];
  fieldDetailsArray: any[] = [];
  dataSourceArray: any[] = [];
  ApiPanelSeriesArray: any = [];
  generalForm!: FormGroup;
  showUpdateButton: boolean = false;
  showAddButton: boolean = true;
  columnsArray: any = [];
  rowsArray: any = [];
  valuesArray: any = [];
  tableNamesArray: string[] = [];
  selectedTableFieldName: any = [];
  formatSettingsArray: any = [];
  sortSettings: any = [];
  selectedConditionType!: string;
  showConditionAddBtn: boolean = true;
  updateConditonBtn: boolean = false;

  tableNameObj: any;
  feildNameControlName!: string;
  labelNameControlName!: string;

  count: any = 0;
  connection_id!: number;

  headers : any[] = ['Column', "Row", "Value"]

  povitObjData: any = {
    id: "",
    showGroupingBar: true,
    allowDrillThrough: true,
    showFieldList: true,
    allowConditionalFormatting: true,
    tableName: "",
    orderBy: [],
    orderByType: '',
    groupBy: [],
    condition: "",
    fieldHeaders : [],
    headerFormatting: [], 
    dataSourceSettings: {
      dataSource: [],
      columns: [],
      values: [],
      rows: [],
      formatSettings: [{ name: "", format: "C0" }],
      expandAll: false,
      showGrandTotals: true,
      showGrandAvg: false,
      rowWiseAvg : false,
      showRowGrandTotals: false,
      showColumnGrandTotals: true,
      enableSorting: false,
    }
  }
  panelSeriesArray: any = [];

  private readonly fb = inject(FormBuilder);
  private readonly chartService = inject(ChartService);
  constructor() {
    this.generalForm = this.fb.group({
          tableName: [''],
          header: [''],
          orderBy: [''],
          orderByType: [''],
          groupBy: [""],
          condition: [""],
          rawQuery: [""],
          showGrandTotals: [false],
          showGrandAvg: [false],
          rowWiseAvg :[false],
          expandAll: [false],
          enableClassicLayout : [false],
          showRowGrandTotals: [false],
          showColumnGrandTotals: [false],
          grandTotalAverageType: [''],
          colorFormatSettingsArray: [''],
          fieldHeaders : [''],
          enableHeaderAlignment : [false],
          enableSorting : [false],
          // sortSettings
          defaultView: [''],
          chartType : [''],
          enableZoom : true,
          scrollbarPercentage: 1,
          enableScrollbar: true,
          hideXAxisTitle: [false],
          hideYAxisTitle: [false],
          xAxisTitleFontSize: [14],
          yAxisTitleFontSize: [14], 
          dataSourceSettings: this.fb.group({
            dataSource: [],
            tableName: [''],
            feildType: [''],
            name: [''],
            caption: [''],
            format: [''],
            expression: [''],
            formatType: [''],
            valueFormat: [''],
            order : ['string'],
            dataType : ['']
            // formattingconditon: [''],
            // value: [''],
            // backgroundColor  : [''],
            // color  : [''],
            // fontSize  : [''],
  }),
      formattingCondition: this.fb.group({
        measureField: [''],
        value1: [],
        value2: [],
        value3: [],
        referenceFieldName: [],
        conditionFormat: [],
        BackgroundColor: [''],
        Fontcolor: [''],
        fontSize: [''],
        fontFamily: ['Tahoma']
      }),
      headerConditonalFormatting: this.fb.group({
        fieldName: [''],
        backgroundColor: ['#9ced81'],
        color: ['#000000'],
        fontSize: ['16'],
        fontStyle: ['normal'],
        fontWeight: ['normal']
      })
    })
  }



ngOnChanges(changes: SimpleChanges): void {
    let currentValue = changes['getPanelObj'].currentValue;
    if (currentValue != undefined || currentValue != null) {
      // this.activeTab = 0;
        this.activeTab = 0;
      console.log('panel changed obj', currentValue)
      this.getPanelObj = currentValue;
      let panelObj = this.getPanelObj;

      if (panelObj.content != null || panelObj.content != undefined) {

        let panelsArrData: any = sessionStorage.getItem('createPanelSeriesArray');
        // let panelsArrData: any = localStorage.getItem('createPanelSeriesArray');
        this.panelSeriesArray = panelsArrData

        if (this.panelSeriesArray) {
          this.panelSeriesArray = JSON.parse(this.panelSeriesArray);
          const matchingPanel = this.panelSeriesArray.find((panel: any) => panel.id === currentValue.id);

          if (matchingPanel) {
            this.connection_id = this.getPanelObj.connection_id
            // this.getPanelObj = matchingPanel;


            this.getPanelObj = {
              ...matchingPanel,
              connection_id: this.connection_id, // Preserve the original connection_id
            };

            console.log('getPanelObj', this.getPanelObj.content)

            // this.conditionalFormatSettingsArray = this.getPanelObj.content.colorFormatSettingsArray ? this.getPanelObj.content.colorFormatSettingsArray : []
            
            // if (this.getPanelObj.content.headerFormatting) {
            //   this.headerFeildDetailsArray = this.getPanelObj.content.headerFormatting;
            // } else {
            //   this.headerFeildDetailsArray = [];
            // }
            this.conditionalFormatSettingsArray = this.getPanelObj.content.colorFormatSettingsArray ? this.getPanelObj.content.colorFormatSettingsArray : []


            this.generalForm.patchValue({
              header: this.getPanelObj.header || '',
              tableName: this.getPanelObj.content.tableName || '',
              orderBy: this.getPanelObj.content.orderBy || [],
              orderByType: this.getPanelObj.content.orderByType || '',
              groupBy: this.getPanelObj.content.groupBy || [],
              condition: this.getPanelObj.content.condition || '',
              rawQuery: this.getPanelObj.content.rawQuery || '',
              showGrandTotals: this.getPanelObj.content.showGrandTotals != null ? this.getPanelObj.content.showGrandTotals : false,
              showGrandAvg: this.getPanelObj.content.showGrandAvg != null ? this.getPanelObj.content.showGrandAvg : false,
              rowWiseAvg: this.getPanelObj.content.rowWiseAvg != null ? this.getPanelObj.content.rowWiseAvg : false,
              defaultView: this.getPanelObj.content.defaultView || 'table',
              chartType: this.getPanelObj.content.chartType || 'column',
              enableScrollbar: this.getPanelObj.content.enableScrollbar != null ? this.getPanelObj.content.enableScrollbar : false,
              scrollbarPercentage: this.getPanelObj.content.scrollbarPercentage || 0.01,
              enableZoom: this.getPanelObj.content.enableZoom != null ? this.getPanelObj.content.enableZoom : false,
              hideXAxisTitle: this.getPanelObj.content.hideXAxisTitle != null ? this.getPanelObj.content.hideXAxisTitle : false,
              hideYAxisTitle: this.getPanelObj.content.hideYAxisTitle != null ? this.getPanelObj.content.hideYAxisTitle : false,
              xAxisTitleFontSize: this.getPanelObj.content.xAxisTitleFontSize || 14,
              yAxisTitleFontSize: this.getPanelObj.content.yAxisTitleFontSize || 14,
              expandAll: this.getPanelObj.content.expandAll != null ? this.getPanelObj.content.expandAll : false,
              enableClassicLayout : this.getPanelObj.content.enableClassicLayout != null ? this.getPanelObj.content.enableClassicLayout : false,
              fieldHeaders : this.getPanelObj.content.fieldHeaders || [],
              enableHeaderAlignment : this.getPanelObj.content.enableHeaderAlignment || false,
              enableSorting : this.getPanelObj.content.enableSorting || false,
              showRowGrandTotals: this.getPanelObj.content.showRowGrandTotals != null ? this.getPanelObj.content.showRowGrandTotals : false,
              showColumnGrandTotals: this.getPanelObj.content.showColumnGrandTotals != null ? this.getPanelObj.content.showColumnGrandTotals : false,
              grandTotalAverageType: this.getPanelObj.content.grandTotalAverageType || '',

            })

            this.selectedDefaultView = this.getPanelObj.content.defaultView || 'table';
            this.rawQueryValue = this.getPanelObj.content.rawQuery || '';
            this.conditionValue = this.getPanelObj.content.condition || '';
            let fieldDetailsArray  = this.getPanelObj.content.fieldDetails ? this.getPanelObj.content.fieldDetails : [];
            // let fieldDetailsArray = this.fieldDetailsArray
            console.log('fieldDetails', this.fieldDetailsArray)


            this.chartService.getTableNamesArrary(this.connection_id).subscribe((res: any) => {
              let data = res['data'];
              this.tableNamesArray = data;

              // Fetch the field names based on the patched tableName value
              if (this.getPanelObj.content.tableName) {
                this.onTableDropdown(this.getPanelObj.content.tableName);
              }
            });



// Step 1: Create a map of format fields by name

// Step 1: Create a map of format fields by name
const arr: any[] = fieldDetailsArray;

// Step 1: Build format map
const formatMap = new Map();
arr.forEach((obj: any) => {
  if (obj.feildType === "format") {
    formatMap.set(obj.name, obj);
  }
});

// Step 2: Merge format data into non-format objects
arr.forEach((obj: any) => {
    console.log('formatObj', formatMap.has(obj.name))

  if (obj.feildType !== "format" && formatMap.has(obj.name)) {
    const formatObj = formatMap.get(obj.name);
 
    obj.format = formatObj.format;
    obj.expression =    obj.expression ?    obj.expression : formatObj.expression;
    obj.formatType = formatObj.formatType;
    // obj.valueFormat = obj.valueFormat;
  }else{
    // console.log('formatObj not found for', obj.name)
  }
});
console.log('array', arr)

// Step 3: Remove 'format' entries
 this.fieldDetailsArray = arr.filter((obj: any) => obj.feildType !== "format");


          }
        }

      } else {
        console.error('panelObj is null');
      }
    }
  }

  enableVirtualization: boolean = true;
  onClassicLayoutToggle(event: any) {
    const isChecked = event.checked;

    this.generalForm.patchValue({
      enableClassicLayout: isChecked
    });

    this.povitObjData.enableClassicLayout = isChecked;
    this.povitObjData.gridSettings = {
      layout: isChecked ? 'Tabular' : 'Compact'
    };

    this.enableVirtualization = !isChecked;

    console.log('Classic Layout toggled:', isChecked ? 'Tabular' : 'Compact');
    console.log('Virtualization enabled:', this.enableVirtualization);
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
    formObj.patchValue({
      formattingCondition: {
        measureField: item.measure,
        value1: item.value1,
        value2: item.value2,
        value3: item.value3,
        referenceFieldName: item.referenceFieldName,
        conditionFormat: item.conditions,
        BackgroundColor: item.style.backgroundColor,
        Fontcolor: item.style.color,
        fontSize: item.style.fontSize,
        fontFamily: 'Tahoma'

      }
    })
  }

  
  onUpdateConditonObj() {
    const formattingConditonForm: any = this.generalForm.get('formattingCondition');
    let updatedObj: any = this.generalForm.get('formattingCondition')!.value;
    const backgroundColor = this.convertColorToHex(updatedObj.BackgroundColor);
    const fontColor = this.convertColorToHex(updatedObj.Fontcolor);
    updatedObj = {
      measure: updatedObj.measureField,
      value1: updatedObj.value1,
      value2: updatedObj.value2,
      value3: updatedObj.value3,
      referenceFieldName: updatedObj.referenceFieldName,

      conditions: updatedObj.conditionFormat,
      style: {
        backgroundColor: backgroundColor,
        color: fontColor,
        fontSize: updatedObj.fontSize ? updatedObj.fontSize + 'px' : '13px',
        fontFamily: 'Tahoma'

      }
    }
    console.log(updatedObj)
    this.conditionalFormatSettingsArray.splice(this.editColumnObjIndex, 1, updatedObj);

    formattingConditonForm?.reset()

    this.updateConditonBtn = false;
    this.showConditionAddBtn = true;
  }
  // onAddConditionFormat(){
  //   const formattingConditonForm = this.generalForm.get('formattingCondition');

  //   if(formattingConditonForm){
  //     let formObject = formattingConditonForm.value;
  //     console.log(formObject);
  //     let obj : any = {}
  //     if(formObject.conditionFormat == 'Between'){
  //        obj = {
  //         measure: formObject.measureField,
  //         value1: formObject.value1,
  //         value2: formObject.value2,
  //         conditions: formObject.conditionFormat,
  //         style: {
  //           // backgroundColor:  this.convertColorToHex(formObject.BackgroundColor),
  //           // color:  this.convertColorToHex(formObject.Fontcolor),
  //           backgroundColor:  formObject.BackgroundColor,
  //           color: formObject.Fontcolor ,
  //             fontSize : formObject.fontSize ?  formObject.fontSize + 'px' : '12px',
  //             fontFamily: 'Tahoma'
  //         }
  //        }
  //     }else{
  //       obj = {
  //         measure: formObject.measureField,
  //         value1: formObject.value1,
  //         conditions: formObject.conditionFormat,
  //         style: {
  //           backgroundColor:  formObject.BackgroundColor,
  //           color: formObject.Fontcolor,
  //             fontSize : formObject.fontSize ?   formObject.fontSize + 'px' : '12px',
  //             fontFamily: 'Tahoma'
  //         }
  //        }
  //     }
  //     this.conditionalFormatSettingsArray.push(obj)

  //     console.log(this.conditionalFormatSettingsArray)
  //   }
  // }

  onAddConditionFormat() {
    const formattingConditonForm = this.generalForm.get('formattingCondition');
    console.log(formattingConditonForm)

    if (formattingConditonForm) {
      let formObject = formattingConditonForm.value;
      console.log(formObject);
      let obj: any = {};

      // Convert colors to a supported format
      const backgroundColor = this.convertColorToHex(formObject.BackgroundColor);
      const fontColor = this.convertColorToHex(formObject.Fontcolor);

      if (formObject.conditionFormat === 'Between') {
        obj = {
          measure: formObject.measureField,
          value1: formObject.value1,
          value2: formObject.value2,
          value3: formObject.value3,
          referenceFieldName: formObject.referenceFieldName,
          conditions: formObject.conditionFormat,
          style: {
            backgroundColor: backgroundColor,
            color: fontColor,
            fontSize: formObject.fontSize ? formObject.fontSize + 'px' : '13px',
            fontFamily: 'Tahoma'
          }
        };
      } else {
        obj = {
          measure: formObject.measureField,
          value1: formObject.value1,
          value3: formObject.value3,

          referenceFieldName: formObject.referenceFieldName,
          conditions: formObject.conditionFormat,
          style: {
            backgroundColor: backgroundColor,
            color: fontColor,
            fontSize: formObject.fontSize ? formObject.fontSize + 'px' : '13px',
            fontFamily: 'Tahoma'
          }
        };
      }

      this.conditionalFormatSettingsArray.push(obj);

      console.log(this.conditionalFormatSettingsArray);
    }
  }

  convertColorToHex(color: string): string {
    // Regex to check for RGBA format
    const rgbaRegex = /^rgba\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*(0|1|0?\.[0-9]+)\s*\)$/i;

    if (rgbaRegex.test(color)) {
      // Convert RGBA to HEX without alpha
      const matches = color.match(rgbaRegex);
      if (matches) {
        const r = parseInt(matches[1]).toString(16).padStart(2, '0');
        const g = parseInt(matches[2]).toString(16).padStart(2, '0');
        const b = parseInt(matches[3]).toString(16).padStart(2, '0');
        return `#${r}${g}${b}`;
      }
    } else if (color.startsWith('#')) {
      // Handle 8-digit hex color (e.g., #RRGGBBAA)
      if (color.length === 9) {
        return color.substring(0, 7); // Remove alpha channel
      }
    }

    // Return the color unchanged if it's already a valid format
    return color;
  }

  getServiceData() {

  }

  ngOnInit(): void {

    const dataSourceDetailsArray = [];

    let editPnaelObj = this.getPanelObj;
    console.log(editPnaelObj)
    if (this.getPanelObj != undefined || this.getPanelObj != null) {
      if (this.getPanelObj.content != undefined || this.getPanelObj.content != null) {

      }
    }
    const initialView = this.generalForm.get('defaultView')?.value || 'table';
  this.selectedDefaultView = initialView;
  
  if (initialView !== 'chart' && initialView !== 'both') {
    this.generalForm.get('chartType')?.disable();
  }
  }

  onFirstDropdownChange(eve: any) {
    const dropdownValue = eve.target.value;
    const tableArray = this.tableNamesArray[dropdownValue];
    const tableNameControl = this.generalForm.get('tableName');
    tableNameControl!.setValue(dropdownValue);

    this.chartService.getColumnNameBYTableName(dropdownValue, this.connection_id).subscribe((res: any) => {
      console.log(res);
      let data = res['data']
      // for(let )
      this.selectedTableFieldName = Object.keys(data)
    })
    console.log(this.selectedTableFieldName);

  }

  conditionValue: any;
  rawQueryValue: string = "";

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

  addText(event: any) {
    const operator = event.target.value || ""; // Replace "YourValue" with a default value if necessary
    const currentText = this.conditionValue;
  
    console.log('this.conditionValue', this.conditionValue);
  
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
  

  addTextWithouSpace(event: any) {
    const operator = event.target.value || ""; // Replace "YourValue" with a default value if necessary
    const currentText = this.conditionValue;

    console.log('this.conditionValue', this.conditionValue)
  
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
  

  addRawQueryTextOld(event: any) {
    const currentText = this.rawQueryValue;
    const selectedValue = this.generalForm.get('tableName')!.value;
    console.log(selectedValue)
    console.log(currentText)
    const operator = event.target.value;

    // if (operator) {
    const updatedText = `${currentText} ${operator}`;
    this.rawQueryValue = updatedText;
    // }
  }

  addRawQueryTextWihoutspace(event: any) {
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
  

  onClearRawQuery() {
    this.rawQueryValue = "";
    this.generalForm.get('rawQuery')!.reset();
  }
  editColumnObjIndex: any;

  editColumnIndex: any;

  onEditColumn(obj: any, index: any) {
    console.log(obj)
    this.editColumnIndex = index;
    let formObj = this.generalForm;
    this.showUpdateButton = true;
    this.showAddButton = false;
    // this.selectedFieldType = obj.feildType
      this.selectedFieldType = obj.feildType;
  this.selectedFormatType = obj.formatType; // ðŸ”¥ This is what was missing

    // this.onTableDropdown(obj.tableName)
    formObj.patchValue({
      dataSourceSettings: {
        dataSource: [],
        tableName: obj.tableName,
        feildType: obj.feildType,
        name: obj.name,
        caption: obj.caption,
        format: obj.format,
        expression: obj.expression,
        rawQuery: obj.rawQuery,
        formatType: obj.formatType,
        order : obj.order ? obj.order : 'string',
        dataType : obj.dataType
      }
    })
    console.log(formObj);

  }

  headerTextValue: any;
  onFieldDropdownChange(eve: any) {
    let dropdownValue = eve;
    console.log(dropdownValue)
    this.headerTextValue = dropdownValue;
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

  addToConditionTextareaOld(name: string) {
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

  onUpdateObj() {
    let fieldDetailsControl = this.generalForm.get('dataSourceSettings');

    const updatedObj = this.generalForm.get('dataSourceSettings')!.value;
    console.log(updatedObj)


    this.fieldDetailsArray.splice(this.editColumnIndex, 1, updatedObj);
    console.log(updatedObj, this.fieldDetailsArray)
    fieldDetailsControl?.reset()

    this.showUpdateButton = false;
    this.showAddButton = true;
  }

  onDeleteColumn(id: any) {
    console.log(id);
    this.fieldDetailsArray.splice(id, 1);
    console.log(this.fieldDetailsArray)
  }

  conditionalFormatSettingsArray: any = []
  onAddColumn() {
    console.log(this.fieldDetailsArray)
    const fieldDetailsForm: any = this.generalForm.get('dataSourceSettings');
    const formObject = fieldDetailsForm.value;
    this.fieldDetailsArray.push(formObject);
    console.log(this.fieldDetailsArray)
    for (const controlName in fieldDetailsForm.controls) {
      if (controlName !== 'tableName') { // Replace with the actual field name
        fieldDetailsForm.controls[controlName].reset();
      }
    }
    console.log(fieldDetailsForm?.value)


  }

  selectedFieldType!: string;
  selectedFormatType!: string;
  onFieldTypeChange(selectedFieldType: any): void {
    console.log(selectedFieldType?.value ?? selectedFieldType?.target?.value);
    let value = selectedFieldType?.value ?? selectedFieldType?.target?.value;
    this.selectedFieldType = value

  }

  onFormatTypeChange(eve: any) {
    let value = eve?.value ?? eve?.target?.value;
    this.selectedFormatType = value
  }

  onClearConditions() {

    this.conditionValue = "";
    this.generalForm.get('conditions')!.reset();
  }
  onTableDropdown(dropdownValue: any) {
    // const dropdownValue = eve.target.value;
    if (!dropdownValue) {
      this.selectedTableFieldName = []
      return;
    }
    const tableArray = this.tableNamesArray[dropdownValue];
    let dataSourceTableName = this.generalForm.get('dataSourceSettings')
    const dataSourceTableNameControl = dataSourceTableName?.get('tableName');
    const tableNameControl = this.generalForm.get('tableName');
    dataSourceTableNameControl!.setValue(dropdownValue);
    tableNameControl!.setValue(dropdownValue);


    if (dropdownValue != undefined || dropdownValue != "" || dropdownValue != null) {
      this.chartService.getColumnNameBYTableName(dropdownValue, this.connection_id).subscribe((res: any) => {
        console.log(res);
        let data = res['data']
        // for(let )
        this.selectedTableFieldName = Object.keys(data)
      })
      console.log(this.selectedTableFieldName);
    } else {
      this.selectedTableFieldName = []
    }

  }



  groupBy(array: any[], key: string) {
    return array.reduce((result, currentValue) => {
      (result[currentValue[key]] = result[currentValue[key]] || []).push(currentValue);
      return result;
    }, {});
  }

showCustomExpressionBox: boolean = false;
valueFieldFormatOptions: string[] = [
  'Sum', 'Avg', 'Count', 'DistinctCount', 'Min', 'Max', 'Median', 'Index',
  'RunningTotals', 'PercentageOfGrandTotal', 'PercentageOfColumnTotal',
  'PercentageOfRowTotal', 'PercentageOfParentTotal',
  'PercentageOfParentColumnTotal', 'PercentageOfParentRowTotal',
  'Custom Expression'
];


  onExpressionDropdownChange(event: any) {
  const selectedValue = event?.value ?? event?.target?.value;
  if (selectedValue === 'Custom Expression') {
    this.showCustomExpressionBox = true;
    // Clear the expression field so the user types new one
    this.generalForm.get('dataSourceSettings.expression')?.setValue('');
  } else {
    this.showCustomExpressionBox = false;
  }
}




   onGeneralFormSubmit() {
    let formValue = this.generalForm.value;
    this.count = this.count + 1;
    let id = this.getPanelObj.id + "_PovitTbl_" + this.count;

    let panelsArrData: any = sessionStorage.getItem('createPanelSeriesArray');
    this.panelSeriesArray = panelsArrData;


    if (this.panelSeriesArray != null) {


      this.panelSeriesArray = JSON.parse(this.panelSeriesArray)
      let object = this.panelSeriesArray.find((ele: any) => ele.id === this.getPanelObj.id);
      console.log(object)

      this.columnsArray = this.fieldDetailsArray.filter(item => item.feildType === 'Column')
        .map(item => ({
          name: item.name,
          caption: item.caption,
          feildType: item.feildType,
          format: item.format,
          expression: item.expression,
          formatType: item.formatType,
          delimiter: '##', // Add delimiter for proper column separation in Tabular layout
      
        }));

        let sortSettings = this.fieldDetailsArray
          .filter(item => item.order && (item.feildType === 'Column' || item.feildType === 'Row'))
          .map(item => ({
            name: item.name,
            order: item.order,
            dataType : item.dataType ? item.dataType : 'string'
          }));

        // If no sorting defined, keep it empty array to avoid syncfusion errors
        if (!Array.isArray(sortSettings) || sortSettings.length === 0) {
          sortSettings = [];
        }

        this.valuesArray = this.fieldDetailsArray.filter(item => item.feildType === 'Value')
        .map(item => ({
          name: item.name,
          caption: item.caption,
          feildType: item.feildType,
          format: item.format,
          expression: item.expression,
          type: item.expression,
          // type: item.formatType,
          valueFormat: item.valueFormat,
           showFieldAsColumn: true 
        }));

        this.rowsArray = this.fieldDetailsArray.filter(item => item.feildType === 'Row')
          .map(item => ({
            name: item.name,
            caption: item.caption,
            feildType: item.feildType,
            format: item.format,
            expression: item.expression,
            formatType: item.formatType,
            delimiter: '##', // Add delimiter for proper row separation in Tabular layout
            // textAlign: 'Center', headerTextAlign: 'Center' 
          }));

        this.formatSettingsArray = this.fieldDetailsArray.reduce((acc, item) => {
          if (item.format || item.formatType) {
            acc.push({
              name: item.name,
              format: item.format,
              ...(item.formatType === 'date' && { type: 'date' })
            });
          }
          return acc;
        }, []);


     console.log('formatSettingsArray', this.formatSettingsArray)  

      let calculatedFieldSettings = this.fieldDetailsArray
        .filter(item => item.formatType === 'CalculatedField')
        .map(item => ({
          name: item.name,
          formula: item.expression
        }));

      console.log('calculatedFieldSettings', calculatedFieldSettings)
      const matchingObjectIndex = Array.isArray(this.panelSeriesArray)
        ? this.panelSeriesArray.findIndex(obj => obj.id === this.getPanelObj.id)
        : -1;
       console.log(matchingObjectIndex)


         let valueSortSettings: any = undefined;

        try {
          const valueFieldWithOrder = Array.isArray(this.fieldDetailsArray)
            ? this.fieldDetailsArray.find((f: any) =>
                f && f.feildType === 'Value' && f.order !== undefined && f.order !== null && f.order !== '')
            : undefined;

          if (valueFieldWithOrder && Array.isArray(this.columnsArray) && this.columnsArray.length > 0) {
            const columnParts = this.columnsArray
              .map((c: any) => (c && (c.caption || c.name)) || '')
              .filter(Boolean);

            const valueCaption = (valueFieldWithOrder && (valueFieldWithOrder.caption || valueFieldWithOrder.name))
              || (Array.isArray(this.valuesArray) && this.valuesArray[0] && (this.valuesArray[0].caption || this.valuesArray[0].name))
              || '';

            const headerText = [...columnParts, valueCaption].filter(Boolean).join('##');
            const rawOrder = ((valueFieldWithOrder.order || '') + '').toString().toLowerCase();
            const sortOrder = (rawOrder === 'asc' || rawOrder === 'ascending') ? 'Ascending' : 'Descending';

            if (headerText) {
              valueSortSettings = {
                headerText: headerText,
                headerDelimiter: '##',
                sortOrder: sortOrder
              };
            }
          }
        } catch (err) {
          console.error('Failed to build valueSortSettings, continuing without it:', err);
          valueSortSettings = undefined;
        }

      console.log(this.columnsArray, this.valuesArray, this.rowsArray)
      let dataSourceSettingsObj = {
        tableName: formValue.tableName || '',
        dataSource: this.dataSourceArray,
        columns: this.columnsArray,
        values: this.valuesArray,
        rows: this.rowsArray,
        formatSettings: this.formatSettingsArray,
        sortSettings: sortSettings, // âœ… Added this line
        expression: formValue.dataSourceSettings.expression || '',
        conditionalFormatSettings: this.conditionalFormatSettingsArray,
        showGrandTotals: formValue.showGrandTotals != null ? formValue.showGrandTotals : false,
        showGrandAvg: formValue.showGrandAvg != null ? formValue.showGrandAvg : false,
        rowWiseAvg: formValue.rowWiseAvg != null ? formValue.rowWiseAvg : false,
        defaultView: formValue.defaultView || 'table',
        chartType: formValue.chartType || 'column',
        scrollbarPercentage: formValue.scrollbarPercentage || 0.01,
        enableScrollbar: formValue.enableScrollbar != null ? formValue.enableScrollbar : false,
        enableZoom: formValue.enableZoom != null ? formValue.enableZoom : false,
        xAxisTitleFontSize: formValue.xAxisTitleFontSize || 14,
        yAxisTitleFontSize: formValue.yAxisTitleFontSize || 14,
        hideXAxisTitle: formValue.hideXAxisTitle != null ? formValue.hideXAxisTitle : false,
        hideYAxisTitle: formValue.hideYAxisTitle != null ? formValue.hideYAxisTitle : false,
        expandAll: formValue.expandAll != null ? formValue.expandAll : false,
        enableSorting: formValue.enableSorting || false,
        calculatedFieldSettings : calculatedFieldSettings,
        showRowGrandTotals: formValue.showRowGrandTotals != null ? formValue.showRowGrandTotals : false,
        showColumnGrandTotals: formValue.showColumnGrandTotals != null ? formValue.showColumnGrandTotals : false,
        grandTotalsPosition: 'Bottom',
        showAggregationOnValueField: false,
        enableClassicLayout : formValue.enableClassicLayout || false,

        // valueSortSettings: {
        //   headerText: this.columnsArray.map((c: any) => c.name).join('##') + '##' + this.valuesArray[0].caption,
        //   headerDelimiter: '##',
        //   sortOrder: 'Descending'
        // }

        ...(valueSortSettings ? { valueSortSettings } : {})

      }

      this.povitObjData = {
        ...this.povitObjData,
        tableName: formValue.tableName || '',
        rawQuery: formValue.rawQuery || '',
        orderBy: formValue.orderBy || [],
        orderByType: formValue.orderByType || '',
        showGrandTotals: formValue.showGrandTotals != null ? formValue.showGrandTotals : false,
        showGrandAvg: formValue.showGrandAvg != null ? formValue.showGrandAvg : false,
        rowWiseAvg: formValue.rowWiseAvg != null ? formValue.rowWiseAvg : false,
        defaultView: formValue.defaultView || 'table',
        chartType: formValue.chartType || 'column',
        hideXAxisTitle: formValue.hideXAxisTitle != null ? formValue.hideXAxisTitle : false,
        hideYAxisTitle: formValue.hideYAxisTitle != null ? formValue.hideYAxisTitle : false,
        enableScrollbar: formValue.enableScrollbar != null ? formValue.enableScrollbar : false,
        enableZoom: formValue.enableZoom != null ? formValue.enableZoom : false,
        xAxisTitleFontSize: formValue.xAxisTitleFontSize || 14,
        yAxisTitleFontSize: formValue.yAxisTitleFontSize || 14,
        scrollbarPercentage: formValue.scrollbarPercentage || 0.01,
        expandAll: formValue.expandAll != null ? formValue.expandAll : false,
        enableClassicLayout : formValue.enableClassicLayout != null ? formValue.enableClassicLayout : false,
        gridSettings  : {
        layout: formValue.enableClassicLayout ? 'Tabular' : 'Compact'
        },
        showRowGrandTotals: formValue.showRowGrandTotals != null ? formValue.showRowGrandTotals : false,
        showColumnGrandTotals: formValue.showColumnGrandTotals != null ? formValue.showColumnGrandTotals : false,
        grandTotalAverageType: formValue.grandTotalAverageType || '',
        colorFormatSettingsArray: this.conditionalFormatSettingsArray,
        groupBy: formValue.groupBy || [],
        condition: formValue.condition || '',
        dataSourceSettings: dataSourceSettingsObj,
        fieldDetails: this.fieldDetailsArray,
        fieldHeaders : formValue.fieldHeaders || [],
        enableHeaderAlignment : formValue.enableHeaderAlignment || false,
        enableSorting : formValue.enableSorting || false,
        headerFormatting: this.headerFeildDetailsArray,
      }

      let pivotObjApi = {
        "object_id": id,
        "object_setup": {
          "content": {
            "height": "100%",
            "width": "100%",
            ...this.povitObjData
          }
        },
        "object_type": "pivot",
        "connection_id": this.connection_id,
      };
      if (matchingObjectIndex !== -1) {
        this.panelSeriesArray[matchingObjectIndex] = {
          ...this.getPanelObj,

          content: {
            "height": "100%",
            "width": "100%",
            ...this.povitObjData
          }
        };
      }

      sessionStorage.setItem('createPanelSeriesArray', JSON.stringify(this.panelSeriesArray));

      console.log(pivotObjApi)
      let pivot_Data = this.chartService.objectPivotCreate(pivotObjApi);
      pivot_Data.subscribe(
        (res: any) => {

          console.log("res", res);

          if (res.success === true) {
            let resobj = res['data'];
            let data = resobj.object_setup.content;
            console.log(data, 'pivot');
            data.dataSourceSettings.conditionalFormatSettings = data.colorFormatSettingsArray;
            // let conditionalFormatSettings = data.dataSourceSettings.conditionalFormatSettings;
            let ColorformatSetting = data.dataSourceSettings.colorFormatSettingsArray;
            let conditionalFormatSettings = data.dataSourceSettings.conditionalFormatSettings;

            let dataSource = data.dataSourceSettings.dataSource;
            let columnsArray = data.dataSourceSettings.columns; // Assuming columnsArray contains the column fields (e.g., continents)
            let rowssArray = data.dataSourceSettings.rows;
            let valuesArray = data.dataSourceSettings.values;
            console.log('Object.keys(dataSource[0])', Object.keys(dataSource[0]));

            let colorsArr: any[] = []


            if (data.showGrandAvg) {
              rowssArray.forEach((row: any) => {
                if (dataSource.some((item: any) => item.hasOwnProperty(row.name))) {
                  console.log('row name ', row.name);
                  columnsArray.forEach((column: any) => {
                    if (dataSource.some((item: any) => item.hasOwnProperty(column.name))) {
                      valuesArray.forEach((value: any) => {
                        if (dataSource.some((item: any) => item.hasOwnProperty(value.name))) {
                          let totalsAndAveragesByRow = this.calculateTotalsAndAveragesByRow(dataSource, row.name, valuesArray, column.name);
                          let totalsAndAveragesByColumn = this.calculateTotalsAndAveragesByColumn(dataSource, row.name, valuesArray, column.name);
                          //  let totalsAndAverages = this.calculateTotalsAndAverages(dataSource, row.name, valuesArray, column.name, data.showRowGrandTotals,  data.showColumnGrandTotals);
                          console.log('totalsAndAveragesByRow', totalsAndAveragesByRow)
                          console.log('totalsAndAveragesByColumn', totalsAndAveragesByColumn)
                          console.log('conditionalFormatSettings', conditionalFormatSettings)

                          let arr: any[] = [];

                          let formatNumber = (num: number, decimalPlaces: number = 2) => {
                            return parseFloat(num.toFixed(decimalPlaces));
                          };

                          let newObj: any = {}

                          conditionalFormatSettings?.forEach((ele: any) => {
                            if (ele.value3 === 'grandAverage') {
                              if (data.showRowGrandTotals) {
                                totalsAndAveragesByRow?.forEach((obj: any) => {
                                  let label = obj[column.name];
                                  let keys = Object.keys(obj);
                                  valuesArray.forEach((valueField: any) => {

                                    if (ele.measure === valueField.name) {
                                      if (keys.includes(valueField.name)) {
                                        let averageValue = obj[valueField.name]?.average;
                                      }
                                      let averageValue = formatNumber(obj[valueField.name]?.average || 0); // Get the 

                                      let newObj = {
                                        label: label,  // Use the row label
                                        value1: averageValue,  // Assign the calculated average
                                        conditions: ele.conditions,
                                        value3: ele.value3,
                                        measure: ele.measure,
                                        style: ele.style
                                      };

                                      arr.push(newObj); // Add to the array
                                    }
                                  });
                                });
                              }

                              if (data.showColumnGrandTotals) {
                                totalsAndAveragesByColumn?.forEach((obj: any) => {
                                  let label = obj[row.name];
                                  let keys = Object.keys(obj);

                                  valuesArray.forEach((valueField: any) => {

                                    if (ele.measure === valueField.name) {
                                      if (keys.includes(valueField.name)) {
                                        let averageValue = obj[valueField.name]?.average;
                                      }
                                      let averageValue = formatNumber(obj[valueField.name]?.average || 0); // Get the average for the specific value field
                                      // Debugging the average value

                                      let newObj = {
                                        label: label,  // Use the row label
                                        value1: averageValue,  // Assign the calculated average
                                        conditions: ele.conditions,
                                        value3: ele.value3,
                                        measure: ele.measure,
                                        style: ele.style
                                      };

                                    }
                                  });
                                });
                              }

                            } else {
                              arr.push(ele); // If the condition is not grandAverage, retain the existing element
                            }
                          });
                          console.log('Resulting array:', arr); // Debug: Print the resulting array
                          data.dataSourceSettings.conditionalFormatSettings = arr; // Update the conditional formatting settings
                        }

                      });
                    }

                  });
                }

              });
            }


            let pivotObjAngular = {
              ...this.getPanelObj,
              header: formValue.header,
              content: {
                id: id,
                "height": data.height,
                "width": data.width,
                ...data,
                headerFormatting: this.headerFeildDetailsArray, 
                dataSourceSettings: {
                  ...data.dataSourceSettings,
                }
              }
            };

            this.sendBoxObj.emit({ boxObj: pivotObjAngular, resObj: { resSuccess: res.success, resMessage: res.message, statusCode: res.status_code } });

          } else {
            let boxObj = this.panelSeriesArray[matchingObjectIndex]
            this.sendBoxObj.emit({ boxObj: boxObj, resObj: { resSuccess: false, resMessage: res.message, statusCode: res.status_code } });
          }
        },
        (err: any) => {
          let boxObj = this.panelSeriesArray[matchingObjectIndex]
          const errorMessage = err.error && err.error.message ? err.error.message : err.message;
          this.sendBoxObj.emit({ boxObj: boxObj, resObj: { resSuccess: false, resMessage: errorMessage, statusCode: err.status } });
        })

    }

  }

  calculateTotalsAndAveragesByColumn(dataSource: any[], rowField: string, valueFields: any[], columnField: string) {
    const selectedType = this.generalForm.get('grandTotalAverageType')?.value;
    const result: any[] = [];

    // Updated structure to include row and column field names
    const groupedData: {
      [key: string]: {
        [valueField: string]: {
          sum: number,
          distinctColumnValues: Set<any>,
          columnValueSum: { [columnValue: string]: number },
          rowFieldName: string,  // Add row field name
          columnFieldName: string // Add column field name
        }
      }
    } = {};

    dataSource.forEach(item => {
      const key = item[rowField];  // This is the row field key

      if (!groupedData[key]) {
        groupedData[key] = {};
      }

      valueFields.forEach(valueField => {
        if (!groupedData[key][valueField.name]) {
          // Now passing both rowField and columnField names inside the groupedData object
          groupedData[key][valueField.name] = {
            sum: 0,
            distinctColumnValues: new Set(),
            columnValueSum: {},
            rowFieldName: rowField,  // Passing rowField name
            columnFieldName: columnField // Passing columnField name
          };
        }

        const valueData = groupedData[key][valueField.name];
        valueData.sum += item[valueField.name] || 0;
        const columnValue = item[columnField];

        if (!valueData.columnValueSum[columnValue]) {
          valueData.columnValueSum[columnValue] = 0;
        }

        valueData.columnValueSum[columnValue] += item[valueField.name] || 0;
        valueData.distinctColumnValues.add(columnValue);
      });
    });

    // Process the grouped data to calculate averages
    Object.keys(groupedData).forEach(key => {
      const group = groupedData[key];
      const resultEntry: any = { [rowField]: key };

      valueFields.forEach(valueField => {
        const valueData = group[valueField.name];
        let distinctColumnValuesArray: any[] = [];

        switch (selectedType) {
          case 'AverageWithZero':
            distinctColumnValuesArray = Array.from(valueData.distinctColumnValues);
            break;
          case 'AverageWithoutZero':
            distinctColumnValuesArray = Object.keys(valueData.columnValueSum).filter(columnValue => valueData.columnValueSum[columnValue] > 0);
            break;
          case 'AverageWithAllData':
            const allDistinctValues = new Set<any>();
            dataSource.forEach(item => allDistinctValues.add(item[columnField]));
            distinctColumnValuesArray = Array.from(allDistinctValues);
            break;
          default:
            distinctColumnValuesArray = Array.from(valueData.distinctColumnValues);
        }

        // Include the row and column field names inside the result
        resultEntry[valueField.name] = {
          row: valueData.rowFieldName,  // Include row field name
          column: valueData.columnFieldName, // Include column field name
          sum: valueData.sum,
          average: distinctColumnValuesArray.length > 0 ? valueData.sum / distinctColumnValuesArray.length : 0
        };
      });

      result.push(resultEntry);
    });

    return result;
  }

  calculateTotalsAndAveragesByRow(dataSource: any[], rowField: string, valueFields: any[], columnField: string) {
    const selectedType = this.generalForm.get('grandTotalAverageType')?.value;
    const result: any[] = [];

    // Structure to group data by column field (instead of row field)
    const groupedData: {
      [key: string]: {
        [valueField: string]: {
          sum: number,
          distinctRowValues: Set<any>,
          rowValueSum: { [rowValue: string]: number },  // Change to row-based sum
          rowFieldName: string,
          columnFieldName: string
        }
      }
    } = {};

    dataSource.forEach(item => {
      const key = item[columnField];  // Now using column field as the key

      if (!groupedData[key]) {
        groupedData[key] = {};
      }

      valueFields.forEach(valueField => {
        if (!groupedData[key][valueField.name]) {
          groupedData[key][valueField.name] = {
            sum: 0,
            distinctRowValues: new Set(),  // Now tracking distinct row values
            rowValueSum: {},  // Storing sum by row values
            rowFieldName: rowField,
            columnFieldName: columnField
          };
        }

        const valueData = groupedData[key][valueField.name];
        valueData.sum += item[valueField.name] || 0;

        const rowValue = item[rowField];  // Now tracking row value instead of column value

        if (!valueData.rowValueSum[rowValue]) {
          valueData.rowValueSum[rowValue] = 0;
        }

        valueData.rowValueSum[rowValue] += item[valueField.name] || 0;  // Sum by row value
        valueData.distinctRowValues.add(rowValue);
      });
    });

    // Process the grouped data to calculate averages based on row field
    Object.keys(groupedData).forEach(key => {
      const group = groupedData[key];
      const resultEntry: any = { [columnField]: key };  // Now column field is the key

      valueFields.forEach(valueField => {
        const valueData = group[valueField.name];
        let distinctRowValuesArray: any[] = [];

        switch (selectedType) {
          case 'AverageWithZero':
            distinctRowValuesArray = Array.from(valueData.distinctRowValues);
            break;
          case 'AverageWithoutZero':
            distinctRowValuesArray = Object.keys(valueData.rowValueSum).filter(rowValue => valueData.rowValueSum[rowValue] > 0);
            break;
          case 'AverageWithAllData':
            const allDistinctRowValues = new Set<any>();
            dataSource.forEach(item => allDistinctRowValues.add(item[rowField]));
            distinctRowValuesArray = Array.from(allDistinctRowValues);
            break;
          default:
            distinctRowValuesArray = Array.from(valueData.distinctRowValues);
        }

        resultEntry[valueField.name] = {
          row: valueData.rowFieldName,  // Keep row field name
          column: valueData.columnFieldName, // Keep column field name
          sum: valueData.sum,
          average: distinctRowValuesArray.length > 0 ? valueData.sum / distinctRowValuesArray.length : 0
        };
      });

      result.push(resultEntry);
    });

    return result;
  }


  calculateTotalsAndAverages1(
    dataSource: any[],
    rowField: string,
    valueFields: any[],
    columnField: string,
    showRowGrandTotals: boolean,
    showColumnGrandTotals: boolean,
  ) {
    const selectedType = this.generalForm.get('grandTotalAverageType')?.value;
    const result: any[] = [];

    // Updated structure to include row and column field names
    const groupedData: {
      [key: string]: {
        [valueField: string]: {
          sum: number;
          distinctColumnValues: Set<any>;
          columnValueSum: { [columnValue: string]: number };
          rowFieldName: string; // Add row field name
          columnFieldName: string; // Add column field name
        };
      };
    } = {};

    if (showRowGrandTotals) {
      // Original logic: Calculate totals and averages by rows (DSE_ID)
      dataSource.forEach((item) => {
        const key = item[rowField]; // This is the row field key

        if (!groupedData[key]) {
          groupedData[key] = {};
        }

        valueFields.forEach((valueField) => {
          if (!groupedData[key][valueField.name]) {
            // Now passing both rowField and columnField names inside the groupedData object
            groupedData[key][valueField.name] = {
              sum: 0,
              distinctColumnValues: new Set(),
              columnValueSum: {},
              rowFieldName: rowField, // Passing rowField name
              columnFieldName: columnField, // Passing columnField name
            };
          }

          const valueData = groupedData[key][valueField.name];
          valueData.sum += item[valueField.name] || 0;
          const columnValue = item[columnField];

          if (!valueData.columnValueSum[columnValue]) {
            valueData.columnValueSum[columnValue] = 0;
          }

          valueData.columnValueSum[columnValue] += item[valueField.name] || 0;
          valueData.distinctColumnValues.add(columnValue);
        });
      });

      // Process the grouped data to calculate averages for rows (DSE_ID)
      Object.keys(groupedData).forEach((key) => {
        const group = groupedData[key];
        const resultEntry: any = { [rowField]: key };

        valueFields.forEach((valueField) => {
          const valueData = group[valueField.name];
          let distinctColumnValuesArray: any[] = [];

          switch (selectedType) {
            case 'AverageWithZero':
              distinctColumnValuesArray = Array.from(valueData.distinctColumnValues);
              break;
            case 'AverageWithoutZero':
              distinctColumnValuesArray = Object.keys(valueData.columnValueSum).filter(
                (columnValue) => valueData.columnValueSum[columnValue] > 0
              );
              break;
            case 'AverageWithAllData':
              const allDistinctValues = new Set<any>();
              dataSource.forEach((item) => allDistinctValues.add(item[columnField]));
              distinctColumnValuesArray = Array.from(allDistinctValues);
              break;
            default:
              distinctColumnValuesArray = Array.from(valueData.distinctColumnValues);
          }

          // Include the row and column field names inside the result
          resultEntry[valueField.name] = {
            row: valueData.rowFieldName, // Include row field name
            column: valueData.columnFieldName, // Include column field name
            sum: valueData.sum,
            average:
              distinctColumnValuesArray.length > 0
                ? valueData.sum / distinctColumnValuesArray.length
                : 0,
          };
        });

        result.push(resultEntry);
      });
    }
    if (showColumnGrandTotals) {
      // New logic: Calculate totals and averages by columns (iai_policyDueDate)
      dataSource.forEach((item) => {
        const key = item[columnField]; // This is the column field key

        if (!groupedData[key]) {
          groupedData[key] = {};
        }

        valueFields.forEach((valueField) => {
          if (!groupedData[key][valueField.name]) {
            // Now passing both rowField and columnField names inside the groupedData object
            groupedData[key][valueField.name] = {
              sum: 0,
              distinctColumnValues: new Set(),
              columnValueSum: {},
              rowFieldName: rowField, // Passing rowField name
              columnFieldName: columnField, // Passing columnField name
            };
          }

          const valueData = groupedData[key][valueField.name];
          valueData.sum += item[valueField.name] || 0;
          const rowValue = item[rowField];

          if (!valueData.columnValueSum[rowValue]) {
            valueData.columnValueSum[rowValue] = 0;
          }

          valueData.columnValueSum[rowValue] += item[valueField.name] || 0;
          valueData.distinctColumnValues.add(rowValue);
        });
      });

      // Process the grouped data to calculate averages for columns (iai_policyDueDate)
      Object.keys(groupedData).forEach((key) => {
        const group = groupedData[key];
        const resultEntry: any = { [columnField]: key };

        valueFields.forEach((valueField) => {
          const valueData = group[valueField.name];
          let distinctRowValuesArray: any[] = [];

          switch (selectedType) {
            case 'AverageWithZero':
              distinctRowValuesArray = Array.from(valueData.distinctColumnValues);
              break;
            case 'AverageWithoutZero':
              distinctRowValuesArray = Object.keys(valueData.columnValueSum).filter(
                (rowValue) => valueData.columnValueSum[rowValue] > 0
              );
              break;
            case 'AverageWithAllData':
              const allDistinctValues = new Set<any>();
              dataSource.forEach((item) => allDistinctValues.add(item[rowField]));
              distinctRowValuesArray = Array.from(allDistinctValues);
              break;
            default:
              distinctRowValuesArray = Array.from(valueData.distinctColumnValues);
          }

          // Include the row and column field names inside the result
          resultEntry[valueField.name] = {
            row: valueData.rowFieldName, // Include row field name
            column: valueData.columnFieldName, // Include column field name
            sum: valueData.sum,
            average:
              distinctRowValuesArray.length > 0
                ? valueData.sum / distinctRowValuesArray.length
                : 0,
          };
        });

        result.push(resultEntry);
      });
    }

    return result;
  }



  // calculateTotalsAndAverages(dataSource: any[], rowField: string, valueField: string, columnField: string) {
  //   const selectedType = this.generalForm.get('grandTotalAverageType')?.value;
  //   const result: any[] = [];
  //   const groupedData: { [key: string]: { sum: number, distinctColumnValues: Set<any>, columnValueSum: { [columnValue: string]: number } } } = {};

  //   dataSource.forEach(item => {
  //     const key = item[rowField];

  //     console.log('key', key)
  //     if (!groupedData[key]) {
  //       groupedData[key] = {
  //         sum: 0,
  //         distinctColumnValues: new Set(),
  //         columnValueSum: {}
  //       };
  //     }

  //     groupedData[key].sum += item[valueField] || 0;
  //     const columnValue = item[columnField];

  //     if (!groupedData[key].columnValueSum[columnValue]) {
  //       groupedData[key].columnValueSum[columnValue] = 0;
  //     }

  //     groupedData[key].columnValueSum[columnValue] += item[valueField] || 0;
  //     groupedData[key].distinctColumnValues.add(columnValue);
  //   });

  //   Object.keys(groupedData).forEach(key => {
  //     const group = groupedData[key];
  //     let distinctColumnValuesArray: any[] = [];

  //     switch (selectedType) {
  //       case 'AverageWithZero':
  //         // Use all distinct column values
  //         distinctColumnValuesArray = Array.from(group.distinctColumnValues);
  //         break;
  //       case 'AverageWithoutZero':
  //         // Filter out column values with zero sum
  //         distinctColumnValuesArray = Object.keys(group.columnValueSum).filter(columnValue => group.columnValueSum[columnValue] > 0);
  //         break;
  //       case 'AverageWithAllData':
  //         // Use all distinct column values from the entire dataset
  //         const allDistinctValues = new Set<any>();
  //         dataSource.forEach(item => allDistinctValues.add(item[columnField]));
  //         distinctColumnValuesArray = Array.from(allDistinctValues);
  //         break;
  //       default:
  //         // Handle any default or error cases here if necessary
  //         distinctColumnValuesArray = Array.from(group.distinctColumnValues);
  //     }

  //     result.push({
  //       [rowField]: key,
  //       sum: group.sum,
  //       columnFieldValues: distinctColumnValuesArray,
  //       average: distinctColumnValuesArray.length > 0 ? group.sum / distinctColumnValuesArray.length : 0
  //     });
  //   });

  //   return result;
  // }

  onGeneralFormSubmit1() {
    let formValue = this.generalForm.value;
    this.count = this.count + 1;
    let id = this.getPanelObj.id + "_PovitTbl_" + this.count;

    let panelsArrData: any = sessionStorage.getItem('createPanelSeriesArray');
    // let panelsArrData: any = localStorage.getItem('createPanelSeriesArray');
    this.panelSeriesArray = panelsArrData;

    // console.log('formValue', formValue)

    if (this.panelSeriesArray != null) {


      this.panelSeriesArray = JSON.parse(this.panelSeriesArray)
      let object = this.panelSeriesArray.find((ele: any) => ele.id === this.getPanelObj.id);
      console.log(object)

      this.columnsArray = this.fieldDetailsArray.filter(item => item.feildType === 'Column')
        .map(item => ({
          name: item.name,
          caption: item.caption,
          feildType: item.feildType,
          format: item.format,
          expression: item.expression,
          formatType: item.formatType
        }));

      // this.valuesArray = this.fieldDetailsArray.filter(item => item.feildType === 'Value')
      //   .map(item => ({
      //     name: item.name,
      //     caption: item.caption,
      //     feildType: item.feildType,
      //     format: item.format,
      //     expression: item.expression,
      //     type: item.formatType,
      //     valueFormat: item.valueFormat
      //   }));

       console.log('this.fieldDetailsArray', this.fieldDetailsArray)
        this.valuesArray = this.fieldDetailsArray.filter(item => item.feildType === 'Value')
        .map(item => ({
          name: item.caption,
          caption: item.caption,
          feildType: item.feildType,
          format: item.format,
          expression: item.expression,
          type: item.formatType,
          valueFormat: item.valueFormat
        }));

      this.rowsArray = this.fieldDetailsArray.filter(item => item.feildType === 'Row')
        .map(item => ({
          name: item.name,
          caption: item.caption,
          feildType: item.feildType,
          format: item.format,
          expression: item.expression,
          formatType: item.formatType
        }));

      this.formatSettingsArray = this.fieldDetailsArray.filter(item => item.feildType === 'format')
        .map(item => ({
          name: item.name,
          // format: "0'%' ",
          format: item.format,
          type: item.formatType
        }));

      console.log(this.formatSettingsArray)
      const matchingObjectIndex = Array.isArray(this.panelSeriesArray)
        ? this.panelSeriesArray.findIndex(obj => obj.id === this.getPanelObj.id)
        : -1;
      // console.log(matchingObjectIndex)

      console.log(this.columnsArray, this.valuesArray, this.rowsArray)
      let dataSourceSettingsObj = {
        tableName: formValue.tableName,
        dataSource: this.dataSourceArray,
        columns: this.columnsArray,
        values: this.valuesArray,
        rows: this.rowsArray,
        formatSettings: this.formatSettingsArray,
        expression: formValue.dataSourceSettings.expression,
        conditionalFormatSettings: this.conditionalFormatSettingsArray,
        showGrandTotals: formValue.showGrandTotals != null ? formValue.showGrandTotals : false,
        showRowGrandTotals: formValue.showRowGrandTotals != null ? formValue.showRowGrandTotals : false,
        showGrandAvg: formValue.showGrandAvg != null ? formValue.showGrandAvg : false,
        rowWiseAvg: formValue.rowWiseAvg != null ? formValue.rowWiseAvg : false,
        
        expandAll: formValue.expandAll != null ? formValue.expandAll : false,
        enableClassicLayout : formValue.enableClassicLayout != null ? formValue.enableClassicLayout : false,
        gridSettings  : {
        layout: formValue.enableClassicLayout ? 'Tabular' : 'Compact'
        },
        enableSorting: false,
        showColumnGrandTotals: formValue.showColumnGrandTotals != null ? formValue.showColumnGrandTotals : false,
        showSubTotals :false,
        // showRowSubTotals:true,

        grandTotalsPosition: 'Bottom',

      }
      this.povitObjData = {
        ...this.povitObjData,

        tableName: formValue.tableName,
        rawQuery: (formValue.rawQuery === "" || formValue.rawQuery === undefined) ? "" : formValue.rawQuery,
        orderBy: (formValue.orderBy === "" || formValue.orderBy === undefined) ? [] : formValue.orderBy,
        orderByType: (formValue.orderByType === "" || formValue.orderByType === undefined) ? "" : formValue.orderByType,
        showGrandTotals: formValue.showGrandTotals != null ? formValue.showGrandTotals : false,
        showRowGrandTotals: formValue.showRowGrandTotals != null ? formValue.showRowGrandTotals : false,
        showGrandAvg: formValue.showGrandAvg != null ? formValue.showGrandAvg : false,
        rowWiseAvg : formValue.rowWiseAvg != null ? formValue.rowWiseAvg : false,
        expandAll: formValue.expandAll != null ? formValue.expandAll : false,
        enableClassicLayout : formValue.enableClassicLayout != null ? formValue.enableClassicLayout : false,
        gridSettings  : {
          layout: formValue.enableClassicLayout ? 'Tabular' : 'Compact'
        },
        showColumnGrandTotals: formValue.showColumnGrandTotals != null ? formValue.showColumnGrandTotals : false,
        grandTotalAverageType: formValue.grandTotalAverageType ? formValue.grandTotalAverageType : 'AverageWithZero',
        groupBy: (formValue.groupBy === "" || formValue.groupBy === undefined) ? [] : formValue.groupBy,
        condition: (formValue.condition === "" || formValue.condition === undefined) ? "" : formValue.condition,
        dataSourceSettings: dataSourceSettingsObj,
        fieldDetails: this.fieldDetailsArray
      }

      let pivotObjApi = {
        "object_id": id,
        "object_setup": {
          "content": {
            "height": "100%",
            "width": "100%",
            ...this.povitObjData
          }
        },
        "object_type": "pivot",
        "connection_id": this.connection_id,
      };
      if (matchingObjectIndex !== -1) {
        this.panelSeriesArray[matchingObjectIndex] = {
          ...this.getPanelObj,

          content: {
            "height": "100%",
            "width": "100%",
            ...this.povitObjData
          }
        };
      }
      // console.log(matchingObjectIndex)
      // console.log(this.panelSeriesArray)
      sessionStorage.setItem('createPanelSeriesArray', JSON.stringify(this.panelSeriesArray));
      // localStorage.setItem('createPanelSeriesArray', JSON.stringify(this.panelSeriesArray));

      console.log(pivotObjApi)
      let pivot_Data = this.chartService.objectPivotCreate(pivotObjApi);
      pivot_Data.subscribe(
        (res: any) => {

          console.log("res", res);

          if (res.success === true) {
            let resobj = res['data'];
            let data = resobj.object_setup.content
            console.log(data, 'pivot')
            // Extract values array
            let valuesArray = data.dataSourceSettings.values;
            let rowsArray = data.dataSourceSettings.rows;

            // Initialize calculatedFieldSettings array
            let calculatedFieldSettings: any = [];

            // Iterate through values array and create calculated fields
            valuesArray.forEach((valueObj: any) => {
              let calculatedField: any;
              rowsArray.forEach((rowObj: any) => {
                calculatedField = {
                  name: `Average_${valueObj.name}`,  // Name for calculated field
                  formula: `Avg(${valueObj.name})` // Formula for average
                };

              })

              calculatedFieldSettings.push(calculatedField);

              let newValueObj = {
                name: calculatedField.name,        // Name from calculatedField
                caption: calculatedField.name,     // Caption same as name
                type: 'CalculatedField'            // Type as 'CalculatedField'
              };

              valuesArray.push(newValueObj);
            });

            let pivotObjAngular = {
              ...this.getPanelObj,
              header: formValue.header,
              content: {
                id: id,
                "height": data.height,
                "width": data.width,
                ...data,
                dataSourceSettings: {
                  ...data.dataSourceSettings,
                  values: valuesArray,
                  // Updated values array
                  calculatedFieldSettings: calculatedFieldSettings // Add the calculated fields here
                }
              }
            };

            console.log(pivotObjAngular)

            this.sendBoxObj.emit({ boxObj: pivotObjAngular, resObj: { resSuccess: res.success, resMessage: res.message, statusCode: res.status_code } });

          } else {
            let boxObj = this.panelSeriesArray[matchingObjectIndex]
            this.sendBoxObj.emit({ boxObj: boxObj, resObj: { resSuccess: false, resMessage: res.message, statusCode: res.status_code } });
          }

        },
        (err: any) => {
          let boxObj = this.panelSeriesArray[matchingObjectIndex]
          const errorMessage = err.error && err.error.message ? err.error.message : err.message;
          this.sendBoxObj.emit({ boxObj: boxObj, resObj: { resSuccess: false, resMessage: errorMessage, statusCode: err.status } });

        })
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

selectedDefaultView: string = 'table';
onDefaultViewChange(event: any) {
  const selectedView = event?.value ?? event?.target?.value;
  this.selectedDefaultView = selectedView;
  
  if (selectedView !== 'chart' && selectedView !== 'both') {
    this.generalForm.patchValue({
      chartType: ''
    });
    this.generalForm.get('chartType')?.disable();
  } else {
    this.generalForm.get('chartType')?.enable();
  }
}


  headerFeildDetailsArray : any = [];
  editingIndex : any;
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

onEditHeaderFormat(index: number, item : any) {
  this.editingIndex = index;
  console.log('item', item)

  this.showUpdateHeaderConditionBtn = true;
  this.showAddHeaderConditionBtn = false;

  let fontSize = item.fontSize?.replace('px', '') || ''
  let formObj =  this.generalForm;

  formObj.patchValue({
    headerConditonalFormatting: {
      fieldName: item.fieldName,
      backgroundColor:  item.backgroundColor,
      color:  item.color,
      fontSize:  fontSize,
      fontStyle: item.fontStyle,
      fontWeight: item.fontWeight
    }
  
  })

}




  // Delete Entry
  onDeleteHeaderFormat(index: number) {
    this.headerFeildDetailsArray.splice(index, 1);
  }
}


