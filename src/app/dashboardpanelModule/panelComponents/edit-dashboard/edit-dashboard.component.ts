import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, QueryList, ViewChild, ViewChildren, inject} from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { ChartComponent, AccumulationChartComponent, ToolbarItems, AnimationModel, ILoadedEventArgs, IAccTooltipRenderEventArgs, IAccTextRenderEventArgs, ITooltipRenderEventArgs, IAxisLabelRenderEventArgs, IPointRenderEventArgs, ChartModule, AccumulationChartModule } from '@syncfusion/ej2-angular-charts';
import { CheckBoxSelection, DropDownListComponent, MultiSelectComponent, SelectionSettingsModel, VirtualScroll, DropDownListModule, ListBoxModule, MultiSelectModule } from '@syncfusion/ej2-angular-dropdowns';
import { GridComponent, GroupSettingsModel, FilterSettingsModel, QueryCellInfoEventArgs, PageEventArgs, DataStateChangeEventArgs, PagerComponent, GridModule, PageService, GroupService, SortService, FilterService, ResizeService, ReorderService, ColumnMenuService, ExcelExportService as GridExcelExportService, PdfExportService as GridPdfExportService, ToolbarService as GridToolbarService } from '@syncfusion/ej2-angular-grids';
import { DashboardLayoutComponent, PanelModel, DashboardLayoutModule } from '@syncfusion/ej2-angular-layouts';
import { ClickEventArgs, DataBoundEventArgs } from '@syncfusion/ej2-angular-navigations';
import { DisplayOption, EnginePopulatedEventArgs, PivotView, PivotViewComponent, PivotViewModule, ToolbarService, ExcelExportService as PivotExcelExportService, PDFExportService, ConditionalFormattingService } from '@syncfusion/ej2-angular-pivotview';
import { AnimationSettingsModel, hideSpinner, ButtonPropsModel, DialogModule } from '@syncfusion/ej2-angular-popups';
import { ChartService } from 'src/app/core/services/chart.service';
import { PanelServiceService } from 'src/app/core/services/panel-service.service';
import { GridSettings } from '@syncfusion/ej2-pivotview/src/pivotview/model/gridsettings';
import { DatepickerComponent } from '../../panel-properties/datepicker/datepicker.component';
import { DaterangepickerComponent } from '../../panel-properties/daterangepicker/daterangepicker.component';
import { DropdownPropertiesComponent } from '../../panel-properties/dropdown-properties/dropdown-properties.component';
import { ListboxPropertiesComponent } from '../../panel-properties/listbox-properties/listbox-properties.component';
import { PivotPropertiesComponent } from '../../panel-properties/pivot-properties/pivot-properties.component';
import { PropertyBoxComponent } from '../../panel-properties/property-box/property-box.component';
import { PropertyChartComponent } from '../../panel-properties/property-chart/property-chart.component';
import { PropertyTableComponent } from '../../panel-properties/property-table/property-table.component';
import { HeaderCellInfoEventArgs, PageSettingsModel } from '@syncfusion/ej2-grids';
import { Observable } from 'rxjs';
import { DataManager, Query, UrlAdaptor, WebApiAdaptor } from '@syncfusion/ej2-data';
import { PropertyMultiselectdropdownComponent } from '../../panel-properties/property-multiselectdropdown/property-multiselectdropdown.component';
// import { Browser } from '@syncfusion/ej2/base';
import { Browser } from '@syncfusion/ej2-base';
import { InitialFiltersComponent } from '../../panel-properties/initial-filters/initial-filters.component';
import { LoaderService } from 'src/app/core/services/loader.service';
import { PopupService } from 'src/app/core/services/popup.service';
import { RawdatadumpComponent } from '../../panel-properties/rawdatadump/rawdatadump.component';
import { ExcelExportService } from 'src/app/core/services/excel-export.service';
import { InputBoxPropertiesComponent } from '../../panel-properties/input-box-properties/input-box-properties.component';
import { CardTemplateComponent } from '../../panel-properties/card-template/card-template.component';
import { AIAssistViewComponent, PromptModel, ResponseToolbarSettingsModel, PromptRequestEventArgs, AIAssistViewModule } from '@syncfusion/ej2-angular-interactive-chat';
import { PropertySceduleComponent } from '../../panel-properties/property-scedule/property-scedule.component';
import { EventSettingsModel, ScheduleModule } from '@syncfusion/ej2-angular-schedule';
import { KanbanComponent } from '../../panel-properties/kanban/kanban.component';
import { CircularGaugeComponent, CircularGaugeModule } from '@syncfusion/ej2-angular-circulargauge';
import { LegendService, GaugeTooltipService } from '@syncfusion/ej2-angular-circulargauge';
import { guageChartPropertiesComponent } from '../../panel-properties/guage-chart-properties/guage-chart-properties.component';
import { ButtonModule, SwitchModule } from '@syncfusion/ej2-angular-buttons';
import { NgIf, NgFor, NgClass, NgStyle } from '@angular/common';
import { KanbanModule } from '@syncfusion/ej2-angular-kanban';
import { DateRangePickerModule, DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import { RoleMappingComponent } from '../../panel-properties/role-mapping/role-mapping.component';


DropDownListComponent.Inject(VirtualScroll);
MultiSelectComponent.Inject(VirtualScroll);
MultiSelectComponent.Inject(CheckBoxSelection);


@Component({
    selector: 'app-edit-dashboard',
    templateUrl: './edit-dashboard.component.html',
    styleUrls: ['./edit-dashboard.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [LegendService, GaugeTooltipService, ToolbarService, PivotExcelExportService, PDFExportService, ConditionalFormattingService, PageService, GroupService, SortService, FilterService, ResizeService, ReorderService, ColumnMenuService, GridExcelExportService, GridPdfExportService, GridToolbarService],
    imports: [ButtonModule, NgIf, DashboardLayoutModule, NgFor, GridModule, NgClass, ChartModule, KanbanModule, PivotViewModule, AccumulationChartModule, NgStyle, DateRangePickerModule, DatePickerModule, DropDownListModule, ListBoxModule, MultiSelectModule, ScheduleModule, AIAssistViewModule, CircularGaugeModule, DialogModule, FormsModule, ReactiveFormsModule, SwitchModule, RoleMappingComponent, InitialFiltersComponent, PropertyChartComponent, PropertyTableComponent, PivotPropertiesComponent, PropertyBoxComponent, ListboxPropertiesComponent, DropdownPropertiesComponent, DatepickerComponent, DaterangepickerComponent, PropertyMultiselectdropdownComponent, PropertySceduleComponent, InputBoxPropertiesComponent, RawdatadumpComponent, CardTemplateComponent, KanbanComponent, guageChartPropertiesComponent]
})


export class EditDashboardComponent implements OnInit {

  @ViewChild('createDashboard') createDashboard!: DashboardLayoutComponent;
  @ViewChild('chart') columnChart!: ChartComponent;
  @ViewChild('pie') pieChart!: AccumulationChartComponent;
  @ViewChild('grid') grid!: GridComponent;
  @ViewChild('grid1') grid1!: GridComponent;

  showDefaultDialog: boolean = false;
  showTabelNameDlg: boolean = false;
  showFormPopup: boolean = false;
  @ViewChild('dialogRef', { static: false }) dialogRef!: ElementRef;
  @ViewChild('pivotview') pivotview!: PivotViewComponent;

  showDashboardTitlePopup: boolean = false;
  showConnectionFormPopup: boolean = false;
  @ViewChild('icons') iconDropDownList!: DropDownListComponent;

  @ViewChild(DropdownPropertiesComponent) DropdownPropertiesComponent!: DropdownPropertiesComponent;
  @ViewChild(PropertyBoxComponent) PropertyBoxComponent!: PropertyBoxComponent;
  @ViewChild(PropertyChartComponent) PropertyChartComponent!: PropertyChartComponent;
  @ViewChild(PivotPropertiesComponent) PivotPropertiesComponent!: PivotPropertiesComponent;
  @ViewChild(PropertyTableComponent) PropertyTableComponent!: PropertyTableComponent;
  @ViewChild(ListboxPropertiesComponent) ListboxPropertiesComponent!: ListboxPropertiesComponent;
  @ViewChild(DaterangepickerComponent) DaterangepickerComponent!: DaterangepickerComponent;
  @ViewChild(PropertyMultiselectdropdownComponent) PropertyMultiselectdropdownComponent!: PropertyMultiselectdropdownComponent;
  @ViewChild(InputBoxPropertiesComponent) InputBoxPropertiesComponent!: InputBoxPropertiesComponent;
  @ViewChild(CardTemplateComponent) CardTemplateComponent!: CardTemplateComponent;

  @ViewChild(DatepickerComponent) DatepickerComponent!: DatepickerComponent;
  showUserMappingModel: boolean = false;
  @ViewChild(RawdatadumpComponent) RawdatadumpComponent!: RawdatadumpComponent;
  @ViewChild(PropertySceduleComponent) PropertySceduleComponent!: PropertySceduleComponent;
  @ViewChild(KanbanComponent) KanbanPropertiesComponent!: KanbanComponent;
  @ViewChild(guageChartPropertiesComponent) guageChartPropertiesComponent !: guageChartPropertiesComponent;
  @ViewChild('gaugeContainer', { static: false })
  gaugeContainer!: ElementRef<HTMLDivElement>;

  @ViewChild('circularGauge', { static: false })
  circularGauge!: CircularGaugeComponent;

  gaugeWidth = '0px';
  gaugeHeight = '0px';

  @HostListener('window:resize', ['$event'])
  private resizeObserver!: ResizeObserver;

  resizeInit() {
    this.resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        console.log('Gauge container resized:', width, height);

        this.gaugeWidth = `${width}px`;
        this.gaugeHeight = `${height}px`;

        // Refresh gauge after resize
        setTimeout(() => {
          this.circularGauge?.refresh();
        });
      }
    });

    this.resizeObserver.observe(this.gaugeContainer.nativeElement);
  }
  ngAfterViewInit(): void {
    // console.log('ngAfterViewInit Gauge container element => ', this.gaugeContainer);
    setTimeout(() => {
      // console.log('ngAfterViewInit Gauge container element => ', this.gaugeContainer.nativeElement);
      if (this.gaugeContainer) {
        this.resizeInit();
      }
      setTimeout(() => {
        if (this.circularGauge) {
          this.circularGauge.refresh();
        }
      }, 500);
    }, 1000);


  }
  isMobileView: boolean = false;

  dialogHeader: string = 'Select Type';
  dialogCloseIcon: Boolean = true;
  dialogWidth: string = '300px';
  dialogdragging: Boolean = true;
  animationSettings: AnimationSettingsModel = { effect: 'Zoom' };
  isModal: Boolean = true;
  target: string = '.control-section';
  showCloseIcon: Boolean = false;
  visible: Boolean = true;
  selectedPanelType!: string;
  initialPage: any = { pageSizes: true, pageCount: 4 };
  panelHeader: string = 'Create Panel'
  // initialPage: any = { pageSizes:['20', '50', '100','200','500', '1000'] };
  // initialPage: any = { pageSizes: ['20', '50', '100', '200', '500', '1000'], pageCount: 4 };

  // initialPage: any = { pageSizes: ['20', '50', '100', '200', '500', '1000']};


  public position: any = { X: 'center', Y: 'center' };

  dialogPosition = { X: 'center', Y: 'center' };
  dialogTarget: HTMLElement = document.body;

  onBeforeOpen(event: any) {
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    const dialogHeight = 450; // Replace with actual dialog height if dynamic
    const dialogWidth = 1050; // Replace with actual dialog width if dynamic

    // //console.log('viewportWidth', viewportWidth, 'viewportHeight', viewportHeight)

    // Calculate the center position relative to the viewport
    const centerX = Math.max((viewportWidth - dialogWidth) / 2, 0);
    const centerY = Math.max((viewportHeight - dialogHeight) / 2, 0);

    // Assign positions as strings with 'px' suffix
    this.dialogPosition = {
      X: `center`,
      Y: `center`,
    };
  }



  // public onDialogOpen(): void {
  //   // Calculate the visible area of the screen
  //   const viewportHeight = window.innerHeight;
  //   const viewportWidth = window.innerWidth;
  //   const scrollTop = window.scrollY;
  //   const scrollPosition = window.scrollY ;

  //   // Calculate the top position to center the dialog in the visible area
  //   const dialogHeight = 450; // Height of the dialog
  //   const topPosition = scrollTop + (viewportHeight / 2) - (dialogHeight / 2);

  //   // Set the dialog position dynamically
  //   // formPopup position removed
  // }



  toolbarOptions?: ToolbarItems[];
  gridtoolbarOptions?: ToolbarItems[];

  groupOptions!: GroupSettingsModel;
  filterSettings!: FilterSettingsModel;
  gridSettings!: GridSettings;
  count: any = 0;
  sendEditPanelObj: any;
  getPanelIndex: any;
  panelTypeForm!: FormGroup;
  dashboardTitleForm!: FormGroup;
  iconFields: any = { text: 'PanelType', iconCss: 'Class', value: 'PanelType' };
  height: string = '200px';
  dashboardObjId: any = 0;
  dashboardListArray: any[] = []
  panelType: any;
  childPanelObj: any;


  panelTypeDataArray: any[] = [
    { Class: 'bi bi-bar-chart-line', PanelType: 'Chart', Id: '1' },
    { Class: 'bi bi-display', PanelType: 'Box', Id: '2' },
    { Class: 'bi bi-table', PanelType: 'Table', Id: '3' },
    { Class: 'bi bi-table', PanelType: 'Pivot', Id: '4' },
    { Class: 'bi bi-calendar-event', PanelType: 'DatePicker', Id: '5' },
    { Class: 'bi bi-calendar-event', PanelType: 'DateRangePicker', Id: '6' },
    { Class: 'bi bi-list-ul', PanelType: 'ListBox', Id: '7' },
    { Class: 'bi bi-caret-down-square', PanelType: 'DropdownList', Id: '8' },
    { Class: 'bi bi-chevron-down-circle', PanelType: 'MultiSelectDropDown', Id: '9' },
    { Class: 'bi bi-download', PanelType: 'RawDataDump', Id: '10' },
    { Class: 'bi bi-search', PanelType: 'InputBox', Id: '11' },
    { Class: 'bi bi-display', PanelType: 'Card', Id: '12' },
    { Class: 'bi bi-calendar-week', PanelType: 'Calender', Id: '13' },
    { Class: 'bi bi-kanban', PanelType: 'Kanban', Id: '14' },
    { Class: 'bi bi-speedometer2', PanelType: 'Gauge', Id: '15' }
  ];

  sendMappingObj: any;

  filterDropdownfields: Object = { text: '', value: '' }
  selectionSettings: SelectionSettingsModel = { showCheckbox: true };
  dashboardObjFlag: boolean = false;

  dashboardName: any;
  dashboardDescription: any;
  cellSpacing: number[] = Browser?.isDevice ? [5, 2] : [10, 10];
  //cellSpacing!: number[];
  cellAspectRatio: any;
  wrapSettings: any = { wrapMode: 'Both' };

  dashboardCreationObj: any = {
    allowFloating: false,
    allowDragging: true,
    showGridLines: true,
    cellAspectRatio: "100/80",
    cellSpacing: [10, 10],
    allowResizing: true,
    panels: []
  }
  loaderFlag: boolean = true;
  editDashboardId!: string;
  public isIndeterminate?: boolean;
  public animation: AnimationModel = { enable: true, duration: 2000, delay: 0 };
  connection_id!: number;
  panelsArrayFromApi: any = []
  connectionIdFlag: boolean = false;
  connectionNameForm!: FormGroup;
  connectionNameFromApi: any;
  connectionDetailsArray: any[] = [];
  connectionSubmitFlag: boolean = true;
  connectionUpdateFlag: boolean = false;
  ItemPageData: any = [5, 10, 15, 20, 'All']
  onTextRender: Function | any;

  @HostListener('window:unload', ['$event'])
  onUnload(): void {

    // localStorage.setItem('leavingPage', 'true');
    sessionStorage.setItem('leavingPage', 'true');

  }


  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkView();
    let screenWidth = window.innerWidth;
    let landscapeView = window.matchMedia('(orientation: landscape)').matches;
    if (screenWidth <= 760 && landscapeView) {
      this.cellAspectRatio = 0.45;
    } else if (screenWidth <= 760 && !landscapeView) {
      this.cellAspectRatio = 100 / 8;
    } else {
      this.cellAspectRatio = 100 / 80;
    }
  }

  positionDialog() {

    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const viewportHeight = window.innerHeight;
    const dialogHeight = 300;  // Static height for your dialog, adjust accordingly

    const centerY = (viewportHeight - dialogHeight) / 2 + scrollTop;

    this.position = {
      X: 'center', // Always center horizontally
      Y: centerY + 'px' // Vertical position based on scroll
    };


  }

  // Add this to your ngOnInit or constructor
  checkLeavingPage(): void {
    // const leavingPage = localStorage.getItem('leavingPage');
    const leavingPage = sessionStorage.getItem('leavingPage');

    if (leavingPage) {

      alert('Are you sure you want to leave this page?');
      // localStorage.removeItem('leavingPage');
      sessionStorage.removeItem('leavingPage');
    }
  }
  private readonly panelService = inject(PanelServiceService);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  private readonly formBuilder = inject(FormBuilder);
  private readonly chartService = inject(ChartService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly loaderService = inject(LoaderService);
  private readonly popupService = inject(PopupService);
  private readonly excelService = inject(ExcelExportService);
  constructor() {
    this.router.events.subscribe(event => {
          if (event instanceof NavigationEnd) {
    
    
            sessionStorage.removeItem('panelSeriesArray');
            sessionStorage.removeItem('createPanelSeriesArray');
            sessionStorage.removeItem('storeEditObj');
            sessionStorage.removeItem('connectionIdObj');
  }
    });


  }

  canDeactivate(): boolean | Observable<boolean> {
    if (this.popupService.shouldSkipGuard) {
      this.popupService.resetGuard();
      return true;
    }
    return this.showConfirmation();
  }

  showConfirmation(): boolean {
    return window.confirm('Are you sure you want to leave this page?');
  }

  panelSeriesArray: any[] = []
  tableDatasource: any = []
  tableNamesArray: any[] = [];
  showTablePopup() {
    this.showTabelNameDlg = true;
    this.syncOverlay();
    this.chartService.getTableNamesArrary(this.connection_id).subscribe((res: any) => {
      let data = res['data'];
      this.tableNamesArray = data;

    });
  }

  tableReplaceForm!: FormGroup;

  tableReplaceCreation() {

  }


  updateTableName(oldValue?: any, newValue?: any) {
    let formValue = this.tableReplaceForm.value
    oldValue = formValue.oldtableName;
    newValue = formValue.newTableName;


    // //console.log('tableReplaceForm', this.tableReplaceForm.value);

    this.panelSeriesArray.forEach(panel => {
      this.recursiveReplace(panel, oldValue, newValue);
    });
    let arr: any = JSON.stringify(this.panelSeriesArray)
    // localStorage.setItem('createPanelSeriesArray', arr);
    sessionStorage.setItem('createPanelSeriesArray', arr);


    // //console.log('Updated panelSeriesArray:', this.panelSeriesArray);
    this.showTabelNameDlg = false;
    this.syncOverlay();
  }



  recursiveReplace(obj: any, oldValue: string, newValue: string) {
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {

        if (typeof obj[key] === 'object' && obj[key] !== null) {
          this.recursiveReplace(obj[key], oldValue, newValue);
        }

        else if (typeof obj[key] === 'string' && obj[key] === oldValue) {
          obj[key] = newValue;
        }

        else if (typeof obj[key] === 'string') {

          if (obj[key].includes(oldValue)) {
            obj[key] = obj[key].replace(new RegExp(oldValue, 'g'), newValue);
          }
        }
      }
    }
  }

  checkView() {
    this.isMobileView = window.innerWidth <= 760; // Adjust the breakpoint as needed

  }
  getFontSize(apiFontSize: number, mobileFontSize: number): string {
    return this.isMobileView ? `${mobileFontSize}px` : `${apiFontSize}px`;
  }

  public pivotGridSettings?: GridSettings;
  public cellTemplate?: string;
  public observable = new Observable();
  public displayOption?: DisplayOption;


  formatSecondsToHHMMSS(totalSeconds: number): string {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }


  //  axisLabelRender(args : IAxisLabelRenderEventArgs , item : any): void {
  //   //console.log('args axisLabelRender', args)
  //   // if (args.axis.name === 'primaryYAxis') {
  //   //   args.text = this.formatSecondsToHHMMSS(Number(args.text));
  //   // }
  // };

  axisLabelRender(args: any, item: any): void {
    const seriesList = args.axis.series || [];
    //console.log('args', args)

    const dataSource = item?.content?.dataSource;
    const firstObj = dataSource?.[0];

    if (!firstObj) return;

    const keys = Object.keys(firstObj);

    // Check all series in the axis
    for (const series of seriesList) {
      const yName = series?.properties?.yName;
      const seriesName = series?.properties?.name;


      const matchedKey = keys.find(key => key === yName || key === seriesName);
      // //console.log('matchedKey', matchedKey)

      if (matchedKey) {
        const value = firstObj[matchedKey];

        // Check if the value has a colon (indicating time format)
        if (typeof value === 'string' && value.includes(':')) {
          const numericValue = Number(args.text);

          // Format only if it's a valid number
          if (!isNaN(numericValue)) {
            args.text = this.formatSecondsToHHMMSS(numericValue);
          }

          // No need to check further series if one match is enough
          break;
        }
      }
    }
  }




  groupNames: any;
  subGroupNames: any;

  ngOnInit(): void {
    this.checkView();

    this.chartService.getAllDashboardDetailsWithEmptyData().subscribe((res: any) => {
      let data = res['data'];
      // //console.log('data of dashboards', data)
      // Flatten all group_name arrays into one and remove duplicates using Set
      this.groupNames = [
        ...new Set(
          data
            .flatMap((item: any) => item.group_name)
            .filter((name: string) => name && name.trim() !== '')
        )
      ];
      // Flatten all sub_group arrays into one and remove duplicates using Set
      this.subGroupNames = [
        ...new Set(
          data
            .flatMap((item: any) => item.sub_group)
            .filter((name: string) => name && name.trim() !== '')
        )
      ];
    })



    this.onTextRender = (args: any, datalabelFormat: any, item: any) => {
      const percentValue = args.point.percentage;
      const seriesProps = args.series?.properties;
      const yName = seriesProps?.yName;
      const seriesName = seriesProps?.name;

      const point = args.point || {};
      const label = (point.x != null) ? String(point.x) : (seriesName || '');
      const firstObj = item.content.dataSource?.[0];

      // Apply formatting only for specific chart types
      const chartTypes = ['Pie', 'Donut', 'Pyramid', 'funnel'];
      if (chartTypes.includes(item.content.chartType)) {
        const matchedValue = firstObj ? (firstObj[yName] ?? firstObj[seriesName]) : null;
        const isTimeFormat = typeof matchedValue === 'string' && /^\d+:\d{2}:\d{2}$/.test(matchedValue);

        if (datalabelFormat === "Both") {
          const valText = isTimeFormat ? this.formatSecondsToHHMMSS(args.point.y) : args.text;
          args.text = `${label}<br>${valText} (${percentValue}%)`;
        } else if (datalabelFormat === "ValueWithLabel") {
          const valText = isTimeFormat ? this.formatSecondsToHHMMSS(args.point.y) : args.text;
          args.text = `${label}<br>${valText}`;
        } else if (datalabelFormat === "ValueWithPercentage") {
          if (percentValue != null && !String(args.text).includes('%')) {
            args.text = `${label}<br>(${percentValue}%)`;
          }
        }
      }

      if (datalabelFormat === "Percentage") {
        if (percentValue != null && !String(args.text).includes('%')) {
          args.text = percentValue + "%";
        }
      } else if (!chartTypes.includes(item.content.chartType)) {
        if (firstObj) {
          const matchedValue = firstObj[yName] ?? firstObj[seriesName];
          if (typeof matchedValue === 'string' && /^\d+:\d{2}:\d{2}$/.test(matchedValue)) {
            args.text = this.formatSecondsToHHMMSS(args.point.y);
          }
        }
      }
    };



    let screenWidth = window.innerWidth;
    let landscapeView = window.matchMedia('(orientation: landscape)').matches;

    if (screenWidth <= 760 && landscapeView) {
      this.cellAspectRatio = 0.45;
    } else if (screenWidth <= 760 && !landscapeView) {
      this.cellAspectRatio = 100 / 15;
    } else {
      this.cellAspectRatio = 100 / 80;
    }


    this.gridSettings = {
      columnWidth: 150,
      // layout: 'Tabular',
      //   selectionSettings: { mode: 'Cell', type: 'Single' },
      // allowSelection: true,
      columnRender: this.observable.subscribe((args: any) => {
        this.alignHeadersRecursively(args.stackedColumns);
        if ((args as any).stackedColumns[0]) {
          // Content for the row headers is right-aligned here.
          (args as any).stackedColumns[0].textAlign = 'Left';
        }
      }) as any,

      excelQueryCellInfo: this.observable.subscribe((args: any) => {
        if (args.cell.value == 0) {
          args.style.borders = { color: '#000000', lineStyle: 'thin' } // Apply border here
          args.style.numberFormat = undefined;
        }
      }) as any,

    } as GridSettings;


    this.cellSpacing = Browser?.isDevice ? [10, 10] : [5, 5]


    this.chartService.getAllDbConncetionDetails().subscribe((res: any) => {
      let resData = res['data'];
      // // //console.log(resData)
      this.connectionDetailsArray = resData;
      this.connectionDetailsArray.unshift({
        connection_id: 0,
        connection_name: 'Internal'
      });
    })



    this.connectionNameForm = this.formBuilder.group({
      connectionName: [''],
      databaseName: ['']
    })

    // let storedConnectionId: any = localStorage.getItem('connectionIdObj')
    let storedConnectionId: any = sessionStorage.getItem('connectionIdObj')

    if (storedConnectionId != null || storedConnectionId != undefined) {
      this.connectionIdFlag = false;
    } else {
      this.connectionIdFlag = true
    }
    this.panelTypeForm = this.formBuilder.group({
      panelType: ['', Validators.required]
    })

    this.tableReplaceForm = this.formBuilder.group({
      oldtableName: [''],
      newTableName: ['']
    })

    this.dashboardTitleForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: [''],
      dashboard_image: [''],
      specific_cache_exp: [''],
      auto_refresh: [''],
      version: [''],
      is_active: [''],
      group_name: [''],
      sub_group: ['']

    })
    this.groupOptions = { showGroupedColumn: true };
    this.filterSettings = { type: 'CheckBox' };


    // this.toolbarOptions = [ 'Export', 'ConditionalFormatting','SubTotal', 'GrandTotal',] as any as ToolbarItems[];
    // this.toolbarOptions = ['Export','Grid','Chart'] as any as ToolbarItems[];
    this.toolbarOptions = ['Export'] as any as ToolbarItems[];
    // this.displayOption = { view: 'Both' } as DisplayOption;
    // this.toolbarOptions = ['Export', 'SubTotal', 'GrandTotal', { prefixIcon: 'e-expand', id: 'ExpandAll', text: 'Expand All' }] as any as ToolbarItems[];


    // this.gridtoolbarOptions = [ 'ExcelExport', 'CsvExport'] as any as ToolbarItems[];
    this.gridtoolbarOptions = ['ExcelExport'] as any as ToolbarItems[];

    this.loaderService.show()
    this.route.paramMap.subscribe((params) => {
      let dashboardId: any = params.get('id');
      // // //console.log(dashboardId)

      this.editDashboardId = dashboardId;
      let filterObjEle = {
        "filter_obj": [],
        "drilldown_obj": [],
        "disabled_filterObj": [],
        "drilldown_table_obj": [],

      }


      this.getInitialLoadDataWithBookmarkFilters(this.editDashboardId, filterObjEle)

    });

    this.panelSeriesArray.forEach((panel: any) => {
      if (panel.panelType === 'Pivot' && panel.content?.defaultView) {
        this.pivotDisplayOptions[panel.id] = panel.content.defaultView === 'chart' ? 'Chart' : 'Table';
      }
    });
  }

  trackById(index: number, item: any): number {
    return item.id; // Replace with a unique identifier
  }

  tooltipRenderColumnChart(args: any | any, item: any): void {
    const headerText = args.headerText;
    const yValue = args.point?.y;

    if (!item?.content?.dataSource?.length) return;

    const dataSample = item.content.dataSource[0];
    const seriesName = args.data.seriesName;

    // Check if the measure value in data source is a time string
    const originalValue = dataSample[headerText] ?? dataSample[seriesName] ?? dataSample[args.series?.yName];
    const isTimeFormat = typeof originalValue === 'string' && originalValue.includes(':');

    let pointXtext = seriesName ? seriesName : args.point.x;

    if (isTimeFormat && typeof yValue === 'number') {
      args.text = `${pointXtext} : ${this.formatSecondsToHHMMSS(yValue)}`;
    } else {
      args.text = `${pointXtext} : ${yValue}`;
    }

    args.headerText = `${args.point.x}`;
  }

  groupNameList: any = [];
  subGroupList: any = [];
  timeStringToSeconds(timeStr: string): number {
    const [hours, minutes, seconds] = timeStr.split(":").map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  }

  eventSettings: EventSettingsModel = {
    dataSource: [],
  }

  selectedDate: any = new Date();

  getResourceData(res: any, dataSource: any, fieldDetails: any): any[] {
    console.log('getResourceData res', res, dataSource, fieldDetails);
    // Extract unique values for the given resource field
    const uniqueVals = Array.from(
      new Set(dataSource.map((d: any) => d[res.field]))
    );

    console.log('uniqueVals', uniqueVals);

    return uniqueVals.map((val, index) => {
      // Find the first matching record in the dataSource
      const matchingRecord = dataSource.find((d: any) => d[res.field] === val);

      return {
        // Use res.textField if provided, else fallback to the value
        text: matchingRecord
          ? matchingRecord[res.text || res.field]
          : val,
        id: val, // keep id same as unique value
        color: this.randomColor(index)
      };
    });
  }

  randomColor(index: number): string {
    const colors = ['#1aaa55', '#357cd2', '#7fa900', '#ff5733', '#a633ff'];
    return colors[index % colors.length];
  }


  getInitialLoadDataWithBookmarkFilters(dashboard_id: any, filterObj: any) {

    // //console.log(dashboard_id, filterObj, true, true)
    this.chartService.editDashboardDetailsWithBookmarkFilterById(dashboard_id, filterObj, true, true).subscribe({
      next: (res: any) => {
        // Handle success
        this.loaderService.hide();

        let resObj = res['data'];
        //console.log('res in edit page', res)
        if (resObj == null) {

          this.getDashboardDetails(this.editDashboardId)
        } else {

          let data = resObj.dashboard_setup;
          this.dashboardName = resObj.dashboard_name;
          this.dashboardDescription = resObj.description;
          this.dashboardCreationObj = data.dashboardObj;
          this.groupNameList = resObj.group_name;
          this.subGroupList = resObj.sub_group;
          // this.groupNames = resObj.group_name
          // //console.log('this.groupNameList', this.groupNameList, data)

          this.sendMappingObj = this.dashboardCreationObj.roleMapping;
          this.roleMappingObj = this.dashboardCreationObj.roleMapping;
          // localStorage.setItem('mappingObj', JSON.stringify(this.sendMappingObj));
          sessionStorage.setItem('mappingObj', JSON.stringify(this.sendMappingObj));



          this.sendfilterObj = this.dashboardCreationObj.initialFilterObj
          // localStorage.setItem('initialFilters', JSON.stringify(this.sendfilterObj))
          sessionStorage.setItem('initialFilters', JSON.stringify(this.sendfilterObj))



          if (this.dashboardCreationObj.connection_id == 0) {
            this.connectionNameFromApi = 'internal';
            this.connection_id = 0

            let obj = {
              "connectionName": 'internal',
              "connection_Id": 0,
              "databaseName": ''
            }
            // localStorage.setItem("connectionIdObj", JSON.stringify(obj))
            sessionStorage.setItem("connectionIdObj", JSON.stringify(obj))
          } else {

            // //console.log(this.dashboardCreationObj.connection_Name)

            if (this.dashboardCreationObj.connection_Name) {
              // // //console.log('data', data)               
              this.connectionNameFromApi = this.dashboardCreationObj.connection_Name;
              this.connection_id = this.dashboardCreationObj.connection_id;

              let obj = {
                "connectionName": this.dashboardCreationObj.connection_Name,
                "connection_Id": this.dashboardCreationObj.connection_id,
                "databaseName": ""
              }
              // localStorage.setItem("connectionIdObj", JSON.stringify(obj))
              sessionStorage.setItem("connectionIdObj", JSON.stringify(obj))

            } else {
              this.chartService.getDbConnectionDetailById(this.dashboardCreationObj.connection_id).subscribe((res: any) => {
                let data = res['data'];

                // //console.log('data', data)
                this.connectionNameFromApi = data.connection_name;
                this.connection_id = this.dashboardCreationObj.connection_id;

                let obj = {
                  "connectionName": data.connection_name,
                  "connection_Id": data.connection_id,
                  "databaseName": data.default_database_name
                }
                // localStorage.setItem("connectionIdObj", JSON.stringify(obj))
                sessionStorage.setItem("connectionIdObj", JSON.stringify(obj))

              })
            }

          }
          const apiTitle = resObj.dashboard_name; // Replace with the actual title from your API
          this.chartService.setTitle(apiTitle);
          this.dashboardTitleForm.patchValue({
            title: resObj.dashboard_name,
            description: resObj.description,
            specific_cache_exp: resObj.specific_cache_exp,
            auto_refresh: resObj.auto_refresh,
            version: resObj.version,
            is_active: resObj.is_active,
            group_name: resObj.group_name,
            sub_group: resObj.sub_group




          })
          this.imageName = resObj.image_name
          this.imageUrl = resObj.dashboard_image
          this.panelSeriesArray = this.dashboardCreationObj.panels;
          this.panelsArrayFromApi = this.dashboardCreationObj.panels;

          if (this.panelSeriesArray) {
            hideSpinner((document as any).getElementById('container'))
          }

          let modifiedArr = this.panelsArrayFromApi.map((res: any) => {

            if (res.panelType === 'Chart') {
              const rawData = res.content.dataSource.length > 150
                ? res.content.dataSource.slice(0, 150)
                : res.content.dataSource;
              let measureArr = res.content.measure;
              let MeasurefieldNames = measureArr.map((ele: any) => ele.fieldName);
              //console.log('rawData', rawData)

              const updatedDataSource = rawData.map((entry: any) => {
                const updatedEntry = { ...entry };

                MeasurefieldNames.forEach((field: any) => {
                  const value = entry[field];

                  // Allow any number of digits in hours
                  if (typeof value === 'string' && /^\d+:\d{2}:\d{2}$/.test(value)) {
                    updatedEntry[field] = this.timeStringToSeconds(value);
                  }
                });

                return updatedEntry;
              });

              //console.log('updatedDataSource', updatedDataSource)


              let seriesArray = res.content.measure.map((ele: any) => {
                let obj: any = {
                  xName: res.content.dimension.levels[0].fieldName,
                  yName: ele.fieldName,
                  type: ele.seriesType,
                  dataSource: updatedDataSource,
                  fill: ele.seriesColor,
                  name: ele.labelName,
                  expression: ele.expression,
                  opposedPosition: ele.opposedPosition,
                };

                if (ele.opposedPosition === true) {
                  obj.yAxisName = 'yAxis';
                }

                if (ele.seriesType === 'Pie' || ele.seriesType === 'Donut') {
                  obj.marker = ele.marker;
                  obj.dataLabel = ele.dataLabel;
                } else {
                  obj.marker = {
                    visible: ele.marker?.visible ?? true,
                    dataLabel: ele.dataLabel,
                  };
                }

                return obj;
              });

              const chartObj = {
                ...res,
                content: {
                  ...res.content,
                  series: seriesArray,
                },
              };

              return chartObj;
            }


            else if (res.panelType === 'Box') {


              let resData = res.content;


              const processDataSourceold = (dataSource: any[], rawQuery: string, fieldDetails: any[]): any[] => {
                if (rawQuery && rawQuery.trim() !== "") {

                  let modifiedData = dataSource.map((ele: any) => {
                    const key = Object.keys(ele)[0];
                    let value = ele[key];

                    fieldDetails.forEach((obj: any) => {
                      if (obj.fieldName == ele.index) {
                        value = this.applyFormat(value, obj.valueFormat);
                      }
                    });

                    const processedItem: any = {
                      "0": value,  // Apply formatted value here
                      "index": ele.index,
                    };

                    return processedItem;
                  });

                  // modified code for datasource
                  // dataSource = modifiedData;

                  //  //console.log('if data', modifiedData)


                  return dataSource;


                } else {

                  let modifiedData = dataSource.map((ele: any) => {
                    const key = Object.keys(ele)[0];
                    let value = ele[key];

                    fieldDetails.forEach((obj: any) => {
                      if (obj.fieldName == ele.index) {
                        value = this.applyFormat(value, obj.valueFormat);
                      }
                    });

                    const processedItem: any = {
                      "0": value,  // Apply formatted value here
                      "index": ele.index,
                    };

                    return processedItem;
                  });

                  // //console.log('else data', modifiedData)
                  dataSource = modifiedData;

                  return dataSource;
                }


              }

              let processDataSource = (dataSource: any[], rawQuery: string, fieldDetails: any[]): any[] => {
                // //console.log('res', dataSource, fieldDetails);

                let modifiedData = dataSource.map((ele: any) => {
                  const key = Object.keys(ele)[0];
                  let value = ele[key];

                  fieldDetails.forEach((obj: any) => {
                    // //console.log('obj.fieldName', obj.fieldName, 'ele.index', ele.index);

                    // Add null/undefined checks
                    if (obj.fieldName && ele.index && obj.fieldName.toLowerCase() === ele.index.toLowerCase()) {
                      value = this.applyFormat(value, obj.valueFormat);
                    }
                  });

                  // //console.log('value in if condition', value);

                  const processedItem: any = {
                    "0": value, // Apply formatted value here
                    "index": ele.index || null, // Handle missing index
                  };

                  return processedItem;
                });

                // //console.log('modifiedData in if condition', modifiedData);

                return modifiedData;


              };

              const chartObj = {
                ...res,
                connection_id: this.dashboardCreationObj.connection_id,
                content: {
                  ...res.content,
                  // dataSource: processDataSource(resData.dataSource, resData.rawQuery),
                  // dataSource: processDataSource(resData.dataSource, resData.rawQuery, resData.fieldDetails),

                },
              };

              chartObj.content.dataSource = chartObj.content.dataSource.map((item: any) => {
                let updatedItem = { ...item }; // Clone the object to prevent mutation

                // Iterate through fieldDetails and match fieldName with keys in dataSource object
                chartObj.content.fieldDetails.forEach((field: any) => {
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


              // //console.log('chartObj', chartObj)
              return chartObj;
            }

            else if (res.panelType === "Table") {


              const matchedFields = res.content.matchedFieldDetails?.filter((field: any) =>
                Object.keys(res.content.dataSource[0] || {}).includes(field.field)
              );
              // //console.log('res in matchedFields ..........', matchedFields)

              const updatedContent = {
                ...res.content, // Spread the existing content
                fieldDetails: matchedFields, // Update fieldDetails
              };

              // //console.log('res in updatedContent ..........', updatedContent)


              const nonChartObj = {
                connection_id: this.dashboardCreationObj.connection_id,
                ...res, // Spread the rest of the response
                content: updatedContent,

              };


              // //console.log('nonChartObj', nonChartObj)

              return nonChartObj;

            }
            else if (res.panelType === 'Pivot') {

              //console.log('res in pivot table', res)

              let total = 0;

              // Get fields where formatType is 'string' and intended for transformation
              const timeFields = res.content.fieldDetails.filter(
                (f: any) => f.formatType === 'string' && f.name
              ).map((f: any) => f.name);

              const data = res.content.dataSourceSettings.dataSource.map((row: any) => {
                const updatedRow = { ...row };

                timeFields.forEach((field: string | number) => {
                  const timeStr = row[field];

                  if (typeof timeStr === 'string' && timeStr.includes(':')) {
                    const [h, m, s] = timeStr.split(':').map(Number);

                    if (!isNaN(h) && !isNaN(m) && !isNaN(s)) {
                      const seconds = h * 3600 + m * 60 + s;
                      updatedRow[field] = seconds;
                      total += seconds;
                    } else {
                      updatedRow[field] = 0;
                    }
                  }
                });

                return updatedRow;
              });



              //console.log('✔ Total Valid Seconds:', total);


              //console.log('data', data)

              res.content.dataSourceSettings.dataSource = data;
              let obj = {
                ...res,
                content: {
                  ...res.content,
                  // dataSource: processDataSource(resData.dataSource, resData.rawQuery, resData.fieldDetails)
                }
              }

              return obj

            }
            else if (res.panelType == 'Calender') {
              let ScedularData = res;
              // console.log('secdular', ScedularData)

              // Initialize conditionalFormatting if not present
              if (!res.content.conditionalFormatting) {
                res.content.conditionalFormatting = [];
              }

              let updatedDataSource = ScedularData.content.dataSource.map((item: any, index: number) => ({
                ...item,
                Id: index + 1
              }));

              // console.log('ele.content.resources.dataSource', res.content.resources.dataSource)

              let updatedzresouceDataSource = res.content.resources.dataSource.map((item: any, index: number) => ({
                ...item,
                Id: index + 1
              }));

              // console.log('updatedDataSource', updatedDataSource);

              ScedularData.content.dataSource = updatedDataSource;
              // ele.content.resources.forEach((resElement: any) => {
              //   resElement.dataSource = this.getResourceData(resElement, ele.content.dataSource, ele.content.fieldDetails);    
              // }); 

              res.content.resources.dataSource = this.getResourceData(res.content.resources, updatedzresouceDataSource, res.content.fieldDetails);

              res.content.eventSettings.dataSource = updatedDataSource;


              // this.eventSettings = {
              //   dataSource: ScedularData.content.dataSource,
              //   allowAdding : false,
              //   allowEditing: false,
              //   allowDeleting: false,
              //   // enableIndicator : true,
              //   enableTooltip : true,
              //   //  ignoreWhitespace : true,
              //   //  minimumEventDuration : 5,

              //   // enableIndicator : true,
              //   fields: {
              //     subject: {name : ScedularData.content.fieldDetails.subject},
              //     startTime: { name : ScedularData.content.fieldDetails.startTime},
              //     endTime:{name :  ScedularData.content.fieldDetails.endTime},
              //     location: { name: ScedularData.content.fieldDetails.location },
              //      description: { name:  ScedularData.content.fieldDetails.description },
              //     // description: ScedularData.content.fieldDetails.description,
              //     id: ScedularData.content.fieldDetails.id,
              //     // recurrenceRule: 'RecurrenceRule',
              //     // isAllDay: 'IsAllDay'

              //   }
              // }

              // console.log('this.eventsettings', this.eventSettings)

              return res
            }
            else {
              const nonChartObj = {
                connection_id: this.dashboardCreationObj.connection_id,
                ...res,
              };
              return nonChartObj;
            }
          });

          this.panelSeriesArray = modifiedArr;
          const preprocessedPanels = this.preprocessPanelsForStorage(this.panelSeriesArray);
          try {
            sessionStorage.setItem('createPanelSeriesArray', JSON.stringify(preprocessedPanels));
          } catch (error) {
            console.error('Error saving to sessionStorage:', error);
          }
          this.changeDetectorRef.markForCheck();
        }
      },
      error: (err: any) => {
        this.getDashboardDetails(this.editDashboardId)
      },
      complete: () => {
      }
    });

  }


  // onPointRender(args: any, item: any): void {
  //   // Find the matching panel object for THIS chart only
  //   const matchedObj = this.panelSeriesArray.find(ele => ele.id === item.id);

  //   // Default color (base case for all charts)
  //   let appliedColor = args.series?.fill || '#3fd2f6ff';

  //   // If chart and conditional formatting rules exist
  //   if (matchedObj?.content?.conditionalFormatArray?.length) {
  //     const pointValue = Number(args.point.y);
  //     const pointField = args.series?.yName || args.series?.properties?.yName;

  //     const pointXvalue = args.point.x;
  //     const pointXfield = args.series?.xName || args.series?.properties?.xName;

  //     for (const format of matchedObj.content.conditionalFormatArray) {

  //       if (format.fieldName == pointField) {
  //         const value1 = Number(format.value1);
  //         const value2 = Number(format.value2);

  //         switch (format.condition) {
  //           case '>': // GreaterThan
  //             if (pointValue > value1) appliedColor = format.color;
  //             break;

  //           case '<': // LessThan
  //             if (pointValue < value1) appliedColor = format.color;
  //             console.log('pointValueafter ', pointValue, appliedColor)

  //             break;

  //           case '=': // EqualTo
  //             if (pointValue === value1) appliedColor = format.color;
  //             break;

  //           case '!=': // NotEqualTo
  //             if (pointValue !== value1) appliedColor = format.color;
  //             break;

  //           case 'Between': // Between (inclusive)
  //             if (pointValue >= value1 && pointValue <= value2) appliedColor = format.color;
  //             break;

  //           case '>=': // GreaterThanOrEqualTo
  //             if (pointValue >= value1) appliedColor = format.color;
  //             break;

  //           case '<=': // LessThanOrEqualTo
  //             if (pointValue <= value1) appliedColor = format.color;
  //             break;
  //         }
  //       }
  //       if (format.fieldName == pointXfield && typeof pointXvalue == 'string') {
  //         const value1 = String(format.value1);

  //         switch (format.condition) {
  //           case '=': // EqualTo
  //             if (pointXvalue === value1) appliedColor = format.color;
  //             break;

  //           case '!=': // NotEqualTo
  //             if (pointXvalue !== value1) appliedColor = format.color;
  //             break;
  //         }
  //       }
  //     }
  //   }

  //   // Apply whichever color was decided (default or conditional)
  //   args.fill = appliedColor;

  // }

  // new code
  onPointRender(args: any, item: any): void {
    // Already have access to the panel object 'item'
    const matchedObj = item;

    // DON'T set a default color - let Syncfusion use its original palette
    // Only override if conditional formatting matches

    // If chart and conditional formatting rules exist
    if (matchedObj?.content?.conditionalFormatArray?.length) {
      const pointYvalue = args.point.y;
      const pointYfield = args.series?.yName || args.series?.properties?.yName;
      const pointXvalue = args.point.x;
      const pointXfield = args.series?.xName || args.series?.properties?.xName;
      const pointPercentage = args.point.percentage;

      // Helper: Parse value
      const parseValue = (value: any): number => {
        if (value === null || value === undefined) return NaN;
        if (typeof value === 'number') return value;
        if (typeof value === 'string') {
          const cleaned = value.replace(/[%,\s$€£¥]/g, '').trim();
          return parseFloat(cleaned);
        }
        return NaN;
      };

      // Helper: Evaluate numeric condition
      const evaluateNumeric = (val: number, cond: string, val1: number, val2?: number): boolean => {
        if (isNaN(val) || isNaN(val1)) return false;
        const tolerance = Math.max(Math.abs(val), Math.abs(val1)) < 1 ? 0.0001 : 0.01;

        switch (cond) {
          case '>': return val > val1;
          case '<': return val < val1;
          case '=':
          case '==': return Math.abs(val - val1) < tolerance;
          case '!=': return Math.abs(val - val1) >= tolerance;
          case '>=': return val > val1 || Math.abs(val - val1) < tolerance;
          case '<=': return val < val1 || Math.abs(val - val1) < tolerance;
          case 'Between':
          case 'between': return !isNaN(val2!) && val >= val1 && val <= val2!;
          default: return false;
        }
      };

      // Helper: Evaluate string condition
      const evaluateString = (val: string, cond: string, val1: string): boolean => {
        const v = val.trim().toLowerCase();
        const v1 = val1.trim().toLowerCase();

        switch (cond) {
          case '=': return v === v1;
          case '!=': return v !== v1;
          case 'contains': return v.includes(v1);
          case 'startsWith': return v.startsWith(v1);
          case 'endsWith': return v.endsWith(v1);
          default: return false;
        }
      };

      for (const format of matchedObj.content.conditionalFormatArray) {
        let matched = false;
        let isFieldMatch = false;

        // ============ Y-AXIS FIELD MATCHING ============
        if (format.fieldName === pointYfield) {
          isFieldMatch = true;
          const isPercentage = String(format.value1).includes('%');

          if (isPercentage && pointPercentage !== undefined) {
            // Percentage comparison
            matched = evaluateNumeric(pointPercentage, format.condition, parseValue(format.value1), format.value2 ? parseValue(format.value2) : undefined);
          } else {
            const numVal = parseValue(pointYvalue);
            const numVal1 = parseValue(format.value1);

            if (!isNaN(numVal) && !isNaN(numVal1)) {
              // Numeric comparison
              matched = evaluateNumeric(numVal, format.condition, numVal1, format.value2 ? parseValue(format.value2) : undefined);
            } else {
              // String comparison
              matched = evaluateString(String(pointYvalue), format.condition, String(format.value1));
            }
          }
        }

        // ============ X-AXIS FIELD MATCHING ============
        if (format.fieldName === pointXfield) {
          isFieldMatch = true;
          const numVal = parseValue(pointXvalue);
          const numVal1 = parseValue(format.value1);

          if (!isNaN(numVal) && !isNaN(numVal1)) {
            // Numeric comparison
            matched = evaluateNumeric(numVal, format.condition, numVal1, format.value2 ? parseValue(format.value2) : undefined);
          } else {
            // String comparison
            matched = evaluateString(String(pointXvalue), format.condition, String(format.value1));
          }
        }

        // ONLY apply color if BOTH field matches AND condition is met
        if (isFieldMatch && matched) {
          args.fill = format.color;
          break; // Apply first matching rule and exit
        }
      }

      // If no condition matched, args.fill is left unchanged
      // Syncfusion will use its default palette colors
    }

    // Don't set args.fill here - only set it when condition matches above
  }


  pivottoolbarClick(args: any, pivotviewInstance: PivotViewComponent, item: any) {
    if (!args?.customToolbar) return;
    const insertAt = Math.min(3, args.customToolbar.length);
    args.customToolbar.splice(insertAt, 0, {
      prefixIcon: 'e-icons e-expand',
      tooltipText: 'Expand/Collapse',
      cssClass: 'e-btn',
      click: () => this.toolbarClicked(pivotviewInstance, item),
    });
  }

  @ViewChildren('pivotview') pivotviews!: QueryList<PivotViewComponent>;
  toolbarClicked(pivotviewInstance: PivotViewComponent, item: any) {
    pivotviewInstance.dataSourceSettings.expandAll = !pivotviewInstance.dataSourceSettings.expandAll;

    // Log to confirm it is working correctly
    // //console.log('Expand/Collapse toggled for', item);
  }


  onPopupOpen(args: any, item: any) {
    console.log('onPopupOpen args', args, item.content.enablePopup);
    // 👉 Option: disable popup for event clicks

    if (item.content.enablePopup) {
      if (args.type === 'QuickInfo') {
        // Completely cancel the popup
        args.cancel = true;
        return;
      }
    } else {
      // Check if it's the quick info popup
      if (args.type === 'QuickInfo') {
        // Hide Edit button
        const editButton = args.element.querySelector('.e-event-popup .e-edit');
        if (editButton) {
          editButton.style.display = 'none';
        }

        // Hide Delete button
        const deleteButton = args.element.querySelector('.e-event-popup .e-delete');
        if (deleteButton) {
          deleteButton.style.display = 'none';
        }
      }
    }


  }



  pivottoolbarClickold(args: any) {

    args.customToolbar.splice(3, 0, {
      prefixIcon: ' e-icons e-expand', tooltipText: 'Expand/Collapse',
      cssClass: ' e-btn',
      click: this.toolbarClicked.bind(this),
    });

  }


  toolbarClickedOld(args: any) {
    // //console.log('toolbarclikc', args)
    this.pivotview!.dataSourceSettings.expandAll = !this.pivotview!.dataSourceSettings.expandAll;
  }







  queryCell(args: any): void {
    (this.pivotview.renderModule as any).rowCellBoundEvent(args);

    if (args.data[0].valueSort && args.cell.classList.contains('e-rowsheader') && args.cell.classList.contains('e-gtot') && args.cell.classList.contains('e-rowcell')) {

      args.cell.querySelector('.e-cellvalue').innerText = "Total";

    }

    //  args.cell.style.textAlign = "right"



    // // if( args.cell.classList.contains('e-headercelldiv')){
    // //  args.cell.style.textAlign = "center"

    // // }
    if (args.cell.classList.contains('e-rowsheader') && args.cell.classList.contains('e-rowcell')) {


      args.cell.style.textAlign = "left"

    }
  }


  queryCellHeaderINfo(args: any): void {
    // //console.log('args in querycell info', args.node)

    if (args.node.innerText == 'Grand Total') {
      args.node.innerText = 'Total'

    }

    //   if (args.node) {
    //     args.node.style.textAlign = 'center'; // Centers the text

    // }


  }

  secondsToHms1(totalSeconds: number): string {

    if (isNaN(totalSeconds) || totalSeconds == null) {
      return '00:00:00';  // or return '--:--:--' if you prefer
    }

    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = Math.floor(totalSeconds % 60);

    return (
      ('0' + h).slice(-2) + ':' +
      ('0' + m).slice(-2) + ':' +
      ('0' + s).slice(-2)
    );
  }

  secondsToHms(totalSeconds: number): string {
    if (isNaN(totalSeconds) || totalSeconds == null) {
      return '00:00:00';
    }

    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = Math.floor(totalSeconds % 60);

    return (
      h + ':' +
      ('0' + m).slice(-2) + ':' +
      ('0' + s).slice(-2)
    );
  }


  processTimeFieldsInCellSets(args: any, timeFields: string[]) {
    let total = 0;

    args.cellSets.forEach((ele: any) => {
      timeFields.forEach((field: string) => {
        const timeStr = ele[field];

        if (typeof timeStr === 'string' && timeStr.includes(':')) {
          const [h, m, s] = timeStr.split(':').map(Number);

          if (!isNaN(h) && !isNaN(m) && !isNaN(s)) {
            const seconds = h * 3600 + m * 60 + s;
            ele[field] = seconds;
            total += seconds;
          } else {
            ele[field] = 0;
          }
        }
      });
    });

    if (timeFields.includes(args.fieldName) && typeof args.value === 'number' && !isNaN(args.value)) {
      args.value = this.secondsToHms(args.value);
    }

    //console.log('total')
    return total; // return total seconds if needed
  }

  onPivotDataBound(eve: any) {
    //console.log('eve in databound pivot', eve)
  }
  grandTotalAvgValue: number = 0


  aggregateCellInfo22(args: any, pivotviewObj: PivotViewComponent, item: any) {

    let targetPivot = this.pivotviews.filter((pv) => pv.element.id === pivotviewObj.element.id);
    let matchTable = targetPivot[0] ? pivotviewObj : targetPivot[0];
    if (!matchTable) {
      return;
    }
    matchTable.grid.headerCellInfo = this.queryCellHeaderINfo.bind(this);

    const timeFields = item.content.fieldDetails.filter(
      (f: any) => f.formatType === 'string' && f.name
    ).map((f: { name: any; }) => f.name);

    if (timeFields.includes(args.fieldName)) {
      args.value = this.secondsToHms(args.value);
    }

    if (item.content.showGrandAvg) {

      const fieldName = args.fieldName;
      const grandTotalValue = args.value;
      args.skipFormatting = true;

      let conditionalFOrmattingArray = item.content.dataSourceSettings.conditionalFormatSettings;
      let columns = item.content.dataSourceSettings.columns.map((col: any) => col.name);
      let rows = item.content.dataSourceSettings.rows.map((row: any) => row.name);
      let values = item.content.dataSourceSettings.values.map((row: any) => row.name);

      const rowaxis = args.row.valueSort.axis;
      const colaxis = args.column.valueSort.axis;

      if (args.rowCellType === 'grandTotal' || args.columnCellType === 'grandTotal') {

        if (item.content.grandTotalAverageType == "AverageWithZero") {
          let nonMatchingKey: any = Object.keys(args.cellSets[0]).find(key =>
            key !== rowaxis && key !== colaxis && key !== 'index' && key !== fieldName && !(values.includes(key))
          );

          const distinctObjects = args.cellSets.reduce((acc: any[], cur: { [x: string]: any; }) => {
            const key = cur[nonMatchingKey];
            if (!acc.some((obj: { [x: string]: any; }) => obj[nonMatchingKey] === key)) {
              acc.push(cur);
            }
            return acc;
          }, []);

          const distinctObjectsCount = distinctObjects.length;
          let averageCount: any = distinctObjectsCount > 0 ? (grandTotalValue / distinctObjectsCount).toFixed(2) : 0;

          const fieldDetail = item.content.fieldDetails.find((f: any) => f.name === args.fieldName);
          const format = fieldDetail.format;
          if (format) {
            args.value = `${averageCount}`; // numeric value for conditional formatting
            args.displayText = `${averageCount.toFixed(2)}%`; // formatted display

          } else {
            args.value = averageCount;
            args.displayText = averageCount;
          }

          args.averageCount = averageCount;
          // this.grandTotalAvgValue = averageCount;
          args.skipFormatting = false;


        } else if (item.content.grandTotalAverageType == "AverageWithoutZero") {
          let nonMatchingKey: any = Object.keys(args.cellSets[0]).find(key =>
            key !== rowaxis && key !== colaxis && key !== 'index' && key !== fieldName && !(values.includes(key))
          );

          const distinctObjects = args.cellSets
            .filter((item: any) => item[fieldName] !== 0)
            .reduce((acc: any[], cur: { [x: string]: any; }) => {
              const key = cur[nonMatchingKey];
              if (!acc.some((obj: { [x: string]: any; }) => obj[nonMatchingKey] === key)) {
                acc.push(cur);
              }
              return acc;
            }, []);

          const distinctObjectsCount = distinctObjects.length;
          let averageCount: any = grandTotalValue / distinctObjectsCount ? (grandTotalValue / distinctObjectsCount).toFixed(2) : 0
          const fieldDetail = item.content.fieldDetails.find((f: any) => f.name === args.fieldName);
          const format = fieldDetail.format;
          if (format) {
            //  args.value =`${averageCount}%`; // numeric value for conditional formatting
            args.value = `${averageCount}`; // numeric value for conditional formatting
            args.displayText = `${averageCount.toFixed(2)}%`; // formatted display

          } else {
            args.value = averageCount;
            args.displayText = averageCount;
          }

          args.averageCount = averageCount;
          // this.grandTotalAvgValue = averageCount;
          args.skipFormatting = false;



        }

        else {

          let skillSetDatasource = item.content.dataSourceSettings.dataSource;
          console.log(
            'args in grand total else  total', item.id, args
          )

          if (args.rowCellType === 'grandTotal' && args.columnCellType === 'grandTotal') {
            console.log('args in grand total', item.id, args);

            let nonMatchingKey: any;


            if (args.rowCellType === 'grandTotal' && args.columnCellType === 'grandTotal') {
              nonMatchingKey = Object.keys(skillSetDatasource[0]).find(key =>
                key !== colaxis && key !== 'index' && key !== fieldName && !(values.includes(key))
              );
            } else if (args.rowCellType === 'grandTotal') {
              nonMatchingKey = Object.keys(skillSetDatasource[0]).find(key =>
                key !== colaxis && key !== 'index' && key !== fieldName && !(values.includes(key))
              );
            } else if (args.columnCellType === 'grandTotal') {
              nonMatchingKey = Object.keys(skillSetDatasource[0]).find(key =>
                key !== rowaxis && key !== 'index' && key !== fieldName && !(values.includes(key))
              );
            }

            const distinctObjects = skillSetDatasource
              .filter((item: any) => item)
              .reduce((acc: any[], cur: { [x: string]: any }) => {
                const key = cur[nonMatchingKey];
                if (!acc.some((obj: { [x: string]: any }) => obj[nonMatchingKey] === key)) {
                  acc.push(cur);
                }
                return acc;
              }, []);

            const distinctObjectsCount = distinctObjects.length || 1;

            const fieldDetail = item.content.fieldDetails.find((f: any) => f.name === args.fieldName);
            const format = fieldDetail?.format;

            const isPercentFormat =
              format === 'P' ||
              format === "###0.00 '%'" ||
              format === "###0 '%'" ||
              format === "###0.0 '%'";

            let displayValue: any;

            if (isPercentFormat) {
              displayValue = grandTotalValue / distinctObjectsCount;
              args.value = displayValue;
              args.displayText = `${displayValue.toFixed(2)}%`;
            } else {
              displayValue = grandTotalValue;
              args.value = displayValue;
              args.displayText = `${displayValue.toFixed(2)}`;
            }

            args.averageCount = displayValue;
            args.skipFormatting = false;
          }

          else if (args.rowCellType === 'grandTotal' && args.columnCellType === 'value') {

            console.log(
              'args in grand total column total', item.id, args
            )
            let nonMatchingKey: any = Object.keys(skillSetDatasource[0]).find(key =>
              key !== colaxis && key !== 'index' && key !== fieldName && !(values.includes(key))
            );
            const distinctObjects = skillSetDatasource
              .filter((item: any) => item)
              .reduce((acc: any[], cur: { [x: string]: any; }) => {
                const key = cur[nonMatchingKey];
                if (!acc.some((obj: { [x: string]: any; }) => obj[nonMatchingKey] === key)) {
                  acc.push(cur);
                }
                return acc;
              }, []);

            const distinctObjectsCount = distinctObjects.length;
            let averageCount: any = grandTotalValue / distinctObjectsCount ? (grandTotalValue / distinctObjectsCount).toFixed(2) : 0
            // args.value = `sum : ${grandTotalValue} - Avg :  ${averageCount}`;
            args.value = grandTotalValue;
            args.averageCount = null;
            // this.grandTotalAvgValue = averageCount;
          }

          else if (args.columnCellType === 'grandTotal' && (args.rowCellType === 'value' || args.rowCellType === 'subTotal')) {
            // console.log('args', args)

            console.log(
              'args in grand total RowCellType total', item.id, args
            )


            const fieldDetail = item.content.fieldDetails.find((f: any) => f.name === args.fieldName);
            const format = fieldDetail.format;
            const isPercentFormat = format == 'P' ||
              format == "###0.00 '%'" || format == "###0 '%'" || format == "###0.0 '%'";
            // console.log('args.value', args.value, typeof(args.value))

            if (args.rowCellType === 'subTotal' || (args.row && args.row.hasChild)) {

              const grandTotalValue = Number(args.value); // ensure numeric
              const totalCellCount = args.cellSets?.length || 0;
              let averageCount: any = 0;

              // Safely parse numeric value
              let rawValue = parseFloat(args.rawItems?.[0]?.[args.fieldName] || args.value);
              if (isNaN(rawValue)) rawValue = 0;


              if (totalCellCount > 0 && !isNaN(rawValue)) {
                averageCount = rawValue / totalCellCount;
              }
              args.actualValue = averageCount;
              args.averageCount = averageCount;
              args.skipFormatting = false;

              const fieldDetail = item.content.fieldDetails.find(
                (f: any) => f.name === args.fieldName
              );

              if (isPercentFormat) {
                args.value = averageCount; // numeric value for conditional formatting
                args.displayText = `${averageCount.toFixed(2)}%`; // formatted display
                // console.log('args.displayText..........', args.displayText, args.value);
              } else {
                // args.value = averageCount;
                // args.displayText = averageCount.toFixed(2);

                args.value = rawValue;
                args.displayText = rawValue;
              }
            } else {
              const grandTotalValue = Number(args.value);
              let rawValue1 = parseFloat(args.rawItems?.[0]?.[args.fieldName] || args.value);

              args.actualValue = rawValue1;
              args.skipFormatting = false;

              if (isPercentFormat) {
                args.value = rawValue1;
                args.displayText = `${rawValue1.toFixed(2)}%`;
                // console.log('args.displayText..........', args.displayText, args.value)

              } else {
                args.value = rawValue1;
                args.displayText = `${rawValue1.toFixed(2)}`;
              }
            }
          }
        }
      }
    }

    // if (item.content.showGrandTotals) {
    //   if (args.rowCellType === 'grandTotal' && args.columnCellType === 'grandTotal') {
    //     let value = Number(args.value);
    //     args.value = value.toFixed(2);
    //     args.displayText = value.toFixed(2);  // Show just number
    //     args.skipFormatting = true;           // prevent Syncfusion reformatting
    //   }
    // }

  }


  aggregateCellInfo(args: any, pivotviewObj: PivotViewComponent, item: any) {

    let targetPivot = this.pivotviews.filter((pv) => pv.element.id === pivotviewObj.element.id);
    let matchTable = targetPivot[0] ? pivotviewObj : targetPivot[0];
    if (!matchTable) {
      return;
    }
    matchTable.grid.headerCellInfo = this.queryCellHeaderINfo.bind(this);

    // ── STRING VALUE FIELD OVERRIDE ──────────────────────────────────────────
    const fieldDetails = item?.content?.fieldDetails || [];

    const stringValueFields: string[] = fieldDetails
      .filter((f: any) => {
        const fType = f.feildType || f.fieldType;
        const dType = f.dataType;
        return fType === 'Value' && dType === 'string';
      })
      .map((f: any) => f.name);

    if (stringValueFields.includes(args.fieldName)) {
      const rawItems = args.rawItems || args.cellSets;

      if (Array.isArray(rawItems) && rawItems.length > 0) {
        if (rawItems.length > 1) {
          const uniqueValues = [...new Set(
            rawItems
              .map((row: any) => row[args.fieldName])
              .filter((v: any) => v !== null && v !== undefined && v !== '')
          )];
          args.value = uniqueValues.join(', ');
          args.displayText = uniqueValues.join(', ');
        } else {
          const rawValue = rawItems[0][args.fieldName];
          args.value = rawValue !== null && rawValue !== undefined ? String(rawValue) : '';
          args.displayText = args.value;
        }
      } else {
        args.value = '';
        args.displayText = '';
      }
      args.skipFormatting = true;
      return;
    }
    // ── END STRING VALUE FIELD OVERRIDE ──────────────────────────────────────
    const timeFields = item.content.fieldDetails.filter(
      (f: any) => f.formatType === 'string' && f.name
    ).map((f: { name: any; }) => f.name);

    if (timeFields.includes(args.fieldName)) {
      args.value = this.secondsToHms(args.value);
    }

    if (item.content.showGrandAvg) {

      const fieldName = args.fieldName;
      const grandTotalValue = args.value;
      args.skipFormatting = true;

      let conditionalFOrmattingArray = item.content.dataSourceSettings.conditionalFormatSettings;
      let columns = item.content.dataSourceSettings.columns.map((col: any) => col.name);
      let rows = item.content.dataSourceSettings.rows.map((row: any) => row.name);
      let values = item.content.dataSourceSettings.values.map((row: any) => row.name);

      const rowaxis = args.row.valueSort.axis;
      const colaxis = args.column.valueSort.axis;

      if (args.rowCellType === 'grandTotal' || args.columnCellType === 'grandTotal') {

        if (item.content.grandTotalAverageType == "AverageWithZero") {
          let nonMatchingKey: any = Object.keys(args.cellSets[0]).find(key =>
            key !== rowaxis && key !== colaxis && key !== 'index' && key !== fieldName && !(values.includes(key))
          );

          const distinctObjects = args.cellSets.reduce((acc: any[], cur: { [x: string]: any; }) => {
            const key = cur[nonMatchingKey];
            if (!acc.some((obj: { [x: string]: any; }) => obj[nonMatchingKey] === key)) {
              acc.push(cur);
            }
            return acc;
          }, []);

          const distinctObjectsCount = distinctObjects.length;
          let averageCount: any = distinctObjectsCount > 0 ? (grandTotalValue / distinctObjectsCount).toFixed(2) : 0;

          const fieldDetail = item.content.fieldDetails.find((f: any) => f.name === args.fieldName);
          const format = fieldDetail.format;
          if (format) {
            args.value = `${averageCount}`; // numeric value for conditional formatting
            args.displayText = `${averageCount.toFixed(2)}%`; // formatted display

          } else {
            args.value = averageCount;
            args.displayText = averageCount;
          }

          args.averageCount = averageCount;
          // this.grandTotalAvgValue = averageCount;
          args.skipFormatting = false;


        } else if (item.content.grandTotalAverageType == "AverageWithoutZero") {
          let nonMatchingKey: any = Object.keys(args.cellSets[0]).find(key =>
            key !== rowaxis && key !== colaxis && key !== 'index' && key !== fieldName && !(values.includes(key))
          );

          const distinctObjects = args.cellSets
            .filter((item: any) => item[fieldName] !== 0)
            .reduce((acc: any[], cur: { [x: string]: any; }) => {
              const key = cur[nonMatchingKey];
              if (!acc.some((obj: { [x: string]: any; }) => obj[nonMatchingKey] === key)) {
                acc.push(cur);
              }
              return acc;
            }, []);

          const distinctObjectsCount = distinctObjects.length;
          let averageCount: any = grandTotalValue / distinctObjectsCount ? (grandTotalValue / distinctObjectsCount).toFixed(2) : 0
          const fieldDetail = item.content.fieldDetails.find((f: any) => f.name === args.fieldName);
          const format = fieldDetail.format;
          if (format) {
            //  args.value =`${averageCount}%`; // numeric value for conditional formatting
            args.value = `${averageCount}`; // numeric value for conditional formatting
            args.displayText = `${averageCount.toFixed(2)}%`; // formatted display

          } else {
            args.value = averageCount;
            args.displayText = averageCount;
          }

          args.averageCount = averageCount;
          // this.grandTotalAvgValue = averageCount;
          args.skipFormatting = false;
        }

        else {

          let skillSetDatasource = item.content.dataSourceSettings.dataSource;
          // console.log(
          //   'args in grand total else  total', item.id, args
          // )
          if (args.rowCellType === 'grandTotal' && args.columnCellType === 'grandTotal') {
            // console.log('args in grand total', item.id, args);
            let nonMatchingKey: any;

            if (args.rowCellType === 'grandTotal' && args.columnCellType === 'grandTotal') {
              nonMatchingKey = Object.keys(skillSetDatasource[0]).find(key =>
                key !== colaxis && key !== 'index' && key !== fieldName && !(values.includes(key))
              );
            } else if (args.rowCellType === 'grandTotal') {
              nonMatchingKey = Object.keys(skillSetDatasource[0]).find(key =>
                key !== colaxis && key !== 'index' && key !== fieldName && !(values.includes(key))
              );
            } else if (args.columnCellType === 'grandTotal') {
              nonMatchingKey = Object.keys(skillSetDatasource[0]).find(key =>
                key !== rowaxis && key !== 'index' && key !== fieldName && !(values.includes(key))
              );
            }

            const distinctObjects = skillSetDatasource
              .filter((item: any) => item)
              .reduce((acc: any[], cur: { [x: string]: any }) => {
                const key = cur[nonMatchingKey];
                if (!acc.some((obj: { [x: string]: any }) => obj[nonMatchingKey] === key)) {
                  acc.push(cur);
                }
                return acc;
              }, []);

            const distinctObjectsCount = distinctObjects.length || 1;
            const fieldDetail = item.content.fieldDetails.find((f: any) => f.name === args.fieldName);
            const format = fieldDetail?.format;

            const isPercentFormat =
              format === 'P' ||
              format === "###0.00 '%'" ||
              format === "###0 '%'" ||
              format === "###0.0 '%'";

            let displayValue: any;

            if (isPercentFormat) {
              displayValue = grandTotalValue / distinctObjectsCount;
              args.value = displayValue;
              args.displayText = `${displayValue.toFixed(2)}%`;
            } else {
              displayValue = grandTotalValue;
              args.value = displayValue;
              args.displayText = `${displayValue.toFixed(2)}`;
            }
            args.averageCount = displayValue;
            args.skipFormatting = false;
          }

          else if (args.rowCellType === 'grandTotal' && args.columnCellType === 'value') {

            // console.log(
            //   'args in grand total column total', item.id, args
            // )
            let nonMatchingKey: any = Object.keys(skillSetDatasource[0]).find(key =>
              key !== colaxis && key !== 'index' && key !== fieldName && !(values.includes(key))
            );
            const distinctObjects = skillSetDatasource
              .filter((item: any) => item)
              .reduce((acc: any[], cur: { [x: string]: any; }) => {
                const key = cur[nonMatchingKey];
                if (!acc.some((obj: { [x: string]: any; }) => obj[nonMatchingKey] === key)) {
                  acc.push(cur);
                }
                return acc;
              }, []);

            const distinctObjectsCount = distinctObjects.length;
            let averageCount: any = grandTotalValue / distinctObjectsCount ? (grandTotalValue / distinctObjectsCount).toFixed(2) : 0
            // args.value = `sum : ${grandTotalValue} - Avg :  ${averageCount}`;
            args.value = grandTotalValue;
            args.averageCount = null;
            // this.grandTotalAvgValue = averageCount;
          }

          else if (args.columnCellType === 'grandTotal' && (args.rowCellType === 'value' || args.rowCellType === 'subTotal')) {
            // console.log('args', args)

            if (!args.value && args.value !== 0) return;

            // console.log('args in grand total RowCellType total', item.id, args )
            const fieldDetail = item.content.fieldDetails.find((f: any) => f.name === args.fieldName);
            const format = fieldDetail.format;
            const isPercentFormat = format == 'P' ||
              format == "###0.00 '%'" || format == "###0 '%'" || format == "###0.0 '%'";
            // console.log('args.value', args.value, typeof(args.value))

            if (args.rowCellType === 'subTotal' || (args.row && args.row.hasChild)) {

              const grandTotalValue = Number(args.value); // ensure numeric
              const totalCellCount = args.cellSets?.length || 0;
              let averageCount: any = 0;



              // Safely parse numeric value
              let rawValue = parseFloat(args.rawItems?.[0]?.[args.fieldName] || args.value);
              if (isNaN(rawValue)) rawValue = 0;
              if (totalCellCount > 0 && !isNaN(rawValue)) {
                averageCount = rawValue / totalCellCount;
              }
              args.actualValue = averageCount;
              args.averageCount = averageCount;
              args.skipFormatting = false;

              const fieldDetail = item.content.fieldDetails.find(
                (f: any) => f.name === args.fieldName
              );

              // console.log('..................value is null or not RowCellType', rawValue, args.value)

              if (isPercentFormat) {
                args.value = averageCount; // numeric value for conditional formatting
                args.displayText = `${averageCount.toFixed(2)}%`; // formatted display
              } else {

                args.value = rawValue;
                args.displayText = rawValue;

              }
            } else {
              const grandTotalValue = Number(args.value);

              // if (!args.value && args.value !== 0) return;

              let rawValue1 = parseFloat(args.rawItems?.[0]?.[args.fieldName] || args.value);

              // console.log('..................value is null or not else condition', rawValue1, args.value)


              args.actualValue = rawValue1;
              args.skipFormatting = false;

              if (isPercentFormat) {
                args.value = rawValue1;
                args.displayText = `${rawValue1.toFixed(2)}%`;

              } else {
                args.value = rawValue1;
                args.displayText = `${rawValue1.toFixed(2)}`;
              }
            }
          }
        }
      }
    }

    // if (item.content.showGrandTotals) {
    //   if (args.rowCellType === 'grandTotal' && args.columnCellType === 'grandTotal') {
    //     let value = Number(args.value);
    //     args.value = value.toFixed(2);
    //     args.displayText = value.toFixed(2);  // Show just number
    //     args.skipFormatting = true;           // prevent Syncfusion reformatting
    //   }
    // }

  }



  alignHeadersRecursively(columns: any[]): void {
    columns.forEach(column => {
      column.textAlign = 'Center'; // Align column headers to the center
      column.headerTextAlign = 'Center';
    });


  }

  onEnginePopulated(args: EnginePopulatedEventArgs, item: any) {
    // console.log()
    if (args.pivotValues) {
      args.pivotValues.forEach((row) => {
        // // //console.log('row', row)
        row.forEach((cell) => {
          if (cell) {
            let valuesArray = item.content.fieldDetails;

            valuesArray.forEach((ele: any) => {

              if (item.content.rawQuery) {
                if (cell.actualText == ele.caption || cell.actualText == ele.name) {
                  if (cell.axis === 'value' && ele.valueFormat && cell.value != undefined) {

                    cell.formattedText = `${cell.value}%`;

                  }
                }
              } else {
                if (cell.actualText == ele.name) {
                  if (cell.axis === 'value' && ele.valueFormat && cell.value != undefined) {
                    cell.formattedText = `${cell.value}%`;

                  }
                }
              }

            })
          }
        });
      });
    }
    // }
    if (item?.content?.headerFormatting && Array.isArray(item.content.headerFormatting)) {
      // Use setTimeout to ensure DOM is fully ready
      setTimeout(() => {
        const pivotViewInstance = this.pivotviews.find((pv) => pv.element.id === item.id);
        if (pivotViewInstance) {
          this.applyPivotHeaderFormattingDOM(pivotViewInstance, item);
        }
      }, 500); // Increase timeout to ensure DOM is ready
    }

  }


  onPivotLoad(eve: any, item: any) {
    // //console.log('eve in load of piovt', eve, item)
    // if(item.content.enableHeaderAlignment){

    //     this.pivotGridSettings = {
    //       columnWidth: 160,
    //       columnRender: this.observable.subscribe((args: any) => {

    //           if(item.content.fieldHeaders == "Center"){
    //             this.alignHeadersRecursively(args.stackedColumns, 'Center');

    //           }
    //           else if(item.content.fieldHeaders == "Right"){
    //             this.alignHeadersRecursively(args.stackedColumns, 'Right');

    //           }else {
    //             this.alignHeadersRecursively(args.stackedColumns, 'Left');

    //           }

    //           if ((args as any).stackedColumns[0]) {
    //               (args as any).stackedColumns[0].textAlign = 'Left';
    //           }


    //       }) as any


    //   } as GridSettings;
    //   }else{
    //           this.pivotGridSettings = {
    //       rowHeight: 50,
    //       columnWidth: 150

    //     } as GridSettings;
    //   }
  }

  onPivotActionBegin(eve: any, item: any) {
    // //console.log('enginePopulated action', eve, item);

    const pivotValues = eve.pivotValues;

    // //console.log('pivotValues', pivotValues)

    let conditionArr = item.content.dataSourceSettings.conditionalFormatSettings;
    conditionArr.length = 0;

    let formatNumber = (num: number, decimalPlaces: number = 2) => {
      return parseFloat(num.toFixed(decimalPlaces));
    };
    let columnHeader = '';

    pivotValues.forEach((row: any[], rowIndex: number) => {
      row.forEach((cell: any, colIndex: number) => {
        if (colIndex == 0) {
          // // //console.log(`COlumn Header at [${rowIndex}, ${colIndex}]:`, cell.formattedText);
          columnHeader = cell.formattedText;
        }

        if (colIndex == 1) {
          // ////console.log(`Row Header at [${rowIndex}, ${colIndex}]:`, cell.formattedText);
          const inputString = cell.formattedText;

          if (inputString != "Grand Total") {
            // Split the string and extract values
            const parts = inputString.split(' - ');      // Step 1: Split by ' - '
            const sumValue = parts[0].split(':')[1].trim();  // Step 2: Extract and trim Sum value
            const avgValue = parts[1].split(':')[1].trim();  // Step 2: Extract and trim Avg value

            // Output the values
            // // //console.log('Avg:', avgValue);  // Avg: 0.00
            const numericAvgValue = parseFloat(avgValue);

            const cellAvgValue = formatNumber(numericAvgValue);
            // If cell value is less than the grand total, apply red background
            conditionArr.push({
              measure: 'Enquiry',
              value1: cellAvgValue,
              conditions: 'LessThan',
              label: columnHeader,
              style: {
                "backgroundColor": "#de441e",
                "color": "#022c02",
                "fontSize": "10px",
                "fontFamily": "Tahoma"
              },
              // label: row[0].formattedText // Use the row label for targeting the correct row
            });

          }
        }


      });
    });

    item.content.dataSourceSettings.conditionalFormatSettings = conditionArr
    // //console.log('conditionArr', conditionArr)





  }


  pivotdataBound(args: any) {
    // //console.log('args in pivot table headerCellInfo', args)

  }
  applyFormatold(value: any, format: any) {
    // // //console.log(value,format )
    switch (format) {
      case 'currency-usd':
        value = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
        break;
      case 'currency-inr':
        value = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value);
        break;
      case 'percent':
        value = new Intl.NumberFormat('en-US', { style: 'percent', maximumFractionDigits: 2 }).format(value / 1000000);
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
        // // //console.log('value', value)
        value = (Math.round(value * 1000) / 1000).toFixed(3);

        break;
      default:
        value = value;
    }
    return value;
  }
  applyFormat(value: any, format: any) {
    switch (format) {
      case 'currency-usd':
        value = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
        break;
      case 'currency-inr':
        value = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value);
        break;
      case 'percent':

        // if (value > 1) {
        //   // Value is already a percentage
        //   value = `${value}%`;
        // } else {
        //   // Value is a decimal, format it as percentage
        //   value = new Intl.NumberFormat('en-US', { style: 'percent', maximumFractionDigits: 2 }).format(value);
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

  tooltipRender1(args: IAccTooltipRenderEventArgs, tooltipFormat: any, item: any): void {
    let value = args.point.y / args.series.sumOfPoints * 100;
    //console.log('tooltip render', args)
    // //console.log('tooltip render', args.point.x, value, args.point.y, tooltipFormat)

    if (tooltipFormat == 'Percentage') {
      args["text"] = args.point.x + ' : ' + Math.ceil(value) + '' + '%';

    } else {
      // args["text"] = args.point.x + ' : ' + args.point.y;
      const formattedTime = this.formatSecondsToHHMMSS(args.point.y);
      // //console.log('formattedTime' , formattedTime)
      args["text"] = args.point.x + ' : ' + formattedTime;
    }
  };

  tooltipRender(args: IAccTooltipRenderEventArgs | any, tooltipFormat: any, item: any): void {
    args.headerText = `${args.point.x}`;
    let value = args.series.sumOfPoints > 0 ? (args.point.y / args.series.sumOfPoints * 100) : 0;
    let textName = args.data.seriesName;

    if (tooltipFormat == 'Percentage') {
      args["text"] = textName + ' : ' + Math.ceil(value) + '%';
    } else {
      const headerText = args.headerText;
      const yValue = args.point?.y;

      if (!item?.content?.dataSource?.length) return;

      // Check for time format using a sample from dataSource if available
      const dataSample = item.content.dataSource[0];
      const originalValue = dataSample[headerText] ?? dataSample[textName];
      const isTimeFormat = typeof originalValue === 'string' && originalValue.includes(':');

      if (isTimeFormat && typeof yValue === 'number') {
        args.text = `${textName} : ${this.formatSecondsToHHMMSS(yValue)}`;
      } else {
        args.text = `${textName} : ${yValue}`;
      }
    }
  };


  getDashboardDetails(dashboard_id: any) {
    const backdrop = document.getElementById('backdrop');
    this.chartService.getDashboardDataByIdWithoutData(dashboard_id).subscribe(
      (res: any) => {
        // //console.log(res);
        // if (backdrop) {
        //   backdrop.style.display = 'none';
        // }
        // this.loaderFlag = false;
        this.loaderService.hide()
        let resObj = res['data'];
        //console.log('res in edit page without data', res)


        let data = resObj.dashboard_setup;

        this.dashboardName = resObj.dashboard_name;
        this.dashboardDescription = resObj.description;
        this.dashboardCreationObj = data.dashboardObj;
        this.groupNameList = resObj.group_name;

        // //console.log('this.groupNameList', this.groupNameList, data)

        this.sendMappingObj = this.dashboardCreationObj.roleMapping;
        this.roleMappingObj = this.dashboardCreationObj.roleMapping;
        // localStorage.setItem('mappingObj', JSON.stringify(this.sendMappingObj));
        sessionStorage.setItem('mappingObj', JSON.stringify(this.sendMappingObj));


        if (this.dashboardCreationObj.connection_id == 0) {
          this.connectionNameFromApi = 'internal';
          this.connection_id = 0

          let obj = {
            "connectionName": 'internal',
            "connection_Id": 0,
            "databaseName": ''
          }
          // localStorage.setItem("connectionIdObj", JSON.stringify(obj))
          sessionStorage.setItem("connectionIdObj", JSON.stringify(obj))

        } else {

          // // //console.log(this.dashboardCreationObj.connection_Name)

          if (this.dashboardCreationObj.connection_Name) {
            this.connectionNameFromApi = this.dashboardCreationObj.connection_Name;
            this.connection_id = this.dashboardCreationObj.connection_id;

            let obj = {
              "connectionName": this.dashboardCreationObj.connection_Name,
              "connection_Id": this.dashboardCreationObj.connection_id,
              "databaseName": ""
            }
            // localStorage.setItem("connectionIdObj", JSON.stringify(obj))
            sessionStorage.setItem("connectionIdObj", JSON.stringify(obj))
          } else {
            this.chartService.getDbConnectionDetailById(this.dashboardCreationObj.connection_id).subscribe((res: any) => {
              let data = res['data'];

              // //   //console.log('data', data)               
              this.connectionNameFromApi = data.connection_name;
              this.connection_id = this.dashboardCreationObj.connection_id;

              let obj = {
                "connectionName": data.connection_name,
                "connection_Id": data.connection_id,
                "databaseName": data.default_database_name
              }
              // localStorage.setItem("connectionIdObj", JSON.stringify(obj))
              sessionStorage.setItem("connectionIdObj", JSON.stringify(obj))

            })
          }



        }


        const apiTitle = resObj.dashboard_name; // Replace with the actual title from your API
        this.chartService.setTitle(apiTitle);
        this.dashboardTitleForm.patchValue({
          title: resObj.dashboard_name,
          description: resObj.description,
          specific_cache_exp: resObj.specific_cache_exp,
          auto_refresh: resObj.auto_refresh,
          version: resObj.version,
          is_active: resObj.is_active,
          group_name: resObj.group_name,


          // dashboard_image : resObj.image_name
        })
        this.imageName = resObj.image_name
        this.imageUrl = resObj.dashboard_image
        this.panelSeriesArray = this.dashboardCreationObj.panels;
        this.panelsArrayFromApi = this.dashboardCreationObj.panels;

        this.sendfilterObj = this.dashboardCreationObj.initialFilterObj
        sessionStorage.setItem('initialFilters', JSON.stringify(this.sendfilterObj))
        // localStorage.setItem('initialFilters', JSON.stringify(this.sendfilterObj))

        if (this.panelSeriesArray) {
          hideSpinner((document as any).getElementById('container'))
        }
        this.changeDetectorRef.markForCheck();
        // //console.log('edit panels', this.panelSeriesArray);
        let modifiedArr = this.panelsArrayFromApi.map((res: any) => {
          // ////console.log(res )
          if (res.panelType === 'Chart') {
            let seriesArray = res.content.measure.map((ele: any) => {
              let obj: any = {
                xName: res.content.dimension.levels[0].fieldName,
                yName: ele.fieldName,
                type: ele.seriesType,
                dataSource: res.content.dataSource,
                fill: ele.seriesColor,
                name: ele.labelName,
                expression: ele.expression,
                opposedPosition: ele.opposedPosition,
                // yAxisName:  ele.opposedPosition == true ? ''yAxis'' : "",
              };

              if (ele.opposedPosition == true) {
                obj = {
                  ...obj,
                  yAxisName: 'yAxis'
                };
              }
              if (ele.seriesType == 'Pie' || ele.seriesType == 'Donut') {
                obj = {
                  ...obj,
                  marker: ele.marker,
                  dataLabel: ele.dataLabel,
                };
              } else {
                obj = {
                  ...obj,
                  marker: {
                    visible: ele.marker.visible,
                    dataLabel: ele.dataLabel,
                  },
                };
              }
              let seriesValueType = obj.xName instanceof Date ? 'DateTime' : 'Category';
              if (obj.dataLabel && obj.dataLabel.position && obj.dataLabel.position === 'Outer' && !obj.radius) {
                console.error('Invalid data labels configuration for series:', obj);
                // You may choose to update the configuration or handle the error appropriately
              }

              return obj;
            });

            const chartObj = {
              ...res,
              content: {
                ...res.content,
                series: seriesArray,
              },
            };

            return chartObj;
          }
          else if (res.panelType === 'Box') {
            // Your custom code for 'Box' panel type
            // //console.log('box', res.content);

            let resData = res.content;
            let processDataSource = (dataSource: any[], rawQuery: string, fieldDetails: any[]): any[] => {
              // //console.log('res', dataSource, fieldDetails);

              let modifiedData = dataSource.map((ele: any) => {
                const key = Object.keys(ele)[0];
                let value = ele[key];

                fieldDetails.forEach((obj: any) => {
                  // //console.log('obj.fieldName', obj.fieldName, 'ele.index', ele.index);

                  // Add null/undefined checks
                  if (obj.fieldName && ele.index && obj.fieldName.toLowerCase() === ele.index.toLowerCase()) {
                    value = this.applyFormat(value, obj.valueFormat);
                  }
                });

                // //console.log('value in if condition', value);

                const processedItem: any = {
                  "0": value, // Apply formatted value here
                  "index": ele.index || null, // Handle missing index
                };

                return processedItem;
              });

              // //console.log('modifiedData in if condition', modifiedData);

              return modifiedData;


            };
            const chartObj = {
              ...res,
              connection_id: this.dashboardCreationObj.connection_id,
              content: {
                ...res.content,
                // dataSource: processDataSource(resData.dataSource, resData.rawQuery, resData.fieldDetails),

              },
            };

            chartObj.content.dataSource = chartObj.content.dataSource.map((item: any) => {
              let updatedItem = { ...item }; // Clone the object to prevent mutation

              // Iterate through fieldDetails and match fieldName with keys in dataSource object
              chartObj.content.fieldDetails.forEach((field: any) => {
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


            return chartObj;
          }
          else if (res.panelType === "Table") {




            let fieldDetails = res.content.matchedFieldDetails ? res.content.matchedFieldDetails : res.content.fieldDetails;

            const matchedFields =
              res.content.dataSource && res.content.dataSource.length > 0
                ? res.content.matchedFieldDetails?.filter((field: any) =>
                  Object.keys(res.content.dataSource[0]).includes(field.field)
                )
                : fieldDetails; // If dataSource is empty or undefined, use fieldDetails



            const updatedContent = {
              ...res.content, // Spread the existing content
              fieldDetails: matchedFields, // Update fieldDetails
            };



            const nonChartObj = {
              connection_id: this.dashboardCreationObj.connection_id,
              ...res, // Spread the rest of the response
              content: updatedContent,

            };



            return nonChartObj;



          }
          else if (res.panelType === 'Pivot') {

            //console.log('res in pivot table', res)

            let total = 0;

            // Get fields where formatType is 'string' and intended for transformation
            const timeFields = res.content.fieldDetails.filter(
              (f: any) => f.formatType === 'string' && f.name
            ).map((f: any) => f.name);

            const data = res.content.dataSourceSettings.dataSource.map((row: any) => {
              const updatedRow = { ...row };

              timeFields.forEach((field: string | number) => {
                const timeStr = row[field];

                if (typeof timeStr === 'string' && timeStr.includes(':')) {
                  const [h, m, s] = timeStr.split(':').map(Number);

                  if (!isNaN(h) && !isNaN(m) && !isNaN(s)) {
                    const seconds = h * 3600 + m * 60 + s;
                    updatedRow[field] = seconds;
                    total += seconds;
                  } else {
                    updatedRow[field] = 0;
                  }
                }
              });

              return updatedRow;
            });



            //console.log('✔ Total Valid Seconds:', total);


            //console.log('data', data)

            res.content.dataSourceSettings.dataSource = data;
            let obj = {
              ...res,
              content: {
                ...res.content,
                // dataSource: processDataSource(resData.dataSource, resData.rawQuery, resData.fieldDetails)
              }
            }

            return obj

          }
          else {
            const nonChartObj = {
              connection_id: this.dashboardCreationObj.connection_id,
              ...res,
            };
            // // //console.log(nonChartObj)
            return nonChartObj;
          }
        });
        this.panelSeriesArray = modifiedArr;



        let arr = this.panelSeriesArray.map((ele: any) => {
          let obj: any;
          // //  //console.log(ele)
          if (ele.panelType == 'Pivot') {

            obj = {
              ...ele,
              content: {
                ...ele.content,
                dataSourceSettings: {
                  ...ele.content.dataSourceSettings,
                  dataSource: []
                }
              }
            };
            // //console.log(obj)
          } else {
            obj = {
              ...ele,
              content: {
                ...ele.content,
                dataSource: [],
                selectedValues_dataSource: [],
              }
            }
          }

          return obj

        })
        // //  //console.log(arr)
        // localStorage.setItem('dashboardEditObj', JSON.stringify(this.dashboardCreationObj));
        const panelSeriesArrayString = JSON.stringify(arr);

        const preprocessedPanels = this.preprocessPanelsForStorage(this.panelSeriesArray);

        // //console.log('preprocessedPanels', preprocessedPanels)

        try {
          sessionStorage.setItem('createPanelSeriesArray', JSON.stringify(preprocessedPanels));
          // localStorage.setItem('createPanelSeriesArray', JSON.stringify(preprocessedPanels));

        } catch (error) {
          console.error('Error saving to sessionStorage:', error);
        }
      },
      (err: any) => {
        // this.showPopup(false, '35px', "Something Went wrong, Please reload the page");
        this.loaderService.hide()

        this.popupService.showPopup({
          message: err.message,
          statusCode: err.status,
          status: false
        });

      }
    )
  }

  ngOnDestroy(): void {

    // if (this.titleSubscription) {
    //   this.titleSubscription.unsubscribe();
    // }
    this.chartService.setTitle('');
    // this.chartService.titleSubject.unsubscribe()

  }

  tableDataSource: any = []

  onChangeItemPage(eve: any, item: any) {
    let value = eve.itemData.value;
    // //console.log(value);
    let panelObj = this.panelSeriesArray.find((ele: any) => ele.id == item.id);

    if (panelObj) {

      let panelId = panelObj.id;
      let pagingObj = panelObj.content.table_pagination;

      let obj = {
        "filter_obj": [],
        "pagination_obj": {
          "items_per_page": value,
          "total_pages": pagingObj.items_per_page,
          "total_records": pagingObj.total_records,
          "current_page": pagingObj.current_page
        }
      }
      this.initialPage.items_per_page = value;

      // //console.log(obj)
      this.chartService.getTablePaginationByItemPerPage(this.editDashboardId, panelId, obj, 0).subscribe((res: any) => {
        if (res.success) {
          const data = res['data'];
          // //console.log(data);
          this.tableDataSource = data.content.dataSource;
          // //console.log(this.tableDataSource)
          // this.initialPage.currentPage = args.currentPage
          // item.content.table_pagination.total_records = data.content.table_pagination.total_records;
          // item.content.table_pagination.current_page = args.currentPage;
          // item.content.dataSource = data.content.dataSource;
        }
      });
    }

  }


  private clearGridSpinner(grid: any): void {
    const gridElement = grid?.element as HTMLElement | undefined;

    if (typeof grid?.hideSpinner === 'function') {
      grid.hideSpinner();
    }

    if (gridElement) {
      hideSpinner(gridElement);

      const spinnerPane = gridElement.querySelector('.e-spinner-pane') as HTMLElement | null;
      if (spinnerPane) {
        spinnerPane.classList.remove('e-spin-show');
        spinnerPane.classList.add('e-spin-hide');
        spinnerPane.style.display = 'none';
      }
    }
  }

  dataBound(item: any, grid: any, args?: DataBoundEventArgs) {
    let data = item.content.dataSource[0];

    if (item.content.autoFitColumns === true) {
      setTimeout(() => grid.autoFitColumns([]), 0);
    }

    if (item.content.allowWrapping == true) {
      this.wrapSettings = { wrapMode: 'Both' }
    }

    // Hide spinner after all grid operations are complete
    setTimeout(() => {
      this.clearGridSpinner(grid);
    }, 0);

    setTimeout(() => {
      this.clearGridSpinner(grid);
    }, 150);

    if (item.content.headerConditonalFormatting?.length > 0) {
      // Object.keys(data).forEach((fieldName) => {
      item.content.headerConditonalFormatting.forEach((headerConfig: any) => {

        const headerElement = (grid as GridComponent).getColumnHeaderByField(headerConfig.fieldName) as HTMLElement;
        // //console.log('headerElement', headerElement)

        if (headerElement) {
          headerElement.style.background = headerConfig.backgroundColor; // Change background color
          headerElement.style.color = headerConfig.color; // Change text color
          headerElement.style.fontStyle = headerConfig.fontStyle; // Change text color

          const headerTextElement = headerElement.querySelector('.e-headertext') as HTMLElement;
          if (headerTextElement) {
            headerTextElement.style.fontSize = headerConfig.fontSize;
            headerElement.style.fontWeight = headerConfig.fontWeight; // Change text color

          } else {
            //  console.warn("Header text element not found inside:", headerElement);
          }

        }
      });
    }


  }


  currentPageNo: any = 1;
  // onActionBegion(args: any, item: any) {

  //   let panelObj = this.panelSeriesArray.find((ele: any) => ele.id == item.id);

  //   if (panelObj) {

  //     let panelId = panelObj.id;

  //     // //console.log(args.pageSize)
  //     if (args.requestType === 'paging') {
  //       // //console.log('onActionBegion', args);
  //       let pagingObj = panelObj.content.table_pagination;

  //       let obj = {
  //         "filter_obj": [],
  //         "pagination_obj": {
  //           "items_per_page": pagingObj.items_per_page,
  //           "total_pages": pagingObj.items_per_page
  //           ,
  //           "total_records": pagingObj.total_records,
  //           "current_page": args.currentPage
  //         }
  //       }
  //       // //console.log(obj)
  //       this.chartService.getTablePaginationByPageNumber(this.editDashboardId, panelId, obj).subscribe((res: any) => {
  //         if (res.success) {
  //           const data = res['data'];
  //           this.initialPage.currentPage = args.currentPage
  //           item.content.table_pagination.total_records = data.content.table_pagination.total_records;
  //           item.content.table_pagination.current_page = args.currentPage;
  //           item.content.dataSource = data.content.dataSource;
  //         }
  //       });
  //     }
  //   }

  // }

  // pager! : PagerComponent;
  // destroyPager(){


  // }
  dataStateChange(state: DataStateChangeEventArgs): void {
    // this.service.execute(state);

    // //console.log(state, 'dataStateChange')
  }
  onActionBegin(args: PageEventArgs) {
    // handle paging or other grid action begins if needed
  }

  onActionComplete(args: PageEventArgs, item: any, grid?: GridComponent) {
    // //console.log('onActionComplete', args, item.content)

    let panelObj = this.panelSeriesArray.find((ele: any) => ele.id == item.id);

    if (panelObj) {

      let panelId = panelObj.id;
      // this.editDashboardId

      if (args.requestType === 'paging') {
        // //console.log('onActionComplete', args, item.content);
        let pagingObj = panelObj.content.table_pagination;
        // //  //console.log('pagingObj', pagingObj);

        let obj = {
          "filter_obj": [],
          "pagination_obj": {
            "items_per_page": pagingObj.items_per_page,
            "total_pages": pagingObj.total_pages,
            "total_records": pagingObj.total_records,
            "current_page": args.currentPage
          }
        }
      }

      // Clear the grid spinner after any action (grouping, sorting, filtering, etc.)
      if (grid) {
        setTimeout(() => this.clearGridSpinner(grid), 0);
        setTimeout(() => this.clearGridSpinner(grid), 150);
      }
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
      const scrollTop = document.documentElement.scrollTop;
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      const popupHeight = popup.offsetHeight;

      const topPosition = Math.max(0, scrollTop + windowHeight / 2 - popupHeight / 2);

      // Apply the calculated position to the popup
      popup.style.top = topPosition + 'px';
      popup.style.display = 'block';

      backdrop.style.display = 'block';
    }
  }
  progressBarTop = '30%';
  // @HostListener('window:scroll', ['$event'])
  // onScroll(event: Event): void {
  //   this.updateProgressBarPosition();
  // }
  // private updateProgressBarPosition(): void {
  //   const viewportHeight = window.innerHeight;
  //   const windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
  //   const scrollY = window.scrollY

  //   const topPosition = Math.max(0, (windowHeight - viewportHeight) / 2 + scrollY);
  //   this.progressBarTop = `${topPosition}px`;
  // }

  closePopup(): void {
    console.log('🔍 CLOSE POPUP CALLED');
    console.trace(); // This shows WHERE closePopup was called from

    const popup = document.getElementById('popup');
    const backdrop = document.getElementById('backdrop');

    if (popup && backdrop) {
      popup.style.display = 'none';
      backdrop.style.display = 'none';

    }
  }



  onTableHeaderCellInfo(args: HeaderCellInfoEventArgs) {
    //  //console.log('args in table headerCellInfo', args)
    // if ((args.cell as Cell<Column>).column.field === 'OrderDate') {
    //   (args.node as HTMLElement).style.backgroundColor = 'lightblue'; // Background color
    //   (args.node as HTMLElement).style.color = 'black'; // Text color
    // }
  }


  onQueryCellInfo(args: QueryCellInfoEventArgs, item: any): void {
    // Already have access to the panel object 'item'
    let matchedObj = item;
    // console.log('data in table', args)
    let data: any = args.data

    matchedObj.content.matchedFieldDetails?.forEach((ele: any) => {
      if (args.column && args.data && args.cell) {
        // enableHyperlink
        if (ele.textFormatterView == true) {
          if (args.column.field == ele.field) {

            let ele = args.cell as HTMLElement;
            if (data[args.column.field]) {
              args.cell.innerHTML = data[args.column.field].replace(/,/g, '<P>');

            }
          }
        }

        if (ele.enableHyperlink == true) {
          if (args.column.field == ele.field) {
            const cellValue = data[args.column.field];
            // Create an anchor tag with the URL; adjust target or additional attributes as needed.
            args.cell.innerHTML = `<a href="${cellValue}" target="_blank">${cellValue}</a>`;
          }
        }
      }
    })

    if (matchedObj && matchedObj.content && matchedObj.content.formattingCondition) {
      let conditionalData = matchedObj.content.formattingCondition;

      if (Array.isArray(conditionalData) && conditionalData.length > 0) {
        conditionalData.forEach((condition: any) => {
          if (args.column && args.data && args.cell && args.column.field === condition.measure) {
            const fieldValue: any = args.data[condition.measure as keyof typeof args.data];
            const threshold = condition.value1;
            let referenceField: any = args.data[condition.referenceField as keyof typeof args.data];

            let calculatedValue: any = condition.calculatedValue;

            const dataSource = matchedObj.content?.dataSource?.result || [];

            if (calculatedValue && (calculatedValue.toLowerCase() === 'sum' || calculatedValue.toLowerCase() === 'average')) {
              const allValues = dataSource
                .map((item: any) => {
                  const val = item[condition.measure];
                  if (val === null || val === undefined) return 0;
                  return Number(String(val).replace(/,/g, ''));
                })
                .filter((v: number) => !isNaN(v));

              console.log('allValues', allValues)


              const sum = allValues.reduce((a: number, b: number) => a + b, 0);
              const avg = allValues.length > 0 ? sum / allValues.length : 0;

              console.log(`Calculated values for ${condition.measure} - Sum: ${sum}, Average: ${avg}`);

              // ✅ Assign the computed value back to condition.value1 dynamically
              // condition.value1 = calculatedValue.toLowerCase() === 'sum' ? sum : avg;

              // ✅ Only override if Sum or Average; else keep user's entered value
              if (calculatedValue.toLowerCase() === 'sum') {
                condition.value1 = sum;
              } else if (calculatedValue.toLowerCase() === 'average') {
                condition.value1 = avg;
              }
            }



            // **If condition is "None", apply styles to all cells**
            if (condition.conditions === "None") {
              if (args.cell instanceof HTMLElement) {
                this.applyStyles(args.cell, condition.style);
              }
            } else if (condition.conditions === "notContains") {
              const isEmptyValue =
                fieldValue === null ||
                fieldValue === undefined ||
                (typeof fieldValue === 'string' && fieldValue.trim() === '');

              if (isEmptyValue && args.cell instanceof HTMLElement) {
                this.applyStyles(args.cell, condition.style);
              }
            } else if (condition.conditions === "contains") {
              if (
                typeof fieldValue === "string" &&
                typeof condition.value1 === "string" &&
                fieldValue.toLowerCase().includes(condition.value1.toLowerCase())
              ) {
                if (args.cell instanceof HTMLElement) {
                  this.applyStyles(args.cell, condition.style);
                }
              }
            }

            else {

              if (referenceField) {
                if (this.compareValues(fieldValue, referenceField, condition.conditions)) {
                  if (args.cell instanceof HTMLElement) {
                    this.applyStyles(args.cell, condition.style);
                  }
                }
              } else {

                if (this.compareValues(fieldValue, condition.conditions === "Between" ? [condition.value1, condition.value2] : threshold, condition.conditions)) {
                  if (args.cell instanceof HTMLElement) {
                    this.applyStyles(args.cell, condition.style);
                  }
                }
              }
            }
          }
        });
      }

    }


  }




  compareValuesOldMain(value: string | number, threshold: string | number | number[], condition: string): boolean {

    // Convert numeric-looking strings to numbers
    const isNumeric = (str: string) => /^-?\d+(\.\d+)?$/.test(str.trim());

    if (typeof value === "string" && isNumeric(value.replace(/[^0-9.]/g, ''))) {
      value = parseFloat(value.replace(/[^0-9.]/g, '').trim());
    }

    if (typeof threshold === "string" && isNumeric(threshold.replace(/[^0-9.]/g, ''))) {
      threshold = parseFloat(threshold.replace(/[^0-9.]/g, '').trim());
    }

    // If both value and threshold are strings, compare them as strings
    if (typeof value === "string" && typeof threshold === "string") {
      switch (condition) {
        case "=":
          return value.toLowerCase() === threshold.toLowerCase(); // Case insensitive comparison
        case "!=":
          return value.toLowerCase() !== threshold.toLowerCase();
        case ">":
          return value > threshold; // Lexicographic comparison
        case "<":
          return value < threshold; // Lexicographic comparison
        default:
          console.error("Invalid condition for string comparison:", condition);
          return false;
      }
    }

    //console.log('Processed values:', value, threshold, condition);

    // Number-based conditions
    switch (condition) {
      case ">":
        return Number(value) > Number(threshold);
      case ">=":
        return Number(value) >= Number(threshold);
      case "<":
        return Number(value) < Number(threshold);
      case "<=":
        return Number(value) <= Number(threshold);
      case "=":
        return Number(value) == Number(threshold);
      case "!=":
        return Number(value) != Number(threshold);
      case "Between":
        if (Array.isArray(threshold) && threshold.length === 2) {
          const [value1, value2] = threshold.map(num => Number(num));
          const min = Math.min(value1, value2);
          const max = Math.max(value1, value2);
          return Number(value) >= min && Number(value) <= max;
        }
        console.error("Threshold for 'Between' condition must be an array with two numbers.");
        return false;
      default:
        return false;
    }
  }

  // Modify the compareValues method in edit-dashboard.component.ts
  compareValues(value: string | number | null, threshold: string | number | number[], condition: string): boolean {
    // Handle "notContains" (empty/null only)
    if (condition === "notContains") {
      return value === null ||
        value === undefined ||
        value === "" ||
        (typeof value === "string" && value.trim() === "");
    }

    // Handle "= null" (only true if actual null/undefined)
    if (condition === "=" && threshold === "null") {
      return value === null || value === undefined;
    }

    // Handle "!= null" (true if not null/undefined)
    if (condition === "!=" && threshold === "null") {
      return !(value === null || value === undefined);
    }

    // At this point, if value is null but condition is not about null → false
    if (value === null || value === undefined) {
      return false;
    }

    // Utility: check if numeric
    const isNumeric = (str: string) => /^-?\d+(\.\d+)?$/.test(str.trim());

    // Convert value if numeric string
    if (typeof value === "string" && isNumeric(value.replace(/[^0-9.-]/g, ''))) {
      value = parseFloat(value.replace(/[^0-9.-]/g, '').trim());
    }

    // Convert threshold if numeric string
    if (typeof threshold === "string" && isNumeric(threshold.replace(/[^0-9.-]/g, ''))) {
      threshold = parseFloat(threshold.replace(/[^0-9.-]/g, '').trim());
    }

    // String comparisons
    if (typeof value === "string" && typeof threshold === "string") {
      switch (condition) {
        case "=": return value.toLowerCase() === threshold.toLowerCase();
        case "!=": return value.toLowerCase() !== threshold.toLowerCase();
        case ">": return value > threshold;
        case "<": return value < threshold;
        case "contains": return value.toLowerCase().includes(threshold.toLowerCase());
        default: return false;
      }
    }

    // Number comparisons
    switch (condition) {
      case ">": return Number(value) > Number(threshold);
      case ">=": return Number(value) >= Number(threshold);
      case "<": return Number(value) < Number(threshold);
      case "<=": return Number(value) <= Number(threshold);
      case "=": return Number(value) === Number(threshold);
      case "!=": return Number(value) !== Number(threshold);
      case "Between":
        if (Array.isArray(threshold) && threshold.length === 2) {
          const [min, max] = threshold.map(Number).sort((a, b) => a - b);
          return Number(value) >= min && Number(value) <= max;
        }
        return false;
      default:
        return false;
    }
  }



  applyStyles(cell: HTMLElement, style: any): void {


    Object.keys(style).forEach(property => {
      if (property === 'backgroundColor' || property === 'color') {
        cell.style[property] = style[property];
      } else if (property === 'fontSize') {
        cell.style.fontSize = style[property];
      }
    });
  }



  public dlgBtnClick = (): void => {
  }
  public dlgButtons: ButtonPropsModel[] = [{ click: this.dlgBtnClick.bind(this), buttonModel: { content: 'Learn More', isPrimary: true } }];


  public BtnClick = (): void => {
    this.connectionSubmitFlag = false;
    this.connectionUpdateFlag = true;
    this.showConnectionFormPopup = true;
    this.syncOverlay();
    this.changeDetectorRef.markForCheck();
    let storedConnectionId: any = sessionStorage.getItem('connectionIdObj')
    // let storedConnectionId: any = localStorage.getItem('connectionIdObj')

    if (storedConnectionId != null || storedConnectionId != undefined) {
      storedConnectionId = JSON.parse(storedConnectionId);
      // //console.log('storedConnectionId', storedConnectionId);


      // let storedObj = {
      //   connectionName : storedConnectionId.connectionName + '-' + storedConnectionId.connection_id ,
      //   databaseName : storedConnectionId.databaseName
      // }
      // // //console.log('storedObj', storedObj)

      this.connectionNameForm.patchValue({
        connectionName: storedConnectionId.connection_Id,
        databaseName: storedConnectionId.databaseName
      })



      // let obj = {
      //   "connectionName": data.connection_name ,
      //   "connection_Id" : data.connection_id ,
      //   "databaseName": data.default_database_name
      // }
      // localStorage.setItem("connectionIdObj", JSON.stringify(obj))
      // if(storedConnectionId.connection_id != null || storedConnectionId.connection_id != undefined)
      // this.chartService.getAllDatabaseNameById(storedConnectionId.connection_id).subscribe((res : any) =>{
      // //   //console.log(res,'res ')
      //   let data = res['data'];
      //   this.databaseNameArr = data.databases
      // })
    }
  }
  //   getEditBoxObj(event: any) {
  // //     //console.log(event);
  //     this.loaderFlag = false;

  //     if (typeof event === 'object') {
  //         const boxObj = event.boxObj;
  //         const resObj = event.resObj;

  //         // Process boxObj and resObj
  //         this.childPanelObj = boxObj;

  // //         //console.log(this.childPanelObj);

  //         this.getPanelArrayDataFromLocalStorage();

  //         this.panelSeriesArray.splice(this.getPanelIndex, 1, this.childPanelObj);

  //         // let emptyDatasourceArr = this.panelSeriesArray.map((ele : any) =>{
  //         //   let obj : any = ele
  //         //   if(ele.panelType === 'Chart'){
  //         //     let seriesArr = obj.content.series.map((ele : any) =>{
  //         //       let obj = {
  //         //         ...ele,
  //         //         dataSource : []
  //         //       }
  //         //       return obj
  //         //     })
  // //         //     //console.log(seriesArr)
  //         //     obj = {
  //         //       ...obj,
  //         //       content : {
  //         //         ...obj.content,
  //         //         dataSource : [],
  //         //         series : seriesArr
  //         //       }
  //         //     }
  //         //   }else{
  //         //     obj = {
  //         //       ...obj,
  //         //       content : {
  //         //         ...obj.content,
  //         //         dataSource : []
  //         //       }
  //         //     }
  //         //   }
  //         //   return obj
  //         // })

  // //         // //console.log(emptyDatasourceArr)

  //         localStorage.setItem('createPanelSeriesArray', JSON.stringify( this.panelSeriesArray));
  //         const resSuccess = resObj.resSuccess;
  //         const resMessage = resObj.resMessage;

  //         if(resSuccess === false){
  //           this.showPopup(resSuccess, '35px', resMessage)

  //         }



  //         // Do something with resSuccess and resMessage
  //     } 
  // }
  getEditBoxObj(event: any) {

    this.loaderService.hide()


    if (typeof event === 'object') {
      const boxObj = event.boxObj;
      const resObj = event.resObj;

      if (boxObj.panelType === 'Pivot') {
        let total = 0;

        const timeFields = boxObj.content.fieldDetails.filter(
          (f: any) => f.formatType === 'string' && f.name
        ).map((f: any) => f.name);

        const data = boxObj.content.dataSourceSettings.dataSource.map((row: any) => {
          const updatedRow = { ...row };

          timeFields.forEach((field: string | number) => {
            const timeStr = row[field];

            if (typeof timeStr === 'string' && timeStr.includes(':')) {
              const [h, m, s] = timeStr.split(':').map(Number);

              if (!isNaN(h) && !isNaN(m) && !isNaN(s)) {
                const seconds = h * 3600 + m * 60 + s;
                updatedRow[field] = seconds;
                total += seconds;
              } else {
                updatedRow[field] = 0;
              }
            }
          });

          return updatedRow;
        });


        boxObj.content.dataSourceSettings.dataSource = data;
      }



      // Process boxObj and resObj
      this.childPanelObj = boxObj;
      this.getPanelArrayDataFromLocalStorage();
      // //console.log(this.panelSeriesArray)
      this.panelSeriesArray.splice(this.getPanelIndex, 1, this.childPanelObj);


      let emptyDatasourceArr = this.panelSeriesArray.map((ele: any) => {
        let obj: any;
        if (ele.panelType == 'Pivot') {
          obj = {
            ...ele,
            content: {
              ...ele.content,
              dataSourceSettings: {
                ...ele.content.dataSourceSettings,
                dataSource: []
              }
            }
          };
        } else if (ele.panelType == 'Calender') {
          obj = {
            ...ele,
            content: {
              ...ele.content,
              dataSource: [],
              selectedValues_dataSource: [],
            }
          }
        }

        else {
          obj = {
            ...ele,
            content: {
              ...ele.content,
              dataSource: [],
              selectedValues_dataSource: [],
            }
          }
        }

        return obj

      })


      const preprocessedPanels = this.preprocessPanelsForStorage(this.panelSeriesArray);

      console.log('preprocessedPanels', preprocessedPanels)

      try {
        sessionStorage.setItem('createPanelSeriesArray', JSON.stringify(preprocessedPanels));
        // localStorage.setItem('createPanelSeriesArray', JSON.stringify(preprocessedPanels));


      } catch (error) {
        console.error('Error saving to sessionStorage:', error);
      }

      let resSuccess = resObj.resSuccess;
      let resMessage = resObj.resMessage;
      let resStatusCode = resObj.statusCode;

      if (resSuccess === false) {
        // this.showPopup(resSuccess, '35px', resMessage)
        this.popupService.showPopup({
          message: resMessage,
          statusCode: resStatusCode,
          status: false
        });
      }
      this.changeDetectorRef.markForCheck();
    }

  }

  public connectionFields: Object = { text: 'connection_name', value: 'connection_id' };

  copyPanel1(event: any, obj: any) {
    // //console.log('Duplicating panel:', obj);

    this.getPanelArrayDataFromLocalStorage();


    // Calculate the new ID
    let maxNumericId = 0;
    for (const panel of this.panelSeriesArray) {
      const numericId = parseInt(panel.id.split('_')[1]);
      if (!isNaN(numericId) && numericId > maxNumericId) {
        maxNumericId = numericId;
      }
    }
    const newNumericId = maxNumericId + 1;

    // Find the maximum row and sizeY
    let lastRow = 0;
    let lastSizeY = 0;
    if (this.panelSeriesArray.length > 0) {
      const lastPanel = this.panelSeriesArray[this.panelSeriesArray.length - 1];
      lastRow = lastPanel.row;
      lastSizeY = lastPanel.sizeY;
    }
    const panelWithMaxRow = this.panelSeriesArray.reduce((max, current) => {
      return current.sizeY > max.sizeY ? current : max;
    }, this.panelSeriesArray[0]);

    // //console.log('panelWithMaxRow', panelWithMaxRow);

    // //console.log(' this.panelSeriesArray', this.panelSeriesArray)
    // Calculate new row and col for the duplicated panel
    const newRow = lastRow + lastSizeY;
    const newCol = obj.col; // Retain the same column

    // Create a new panel object by cloning the original and modifying required fields
    const newPanel = {
      id: `layout_${newNumericId}`,
      row: obj.row,
      col: 0,
      "sizeX": obj.sizeX,
      "sizeY": obj.sizeY,
      header: `Panel ${newNumericId}`,
      connection_id: obj.connection_id,
      "content": obj.content,
      "panelType": obj.panelType,

    };


    // Push the new panel to the panelSeriesArray
    this.panelSeriesArray.push(newPanel);

    // Update the session storage
    const panelSeriesArrayString = JSON.stringify(this.panelSeriesArray);
    sessionStorage.setItem('createPanelSeriesArray', panelSeriesArrayString);

    // //console.log('New panel created:', newPanel);
  }

  copyPanel2(event: any, obj: any) {
    // //console.log('Duplicating panel:', obj);

    this.getPanelArrayDataFromLocalStorage();

    let maxNumericId = 0;
    let maxDistanceFromTop = 0;
    let panelWithMaxDistance: any = null;

    // Calculate max ID and find the panel farthest from the top
    for (const panel of this.panelSeriesArray) {
      const numericId = parseInt(panel.id.split('_')[1]);
      if (!isNaN(numericId) && numericId > maxNumericId) {
        maxNumericId = numericId;
      }

      const panelElement = document.getElementById(panel.id);
      if (panelElement) {
        const rect = panelElement.getBoundingClientRect();
        const distanceFromTop = rect.top + window.scrollY; // Include scroll offset
        if (distanceFromTop > maxDistanceFromTop) {
          maxDistanceFromTop = distanceFromTop;
          panelWithMaxDistance = panel;
        }
      } else {
        console.warn(`No DOM element found for panel ${panel.id}`);
      }
    }

    // //console.log(`Panel farthest from top:`, panelWithMaxDistance);

    // If a panel was found with max distance, calculate the new position
    let newRow = 0;
    if (panelWithMaxDistance) {
      newRow = panelWithMaxDistance.row + panelWithMaxDistance.sizeY;
    }

    const newNumericId = maxNumericId + 1;

    // Create a new panel object with specified height and width
    const newPanel = {
      id: `layout_${newNumericId}`,
      row: newRow, // Place below the farthest panel
      col: 0, // Retain the same column
      sizeX: obj.sizeX, // Use specified width
      sizeY: obj.sizeY, // Use specified height
      header: `Panel ${newNumericId}`,
      connection_id: obj.connection_id,
      content: obj.content,
      panelType: obj.panelType,
    };

    // Push the new panel to the end of the panelSeriesArray
    this.panelSeriesArray.push(newPanel);

    // Update the session storage
    const panelSeriesArrayString = JSON.stringify(this.panelSeriesArray);
    sessionStorage.setItem('createPanelSeriesArray', panelSeriesArrayString);

    // //console.log('New panel created:', newPanel);
  }
  copyPanel(event: any, obj: any) {
    // //console.log('Duplicating panel:', obj);

    this.getPanelArrayDataFromLocalStorage();

    let maxNumericId = 0;
    let maxEndRow = 0; // Track the bottom-most position
    let maxDistanceFromTop = 0;
    let panelWithMaxDistance: any = null;

    // Iterate through panels to find the bottom-most position
    for (const panel of this.panelSeriesArray) {
      const numericId = parseInt(panel.id.split('_')[1]);
      if (!isNaN(numericId) && numericId > maxNumericId) {
        maxNumericId = numericId;
      }

      // Calculate the bottom-most row
      const panelEndRow = panel.row + panel.sizeY;
      if (panelEndRow > maxEndRow) {
        maxEndRow = panelEndRow;
      }

      // Optional: Identify panel farthest from the top for debugging
      const panelElement = document.getElementById(panel.id);
      if (panelElement) {
        const rect = panelElement.getBoundingClientRect();
        const distanceFromTop = rect.top + window.scrollY; // Include scroll offset
        if (distanceFromTop > maxDistanceFromTop) {
          maxDistanceFromTop = distanceFromTop;
          panelWithMaxDistance = panel;
        }
      }
    }

    // //console.log(`Panel farthest from top:`, panelWithMaxDistance);
    // //console.log(`Bottom-most panel row + sizeY:`, maxEndRow);

    // Calculate the new ID and position
    const newNumericId = maxNumericId + 1;

    const newPanel = {
      id: `layout_${newNumericId}`,
      row: maxEndRow, // Place after the bottom-most row
      col: 0, // Default column placement, can be adjusted if needed
      sizeX: obj.sizeX,
      sizeY: obj.sizeY,
      header: `Panel ${newNumericId}`,
      connection_id: obj.connection_id,
      content: obj.content,
      panelType: obj.panelType,
    };

    // Add the new panel to the end of the array
    this.panelSeriesArray.push(newPanel);

    // // Update session storage
    // const panelSeriesArrayString = JSON.stringify(this.panelSeriesArray);
    // sessionStorage.setItem('createPanelSeriesArray', panelSeriesArrayString);

    const arr = this.panelSeriesArray.map((ele: any) => {
      if (ele.panelType === 'Pivot') {
        return {
          ...ele,
          content: {
            ...ele.content,
            dataSourceSettings: {
              ...ele.content.dataSourceSettings,
              dataSource: [],
            },
          },
        };
      } else {
        return {
          ...ele,
          content: {
            ...ele.content,
            dataSource: [],
            selectedValues_dataSource: [],
          },
        };
      }
    });

    const preprocessedPanels = this.preprocessPanelsForStorage(this.panelSeriesArray);
    // //console.log('preprocessedPanels', preprocessedPanels);

    try {
      sessionStorage.setItem('createPanelSeriesArray', JSON.stringify(preprocessedPanels));
      // //console.log('Panel successfully added and updated in sessionStorage.');
    } catch (error) {
      console.error('Error saving to sessionStorage:', error);
    }

    // //console.log('New panel created:', newPanel);
    this.changeDetectorRef.markForCheck();
  }


  onConnectionUpdate() {
    // //console.log(this.connectionNameForm.value)
    let formValue = this.connectionNameForm.value;
    let connectionid = +(formValue.connectionName)
    this.connectionIdFlag = false;

    if (connectionid == 0) {
      this.connectionNameFromApi = "internal";
      this.connection_id = 0;

      let obj = {
        "connectionName": "internal",
        "connection_Id": 0,
        "databaseName": ""
      }
      // localStorage.setItem("connectionIdObj", JSON.stringify(obj));
      sessionStorage.setItem("connectionIdObj", JSON.stringify(obj));

    } else {
      this.chartService.getDbConnectionDetailById(connectionid).subscribe((res: any) => {
        let data = res['data'];
        this.connectionNameFromApi = data.connection_name;
        this.connection_id = this.dashboardCreationObj.connection_id;

        let obj = {
          "connectionName": data.connection_name,
          "connection_Id": data.connection_id,
          "databaseName": data.default_database_name
        }
        // localStorage.setItem("connectionIdObj", JSON.stringify(obj));
        sessionStorage.setItem("connectionIdObj", JSON.stringify(obj));

      })
    }

    // Retrieve panelSeriesArray from sessionStorage
    let storedPanels: any = sessionStorage.getItem('createPanelSeriesArray');

    if (storedPanels) {
      storedPanels = JSON.parse(storedPanels);

      // this.panelSeriesArray = storedPanels

    }

    // if (storedPanels) {
    //   // Parse the stored string back to an array
    //   const panelSeriesArray = JSON.parse(storedPanels);

    //   // Perform your desired operations on the array
    //   panelSeriesArray.forEach((panel : any) => {
    //     panel.connection_id = this.connection_id; // Update connection_id or any other property
    //   });

    //   // Convert the updated array back to a string
    //   const updatedPanelSeriesArrayString = JSON.stringify(panelSeriesArray);

    //   // Save the updated string back to sessionStorage
    //   sessionStorage.setItem('panelSeriesArray', updatedPanelSeriesArrayString);

    //   //console.log('Updated panelSeriesArrayString:', updatedPanelSeriesArrayString);
    // } else {
    //   console.error('No panelSeriesArray found in sessionStorage.');
    // }

    this.panelSeriesArray.forEach((panel: any) => {
      panel.connection_id = this.connection_id // Update connection_id or any other property
    });

    // Convert the updated array back to a string
    const updatedPanelSeriesArrayString = JSON.stringify(this.panelSeriesArray);

    // Save the updated string back to sessionStorage
    sessionStorage.setItem('createPanelSeriesArray', updatedPanelSeriesArrayString);

    // //console.log('this.connection_id', this.connection_id)

    // //console.log('Updated panelSeriesArrayString:', updatedPanelSeriesArrayString);

    this.connectionSubmitFlag = true;
    this.connectionUpdateFlag = false;
    this.showConnectionFormPopup = false;
    this.syncOverlay();
    this.changeDetectorRef.markForCheck();


  }


  public dialogClose = (): void => {
    (document.getElementById('dlgbtn') as HTMLElement).style.display = '';
  }
  // On Dialog open, 'Open' Button will be hidden
  public dialogOpen = (): void => {
    (document.getElementById('dlgbtn') as HTMLElement).style.display = 'none';
  }

  onConnectionFormSubmit() {
    // //console.log(this.connectionNameForm.value, this.connectionId);
    let formValue = this.connectionNameForm.value;
    let connectionid = +(formValue.connectionName);

    if (connectionid == 0) {
      this.connectionNameFromApi = "internal";
      this.connection_id = 0;

      let obj = {
        "connectionName": "internal",
        "connection_Id": 0,
        "databaseName": ""
      }
      // localStorage.setItem("connectionIdObj", JSON.stringify(obj));
      sessionStorage.setItem("connectionIdObj", JSON.stringify(obj));


    } else {
      let obj = {
        ...formValue,
        connectionName: connectionid,
      }
      // localStorage.setItem("connectionIdObj", JSON.stringify(obj))
      sessionStorage.setItem("connectionIdObj", JSON.stringify(obj));

    }
    this.connectionIdFlag = false;
    this.showConnectionFormPopup = false;
    this.syncOverlay();
    this.changeDetectorRef.markForCheck();

    // const [connectionName, connectionId] = formValue.connectionName.split('-');

  }

  connectionId!: number;
  databaseNameArr: any = []

  onConnectionNameSelect(event: any) {
    // const selectedValue = event.target.value;

    // // //console.log(selectedValue)

    // if (selectedValue) {
    //   // const [connectionName, connectionId] = selectedValue.split('-');
    //   // Do something with connectionName and connectionId
    // //   // //console.log(connectionId);
    //   // this.connectionId = +(connectionId);
    //   this.connectionId = +(selectedValue);
    // //   //console.log('connectionId',  this.connectionId);

    //   // this.chartService.getAllDatabaseNameById(selectedValue).subscribe((res : any) =>{
    // //   //   //console.log(res,'res ')
    //   //   let data = res['data'];
    //   //   this.databaseNameArr = data.databases
    //   // })
    // }

    let itemData = event.itemData;
    let connectionName_Id = itemData.connection_id;
    // //console.log('connectionName_Id', connectionName_Id, typeof (connectionName_Id))

    if (connectionName_Id) {
      this.connectionId = +(connectionName_Id);
      // //console.log('this.connectionId', this.connectionId)

    }

  }

  calculatedListBoxHeight: string = '100%'; // Initial default value

  calculateDynamicHeight(item: any): void {
    // Implement logic to calculate dynamic height based on available space or other factors
    // For example:
    const calculatedHeight = 'calc(100% - 40px)';
    this.calculatedListBoxHeight = calculatedHeight;
  }

  onResizeStop(args: any) {
    const panelElement = args.element;
    // // //console.log('panelElement', panelElement);

    if (panelElement) {

      const offsetHeight: any = panelElement.offsetHeight - 50;
      // //console.log('OffsetHeight:', panelElement.offsetHeight);
      const dataCol = panelElement.getAttribute('data-col');
      const dataRow = panelElement.getAttribute('data-row');
      const datasizex = panelElement.getAttribute('data-sizex');
      const datasizey = panelElement.getAttribute('data-sizey');


      // let panelData = localStorage.getItem('createPanelSeriesArray');
      let panelData = sessionStorage.getItem('createPanelSeriesArray');


      if (panelData !== null) {
        panelData = JSON.parse(panelData);
        // // //console.log(panelData, 'panelData')

        if (Array.isArray(panelData)) {
          let panelold: any | null = panelData.find((panel) => panel.id === panelElement.id);
          // //console.log(panelold);
          if (panelold) {
            // Update the panel directly
            panelold.sizeX = +datasizex;
            panelold.sizeY = +datasizey;
            panelold.col = +dataCol;
            panelold.row = +dataRow;
            // //  //console.log('panelold.content.height', panelold.content.height)


            if (panelold.panelType == "ListBox") {
              let height = panelElement.offsetHeight - 75;
              this.boxHeight = height + 'px';
              panelold.content.height = this.boxHeight;
              // // //console.log('height', height, panelold.content.height)
              // this.calculateDynamicHeight(panelold);

            }

            if (panelold.panelType == "Pivot") {
              let pivotHeight = offsetHeight - 10;
              panelold.content.height = pivotHeight + 'px';

              // //   //console.log('panelold.content.height', panelold.content.height)
              // panelold.height = offsetHeight
              // panelold.width = "100%"
            }

            //   if (panelold.panelType == "Table") {
            //   //  this.pivotHeight = offsetHeight;
            //  //  panelold.content.height = offsetHeight -100;

            // //    // //console.log('panelold.content.height', panelold.content.height)
            //     // panelold.height = offsetHeight
            //     // panelold.width = "100%"
            //   }

            // //console.log('panelData', panelData)

            // localStorage.setItem('createPanelSeriesArray', JSON.stringify(panelData));
            sessionStorage.setItem('createPanelSeriesArray', JSON.stringify(panelData));

            // Manually trigger change detection to update the view
            this.changeDetectorRef.detectChanges();
          }


        }
      }

      if (panelElement.querySelector('.e-panel-container .e-panel-content')) {
        if (panelElement.querySelector('.e-panel-container .e-panel-content ejs-chart')) {
          const chartObj = panelElement.querySelector('.e-panel-container .e-panel-content ejs-chart').ej2_instances[0];
          chartObj.height = '100%';
          chartObj.width = '100%';
          // //console.log(chartObj, 'Chart');
          chartObj.refresh();

        } else if (panelElement.querySelector('.e-panel-container .e-panel-content ejs-accumulationchart')) {
          const chartObj = panelElement.querySelector('.e-panel-container .e-panel-content ejs-accumulationchart').ej2_instances[0];
          chartObj.height = '100%';
          chartObj.width = '100%';
          // //console.log(chartObj, 'pie chart');
          chartObj.refresh();

        } else if (panelElement.querySelector('.e-panel-container .e-panel-content ejs-grid')) {
          const chartObj = panelElement.querySelector('.e-panel-container .e-panel-content ejs-grid').ej2_instances[0];
          chartObj.height = '96%';
          chartObj.width = '100%';
          // //console.log(chartObj.height, chartObj.width, 'Table ');
          chartObj.refresh();

        } else if (panelElement.querySelector('.e-panel-container .e-panel-content ejs-pivotview')) {
          const pivotObj = panelElement.querySelector('.e-panel-container .e-panel-content ejs-pivotview').ej2_instances[0];
          pivotObj.height = '98%';
          // this.pivotHeight = offsetHeight;
          pivotObj.width = '100%';

          // //console.log(pivotObj.height, pivotObj.width, pivotObj, 'Pivot Table ');
          pivotObj.refresh();

        }
        else if (panelElement.querySelector('.e-panel-container .e-panel-content ejs-listbox')) {
          const listboxObj = panelElement.querySelector('.e-panel-container .e-panel-content ejs-listbox').ej2_instances[0];
          let listobj = panelElement.querySelector('.e-listbox-wrapper.e-wrapper.e-lib');
          // // //console.log('listobj', listobj)
          // // //console.log(' panelElement',  panelElement)
          let height = panelElement.offsetHeight - 55;
          // //console.log(height)
          listboxObj.height = height + 'px';
          // listboxObj.width = '100%';
          // // //console.log(listboxObj.height, listboxObj.width, listboxObj, 'Pivot Table ');
          listboxObj.refresh();
        } else if (panelElement.querySelector('.e-panel-container .e-panel-content ejs-schedule')) {
          const listboxObj = panelElement.querySelector('.e-panel-container .e-panel-content ejs-schedule').ej2_instances[0];
          let height = panelElement.offsetHeight - 55;

          console.log('height', height)
          listboxObj.height = height + 'px';

          listboxObj.refresh();
        } else if (panelElement.querySelector('.e-panel-container .e-panel-content ejs-circulargauge')) {
          const gaugeObj = panelElement.querySelector('.e-panel-container .e-panel-content ejs-circulargauge').ej2_instances[0];
          gaugeObj.width = '100%';
          gaugeObj.height = '100%';
          gaugeObj.refresh();
        }

      }
      // Additional changes

    }
  }
  fontSize: string = '14px';
  btnfontSize: string = '11px';
  buttonPadding: string = '5px 10px';
  updateSizes(width: number, height: number) {
    // Adjust the values as needed based on width and height
    const newFontSize = Math.min(width, height) * 0.09;
    const btnfontSize = Math.min(width, height) * 0.06;
    const newButtonPadding = Math.min(width, height) * 0.01;

    this.fontSize = `${newFontSize}px`;
    this.btnfontSize = `${btnfontSize}px`;
    this.buttonPadding = `${newButtonPadding}px ${newButtonPadding * 1.8}px`;
  }

  // dataBound(item: any) {
  //   const columns = (this.grid as any).getColumns();
  //   (this.grid as any).autoFitColumns([]);

  // }
  totalNoOfRecords!: number;


  toolbarClick(args: ClickEventArgs, item: any, grid: GridComponent): void {
    // //console.log(args.item.text);
    if (args) {
      if (args.item.text == 'Excel Export') {
        grid.excelExport();
      } else {
        // //console.log(args.item.text)
        grid.csvExport();
      }
    }

    // if(item.content.autoFitColumns  === true){
    //   if(args){
    //     if (args.item.text == 'Excel Export') {
    //       this.grid.excelExport();
    //     } else {
    // //       //console.log(args.item.text)
    //       this.grid.csvExport();
    //     }
    //   }


    // }else{
    //   if(args){
    //     if (args.item.text == 'Excel Export') {
    //       this.grid1.excelExport();
    //     } else {
    // //       //console.log(args.item.text)
    //       this.grid1.csvExport();
    //     }
    //   }

    // }



  }
  onPanelDropdownSubmitold() {

    let selectedItem = this.panelTypeForm.value.panelType;
    // let storedConnectionId: any = localStorage.getItem('connectionIdObj');
    let storedConnectionId: any = sessionStorage.getItem('connectionIdObj');



    if (storedConnectionId != null || storedConnectionId != undefined) {
      storedConnectionId = JSON.parse(storedConnectionId);
      // //console.log(storedConnectionId, 'storedConnectionId');
      this.connection_id = storedConnectionId.connection_Id;

    }
    this.panelType = selectedItem;
    let lastCol = 0;
    let lastRow = 0;
    let lastSizeY = 0;

    if (this.panelSeriesArray.length > 0) {
      // Find the panel with the maximum row number
      const lastPanel = this.panelSeriesArray[this.panelSeriesArray.length - 1];
      lastRow = lastPanel.row;
      lastSizeY = lastPanel.sizeY;
      lastCol = lastPanel.col;
    }

    // Calculate new row based on last panel's row and sizeY
    const newRow = lastRow + lastSizeY;


    this.getPanelArrayDataFromLocalStorage();

    let maxNumericId = 0;
    for (const panel of this.panelSeriesArray) {
      const numericId = parseInt(panel.id.split('_')[1]);
      // //  //console.log(numericId)
      if (!isNaN(numericId) && numericId > maxNumericId) {
        maxNumericId = numericId;
      }
    }

    const newNumericId = this.panelSeriesArray.length === 0 ? 0 : (maxNumericId + 1);

    let panel: any = {
      'id': `layout_${newNumericId}`,
      'sizeX': 10, 'sizeY': 8, 'row': newRow, 'col': 0,
      content: {},
      panelType: `${this.panelType}`,
      header: 'Panel ' + newNumericId.toString() + '',
      "connection_id": this.connection_id
    }
    // ////console.log(this.panelSeriesArray)
    this.panelSeriesArray.push(panel);
    let arr = this.panelSeriesArray.map((ele: any) => {
      let obj: any;
      if (ele.panelType == 'Pivot') {
        obj = {
          ...ele,
          content: {
            ...ele.content,
            dataSourceSettings: {
              ...ele.content.dataSourceSettings,
              dataSource: []
            }
          }
        };
      } else {
        obj = {
          ...ele,
          content: {
            ...ele.content,
            dataSource: [],
            selectedValues_dataSource: [],

          }
        }
      }

      return obj

    })
    // // //console.log(arr)
    const panelSeriesArrayString = JSON.stringify(arr);
    // const panelSeriesArrayString = JSON.stringify(this.panelSeriesArray);
    // localStorage.setItem('createPanelSeriesArray', panelSeriesArrayString);

    const preprocessedPanels = this.preprocessPanelsForStorage(this.panelSeriesArray);

    // //console.log('preprocessedPanels', preprocessedPanels)

    try {
      // localStorage.setItem('createPanelSeriesArray', JSON.stringify(preprocessedPanels));
      sessionStorage.setItem('createPanelSeriesArray', JSON.stringify(preprocessedPanels));


      // //console.log('Panel successfully deleted and updated in localStorage.');
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
    this.panelTypeForm.reset()
    this.showDefaultDialog = false;
    this.syncOverlay();

  }
  onPanelDropdownSubmit() {
    const selectedItem = this.panelTypeForm.value.panelType;
    let storedConnectionId: any = sessionStorage.getItem('connectionIdObj');

    if (storedConnectionId != null || storedConnectionId != undefined) {
      storedConnectionId = JSON.parse(storedConnectionId);
      // //console.log(storedConnectionId, 'storedConnectionId');
      this.connection_id = storedConnectionId.connection_Id;
    }

    this.panelType = selectedItem;

    this.getPanelArrayDataFromLocalStorage();

    // Determine the next ID for the new panel
    let maxNumericId = 0;
    let maxEndRow = 0; // Track the bottom-most position in the dashboard

    for (const panel of this.panelSeriesArray) {
      const numericId = parseInt(panel.id.split('_')[1]);
      if (!isNaN(numericId) && numericId > maxNumericId) {
        maxNumericId = numericId;
      }

      // Calculate the bottom-most position
      const panelEndRow = panel.row + panel.sizeY;
      if (panelEndRow > maxEndRow) {
        maxEndRow = panelEndRow;
      }
    }

    const newNumericId = this.panelSeriesArray.length === 0 ? 0 : (maxNumericId + 1);

    this.panelHeader = `Create Panel - ${this.panelType}`

    // Create a new panel positioned below the existing panels
    const newPanel = {
      id: `layout_${newNumericId}`,
      sizeX: 10, // Default width
      sizeY: 8,  // Default height
      row: maxEndRow, // Place below the bottom-most panel
      col: 0, // Start in column 0 by default
      content: {},
      panelType: `${this.panelType}`,
      header: `${this.panelType} ${newNumericId}`,
      connection_id: this.connection_id,
    };

    // Add the new panel to the array
    this.panelSeriesArray.push(newPanel);

    // Map and preprocess panels for storage
    const arr = this.panelSeriesArray.map((ele: any) => {
      if (ele.panelType === 'Pivot') {
        return {
          ...ele,
          content: {
            ...ele.content,
            dataSourceSettings: {
              ...ele.content.dataSourceSettings,
              dataSource: [],
            },
          },
        };
      } else {
        return {
          ...ele,
          content: {
            ...ele.content,
            dataSource: [],
            selectedValues_dataSource: [],
          },
        };
      }
    });

    const preprocessedPanels = this.preprocessPanelsForStorage(this.panelSeriesArray);
    // //console.log('preprocessedPanels', preprocessedPanels);

    try {
      sessionStorage.setItem('createPanelSeriesArray', JSON.stringify(preprocessedPanels));
      // //console.log('Panel successfully added and updated in sessionStorage.');
    } catch (error) {
      console.error('Error saving to sessionStorage:', error);
    }

    this.panelTypeForm.reset();
    this.showDefaultDialog = false;
    this.syncOverlay();
    this.changeDetectorRef.markForCheck();
  }

  onAddPanel() {
    this.showDefaultDialog = true;
    this.syncOverlay();
    // this.positionDialog();
    this.changeDetectorRef.markForCheck();
  }

  toggleFloating() {
    this.dashboardCreationObj.allowFloating = !this.dashboardCreationObj.allowFloating;

    const status = this.dashboardCreationObj.allowFloating ? 'Enabled' : 'Disabled';
    this.showToast(`Floating is ${status}`);
    this.changeDetectorRef.markForCheck();
  }

  showToast(message: string) {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      top: 63px;
      right: 10px;
      background: #4CAF50;
      color: white;
      padding: 5px 36px;
      border-radius: 4px;
      z-index: 10000;
      font-size: 14px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 3000);
  }

  onDeletePanel(eve: any, id: any) {
    // // //console.log('before storage', this.panelSeriesArray);

    this.getPanelArrayDataFromLocalStorage();

    let panelElement = ((<HTMLElement>eve.target).offsetParent);
    // // //console.log('before panelElement',panelElement);

    if (panelElement) {
      // //console.log(panelElement.id);
      let panelId = panelElement.id;

      this.panelSeriesArray = this.panelSeriesArray.filter(panel => panel.id !== panelId);
      this.reorganizePanelIds();
      // //console.log('after deletion', this.panelSeriesArray);

      const preprocessedPanels = this.preprocessPanelsForStorage(this.panelSeriesArray);

      // //console.log('preprocessedPanels', preprocessedPanels)
      // localStorage.setItem('createPanelSeriesArray', JSON.stringify(this.panelSeriesArray));

      try {
        // localStorage.setItem('createPanelSeriesArray', JSON.stringify(preprocessedPanels));
        sessionStorage.setItem('createPanelSeriesArray', JSON.stringify(preprocessedPanels));



        // //console.log('Panel successfully deleted and updated in localStorage.');
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }
      this.changeDetectorRef.markForCheck();
    }
    // this.panelSeriesArray.splice(id, 1);

  }

  reorganizePanelIds() {
    for (let i = 0; i < this.panelSeriesArray.length; i++) {
      const newId = `layout_${i}`;
      this.panelSeriesArray[i].id = newId;
      // this.panelSeriesArray[i].header = `Panel ${i}`;
    }
  }

  private preprocessPanelsForStorage(panels: any[]): any[] {
    return panels.map(panel => {
      if (['ListBox', 'MultiSelectDropDown', 'DropdownList', 'Box', 'InputBox'].includes(panel.panelType)) {
        // Clear data fields for ListBox, MultiSelectDropdown, and Dropdown
        return {
          ...panel,
          content: {
            ...panel.content,
            dataSource: [], // Clear dataSource
            selectedValues_dataSource: [] // Clear selectedValues_dataSource
          }
        };
      } else if (panel.panelType === 'Pivot') {
        // Clear dataSourceSettings.dataSource for Pivot
        return {
          ...panel,
          content: {
            ...panel.content,
            dataSourceSettings: {
              ...panel.content.dataSourceSettings,
              dataSource: [] // Clear Pivot dataSourceSettings.dataSource
            }
          }
        };


      } else if (panel.panelType === 'Table') {
        // Clear dataSource for Table
        return {
          ...panel,
          content: {
            ...panel.content,
            dataSource: [] // Clear Table dataSource
          }
        };
      } else if (panel.panelType == "Chart") {
        let seriesArr = panel.content.series?.map((obj: any) => {
          return {
            ...obj,
            dataSource: []
          }
        })
        return {
          ...panel,
          content: {
            ...panel.content,
            dataSource: [],
            series: seriesArr
          }
        }
      }
      return panel; // Return unmodified for other panel types
    });
  }


  onDialogOpen(targetElement: HTMLElement, currentPosition: any): void {
    if (!targetElement) return;

    // Get the panel position relative to the page
    const rect = targetElement.getBoundingClientRect();
    const panelTop = rect.top + window.scrollY;  // Absolute position from the top of the page
    const panelLeft = rect.left + window.scrollX; // Absolute X position

    // //console.log("Panel Top:", panelTop, "Panel Left:", panelLeft, "ScrollY:", window.scrollY);

    // Set the popup position dynamically
    // formPopup position removed // Show below the clicked panel

    // **Prevent Syncfusion from changing scroll position**
    // setTimeout(() => {
    //   window.scrollTo({ top: panelTop}); // Keeps the current scroll position
    // }, 0);

    // // Refresh and open the popup
    // this.formPopup.refreshPosition();
    // this.formPopup.show();
  }


  resetscrollPosition = 0;

  onBeforeOpenDialog() {
    // this.resetscrollPosition = window.scrollY || document.documentElement.scrollTop;
  }


  onEditPanel(event: any, index: any) {

    let panelElement = ((<HTMLElement>event.target).offsetParent);
    if (!panelElement) return;
    this.getPanelIndex = index;

    if (panelElement) {
      this.getPanelArrayDataFromLocalStorage();
      let panelId = panelElement.id;
      let panel: any = this.panelSeriesArray.find((panel) => panel.id === panelId);

      let storedConnectionId: any = sessionStorage.getItem('connectionIdObj')

      this.panelHeader = `Create Panel - ${panel.panelType}`

      if (storedConnectionId != null || storedConnectionId != undefined) {
        storedConnectionId = JSON.parse(storedConnectionId);

        this.connectionId = storedConnectionId.connection_Id;

        panel = {
          ...panel,
          connection_id: this.connectionId

        }

        this.sendEditPanelObj = panel;
        this.panelType = panel.panelType;
        this.selectedPanelType = panel.panelType;

        // Set dialog to center position
        this.showFormPopup = true;
        this.visible = true;
        this.syncOverlay();
        this.changeDetectorRef.markForCheck();
      }

    }


  }

  aggregateCell(eve: any) {

    // // //console.log('Cell agragateInfo', eve)



  }

  getRowOrColumnCount(pivotValues: any, row: number, column: number): number {
    let count = 0;
    // Loop through the row/column to count the non-null values
    for (let i = 0; i < pivotValues.length; i++) {
      if (pivotValues[i][column] && pivotValues[i][column].value !== null) {
        count++;
      }
    }
    return count;
  }

  // onEnginePopulated(args: EnginePopulatedEventArgs) {
  //   const pivotValues = args.pivotValues;

  //   // Example: Calculating and inserting a "Grand Average Total" row
  //   if (pivotValues && pivotValues.length > 0) {
  //     const rowCount1 = pivotValues.length;
  //     const columnCount1 = pivotValues[0].length;

  //     // Create a new row for "Grand Average Total"
  //     const grandAverageRow = [];

  // //     //  //console.log('pivotValues', pivotValues)

  //     let grandTotalRow: any = pivotValues[pivotValues.length - 1];
  // //     // //console.log('Row Grand Totals:', grandTotalRow);

  //     // Accessing the grand total column (last column in each row)
  //     const grandTotalColumn = pivotValues.map(row => row[row.length - 1]);
  // //     // //console.log('Column Grand Totals:', grandTotalColumn);

  //     let totalSum = 0;
  //     let count = 0;

  // //     // //console.log('first row:', grandTotalRow[0]);
  // //     // //console.log('first column:', grandTotalColumn[0]);


  //     for (let i = 0; i < grandTotalRow.length; i++) {
  //       if (typeof grandTotalRow[i].value === 'number') {
  //         totalSum += grandTotalRow[i].value;
  //         count++;
  //       }
  //     }

  //     // Calculate the grand total average
  //     const grandTotalAverage = totalSum / count;

  //     // Insert the calculated grand total average into the first cell of the pivot table
  //     // pivotValues[0][0].value = grandTotalAverage;

  // //     //  //console.log('Grand Total Average:', grandTotalAverage);


  //   }
  // }


  private getPanelArrayDataFromLocalStorageold() {
    // //console.log('panelsarr', this.panelSeriesArray)
    let panelData = localStorage.getItem('createPanelSeriesArray');
    if (panelData !== null) {
      const parsedArray = JSON.parse(panelData);
      // //console.log('panelsarr after storage', this.panelSeriesArray)

      this.panelSeriesArray = parsedArray.map((parsedObj: any) => {
        const existingObj = this.panelSeriesArray.find((existingObj) => existingObj.id === parsedObj.id);

        // //console.log(existingObj);

        let dataSourceVal: any = [];
        let selectedValuesVal: any = [];

        if (existingObj.panelType == 'Pivot') {
          dataSourceVal = existingObj ? existingObj.content.dataSourceSettings?.dataSource : [];
        } else {
          dataSourceVal = existingObj ? existingObj.content.dataSource : [];
          selectedValuesVal = existingObj ? existingObj.content.selectedValues_dataSource : [];
        }


        let modifiedObj: any;

        if (parsedObj.panelType == 'Pivot') {
          modifiedObj = {
            ...parsedObj,
            content: {
              ...parsedObj.content,
              dataSourceSettings: {
                ...parsedObj.content.dataSourceSettings,
                dataSource: dataSourceVal

              }
            }
          };

        } else {
          modifiedObj = {
            ...parsedObj,
            content: {
              ...parsedObj.content,
              dataSource: dataSourceVal,
              selectedValues_dataSource: selectedValuesVal
            }
          };

        }

        return modifiedObj;
      });
    } else {
      this.panelSeriesArray = [];
    }
  }

  private getPanelArrayDataFromLocalStorage() {
    this.changeDetectorRef.markForCheck();
    // //console.log('panelsarr', this.panelSeriesArray);
    // let panelData = localStorage.getItem('createPanelSeriesArray');
    let panelData = sessionStorage.getItem('createPanelSeriesArray');



    if (panelData !== null) {
      const parsedArray = JSON.parse(panelData);
      // //console.log('panelsarr after storage', this.panelSeriesArray);

      this.panelSeriesArray = parsedArray.map((parsedObj: any) => {
        const existingObj = this.panelSeriesArray.find((existingObj) => existingObj.id === parsedObj.id);

        // // //console.log(existingObj);

        let dataSourceVal: any = [];
        let selectedValuesVal: any = [];
        let seriesVal: any = [];

        if (existingObj) {
          if (existingObj.panelType === 'Pivot') {
            dataSourceVal = existingObj.content.dataSourceSettings?.dataSource || [];
          } else if (existingObj.panelType === 'Chart') {
            dataSourceVal = existingObj.content.dataSource || [];
            seriesVal = existingObj.content.series?.map((seriesObj: any) => ({
              ...seriesObj,
              dataSource: seriesObj.dataSource || []
            })) || [];
          } else {
            dataSourceVal = existingObj.content.dataSource || [];
            selectedValuesVal = existingObj.content.selectedValues_dataSource || [];
          }
        }

        let modifiedObj: any;

        if (parsedObj.panelType === 'Pivot') {
          modifiedObj = {
            ...parsedObj,
            content: {
              ...parsedObj.content,
              dataSourceSettings: {
                ...parsedObj.content.dataSourceSettings,
                dataSource: dataSourceVal
              }
            }
          };
        } else if (parsedObj.panelType === 'Chart') {
          modifiedObj = {
            ...parsedObj,
            content: {
              ...parsedObj.content,
              dataSource: dataSourceVal,
              series: seriesVal
            }
          };
        } else if (parsedObj.panelType === 'Gauge') {
          modifiedObj = {
            ...parsedObj,
            content: {
              ...parsedObj.content,
              dataSource: dataSourceVal
            }
          };
        }
        else {
          modifiedObj = {
            ...parsedObj,
            content: {
              ...parsedObj.content,
              dataSource: dataSourceVal,
              selectedValues_dataSource: selectedValuesVal
            }
          };
        }

        return modifiedObj;
      });
    } else {
      this.panelSeriesArray = [];
    }
  }


  private saveDashboardObjToLocalStorage() {
    const dashboardObjCopy = JSON.parse(JSON.stringify(this.dashboardCreationObj)); // Create a copy of dashboardCreationObj
    const dashboardObjString = JSON.stringify(dashboardObjCopy);
    // localStorage.setItem('dashboardEditObj', dashboardObjString);
    sessionStorage.setItem('dashboardEditObj', dashboardObjString);


  }

  private loadDashboardObjFromLocalStorage() {
    // const dashboardObjString = localStorage.getItem('dashboardEditObj');
    const dashboardObjString = sessionStorage.getItem('dashboardEditObj');




    if (dashboardObjString) {
      this.dashboardCreationObj = JSON.parse(dashboardObjString);
      this.panelSeriesArray = this.dashboardCreationObj.panels;
    } else {
      this.dashboardCreationObj = {};
      this.panelSeriesArray = [];
    }
  }


  //Dashboard Layout's change event function
  onPositionChange(args: any) {
    const changedPanels = args.changedPanels;
    // // //console.log(changedPanels, 'Changed Panels');

    // let panelData = localStorage.getItem('createPanelSeriesArray');
    let panelData = sessionStorage.getItem('createPanelSeriesArray');



    if (panelData !== null) {
      panelData = JSON.parse(panelData);

      for (const panel of changedPanels) {
        if (Array.isArray(panelData)) {
          let panelToUpdate: PanelModel | null = panelData.find((ele) => ele.id === panel.id);

          if (panelToUpdate) {
            // Update only the changed properties
            panelToUpdate.sizeX = +panel.sizeX;
            panelToUpdate.sizeY = +panel.sizeY;
            panelToUpdate.col = +panel.col;
            panelToUpdate.row = +panel.row;

            // localStorage.setItem('createPanelSeriesArray', JSON.stringify(panelData));
            sessionStorage.setItem('createPanelSeriesArray', JSON.stringify(panelData));



            // Manually trigger change detection to update the view
            this.changeDetectorRef.detectChanges();
          }
        }
      }
    }
  }


  gridHeight: string = '100%';
  pivotHeight: string = '100';
  chartHeight: string = '100%';
  chartWidth: string = '100%';
  boxHeight: string = '150';

  //Dashboard Layout's resize event function


  sendConnectionObj: any;

  onMappingUserBtn() {

    // this.mappingUserFlag =  !this.mappingUserFlag;
    // // //console.log(this.mappingUserFlag)
    // let storedConnectionId: any = localStorage.getItem('connectionIdObj')
    let storedConnectionId: any = sessionStorage.getItem('connectionIdObj')



    if (storedConnectionId != null || storedConnectionId != undefined) {

      storedConnectionId = JSON.parse(storedConnectionId);
      // //console.log(storedConnectionId)

      this.showUserMappingModel = true;
      this.syncOverlay();
      // const [connectionName, connectionId] = storedConnectionId.connectionName.split('-')
      // // //console.log(connectionName, 'id', connectionId)
      let obj = {
        connectionName: storedConnectionId.connectionName,
        connection_id: storedConnectionId.connection_Id,
        ...storedConnectionId
      }
      this.sendConnectionObj = obj;
      // let storedMappingData = localStorage.getItem('mappingObj');
      let storedMappingData = sessionStorage.getItem('mappingObj');



      if (storedMappingData != null || storedMappingData != undefined) {
        this.sendMappingObj = JSON.parse(storedMappingData);
        this.roleMappingObj = this.sendMappingObj;
      }

      this.connectionId = storedConnectionId.connection_Id
      // const [connectionName, connectionId] = storedConnectionId.connectionName.split('-');
      // this.connectionIdFlag = false;
      // let obj = {
      //   ...this.sendConnectionObj,
      //   connectionName : connectionName,
      //   connection_id : this.connectionId
      // }
      // // //console.log(this.sendConnectionObj)
      // this.connectionId = storedConnectionId.connection_id
      // // //console.log(this.connectionId)
    }

  }
  roleMappingObj: any = {}
  getRoleMappingObj(eve: any) {
    // //console.log(eve,);
    this.roleMappingObj = eve;
    // localStorage.setItem('mappingObj', JSON.stringify(this.roleMappingObj));
    sessionStorage.setItem('mappingObj', JSON.stringify(this.roleMappingObj));



    this.showUserMappingModel = false;
    this.syncOverlay();

  }


  onDashboardTitleSubmit() {
    let formValue = this.dashboardTitleForm.value;

    if (this.dashboardTitleForm.valid) {
      // Handle the form submission logic
      // // //console.log('Form Submitted', this.dashboardTitleForm.value);

      // let mapingObj = localStorage.getItem('mappingObj');
      let mapingObj = sessionStorage.getItem('mappingObj');


      if (mapingObj != undefined || mapingObj != null) {
        mapingObj = JSON.parse(mapingObj);
      }

      let connectionString: string = "";
      // let storeConnectionObj: any = localStorage.getItem('connectionIdObj');
      let storeConnectionObj: any = sessionStorage.getItem('connectionIdObj');



      if (storeConnectionObj) {
        storeConnectionObj = JSON.parse(storeConnectionObj);
        // // //console.log('storeConnectionObj', storeConnectionObj)
        connectionString = storeConnectionObj.connectionName;

        this.connection_id = storeConnectionObj.connection_Id

      }

      this.getPanelArrayDataFromLocalStorage();
      this.changeDetectorRef.markForCheck();



      // let storedInitialFilters = localStorage.getItem('initialFilters');
      let storedInitialFilters = sessionStorage.getItem('initialFilters');

      if (storedInitialFilters != null || storedInitialFilters != undefined) {
        storedInitialFilters = JSON.parse(storedInitialFilters);
        // // //console.log(storedInitialFilters)
        this.initialFilterObj = storedInitialFilters
      }


      // let storedConnectionId : any = localStorage.getItem('connectionIdObj')
      let apiPanelsArr = this.panelSeriesArray;
      apiPanelsArr = this.panelSeriesArray.map((ele: any) => {
        if (ele.panelType == "Table") {
          return {
            ...ele,
            content: {
              ...ele.content,
              dataSource: []
            }
          }
        } else if (ele.panelType == "Pivot") {
          return {
            ...ele,
            content: {
              ...ele.content,
              dataSourceSettings: {
                ...ele.content.dataSourceSettings,
                dataSource: []
              }
            }
          }
        } else if (ele.panelType == "Chart") {
          let seriesArr = ele.content.series?.map((obj: any) => {
            return {
              ...obj,
              dataSource: []
            }
          })
          return {
            ...ele,
            content: {
              ...ele.content,
              dataSource: [],
              series: seriesArr
            }
          }
        } else if (ele.panelType == "Box" || ele.panelType == "DropdownList" || ele.panelType == "ListBox" || ele.panelType == "MultiSelectDropDown" || ele.panelType == 'InputBox') {
          return {
            ...ele,
            content: {
              ...ele.content,
              dataSource: [],
              selectedValues_dataSource: [],

            }
          }
        } else if (ele.panelType == "DatePicker" || ele.panelType == "DateRangePicker" || ele.panelType == "RawDataDump" || ele.panelType == "Card") {
          return {
            ...ele
          }

        }
        else if (ele.panelType == "Kanban") {
          return {
            ...ele,
            content: {
              ...ele.content,
              dataSource: []
            }
          }
        }
        else if (ele.panelType == "Gauge") {
          return {
            ...ele,
            content: {
              ...ele.content,
              dataSource: []
            }
          }
        }
        else if (ele.panelType == 'Calender') {
          console.log('ele while submitting the dashboard', ele)
          return {
            ...ele,
            content: {
              ...ele.content,
              dataSource: [],
              selectedValues_dataSource: [],
              eventSettings: {
                ...ele.content.eventSettings,
                dataSource: []
              },
              resources: {
                ...ele.content.resources,
                dataSource: []
              }
            }
          }
        }


        else {
          return {
            ...ele
          }
        }
      })



      // //   //console.log(this.connection_id)
      console.log('this.panelSeriesArray', this.panelSeriesArray)
      if (this.panelSeriesArray.length === 0) {
        alert('Please add panels to your dashboard before submitting.');
      } else {


        let hasEmptyPanel = false;

        this.panelSeriesArray.forEach((ele: any) => {
          if (ele.panelType !== "Card") {
            const panelKeys = Object.keys(ele.content);
            if (!panelKeys.includes('tableName')) {
              hasEmptyPanel = true;
            }
          }
        });

        // //console.log('this.panelSeriesArray', this.panelSeriesArray)
        console.log('apiPanelsArr', apiPanelsArr)
        console.log('this.dashboardCreationObj.allowFloating', this.dashboardCreationObj.allowFloating)

        if (hasEmptyPanel) {
          alert("Please do not submit the dashboard with an empty panel.");
        } else {
          let dashboardApiObj = {
            "dashboard_name": formValue.title,
            "dashboard_setup": {
              "dashboardObj": {
                "allowFloating": this.dashboardCreationObj.allowFloating,
                "allowDragging": true,
                "showGridLines": true,
                "cellAspectRatio": "100/80",
                "cellSpacing": [10, 10],
                "allowResizing": true,
                "connection_id": this.connection_id,
                "connection_Name": connectionString,
                "roleMapping": this.roleMappingObj,
                "panels": apiPanelsArr,
                "initialFilterObj": this.initialFilterObj ? this.initialFilterObj : {}

              }
            },
            specific_cache_exp: formValue.specific_cache_exp ? formValue.specific_cache_exp : 10,
            auto_refresh: formValue.auto_refresh ? formValue.auto_refresh : 0,
            version: null,

            // "group_name" : formValue.group_name ? formValue.group_name : [],
            "group_name": this.groupNameList ? this.groupNameList : [],
            "sub_group": this.subGroupList ? this.subGroupList : [],
            "image_name": this.imageName,
            'dashboard_image': this.imageUrl,
            "description": formValue.description ? formValue.description : "",
            "is_active": formValue.is_active,
          }

          console.log('dashboardApiObj', dashboardApiObj)

          // //console.log(dashboardApiObj)
          this.loaderService.show()
          this.chartService.updateDashboardById(this.editDashboardId, dashboardApiObj).subscribe(
            (res: any) => {
              console.log('dashboard api obj', res);
              this.loaderService.hide()

              this.popupService.showPopup({
                message: res.message,
                statusCode: res.status_code,
                status: res.success
              });


            },
            (err: any) => {
              this.loaderService.hide()

              this.popupService.showPopup({
                message: err.message,
                statusCode: err.status,
                status: false
              });

            }
          )
        }


      }



      this.showDashboardTitlePopup = false;
      this.syncOverlay();
    } else {
      this.dashboardTitleForm.markAllAsTouched(); // Mark all fields as touched to show validation messages
    }


  }
  refreshPage() {
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }
  load(args: ILoadedEventArgs): void {
    if (args && args.chart && args.chart.zoomModule) {
      args.chart.zoomModule.isZoomed = true;
    }
  }

  submitForm1() {
    this.loaderService.show()

    if (this.selectedPanelType == "Chart") {


      this.PropertyChartComponent.onDashboardCreationForm();
      // this.columnChart.refresh();
      this.showFormPopup = false;
    }
    if (this.selectedPanelType == "Table") {


      this.PropertyTableComponent.onTableFormSubmit();
      this.showFormPopup = false

    }
    if (this.selectedPanelType == "Pivot") {

      this.PivotPropertiesComponent.onGeneralFormSubmit();
      this.showFormPopup = false

    }
    if (this.selectedPanelType == "Box") {

      this.PropertyBoxComponent.onBoxFormSubmit();
      this.showFormPopup = false

    }
    if (this.selectedPanelType == "ListBox") {


      this.ListboxPropertiesComponent.onBoxFormSubmit();
      this.showFormPopup = false;

    }
    if (this.selectedPanelType == "DropdownList") {


      this.DropdownPropertiesComponent.onBoxFormSubmit();
      this.showFormPopup = false;

    }
    if (this.selectedPanelType == "DatePicker") {


      this.DatepickerComponent.onBoxFormSubmit();
      this.showFormPopup = false;
    }
    if (this.selectedPanelType == "DateRangePicker") {


      this.DaterangepickerComponent.onBoxFormSubmit();
      this.showFormPopup = false
    }
    if (this.selectedPanelType == "MultiSelectDropDown") {

      this.PropertyMultiselectdropdownComponent.onBoxFormSubmit();
      this.showFormPopup = false;

    }

    if (this.selectedPanelType == "RawDataDump") {


      const isFormValid = this.RawdatadumpComponent.onSubmit();
      this.loaderService.hide()
      if (isFormValid) {
        this.showFormPopup = false;
      }

    }
    this.syncOverlay();
  }

  submitForm() {
    this.loaderService.show()


    if (this.selectedPanelType == "Chart") {

      let validForm: any = this.PropertyChartComponent.onDashboardCreationForm();

      if (validForm) {

        this.showFormPopup = false
      } else {
        this.loaderService.hide()

      }

    }
    if (this.selectedPanelType == "Calender") {

      // const isFormValid = this.CardTemplateComponent.onBoxFormSubmit();
      // console.log('isFormValid', isFormValid)
      this.PropertySceduleComponent.onSubmit();
      this.loaderService.hide()
      this.showFormPopup = false;


    }

    if (this.selectedPanelType == "Table") {



      let validForm: any = this.PropertyTableComponent.onTableFormSubmit();

      if (validForm) {

        this.showFormPopup = false
      } else {
        this.loaderService.hide()

      }

    }
    if (this.selectedPanelType == "Pivot") {
      this.loaderService.hide()

      this.PivotPropertiesComponent.onGeneralFormSubmit();
      this.showFormPopup = false

    }
    if (this.selectedPanelType == "Box") {

      // this.PropertyBoxComponent.onBoxFormSubmit();
      // this.showFormPopup = false



      let validForm: any = this.PropertyBoxComponent.onBoxFormSubmit();

      if (validForm) {

        this.showFormPopup = false
      } else {
        this.loaderService.hide()

      }

    }
    if (this.selectedPanelType == "ListBox") {

      let validForm: any = this.ListboxPropertiesComponent.onBoxFormSubmit();
      // this.showFormPopup = false;


      if (validForm) {

        this.showFormPopup = false
      } else {
        this.loaderService.hide()

      }

    }
    if (this.selectedPanelType == "DropdownList") {

      // this.DropdownPropertiesComponent.onBoxFormSubmit();
      // this.showFormPopup = false;


      let validForm: any = this.DropdownPropertiesComponent.onBoxFormSubmit();

      if (validForm) {

        this.showFormPopup = false
      } else {
        this.loaderService.hide()

      }

    }
    if (this.selectedPanelType == "DatePicker") {


      let validForm: any = this.DatepickerComponent.onBoxFormSubmit();;


      if (validForm) {

        this.showFormPopup = false
      } else {
        this.loaderService.hide()

      }


    }
    if (this.selectedPanelType == "DateRangePicker") {

      let validForm: any = this.DaterangepickerComponent.onBoxFormSubmit();


      if (validForm) {

        this.showFormPopup = false
      } else {
        this.loaderService.hide()

      }


    }

    if (this.selectedPanelType == "MultiSelectDropDown") {
      // this.PropertyMultiselectdropdownComponent.onBoxFormSubmit();
      // this.showFormPopup = false;

      let validForm: any = this.PropertyMultiselectdropdownComponent.onBoxFormSubmit();
      // this.showFormPopup = false;


      if (validForm) {

        this.showFormPopup = false
      } else {
        this.loaderService.hide()

      }

    }

    if (this.selectedPanelType == "InputBox") {
      // this.PropertyMultiselectdropdownComponent.onBoxFormSubmit();
      // this.showFormPopup = false;

      let validForm: any = this.InputBoxPropertiesComponent.onBoxFormSubmit();
      // this.showFormPopup = false;


      if (validForm) {

        this.showFormPopup = false
      } else {
        this.loaderService.hide()

      }

    }


    if (this.selectedPanelType == "RawDataDump") {

      const isFormValid = this.RawdatadumpComponent.onSubmit();
      // //console.log('isFormValid', isFormValid)

      if (isFormValid) {
        this.showFormPopup = false;
      } else {
        this.loaderService.hide()

      }
    }

    if (this.selectedPanelType == "Card") {

      // const isFormValid = this.CardTemplateComponent.onBoxFormSubmit();
      // //console.log('isFormValid', isFormValid)
      this.CardTemplateComponent.onBoxFormSubmit();
      this.loaderService.hide()
      this.showFormPopup = false;


    }
    if (this.selectedPanelType == "Kanban") {

      let validForm: any = this.KanbanPropertiesComponent.onKanbanFormSubmit();

      if (validForm) {
        this.showFormPopup = false;
      } else {
        this.loaderService.hide();
      }
    }
    if (this.selectedPanelType == "Gauge") {

      let validForm: any = this.guageChartPropertiesComponent.onDashboardCreationForm();

      if (validForm) {
        this.showFormPopup = false;
      } else {
        this.loaderService.hide();
      }
    }
    this.syncOverlay();
  }


  onDashboardSave() {
    this.showDashboardTitlePopup = true;
    this.syncOverlay();
    this.changeDetectorRef.markForCheck();
  }
  imageUrl: any;
  imageName: any;

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        // //console.log(e.target)
        this.imageUrl = e.target?.result;
        // //console.log(this.imageUrl)
      };

      reader.readAsDataURL(file);
      this.imageName = file.name;
      // //console.log('Selected file name:', file.name);
    }
  }

  showInitalFilterPopup: boolean = false;
  @ViewChild(InitialFiltersComponent) InitialFiltersComponent!: InitialFiltersComponent;

  // initial filters
  sendfilterObj: any;
  initialFilterObj: any;
  intitalFilterFlag: boolean = false;

  applyInititalFilters() {
    // let storedConnectionId: any = localStorage.getItem('connectionIdObj');
    let storedConnectionId: any = sessionStorage.getItem('connectionIdObj');



    if (storedConnectionId != null || storedConnectionId != undefined) {
      storedConnectionId = JSON.parse(storedConnectionId);
      // //console.log(storedConnectionId, 'storedConnectionId');
      this.connectionId = storedConnectionId.connection_Id
      this.showInitalFilterPopup = true;
      this.syncOverlay();
      let obj = {
        connection_id: this.connectionId,
        ...this.initialFilterObj
      }
      // //console.log(obj)

      this.sendfilterObj = obj
      // let storedInitialFIlters: any = localStorage.getItem('initialFilters');
      let storedInitialFIlters: any = sessionStorage.getItem('initialFilters');



      if (storedInitialFIlters != null || storedInitialFIlters != undefined) {
        storedInitialFIlters = JSON.parse(storedInitialFIlters);
        // //console.log(storedInitialFIlters)
        this.initialFilterObj = storedInitialFIlters
        let obj = {
          connection_id: this.connectionId,
          ...this.initialFilterObj
        }
        // //console.log(obj)

        this.sendfilterObj = obj
      }


    }
  }

  initialFilterSubmitClose() {
    this.InitialFiltersComponent.onInitialFilterSubmit();

    let isValidFilters = this.InitialFiltersComponent.onInitialFilterSubmit();

    if (isValidFilters) {
      this.showInitalFilterPopup = false;
      this.syncOverlay();

    }

  }

  initialFilterDeleteClose() {
    this.InitialFiltersComponent.deleteInitialFilter()

    this.showInitalFilterPopup = false;
    this.syncOverlay();


  }

  getInitialFIlters(eve: any) {
    this.initialFilterObj = eve;
    // //console.log(this.initialFilterObj)
    // localStorage.setItem('initialFilters', JSON.stringify(this.initialFilterObj))
    sessionStorage.setItem('initialFilters', JSON.stringify(this.initialFilterObj))


  }

  downloadDumpReports(item: any) {
    // //console.log('dump reports item', item);
    // let panelData: any = localStorage.getItem('storedDrilldownAndFilterArray');
    let panelData: any = sessionStorage.getItem('storedDrilldownAndFilterArray');

    if (panelData) {
      panelData = JSON.parse(panelData)
    }
    let filterObj = panelData?.filter_obj ? panelData?.filter_obj : [];
    // //console.log('filterObj', filterObj)
    this.loaderService.show()

    this.chartService.downloadDumpReports(this.editDashboardId, item.id, filterObj).subscribe(
      (res: any) => {
        this.loaderService.hide()

        if (res.success == true) {
          // //console.log('res', res)
          let data: any = res['data'].dataSource;
          // const orderedData = this.convertDates(data, item.content.fieldDetails);
          this.excelService.exportAsExcelFile(data, item.header);
        } else {
          this.loaderService.hide()
          // this.showPopup(false, '35px', res.message);
          this.popupService.showPopup({
            message: res.message,
            statusCode: res.status_code,
            status: res.success
          });
        }
      },
      (err: any) => {
        this.loaderService.hide()
        this.popupService.showPopup({
          message: err.message,
          statusCode: err.status,
          status: false
        });
      }
    )


  }

  onViewClick() {
    let name = this.dashboardName;
    let id = this.editDashboardId
    this.router.navigate(['/sidebar/panel/panelView', id]);
  }


  // code for chatbot ai 

  // code for ai chatbot 
  @ViewChild('dialogAIAssistView')
  dialogAIAssistView!: AIAssistViewComponent;
  showAssistViewDlg: boolean = false;

  openChatbot() {
    console.log('hello')
    this.showAssistViewDlg = true;
    this.syncOverlay();
  }


  promptsData: PromptModel[] = [
    {
      response: "Ask Questions, to better understand how your prompt interacts with AI-generated or default data responses..!"
    }
  ];
  defaultSuggestions: string[] = [
    "How to create a box templates?",
    "How to create a chart?",
    "How to assign role mapping ?",
  ];

  defaultPromptResponseData: { [key: string]: string | string[] }[] = [
    {
      prompt: "How to create a box templates?",
      response: "<p>To create box component click on add icon then add a form  <p>Would you like more tips on any of these steps?</p>",
      suggestions: [
        "How to add background color to box?",
        "How to add fieldDetails here?"
      ]
    },
    {
      prompt: "How to create a chart?",
      response: "<p>To publish an e-book, follow the steps below:</p> <ol><li><strong>Write and format your e-book:</strong> Ensure your content is well-organized, edited, and formatted for digital reading.</li> <li><strong>Choose a publishing platform:</strong> Platforms like Amazon Kindle Direct Publishing (KDP) or Smashwords can help you publish and distribute your e-book.</li> <li><strong>Develop a marketing strategy:</strong> Utilize social media, email newsletters, and book promotion sites to create buzz and reach your target audience.</li> <li><strong>Launch and promote:</strong> Schedule a launch date, gather reviews, and continue promoting through various channels to maintain momentum and drive sales.</li></ol> <p>Do you have a specific topic in mind for your e-book?</p>",
      suggestions: [
        "How do I create an eye-catching e-book cover?",
        "What are common mistakes to avoid in e-book covers?"
      ]
    },
    {
      prompt: "How do I prioritize tasks effectively?",
      response: "<p>To stay focused and productive, set daily goals by:</p> <ol><li><strong>Identifying Priorities:</strong> List important tasks based on deadlines or significance.</li> <li><strong>Breaking Down Tasks:</strong> Divide larger tasks into smaller, manageable steps.</li> <li><strong>Setting SMART Goals:</strong> Ensure goals are Specific, Measurable, Achievable, Relevant, and Time-bound. </li> <li><strong>Time Blocking:</strong> Schedule specific times for each task to stay organized.</li></ol> <p> Need more tips on any of these steps? </p>"
    },
    {
      prompt: "What tools or apps can help me prioritize tasks?",
      response: "<p>Here are some tools to help you prioritize tasks effectively:</p> <ol><li><strong>Google Keep:</strong> For simple note-taking and task organization with labels and reminders.</li> <li><strong>Scoro:</strong> A project management tool for streamlining activities and team collaboration.</li> <li><strong>Evernote:</strong> Great for note-taking, to-do lists, and reminders.</li> <li><strong>Todoist:</strong> A powerful task manager for setting priorities and tracking progress.</li></ol> <p>Are you looking for tools to manage a specific type of task or project?</p>"
    },
    {
      prompt: "How do I create an eye-catching e-book cover?",
      response: "<p>Creating an eye-catching e-book cover involves a few key steps:</p> <ol><li><strong>Understand your genre and audience:</strong> Research covers of popular books in your genre to see what appeals to your target readers.</li> <li><strong>Choose the right imagery and colors:</strong> Use high-quality images and a color scheme that reflects the tone and theme of your book.</li> <li><strong>Focus on typography:</strong> Select fonts that are readable and complement the overall design. The title should be prominent and easy to read even in thumbnail size.</li> <li><strong>Use design tools or hire a professional:</strong> Tools like Canva or Adobe Spark can help you create a professional-looking cover. Alternatively, consider hiring a graphic designer for a more polished result.</li></ol> <p>Would you like some tips on where to find good images or fonts for your cover?</p>"
    },
    {
      prompt: "What are common mistakes to avoid in e-book covers?",
      response: "<p>Here are some common mistakes to avoid when designing an e-book cover:</p> <ol><li><strong>Cluttered design:</strong> Overloading the cover with too many elements can make it look messy and unprofessional. Keep it simple and focused.</li> <li><strong>Poor quality images:</strong> Using low-resolution or generic stock images can detract from the overall appeal. Always opt for high-quality, relevant visuals.</li> <li><strong>Unreadable fonts:</strong> Fancy or overly intricate fonts can be hard to read, especially in thumbnail size. Choose clear, legible fonts for the title and author name.</li> <li><strong>Ignoring genre conventions:</strong> Each genre has its own visual cues. Not adhering to these can confuse potential readers about the book’s content.</li> <li><strong>Inconsistent branding:</strong> If you have a series or multiple books, ensure a consistent style across all covers to build a recognizable brand.</li></ol> <p>Would you like any specific advice on designing your cover?</p>"
    }
  ];

  prompts: { [key: string]: string | string[] }[] = this.defaultPromptResponseData;

  suggestions: string[] = this.defaultSuggestions;

  toolbarItemClicked = (args: any) => {
    if (args.item.iconCss === 'e-icons e-close') {
      this.dialogOpenClose();
    }
    if (args.item.iconCss === 'e-icons e-assist-copy') {
      var targetElem = document.querySelector('.right-content .content');
      var response = this.dialogAIAssistView.prompts[args.dataIndex].response;
      if (targetElem) {
        targetElem.innerHTML += response + '<br />';
        this.dialogOpenClose();
      }
    }
  };

  dialogOpenClose = () => {
    this.showAssistViewDlg = !this.showAssistViewDlg;
  };


  assistViewToolbarSettings: any = {
    items: [{ iconCss: 'e-icons e-close', align: 'Right' }],
    itemClicked: this.toolbarItemClicked
  };

  responseToolbarSettings: ResponseToolbarSettingsModel = {
    itemClicked: this.toolbarItemClicked
  };

  promptRequest = (args: PromptRequestEventArgs) => {
    console.log('args prompt', args);
    let obj = {
      "prompt": args.prompt
    }

    this.chartService.postPromptToAi(obj).subscribe(
      (res: any) => {
        console.log('res ', res);

        let resData = res[0].output;
        let foundPrompt = resData.response;

        console.log('foundPrompt ', foundPrompt);

        let defaultResponse = 'There is no answer for this query';

        this.dialogAIAssistView.addPromptResponse(foundPrompt ? foundPrompt : defaultResponse);
        this.dialogAIAssistView.promptSuggestions = resData?.['suggestions'] as string[] || this.suggestions;
      },

      (err: any) => {
        console.log('err', err)
      })

    setTimeout(() => {


    }, 2000);
  };


  // kanban code 
  public enableContent: boolean = true;
  getString(assignee: string): string {

    if (!assignee) return '';
    return assignee.split(' ').map(name => name.charAt(0).toUpperCase()).join('');
  }
  getTags(tags: string): string[] {
    if (!tags) return [];
    return tags.split(',').map(tag => tag.trim()).filter(tag => tag);
  }
  getKanbanColumns(item: any): any[] {
    const keyField = item.content.keyField;
    if (!item.content.dataSource || item.content.dataSource.length === 0) {
      return [
        { headerText: 'To Do', keyField: 'To Do' },
        { headerText: 'In Progress', keyField: 'InProgress' },
        { headerText: 'Validation', keyField: 'Validation' },
        { headerText: 'Done', keyField: 'Done' }
      ];
    }

    // Otherwise detect dynamically
    const uniqueStatuses = Array.from(new Set(item.content.dataSource.map((data: any) => {
      const v = data[keyField];
      return v === null || v === undefined ? '' : String(v);
    }))) as string[];

    const statusOrder = ['To Do', 'InProgress', 'In Progress', 'Validation', 'Done', 'Close'];


    const sortedStatuses = uniqueStatuses.sort((a: string, b: string) => {
      const indexA = statusOrder.indexOf(a);
      const indexB = statusOrder.indexOf(b);


      if (indexA === -1) return 1;
      if (indexB === -1) return -1;

      return indexA - indexB;
    });

    return sortedStatuses.map(status => ({
      headerText: this.formatHeaderText(status),
      keyField: status
    }));
  }
  formatHeaderText(status: string): string {
    const headerMap: { [key: string]: string } = {
      'To Do': 'To Do',
      'InProgress': 'In Progress',
      'In Progress': 'In Progress',
      'Validation': 'Validation',
      'Done': 'Done',
      'Close': 'Done'
    };

    return headerMap[status] || status;
  }
  getFieldValue(fieldDetails: any, fieldName: string): string {
    if (!fieldDetails) return '';

    if (Array.isArray(fieldDetails)) {
      return fieldDetails[0]?.[fieldName] || '';
    }
    return fieldDetails[fieldName] || '';
  }
  onDialogOpens(args: any): void {
    if (args.requestType === 'Edit') {
      const dialog = args.element;
      if (dialog) {
        let dialogTitle = dialog.querySelector('.e-dlg-header-content .e-title-text');
        if (!dialogTitle) {
          dialogTitle = dialog.querySelector('.e-dlg-header-content');
        }
        if (dialogTitle) {
          dialogTitle.textContent = 'Card Details';
          dialogTitle.style.fontSize = '18px';
          dialogTitle.style.fontWeight = '400';
          dialogTitle.style.color = '#212529';
        }
      }

      setTimeout(() => {
        if (dialog) {
          const inputs = dialog.querySelectorAll('input:not([type="button"]), textarea');
          inputs.forEach((input: any) => {
            input.setAttribute('readonly', 'readonly');
            input.disabled = true;
            input.style.backgroundColor = '#f8f9fa';
            input.style.cursor = 'not-allowed';
            input.style.border = '1px solid #e9ecef';
            input.style.color = '#495057';
            input.style.fontWeight = '500';
          });

          const dropdowns = dialog.querySelectorAll('.e-dropdownlist');
          dropdowns.forEach((dropdown: any) => {
            if (dropdown.ej2_instances && dropdown.ej2_instances[0]) {
              const instance = dropdown.ej2_instances[0];
              instance.readonly = true;
              instance.enabled = false;
            }
            dropdown.style.backgroundColor = '#f8f9fa';
            dropdown.style.cursor = 'not-allowed';

            const dropdownInput = dropdown.querySelector('input');
            if (dropdownInput) {
              dropdownInput.style.color = '#495057';
              dropdownInput.style.fontWeight = '500';
            }
          });

          const datePickers = dialog.querySelectorAll('.e-datepicker, .e-datetimepicker');
          datePickers.forEach((picker: any) => {
            if (picker.ej2_instances && picker.ej2_instances[0]) {
              const instance = picker.ej2_instances[0];
              instance.readonly = true;
              instance.enabled = false;
            }
            const input = picker.querySelector('input');
            if (input) {
              input.style.backgroundColor = '#f8f9fa';
              input.style.cursor = 'not-allowed';
              input.style.color = '#495057';
              input.style.fontWeight = '500';
            }
          });

          const saveBtn = dialog.querySelector('.e-primary');
          const deleteBtn = dialog.querySelector('.e-dialog-delete');
          if (saveBtn) saveBtn.style.display = 'none';
          if (deleteBtn) deleteBtn.style.display = 'none';
        }
      }, 50);
    }
  }

  getDialogSettings(item: any): any {
    const fields: any[] = [];

    // Add ID field (headerField from cardSettings)
    if (item.content.cardSettings?.headerField) {
      fields.push({
        text: 'ID',
        key: item.content.cardSettings.headerField,
        type: 'TextBox'
      });
    }

    // Add Title field (contentField or titleField)
    const titleField = item.content.fieldDetails?.[0]?.titleField ||
      item.content.fieldDetails?.titleField ||
      item.content.cardSettings?.contentField;
    if (titleField) {
      fields.push({
        text: 'Title',
        key: titleField,
        type: 'TextArea'
      });
    }

    // Add Status field (keyField)
    if (item.content.keyField) {
      fields.push({
        text: 'Status',
        key: item.content.keyField,
        type: 'TextBox'
      });
    }

    // Add Assignee field (swimlaneSettings keyField)
    if (item.content.swimlaneSettings?.keyField) {
      fields.push({
        text: 'Assignee',
        key: item.content.swimlaneSettings.keyField,
        type: 'TextBox'
      });
    }

    // // Add Type field
    // const typeField = this.getFieldValue(item.content.fieldDetails, 'typeField');
    // if (typeField) {
    //   fields.push({
    //     text: 'Type',
    //     key: typeField,
    //     type: 'DropDown'
    //   });
    // }

    // // Add Priority field
    // const priorityField = this.getFieldValue(item.content.fieldDetails, 'priorityField');
    // if (priorityField) {
    //   fields.push({
    //     text: 'Priority',
    //     key: priorityField,
    //     type: 'DropDown'
    //   });
    // }

    // Add Description field
    // const descriptionField = this.getFieldValue(item.content.fieldDetails, 'descriptionField') ||
    //   this.getFieldValue(item.content.fieldDetails, 'summaryField');
    // if (descriptionField) {
    //   fields.push({
    //     text: 'Description',
    //     key: descriptionField,
    //     type: 'TextArea'
    //   });
    // }

    const contentField = this.getFieldValue(item.content.fieldDetails, 'contentField') ||
      this.getFieldValue(item.content.fieldDetails, 'contentField');
    if (contentField) {
      fields.push({
        text: 'Description',
        key: contentField,
        type: 'TextArea'
      });
    }

    const startDateField = this.getFieldValue(item.content.fieldDetails, 'startDateField');
    if (startDateField) {
      fields.push({
        text: 'Start Date',
        key: startDateField,
        type: 'TextBox'
      });
    }

    const endDateField = this.getFieldValue(item.content.fieldDetails, 'endDateField');
    if (endDateField) {
      fields.push({
        text: 'End Date',
        key: endDateField,
        type: 'TextBox'
      });
    }
    return { fields: fields };
  }

  getTypeFieldStyle(issueType: string): any {
    if (!issueType) {
      return {
        'padding': '3px 8px',
        'background-color': '#d1ecf1',
        'color': '#0c5460',
        'border-radius': '10px',
        'font-size': '11px',
        'font-weight': '500'
      };
    }

    const issueTypeLower = issueType.toLowerCase().trim();

    if (issueTypeLower === 'bug') {
      return {
        'padding': '2px 6px',
        'background-color': '#ef5350',
        'color': '#ffffff',
        'border-radius': '10px',
        'font-size': '10px',
        'font-weight': '600'
      };
    } else if (issueTypeLower === 'story') {
      return {
        'padding': '2px 6px',
        'background-color': '#3d92f4ff',
        'color': '#ffffff',
        'border-radius': '10px',
        'font-size': '10px',
        'font-weight': '600'
      };
    } else if (issueTypeLower === 'epic') {
      return {
        'padding': '2px 6px',
        'background-color': '#fbc02d',
        'color': '#000000',
        'border-radius': '10px',
        'font-size': '10px',
        'font-weight': '600'
      };
    }


  }

  public virtualscroll: boolean = true;


  pivotDisplayOptions: { [key: string]: string } = {};

  // onPivotDisplayChange(event: any, item: any) {
  //   const isChart = event.checked;
  //   const selectedValue = isChart ? 'Chart' : 'Table';

  //   const pivotView = this.panelSeriesArray.find(p => p.id === item.id);

  //   if (!pivotView) return;

  //   this.pivotDisplayOptions[item.id] = selectedValue;

  //   const pivotInstance = (this.pivotviews.find(pv => pv.element.id === item.id)) as PivotViewComponent;
  //   if (pivotInstance) {
  //     pivotInstance.displayOption = { view: selectedValue as any };
  //     pivotInstance.refresh();
  //   }

  //   this.changeDetectorRef.detectChanges();
  // }

  private applyPivotHeaderFormattingDOM(pivotviewObj: PivotViewComponent, item: any): void {
    if (!item?.content?.headerFormatting || !pivotviewObj?.element) {
      return;
    }

    const applyFormatting = () => {
      const pivotContainer = pivotviewObj.element;
      const headerFormatting = item.content.headerFormatting;

      const dataSourceSettings = item.content.dataSourceSettings;
      const rowFields = dataSourceSettings?.rows?.map((r: any) => r.name) || [];
      const columnFields = dataSourceSettings?.columns?.map((c: any) => c.name) || [];
      const valueFields = dataSourceSettings?.values?.map((v: any) => v.name) || [];
      const dataSource = dataSourceSettings?.dataSource || [];

      // Build field-to-values map
      const fieldValueMap: { [fieldName: string]: Set<string> } = {};
      rowFields.forEach((fieldName: string) => {
        fieldValueMap[fieldName] = new Set();
        dataSource.forEach((row: any) => {
          if (row[fieldName] != null) {
            fieldValueMap[fieldName].add(String(row[fieldName]).trim());
          }
        });
      });

      // Get all header cells
      // Get all HEADER cells only (not data cells)
      const allHeaders = pivotContainer.querySelectorAll(
        '.e-rowsheader, .e-columnsheader, .e-columnheader, .e-stackedheadercelldiv'
      );

      // console.log('📌 Total header cells found:', allHeaders.length);

      allHeaders.forEach((headerCell: Element) => {
        const headerElement = headerCell as HTMLElement;

        // Skip if this is a data cell (value cell), only format actual header cells
        if (headerElement.classList.contains('e-cell') ||
          headerElement.classList.contains('e-valuescell') ||
          headerElement.classList.contains('e-datacell') ||
          headerElement.getAttribute('aria-role') === 'gridcell' ||
          headerElement.parentElement?.classList.contains('e-valueheader')) {
          return;
        }

        const cellValue = headerElement.querySelector('.e-cellvalue');

        let headerText = '';
        if (cellValue) {
          headerText = (cellValue as HTMLElement).innerText?.trim() || '';
        } else {
          headerText = headerElement.innerText?.trim() || '';
        }

        if (!headerText) return;

        // console.log('📌 Processing header:', headerText, 'Classes:', headerElement.className);

        // Determine field ownership
        let belongsToField: string | null = null;

        if (headerElement.classList.contains('e-rowsheader') ||
          headerElement.classList.contains('e-stot') ||
          headerElement.classList.contains('e-gtot')) {

          // Match against actual data values
          for (const fieldName of rowFields) {
            if (fieldValueMap[fieldName]?.has(headerText)) {
              belongsToField = fieldName;
              break;
            }
          }

          // Fallback to column index
          if (!belongsToField) {
            const colIndex = parseInt(headerElement.getAttribute('aria-colindex') || '0');
            if (colIndex >= 0 && colIndex < rowFields.length) {
              belongsToField = rowFields[colIndex];
            }
          }
        } else if (headerElement.classList.contains('e-columnsheader') ||
          headerElement.classList.contains('e-columnheader') ||
          headerElement.classList.contains('e-stackedheadercelldiv')) {

          if (valueFields.includes(headerText)) {
            belongsToField = headerText;
          } else if (columnFields.length > 0) {
            belongsToField = columnFields[0];
          }
        }

        // Apply formatting
        headerFormatting.forEach((format: any) => {
          if (!format) return;

          let matched = false;

          // Try fieldName match first
          if (format.fieldName) {
            const fieldNames = Array.isArray(format.fieldName)
              ? format.fieldName
              : [format.fieldName];

            matched = fieldNames.some((fieldName: string) =>
              belongsToField?.toLowerCase() === fieldName.toLowerCase()
            );
          }

          // Fallback to labelName match if fieldName didn't match
          if (!matched && format.labelName) {
            const labelNames = Array.isArray(format.labelName)
              ? format.labelName
              : [format.labelName];

            matched = labelNames.some((labelName: string) =>
              headerText.toLowerCase().trim() === labelName.toLowerCase().trim()
            );
          }

          if (matched) {
            // ✅ Apply styles with !important to prevent overriding
            if (format.backgroundColor) {
              headerElement.style.setProperty('background-color', format.backgroundColor, 'important');
            }

            if (format.color) {
              headerElement.style.setProperty('color', format.color, 'important');
              // Apply to all nested elements
              const cellValueElem = headerElement.querySelector('.e-cellvalue');
              if (cellValueElem) {
                (cellValueElem as HTMLElement).style.setProperty('color', format.color, 'important');
              }
            }

            if (format.fontSize) {
              headerElement.style.setProperty('font-size', format.fontSize, 'important');
            }

            if (format.fontWeight) {
              headerElement.style.setProperty('font-weight', format.fontWeight, 'important');
            }

            if (format.fontStyle) {
              headerElement.style.setProperty('font-style', format.fontStyle, 'important');
            }

            // ✅ Also apply to nested .e-cellvalue
            if (cellValue) {
              const cellValueEl = cellValue as HTMLElement;

              if (format.color) {
                cellValueEl.style.setProperty('color', format.color, 'important');
              }
              if (format.fontSize) {
                cellValueEl.style.setProperty('font-size', format.fontSize, 'important');
              }
              if (format.fontWeight) {
                cellValueEl.style.setProperty('font-weight', format.fontWeight, 'important');
              }
              if (format.fontStyle) {
                cellValueEl.style.setProperty('font-style', format.fontStyle, 'important');
              }
            }
          }
        });
      });
    };

    // ✅ Apply immediately
    applyFormatting();

    // ✅ Re-apply after a delay to catch any re-renders
    setTimeout(() => applyFormatting(), 100);
    setTimeout(() => applyFormatting(), 300);
    setTimeout(() => applyFormatting(), 500);
  }
  onEventRendered(args: any, item: any): void {
    // console.log('Event Rendered - args:', args);
    // console.log('Event Rendered - item:', item);
    // console.log('Conditional Formatting:', item.content.conditionalFormatting);

    // Initialize conditionalFormatting as empty array if not present
    if (!item.content.conditionalFormatting) {
      item.content.conditionalFormatting = [];
    }

    // Ensure the event element is visible and has content
    if (args.element) {
      // Make sure the element is visible by default
      args.element.style.display = '';
      args.element.style.visibility = 'visible';
      args.element.style.opacity = '1';
    }

    // Check if conditional formatting is configured
    if (item.content.conditionalFormatting.length === 0) {
      // console.log('No conditional formatting rules found');
      return;
    }

    const eventData = args.data;
    // console.log('Event Data:', eventData);

    let conditionMatched = false;

    // Loop through all conditional formatting rules
    item.content.conditionalFormatting.forEach((condition: any) => {
      // console.log('Checking condition:', condition);

      const fieldValue = eventData[condition.measure];
      // console.log(`Field: ${condition.measure}, Value: ${fieldValue}`);

      // Skip if field doesn't exist in event data
      if (fieldValue === undefined || fieldValue === null) {
        // console.log(`Field ${condition.measure} not found in event data`);
        return;
      }

      let shouldApplyStyle = false;

      // Convert values to numbers if needed
      const numericFieldValue = Number(fieldValue);
      const numericValue1 = Number(condition.value1);
      const numericValue2 = Number(condition.value2);

      // Check condition type - normalize the condition string
      const conditionType = condition.conditions;

      switch (conditionType) {
        case '>':
        case 'GreaterThan':
          shouldApplyStyle = numericFieldValue > numericValue1;
          break;
        case '>=':
        case 'GreaterThanOrEqualTo':
          shouldApplyStyle = numericFieldValue >= numericValue1;
          break;
        case '<':
        case 'LessThan':
          shouldApplyStyle = numericFieldValue < numericValue1;
          break;
        case '<=':
        case 'LessThanOrEqualTo':
          shouldApplyStyle = numericFieldValue <= numericValue1;
          break;
        case '=':
        case 'Equals':
        case 'Equal':
          shouldApplyStyle = fieldValue == condition.value1;
          break;
        case '!=':
        case 'NotEquals':
        case 'NotEqual':
          shouldApplyStyle = fieldValue != condition.value1;
          break;
        case 'Between':
          shouldApplyStyle = numericFieldValue >= numericValue1 &&
            numericFieldValue <= numericValue2;
          break;
        case 'contains':
          shouldApplyStyle = String(fieldValue).toLowerCase().includes(String(condition.value1).toLowerCase());
          break;
        case 'notContains':
          const isEmptyValue = fieldValue === null ||
            fieldValue === undefined ||
            (typeof fieldValue === 'string' && fieldValue.trim() === '');
          shouldApplyStyle = isEmptyValue;
          break;
        case 'None':
          shouldApplyStyle = true; // Apply to all events
          break;
      }

      // console.log('Should apply style:', shouldApplyStyle);

      // Apply styles if condition is met
      if (shouldApplyStyle && condition.style) {
        conditionMatched = true;
        if (args.element) {
          // console.log('Applying styles to element:', condition.style);

          // Apply background color
          if (condition.style.backgroundColor) {
            args.element.style.setProperty('background-color', condition.style.backgroundColor, 'important');
          }

          // Apply text color
          if (condition.style.color) {
            args.element.style.setProperty('color', condition.style.color, 'important');
          }

          // Apply font size - ensure it has 'px' unit
          if (condition.style.fontSize) {
            const fontSize = condition.style.fontSize.includes('px')
              ? condition.style.fontSize
              : condition.style.fontSize + 'px';
            args.element.style.fontSize = fontSize;
          }

          // Apply font family
          if (condition.style.fontFamily) {
            args.element.style.fontFamily = condition.style.fontFamily;
          }

          // Apply font weight if available
          if (condition.style.fontWeight) {
            args.element.style.fontWeight = condition.style.fontWeight;
          }

          // Apply font style if available
          if (condition.style.fontStyle) {
            args.element.style.fontStyle = condition.style.fontStyle;
          }

          // Add a custom class for additional styling if needed
          args.element.classList.add('custom-formatted-event');
        } else {
          // console.log('args.element is null or undefined');
        }
      }
    });

    // If no condition matched, ensure default styling is applied
    if (!conditionMatched && args.element) {
      // Ensure text is visible with default styling
      if (!args.element.style.color || args.element.style.color === 'transparent') {
        args.element.style.color = '#000000'; // Default text color
      }
    }
  }


  // guage code 
  getGaugePointerValue(item: any): number {
    const valueField = item.content.gauge?.valueField;
    if (!item.content.dataSource || item.content.dataSource.length === 0) {
      return 0;
    }
    // Get value from first row of dataSource
    const firstRow = item.content.dataSource[0];
    const value = firstRow[valueField];
    return value !== null && value !== undefined ? +value : 0;
  }

  getGaugeTitle(item: any): string {
    const titleField = item.content.gauge?.valueField;
    if (!item.content.dataSource || item.content.dataSource.length === 0) {
      return item.content.title || '';
    }
    return item.content.title || '';
  }

  buildLegendSettings(item: any): object {
    const legends = item.content?.legends;
    return {
      visible: legends?.visible ?? true,
      position: legends?.position || 'Bottom',
      // shape: 'Circle',
      shape: legends?.shape || 'Circle',
      toggleVisibility: true,
      height: '30',
      padding: 5,
      shapeHeight: 10,
      shapeWidth: 10,
      margin: { top: 0, bottom: 0, left: 0, right: 0 },
      textStyle: {
        size: legends?.textStyle?.size
          ? String(legends.textStyle.size).replace('px', '') + 'px'
          : '11',
        color: legends?.textStyle?.color || '#444444',
        fontFamily: 'inherit'
      }
    };
  }
  buildGaugeTooltip(item: any): object {
    if (!item) return { enable: false };
    const labelFormat = item.content?.gauge?.axis?.labelFormat || '{value}';
    const prefix = labelFormat.includes('$') ? '$' : '';
    const suffix = labelFormat.includes('%') ? '%' : '';
    return {
      enable: true,
      type: ['Pointer', 'Range'],
      showAtMousePosition: true,
      format: `${prefix}{value}${suffix}`,
      enableAnimation: false,
      textStyle: {
        size: '12px',
        fontFamily: 'inherit'
      },
      rangeSettings: {
        showAtMousePosition: true,
        format: `Start: ${prefix}{start}${suffix} <br/> End: ${prefix}{end}${suffix}`,
        textStyle: {
          size: '12px',
          fontFamily: 'inherit'
        }
      }
    };
  }

  formatHour(hour: number): string {
    if (hour === undefined || hour === null) {
      return '09:00';
    }
    return hour.toString().padStart(2, '0') + ':00';
  }


  //kanban borders
  getCardBorderStyle(issueType: string): any {
    const colorMap: { [key: string]: string } = {
      'bug': '#ef5350',  // red
      'story': '#3d92f4',  // blue
      'epic': '#fbc02d',  // yellow
      'task': '#66bb6a',  // green (optional fallback)
    };

    const key = (issueType || '').toLowerCase().trim();
    const color = colorMap[key] || '#e0e0e0'; // default grey

    return {
      'border-left': `4px solid ${color}`,
      'border-radius': '4px',
      'padding': '10px',
      'background-color': '#ffffff'
    };
  }

  // ── Modal stacking fix ─────────────────────────────
  // #target has position:relative + z-index from Syncfusion sidebar,
  // creating a stacking context that traps position:fixed modals.
  // Set z-index to 'auto' when any modal is open to break the context.
  private syncOverlay(): void {
    const anyOpen = this.showDefaultDialog       ||
                    this.showTabelNameDlg         ||
                    this.showFormPopup             ||
                    this.showDashboardTitlePopup   ||
                    this.showConnectionFormPopup   ||
                    this.showUserMappingModel      ||
                    this.showInitalFilterPopup     ||
                    this.showAssistViewDlg;
    const zVal = anyOpen ? 'auto' : '';
    const t = document.getElementById('target') as HTMLElement | null;
    const d = document.querySelector<HTMLElement>('.dashboardParent');
    if (t) t.style.zIndex = zVal;
    if (d) d.style.zIndex = zVal;
  }

  closeDefaultDialog()        { this.showDefaultDialog       = false; this.syncOverlay(); this.changeDetectorRef.detectChanges(); }
  closeTabelNameDlg()         { this.showTabelNameDlg        = false; this.syncOverlay(); this.changeDetectorRef.detectChanges(); }
  closeFormPopup()            { this.showFormPopup            = false; this.syncOverlay(); this.changeDetectorRef.detectChanges(); }
  closeDashboardTitlePopup()  { this.showDashboardTitlePopup  = false; this.syncOverlay(); this.changeDetectorRef.detectChanges(); }
  closeConnectionFormPopup()  { this.showConnectionFormPopup  = false; this.syncOverlay(); this.changeDetectorRef.detectChanges(); }
  closeUserMappingModel()     { this.showUserMappingModel     = false; this.syncOverlay(); this.changeDetectorRef.detectChanges(); }
  closeInitalFilterPopup()    { this.showInitalFilterPopup    = false; this.syncOverlay(); this.changeDetectorRef.detectChanges(); }
  closeAssistViewDlg()        { this.showAssistViewDlg        = false; this.syncOverlay(); this.changeDetectorRef.detectChanges(); }

  openOverlay(): void { this.syncOverlay(); this.changeDetectorRef.detectChanges(); }
}



