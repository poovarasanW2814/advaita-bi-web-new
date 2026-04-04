import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { TabComponent } from '@syncfusion/ej2-angular-navigations';
import { AnimationSettingsModel, DialogComponent } from '@syncfusion/ej2-angular-popups';
import { Browser } from '@syncfusion/ej2/base';
import { Subject } from 'rxjs';
import { ChartService } from 'src/app/core/services/chart.service';

@Component({
  selector: 'app-property-chart',
  templateUrl: './property-chart.component.html',
  styleUrls: ['./property-chart.component.scss'],
  standalone: false
})

export class PropertyChartComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {
  @Input() getPanelObj: any;
  @ViewChild('tabComponent', { static: true }) tab!: TabComponent;
  @Output() sendBoxObj = new EventEmitter()

  @Output() sendChartOBj = new EventEmitter();
  @ViewChild('dimensionGrid') dimensionGrid!: GridComponent
  dimensionGroupingArraySubject = new Subject();
  @ViewChild('defaultDialog')
  defaultDialog!: DialogComponent;
  measureSeriesArray: any = [];
  ApiPanelSeriesArray: any[] = [];
  dimensionGroupingArray: any[] = [];

  generalChartPropForm !: FormGroup;
  headerText: any = [{ text: "General" },
    { text: "Dimension(X-Axis)" }, { text: "Measure(Y-Axis)" }, { text: "Condition" }, { text: "Chart Props" }, { text: "X-Axis Props" }, { text: "Y1-Axis Props" },  { text: "Y2-Axis Props" }, {text : 'Conditional Formatting'}];
  generalForm!: FormGroup;
  target: string = ".control-section";
  dashboardCreationForm!: FormGroup;
  chartIdCount: any = 0;
  showUpdateButton: boolean = false;
  showAddButton: boolean = true;
  patchDimensionObj: any;
  connection_id!: number;

  selectedTabIndex = 0

  tableNamesArray: string[] = [];
  selectedTableFieldName: string[] = [];
  isSecondTableNameDisabled = false;

  fontWeights: number[] = [100, 200, 300, 400, 500, 600, 700, 800, 900];
  generalChartType: any = ["Column", "Line", "Area", "Pie"]

  constructor(private fb: FormBuilder, private chartService: ChartService, private changeDetectorRef: ChangeDetectorRef) {
    this.createDashboardObj();
  }
  panelSeriesArray: any = []

  ngOnChanges(changes: SimpleChanges) {

      this.headerText = [{ text: "General" },
    { text: "Dimension(X-Axis)" }, { text: "Measure(Y-Axis)" }, { text: "Condition" }, { text: "Chart Props" }, { text: "X-Axis Props" }, { text: "Y1-Axis Props" },  { text: "Y2-Axis Props" }, {text : 'Conditional Formatting'}];

    if (changes['getPanelObj']) {
      let currentValue = changes['getPanelObj'].currentValue;
      this.getPanelObj = currentValue;
      if (this.tab) {
        this.tab.selectedItem = 0;
      }

      let panelsArrData: any = sessionStorage.getItem('createPanelSeriesArray');

      if (this.panelSeriesArray) {
        this.panelSeriesArray = JSON.parse(panelsArrData);
        const matchingPanel = this.panelSeriesArray.find((panel: any) => panel.id === this.getPanelObj?.id);
        console.log(matchingPanel)

        if (matchingPanel) {
          this.connection_id = this.getPanelObj.connection_id;

          this.dashboardCreationForm.patchValue({
            title: matchingPanel.header || '',
            tableName: matchingPanel.content.tableName || '',
            orderBy: matchingPanel.content.orderBy || [],
            orderByType: matchingPanel.content.orderByType || '',
            enableZoom: matchingPanel.content.enableZoom != null ? matchingPanel.content.enableZoom : false,
            groupBy: matchingPanel.content.groupBy || [],
            conditions: matchingPanel.content.conditions || '',
            chartType: matchingPanel.content.chartType || '',
            background: matchingPanel.content.background || '',
            primaryXAxis: {
              title: matchingPanel.content.primaryXAxis?.title || '',
              interval: matchingPanel.content.primaryXAxis?.interval || '',
              minimum: matchingPanel.content.primaryXAxis?.minimum || '',
              maximum: matchingPanel.content.primaryXAxis?.maximum || '',
              intervalType: matchingPanel.content.primaryXAxis?.intervalType || '',
              enableTrim: matchingPanel.content.primaryXAxis?.enableTrim || false,
              labelFormat: matchingPanel.content.primaryXAxis?.labelFormat || '',
              maximumLabelWidth: matchingPanel.content.primaryXAxis?.maximumLabelWidth || '',
              labelIntersectAction: matchingPanel.content.primaryXAxis?.labelIntersectAction || 'Hide',
              labelPosition: matchingPanel.content.primaryXAxis?.labelPosition || 'Outside',
              labelRotation: matchingPanel.content.primaryXAxis?.labelRotation || '',
              labelPlacement: matchingPanel.content.primaryXAxis?.labelPlacement || '',
              majorGridLines: {
                width: matchingPanel.content.primaryXAxis?.majorGridLines?.width || '',
                color: matchingPanel.content.primaryXAxis?.majorGridLines?.color || ''
              },
              majorTickLines: {
                width: matchingPanel.content.primaryXAxis?.majorTickLines?.width || '1',
                color: matchingPanel.content.primaryXAxis?.majorTickLines?.color || ''
              },
              lineStyle: {
                width: matchingPanel.content.primaryXAxis?.lineStyle?.width || '1',
                color: matchingPanel.content.primaryXAxis?.lineStyle?.color || ''
              },
              titleStyle: {
                size: matchingPanel.content.primaryXAxis?.titleStyle?.size || '',
                color: matchingPanel.content.primaryXAxis?.titleStyle?.color || '',
                fontWeight: matchingPanel.content.primaryXAxis?.titleStyle?.fontWeight || 'bold'
              }
            },
            
            primaryYAxis: {
              title: matchingPanel.content.primaryYAxis?.title || '',
              interval: matchingPanel.content.primaryYAxis?.interval ?? null,
              minimum: matchingPanel.content.primaryYAxis?.minimum ?? null,
              maximum: matchingPanel.content.primaryYAxis?.maximum ?? null,
              labelFormat: matchingPanel.content.primaryYAxis?.labelFormat || '',
              enableTrim: matchingPanel.content.primaryYAxis?.enableTrim || false,
              labelRotation: matchingPanel.content.primaryYAxis?.labelRotation || 0,
              labelIntersectAction: matchingPanel.content.primaryYAxis?.labelIntersectAction || 'Hide',
              majorGridLines: {
                width: matchingPanel.content.primaryYAxis?.majorGridLines?.width || 1,
                color: matchingPanel.content.primaryYAxis?.majorGridLines?.color || ''
              },
              majorTickLines: {
                width: matchingPanel.content.primaryYAxis?.majorTickLines?.width || 1,
                color: matchingPanel.content.primaryYAxis?.majorTickLines?.color || ''
              },
              lineStyle: {
                width: matchingPanel.content.primaryYAxis?.lineStyle?.width || 1,
                color: matchingPanel.content.primaryYAxis?.lineStyle?.color || ''
              },
              labelStyle: {
                size: matchingPanel.content.primaryYAxis?.labelStyle?.size || '12',
                color: matchingPanel.content.primaryYAxis?.labelStyle?.color || '#000'
              },
              titleStyle: {
                size: matchingPanel.content.primaryYAxis?.titleStyle?.size || '14',
                color: matchingPanel.content.primaryYAxis?.titleStyle?.color || '#000',
                fontWeight: matchingPanel.content.primaryYAxis?.titleStyle?.fontWeight || 'bold'
              }
            },
            axis: {
              title: matchingPanel.content.axis?.[0]?.title || '',
              interval: matchingPanel.content.axis?.[0]?.interval ?? null,
              minimum: matchingPanel.content.axis?.[0]?.minimum ?? null,
              maximum: matchingPanel.content.axis?.[0]?.maximum ?? null,
              labelFormat: matchingPanel.content.axis?.[0]?.labelFormat || '',
              labelRotation: matchingPanel.content.axis?.[0]?.labelRotation || 0,
              labelStyle: {
                size: matchingPanel.content.axis?.[0]?.labelStyle?.size || '12',
                color: matchingPanel.content.axis?.[0]?.labelStyle?.color || '#000'
              },
              titleStyle: {
                size: matchingPanel.content.axis?.[0]?.titleStyle?.size || '14',
                color: matchingPanel.content.axis?.[0]?.titleStyle?.color || '#000',
                fontWeight: matchingPanel.content.axis?.[0]?.titleStyle?.fontWeight || 'bold'
              }
            },
            chartArea: {
              border: {
                width: matchingPanel.content.chartArea?.border?.width || '',
                color: matchingPanel.content.chartArea?.border?.color || ''
              }
            },
            legends: {
              visible: matchingPanel.content.legends?.visible != null ? matchingPanel.content.legends.visible : true,
              position: matchingPanel.content.legends?.position || 'Bottom',
              textStyle: {
                size: matchingPanel.content.legends?.textStyle?.size || '',
                color: matchingPanel.content.legends?.textStyle?.color || ''
              }
            },

            tooltip: {
              enable: matchingPanel.content.tooltip?.enable != null ? matchingPanel.content.tooltip.enable : true,
              shared: matchingPanel.content.tooltip?.shared != null ? matchingPanel.content.tooltip.shared : true,
              //  header: 'Unemployment',
              // format: '<b>${point.x} : ${point.y}</b>'
            },

            tooltipFormat: matchingPanel.content.tooltipFormat ? matchingPanel.content.tooltipFormat : "Percentage",
            datalabelFormat: matchingPanel.content.datalabelFormat ? matchingPanel.content.datalabelFormat : "Percentage",
            enableFilter: matchingPanel.content.enableFilter != null ? matchingPanel.content.enableFilter : true,
            clickType : matchingPanel.content.clickType || 'Single',
            enableScrollbar: matchingPanel.content.enableScrollbar != null ? matchingPanel.content.enableScrollbar : false,
            scrollbarPercentage: matchingPanel.content.scrollbarPercentage ? matchingPanel.content.scrollbarPercentage : 1,

          });
          this.onChartTypeSelect(matchingPanel.content.chartType);

          this.conditionValue = this.getPanelObj.content.conditions;
         this.conditionalFormatArray =  this.getPanelObj.content.conditionalFormatArray ? this.getPanelObj.content.conditionalFormatArray : [];

          if (matchingPanel.content !== undefined) {

            if (matchingPanel.content.measure) {
              this.measureSeriesArray = matchingPanel.content.measure;
            } else {
              this.measureSeriesArray = [];
            }

            if (matchingPanel.content.dimension) {
              this.dimensionGroupingArray = matchingPanel.content.dimension?.levels;
            } else {
              this.dimensionGroupingArray = [];
            }
          }

          this.chartService.getTableNamesArrary(this.connection_id).subscribe((res: any) => {
            let data = res['data'];
            this.tableNamesArray = data;
            if (matchingPanel.content.tableName) {
              this.onTableDropdown(matchingPanel.content.tableName);
            }
            // Refresh tab component after data is loaded
            this.refreshTabComponent();
          });

        }
      }
    }

  }
  @ViewChild('rawQueryDimension')
  rawQueryDimension!: DialogComponent;


  columnsArr: any = [];
 conditionalFormatArray: any[] = [];
  showConditionAddBtn = true;
  updateConditonBtn = false;
  selectedConditionIndex: number = -1;

  ngOnInit(): void {

    this.headerText = [{ text: "General" },
    { text: "Dimension(X-Axis)" }, { text: "Measure(Y-Axis)" }, { text: "Condition" }, { text: "Chart Props" }, { text: "X-Axis Props" }, { text: "Y1-Axis Props" },  { text: "Y2-Axis Props" }, {text : 'Conditional Formatting'}];

    // console.log('this.headerText', this.headerText)


    let parseApiPanelSeriesArray = sessionStorage.getItem('ApiPanelSeriesArray')
    if (parseApiPanelSeriesArray) {
      this.ApiPanelSeriesArray = JSON.parse(parseApiPanelSeriesArray)
    }

  }
  isModal: Boolean = true;
  showCloseIcon: Boolean = false;
  visible: Boolean = false;
  animationSettings: AnimationSettingsModel = { effect: 'SlideBottom' };

  selectedDimensionItemLevel: any;
  selectedDimentiontemIndex: any;
  selectedDimensionItem: any;
  

  onOpenrawQuery(item: any, index: any, level: any) {
    this.selectedDimensionItemLevel = level;
    this.selectedDimentiontemIndex = index;
    this.selectedDimensionItem = item;

    // Assuming dashboardCreationForm is an instance of FormGroup in your component
    const dimensionFormGroup: any = this.dashboardCreationForm.get('dimension');

    // Check if rawQuery value exists for the given level in the item
    const rawQueryValue = item?.rawQuery && item.level === level ? item.rawQuery : '';

    // Patch the value into the form
    dimensionFormGroup.patchValue({
      rawQuery: rawQueryValue
    });

    this.rawQueryDimension.show();
    console.log(item, index, level);
  }




  onOkButtonClick() {
    // Get the value from the textarea
    const newValue = this.dashboardCreationForm.value.dimension.rawQuery;
    console.log(newValue)

    // Update the array at the specified level and index
    this.dimensionGroupingArray[this.selectedDimentiontemIndex].rawQuery = newValue;

    console.log(this.dimensionGroupingArray)
    // Reset the selected item level and index
    this.selectedDimensionItemLevel = null;
    this.selectedDimentiontemIndex = null;

    this.dashboardCreationForm.patchValue({
      dimension: {
        rawQuery: '',
      }
    });

    this.rawQueryDimension.hide();
  }

  ngAfterViewInit() {
    // Initial tab refresh
    this.refreshTabComponent();
  }

  refreshTabComponent() {
    // Force tab component to refresh and recalculate its width
    setTimeout(() => {
      if (this.tab) {
        this.tab.refresh();
      }
    }, 100);
  }

  onAddGrouping() {
    const dimensionFormGroup: any = this.dashboardCreationForm.get('dimension');
    const newObject: any = dimensionFormGroup?.value || {};

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
      const maxLevel = Math.max(...this.dimensionGroupingArray.map(obj => obj.level));
      newLevel = maxLevel + 1;
    }

    let obj = {
      "tableName": newObject.tableName || '',
      "fieldName": newObject.fieldName || '',
      "labelName": newObject.labelName || '',
      "level": newLevel,
      "expression": newObject.expression ? newObject.expression.trim() : '',
      "rawQuery": newObject.rawQuery ? newObject.rawQuery.trim() : '',
      "levelTitle": newObject.levelTitle || ''
    };


    this.dimensionGroupingArray.push(obj);

    // Reset form controls except for 'tableName'
    for (const controlName in dimensionFormGroup.controls) {
      if (controlName !== 'tableName') {
        dimensionFormGroup.controls[controlName].reset();
      }
    }
  }

  addRawQuery() {
    const dimensionFormGroup: any = this.dashboardCreationForm.get('dimension');
    let newObject: any = dimensionFormGroup?.value;
    console.log(newObject)

    this.dimensionGroupingArray.push(newObject);
    let measureControl = this.dashboardCreationForm.get('dimension');

    measureControl?.patchValue(newObject)
  }

  onDeleteDiemnsionSeries(id: any, ele: any) {
    this.dimensionGroupingArray.splice(id, 1)
  }

  editDimensionSeriesIndex: any

  onEditDiemsionSeries(item: any, id: any) {
    console.log(item)
    this.editDimensionSeriesIndex = id;
    this.showUpdateButton = true;
    this.showAddButton = false;
    let measureControl = this.dashboardCreationForm.get('dimension');
    measureControl?.patchValue(item)
  }




  ngOnDestroy() {
    this.dimensionGroupingArraySubject.unsubscribe(); // Unsubscribe to avoid memory leaks
  }
  onFirstDropdownChange(eve: any) {
    const dropdownValue = eve.target.value;
    const tableArray = this.tableNamesArray[dropdownValue];

    const tableNameControl = this.dashboardCreationForm.get('tableName');
    const measureFormGroup = this.dashboardCreationForm.get('measure');
    const measureTableNameControl = measureFormGroup!.get('tableName');
    const dimensionFormGroup = this.dashboardCreationForm.get('dimension');
    const dimensionTableNameControl = dimensionFormGroup!.get('tableName');
    measureTableNameControl!.setValue(dropdownValue);
    dimensionTableNameControl!.setValue(dropdownValue);
    tableNameControl!.setValue(dropdownValue);


    this.chartService.getColumnNameBYTableName(dropdownValue, this.connection_id).subscribe((res: any) => {
      console.log(res);
      let data = res['data']
      // for(let )
      this.selectedTableFieldName = Object.keys(data)
    })
    console.log(this.selectedTableFieldName);

  }

  onDimensionFieldDropdown(eve: any) {
    // let dropdownValue = eve.target.value
    let dropdownValue = eve
    const dimensionFormGroup = this.dashboardCreationForm.get('dimension');
    const dimensionLabelControl = dimensionFormGroup!.get('labelName');
    dimensionLabelControl!.setValue(dropdownValue);
  }

  onMeasureFieldDropdown(eve: any) {
    // let dropdownValue = eve.target.value
    let dropdownValue = eve
    const measureFormGroup = this.dashboardCreationForm.get('measure');
    const measureLabelControl = measureFormGroup!.get('labelName');
    measureLabelControl!.setValue(dropdownValue);
  }

  onFieldDropdownChange(eve: any) {
    let dropdownValue = eve.target.value
    const measureFormGroup = this.dashboardCreationForm.get('measure');
    const measureLabelControl = measureFormGroup!.get('labelName');

    measureLabelControl!.setValue(dropdownValue);
  }

  createDashboardObj() {
    this.dashboardCreationForm = this.fb.group({
      tableName: ['', Validators.required],
      chartType: ['', Validators.required],
      background: [''],
      title: [''],
      groupBy: [""],
      conditions: [""],
      orderBy: [''],
      orderByType: [""],
      enableScrollbar: false,
      enableFilter : true,
      enableZoom : true,
      clickType : ['Single'],
      scrollbarPercentage: 1,
      tooltipFormat: [''],
      datalabelFormat: [""],
      primaryXAxis: this.fb.group({
        title: [""],
        interval: [""],
        minimum: [""],
        maximum: [''],
        intervalType: [""],
        enableTrim: false,
        labelFormat: [""],
        maximumLabelWidth: [""],
      
        labelIntersectAction: ["Hide"],
        labelPosition: ["Outside"],
        labelRotation: [""],
        labelPlacement: [''],
        majorGridLines: this.fb.group({
          width: [''],
          color: [""]
        }),
        majorTickLines: this.fb.group({
          width: ['1'],
          color: ['']
        }),
        lineStyle: this.fb.group({
          width: ['1'],
          color: ['']
        }),
        titleStyle: this.fb.group({
          size: [''],
          color: [''],
          fontWeight: 'bold' 
        })
      }),
      primaryYAxis: this.fb.group({
        title: [""],
        interval: [null],
        minimum: [null],
        maximum: [null],
        labelFormat: [""],
        enableTrim: [false],
        labelRotation: [0],
        labelIntersectAction: ["Hide"],
        majorGridLines: this.fb.group({
          width: [1],
          color: ['']
        }),
        majorTickLines: this.fb.group({
          width: [1],
          color: ['']
        }),
        lineStyle: this.fb.group({
          width: [1],
          color: ['']
        }),
        labelStyle: this.fb.group({
          size: ['12'],
          color: ['#000'],

        }),
        titleStyle: this.fb.group({
          size: ['14'],
          color: ['#000'],
          fontWeight: ['bold']
        })

      }),

      axis: this.fb.group({
        title: [""],
        interval: [null],
        minimum: [null],
        maximum: [null],
        labelFormat: [""],
        labelRotation: [0],
        labelStyle: this.fb.group({
          size: ['12'],
          color: ['#000'],

        }),
        titleStyle: this.fb.group({
          size: ['14'],
          color: ['#000'],
          fontWeight: ['bold']
        })

      }),
      chartArea: this.fb.group({
        border: this.fb.group({
          width: [''],
          color: ['']
        })
      }),
      legends: this.fb.group({
        visible: true,
        position: ['Bottom'],
        textStyle: this.fb.group({
          size: [''],
          color: [''],
        }),
      }),
      measure: this.fb.group({
        seriesType: [''],
        drawType: [''],
        tableName: [''],
        fieldName: [''],
        labelName: [''],
        seriesColor: [''],
        expression: [''],
        opposedPosition: [false],
        marker: this.fb.group({
          visible: true
        }),
        dataLabel: this.fb.group({
          visible: true,
          position: ['Outside'],
          format: [''],
          angle: [45],
          // enableRotation: [true],
          font: this.fb.group({
            fontWeight: ['400'],
            color: ['#000'],
            size: ['10px'] // Default font size
          }),
        })
      }),
      tooltip: this.fb.group({
        enable: true,
        shared: true,
      }),
      dimension: this.fb.group({
        tableName: [''],
        fieldName: [''],
        labelName: [''],
        level: [0],
        expression : [''],
        rawQuery: [''],
        levelTitle : ['']
      }),
      conditionalFormat : this.fb.group({
        fieldName: [''],
        condition: [''],
        value1: [''],
        value2: [''],
        color: [''],
      })
    })
  }

selectedConditionType : string = '';
  onSelectCondtionFormatValue(eve: any) {
    let value = eve.target.value;
    this.selectedConditionType = value
  }



  // Custom validator to ensure either 'rawQuery' or 'expression' is filled
 requireExpressionOrRawQueryValidator(): ValidatorFn {
    return (form: AbstractControl): ValidationErrors | null => {
      const expression = form.get('measure.expression')?.value;
      const rawQuery = form.get('dimension.rawQuery')?.value;
  
      // If both are empty, return an error
      if (!expression && !rawQuery) {
        return { requireExpressionOrRawQuery: true }; // Error key
      }
  
      // Otherwise, no error
      return null;
    };
  }

  onTableDropdown(dropdownValue: any) {
    // console.log(dropdownValue, this.connection_id)

    if (!dropdownValue) {
      this.selectedTableFieldName = []
      return;
    }
    const tableArray = this.tableNamesArray[dropdownValue];

    const tableNameControl = this.dashboardCreationForm.get('tableName');
    const measureFormGroup = this.dashboardCreationForm.get('measure');
    const measureTableNameControl = measureFormGroup!.get('tableName');
    const dimensionFormGroup = this.dashboardCreationForm.get('dimension');
    const dimensionTableNameControl = dimensionFormGroup!.get('tableName');

    measureTableNameControl!.setValue(dropdownValue);
    dimensionTableNameControl!.setValue(dropdownValue);
    tableNameControl!.setValue(dropdownValue);

    // Make fields read-only instead of disabling:
    // tableNameControl!.disable({ onlySelf: true });  // Use `disable({ onlySelf: true })` to prevent disabling child controls
    // measureTableNameControl!.disable({ onlySelf: true });
    // dimensionTableNameControl!.disable({ onlySelf: true });

    if (dropdownValue != undefined || dropdownValue != "" || dropdownValue != null) {
      this.chartService.getColumnNameBYTableName(dropdownValue, this.connection_id).subscribe((res: any) => {
        // console.log(res);
        if (res) {
          let data = res['data']
          // for(let )
          this.selectedTableFieldName = Object.keys(data)
        }

      })
      // console.log(this.selectedTableFieldName);
    } else {
      this.selectedTableFieldName = []
    }

  }
  filteredChartTypes: any = [];
  seriesTypeOptions: string[] = [];
  drawTypeSeriesArray: string[] = [];

  

  // onChartTypeSelect(event: any, chartType : string) {
  //   console.log('chartType', chartType)
  //   const selectedChartType = event.target.value;
  //   const measureFormGroup = this.dashboardCreationForm.get('measure');

  //   const measureChartTypeControl = measureFormGroup!.get('seriesType');
  //   const chartTypeContrl = this.dashboardCreationForm!.get('chartType');
  //   measureChartTypeControl!.setValue(selectedChartType);

  //   chartTypeContrl!.setValue(selectedChartType);
  //   // Update seriesTypeOptions based on the selected chart type
  //   if (selectedChartType === 'Pie') {
  //     this.seriesTypeOptions = ['Pie', 'Pyramid', 'Funnel'];

  //   } else if (selectedChartType === 'Donut') {
  //     this.seriesTypeOptions = ['Donut'];

  //   }


  //   else if (selectedChartType === 'Column') {

  //     this.seriesTypeOptions = ['Column', 'StackingColumn', 'StackingBar', 'StackingBar100', 'Bar',];

  //   } else if (selectedChartType === 'Line') {
  //     // Filter options for 'Column'
  //     this.seriesTypeOptions = ['Line', 'Spline', 'StepLine', 'StackingLine100', 'StackingLine'];
  //   } else if (selectedChartType === 'Area') {
  //     // Filter options for 'Column'
  //     this.seriesTypeOptions = ['Area', 'SplineArea', 'StepArea', 'StackingArea', 'StackingStepArea', 'StackingArea100'];
  //   }else if(selectedChartType === 'CombineChart'){
  //     this.seriesTypeOptions = ['Line', 'Spline',"Column",'StackingColumn','Area', 'SplineArea', 'StepLine', 'StackingLine', 'StepArea', 'StackingArea', 'StackingStepArea', 'StackingArea100', 'StackingBar', 'StackingBar100'];
  //   }
  //   else {
  //     // Add other cases as needed
  //     this.seriesTypeOptions = ['Bar', 'Line','Pie', 'Donut', 'Spline',"Column",'Pyramid', 'StackingColumn','Area', 'SplineArea', 'StepLine','Funnel', 'StackingLine100', 'StackingLine', 'StepArea', 'StackingArea', 'StackingStepArea', 'StackingArea100', 'StackingBar', 'StackingBar100'];

  //   }
  //   // Optionally, reset the selected value in the second dropdown
  //   // this.yourForm.get('seriesType').setValue('');
  // }

  SeriesPosition!: string;
  pieChartPosition: string[] = ['Outside', 'Middle', 'Top', 'Bottom', 'Inside'];
  columnChartPosition: string[] = ['Middle', 'Top', 'Bottom', 'Inside']

  onChartTypeSelect(chartType: string) {
    console.log('chartType', chartType)
    const measureFormGroup = this.dashboardCreationForm.get('measure');

    const measureChartTypeControl = measureFormGroup!.get('seriesType'); 
    const chartTypeContrl = this.dashboardCreationForm!.get('chartType');
    const drawTypeControl = this.dashboardCreationForm!.get('drawType');
    measureChartTypeControl!.setValue(chartType);
    // drawTypeControl!.setValue(chartType);


    if (chartType === 'Pie') {

      this.seriesTypeOptions = ['Pie', 'Pyramid', 'Funnel'];
      this.columnChartPosition = ['Outside', 'Middle', 'Top', 'Bottom', 'Inside']
    } else if (chartType === 'Donut') {
      this.seriesTypeOptions = ['Donut'];
      this.columnChartPosition = ['Outside', 'Middle', 'Top', 'Bottom', 'Inside']

    } else if (chartType === 'Column') {
      this.columnChartPosition = ['Outer', 'Middle', 'Top', 'Bottom', 'Inside']

      this.seriesTypeOptions = ['Column', 'StackingColumn', 'StackingBar', 'StackingBar100', 'Bar',];

    } else if (chartType === 'Line') {
      this.columnChartPosition = ['Outer', 'Middle', 'Top', 'Bottom', 'Inside']

      this.seriesTypeOptions = ['Line', 'Spline', 'StepLine', 'StackingLine100', 'StackingLine'];
    } else if (chartType === 'Area') {
      this.columnChartPosition = ['Outer', 'Middle', 'Top', 'Bottom', 'Inside']

      this.seriesTypeOptions = ['Area', 'SplineArea', 'StepArea', 'StackingArea', 'StackingStepArea', 'StackingArea100'];
    } else if (chartType === 'CombineChart') {
      this.columnChartPosition = ['Outer', 'Middle', 'Top', 'Bottom', 'Inside']

      this.seriesTypeOptions = ['Line', 'Spline', "Column", 'StackingColumn', 'Area', 'SplineArea', 'StepLine', 'StackingLine', 'StepArea', 'StackingArea', 'StackingStepArea', 'StackingArea100', 'StackingBar', 'StackingBar100'];
    }else if(chartType === 'Polar'){
      this.seriesTypeOptions = ['Polar', 'Radar'];
      this.drawTypeSeriesArray = ['Line', 'Spline', 'Area', 'StackingArea', 'Scatter', 'Column', 'StackingColumn']
    }
    else {
      // Add other cases as needed
      this.seriesTypeOptions = ['Bar', 'Line', 'Pie', 'Donut', 'Spline', "Column", 'Pyramid', 'StackingColumn', 'Area', 'SplineArea', 'StepLine', 'Funnel', 'StackingLine100', 'StackingLine', 'StepArea', 'StackingArea', 'StackingStepArea', 'StackingArea100', 'StackingBar', 'StackingBar100'];

    }

    


    // Optionally, reset the selected value in the second dropdown
    // this.yourForm.get('seriesType').setValue('');
  }


  onAddMeasureSeries() {
    const formValue = this.dashboardCreationForm.value;

    // Ensure measure form group exists and has required properties
    const measure = formValue.measure || {};
    
    // Create a new object to hold the values with protective checks
    const newSeries = {
      seriesType: measure.seriesType || '',
      drawType: measure.drawType || '',
      tableName: measure.tableName || '',
      fieldName: measure.fieldName || '',
      labelName: measure.labelName || '',
      seriesColor: measure.seriesColor || '',
      expression: measure.expression ? measure.expression.trim() : '',
      opposedPosition: measure.opposedPosition != null ? measure.opposedPosition : false,
      marker: {
        visible: measure.marker?.visible != null ? measure.marker.visible : true
      },
      dataLabel: {
        visible: measure.dataLabel?.visible != null ? measure.dataLabel.visible : true,
        position: measure.dataLabel?.position ? measure.dataLabel.position : 'Outside',
        format: measure.dataLabel?.format ? measure.dataLabel.format : '{value}',
        font: {
          fontWeight: measure.dataLabel?.font?.fontWeight || '400',
          color: measure.dataLabel?.font?.color || '#000',
          size: measure.dataLabel?.font?.size ? measure.dataLabel.font.size + 'px' : '10px'
        }
      }
    };

    // Push the new object to the array
    this.measureSeriesArray.push(newSeries);

    // Reset form controls except for 'tableName'
    const measureFormGroup = this.dashboardCreationForm.get('measure');
    if (measureFormGroup instanceof FormGroup) {
      for (const controlName in measureFormGroup.controls) {
        if (controlName !== 'tableName' && controlName !== 'seriesType' && controlName !== 'drawType') {
          measureFormGroup.controls[controlName].reset();
        }
      }
    }
  }



  getDataLabelPosition(seriesType: string, dataLabelPosition: string): string {
    if (seriesType === 'Pie' || seriesType === 'Donut' || seriesType === 'Funnel') {
      return 'Outer';
    } else {
      return dataLabelPosition || 'Outside';
    }
  }

  onAddSeries() {
    const formValue = this.dashboardCreationForm.value;
    console.log(formValue.measure);


    this.measureSeriesArray.push(formValue.measure);

    // Reset form controls except for 'tableName'
    const measureFormGroup = this.dashboardCreationForm.get('measure');
    if (measureFormGroup instanceof FormGroup) {
      for (const controlName in measureFormGroup.controls) {
        if (controlName !== 'tableName' && controlName !== 'seriesColor') {
          measureFormGroup.controls[controlName].reset();
        }
      }
    }
  }

  validationMessage: string | null = null;

   convertTimeToMinutes(timeString: string): number {
    const [hours, minutes, seconds] = timeString.split(":").map(Number);
    return hours * 60 + minutes + seconds / 60;
  }

  
  onDashboardCreationForm() {

    let id = this.getPanelObj.id;
    let formValue = this.dashboardCreationForm.value;
    // console.log(formValue, 'chartObj');

    if (this.dashboardCreationForm.invalid) {
      console.log(this.dashboardCreationForm.invalid);
      this.dashboardCreationForm.markAllAsTouched();  // This will show validation messages for all invalid fields
      return false; // Return false if the form is invalid
    }

    let panelsArrData: any = sessionStorage.getItem('createPanelSeriesArray');

    this.panelSeriesArray = panelsArrData;

    if (this.panelSeriesArray) {
      this.panelSeriesArray = JSON.parse(this.panelSeriesArray)
      let object = this.panelSeriesArray.find((ele: any) => ele.id === id);
      // console.log(object)

      const matchingObjectIndex = Array.isArray(this.panelSeriesArray)
        ? this.panelSeriesArray.findIndex(obj => obj.id === id)
        : -1;
      // console.log(matchingObjectIndex);

      // console.log('this.dimensionGroupingArray', this.dimensionGroupingArray, 'this.measureSeriesArray', this.measureSeriesArray)

      const hasRawQuery = this.dimensionGroupingArray.some(
        (dim: any) => dim.rawQuery && dim.rawQuery.trim() !== ''
      );
  
      const hasExpression = this.measureSeriesArray.some(
        (measure: any) => measure.expression && measure.expression.trim() !== ''
      );
      // console.log('hasRawQuery', hasRawQuery, 'hasExpression', hasExpression)
      if (!hasRawQuery && !hasExpression) {
        // console.error('Validation Error: Missing rawQuery in dimension or expression in measure.');
        this.validationMessage = 'Validation Error: Missing rawQuery in dimension or expression in measure.';
        return false;
      }
      
      // If at least one of them is true, return true and don't show the error
      this.validationMessage = ''; // Clear any previous validation message

      let apiObj: any = {
        "object_id": id + "_chart",
        "object_setup": {

          "content": {
            "id": id + "chart" + this.chartIdCount,
            "title": formValue.title,
            "height": "97%",
            "width": "97%",
            "background": formValue.background,
            "chartType": formValue.chartType,
            "tableName": formValue.tableName,
            // "rawQuery": (formValue.rawQuery === "" || formValue.rawQuery === undefined) ? "" : formValue.rawQuery,
            "groupBy": formValue.groupBy || [],
            "conditions": formValue.conditions || '',
            "orderBy": formValue.orderBy || [],
            "orderByType": formValue.orderByType || '',
            "tooltipFormat": formValue.tooltipFormat || 'Percentage',
            "datalabelFormat": formValue.datalabelFormat || 'Percentage',
            "dataSource": [],
            "chartArea": formValue.chartArea,
            "series": [],
            'enableScrollbar': formValue.enableScrollbar,
            // enableFilter : formValue.enableFilter,
                 enableFilter : formValue.enableFilter != null ? formValue.enableFilter : true,
            'scrollbarPercentage': formValue.scrollbarPercentage,
            clickType : formValue.clickType || "Single",
            conditionalFormatArray : this.conditionalFormatArray ? this.conditionalFormatArray : [],
            "primaryXAxis": {
              // "zoomFactor": 0.02,
              "zoomFactor": formValue.scrollbarPercentage ? +(formValue.scrollbarPercentage) : 1,
               "interval": formValue.primaryXAxis.interval ? formValue.primaryXAxis.interval : null,
              "title": formValue.primaryXAxis.title || '',
              "majorGridLines": formValue.primaryXAxis.majorGridLines,
              titleStyle  :formValue.primaryXAxis.titleStyle,
              maximumLabelWidth : formValue.primaryXAxis.maximumLabelWidth || '',
  //             maximumLabelWidth: formValue.primaryXAxis.maximumLabelWidth
  // ? formValue.primaryXAxis.maximumLabelWidth.toString()
  // : '',

              // ...formValue.primaryXAxis
              "labelPlacement": formValue.primaryXAxis.labelPlacement || '',
              "labelFormat": formValue.primaryXAxis.labelFormat ? formValue.primaryXAxis.labelFormat : '',
              "labelIntersectAction": formValue.primaryXAxis.labelIntersectAction ? formValue.primaryXAxis.labelIntersectAction : "Hide",
              // "majorTickLines": formValue.primaryXAxis.majorTickLines,
              "majorTickLines": {
                              width: formValue.primaryXAxis.majorTickLines?.width || 1,
                              color: formValue.primaryXAxis.majorTickLines?.color || ""
              },
              
              "enableTrim": formValue.primaryXAxis.enableTrim,
              "lineStyle": formValue.primaryXAxis.lineStyle,
              "labelPosition": formValue.primaryXAxis.labelPosition,
              //  labelPlacement: 'OnTicks',
              "labelRotation": formValue.primaryXAxis.labelRotation ? formValue.primaryXAxis.labelRotation : 0,
              // zoomPosition: 0,
            },  
            "zoomSettings": {
              // old code //
                      // mode: 'Y',
                      // enableMouseWheelZooming: formValue.enableScrollbar ? formValue.enableScrollbar : false,
                      // enablePinchZooming: formValue.enableScrollbar ? formValue.enableScrollbar : false,
                      // enableSelectionZooming: formValue.enableScrollbar ? formValue.enableScrollbar : false,
                      // enableScrollbar: formValue.enableScrollbar ? formValue.enableScrollbar : false

                mode: 'Y',
                enableMouseWheelZooming: false,
                enablePinchZooming: false,
                enableSelectionZooming: false,
                enableScrollbar: formValue.enableScrollbar != null ? formValue.enableScrollbar : false,
                toolbarItems: formValue.enableZoom ? ['Zoom', 'ZoomIn', 'ZoomOut', 'Reset'] : [],
                showToolbar: formValue.enableZoom ?? false
              /// new code /// 
              // enableScrollbar: formValue.enableScrollbar ? formValue.enableScrollbar : false,
              // mode: 'X',
              // enableMouseWheelZooming: false,
              // enablePinchZooming: false,
              // enableSelectionZooming: false,
              // showToolbar: formValue.enableZoom ?? false,
              // toolbarItems: formValue.enableZoom ? ['Zoom', 'ZoomIn', 'ZoomOut', 'Reset'] : []

            


            },
            "primaryYAxis": {
              "title": formValue.primaryYAxis.title,
              "majorGridLines": formValue.primaryYAxis.majorGridLines,
              "majorTickLines": {
                width: formValue.primaryYAxis.majorTickLines?.width || 1,
                color: formValue.primaryYAxis.majorTickLines?.color || ""
              },
              "lineStyle": formValue.primaryYAxis.lineStyle,
              "titleStyle": formValue.primaryYAxis.titleStyle,
              "interval": formValue.primaryYAxis.interval ? formValue.primaryYAxis.interval : null,
              "minimum": formValue.primaryYAxis.minimum ? formValue.primaryYAxis.minimum : null,
              "maximum": formValue.primaryYAxis.maximum ? formValue.primaryYAxis.maximum : null,
              "labelRotation": formValue.primaryYAxis.labelRotation ? formValue.primaryYAxis.labelRotation : 0,
              "enableTrim": formValue.primaryYAxis.enableTrim ? formValue.primaryYAxis.enableTrim : false,
              "labelIntersectAction": formValue.primaryYAxis.labelIntersectAction ? formValue.primaryYAxis.labelIntersectAction : "Hide",
            },
            axis: [{
              name: 'yAxis',
              rowIndex: 0, 
              opposedPosition: true,
              visible: true,
              interval: formValue.axis.interval ? formValue.axis.interval : null,
              minimum: formValue.axis.minimum ? formValue.axis.minimum : null,
              maximum: formValue.axis.maximum ? formValue.axis.maximum : null,
              labelRotation: +(formValue.axis.labelRotation),
              majorGridLines: {
                "width": 0,
                "color": ""
              },
              titleStyle: {
                size: formValue.axis.titleStyle.size + 'px',
                ...formValue.axis.titleStyle
              },
              ...formValue.axis
            }],
            "tooltip": {
              "enable": formValue.tooltip.enable,
               "shared": formValue.tooltip.shared,
              // header: 'Unemployment',
              // format: '<b>${point.x} : ${point.y}</b>'
            },
            "legends": {
              "textWrap": 'Wrap',
              ...formValue.legends
            },
            "dimension": {
              "levels": this.dimensionGroupingArray
            },
            "measure": this.measureSeriesArray
          }

        },
        "object_type": "chart",
        "connection_id": this.connection_id,
      }


      console.log(apiObj)

      const firstLevelFieldName = apiObj.object_setup.content.dimension.levels
        && apiObj.object_setup.content.dimension.levels.length > 0
        ? apiObj.object_setup.content.dimension.levels[0].fieldName
        : '';

      // console.log(firstLevelFieldName)
      // let seriesValueType!: string;

      let seriesDataArray = apiObj.object_setup.content.measure.map((ele: any) => {
        let obj: any = {
          xName: firstLevelFieldName,
          yName: ele.fieldName,
          dataSource: [],
          type: ele.seriesType,
          name: ele.labelName,
          fill: ele.seriesColor,
          expression: ele.expression,
          // width : 3
          // opposedPosition : ele.opposedPosition ?  ele.opposedPosition : false
        };

        if (ele.opposedPosition) {
          obj = {
            ...obj,
            opposedPosition: ele.opposedPosition,
            yAxisName: 'yAxis',

          }
        } else {
          obj = {
            ...obj,

          }
        }

        // console.log('ele.series' , ele)

        if ((ele.seriesType == 'Pie') || (ele.seriesType == 'Donut') || (ele.seriesType == 'Pyramid') || (ele.seriesType == 'Funnel')) {

          obj.marker = ele.marker;
          const { format, ...dataLabelWithoutFormat } = ele.dataLabel; // Exclude `format`
           obj.dataLabel = {
             // ...ele.dataLabel,
             connectorStyle: {
               length: '10px',
               type: 'Curve'
             },
             textWrap: 'Wrap',
             ...dataLabelWithoutFormat
           };
        } else if((ele.seriesType == 'Polar') || (ele.seriesType == 'Radar')){
          obj = {
            ...obj,
            drawType : ele.drawType

          }
        }{
          obj.marker = {
            visible: ele.marker.visible,
            dataLabel: {
              ...ele.dataLabel,
              margin: {
                top: 10,           // Adds space between the series and the data label
                bottom: 0,
                left: 0,
                right: 0
              },
              enableRotation : true,
 
            },

          };
        }


        return obj;
      });
      // console.log(seriesDataArray)

      apiObj = {
        ...apiObj,
        object_setup: {
          content: {
            ...apiObj.object_setup.content,
            series: seriesDataArray,

          }
        }


      }
      console.log(apiObj)

      if (matchingObjectIndex !== -1) {
        this.panelSeriesArray[matchingObjectIndex] = {
          ...this.getPanelObj,
          content: {
            ...apiObj.object_setup.content
          }
        };


        sessionStorage.setItem('createPanelSeriesArray', JSON.stringify(this.panelSeriesArray));

        this.chartService.objectPivotCreate(apiObj).subscribe(
          (res: any) => {
            console.log("Chart Obj", res);

            if (res.success === true) {
              let data = res['data'];
              let chartObjData = data.object_setup.content;
   
              console.log('chartObjData', chartObjData)
              let seriesValueType: string = "Category";
              let xAxisInterval = null

              const rawData = chartObjData.dataSource;
              let measureArr = chartObjData.measure;
              let MeasurefieldNames = measureArr.map((ele: any) => ele.fieldName);

              // chartObjData.series.forEach((element: any) => {
              //   // console.log('element', element)
              //   const dataSource = element.dataSource;
              //   const matchedValue = dataSource[0][element.xName];
              //   const matchedYValue = dataSource[0][element.yName];

              //   const updatedDataSource = dataSource.map((entry: any) => {
              //     const updatedEntry = { ...entry };
                
              //     MeasurefieldNames.forEach((field: any) => {
              //       const value = entry[field];
                    
              //       // Allow any number of digits in hours
              //       if (typeof value === 'string' && /^\d+:\d{2}:\d{2}$/.test(value)) {
              //         updatedEntry[field] = this.timeStringToSeconds(value);
              //       }
              //     });
                
              //     return updatedEntry;
              //   });

              //   element.dataSource = updatedDataSource;


              //   // if (matchedValue instanceof Date || (!isNaN(matchedValue) && !isNaN(new Date(matchedValue).getTime()))) {
              //   //   seriesValueType = 'DateTime';
              //   // } else
                
              //   if (typeof matchedValue === 'string') {
              //     const parsedDate = new Date(matchedValue);
              //     // console.log('parsedDate', parsedDate)
              //     // if (!isNaN(parsedDate.getTime())) {
              //     //   seriesValueType = 'DateTime';
              //     // } else {
              //     //   console.log('parsedDate', parsedDate)

              //     //   seriesValueType = 'Category';
              //     // }
              //     seriesValueType = 'Category';
              //     xAxisInterval = null

              //   } else if (!isNaN(matchedValue) && typeof matchedValue === 'number') {
              //     // seriesValueType = 'Number';
              //     seriesValueType = 'Double';
              //     xAxisInterval = 1
              //   }


              // });

              chartObjData.series.forEach((element: any) => {
  const dataSource = element.dataSource;
  let seriesValueType: string = 'Category'; // Default value
  let xAxisInterval = null;

  // Check if dataSource exists and has items
  if (dataSource && dataSource.length > 0) {
    const matchedValue = dataSource[0][element.xName];
    const matchedYValue = dataSource[0][element.yName];

    // Check matchedValue type and set seriesValueType
    if (typeof matchedValue === 'string') {
      seriesValueType = 'Category';
      xAxisInterval = null;
    } else if (!isNaN(matchedValue) && typeof matchedValue === 'number') {
      seriesValueType = 'Double';
      xAxisInterval = 1;
    }

    // Process data source entries
    const updatedDataSource = dataSource.map((entry: any) => {
      const updatedEntry = { ...entry };
      MeasurefieldNames.forEach((field: any) => {
        const value = entry[field];
        if (typeof value === 'string' && /^\d+:\d{2}:\d{2}$/.test(value)) {
          updatedEntry[field] = this.timeStringToSeconds(value);
        }
      });
      return updatedEntry;
    });

    element.dataSource = updatedDataSource;
  }
});


              console.log('chartObjData before SubmitOBj', chartObjData)

              // console.log(seriesDataArray)
              let submitObj = {
                ...this.getPanelObj,
                header: chartObjData.title,
                content: {
                  id: id + "_chart_" + this.chartIdCount,
                  title: chartObjData.title,
                  "height": chartObjData.height,
                  "width": chartObjData.width,
                  background: chartObjData.background,
                  chartType: chartObjData.chartType,
                  tableName: chartObjData.tableName,
                  chartArea: chartObjData.chartArea,
                  groupBy: chartObjData.groupBy,
                  conditions: chartObjData.conditions,
                  orderBy: chartObjData.orderBy,
                  orderByType: chartObjData.orderByType,
                  tooltipFormat: chartObjData.tooltipFormat,
                  datalabelFormat: chartObjData.datalabelFormat,
                  conditionalFormatArray : chartObjData.conditionalFormatArray ? chartObjData.conditionalFormatArray : [],

                  // rawQuery: chartObjData.rawQuery,
                  dataSource:chartObjData.dataSource ? chartObjData.dataSource  :  [],
                  primaryXAxis: {
                    valueType: seriesValueType,
                    // coefficient: 80,
                    //  interval: 1,
                     interval:  chartObjData.primaryXAxis.interval ? chartObjData.primaryXAxis.interval :  xAxisInterval  ,
                     
                    ...chartObjData.primaryXAxis,
                    //  minimum : '2024-07-25',
                    //  maximum : '2024-08-14',
                  },
                  primaryYAxis: chartObjData.primaryYAxis
                  ,
                  zoomSettings: chartObjData.zoomSettings,
                  tooltip: chartObjData.tooltip,
                  legends: chartObjData.legends
                  ,
                  series: chartObjData.series,
                  dimension: chartObjData.dimension,
                  measure: chartObjData.measure,
                  enableScrollbar: chartObjData.enableScrollbar,
                  enableFilter : chartObjData.enableFilter,
                  clickType : chartObjData.clickType,
                  scrollbarPercentage: chartObjData.scrollbarPercentage,

                  axis: chartObjData.axis


                },
              };
              console.log(submitObj, 'submitObj')

              this.sendBoxObj.emit({ boxObj: submitObj, resObj: { resSuccess: res.success, resMessage: res.message, statusCode: res.status_code } });

              // this.sendBoxObj.emit({ boxObj: submitObj, resObj: { resSuccess: res.success, resMessage: res.message } });

              this.dashboardCreationForm.reset();
            } else {
              let boxObj = this.panelSeriesArray[matchingObjectIndex]
              this.sendBoxObj.emit({ boxObj: boxObj, resObj: { resSuccess: res.success, resMessage: res.message, statusCode: res.status_code } });

            }


          },

          (err: any) => {
            let boxObj = this.panelSeriesArray[matchingObjectIndex]
            const errorMessage = err.error && err.error.message ? err.error.message : err.message;
            this.sendBoxObj.emit({ boxObj: boxObj, resObj: { resSuccess: false, resMessage: errorMessage, statusCode: err.status } });

          }
        )
      }


    }
    this.chartIdCount = this.chartIdCount + 1;

    return true;
  }

  timeStringToSeconds(timeStr: string): number {
    const [hours, minutes, seconds] = timeStr.split(":").map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  }

  editObjSeriesIndex: any;
  onDeleteSeries(id: any) {
    console.log(id);
    this.measureSeriesArray.splice(id, 1)
  }
  onEditSeries(obj: any, index: any) {
    console.log(obj)
    this.editObjSeriesIndex = index;
    this.showUpdateButton = true;
    this.showAddButton = false;
    // this.onTableDropdown(obj.tableName);

    // Ensure obj and nested properties exist before accessing
    const fontSize = obj?.dataLabel?.font?.size || '10';
    const fontSizeNumeric = parseInt(fontSize);

    console.log('fontSizeNumeric', fontSizeNumeric);

    // measure: this.fb.group({
    //   seriesType: [''],
    //   drawType: [''],
    //   tableName: [''],
    //   fieldName: [''],
    //   labelName: [''],
    //   seriesColor: [''],
    //   expression: [''],
    //   opposedPosition: [false],
    //   marker: this.fb.group({
    //     visible: true
    //   }),
    //   dataLabel: this.fb.group({
    //     visible: true,
    //     position: ['Outside'],
    //     format: [''],
    //     // angle: [45],
    //     // enableRotation: [true],
    //     font: this.fb.group({
    //       fontWeight: ['400'],
    //       color: ['#000'],
    //       size: ['10px'] // Default font size
    //     }),
    //   })
    // }),


    let measureControl = this.dashboardCreationForm.get('measure');
    measureControl?.patchValue({
      ...obj,
      seriesType: obj.seriesType,
      dataLabel : {
        ...obj.dataLabel,
        font  :{
          ...obj.dataLabel.font,
          size : fontSizeNumeric
        }
      }
    })
  }


  conditionValue: any;
  rawQueryValue: any;

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
    const selectedValue = this.dashboardCreationForm.get('tableName')!.value;
    console.log(selectedValue)
    console.log(currentText)
    const operator = event.target.value;

    // if (selectedValue) {
    const updatedText = `${currentText}${operator}`;
    this.conditionValue = updatedText;
    // }
  }

  addTextWithoutSpace(event: any) {
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
    const operator = event.target.value || ""; // Replace "YourValue" with a default value if necessary
    const currentText = this.conditionValue;
  
    if (operator) {
      // Add spaces before and after the operator
      const operatorWithSpaces = ` ${operator} `;
  
      // Insert the operator with spaces at the cursor position
      const beforeCursor = currentText.slice(0, this.cursorConditionPosition);
      const afterCursor = currentText.slice(this.cursorConditionPosition);
      this.conditionValue = `${beforeCursor}${operatorWithSpaces}${afterCursor}`;
  
      // Update the cursor position to account for the length of the operator with spaces
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
  

  addRawQueryTextOld(event: any) {
    const currentText = this.rawQueryValue;
    const selectedValue = this.dashboardCreationForm.get('tableName')!.value;
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
      // Add spaces before and after the operator
      const operatorWithSpaces = ` ${operator} `;
  
      // Insert the operator with spaces at the cursor position
      const beforeCursor = currentText.slice(0, this.cursorPosition);
      const afterCursor = currentText.slice(this.cursorPosition);
      this.rawQueryValue = `${beforeCursor}${operatorWithSpaces}${afterCursor}`;
  
      // Update the cursor position to account for the length of the operator with spaces
      this.cursorPosition += operatorWithSpaces.length;
  
      // Optionally, restore focus to the textarea
      const textarea = document.getElementById("pop_chart_expression") as HTMLTextAreaElement;
      if (textarea) {
        textarea.focus();
        textarea.setSelectionRange(this.cursorPosition, this.cursorPosition);
      }
    }
  }
  

  
  onClearRawQuery() {
    this.rawQueryValue = "";
    let measureConrolValue = this.dashboardCreationForm.get('dimension')?.value;

    if (measureConrolValue) {
      measureConrolValue.rawQuery = "";
    }
  }
  onClearConditions() {

    this.conditionValue = "";
    // this.dashboardCreationForm.get('conditions')!.reset();
    this.dashboardCreationForm.get('conditions')!.setValue("");
  }
  onUpdateSeries1() {
    let measureConrolValue = this.dashboardCreationForm.get('measure');
    console.log(measureConrolValue?.value);

    // const chartTypeContrl = this.dashboardCreationForm!.get('chartType');
    const chartTypeContrl = this.dashboardCreationForm;

    let updateObj  = measureConrolValue?.value || {};

    // Ensure nested objects exist and apply defaults
    let fontSize = updateObj.dataLabel?.font?.size ?  updateObj.dataLabel.font.size + 'px' : '10px';

    updateObj  = {
      seriesType: updateObj.seriesType || '',
      drawType: updateObj.drawType || '',
      tableName: updateObj.tableName || '',
      fieldName: updateObj.fieldName || '',
      labelName: updateObj.labelName || '',
      seriesColor: updateObj.seriesColor || '',
      expression: updateObj.expression ? updateObj.expression.trim() : '',
      opposedPosition: updateObj.opposedPosition != null ? updateObj.opposedPosition : false,
      marker: {
        visible: updateObj.marker?.visible != null ? updateObj.marker.visible : true
      },
      dataLabel : {
        visible: updateObj.dataLabel?.visible != null ? updateObj.dataLabel.visible : true,
        position: updateObj.dataLabel?.position || 'Outside',
        format: updateObj.dataLabel?.format || '{value}',
        font : {
          fontWeight: updateObj.dataLabel?.font?.fontWeight || '400',
          color: updateObj.dataLabel?.font?.color || '#000',
          size : fontSize
        }
      }
    }

    console.log('updateObj', updateObj)


    this.measureSeriesArray.splice(this.editObjSeriesIndex, 1, updateObj);
    this.showUpdateButton = false;
    this.showAddButton = true;
    if (measureConrolValue instanceof FormGroup) {
      for (const controlName in measureConrolValue.controls) {
        if (controlName !== 'tableName' && controlName !== 'seriesType') {
          measureConrolValue.controls[controlName].reset();
        }
      }
    }

  }
  onUpdateSeries() {
  let measureConrolValue = this.dashboardCreationForm.get('measure') as FormGroup;
  let updateObj = measureConrolValue?.value || {};

  let fontSize = updateObj.dataLabel?.font?.size ? updateObj.dataLabel.font.size + 'px' : '10px';

  // Apply defaults like in onAddMeasureSeries with protective checks
  updateObj = {
    seriesType: updateObj.seriesType || '',
    drawType: updateObj.drawType || '',
    tableName: updateObj.tableName || '',
    fieldName: updateObj.fieldName || '',
    labelName: updateObj.labelName || '',
    seriesColor: updateObj.seriesColor || '',
    expression: updateObj.expression ? updateObj.expression.trim() : '',
    opposedPosition: updateObj.opposedPosition != null ? updateObj.opposedPosition : false,
    marker: {
      visible: updateObj.marker?.visible != null ? updateObj.marker.visible : true
    },
    dataLabel: {
      visible: updateObj.dataLabel?.visible != null ? updateObj.dataLabel.visible : true,
      position: updateObj.dataLabel?.position || 'Outside',
      format: updateObj.dataLabel?.format || '{value}',
      font: {
        fontWeight: updateObj.dataLabel?.font?.fontWeight || '400',
        color: updateObj.dataLabel?.font?.color || '#000',
        size: fontSize
      },
      angle: updateObj.dataLabel?.angle || 0
    }
  };

  console.log('updateObj', updateObj);

  this.measureSeriesArray.splice(this.editObjSeriesIndex, 1, updateObj);
  this.showUpdateButton = false;
  this.showAddButton = true;

  // Reset form controls except tableName & seriesType
  if (measureConrolValue instanceof FormGroup) {
    for (const controlName in measureConrolValue.controls) {
      if (controlName !== 'tableName' && controlName !== 'seriesType') {
        measureConrolValue.controls[controlName].reset();
      }
    }
  }
}


  onUpdateDimensionSeries() {
    let measureConrolValue = this.dashboardCreationForm.get('dimension')?.value || {};
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
      "expression": measureConrolValue.expression ? measureConrolValue.expression.trim() : '',
      "rawQuery": measureConrolValue.rawQuery ? measureConrolValue.rawQuery.trim() : '',
      "levelTitle": measureConrolValue.levelTitle ? measureConrolValue.levelTitle.trim() : ''
    };

    console.log(obj)
    this.dimensionGroupingArray.splice(this.editDimensionSeriesIndex, 1, obj);
    this.showUpdateButton = false;
    this.showAddButton = true;
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


  // Add conditional format entry
  onAddConditionFormat() {
    const formatData = this.dashboardCreationForm.get('conditionalFormat')?.value;
    
    if (formatData.fieldName && formatData.condition) {
      this.conditionalFormatArray.push({
        fieldName: formatData.fieldName,
        condition: formatData.condition,
        value1: formatData.value1,
        value2: formatData.value2,
        color: formatData.color
      });

      // Reset form
      this.dashboardCreationForm.get('conditionalFormat')?.patchValue({
        fieldName: '',
        condition: '',
        value1: '',
        value2: '',
        color: ''
      });
    }
  }

    // Edit conditional format entry
  onEditConditionalFormat(format: any, index: number) {
    this.showConditionAddBtn = false;
    this.updateConditonBtn = true;
    this.selectedConditionIndex = index;

    this.dashboardCreationForm.get('conditionalFormat')?.patchValue({
      fieldName: format.fieldName,
      condition: format.condition,
      value1: format.value1,
      value2: format.value2,
      color: format.color
    });
  }

  // Update conditional format entry
  onUpdateConditonObj() {
    if (this.selectedConditionIndex > -1) {
      const formatData = this.dashboardCreationForm.get('conditionalFormat')?.value;
      
      this.conditionalFormatArray[this.selectedConditionIndex] = {
        fieldName: formatData.fieldName,
        condition: formatData.condition,
        value1: formatData.value1,
        value2: formatData.value2,
        color: formatData.color
      };

      // Reset form and buttons
      this.dashboardCreationForm.get('conditionalFormat')?.reset();
      this.showConditionAddBtn = true;
      this.updateConditonBtn = false;
      this.selectedConditionIndex = -1;
    }
  }

    // Delete conditional format entry
  onDeleteConditionalFormat(index: number) {
    this.conditionalFormatArray.splice(index, 1);
  }


}
