import { ILoadedEventArgs, GaugeTheme, CircularGaugeModule } from '@syncfusion/ej2-angular-circulargauge';
import { group } from '@angular/animations';
import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidatorFn, ValidationErrors, FormArray, FormControl } from '@angular/forms';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { TabComponent } from '@syncfusion/ej2-angular-navigations';
import { AnimationSettingsModel, DialogComponent } from '@syncfusion/ej2-angular-popups';
import { Browser } from '@syncfusion/ej2/base';
import { Subject } from 'rxjs';
import { ChartService } from 'src/app/core/services/chart.service';


@Component({
  selector: 'app-guage-chart-properties',
  templateUrl: './guage-chart-properties.component.html',
  styleUrls: ['./guage-chart-properties.component.scss'],
  standalone: false
})
export class guageChartPropertiesComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {
  @Input() getPanelObj: any;
  @ViewChild('tabComponent', { static: true }) tab!: TabComponent;
  @Output() sendBoxObj = new EventEmitter();
  @Output() sendChartOBj = new EventEmitter();
  @ViewChild('dimensionGrid') dimensionGrid!: GridComponent;
  dimensionGroupingArraySubject = new Subject();
  @ViewChild('defaultDialog')
  defaultDialog!: DialogComponent;
  measureSeriesArray: any = [];
  ApiPanelSeriesArray: any[] = [];
  dimensionGroupingArray: any[] = [];

  generalChartPropForm!: FormGroup;
  headerText: any = [
    { text: "General" },
    { text: "Dimension" },
    { text: "Measure" },
    { text: "Condition" },
    { text: "Gauge Props" },
    { text: "Axis" },
    { text: "Pointers" },
    { text: "Ranges" }

    // { text: 'Conditional Formatting' }
  ];
  generalForm!: FormGroup;
  target: string = ".control-section";
  dashboardCreationForm!: FormGroup;
  chartIdCount: any = 0;

  // FIX: Separate update/add button flags for Dimension and Measure tabs
  showUpdateButton: boolean = false;
  showAddButton: boolean = true;
  showDimensionUpdateButton: boolean = false;

  patchDimensionObj: any;
  connection_id!: number;
  selectedTabIndex = 0;
  tableNamesArray: string[] = [];
  selectedTableFieldName: string[] = [];
  isSecondTableNameDisabled = false;
  fontWeights: number[] = [100, 200, 300, 400, 500, 600, 700, 800, 900];
  // generalChartType: any = ["CircularGauge"];
  selectedMeasureIndex: any = null;

  constructor(private fb: FormBuilder, private chartService: ChartService, private changeDetectorRef: ChangeDetectorRef) {
    this.createDashboardObj();
  }

  panelSeriesArray: any = [];

  formatRadius(value: any): string {
  if (!value) return '80%';
  const numeric = String(value).replace(/%/g, '');
  return numeric + '%';
}
  ngOnChanges(changes: SimpleChanges) {
    this.headerText = [
      { text: "General" },
      { text: "Dimension" },
      { text: "Measure" },
      { text: "Condition" },
      { text: "Gauge Props" },
      { text: "Axis" },
      { text: "Pointers" },
      { text: "Ranges" }
    ];

    if (changes['getPanelObj']) {
      let currentValue = changes['getPanelObj'].currentValue;
      this.getPanelObj = currentValue;
      if (this.tab) {
        this.tab.selectedItem = 0;
      }

      let panelsArrData: any = sessionStorage.getItem('createPanelSeriesArray');

      if (panelsArrData) {
        this.panelSeriesArray = JSON.parse(panelsArrData);
        console.log('this.panelSeriesArray => ', this.panelSeriesArray);
        const matchingPanel = this.panelSeriesArray.find((panel: any) => panel.id === this.getPanelObj?.id);
        console.log(matchingPanel);

        if (matchingPanel) {
          this.connection_id = this.getPanelObj.connection_id;

          this.dashboardCreationForm.patchValue({
            title: matchingPanel.header || '',
            tableName: matchingPanel.content.tableName || '',
            orderBy: matchingPanel.content.orderBy || [],
            orderByType: matchingPanel.content.orderByType || '',
            groupBy: matchingPanel.content.groupBy || [],
            conditions: matchingPanel.content.conditions || '',
            background: matchingPanel.content.background || '',
            // legends: {
            //   visible: matchingPanel.content.legends?.visible != null ? matchingPanel.content.legends.visible : true,
            //   position: matchingPanel.content.legends?.position || 'Bottom',
            //   shape:    matchingPanel.content.legends?.shape || 'Circle',
            //   textStyle: {
            //     size: matchingPanel.content.legends?.textStyle?.size || '',
            //     color: matchingPanel.content.legends?.textStyle?.color || ''
            //   }
            // },
            clickType: matchingPanel.content.clickType || 'Single',
          });

          this.conditionValue = this.getPanelObj.content?.conditions || '';
          this.conditionalFormatArray = this.getPanelObj?.content?.conditionalFormatArray || [];

          if (matchingPanel.content !== undefined) {
            this.measureSeriesArray = matchingPanel.content.measure ? matchingPanel.content.measure : [];
            this.dimensionGroupingArray = matchingPanel.content.dimension?.levels || [];
          }

          // FIX: Rebuild ranges FormArray properly instead of using patchValue
          const gaugeContent = matchingPanel.content?.gauge;
          if (gaugeContent) {
            this.dashboardCreationForm.get('gauge')?.patchValue({
              valueField: gaugeContent.valueField || '',
              minValue: gaugeContent.minValue || '',
              maxValue: gaugeContent.maxValue || '',
              radius: this.formatRadius(gaugeContent.radius) || '',
              startAngle: gaugeContent.startAngle || '',
              endAngle: gaugeContent.endAngle || '',
              // axis: gaugeContent.axis || {},
              // pointer: gaugeContent.pointer || {},

            legends: {
        visible: matchingPanel.content.legends?.visible ?? true,
        position: matchingPanel.content.legends?.position || 'Bottom',
        shape: matchingPanel.content.legends?.shape || 'Circle',
        textStyle: {
            size: matchingPanel.content.legends?.textStyle?.size || '',
            color: matchingPanel.content.legends?.textStyle?.color || ''
        }
    }
            });

            // Axis
this.dashboardCreationForm.get('gauge.axis')?.patchValue({
    lineWidth:   gaugeContent.axis?.lineWidth   || '',
    color:       gaugeContent.axis?.color       || '',
    labelStyle:  gaugeContent.axis?.labelStyle  || '',
    labelFormat: gaugeContent.axis?.labelFormat || '',
});

this.dashboardCreationForm.get('gauge.axis.majorTicks')?.patchValue({
    width:    gaugeContent.axis?.majorTicks?.width    || '',
    height:   gaugeContent.axis?.majorTicks?.height   || '',
    interval: gaugeContent.axis?.majorTicks?.interval || '',
    color:    gaugeContent.axis?.majorTicks?.color    || '',
});

this.dashboardCreationForm.get('gauge.axis.minorTicks')?.patchValue({
    width:    gaugeContent.axis?.minorTicks?.width    || '',
    height:   gaugeContent.axis?.minorTicks?.height   || '',
    interval: gaugeContent.axis?.minorTicks?.interval || '',
    color:    gaugeContent.axis?.minorTicks?.color    || '',
});

// Pointer
this.dashboardCreationForm.get('gauge.pointer')?.patchValue({
    type:  gaugeContent.pointer?.type  || 'Needle',
    value: gaugeContent.pointer?.value || 0,
    width: gaugeContent.pointer?.width || 4,
    color: gaugeContent.pointer?.color || '#e74c3c',
    markerShape:  gaugeContent.pointer?.markerShape  || 'InvertedTriangle',
    markerHeight: gaugeContent.pointer?.markerHeight || 15,
    markerRadius: gaugeContent.pointer?.markerRadius || '100%',
});

this.dashboardCreationForm.get('gauge.pointer.capStyle')?.patchValue({
    radius:      gaugeContent.pointer?.cap?.radius        || '',
    color:       gaugeContent.pointer?.cap?.color         || '',
    borderWidth: gaugeContent.pointer?.cap?.border?.width || '',
    borderColor: gaugeContent.pointer?.cap?.border?.color || '',
});

this.dashboardCreationForm.get('gauge.pointer.needleTail')?.patchValue({
    length:      gaugeContent.pointer?.needleTail?.length        || '',
    color:       gaugeContent.pointer?.needleTail?.color         || '',
    borderWidth: gaugeContent.pointer?.needleTail?.border?.width || '',
});

this.dashboardCreationForm.get('gauge.pointer.animation')?.patchValue({
    enable:   gaugeContent.pointer?.animation?.enable   ?? true,
    duration: gaugeContent.pointer?.animation?.duration || '',
});

            

            // Rebuild ranges FormArray
            const rangesArray = this.dashboardCreationForm.get('gauge.ranges') as FormArray;
            rangesArray.clear();
            const savedRanges = gaugeContent.ranges || [];
            if (savedRanges.length > 0) {
              // savedRanges.forEach((r: any) => {
              //   rangesArray.push(this.buildRangeGroup(r));
              // });
              savedRanges.forEach((r: any) => {
  rangesArray.push(this.buildRangeGroup({
    startValue:          r.startValue ?? 0,
    endValue:            r.endValue   ?? 0,
    color:               r.color      || '',
    width:               r.width      ?? 8,
    radius:              r.radius     || '100%',
    roundedCornerRadius: r.roundedCornerRadius || 0,
    legendText:          r.legendText || ''
    // gradient:            r.gradient   || { type: '', colors: [''] }
  }));
});
            }
             else {
              rangesArray.push(this.buildRangeGroup());
            }
          }

          this.chartService.getTableNamesArrary(this.connection_id).subscribe((res: any) => {
            let data = res['data'];
            this.tableNamesArray = data;
            if (matchingPanel.content.tableName) {
              this.onTableDropdown(matchingPanel.content.tableName);
            }
            this.refreshTabComponent();
          });
        }
      }
    }

    // this.setrangesData()
  }

  @ViewChild('rawQueryDimension')
  rawQueryDimension!: DialogComponent;

  columnsArr: any = [];
  conditionalFormatArray: any[] = [];
  showConditionAddBtn = true;
  updateConditonBtn = false;
  selectedConditionIndex: number = -1;

  ngOnInit(): void {
    this.headerText = [
      { text: "General" },
      { text: "Dimension" },
      { text: "Measure" },
      { text: "Condition" },
      { text: "Gauge Props" },
      { text: "Axis" },
      { text: "Pointers" },
      { text: "Ranges" }
    ];

    let parseApiPanelSeriesArray = sessionStorage.getItem('ApiPanelSeriesArray');
    if (parseApiPanelSeriesArray) {
      this.ApiPanelSeriesArray = JSON.parse(parseApiPanelSeriesArray);
      console.log('this.ApiPanelSeriesArray => ', this.ApiPanelSeriesArray);
    }

    // this.setrangesData()
  }

  setrangesData() {
    const ranges:any = this.dashboardCreationForm.value?.gauge?.ranges
    if (ranges && ranges.length > 0) {
      console.log('Patching ranges with:', ranges);
      // this.patchRange(ranges);
      this.rangessList = structuredClone(ranges);
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

    const dimensionFormGroup: any = this.dashboardCreationForm.get('dimension');
    const rawQueryValue = item?.rawQuery && item.level === level ? item.rawQuery : '';

    dimensionFormGroup.patchValue({
      rawQuery: rawQueryValue
    });

    this.rawQueryDimension.show();
    console.log(item, index, level);
  }

  onOkButtonClick() {
    const newValue = this.dashboardCreationForm.value.dimension.rawQuery;
    console.log(newValue);

    this.dimensionGroupingArray[this.selectedDimentiontemIndex].rawQuery = newValue;
    console.log(this.dimensionGroupingArray);

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
    this.refreshTabComponent();

    // ✅ Load dummy only if no real panel data exists in session
    const panelsArrData = sessionStorage.getItem('createPanelSeriesArray');
    const parsedPanels = panelsArrData ? JSON.parse(panelsArrData) : [];
    const hasRealData = parsedPanels.find((p: any) => p.id === this.getPanelObj?.id);
    if (!hasRealData) {
      // this.loadFromDummyData(0);
    }
  }

  

   onTabChange(event:any){
    console.log('Tab changed => ', event, event?.selectedIndex);
    if(event){
      if(event?.selectedIndex === 7){
        this.setrangesData();
      }
    }
    
  }

 

  refreshTabComponent() {
    setTimeout(() => {
      if (this.tab) {
        this.tab.refresh();
        this.setrangesData()
      }
    }, 100);
  }

  onAddGrouping() {
    const dimensionFormGroup: any = this.dashboardCreationForm.get('dimension');
    const newObject: any = dimensionFormGroup?.value;

    if (this.dimensionGroupingArray.length >= 10) {
      console.error('Maximum number of groupings reached.');
      return;
    }

    let newLevel: number;
    if (this.dimensionGroupingArray.length === 0) {
      newLevel = 0;
    } else {
      const maxLevel = Math.max(...this.dimensionGroupingArray.map(obj => obj.level));
      newLevel = maxLevel + 1;
    }

    let obj = {
      tableName: newObject.tableName,
      fieldName: newObject.fieldName,
      labelName: newObject.labelName,
      level: newLevel,
      expression: "",
      rawQuery: newObject.rawQuery ? newObject.rawQuery : "",
      levelTitle: newObject.levelTitle
    };

    this.dimensionGroupingArray.push(obj);

    for (const controlName in dimensionFormGroup.controls) {
      if (controlName !== 'tableName') {
        dimensionFormGroup.controls[controlName].reset();
      }
    }
  }

  onDeleteDiemnsionSeries(id: any, ele: any) {
    this.dimensionGroupingArray.splice(id, 1);
  }

  editDimensionSeriesIndex: any;

  onEditDiemsionSeries(item: any, id: any) {
    console.log(item);
    this.editDimensionSeriesIndex = id;
    // FIX: Use separate flag for dimension
    this.showDimensionUpdateButton = true;
    // this.showUpdateButton = false;
    let measureControl = this.dashboardCreationForm.get('dimension');
    measureControl?.patchValue(item);
  }

  // ===================== RANGES (FormArray) =====================

  // FIX: Helper to build a range group with gradient sub-group and colors FormArray
  buildRangeGroup(data?: any): FormGroup {
    return this.fb.group({
        startValue: [data?.startValue ?? data?.start ?? 0],
        endValue:   [data?.endValue   ?? data?.end ?? 100],
        color:               [data?.color || '#e74c3c'],
        // width:               [data?.startWidth ?? data?.width ?? ''],
        width:               [data?.width ?? 8],
        radius:              [data?.radius || '100%'],
        roundedCornerRadius: [data?.roundedCornerRadius || 0],
        legendText:          [data?.legendText || ''],
        // gradient: this.fb.group({
        //     type: [data?.gradient?.type || ''],
        //     colors: this.fb.array(
        //         data?.gradient?.colors?.length
        //             ? data.gradient.colors.map((c: string) => this.fb.control(c))
        //             : [this.fb.control('')]
        //     )
        // })
    });
}

  get ranges(): FormArray {
    return this.dashboardCreationForm.get('gauge.ranges') as FormArray;
  }

  

  addRange() {
    this.ranges.push(this.buildRangeGroup());
  }

  removeRange(index: number) {
    this.ranges.removeAt(index);
  }

  // FIX: Properly return the colors FormArray from the gradient sub-group
  // getGradientColors(index: number): FormArray {
  //   return this.ranges.at(index).get('gradient.colors') as FormArray;
  // }

  // addGradientColor(rangeIndex: number) {
  //   this.getGradientColors(rangeIndex).push(this.fb.control(''));
  // }

  // removeGradientColor(rangeIndex: number, colorIndex: number) {
  //   this.getGradientColors(rangeIndex).removeAt(colorIndex);
  // }

  // ===================== END RANGES =====================

  ngOnDestroy() {
    this.dimensionGroupingArraySubject.unsubscribe();
  }

  onDimensionFieldDropdown(eve: any) {
    let dropdownValue = eve;
    const dimensionFormGroup = this.dashboardCreationForm.get('dimension');
    const dimensionLabelControl = dimensionFormGroup!.get('labelName');
    dimensionLabelControl!.setValue(dropdownValue);
  }

  onMeasureFieldDropdown(eve: any) {
  let dropdownValue = eve;
  const measureFormGroup = this.dashboardCreationForm.get('measure');
  const measureLabelControl = measureFormGroup!.get('labelName');
  measureLabelControl!.setValue(dropdownValue);

  // Auto-set gauge valueField when measure field is selected
  this.dashboardCreationForm.get('gauge')?.patchValue({
    valueField: dropdownValue
  });
}

  createDashboardObj() {
    this.dashboardCreationForm = this.fb.group({
      tableName: ['sales_data', Validators.required],
      // chartType: [''],
      background: [''],
      title: [''],
      groupBy: [''],
      conditions: [''],
      orderBy: [''],
      orderByType: [''],
      clickType: ['Single'],

   

      measure: this.fb.group({
        tableName: [''],
        fieldName: [''],
        labelName: [''],
        expression: [''],
        dataLabel: this.fb.group({
          visible: [false],
          format: [''],
          angle: [''],
          font: this.fb.group({
            size: [''],
            fontWeight: [''],
            // FIX: Removed duplicate seriesColor from font group; seriesColor belongs at measure level
            color: [''],
          })
        }),
        seriesColor: ['#000000'],
      }),

      dimension: this.fb.group({
        tableName: [''],
        fieldName: [''],
        labelName: [''],
        level: [0],
        expression: [''],
        rawQuery: [''],
        levelTitle: ['']
        
      }),

      

      gauge: this.fb.group({
        valueField: [''],
        minValue: [0],
        maxValue: [100],
        radius: [60, ], //[Validators.pattern('^[0-9]*$')]
        startAngle: [-140],
        endAngle: [140],
        legends: this.fb.group({          
        visible: [true],
        position: ['Bottom'],
        shape: ['Circle'],
        textStyle: this.fb.group({
            size: ['12'],
            color: ['#050505'],
        }),
    }),

        axis: this.fb.group({
          lineWidth: [2],
          color: ['#cccccc'],
          labelStyle: [''],
          labelFormat: ['{value}'],
          majorTicks: this.fb.group({
            width: [2],
            height: [10],
            interval: [10],
            color: ['#555555']
          }),
          minorTicks: this.fb.group({
            width: [1],
            height: [5],
            interval: [2],
            color: ['#aaaaaa']
          })
        }),

        pointer: this.fb.group({
          type: ['Needle'],
          value: [0],
          width: [4],
          color: ['#e74c3c'],
          markerShape: ['InvertedTriangle'],
          markerHeight: [15],
          markerRadius: ['100%'],
          capStyle: this.fb.group({
            radius: [8],
            color: ['#c0392b'],
            borderWidth: [2],
            borderColor: ['#922b21']
          }),
          needleTail: this.fb.group({
            length: ['20%'],
            color: ['#c0392b'],
            borderWidth: [1]
          }),
          animation: this.fb.group({
            enable: [true],
            duration: ['800']
          })
        }),

        // FIX: Initialize ranges as FormArray using buildRangeGroup (called after fb is ready)
        ranges: this.fb.array([]),

        //rangess -------------------------
        rangess:this.fb.group({
          startValue: [''],
          endValue:   [''],
          color:               [''],
          // width:               [data?.startWidth ?? data?.width ?? ''],
          width:               [8],
          radius:              [''],
          roundedCornerRadius: [''],
          legendText:          [''],
        //   gradient: this.fb.group({
        //     type: [''],
        //     colors: this.fb.array([])
        //     // colors: this.fb.array(
        //     //     data?.gradient?.colors?.length
        //     //         ? data.gradient.colors.map((c: string) => this.fb.control(c))
        //     //         : [this.fb.control('')]
        //     // )
        // })
        })
        //rangess -------------------------


      })
      
    });

    // Add one default range after form is built
    this.ranges.push(this.buildRangeGroup());
    // this.activeRangeIndex = 0;
  }

  editIndex: number | null = null;
  //rangess ==============================
  get rangess(): any {
    return this.dashboardCreationForm.get('gauge.rangess') //as FormArray;
  }

  // patchRange(data: any) {
  //   this.ranges.setValue(data);
  // }

  patchRange(data: any) {
    this.ranges.clear();
    (data || []).forEach((r: any) => {
      this.ranges.push(this.buildRangeGroup(r));
    });
    
    // console.log('Patched ranges with:', data, 'Current form value:', this.ranges.value);
  }

//   getGradientColorss(): FormArray {
//   return this.dashboardCreationForm.get('gauge.rangess.gradient.colors') as FormArray;
// }





// addGradientColors() {
//   this.getGradientColorss().push(this.fb.control(''));
// }

// removeGradientColors(index: number) {
//   this.getGradientColorss().removeAt(index);
// }

rangessList: any[] = [];
// editIndex: number | null = null;

get rangessGroup(): FormGroup {
  return this.dashboardCreationForm.get('gauge.rangess') as FormGroup;
}



addRangess() {
  const value = this.rangessGroup.value;
  console.log('addrangess value => ', value);

  if (this.editIndex !== null) {
    this.rangessList[this.editIndex] = value;
    this.editIndex = null;
  } else {
    this.rangessList.push(value);
    // this.ranges.push(this.buildRangeGroup(value));
  }
  console.log('before rangessList => ', this.rangessList, 'rangess formarray => ', this.ranges.value);

  this.patchRange(this.rangessList);
  console.log('after rangessList => ', this.rangessList, 'rangess formarray => ', this.ranges.value);

  this.rangessGroup.reset({
    startValue: '',
    endValue: '',
    color: '',
    width: 8,
    radius: '',
    roundedCornerRadius: '',
    legendText: '',
    // gradient: { type: '', colors: [] }
  });
}

editRangess(index: number) {
  this.editIndex = index;
  this.rangessGroup.patchValue(this.rangessList[index]);
}

deleteRangess(index: number) {
  this.rangessList.splice(index, 1);
}
  //rangess ==============================


toggleEdit(index: number) {
if (this.editIndex === index) {
this.editIndex = null;
} else {
this.editIndex = index;
}
}

  selectedConditionType: string = '';

  onSelectCondtionFormatValue(eve: any) {
    let value = eve.target.value;
    this.selectedConditionType = value;
  }

  requireExpressionOrRawQueryValidator(): ValidatorFn {
    return (form: AbstractControl): ValidationErrors | null => {
      const expression = form.get('measure.expression')?.value;
      const rawQuery = form.get('dimension.rawQuery')?.value;
      const gaugeValue = form.get('gauge.valueField')?.value;

      if (!expression && !rawQuery && !gaugeValue) {
        return { requireExpressionOrRawQuery: true };
      }
      return null;
    };
  }

  onTableDropdown(dropdownValue: any) {
    if (!dropdownValue) {
      this.selectedTableFieldName = [];
      return;
    }

    const tableNameControl = this.dashboardCreationForm.get('tableName');
    const measureFormGroup = this.dashboardCreationForm.get('measure');
    const measureTableNameControl = measureFormGroup!.get('tableName');
    const dimensionFormGroup = this.dashboardCreationForm.get('dimension');
    const dimensionTableNameControl = dimensionFormGroup!.get('tableName');

    measureTableNameControl!.setValue(dropdownValue);
    dimensionTableNameControl!.setValue(dropdownValue);
    tableNameControl!.setValue(dropdownValue);

    if (dropdownValue) {
      this.chartService.getColumnNameBYTableName(dropdownValue, this.connection_id).subscribe((res: any) => {
        if (res) {
          let data = res['data'];
          this.selectedTableFieldName = Object.keys(data);
        }
      });
    } else {
      this.selectedTableFieldName = [];
    }
  }

  validationMessage: string | null = null;

  // FIX: Return type declared properly
  onDashboardCreationForm(): boolean | void {
    const id = this.getPanelObj.id;
    const formValue = this.dashboardCreationForm.value;
    console.log(formValue, 'chartObj', this.dashboardCreationForm.valid);

    if (this.dashboardCreationForm.get('tableName')?.invalid) {
      this.dashboardCreationForm.markAllAsTouched();
      return false;
    }

    const hasRawQuery = this.dimensionGroupingArray.some(
      (dim: any) => dim.rawQuery && dim.rawQuery.trim() !== ''
    );

    const hasExpression = this.measureSeriesArray.some(
      (measure: any) => measure.expression && measure.expression.trim() !== ''
    );

    const hasGaugeValue = formValue.gauge?.valueField && formValue.gauge.valueField.trim() !== '';

    if (!hasRawQuery && !hasExpression && !hasGaugeValue) {
      this.validationMessage = 'Validation Error: Missing rawQuery in dimension or expression in measure.';
      return false;
    }

    this.validationMessage = '';
    
     // Auto-build Raw Query from Expression if Raw Query is empty
    if (!hasRawQuery && hasExpression) {
      this.dimensionGroupingArray = this.dimensionGroupingArray.map((dim: any) => {
        if (!dim.rawQuery || dim.rawQuery.trim() === '') {
          const measure = this.measureSeriesArray[0];
          if (measure?.expression?.trim()) {
            const expression = measure.expression.toUpperCase();
            const fieldName = measure.fieldName;
            const tableName = measure.tableName || formValue.tableName;
            dim.rawQuery = `SELECT ${expression}(${fieldName}) as ${fieldName} FROM ${tableName}`;
            console.log('Auto-built Raw Query:', dim.rawQuery);
          }
        }
        return dim;
      });
    }
    // ✅ END BLOCK

    let apiObj: any = {
      object_id: id + "_gauge",
      object_setup: {
        content: {
          id: id + "_gauge_" + this.chartIdCount,
          title: formValue.title,
          height: "97%",
          width: "97%",
          background: formValue.background,
          chartType: formValue.chartType,
          tableName: formValue.tableName,
          rawQuery: formValue.rawQuery || "",
          groupBy: formValue.groupBy || [],
          conditions: formValue.conditions || '',
          orderBy: formValue.orderBy || [],
          orderByType: formValue.orderByType || '',
          dataSource: [],
          conditionalFormatArray: this.conditionalFormatArray || [],
          // legends: formValue.legends,
          legends: formValue.gauge?.legends,
          dimension: {
            levels: this.dimensionGroupingArray || []
          },
          measure: this.measureSeriesArray,
          gauge: {
            valueField: formValue.gauge?.valueField,
            minValue: formValue.gauge?.minValue,
            maxValue: formValue.gauge?.maxValue,
            // radius: formValue.gauge?.radius,
            // radius: (formValue.gauge?.radius ? formValue.gauge.radius  : '60') , //+ '%',
            radius: formValue.gauge?.radius ? String(formValue.gauge.radius).replace('%', '') + '%' : '80%',
            startAngle: formValue.gauge?.startAngle,
            endAngle: formValue.gauge?.endAngle,
            // axis: formValue.gauge?.axis,
            axis: formValue.gauge?.axis,
            pointer: {
              type:         formValue.gauge?.pointer?.type         || 'Needle',
              value:        formValue.gauge?.pointer?.value        || 0,
              width:        formValue.gauge?.pointer?.width        || 4,
              color:        formValue.gauge?.pointer?.color        || '#e74c3c',
              markerShape:  formValue.gauge?.pointer?.markerShape  || 'InvertedTriangle',
              markerHeight: formValue.gauge?.pointer?.markerHeight || 15,
              markerRadius: formValue.gauge?.pointer?.markerRadius || '100%',
              // capStyle:     formValue.gauge?.pointer?.capStyle,
              // needleTail:   formValue.gauge?.pointer?.needleTail,
              cap: {
                radius: formValue.gauge?.pointer?.capStyle?.radius || 8,
                color:  formValue.gauge?.pointer?.capStyle?.color  || '#c0392b',
                border: {
                  width: formValue.gauge?.pointer?.capStyle?.borderWidth || 2,
                  color: formValue.gauge?.pointer?.capStyle?.borderColor || '#922b21'
                }
              },
              needleTail: {
                length: formValue.gauge?.pointer?.needleTail?.length || '20%',
                color:  formValue.gauge?.pointer?.needleTail?.color  || '#c0392b',
                border: {
                  width: formValue.gauge?.pointer?.needleTail?.borderWidth || 1
                }
              },
              animation:    formValue.gauge?.pointer?.animation
            },
            // pointer: formValue.gauge?.pointer,
          ranges: (formValue.gauge?.ranges || []).map((r: any) => ({
            startValue: +r.startValue,
            endValue:   +r.endValue,
            color:      r.color || '',
            width:      r.width,
            // startWidth: +(r.width) || 0,
            // endWidth: +(r.width || 0),
            radius:     r.radius || '100%',
            roundedCornerRadius: r.roundedCornerRadius || 0,
            legendText: r.legendText || '',
  //           gradient: r.gradient?.type ? {
  //   type:   r.gradient.type,
  //   colors: r.gradient.colors || []
  // } : { type: '', colors: [''] }
          }))
          }
        }
      },
      object_type: "gauge",
      connection_id: this.connection_id,
    };

    console.log("Gauge API Object:", apiObj);

    let panelsArrData: any = sessionStorage.getItem('createPanelSeriesArray');
    this.panelSeriesArray = panelsArrData ? JSON.parse(panelsArrData) : [];

    const matchingObjectIndex = this.panelSeriesArray.findIndex(
      (obj: any) => obj.id === id
    );

    if (matchingObjectIndex !== -1) {
      this.panelSeriesArray[matchingObjectIndex] = {
        ...this.getPanelObj,
        panelType: 'Gauge',
        content: { ...apiObj.object_setup.content }
      };
    } else {
      this.panelSeriesArray.push({
        ...this.getPanelObj,
        panelType: 'Gauge',
        content: { ...apiObj.object_setup.content }
      });
    }

    sessionStorage.setItem('createPanelSeriesArray', JSON.stringify(this.panelSeriesArray));

    this.chartService.objectPivotCreate(apiObj).subscribe(
      (res: any) => {
        console.log("Chart Obj", res);

        if (res.success === true) {
          let data = res['data'];
          let chartObjData = data.object_setup.content;
          console.log('chartObjData', chartObjData);

          let submitObj = {
            ...this.getPanelObj,
            panelType: 'Gauge',
            header: chartObjData.title,
            content: {
              id: id + "_gauge_" + this.chartIdCount,
              title: chartObjData.title,
              height: chartObjData.height,
              width: chartObjData.width,
              background: chartObjData.background,
              chartType: chartObjData.chartType,
              tableName: chartObjData.tableName,
              groupBy: chartObjData.groupBy,
              conditions: chartObjData.conditions,
              orderBy: chartObjData.orderBy,
              orderByType: chartObjData.orderByType,
              conditionalFormatArray: chartObjData.conditionalFormatArray || [],
              dataSource: chartObjData.dataSource || [],
              legends: chartObjData.legends,
              dimension: chartObjData.dimension,
              measure: chartObjData.measure,
              clickType: chartObjData.clickType,
              gauge: {
                valueField: chartObjData.gauge?.valueField,
                minValue: chartObjData.gauge?.minValue,
                maxValue: chartObjData.gauge?.maxValue,
                // radius: chartObjData.gauge?.radius,
                // radius: (chartObjData.gauge?.radius ? chartObjData.gauge.radius  : '70'), // + '%',
                radius: chartObjData.gauge?.radius ? String(chartObjData.gauge?.radius).replace('%', '') + '%' : '80%',
                startAngle: chartObjData.gauge?.startAngle,
                endAngle: chartObjData.gauge?.endAngle,
                axis: chartObjData.gauge?.axis,
                // pointer: chartObjData.gauge?.pointer,
                pointer: {
                  type:         chartObjData.gauge?.pointer?.type         || 'Needle',
                  value:        chartObjData.gauge?.pointer?.value        || 0,
                  width:        chartObjData.gauge?.pointer?.width        || 4,
                  color:        chartObjData.gauge?.pointer?.color        || '#e74c3c',
                  markerShape:  chartObjData.gauge?.pointer?.markerShape  || 'InvertedTriangle',
                  markerHeight: chartObjData.gauge?.pointer?.markerHeight || 15,
                  markerRadius: chartObjData.gauge?.pointer?.markerRadius || '100%',
                  // capStyle:     chartObjData.gauge?.pointer?.capStyle,
                  cap:       chartObjData.gauge?.pointer?.cap,
                  needleTail:   chartObjData.gauge?.pointer?.needleTail,
                  animation:    chartObjData.gauge?.pointer?.animation
                },
                // ranges: chartObjData.gauge?.ranges
                ranges: (chartObjData.gauge?.ranges || []).map((r: any) => ({
                startValue: r.startValue ?? r.start ?? 0,
                endValue:   r.endValue   ?? r.end   ?? 0,
                color:      r.color      || '',
                // startWidth:          r.startWidth ?? r.width ?? 8,
                // endWidth:            r.endWidth   ?? r.width ?? 8,
                width:               r.width || 8,
                radius:     r.radius     || '100%',
                roundedCornerRadius: r.roundedCornerRadius || 0,
                legendText: r.legendText || ''
                // gradient:            r.gradient   || { type: '', colors: [''] }
              }))
              }
            },
          };
          console.log(submitObj, 'submitObj');

          this.sendBoxObj.emit({
            boxObj: submitObj,
            resObj: { resSuccess: res.success, resMessage: res.message, statusCode: res.status_code }
          });

          this.dashboardCreationForm.reset();
          // Re-add default range after reset
          const rangesArray = this.dashboardCreationForm.get('gauge.ranges') as FormArray;
          rangesArray.clear();
          rangesArray.push(this.buildRangeGroup());

          this.measureSeriesArray = [];
          this.dimensionGroupingArray = [];
          this.chartIdCount++;
        } else {
          let boxObj = this.panelSeriesArray[matchingObjectIndex];
          this.sendBoxObj.emit({
            boxObj: boxObj,
            resObj: { resSuccess: res.success, resMessage: res.message, statusCode: res.status_code }
          });
        }
      },
      (err: any) => {
        let boxObj = this.panelSeriesArray[matchingObjectIndex];
        const errorMessage = err.error && err.error.message ? err.error.message : err.message;
        this.sendBoxObj.emit({
          boxObj: boxObj,
          resObj: { resSuccess: false, resMessage: errorMessage, statusCode: err.status }
        });
      }
    );

    return true;
  }
 editObjSeriesIndex: any;

  onDeleteSeries(id: any) {
    console.log(id);
    this.measureSeriesArray.splice(id, 1);
  }

  onEditSeries(obj: any, index: any) {
    this.selectedMeasureIndex = index;
    this.showAddButton = false;
    this.showUpdateButton = true;
    console.log(obj);
    this.editObjSeriesIndex = index;

    const fontSizeNumeric = parseInt(obj.dataLabel?.font?.size) || 12;
    console.log('fontSizeNumeric', fontSizeNumeric);

    let measureControl = this.dashboardCreationForm.get('measure');
    measureControl?.patchValue({
      ...obj,
      dataLabel: {
        ...obj.dataLabel,
        font: {
          ...obj.dataLabel?.font,
          size: fontSizeNumeric
        }
      }
    });
  }

  conditionValue: string = '';
  rawQueryValue: string = '';
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

  addText(event: any) {
    const operator = event.target.value || "";
    const currentText = this.conditionValue;

    if (operator) {
      const operatorWithSpaces = ` ${operator} `;
      const beforeCursor = currentText.slice(0, this.cursorConditionPosition);
      const afterCursor = currentText.slice(this.cursorConditionPosition);
      this.conditionValue = `${beforeCursor}${operatorWithSpaces}${afterCursor}`;
      this.cursorConditionPosition += operatorWithSpaces.length;

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
    const operator = ' ' + name + ' ';
    const currentText = this.rawQueryValue;

    if (operator) {
      const beforeCursor = currentText.slice(0, this.cursorPosition);
      const afterCursor = currentText.slice(this.cursorPosition);
      this.rawQueryValue = `${beforeCursor}${operator}${afterCursor}`;
      this.cursorPosition += operator.length;

      const textarea = document.getElementById("pop_chart_expression") as HTMLTextAreaElement;
      if (textarea) {
        textarea.focus();
        textarea.setSelectionRange(this.cursorPosition, this.cursorPosition);
      }
    }
  }

  addToConditionTextarea(name: string) {
    const currentText = this.conditionValue || '';
    const beforeCursor = currentText.slice(0, this.cursorConditionPosition);
    const afterCursor = currentText.slice(this.cursorConditionPosition);

    this.conditionValue = `${beforeCursor} ${name} ${afterCursor}`;
    this.cursorConditionPosition += name.length + 2;

    const textarea = document.getElementById("pop_chart_condition") as HTMLTextAreaElement;
    if (textarea) {
      textarea.focus();
      textarea.setSelectionRange(this.cursorConditionPosition, this.cursorConditionPosition);
    }
  }

  addRawQueryText(event: any) {
    const operator = event.target.value;
    const currentText = this.rawQueryValue;

    if (operator) {
      const operatorWithSpaces = ` ${operator} `;
      const beforeCursor = currentText.slice(0, this.cursorPosition);
      const afterCursor = currentText.slice(this.cursorPosition);
      this.rawQueryValue = `${beforeCursor}${operatorWithSpaces}${afterCursor}`;
      this.cursorPosition += operatorWithSpaces.length;

      const textarea = document.getElementById("pop_chart_expression") as HTMLTextAreaElement;
      if (textarea) {
        textarea.focus();
        textarea.setSelectionRange(this.cursorPosition, this.cursorPosition);
      }
    }
  }

  onClearRawQuery() {
    this.rawQueryValue = "";
    this.dashboardCreationForm.get('dimension')?.patchValue({
      rawQuery: ''
    });
  }

  onClearConditions() {
    this.conditionValue = "";
    this.dashboardCreationForm.get('conditions')!.setValue("");
  }

  // FIX: onAddMeasure now properly pushes to array with seriesColor at measure level
  onAddMeasure() {
    const measureFormGroup = this.dashboardCreationForm.get('measure') as FormGroup;

    if (!measureFormGroup.get('fieldName')?.value) {
      measureFormGroup.get('fieldName')?.markAsTouched();
      return;
    }

    const formValue = measureFormGroup.value;

    const newMeasure = {
      tableName: formValue.tableName || '',
      fieldName: formValue.fieldName,
      labelName: formValue.labelName || '',
      seriesColor: formValue.seriesColor || '#000000',
      expression: formValue.expression || '',
      dataLabel: {
        visible: formValue.dataLabel?.visible ?? true,
        position: formValue.dataLabel?.position || '',
        format: formValue.dataLabel?.format || '{value}',
        font: {
          fontWeight: formValue.dataLabel?.font?.fontWeight || '400',
          color: formValue.dataLabel?.font?.color || '#000',
          size: formValue.dataLabel?.font?.size
            ? formValue.dataLabel.font.size + 'px'
            : '10px'
        },
        angle: formValue.dataLabel?.angle || 0
      }
    };

    this.measureSeriesArray.push(newMeasure);
    console.log("Measure Added:", newMeasure);

    measureFormGroup.reset({
      dataLabel: {
        visible: true,
        position: '',
        format: '',
        angle: 0,
        font: { size: 12, fontWeight: 'Normal', color: '#000000' }
      }
    });

    this.showUpdateButton = false;
    this.showAddButton = true;
  }

  // FIX: onUpdateMeasure - removed unnecessary patchValue call, only updates the array
  onUpdateMeasure() {
    const measureFormGroup = this.dashboardCreationForm.get('measure') as FormGroup;
    const formValue = measureFormGroup.value;

    const updatedMeasure = {
      tableName: formValue.tableName || '',
      fieldName: formValue.fieldName,
      labelName: formValue.labelName || '',
      seriesColor: formValue.seriesColor || '#000000',
      expression: formValue.expression || '',
      dataLabel: {
        visible: formValue.dataLabel?.visible ?? true,
        position: formValue.dataLabel?.position || '',
        format: formValue.dataLabel?.format || '{value}',
        font: {
          fontWeight: formValue.dataLabel?.font?.fontWeight || '400',
          color: formValue.dataLabel?.font?.color || '#000',
          size: formValue.dataLabel?.font?.size
            ? formValue.dataLabel.font.size + 'px'
            : '10px'
        },
        angle: formValue.dataLabel?.angle || 0
      }
    };

    if (this.selectedMeasureIndex !== null) {
      this.measureSeriesArray[this.selectedMeasureIndex] = updatedMeasure;
    }
    console.log("Measure Updated:", updatedMeasure);

    this.selectedMeasureIndex = null;
    this.showUpdateButton = false;
    this.showAddButton = true;

    measureFormGroup.reset({
      dataLabel: {
        visible: true,
        position: '',
        format: '',
        angle: 0,
        font: { size: 12, fontWeight: 'Normal', color: '#000000' }
      }
    });
  }

  onUpdateDimensionSeries() {
    let measureConrolValue = this.dashboardCreationForm.get('dimension')?.value;
    console.log(measureConrolValue);

    let level = measureConrolValue.level;
    if (typeof level === 'string') {
      level = +level;
    }

    let obj = {
      tableName: measureConrolValue.tableName,
      fieldName: measureConrolValue.fieldName,
      labelName: measureConrolValue.labelName,
      level: level,
      expression: "",
      rawQuery: measureConrolValue.rawQuery ? measureConrolValue.rawQuery : "",
      levelTitle: measureConrolValue.levelTitle ? measureConrolValue.levelTitle : ""
    };

    console.log(obj);
    this.dimensionGroupingArray.splice(this.editDimensionSeriesIndex, 1, obj);
    // FIX: Reset dimension-specific flags
    this.showDimensionUpdateButton = false;
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

  onAddConditionFormat() {
    const formatData = this.dashboardCreationForm.get('conditionalFormat')?.value;

    if (formatData.fieldName) {
      this.conditionalFormatArray.push({
        fieldName: formatData.fieldName,
        condition: formatData.condition,
        value1: formatData.value1,
        value2: formatData.value2,
        color: formatData.color
      });

      this.dashboardCreationForm.get('conditionalFormat')?.patchValue({
        fieldName: '',
        condition: '',
        value1: '',
        value2: '',
        color: ''
      });
    }
  }

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

      this.dashboardCreationForm.get('conditionalFormat')?.reset();
      this.showConditionAddBtn = true;
      this.updateConditonBtn = false;
      this.selectedConditionIndex = -1;
    }
  }

  onDeleteConditionalFormat(index: number) {
    this.conditionalFormatArray.splice(index, 1);
  }

  onMeasureValueSelect(fieldName: any) {
    const measureFormGroup = this.dashboardCreationForm.get('measure');
    measureFormGroup?.patchValue({
      fieldName: fieldName,
      labelName: fieldName
    });

    this.dashboardCreationForm.get('gauge')?.patchValue({
      valueField: fieldName
    });
  }
//   onDummyDataChange(event: Event) {
//   const index = +(event.target as HTMLSelectElement).value;
//   // this.loadFromDummyData(index);
//   console.log("event",event);
// }
}