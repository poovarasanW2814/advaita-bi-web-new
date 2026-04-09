import { DatePipe, NgIf, NgFor, NgClass, NgStyle } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, HostListener, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren, inject} from '@angular/core';
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, NavigationEnd, NavigationStart } from '@angular/router';
import { ChartComponent, AccumulationChartComponent, AnimationModel, IMouseEventArgs, indexFinder, ILoadedEventArgs, IAccTextRenderEventArgs, IAccTooltipRenderEventArgs, ExportType, IAxisLabelRenderEventArgs, ITooltipRenderEventArgs, ChartTheme, ChartModule, AccumulationChartModule } from '@syncfusion/ej2-angular-charts';
import { CheckBoxSelection, DropDownList, DropDownListComponent, FilteringEventArgs, ListBoxComponent, MultiSelectComponent, VirtualScroll, visualMode, MultiSelectModule, DropDownListModule, ListBoxModule } from '@syncfusion/ej2-angular-dropdowns';
import { GridComponent, GroupSettingsModel, FilterSettingsModel, SelectionSettingsModel, QueryCellInfoEventArgs, DataStateChangeEventArgs, ExcelExportProperties, ColumnMenuOpenEventArgs, ColumnMenuItemModel, Grid, VirtualScroll as GridVirtualScroll, GridModule } from '@syncfusion/ej2-angular-grids';
import { DashboardLayoutComponent, PanelModel, DashboardLayoutModule } from '@syncfusion/ej2-angular-layouts';
import { ClickEventArgs, FieldSettingsModel, TabComponent } from '@syncfusion/ej2-angular-navigations';
import { CellTemplateArgs, DisplayOption, EnginePopulatedEventArgs, PivotView, PivotViewComponent, ToolbarItems, VirtualScroll as PivotVirtualScroll, PageSettings, PagerSettings, BeforeExportEventArgs, PivotViewModule } from '@syncfusion/ej2-angular-pivotview';
import { DialogComponent, AnimationSettingsModel, setSpinner, hideSpinner, Tooltip, DialogModule } from '@syncfusion/ej2-angular-popups';
import { ProgressBar } from '@syncfusion/ej2-angular-progressbar';
import { interval, Observable, Subscription } from 'rxjs';
import { ExportService } from '@syncfusion/ej2-angular-charts'
import { ChartService } from 'src/app/core/services/chart.service';
import { PanelServiceService } from 'src/app/core/services/panel-service.service';
import { GridSettings } from '@syncfusion/ej2-pivotview/src/pivotview/model/gridsettings';
import { PropertyChartComponent } from '../../panel-properties/property-chart/property-chart.component';
import { PropertyBoxComponent } from '../../panel-properties/property-box/property-box.component';
import { DataManager, Query } from '@syncfusion/ej2-data';
import { ChangeEventArgs } from '@syncfusion/ej2-angular-inputs';
import { ExcelExportService } from 'src/app/core/services/excel-export.service';
import { Browser, EmitType, Internationalization } from '@syncfusion/ej2-base';
import { LoaderService } from 'src/app/core/services/loader.service';
import * as moment from 'moment';
import { ItemModel, DropDownButtonModule } from '@syncfusion/ej2-angular-splitbuttons';
import { PopupService } from 'src/app/core/services/popup.service';
import { DashboardBasedAccessService } from 'src/app/core/services/dashboard-based-access.service';
import { marked } from 'marked';
import { MenuBasedAccessService } from 'src/app/core/services/menu-based-access.service';
import { UserService } from 'src/app/core/auth-services/user.service';
import { TimeScaleModel, ScheduleModule } from '@syncfusion/ej2-angular-schedule';
import { ChartSettings } from '@syncfusion/ej2-pivotview/src/pivotview/model/chartsettings';
import { DropDownButton } from '@syncfusion/ej2-splitbuttons';
import * as XLSX from 'xlsx';
import { CircularGaugeComponent, CircularGaugeModule } from '@syncfusion/ej2-angular-circulargauge';
import { LegendService, GaugeTooltipService, ImageExportService } from '@syncfusion/ej2-angular-circulargauge';
import { AIAssistViewModule } from '@syncfusion/ej2-angular-interactive-chat';
import { KanbanModule } from '@syncfusion/ej2-angular-kanban';
import { ButtonModule, SwitchModule } from '@syncfusion/ej2-angular-buttons';
import { DateRangePickerModule, DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import { RichTextEditorModule } from '@syncfusion/ej2-angular-richtexteditor';


DropDownListComponent.Inject(VirtualScroll);
MultiSelectComponent.Inject(VirtualScroll);
GridComponent.Inject(GridVirtualScroll);
MultiSelectComponent.Inject(CheckBoxSelection);
//  PivotView.Inject(PivotVirtualScroll);

@Component({
    selector: 'app-dashbord-page-vieww',
    templateUrl: './dashbord-page-vieww.component.html',
    styleUrls: ['./dashbord-page-vieww.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [LegendService, GaugeTooltipService, ImageExportService],
    imports: [NgIf, DashboardLayoutModule, NgFor, NgClass, DropDownButtonModule, MultiSelectModule, ScheduleModule, AIAssistViewModule, FormsModule, GridModule, ChartModule, KanbanModule, ButtonModule, PivotViewModule, AccumulationChartModule, NgStyle, DateRangePickerModule, DatePickerModule, DropDownListModule, ListBoxModule, CircularGaugeModule, DialogModule, SwitchModule, RichTextEditorModule, DatePipe]
})

export class DashbordPageViewwComponent implements OnInit, OnDestroy, AfterViewInit {
  private titleSubscription: Subscription | undefined;
  @ViewChild('createDashboard') createDashboard!: DashboardLayoutComponent;
  @ViewChild('chart') columnChart!: ChartComponent;
  @ViewChild('chartRef') charts!: ChartComponent;
  @ViewChildren('chartRef') chartRefSData!: QueryList<AccumulationChartComponent>;
  // @ViewChildren('chartRef') chartRefs!: QueryList<ChartComponent>;

  @ViewChild('pie') pieChart!: ChartComponent;
  // @ViewChild('grid') grid!: GridComponent;
  @ViewChildren('grid') grids!: QueryList<GridComponent>;
  @ViewChild('grid1') grid1!: GridComponent;
  @ViewChild('defaultDialog') defaultDialog!: DialogComponent;
  @ViewChild('editerViewDlg') editerViewDlg!: DialogComponent;
  @ViewChild('promptDialog') promptDialog!: DialogComponent;



  @ViewChild('formPopup') formPopup!: DialogComponent;
  @ViewChild('pivotview', { static: false }) pivotview!: PivotViewComponent;
  @ViewChild('dashboardTitlePopup') dashboardTitlePopup!: DialogComponent;
  @ViewChild('filteredListDlg') filteredListDlg!: DialogComponent;
  @ViewChild('icons') iconDropDownList!: DropDownListComponent;
  @ViewChild(PropertyBoxComponent) boxPropertiesComponent!: PropertyBoxComponent;
  @ViewChild(PropertyChartComponent) chartPropertiesComponent!: PropertyChartComponent;
  @ViewChild('listboxObj') listboxObj!: ListBoxComponent;
  @ViewChild('defaultDialog1')
  defaultDialog1 !: DialogComponent;
  @ViewChild('listboxObj') listboxObjELe!: ElementRef;
  @ViewChild('tabComponent') tab!: TabComponent
  @ViewChildren('circularGauge') gaugeRefSData!: QueryList<CircularGaugeComponent>;
  target: string = '.control-section';
  dataManager!: DataManager;
  gridtoolbarOptions?: ToolbarItems[];
  groupOptions!: GroupSettingsModel;
  filterSettings!: FilterSettingsModel;
  gridSettings!: GridSettings;
  editDashboardId!: any;
  onTextRender: Function | any;
  cellAspectRatio: any;
  selectDateFromDate: any;
  mediaQuery: string = 'max-width: 700px';
  dashboard_name: string = "";
  description: string = "";
  filterValue: string = "";
  dashboardName: string = "";
  target1: string = '.control-section1';
  drilldownFlag: boolean = false;
  dialogCloseIcon: Boolean = true;
  isIndeterminate?: boolean = true;
  loaderFlag: boolean = true;
  loaderFlag1: boolean = false;
  // initialPage: any = { pageSizes: true, pageCount: 4 };
  initialPage: any = { pageSizes: ['20', '50', '100', '200', '500', '1000'], };

  auto_refreshTime: number | null = 0; // Value in minutes (set dynamically as per your requirement)
  private refreshInterval: any;

  gaugeExportDropdownItems: ItemModel[] = [
    { text: 'JPEG' },
    { text: 'PNG' },
    { text: 'SVG' },
    { text: 'XLSX' }
  ];


  eventSettings: any;

  animation: AnimationModel = { enable: true, duration: 3000, delay: 1 };
  animationSettings1: AnimationSettingsModel = { effect: 'Zoom' };
  selectionSettings: any = {
    showCheckbox: true,
    showSelectAll: true
  };
  tableDataSource: any = [];
  panelSeriesArray: any[] = []
  cellSpacing: number[] = Browser.isDevice ? [5, 2] : [10, 10];
  panelsArrayFromApi: any = [];
  listboxFilterItemData: any = [];
  originalData: { [key: string]: any[] } = {};
  filteredData: { [key: string]: any[] } = {};
  avgValue: number = 0;
  grandTotalAvgValue: number = 0
  labelNameValue: string = "";
  refreshCatcheTime: any = '';
  observable = new Observable();
  initialFilerObj: any = {};
  listBoxfields: any = { text: 'item', value: 'item' };
  multiselectFields: any = { text: 'displayItem', value: 'uiValue' };
  wrapSettings = { wrapMode: 'Both' };
  listBoxgroupBy: Object = {
    groupBy: 'isMatched',
    text: 'isMatched',
    header: (data: any): string => {
      return data.isMatched ? 'Matched' : 'Not Matched';
    }
  };
  selectedItems: any[] = []; // Array to store selected items
  selectedItemsMap: { [key: string]: any[] } = {};
  explicitEmptySelectionMap: { [key: string]: boolean } = {};
  private readonly emptyMultiselectTokenPrefix = '__empty_multiselect__::';

  filterandDrilldownObjArray: any = { filter_obj: [], drilldown_obj: [], disabled_filterObj: [], drilldown_table_obj: [] };

  listBoxBgColor!: string;
  initialData: { [key: string]: any[] } = {};
  selectedDateRanges: { [key: string]: any } = {};
  isparent: boolean = true;

  clickedChartId: any;
  drilldownObjectArr: any = [];
  currentLevel = 0;
  selectedValueFilterArr: any = [];
  chipTexts: string[] = [];
  selectedDropdownValue: string = '';
  selectedDropdownValuesObj: { [key: string]: any } = {};
  userFlag: boolean = false;
  selectedFilterValue: boolean = true;

  //   pivotVirtualScrollSettings: any = {
  //     allowSinglePage: true
  // }




  items: ItemModel[] = [
    {
      text: 'Current Page',
      iconCss: 'fas fa-file-excel'
    },
    {
      text: 'All Pages',
      iconCss: 'fas fa-file-excel',
    }

  ];

  exportDropdownItems: ItemModel[] = [
    {
      text: 'JPEG'
    },
    {
      text: 'PNG',
    },
    {
      text: 'SVG',
    },
    {
      text: 'PDF',
    },
    {
      text: 'XLSX',
    }

  ];

  PivottoolbarOptions!: ToolbarItems[];

  dashboardCreationObj: any = {
    allowFloating: true,
    allowDragging: true,
    showGridLines: true,
    cellAspectRatio: "100/80",
    cellSpacing: [10, 10],
    allowResizing: true,
    panels: []
  }

  public pageSettings!: PageSettings;
  public pagerSettings!: PagerSettings;
  public pagerPositions: string[] = ['Top', 'Bottom'];
  public pageSizes: string[] = ['Row', 'Column', 'Both', 'None'];
  public pagerViewData: string[] = ['Row', 'Column', 'Both'];

  public chartSettings!: ChartSettings;
  public displayOption!: DisplayOption;
  public ToolbarOptions!: ToolbarItems[];
  chartTypeItems = [
    { text: 'Column', id: 'Column' },
    { text: 'Bar', id: 'Bar' },
    { text: 'Line', id: 'Line' },
    { text: 'Area', id: 'Area' },
    { text: 'Pie', id: 'Pie' },
    { text: 'Doughnut', id: 'Doughnut' },
    { text: 'Funnel', id: 'Funnel' },
    { text: 'Pyramid', id: 'Pyramid' }
  ];



  private readonly panelService = inject(PanelServiceService);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  private readonly formBuilder = inject(FormBuilder);
  private readonly chartService = inject(ChartService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);
  private readonly datePipe = inject(DatePipe);
  private readonly excelService = inject(ExcelExportService);
  private readonly loaderService = inject(LoaderService);
  private readonly popupService = inject(PopupService);
  private readonly dashboardBasedAccessService = inject(DashboardBasedAccessService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly menuBasedAccessService = inject(MenuBasedAccessService);
  private readonly userService = inject(UserService);
  constructor() {
    this.router.events.subscribe(event => {
          if (event instanceof NavigationEnd) {
    
    
            sessionStorage.removeItem('panelSeriesArray')
            sessionStorage.removeItem('selectedDashboardObj')
            sessionStorage.removeItem('storedDrilldownAndFilterArray')
            sessionStorage.removeItem('dataSourceStorageObj')
  }
    });
  }
  ngAfterViewInit(): void {
    // throw new Error('Method not implemented.');
    //  this.cdr.detectChanges()
  }

  private routerEventsSub!: Subscription;



  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    let screenWidth = window.innerWidth;
    let landscapeView = window.matchMedia('(orientation: landscape)').matches;

    if (screenWidth <= 760 && landscapeView) {
      this.cellAspectRatio = 0.45;
    } else if (screenWidth <= 760 && !landscapeView) {
      this.cellAspectRatio = 100 / 8;
    } else {
      this.cellAspectRatio = 100 / 80;
    }

    setTimeout(() => {
      this.panelSeriesArray.forEach((panel: any) => {
        if (panel.panelType === 'Gauge') {
          const gaugeEl = document.querySelector(`#${panel.id}`) as any;
          if (gaugeEl?.ej2_instances?.[0]) {
            gaugeEl.ej2_instances[0].refresh();
          }
        }
      });
    }, 300);
  }

  onResizeStop(event: any): void {
    const panelElement = event.element as HTMLElement;
    if (!panelElement) return;
    const gaugeEl = panelElement.querySelector(
      '.e-panel-container .e-panel-content ejs-circulargauge'
    ) as any;
    if (gaugeEl) {
      const gaugeObj = gaugeEl.ej2_instances?.[0];
      if (gaugeObj) {
        gaugeObj.width = '100%';
        gaugeObj.height = '100%';
        gaugeObj.refresh();
      }
    }
  }



  private readonly debounceDelay = 200;
  progressBarTop = '50%';
  private updateProgressBarPosition(): void {
    const viewportHeight = window.innerHeight;
    const windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
    const scrollY = window.scrollY;

    const topPosition = Math.max(0, (windowHeight - viewportHeight) / 2 + scrollY);
    this.progressBarTop = `${topPosition}px`;
  }
  dropdownDatamanger!: DataManager;

  dropdownQuery: Query = new Query().take(40);
  onBegin: any = (e: any, item: any) => {
    e.query = new Query().take(45);
  };

  onActionDropdownComplete(eve: any) {
    // console.log('eve in actioncomplete')
  }

  //   private refreshAllGrids(): void {
  //   if (!this.grids) return;

  //   this.grids.forEach((grid: GridComponent) => {
  //     if (grid) {
  //       try {
  //         grid.refreshColumns();
  //         grid.refreshHeader();
  //         grid.refresh();
  //       } catch {}
  //     }
  //   });
  // }

  private chartRefreshTimer: any;
  private chartRefreshRetryTimers: any[] = [];
  private chartMountState: { [panelId: string]: boolean } = {};

  private setChartMountState(panelIds: string[], mounted: boolean): void {
    panelIds.forEach((panelId) => {
      this.chartMountState[panelId] = mounted;
    });
  }

  isChartMounted(panelId: string): boolean {
    return this.chartMountState[panelId] !== false;
  }

  private refreshSingleChartInstance(instance: any): void {
    if (!instance || typeof instance.refresh !== 'function') return;

    try {
      instance.dataBind?.();
      instance.refresh();
    } catch {
      // Ignore per-chart refresh errors.
    }
  }

  private refreshAllChartInstancesOnce(): void {
    const chartElements = document.querySelectorAll('ejs-chart, ejs-accumulationchart');
    chartElements.forEach((el: Element) => {
      const host: any = el as any;
      const instances = host?.ej2_instances;
      if (Array.isArray(instances) && instances[0]) {
        this.refreshSingleChartInstance(instances[0]);
      }
    });
  }

  private refreshRenderedCharts(): void {
    // Clear any pending timers to avoid race conditions from rapid updates
    if (this.chartRefreshTimer) {
      clearTimeout(this.chartRefreshTimer);
    }
    if (this.chartRefreshRetryTimers.length > 0) {
      this.chartRefreshRetryTimers.forEach((timerRef) => clearTimeout(timerRef));
      this.chartRefreshRetryTimers = [];
    }

    // Use a single, slightly delayed timeout to run after Angular's current digest cycle
    this.chartRefreshTimer = setTimeout(() => {
      // Use rAF to run before the next repaint, ensuring the DOM is up-to-date
      requestAnimationFrame(() => {
        // First, refresh all chart instances to bind the new data that Angular has set
        this.refreshAllChartInstancesOnce();

        // Then, dispatch a resize event. This is a common and effective pattern for Syncfusion
        // components to force them to recalculate their dimensions and layout, fixing many rendering glitches.
        window.dispatchEvent(new Event('resize'));

        // Finally, run change detection again. This ensures that the view is updated
        // if any properties on the components were changed as a result of the refresh or resize.
        this.cdr.detectChanges();
      });
    }, 250); // A 250ms delay provides a safe margin for initial rendering to complete.
  }

  private toBoolean(value: any): boolean {
    if (typeof value === 'string') {
      const normalized = value.trim().toLowerCase();
      if (normalized === 'true') return true;
      if (normalized === 'false') return false;
    }
    return !!value;
  }

  public isTimelineView: boolean = false;
  public currentView: string = "Day";

  private sanitizeSelectionValues(values: any, allowEmptyString: boolean = false): any[] {
    if (!Array.isArray(values)) {
      return [];
    }

    return values.filter((val: any) => {
      if (val === null || val === undefined) {
        return false;
      }

      if (val === '') {
        return allowEmptyString;
      }

      return true;
    });
  }

  private getEmptyMultiselectToken(panelId: string): string {
    return `${this.emptyMultiselectTokenPrefix}${panelId}`;
  }

  private toMultiselectUiValue(value: any, panelId: string): any {
    return value === '' ? this.getEmptyMultiselectToken(panelId) : value;
  }

  private fromMultiselectUiValue(value: any, panelId: string): any {
    return value === this.getEmptyMultiselectToken(panelId) ? '' : value;
  }

  private decorateMultiselectData(data: any[], panelId: string): any[] {
    return (data || []).map((entry: any) => {
      const rawItem = entry?.item ?? entry;
      const isObjectEntry = entry && typeof entry === 'object' && !Array.isArray(entry);

      if (!isObjectEntry) {
        return {
          item: rawItem,
          displayItem: rawItem,
          uiValue: this.toMultiselectUiValue(rawItem, panelId)
        };
      }

      return {
        ...entry,
        displayItem: rawItem,
        uiValue: this.toMultiselectUiValue(rawItem, panelId)
      };
    });
  }

  private decodeMultiselectValues(values: any, panelId: string): any[] {
    if (!Array.isArray(values)) {
      return [];
    }

    return values.map((val: any) => this.fromMultiselectUiValue(val, panelId));
  }

  getMultiselectUiSelection(panelId: string): any[] {
    return this.decorateMultiselectData(
      this.sanitizeSelectionValues(
        this.selectedItemsMap[panelId],
        !!this.explicitEmptySelectionMap[panelId]
      ),
      panelId
    ).map((entry: any) => entry.uiValue);
  }

  private syncPanelSelectionState(panel: any): void {
    if (!panel?.id) {
      return;
    }

    const matchingFilter = this.filterandDrilldownObjArray?.filter_obj?.find((obj: any) =>
      obj?.id === panel.id &&
      obj?.table_name === panel?.content?.tableName &&
      obj?.field_name === panel?.content?.fieldDetails?.fieldName
    );

    const sanitizedValues = this.sanitizeSelectionValues(
      matchingFilter?.values,
      !!this.explicitEmptySelectionMap[panel.id]
    );

    this.selectedItemsMap[panel.id] = sanitizedValues;
  }

  // dynamically switch between timeline and normal views
  public getViews(): any[] {
    return this.isTimelineView
      ? [
        { option: "TimelineDay", startHour: "09:30", endHour: "18:00" },
        { option: "TimelineWeek" },
        { option: "TimelineWorkWeek" },
        { option: "TimelineMonth" },
        { option: "Agenda" }
      ]
      : [
        { option: "Day", startHour: "09:00", endHour: "20:00" },
        { option: "Week" },
        { option: "WorkWeek" },
        { option: "Month" },
        { option: "Year" },
        { option: "Agenda" }
      ];
  }



  // handle toolbar click (similar to your example)
  public onToolbarItemClicked(args: ClickEventArgs): void {
    switch (args.item.text) {
      case "Day":
        this.currentView = this.isTimelineView ? "TimelineDay" : "Day";
        break;
      case "Week":
        this.currentView = this.isTimelineView ? "TimelineWeek" : "Week";
        break;
      case "WorkWeek":
        this.currentView = this.isTimelineView ? "TimelineWorkWeek" : "WorkWeek";
        break;
      case "Month":
        this.currentView = this.isTimelineView ? "TimelineMonth" : "Month";
        break;
      case "Year":
        this.currentView = this.isTimelineView ? "TimelineYear" : "Year";
        break;
      case "Agenda":
        this.currentView = "Agenda";
        break;
    }
  }



  onFilteredIconClick() {
    this.defaultDialog1.show();
    this.showNote = true;

    // let panelData: any = localStorage.getItem('storedDrilldownAndFilterArray');
    let panelData: any = sessionStorage.getItem('storedDrilldownAndFilterArray');

    if (panelData) {
      panelData = JSON.parse(panelData);

      // Clean up empty values from filter objects
      if (panelData.filter_obj && Array.isArray(panelData.filter_obj)) {
        panelData.filter_obj.forEach((ele: any) => {
          if (ele.object_type === "ListBox" || ele.object_type === 'MultiSelectDropDown' || ele.panelType === 'InputBox') {
            // âœ… FIX: Only filter null and undefined, keep empty strings as they may be valid values
            if (Array.isArray(ele.values)) {
              ele.values = ele.values.filter((val: any) => val !== null && val !== undefined);
            }
          }
        });

        // Remove filter objects with empty values arrays
        panelData.filter_obj = panelData.filter_obj.filter((ele: any) => {
          if (ele.object_type === "ListBox" || ele.object_type === 'MultiSelectDropDown' || ele.panelType === 'InputBox') {
            return Array.isArray(ele.values) && ele.values.length > 0;
          }
          return true; // Keep other types as-is
        });
      }

      this.filterandDrilldownObjArray = panelData;
      this.updateChipTexts();
      // this.changeDetectorRef.detectChanges()
    }

    setTimeout(() => {
      this.showNote = false;
    }, 2000);
  }

  queryCell(args: any): void {

    (this.pivotview.renderModule as any).rowCellBoundEvent(args);

    if (args.data[0].valueSort && args.cell.classList.contains('e-rowsheader') && args.cell.classList.contains('e-gtot') && args.cell.classList.contains('e-rowcell')) {
      args.cell.querySelector('.e-cellvalue').innerText = "Total";
    }

    if (args.cell.classList.contains('e-rowsheader') && args.cell.classList.contains('e-rowcell')) {
      args.cell.style.textAlign = "left"
    }
  }



  queryCellHeaderINfo(args: any): void {
    if (args.node.innerText == 'Grand Total') {
      //// console.log('args', args.node.innerText)
      args.node.innerText = 'Total'
    }

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


  private pivotHeaderFormattingTimers: { [panelId: string]: any } = {};
  private pivotTimeFieldsCache: { [panelId: string]: Set<string> } = {};
  private pivotValueFormatFieldsCache: { [panelId: string]: Set<string> } = {};
  private pivotLightModeCache: { [panelId: string]: boolean } = {};
  private readonly pivotLightModeThreshold = 2000;

  private isPivotLightMode(item: any): boolean {
    const panelId = item?.id;
    if (!panelId) return false;

    const dataLength = item?.content?.dataSourceSettings?.dataSource?.length || 0;
    const isExplicitlyDisabled = item?.content?.disablePivotLightMode === true;
    const isLightMode = !isExplicitlyDisabled && dataLength >= this.pivotLightModeThreshold;
    this.pivotLightModeCache[panelId] = isLightMode;
    return isLightMode;
  }

  onEnginePopulated(args: EnginePopulatedEventArgs, item: any, pivotviewObj: PivotViewComponent) {
    // âœ… FIX: Update panel immutably for OnPush detection
    const panelIndex = this.panelSeriesArray.findIndex(p => p.id === item.id);

    if (panelIndex !== -1 && this.panelSeriesArray[panelIndex].isLoading) {
      this.panelSeriesArray = [
        ...this.panelSeriesArray.slice(0, panelIndex),
        { ...this.panelSeriesArray[panelIndex], isLoading: false },
        ...this.panelSeriesArray.slice(panelIndex + 1)
      ];
      this.cdr.detectChanges();
      // Update local reference for rest of function
      item = this.panelSeriesArray[panelIndex];
    }

    if (!item.content?.dataSourceSettings?.dataSource ||
      (Array.isArray(item.content?.dataSourceSettings?.dataSource) &&
        item.content.dataSourceSettings.dataSource.length === 0)) {
      // Already handled above if isLoading was true
    }

    if (this.isPivotLightMode(item)) {
      return;
    }

    const panelId = item?.id;
    const valueFormatFieldNames = panelId ? (this.pivotValueFormatFieldsCache[panelId] || new Set<string>()) : new Set<string>();

    if (args.pivotValues && valueFormatFieldNames.size > 0) {
      args.pivotValues.forEach((row: any[]) => {
        row.forEach((cell: any) => {
          if (!cell || cell.axis !== 'value') return;

          if (cell.value === null || cell.value === undefined || String(cell.value).trim() === '') {
            cell.formattedText = '';
            return;
          }

          if (cell.formattedText &&
            (cell.formattedText.trim() === '%' ||
              cell.formattedText.trim() === '0%' ||
              cell.formattedText.trim() === '00%') &&
            (cell.value === 0 || cell.value === null || cell.value === undefined)) {
            cell.formattedText = '';
            return;
          }

          const actualText = String(cell.actualText ?? '').trim();
          if (!valueFormatFieldNames.has(actualText)) return;

          const isGrandTotalRow =
            (typeof cell.rowHeaders === 'string' && cell.rowHeaders.toLowerCase().includes('grand total')) ||
            (typeof cell.columnHeaders === 'string' && cell.columnHeaders.toLowerCase().includes('grand total'));

          cell.formattedText = isGrandTotalRow ? `${cell.value}` : `${cell.value}%`;
        });
      });
    }


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






  onPivotAggregateCellInfo(args: any, pivotviewObj: PivotViewComponent, item: any) {
    // Skip processing only if args is completely invalid
    if (!args) {
      return;
    }

    // â”€â”€ STRING VALUE FIELD OVERRIDE â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    const fieldDetails = item?.content?.fieldDetails || [];

    // DEBUG: log once per unique fieldName to understand structure
    console.log('[StringOverride] args.fieldName:', args.fieldName);
    console.log('[StringOverride] fieldDetails:', JSON.stringify(fieldDetails));
    console.log('[StringOverride] args.rawItems:', args.rawItems);
    console.log('[StringOverride] args.cellSets:', args.cellSets);

    const stringValueFields: string[] = fieldDetails
      .filter((f: any) => {
        // Guard: check BOTH spellings of feildType/fieldType since there's a known typo
        const fType = f.feildType || f.fieldType;
        const dType = f.dataType;
        console.log('[StringOverride] field:', f.name, '| feildType:', f.feildType, '| fieldType:', f.fieldType, '| dataType:', dType);
        return fType === 'Value' && dType === 'string';
      })
      .map((f: any) => f.name);

    console.log('[StringOverride] stringValueFields:', stringValueFields, '| current fieldName:', args.fieldName);

    if (stringValueFields.includes(args.fieldName)) {
      // Try rawItems first, fall back to cellSets
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
    // â”€â”€ END STRING VALUE FIELD OVERRIDE â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

    // Handle empty cells but don't skip formatting
    if (!args.value && args.value !== 0) {
      args.value = '';
      args.displayText = '';
      // Don't return - continue to apply formatting/colors
    }

    let targetPivot = this.pivotviews.filter((pv) => pv.element.id === pivotviewObj.element.id);
    let matchTable = targetPivot[0] ? pivotviewObj : targetPivot[0];
    if (!matchTable) {
      return;
    }
    if (matchTable?.grid) {
      matchTable.grid.headerCellInfo = this.queryCellHeaderINfo.bind(this);
    }


    const panelId = item?.id;
    const timeFieldsSet = panelId ? (this.pivotTimeFieldsCache[panelId] || new Set<string>()) : new Set<string>();
    if (timeFieldsSet.has(args.fieldName)) {
      args.value = this.secondsToHms(args.value);
    }

    if (this.isPivotLightMode(item)) {
      return;
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
          if (args.rowCellType === 'grandTotal' && args.columnCellType === 'grandTotal') {
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
            args.value = grandTotalValue;
            args.averageCount = null;
          }

          else if (args.columnCellType === 'grandTotal' && (args.rowCellType === 'value' || args.rowCellType === 'subTotal')) {

            if (!args.value && args.value !== 0) return;

            const fieldDetail = item.content.fieldDetails.find((f: any) => f.name === args.fieldName);
            const format = fieldDetail.format;
            const isPercentFormat = format == 'P' ||
              format == "###0.00 '%'" || format == "###0 '%'" || format == "###0.0 '%'";

            if (args.rowCellType === 'subTotal' || (args.row && args.row.hasChild)) {

              const grandTotalValue = Number(args.value); // ensure numeric
              const totalCellCount = args.cellSets?.length || 0;
              let averageCount: any = 0;

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
                args.value = averageCount;
                args.displayText = `${averageCount.toFixed(2)}%`;
              } else {
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
    //     args.displayText = value.toFixed(2);
    //     args.skipFormatting = true;
    //   }
    // }

  }


  getChipText(item: any): string {

    if (Array.isArray(item.values) && item.values.length > 1) {
      return `${item.field_name}: ${item.values.join(', ')}`;
    } else if (Array.isArray(item.values) && item.values.length === 1) {
      return `${item.field_name}: ${item.values[0]}`;
    } else if (typeof item.values === 'string') {
      return `${item.field_name}: ${item.values}`;
    } else {
      return ''; // or any default value
    }
  }


  filteredDataSourceEvent(event: any, id: string) {
    const searchText = event.target.value.toLowerCase();

    // Search from full originalData (not limited to 1000)
    if (Array.isArray(this.originalData[id])) {
      const fullFilteredData = this.originalData[id].filter(item => {
        if (item.item != null || item.item != undefined) {
          const match = item.item.toLowerCase().includes(searchText);
          return match;
        }
      });

      // Bind only first 1000 results to UI to prevent hang
      this.filteredData[id] = fullFilteredData.slice(0, 1000);
    } else {
      this.filteredData[id] = [];
    }
  }

  onFiltering: EmitType<FilteringEventArgs> = (e: FilteringEventArgs, item: any) => {
    e.preventDefaultAction = true; // Prevent default filtering

    // Search from full originalData (not limited to 1000)
    const fullData = this.originalData[item.id] || item.content.dataSource || [];

    // Apply filtering logic - handle both plain strings and objects with item property
    const filteredData = fullData.filter((dataItem: any) => {
      if (dataItem && dataItem.item) {
        return dataItem.item.toString().toLowerCase().includes(e.text.trim().toLowerCase());
      }
      if (dataItem != null) {
        return dataItem
          .toString()
          .trim()
          .toLowerCase()
          .includes(e.text.trim().toLowerCase());
      }
      return false;
    });

    // For dropdown filtering, use getSortedData if needed but don't reprocess already sorted data
    // const processedData = this.getSortedData(filteredData, item.content.selectedValues_dataSource, item);

    // Bind only first 1000 results to UI to prevent hang
    const limitedData = filteredData.slice(0, 1000);

    // Update dropdown data dynamically
    e.updateData(limitedData, new Query());

    // Sync to UI datasource
    this.totalDataSource[item.id] = limitedData;

    // Change detection handled automatically
  };


  onFilteringMultiselect: EmitType<FilteringEventArgs> = (e: FilteringEventArgs, item: any) => {
    e.preventDefaultAction = true; // Prevent the default built-in filter.

    // Search from full originalData (not limited to 1000)
    const fullData = this.originalData[item.id] || item.content.dataSource || [];

    let query = new Query();

    const filteredData = fullData.filter(dataItem => {
      if (dataItem.item != null && dataItem.item != undefined) {
        const match = dataItem.item
          .trim()
          .normalize()
          .toLowerCase()
          .includes(e.text.trim().normalize().toLowerCase());
        return match; // Return true if the text is found anywhere
      }
      return false; // Return false for invalid items
    });

    // Bind only first 1000 results to UI to prevent hang
    const limitedData = this.decorateMultiselectData(filteredData.slice(0, 1000), item.id);

    // Update the MultiSelect dataSource dynamically
    e.updateData(limitedData, query);

    // Sync to UI datasource
    this.totalDataSource[item.id] = limitedData;
  };


  onMultiselectFiltering: EmitType<FilteringEventArgs> = (e: FilteringEventArgs, item: any) => {
    e.preventDefaultAction = true;

    // Ã¢Å“â€¦ Use original data if available, fallback to content.dataSource
    const fullData = this.originalData[item.id] || item.content.dataSource || [];

    // Ã¢Å“â€¦ Only perform filtering, avoid expensive getSortedData processing during typing
    const filteredData = fullData.filter((dataItem: any) => {
      if (dataItem && dataItem.item) {
        return dataItem.item.toString().toLowerCase().includes(e.text.trim().toLowerCase());
      }
      return dataItem?.toString().toLowerCase().includes(e.text.trim().toLowerCase());
    });

    // Ã¢Å“â€¦ Directly slice first page instead of processing all data
    const limitedData = filteredData.slice(0, this.pageSize);

    // Ã¢Å“â€¦ Update datasource and reset paging
    this.totalDataSource[item.id] = limitedData;
    this.pageIndex[item.id] = 1;

    e.updateData(limitedData, new Query());
  };


  userInformationData: any;
  dashboardBasedAccess: any = {};
  dashboardBasedPermssionArray: any = [];
  chatbotPermissionOBj: any = {}

  reloadPage(): void {
    // Reload the page
    window.location.reload();
  }

  private isMobileScreen(): boolean {
    // adjust breakpoint as needed
    return Browser?.isDevice || window.innerWidth <= 760;
  }

  userRole: any;
  ngOnInit(): void {

    let userData: any = sessionStorage.getItem('userInformation');

    let userInfoData = this.userService.getUser();
    // this.userRole = userInfoData.role;
    this.userRole = userInfoData.username;
    // console.log('userInfoData in role  this.userRole', this.userRole, userInfoData)

    if (userData) {
      userData = JSON.parse(userData);
      this.chartService.getUserDetailByUsername(userData.username).subscribe((res: any) => {

        let resData = res['data'];
        this.userInformationData = resData
        // if (resData.username == 'superadmin' || resData.role == 'admin') {
        if (resData.role == 'superadmin' || resData.role == 'admin') {
          this.userFlag = true
        } else {
          this.userFlag = false
        }


      })
    }

    this.menuBasedAccessService.menuAccess$.subscribe((menuAccess: any) => {
      // console.log('menuAccess', menuAccess)
      let menuBasedAccess = menuAccess;

      let menuBasedPermissionArray = menuBasedAccess?.permission_details;

      menuBasedPermissionArray?.forEach((element: any) => {
        // console.log('element key', element)
        if (element.form_name == 'chatbotSetup') {
          this.chatbotPermissionOBj = element;
          // console.log('this.menubasedPermissionObj', menuBasedPermissionArray)
        }

      });

    });

    this.pageSettings = {
      rowPageSize: 10,
      columnPageSize: 5,
      currentColumnPage: 1,
      currentRowPage: 1
    } as PageSettings;
    this.pagerSettings = {
      position: 'Bottom',
      enableCompactView: false,
      showColumnPager: true,
      showRowPager: true
    } as PagerSettings;



    this.cellSpacing = Browser?.isDevice ? [5, 2] : [10, 10]
    this.groupOptions = { showGroupedColumn: true };
    this.filterSettings = { type: 'CheckBox' };
    this.gridtoolbarOptions = ['ExcelExport'] as any as ToolbarItems[];
    // this.PivottoolbarOptions = ['Export', 'SubTotal', 'GrandTotal'] as any as ToolbarItems[];
    this.PivottoolbarOptions = ['Export'] as any as ToolbarItems[];
    // this.displayOption = { view: 'Both' } as DisplayOption;
    this.initialPage = { pageSizes: ['20', '50', '100', '200', '500', '1000'], };
    // this.ToolbarOptions = ['Grid','Chart']
    // this.gridSettings = {
    //   columnWidth: Browser.isDevice ? 100 : 140,
    //   // layout: 'Tabular',
    //   allowTextWrap: false,
    //   // clipMode: 'EllipsisWithTooltip',
    //   excelQueryCellInfo: this.observable.subscribe((args: any) => {
    //     if (args.cell.value == 0) {
    //       args.style.borders = { color: '#000000', lineStyle: 'thin' } // Apply border here
    //       args.style.numberFormat = undefined;
    //     }

    //   }) as any,

    //   columnRender: this.observable.subscribe((args: any) => {
    //     // Align headers recursively
    //     this.alignHeadersRecursively(args.stackedColumns);

    //     // Ensure row headers are left-aligned and properly positioned
    //     if ((args as any).stackedColumns && (args as any).stackedColumns[0]) {
    //       // Content for the row headers is left-aligned
    //       (args as any).stackedColumns[0].textAlign = 'Left';
    //       (args as any).stackedColumns[0].clipMode = 'EllipsisWithTooltip';
    //     }

    //     // Ensure value columns don't overlap with row headers
    //     // if ((args as any).stackedColumns) {
    //     //   (args as any).stackedColumns.forEach((column: any, index: number) => {
    //     //     if (index > 0) { // Skip the first column (row header)
    //     //       column.textAlign = 'Right';
    //     //       column.clipMode = 'EllipsisWithTooltip';
    //     //     }
    //     //   });
    //     // }
    //   }) as any

    // } as GridSettings;


    this.gridSettings = {
      // layout: 'Tabular',
      columnWidth: 140,
      // selectionSettings: { mode: 'Cell', type: 'Single' },
      // allowSelection: true,
      // allowTextWrap: true,
      // textWrapSettings: { wrapMode: 'Both' },
      excelQueryCellInfo: this.observable.subscribe((args: any) => {

        if (args.cell.value == 0) {

          args.style.borders = { color: '#000000', lineStyle: 'thin' } // Apply border here

          args.style.numberFormat = undefined;

        }

      }) as any,

      columnRender: this.observable.subscribe((args: any) => {


        this.alignHeadersRecursively(args.stackedColumns);
        if ((args as any).stackedColumns[0]) {
          // Content for the row headers is right-aligned here.
          (args as any).stackedColumns[0].textAlign = 'Left';
          //  (args as any).stackedColumns[0].position = 'FIxed';
        }
      }) as any

    } as GridSettings;



    this.chartSettings = {
      chartSeries: {
        type: 'Column'
      },
      primaryXAxis: {
        labelRotation: -45,
        labelIntersectAction: 'Rotate45'
      },
      primaryYAxis: {
        title: ''
      },
      legendSettings: {
        visible: true,
        position: 'Bottom'
      },
      tooltip: {
        enable: true
      },
      zoomSettings: {
        enableMouseWheelZooming: true,
        enablePinchZooming: true,
        enableSelectionZooming: true
      }
    } as ChartSettings;

    this.displayOption = {
      view: 'Both',
    } as DisplayOption;


    //   this.gridSettings = {
    let dashboardBasedLocalStorageData = this.dashboardBasedAccessService.updatedashboardAccessFromLocalStorage();

    if (dashboardBasedLocalStorageData) {
      this.dashboardBasedAccess = dashboardBasedLocalStorageData;
      this.dashboardBasedPermssionArray = this.dashboardBasedAccess?.permission_details;
    }



    let screenWidth = window.innerWidth;
    let landscapeView = window.matchMedia('(orientation: landscape)').matches;

    if (screenWidth <= 770 && landscapeView) {
      this.cellAspectRatio = 0.65;
    } else if (screenWidth <= 770 && !landscapeView) {
      this.cellAspectRatio = 100 / 8;
    } else {
      this.cellAspectRatio = 100 / 80;
    }




    this.onTextRender = (args: any, datalabelFormat: any, item: any) => {
      const percentValue = args.point.percentage;
      const seriesProps = args.series?.properties;
      const yName = seriesProps?.yName;
      const seriesName = seriesProps?.name;


      const point = args.point || {};
      const label = (point.x != null) ? String(point.x) : (seriesName || '');
      const rawValue = point.y;


      const firstObj = item.content.dataSource?.[0]; // Adjust if your data source is elsewhere


      // Apply formatting only for specific chart types
      const chartTypes = ['Pie', 'Donut', 'Pyramid', 'funnel'];
      if (chartTypes.includes(item.content.chartType)) {
        if (datalabelFormat === "Both") {

          if (firstObj) {
            const keys = Object.keys(firstObj);
            const matchedKey = keys.find(
              key => key === yName || key === seriesName
            );

            if (matchedKey) {
              const value = firstObj[matchedKey];
              // Check for HH:MM:SS-like string, with flexible hour length
              if (typeof value === 'string' && /^\d+:\d{2}:\d{2}$/.test(value)) {
                let formattedDate = this.formatSecondsToHHMMSS(args.point.y);
                args.text = `${label}<br>${formattedDate} (${percentValue}%)`;
              } else {
                args.text = `${label}<br>${args.text} (${percentValue}%)`;
              }
            } else {
              args.text = `${label}<br>${args.text} (${percentValue}%)`;
            }
          } else {
            args.text = `${label}<br>${args.text} (${percentValue}%)`;

          }

        } else if (datalabelFormat === "ValueWithLabel") {

          //  const firstObj = item.content.dataSource?.[0]; // Adjust if your data source is elsewhere

          if (firstObj) {
            const keys = Object.keys(firstObj);
            const matchedKey = keys.find(
              key => key === yName || key === seriesName
            );

            if (matchedKey) {
              const value = firstObj[matchedKey];
              // Check for HH:MM:SS-like string, with flexible hour length
              if (typeof value === 'string' && /^\d+:\d{2}:\d{2}$/.test(value)) {
                let formattedDate = this.formatSecondsToHHMMSS(args.point.y);
                // args.text = `${label}<br>${formattedDate} (${percentValue}%)`;
                args.text = `${label}<br>${formattedDate}`;
              } else {
                args.text = `${label}<br>${args.text}`;
              }
            } else {
              args.text = `${label}<br>${args.text}`;
            }
          } else {
            args.text = `${label}<br>${args.text}`;

          }

        } else if (datalabelFormat === "ValueWithPercentage") {

          if (
            percentValue != null && // handles null and undefined
            !String(args.text).includes('%') // avoid duplicate %
          ) {
            // args.text = percentValue + "%";
            args.text = `${label}<br>(${percentValue}%)`;
          }

        }
      }

      if (datalabelFormat === "Percentage") {
        if (
          percentValue != null && // handles null and undefined
          !String(args.text).includes('%') // avoid duplicate %
        ) {
          args.text = percentValue + "%";
        }
      } else {
        // const firstObj = item.content.dataSource?.[0]; // Adjust if your data source is elsewhere

        if (firstObj) {
          const keys = Object.keys(firstObj);
          const matchedKey = keys.find(
            key => key === yName || key === seriesName
          );

          if (matchedKey) {
            const value = firstObj[matchedKey];
            // Check for HH:MM:SS-like string, with flexible hour length
            if (typeof value === 'string' && /^\d+:\d{2}:\d{2}$/.test(value)) {
              args.text = this.formatSecondsToHHMMSS(args.point.y);
            } else {
              // Value not in time format, leave text as-is
              args.text = args.text;
            }
          } else {
            // No matching key found, leave text as-is
            args.text = args.text;
          }
        } else {
          // No data available, fallback
          args.text = args.text;
        }
      }
    };


    this.routerEventsSub = this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        // Safer dynamic check
        if (!event.url.includes('/panel/panelView')) {
          sessionStorage.removeItem('viewTracking');
        }
      }
    });



    this.route.paramMap.subscribe((params) => {
      let dashboardId = params.get('name');
      this.editDashboardId = dashboardId;
      this.updateProgressBarPosition();

      // this.getPanelArrayDataFromLocalStorage()
      let filterObjEle = {
        "filter_obj": [],
        "drilldown_obj": [],
        "disabled_filterObj": [],
        "drilldown_table_obj": []

      }
      this.loaderFlag = true;
      // this.onFetchData(this.editDashboardId, filterObjEle);
      this.fetchBookmarkFilterData(this.editDashboardId, filterObjEle);
      this.getPermissionById(this.editDashboardId)
      // this.startTracking()

    });

    this.panelSeriesArray.forEach((panel: any) => {
      if (panel.panelType === 'Pivot' && panel.content?.defaultView) {
        this.pivotDisplayOptions[panel.id] = panel.content.defaultView === 'chart' ? 'Chart' : 'Table';
      }
    });

  }

  alignHeadersRecursively(columns: any[]): void {
    columns.forEach((column, index) => {
      // First column (row headers) should be left-aligned
      if (index === 0) {
        column.textAlign = 'Center';
        column.headerTextAlign = 'Center';
        column.width = column.width || 200; // Ensure sufficient width for row headers
      } else {
        // Value columns should be center/right-aligned
        column.textAlign = 'Center';
        column.headerTextAlign = 'Center';
      }

      // If the column has nested columns, recursively set the alignment
      if (column.columns && column.columns.length > 0) {
        this.alignHeadersRecursively(column.columns);
      }
    });
  }


  alignHeadersRecursivelynew(columns: any[], level: string): void {
    columns.forEach(column => {
      if (level === 'row') {
        column.textAlign = 'Left'; // Align row headers to the left
        column.headerTextAlign = 'Left';
      } else if (level === 'column') {
        column.textAlign = 'Center'; // Align column headers to the center
        column.headerTextAlign = 'Center';
      } else if (level === 'value') {
        column.textAlign = 'Right'; // Align value fields to the right
        column.headerTextAlign = 'Right';
      }

      // Recursively handle nested columns
      if (column.columns) {
        this.alignHeadersRecursivelynew(column.columns, level);
      }
    });
  }
  bookmark_flag: boolean = true;

  totalDataSource: { [key: string]: any[] } = {};

  generateColors(length: number): string[] {
    const colors: string[] = [];

    for (let i = 0; i < length; i++) {
      // Generate random HEX color
      const color = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
      colors.push(color);
    }
    // console.log('colors', colors)
    return colors;
  }

  // // Example usage:
  // const myArray = [10, 20, 30, 40];
  // const colorArray = generateColors(myArray.length);

  // console.log(colorArray);
  // ["#1a2b3c", "#ff0033", "#44cc88", "#abcdef"]




  initialFiltersObj: any = {};

  formatSecondsToHHMMSS(totalSeconds: number): string {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }


  //  axisLabelRender(args : IAxisLabelRenderEventArgs , item : any): void {
  //   console.log('args axisLabelRender', args)
  //   // if (args.axis.name === 'primaryYAxis') {
  //   //   args.text = this.formatSecondsToHHMMSS(Number(args.text));
  //   // }
  // };

  axisLabelRender(args: any, item: any): void {
    const seriesList = args.axis.series || [];
    //  console.log('seriesList args', args)

    const dataSource = item?.content?.dataSource;
    const firstObj = dataSource?.[0];

    if (!firstObj) return;

    const keys = Object.keys(firstObj);

    // Check all series in the axis
    for (const series of seriesList) {
      const yName = series?.properties?.yName;
      const seriesName = series?.properties?.name;


      const matchedKey = keys.find(key => key === yName || key === seriesName);
      // console.log('matchedKey', matchedKey)

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


  timeStringToSeconds(timeStr: string): number {
    const [hours, minutes, seconds] = timeStr.split(":").map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  }

  private viewStartTime!: Date;
  private timerSubscription!: Subscription;

  private generateResourceData(dataSource: any[], resources: any[]) {
    const colors = [
      '#98AFC7', '#99c68e', '#C2B280', '#3090C7', '#95b9',
      '#95b9c7', '#deb887', '#778899', '#f4a460', '#dda0dd'
    ];

    return resources.map(resource => {
      const fieldName = resource.field;
      const uniqueValues = Array.from(
        new Set(dataSource.map(item => item[fieldName]).filter(v => v != null && v !== ''))
      );

      const dataSourceArray = uniqueValues.map((val, index) => ({
        text: val,
        id: index + 1,
        color: colors[index % colors.length]
      }));

      return {
        field: fieldName,
        title: resource.name,
        text: fieldName,
        dataSource: dataSourceArray
      };
    });
  }

  getResourceData(res: any, dataSource: any, fieldDetails: any): any[] {
    // console.log('getResourceData res', res, dataSource, fieldDetails);
    // Extract unique values for the given resource field
    const uniqueVals = Array.from(
      new Set(dataSource.map((d: any) => d[res.field]))
    );

    // console.log('uniqueVals', uniqueVals);

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

  // In your component.ts
  onPopupOpen(args: any, item: any) {
    // console.log('onPopupOpen args', args, item.content.enablePopup);


    // Ã°Å¸â€˜â€° Option: disable popup for event clicks

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



  randomColor(index: number): string {
    const colors = [
      '#1f77b4', // blue
      '#ff7f0e', // orange
      '#2ca02c', // green
      '#d62728', // red
      '#9467bd', // purple
      '#8c564b', // brown
      '#e377c2', // pink
      '#7f7f7f', // gray
      '#bcbd22', // olive
      '#17becf', // teal
      '#393b79', // dark blue
      '#637939', // olive green
      '#8c6d31', // golden brown
      '#843c39', // maroon
      '#7b4173', // violet
      '#5254a3', // indigo
      '#9c9ede', // light lavender
      '#cedb9c', // light green
      '#e7cb94', // beige
      '#ad494a', // dark red
      '#a55194', // magenta
      '#6b6ecf', // periwinkle
      '#b5cf6b', // lime green
      '#d6616b', // rose
      '#ce6dbd', // orchid
      '#de9ed6'  // light pink
    ];
    return colors[index % colors.length];
  }


  public timeScale: TimeScaleModel = { interval: 720, enable: true };

  // Helper method to get component data size
  getComponentDataSize(panel: any): number {
    if (!panel || !panel.content) return 0;

    if (panel.panelType === 'Pivot') {
      return panel.content.dataSourceSettings?.dataSource?.length || 0;
    } else if (panel.panelType === 'Table') {
      return panel.content.dataSource?.length || 0;
    } else if (panel.panelType === 'Chart') {
      return panel.content.dataSource?.length || 0;
    } else if (['MultiSelectDropDown', 'DropdownList', 'ListBox'].includes(panel.panelType)) {
      return panel.content.dataSource?.length || 0;
    } else if (panel.panelType === 'Calender') {
      return panel.content.eventSettings?.dataSource?.length || 0;
    }
    return 0;
  }

  // Method to hide loader for heavy components after data processing
  hideLoaderAfterProcessing(panelId: string, delay: number = 200) {
    // Adjust delay based on total panel count
    const totalPanels = this.panelSeriesArray?.length || 0;
    const adjustedDelay = totalPanels > 10 ? delay * 0.8 : totalPanels > 5 ? delay * 0.9 : delay;

    setTimeout(() => {
      // âœ… FIX: Create new array with updated panel object for OnPush detection
      const panelIndex = this.panelSeriesArray.findIndex(p => p.id === panelId);
      if (panelIndex !== -1 && this.panelSeriesArray[panelIndex].isLoading) {
        this.panelSeriesArray = [
          ...this.panelSeriesArray.slice(0, panelIndex),
          { ...this.panelSeriesArray[panelIndex], isLoading: false },
          ...this.panelSeriesArray.slice(panelIndex + 1)
        ];
        this.cdr.detectChanges();
      }
    }, adjustedDelay);
  }


  fetchBookmarkFilterDataOld5(dashboard_id: any, filterObj: any) {
    const isFiltering = this.panelSeriesArray && this.panelSeriesArray.length > 0;

    if (isFiltering) {
      this.panelSeriesArray.forEach(p => p.isLoading = true);
      // this.cdr.detectChanges();
    } else {
      this.loaderService.show();
      this.cdr.detectChanges();
    }
    this.chartService.getDashboardDataWithBookmarkFilterById(dashboard_id, filterObj, true, this.userFlag).subscribe(
      (res: any) => {

        if (res.success === true) {
          // Hide global loader for initial page load
          this.loaderService.hide();

          let resObj = res['data'];
          console.log('resObj', resObj)

          this.refreshCatcheTime = this.formatDateTime(resObj.last_refreshed_time);
          this.dashboardName = resObj.dashboard_name
          this.description = resObj.description;
          this.chartService.setTitle(this.dashboardName);
          let data = resObj.dashboard_setup.dashboardObj;
          this.initialFilerObj = data.initialFilterObj;
          this.dashboardCreationObj.allowFloating = data.allowFloating

          let bookmark_filterObjData = data.bookmark_filterObj ? data.bookmark_filterObj : [];

          let bookmarkfilterflag =
            data.is_default_bookmark_filter !== undefined
              ? data.is_default_bookmark_filter
              : true;

          this.bookmark_flag = bookmarkfilterflag;
          let filterObjEle = {
            "filter_obj": bookmark_filterObjData,
            "drilldown_obj": [],
            "disabled_filterObj": [],
            "drilldown_table_obj": []
          }

          this.startTracking()

          filterObjEle.filter_obj.forEach((ele: any) => {
            if (ele.object_type === "DropdownList") {
              // For DropdownList, store the first value or the entire array
              this.selectedDropdownValuesObj[ele.id] = ele.values.length === 1 ? ele.values[0] : ele.values;

            } else if (ele.object_type == "ListBox" || ele.object_type == 'MultiSelectDropDown' || ele.panelType == 'InputBox') {
              const filteredValues = this.sanitizeSelectionValues(
                ele.values,
                !!this.explicitEmptySelectionMap[ele.id]
              );

              // For ListBox/MultiSelectDropDown, store the filtered values in selectedItemsMap
              this.selectedItemsMap[ele.id] = filteredValues;

              // Update the filter object with filtered values
              ele.values = filteredValues;
            } else if (ele.object_type == "dateRangePicker") {
              // this.selectedDateRanges = {};
              this.selectedDateRanges[ele.id] = ele.values;
            } else if (ele.object_type == 'datePicker') {
              // this.selectedDateObject = {};
              this.selectedDateObject[ele.id] = ele.values;
            }
          });

          // Clean up filter_obj: remove entries with empty values arrays
          filterObjEle.filter_obj = filterObjEle.filter_obj.filter((ele: any) => {
            if (ele.object_type === "ListBox" || ele.object_type === 'MultiSelectDropDown' || ele.panelType === 'InputBox') {
              return Array.isArray(ele.values) && ele.values.length > 0;
            }
            return true; // Keep other types as-is
          });

          sessionStorage.setItem('storedDrilldownAndFilterArray', JSON.stringify(filterObjEle));

          this.auto_refreshTime = resObj.auto_refresh ?? 0;

          if (this.auto_refreshTime && this.auto_refreshTime > 0) {
            const intervalTime = this.auto_refreshTime * 60 * 1000; // Convert minutes to milliseconds
            // Set the interval to reload the page
            this.refreshInterval = setInterval(() => {
              this.reloadPage();
            }, intervalTime);
          }

          let panelsData = data.panels.map((ele: any) => {

            if (ele.panelType == 'Chart') {
              let dimensionLevelsArr = ele.content.dimension.levels;
              let measureArr = ele.content.measure;
              let fieldNames = dimensionLevelsArr.map((ele: any) => ele.fieldName);
              let MeasurefieldNames = measureArr.map((ele: any) => ele.fieldName);
              let dataSourceArr = ele.content.dataSource;

              const updatedDataSource = dataSourceArr.map((entry: any) => {
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

              let keys = dataSourceArr.map((ele: any) => Object.keys(ele));
              keys = keys.flatMap((subArray: any) => subArray)
              const matchingValue = fieldNames.find((value: any) => keys.includes(value));

              let seriesArr = ele.content.series.map((seriesEle: any) => {
                let obj = {
                  ...seriesEle,
                  dataSource: updatedDataSource,
                  xName: matchingValue
                }
                return obj
              })
              let primaryyAxis = { ...ele.content.primaryYAxis }
              let primaryYDataSourceEntry = seriesArr.find((series: any) => {
                return series
              });

              if (primaryYDataSourceEntry.dataSource.length <= 2) {

                const maxDataValue = seriesArr.reduce((maxValue: number, series: { dataSource: any[]; yName: string | number; }) => {
                  const seriesMax = Math.max(...series.dataSource.map((entry: { [x: string]: any; }) => entry[series.yName]));
                  return Math.max(maxValue, seriesMax);
                }, 0);


                primaryyAxis = {
                  ...primaryyAxis,
                  minimum: 0,
                  // maximum: maxDataValue * 1.3,
                  // Ã¢Å“â€¦ Add font to Y Axis labels
                  labelStyle: {
                    fontFamily: 'Roboto, Segoe UI, GeezaPro, DejaVu Serif, "Times New Roman", sans-serif',
                    color: 'black'
                  }
                };


              } else {
                const yNameValue = primaryYDataSourceEntry.yName;
                let maximum = yNameValue * 1.3;
                primaryyAxis = {
                  ...primaryyAxis,
                  labelStyle: {
                    fontFamily: 'Roboto, Segoe UI, GeezaPro, DejaVu Serif, "Times New Roman", sans-serif',
                    color: 'black'
                  }

                }

              }

              // Ã°Å¸â€Â¹ Determine zoom mode based on seriesType
              const hasBarSeries = seriesArr.some(
                (s: any) =>
                  s.type?.toLowerCase() === 'bar' ||
                  s.type?.toLowerCase() === 'stackingbar'
              );
              const isMobile = this.isMobileScreen();
              const zoomSettings = {
                ...ele.content.zoomSettings,
                mode: hasBarSeries ? 'Y' : 'X',

                zoomFactor: isMobile ? (ele.content.zoomSettings?.zoomFactorMobile ?? 0.06) : (ele.content.zoomSettings?.zoomFactor ?? 1),
              };
              const chartObj = {
                ...ele,

                content: {
                  ...ele.content,
                  series: seriesArr,
                  primaryYAxis: primaryyAxis,
                  zoomSettings: zoomSettings,
                  legends: {
                    ...ele.content.legends,
                    textStyle: {
                      ...ele.content.legends.textStyle,
                      fontFamily: 'Roboto, Segoe UI, GeezaPro, DejaVu Serif, "Times New Roman", sans-serif',
                      // fontWeight: 'bold',
                      // size: '12px',
                      // color: 'black'
                    }
                  },
                  primaryXAxis: {
                    ...ele.content.primaryXAxis,
                    labelStyle: {
                      fontFamily: 'Roboto, Segoe UI, GeezaPro, DejaVu Serif, "Times New Roman", sans-serif',
                      // fontFamily: 'Cambria, Cochin, Georgia, Times, "Times New Roman", serif',
                      // fontWeight: 'bold',
                      // size: '12px',
                      color: 'black'
                    }
                  },

                  axis: ele.content.axis?.map((ele: any) => {
                    const dataSourceEntry = seriesArr.find((series: any) => {
                      if (series.opposedPosition === true) {
                        return series
                      }
                    });

                    if (dataSourceEntry != undefined) {
                      if (dataSourceEntry.dataSource.length <= 2) {

                        const maxDataValue = seriesArr.reduce((maxValue: number, series: { dataSource: any[]; yName: string | number; }) => {
                          const seriesMax = Math.max(...series.dataSource.map((entry: { [x: string]: any; }) => entry[series.yName]));
                          return Math.max(maxValue, seriesMax);
                        }, 0);
                        let maximum = maxDataValue * 1.3;

                        let obj = {
                          ...ele,
                          minimum: 0,
                          // maximum: maximum,
                          labelStyle: {
                            fontFamily: 'Roboto, Segoe UI, GeezaPro, DejaVu Serif, "Times New Roman", sans-serif',
                            color: 'black'
                          }
                        };

                        return obj;
                      } else {
                        let obj = {
                          ...ele,
                          labelStyle: {
                            fontFamily: 'Roboto, Segoe UI, GeezaPro, DejaVu Serif, "Times New Roman", sans-serif',
                            color: 'black'
                          }
                        };
                        return obj;
                      }
                    }
                    else {
                      // return ele;
                      return {
                        ...ele,
                        // Ã¢Å“â€¦ Added labelStyle
                        labelStyle: {
                          fontFamily: 'Roboto, Segoe UI, GeezaPro, DejaVu Serif, "Times New Roman", sans-serif',

                          // fontWeight: 'bold',
                          // size: '12px',
                          color: 'black'
                        }
                      };
                    }
                  }),
                },
              };

              return chartObj;
            }
            else if (ele.panelType == 'Kanban') {
              let updatedDataSource = ele.content.dataSource.map((item: any, index: number) => ({
                ...item,
                Id: index + 1
              }));

              return {
                ...ele,
                content: {
                  ...ele.content,
                  dataSource: updatedDataSource
                }
              };
            }
            else if (ele.panelType === "ListBox") {

              let data = [...ele.content.dataSource];
              this.listboxFilterItemData = data;
              this.originalData[ele.id] = [...data];
              this.filteredData[ele.id] = [...data];

              let selectedFilters = [...this.getSortedData(data, ele.content.selectedValues_dataSource, ele)];

              selectedFilters.forEach(filter => {
                this.listBoxBgColor = filter.isMatched ? 'matched' : 'non-matched';
              });
              this.originalData[ele.id] = selectedFilters;
              this.filteredData[ele.id] = selectedFilters.slice(0, 1000);
              let selectedValues = this.selectedItemsMap[ele.id] || [];
              const dataSourceStorageObj: { [key: string]: any[] } = {};
              const lastFilterObj = this.filterandDrilldownObjArray.filter_obj[this.filterandDrilldownObjArray.filter_obj.length - 1];
              const lastFilterObjMatch = lastFilterObj ? lastFilterObj.id === ele.id : false;

              let existingDataSourceStorageObj: { [key: string]: any[] } = {};
              const storedData = sessionStorage.getItem('dataSourceStorageObj');

              if (storedData) {
                existingDataSourceStorageObj = JSON.parse(storedData);
              }

              const isIdInStorage = Object.keys(existingDataSourceStorageObj).includes(ele.id);

              if (this.filterandDrilldownObjArray.filter_obj.length > 0) {
                if (!lastFilterObjMatch || !isIdInStorage) {
                  existingDataSourceStorageObj[ele.id] = selectedFilters;
                  sessionStorage.setItem('dataSourceStorageObj', JSON.stringify(existingDataSourceStorageObj));

                } else if (isIdInStorage) {

                  selectedFilters = existingDataSourceStorageObj[ele.id];
                  this.filteredData[ele.id] = selectedFilters;
                }
              } else {
                existingDataSourceStorageObj = {}
                sessionStorage.removeItem('dataSourceStorageObj')
              }

              // Hide loader after data processing for large datasets
              const dataSize = ele.content.dataSource?.length || 0;
              if (dataSize >= 1000) {
                this.hideLoaderAfterProcessing(ele.id, 200);
              }

              return ele;
            }

            // else if ( ele.panelType === "MultiSelectDropDown" || ele.panelType == 'InputBox') {
            //   let data = [...ele.content.dataSource];

            //   console.log('data multiselect dropdown', ele.id,  data)

            //   let selectedFilters = [...this.getSortedData(data, ele.content.selectedValues_dataSource, ele)];

            //   selectedFilters.forEach(filter => {
            //     if (filter.isMatched) {
            //       this.listBoxBgColor = 'matched';
            //     } else {
            //       this.listBoxBgColor = 'non-matched';
            //     }
            //   });

            //   let fulldataSource = selectedFilters;

            //   ele.content.dataSource = fulldataSource;
            //   // this.totalDataSource[ele.id] = fulldataSource;

            //   console.log('ele.content.fullDataSource', ele.content.dataSource)

            //   const dataSourceStorageObj: { [key: string]: any[] } = {};
            //   const lastFilterObj = this.filterandDrilldownObjArray.filter_obj[this.filterandDrilldownObjArray.filter_obj.length - 1];
            //   const lastFilterObjMatch = lastFilterObj ? lastFilterObj.id === ele.id : false;

            //   let existingDataSourceStorageObj: { [key: string]: any[] } = {};
            //   const storedData = sessionStorage.getItem('dataSourceStorageObj');
            //   if (storedData) {
            //     existingDataSourceStorageObj = JSON.parse(storedData);
            //   }

            //   const isIdInStorage = Object.keys(existingDataSourceStorageObj).includes(ele.id);

            //   if (this.filterandDrilldownObjArray.filter_obj.length > 0) {
            //     if (!lastFilterObjMatch || !isIdInStorage) {
            //       existingDataSourceStorageObj[ele.id] = selectedFilters;
            //       sessionStorage.setItem('dataSourceStorageObj', JSON.stringify(existingDataSourceStorageObj));

            //     } else if (isIdInStorage) {
            //       selectedFilters = existingDataSourceStorageObj[ele.id];
            //       ele.content.dataSource = selectedFilters;
            //       // this.totalDataSource[ele.id] = fulldataSource;
            //     }
            //   } else {
            //     existingDataSourceStorageObj = {}
            //     sessionStorage.removeItem('dataSourceStorageObj')
            //   }


            //   return ele
            // }

            else if (ele.panelType === "MultiSelectDropDown") {
              this.syncPanelSelectionState(ele);
              let data = [...ele.content.dataSource];

              let selectedFilters = [...this.getSortedData(data, ele.content.selectedValues_dataSource, ele)];

              selectedFilters.forEach(filter => {
                if (filter.isMatched) {
                  this.listBoxBgColor = 'matched';
                } else {
                  this.listBoxBgColor = 'non-matched';
                }
              });

              let fulldataSource = this.decorateMultiselectData(selectedFilters, ele.id);

              ele.content.dataSource = fulldataSource;
              this.totalDataSource[ele.id] = fulldataSource;
              // ele.content.dataSource = selectedFilters.slice(0, 1000);

              const dataSourceStorageObj: { [key: string]: any[] } = {};
              const lastFilterObj = this.filterandDrilldownObjArray.filter_obj[this.filterandDrilldownObjArray.filter_obj.length - 1];
              const lastFilterObjMatch = lastFilterObj ? lastFilterObj.id === ele.id : false;

              let existingDataSourceStorageObj: { [key: string]: any[] } = {};
              const storedData = sessionStorage.getItem('dataSourceStorageObj');


              if (storedData) {
                existingDataSourceStorageObj = JSON.parse(storedData);
              }

              const isIdInStorage = Object.keys(existingDataSourceStorageObj).includes(ele.id);

              if (this.filterandDrilldownObjArray.filter_obj.length > 0) {
                if (!lastFilterObjMatch || !isIdInStorage) {

                  existingDataSourceStorageObj[ele.id] = fulldataSource;
                  sessionStorage.setItem('dataSourceStorageObj', JSON.stringify(existingDataSourceStorageObj));

                } else if (isIdInStorage) {
                  selectedFilters = existingDataSourceStorageObj[ele.id];
                  ele.content.dataSource = selectedFilters;
                }

              } else {
                existingDataSourceStorageObj = {}
                sessionStorage.removeItem('dataSourceStorageObj')
              }

              // Hide loader after data processing for large datasets
              const dataSize = ele.content.dataSource?.length || 0;
              if (dataSize >= 1000) {
                this.hideLoaderAfterProcessing(ele.id, 200);
              }

              return ele
            }

            else if (ele.panelType == 'InputBox') {
              return ele;
            }




            else if (ele.panelType === "DropdownList") {
              let data = [...ele.content.dataSource];

              // console.log('data', data)

              let selectedFilters = [...this.getSortedData(data.slice(0, 1000), ele.content.selectedValues_dataSource, ele)];
              // let selectedFilters = [...this.getSortedData(data, ele.content.selectedValues_dataSource, ele)];

              selectedFilters.forEach(filter => {
                if (filter.isMatched) {
                  this.listBoxBgColor = 'matched';
                } else {
                  this.listBoxBgColor = 'non-matched';
                }
              });

              let fulldataSource = selectedFilters;

              // ele.content.dataSource = fulldataSource;
              this.totalDataSource[ele.id] = fulldataSource;

              // console.log('ele.content.fullDataSource', ele.content.fullDataSource)

              const dataSourceStorageObj: { [key: string]: any[] } = {};
              const lastFilterObj = this.filterandDrilldownObjArray.filter_obj[this.filterandDrilldownObjArray.filter_obj.length - 1];
              const lastFilterObjMatch = lastFilterObj ? lastFilterObj.id === ele.id : false;

              let existingDataSourceStorageObj: { [key: string]: any[] } = {};
              const storedData = sessionStorage.getItem('dataSourceStorageObj');
              if (storedData) {
                existingDataSourceStorageObj = JSON.parse(storedData);
              }

              const isIdInStorage = Object.keys(existingDataSourceStorageObj).includes(ele.id);

              if (this.filterandDrilldownObjArray.filter_obj.length > 0) {
                if (!lastFilterObjMatch || !isIdInStorage) {
                  existingDataSourceStorageObj[ele.id] = selectedFilters;
                  sessionStorage.setItem('dataSourceStorageObj', JSON.stringify(existingDataSourceStorageObj));

                } else if (isIdInStorage) {
                  selectedFilters = existingDataSourceStorageObj[ele.id];
                  // ele.content.dataSource = selectedFilters;
                  this.totalDataSource[ele.id] = fulldataSource;
                }
              } else {
                existingDataSourceStorageObj = {}
                sessionStorage.removeItem('dataSourceStorageObj')
              }

              // Hide loader after data processing for large datasets
              const dataSize = fulldataSource?.length || 0;
              if (dataSize >= 1000) {
                this.hideLoaderAfterProcessing(ele.id, 200);
              }


              return ele
            }

            else if (ele.panelType === 'Table') {
              if (ele.content.is_pagination_enabled == true) {
                let paginationTable = ele.content.table_pagination;

                this.initialPage = {
                  currentPage: paginationTable.current_page,
                  pageSizes: ['20', '50', '100', '200', '500', '1000'],
                  pageSize: paginationTable.items_per_page,
                  totalPage: paginationTable.total_pages,
                  totalRecordCount: paginationTable.total_records
                }

                const query = new Query();
                const currentResult: any = new DataManager(ele.content.dataSource).executeLocal(query);


                // const matchedFields = ele.content.matchedFieldDetails?.filter((field: any) =>
                const tableRows = this.extractTableRows(ele.content.dataSource);
                let matchedFields = ele.content.matchedFieldDetails?.filter((field: any) =>
                  Object.keys(tableRows[0] || {}).includes(field.field)
                );
                matchedFields = matchedFields && matchedFields.length > 0
                  ? matchedFields
                  : this.buildTableFieldDetailsFromRows(tableRows);
                const measureArr = ele.content.measure || [];
                matchedFields = matchedFields.map((field: any) => {
                  const fieldKey = field?.field || field?.fieldName || field?.name;
                  return {
                    ...field,
                    field: fieldKey,
                    headerText: this.resolveTableHeaderText(ele, field, measureArr, fieldKey, this.getActiveTableDrillLevel(ele) || this.getBaseTableLevel(ele)),
                  };
                });

                matchedFields = this.applyDrillHeaderToTableFields(ele, matchedFields);

                if (currentResult.length) {
                  let tableDataSource = {
                    result: currentResult, // Result of the data
                    count: this.initialPage.totalRecordCount // Total record count
                  };

                  let obj = {
                    ...ele,
                    content: {
                      ...ele.content,
                      dataSource: tableDataSource,
                      fieldDetails: matchedFields
                    }
                  }
                  return obj
                } else {
                  return ele
                }
              } else {
                const measureArr = ele.content.measure || [];
                const tableRows = this.extractTableRows(ele.content.dataSource);
                let fieldDetails = ele.content.fieldDetails || [];
                if (fieldDetails.length === 0 && tableRows.length > 0) {
                  fieldDetails = this.buildTableFieldDetailsFromRows(tableRows);
                }

                const updatedFieldDetails = fieldDetails.map((field: any) => {
                  const fieldKey = field.field || field.fieldName;
                  return {
                    ...field,
                    field: fieldKey,
                    headerText: this.resolveTableHeaderText(ele, field, measureArr, fieldKey, this.getActiveTableDrillLevel(ele) || this.getBaseTableLevel(ele)),
                  };
                });

                let obj = {
                  ...ele,
                  content: {
                    ...ele.content,
                    fieldDetails: updatedFieldDetails,
                  },
                };
                return obj;
              }
            }
            else if (ele.panelType === 'Box') {
              let resData = ele.content;

              const processDataSource = (dataSource: any[], rawQuery: string, fieldDetails: any[]): any[] => {

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

                return dataSource;

              }

              let obj = {
                ...ele,
                content: {
                  ...ele.content,
                }
              }

              obj.content.dataSource = obj.content.dataSource.map((item: any) => {
                let updatedItem = { ...item }; // Clone the object to prevent mutation

                // Iterate through fieldDetails and match fieldName with keys in dataSource object
                obj.content.fieldDetails.forEach((field: any) => {
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

              return obj

            }
            else if (ele.panelType === 'Pivot') {

              // const dataSourceSize = ele.content.dataSourceSettings.dataSource?.length || 0;
              // // Dynamic timeout based on datasource size: 200ms per 1000 rows, min 1.5s, max 30s.
              // const calculatedTimeout = Math.min(30000, Math.max(1500, Math.ceil(dataSourceSize / 1000) * 200));
              // ele.loaderTimeout = calculatedTimeout;

              // newly added for removing pullstop in the cell 
              //  ele.content.dataSourceSettings.dataSource = ele.content.dataSourceSettings.dataSource.map((row: any, index: number) => {
              //   const cleanedRow: any = {};

              //   // Ã¢Å“â€¦ Add a hidden unique identifier to prevent merging
              //   cleanedRow['_rowIndex'] = index;

              //   Object.keys(row).forEach(key => {
              //     const value = row[key];

              //     if (value !== null && value !== undefined) {
              //       // Only clean if it's a STRING type (not number)
              //       if (typeof value === 'string' && value.indexOf('.') !== -1) {
              //         // Check if it's NOT a numeric string (like "123.45")
              //         if (isNaN(Number(value))) {
              //           // It's a text string with period, clean it
              //           cleanedRow[key] = value.replace(/\./g, ' ').trim();
              //         } else {
              //           // It's a numeric string, keep as is
              //           cleanedRow[key] = value;
              //         }
              //       } else {
              //         cleanedRow[key] = value;
              //       }
              //     } else {
              //       cleanedRow[key] = value;
              //     }
              //   });

              //   return cleanedRow;
              // });
              // // 

              let total = 0;

              // Get fields where formatType is 'string' and intended for transformation
              const timeFields = ele.content.fieldDetails.filter(
                (f: any) => f.formatType === 'string' && f.name
              ).map((f: any) => f.name);

              const data = ele.content.dataSourceSettings.dataSource.map((row: any) => {
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

              ele.content.dataSourceSettings.dataSource = data;
              let obj = {
                ...ele,
                content: {
                  ...ele.content,
                  // dataSource: processDataSource(resData.dataSource, resData.rawQuery, resData.fieldDetails)
                }
              }

              return obj

            } else if (ele.panelType == 'Calender') {
              let ScedularData = ele;
              // console.log('scheduler', ScedularData);
              // Update the Id field in the dataSource
              let updatedDataSource = ScedularData.content.dataSource.map((item: any, index: number) => ({
                ...item,
                Id: index + 1
              }));

              // console.log('ele.content.resources.dataSource', ele.content.resources.dataSource)

              let updatedzresouceDataSource = ele.content.resources.dataSource.map((item: any, index: number) => ({
                ...item,
                Id: index + 1
              }));

              // console.log('updatedDataSource', updatedDataSource);

              ScedularData.content.dataSource = updatedDataSource;

              ele.content.resources.dataSource = this.getResourceData(ele.content.resources, updatedzresouceDataSource, ele.content.fieldDetails);
              ele.content.eventSettings.dataSource = updatedDataSource;

              // console.log('eventSettings', ele.content);
              return ele;
            }

            else {
              return ele
            }
          });

          // Smart loader hiding based on component type, data size, and panel count
          const totalPanels = panelsData.length;
          const baseDelay = totalPanels > 10 ? 150 : totalPanels > 5 ? 100 : 50;

          panelsData.forEach((p: any) => {
            const dataSize = this.getComponentDataSize(p);
            const isLightComponent = ['Box', 'Chart', 'InputBox', 'Table', 'Kanban', 'Calender', 'DatePicker', 'DateRangePicker', 'RawDataDump'].includes(p.panelType);
            const isHeavyComponent = ['MultiSelectDropDown', 'DropdownList', 'ListBox', 'Pivot'].includes(p.panelType);

            // Hide loader immediately for lightweight components (as soon as data arrives)
            if (isLightComponent) {
              p.isLoading = false;
            }
            // For heavy components with small data (< 1000), hide after short delay
            else if (isHeavyComponent && dataSize < 1000) {
              p.isLoading = true;
              setTimeout(() => {
                p.isLoading = false;
                this.cdr.detectChanges();
              }, baseDelay);
            }
            // For heavy components with large data (>= 1000), show loader until processing completes
            else {
              p.isLoading = true;
            }
          });

          this.panelSeriesArray = panelsData;
          this.cdr.detectChanges();

          // Hide loaders for pivot panels individually based on datasource size
          // if (this.panelSeriesArray) {
          //   this.panelSeriesArray.forEach((p: any) => {
          //     if (p.panelType === 'Pivot') {
          //       setTimeout(() => {
          //         p.isLoading = false;
          //         this.cdr.detectChanges();
          //       }, p.loaderTimeout || 1100); // Fallback to 1100ms
          //     }
          //   });
          // }

          console.log('PanelSeriesArray', this.panelSeriesArray)

          let emptyPanelsArray = this.panelSeriesArray.map((ele: any) => {
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
            } else if (ele.panelType == "Box" || ele.panelType == "DropdownList" || ele.panelType == "ListBox" || ele.panelType == "MultiSelectDropDown" || ele.panelType == 'InputBox' || ele.panelType == 'Calender') {
              return {
                ...ele,
                content: {
                  ...ele.content,
                  dataSource: [],
                  selectedValues_dataSource: [],

                }
              }
            }
            else if (ele.panelType == 'Calender') {
              // Exclude large calendar data from sessionStorage to prevent quota issues
              return {
                ...ele,
                content: {
                  ...ele.content,
                  dataSource: [], // Clear calendar events
                  eventSettings: {
                    ...ele.content.eventSettings,
                    dataSource: [] // Clear eventSettings dataSource
                  },
                  resources: {
                    ...ele.content.resources,
                    dataSource: [] // Clear resources dataSource
                  }
                }
              }

            } else if (ele.panelType == "DatePicker" || ele.panelType == "DateRangePicker" || ele.panelType == "RawDataDump") {
              return {
                ...ele
              }
            }
          })


          this.cdr.detectChanges();

          const panelSeriesArrayString = JSON.stringify(emptyPanelsArray);

          sessionStorage.setItem('panelSeriesArray', panelSeriesArrayString)

        } else {
          // this.showPopup(false, '35px', res.message);
          this.loaderService.hide()
          this.cdr.detectChanges();
          this.popupService.showPopup({
            message: res.message,
            statusCode: res.status_code,
            status: false
          });

        }
      },

      (err: any) => {

        this.loaderService.hide();
        this.cdr.detectChanges();
        const errorMessage = err.error && err.error.message ? err.error.message : err.message;
        this.popupService.showPopup({
          message: errorMessage,
          statusCode: err.status,
          status: false
        });
      }
    )

  }

  fetchBookmarkFilterData(dashboard_id: any, filterObj: any) {
    const isFiltering = this.panelSeriesArray && this.panelSeriesArray.length > 0;

    if (isFiltering) {
      // âœ… FIX: Create new array with new panel objects for OnPush detection
      this.panelSeriesArray = this.panelSeriesArray.map(p => ({ ...p, isLoading: true }));
      this.cdr.detectChanges();
    } else {
      this.loaderService.show();
      // Force change detection for OnPush strategy in production builds
      this.cdr.detectChanges();
    }
    this.chartService.getDashboardDataWithBookmarkFilterById(dashboard_id, filterObj, true, this.userFlag).subscribe(
      (res: any) => {

        if (res.success === true) {
          let resObj = res['data'];
          console.log('resObj', resObj)

          this.refreshCatcheTime = this.formatDateTime(resObj.last_refreshed_time);
          this.dashboardName = resObj.dashboard_name
          this.description = resObj.description;
          this.chartService.setTitle(this.dashboardName);
          let data = resObj.dashboard_setup.dashboardObj;
          this.initialFilerObj = data.initialFilterObj;
          this.dashboardCreationObj.allowFloating = data.allowFloating

          let bookmark_filterObjData = data.bookmark_filterObj ? data.bookmark_filterObj : [];

          let bookmarkfilterflag =
            data.is_default_bookmark_filter !== undefined
              ? data.is_default_bookmark_filter
              : true;

          this.bookmark_flag = bookmarkfilterflag;
          let filterObjEle = {
            "filter_obj": bookmark_filterObjData,
            "drilldown_obj": [],
            "disabled_filterObj": [],
            "drilldown_table_obj": []
          }

          this.startTracking()

          filterObjEle.filter_obj.forEach((ele: any) => {
            if (ele.object_type === "DropdownList") {
              // For DropdownList, store the first value or the entire array
              this.selectedDropdownValuesObj[ele.id] = ele.values.length === 1 ? ele.values[0] : ele.values;

            } else if (ele.object_type == "ListBox" || ele.object_type == 'MultiSelectDropDown' || ele.panelType == 'InputBox') {
              const filteredValues = this.sanitizeSelectionValues(
                ele.values,
                !!this.explicitEmptySelectionMap[ele.id]
              );

              // For ListBox/MultiSelectDropDown, store the values in selectedItemsMap
              ele.values = filteredValues;

              if (filteredValues.length > 0) {
                this.selectedItemsMap[ele.id] = filteredValues;
              } else {
                delete this.selectedItemsMap[ele.id]; // important
              }



              // Update the filter object with filtered values
              ele.values = filteredValues;
            } else if (ele.object_type == "dateRangePicker") {
              // this.selectedDateRanges = {};
              this.selectedDateRanges[ele.id] = ele.values;
            } else if (ele.object_type == 'datePicker') {
              // this.selectedDateObject = {};
              this.selectedDateObject[ele.id] = ele.values;
            }
          });

          // Clean up filter_obj: remove entries with empty values arrays
          filterObjEle.filter_obj = filterObjEle.filter_obj.filter((ele: any) => {
            if (ele.object_type === "ListBox" || ele.object_type === 'MultiSelectDropDown' || ele.panelType === 'InputBox') {
              return Array.isArray(ele.values) && ele.values.length > 0;
            }
            return true; // Keep other types as-is
          });

          sessionStorage.setItem('storedDrilldownAndFilterArray', JSON.stringify(filterObjEle));

          this.auto_refreshTime = resObj.auto_refresh ?? 0;

          if (this.auto_refreshTime && this.auto_refreshTime > 0) {
            const intervalTime = this.auto_refreshTime * 60 * 1000; // Convert minutes to milliseconds
            // Set the interval to reload the page
            this.refreshInterval = setInterval(() => {
              this.reloadPage();
            }, intervalTime);
          }

          let panelsData = data.panels.map((ele: any) => {

            if (ele.panelType == 'Chart') {
              let dimensionLevelsArr = ele.content.dimension.levels;
              let measureArr = ele.content.measure;
              let fieldNames = dimensionLevelsArr.map((ele: any) => ele.fieldName);
              let MeasurefieldNames = measureArr.map((ele: any) => ele.fieldName);
              let dataSourceArr = ele.content.dataSource;

              const updatedDataSource = dataSourceArr.map((entry: any) => {
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

              let keys = dataSourceArr.map((ele: any) => Object.keys(ele));
              keys = keys.flatMap((subArray: any) => subArray)
              const matchingValue = fieldNames.find((value: any) => keys.includes(value));

              let seriesArr = ele.content.series.map((seriesEle: any) => {
                let obj = {
                  ...seriesEle,
                  dataSource: updatedDataSource,
                  xName: matchingValue
                }
                return obj
              })
              let primaryyAxis = { ...ele.content.primaryYAxis }
              let primaryYDataSourceEntry = seriesArr.find((series: any) => {
                return series
              });

              if (primaryYDataSourceEntry.dataSource.length <= 2) {

                const maxDataValue = seriesArr.reduce((maxValue: number, series: { dataSource: any[]; yName: string | number; }) => {
                  const seriesMax = Math.max(...series.dataSource.map((entry: { [x: string]: any; }) => entry[series.yName]));
                  return Math.max(maxValue, seriesMax);
                }, 0);


                primaryyAxis = {
                  ...primaryyAxis,
                  interval: primaryyAxis.interval !== undefined && primaryyAxis.interval !== null ? primaryyAxis.interval : undefined,
                  minimum: primaryyAxis.minimum !== undefined && primaryyAxis.minimum !== null ? primaryyAxis.minimum : 0,
                  maximum: primaryyAxis.maximum !== undefined && primaryyAxis.maximum !== null ? primaryyAxis.maximum : undefined,
                  labelStyle: {
                    fontFamily: 'Roboto, Segoe UI, GeezaPro, DejaVu Serif, "Times New Roman", sans-serif',
                    color: 'black'
                  }
                };


              } else {
                const yNameValue = primaryYDataSourceEntry.yName;
                let maximum = yNameValue * 1.3;
                primaryyAxis = {
                  ...primaryyAxis,
                  labelStyle: {
                    fontFamily: 'Roboto, Segoe UI, GeezaPro, DejaVu Serif, "Times New Roman", sans-serif',
                    color: 'black'
                  }

                }

              }

              // Ã°Å¸â€Â¹ Determine zoom mode based on seriesType
              const hasBarSeries = seriesArr.some(
                (s: any) =>
                  s.type?.toLowerCase() === 'bar' ||
                  s.type?.toLowerCase() === 'stackingbar'
              );

              // Ã°Å¸â€Â¹ Only update the mode, keep other settings as they are
              // const zoomSettings = {
              //   ...ele.content.zoomSettings,
              //   mode: hasBarSeries ? 'Y' : 'X'
              // };


              const isMobile = this.isMobileScreen();
              const zoomSettings = {
                ...ele.content.zoomSettings,
                mode: hasBarSeries ? 'Y' : 'X',
                // enableMouseWheelZooming: !isMobile,
                // enablePinchZooming: isMobile,
                // enableSelectionZooming: !isMobile,
                // choose sensible zoomFactor for mobile if you want a different default
                zoomFactor: isMobile ? (ele.content.zoomSettings?.zoomFactorMobile ?? 0.06) : (ele.content.zoomSettings?.zoomFactor ?? 1),
              };



              const chartObj = {
                ...ele,

                content: {
                  ...ele.content,
                  series: seriesArr,
                  primaryYAxis: primaryyAxis,
                  zoomSettings: zoomSettings,
                  legends: {
                    ...ele.content.legends,
                    textStyle: {
                      ...ele.content.legends.textStyle,
                      fontFamily: 'Roboto, Segoe UI, GeezaPro, DejaVu Serif, "Times New Roman", sans-serif',
                      // fontWeight: 'bold',
                      // size: '12px',
                      // color: 'black'
                    }
                  },
                  primaryXAxis: {
                    ...ele.content.primaryXAxis,
                    // interval : 5000,
                    labelStyle: {
                      fontFamily: 'Roboto, Segoe UI, GeezaPro, DejaVu Serif, "Times New Roman", sans-serif',
                      // fontFamily: 'Cambria, Cochin, Georgia, Times, "Times New Roman", serif',
                      // fontWeight: 'bold',
                      // size: '12px',
                      color: 'black'
                    }
                  },

                  axis: ele.content.axis?.map((ele: any) => {
                    const dataSourceEntry = seriesArr.find((series: any) => {
                      if (series.opposedPosition === true) {
                        return series
                      }
                    });

                    if (dataSourceEntry != undefined) {
                      if (dataSourceEntry.dataSource.length <= 5) {

                        const maxDataValue = seriesArr.reduce((maxValue: number, series: { dataSource: any[]; yName: string | number; }) => {
                          const seriesMax = Math.max(...series.dataSource.map((entry: { [x: string]: any; }) => entry[series.yName]));
                          return Math.max(maxValue, seriesMax);
                        }, 0);
                        let maximum = maxDataValue * 0.05;

                        let obj = {
                          ...ele,
                          interval: ele.interval !== undefined && ele.interval !== null ? ele.interval : undefined,
                          minimum: ele.minimum !== undefined && ele.minimum !== null ? ele.minimum : 0,
                          maximum: ele.maximum !== undefined && ele.maximum !== null ? ele.maximum : undefined,
                          labelStyle: {
                            fontFamily: 'Roboto, Segoe UI, GeezaPro, DejaVu Serif, "Times New Roman", sans-serif',
                            color: 'black'
                          }
                        };

                        return obj;
                      } else {
                        let obj = {
                          ...ele,
                          labelStyle: {
                            fontFamily: 'Roboto, Segoe UI, GeezaPro, DejaVu Serif, "Times New Roman", sans-serif',
                            color: 'black'
                          }
                        };
                        return obj;
                      }
                    }
                    else {
                      // return ele;
                      return {
                        ...ele,
                        // Ã¢Å“â€¦ Added labelStyle
                        labelStyle: {
                          fontFamily: 'Roboto, Segoe UI, GeezaPro, DejaVu Serif, "Times New Roman", sans-serif',

                          // fontWeight: 'bold',
                          // size: '12px',
                          color: 'black'
                        }
                      };
                    }
                  }),
                },
              };

              return chartObj;
            }
            else if (ele.panelType == 'Kanban') {
              let updatedDataSource = ele.content.dataSource.map((item: any, index: number) => ({
                ...item,
                Id: index + 1
              }));

              return {
                ...ele,
                content: {
                  ...ele.content,
                  dataSource: updatedDataSource
                }
              };
            } else if (ele.panelType == 'Gauge') {
              let updatedDataSource = ele.content.dataSource.map((item: any, index: number) => ({
                ...item,
                Id: index + 1
              }));
              return {
                ...ele,
                content: {
                  ...ele.content,
                  dataSource: updatedDataSource
                }
              };
            }
            else if (ele.panelType === "ListBox") {

              let data = [...ele.content.dataSource];
              this.listboxFilterItemData = data;

              // Process first 1000 records immediately for fast UI binding
              let first1000 = data.slice(0, 1000);
              let processedFirst1000 = [...this.getSortedData(first1000, ele.content.selectedValues_dataSource, ele)];

              processedFirst1000.forEach(filter => {
                this.listBoxBgColor = filter.isMatched ? 'matched' : 'non-matched';
              });

              // Bind first 1000 to UI immediately
              this.filteredData[ele.id] = processedFirst1000;
              this.originalData[ele.id] = processedFirst1000; // Temporary, will be updated

              // Process remaining records in background if data > 1000
              if (data.length > 1000) {
                setTimeout(() => {
                  let remaining = data.slice(1000);
                  let processedRemaining = [...this.getSortedData(remaining, ele.content.selectedValues_dataSource, ele)];
                  let fullProcessed = [...processedFirst1000, ...processedRemaining];

                  // Update with full processed data for filtering
                  this.originalData[ele.id] = fullProcessed;

                  // Update sessionStorage with full data
                  let existingStorage: { [key: string]: any[] } = {};
                  const stored = sessionStorage.getItem('dataSourceStorageObj');
                  if (stored) existingStorage = JSON.parse(stored);
                  existingStorage[ele.id] = fullProcessed;
                  sessionStorage.setItem('dataSourceStorageObj', JSON.stringify(existingStorage));
                }, 0);
              }

              let selectedValues = this.selectedItemsMap[ele.id] || [];
              const dataSourceStorageObj: { [key: string]: any[] } = {};
              const lastFilterObj = this.filterandDrilldownObjArray.filter_obj[this.filterandDrilldownObjArray.filter_obj.length - 1];
              const lastFilterObjMatch = lastFilterObj ? lastFilterObj.id === ele.id : false;

              let existingDataSourceStorageObj: { [key: string]: any[] } = {};
              const storedData = sessionStorage.getItem('dataSourceStorageObj');

              if (storedData) {
                existingDataSourceStorageObj = JSON.parse(storedData);
              }

              const isIdInStorage = Object.keys(existingDataSourceStorageObj).includes(ele.id);

              if (this.filterandDrilldownObjArray.filter_obj.length > 0) {
                if (!lastFilterObjMatch || !isIdInStorage) {
                  // Defer sessionStorage to not block UI rendering
                  setTimeout(() => {
                    existingDataSourceStorageObj[ele.id] = processedFirst1000;
                    sessionStorage.setItem('dataSourceStorageObj', JSON.stringify(existingDataSourceStorageObj));
                  }, 0);

                } else if (isIdInStorage) {
                  const storedData = existingDataSourceStorageObj[ele.id];
                  this.filteredData[ele.id] = storedData.slice(0, 1000);
                }
              } else {
                existingDataSourceStorageObj = {}
                sessionStorage.removeItem('dataSourceStorageObj')
              }

              // Hide loader after data processing for large datasets
              const dataSize = ele.content.dataSource?.length || 0;
              if (dataSize >= 1000) {
                this.hideLoaderAfterProcessing(ele.id, 200);
              }

              return ele;
            }

            // else if ( ele.panelType === "MultiSelectDropDown" || ele.panelType == 'InputBox') {
            //   let data = [...ele.content.dataSource];

            //   console.log('data multiselect dropdown', ele.id,  data)

            //   let selectedFilters = [...this.getSortedData(data, ele.content.selectedValues_dataSource, ele)];

            //   selectedFilters.forEach(filter => {
            //     if (filter.isMatched) {
            //       this.listBoxBgColor = 'matched';
            //     } else {
            //       this.listBoxBgColor = 'non-matched';
            //     }
            //   });

            //   let fulldataSource = selectedFilters;

            //   ele.content.dataSource = fulldataSource;
            //   // this.totalDataSource[ele.id] = fulldataSource;

            //   console.log('ele.content.fullDataSource', ele.content.dataSource)

            //   const dataSourceStorageObj: { [key: string]: any[] } = {};
            //   const lastFilterObj = this.filterandDrilldownObjArray.filter_obj[this.filterandDrilldownObjArray.filter_obj.length - 1];
            //   const lastFilterObjMatch = lastFilterObj ? lastFilterObj.id === ele.id : false;

            //   let existingDataSourceStorageObj: { [key: string]: any[] } = {};
            //   const storedData = sessionStorage.getItem('dataSourceStorageObj');
            //   if (storedData) {
            //     existingDataSourceStorageObj = JSON.parse(storedData);
            //   }

            //   const isIdInStorage = Object.keys(existingDataSourceStorageObj).includes(ele.id);

            //   if (this.filterandDrilldownObjArray.filter_obj.length > 0) {
            //     if (!lastFilterObjMatch || !isIdInStorage) {
            //       existingDataSourceStorageObj[ele.id] = selectedFilters;
            //       sessionStorage.setItem('dataSourceStorageObj', JSON.stringify(existingDataSourceStorageObj));

            //     } else if (isIdInStorage) {
            //       selectedFilters = existingDataSourceStorageObj[ele.id];
            //       ele.content.dataSource = selectedFilters;
            //       // this.totalDataSource[ele.id] = fulldataSource;
            //     }
            //   } else {
            //     existingDataSourceStorageObj = {}
            //     sessionStorage.removeItem('dataSourceStorageObj')
            //   }


            //   return ele
            // }

            else if (ele.panelType === "MultiSelectDropDown") {
              this.syncPanelSelectionState(ele);
              let data = [...ele.content.dataSource];

              // Process first 1000 records immediately for fast UI binding
              let first1000 = data.slice(0, 1000);
              let processedFirst1000 = this.decorateMultiselectData(
                [...this.getSortedData(first1000, ele.content.selectedValues_dataSource, ele)],
                ele.id
              );

              processedFirst1000.forEach(filter => {
                if (filter.isMatched) {
                  this.listBoxBgColor = 'matched';
                } else {
                  this.listBoxBgColor = 'non-matched';
                }
              });

              // Bind first 1000 to UI immediately
              this.totalDataSource[ele.id] = processedFirst1000;
              ele.content.dataSource = this.totalDataSource[ele.id];
              this.originalData[ele.id] = processedFirst1000; // Temporary

              // Process remaining records in background if data > 1000
              if (data.length > 1000) {
                setTimeout(() => {
                  let remaining = data.slice(1000);
                  let processedRemaining = this.decorateMultiselectData(
                    [...this.getSortedData(remaining, ele.content.selectedValues_dataSource, ele)],
                    ele.id
                  );
                  let fullProcessed = [...processedFirst1000, ...processedRemaining];

                  // Update with full processed data for filtering
                  this.originalData[ele.id] = fullProcessed;

                  // Update sessionStorage with full data
                  let existingStorage: { [key: string]: any[] } = {};
                  const stored = sessionStorage.getItem('dataSourceStorageObj');
                  if (stored) existingStorage = JSON.parse(stored);
                  existingStorage[ele.id] = fullProcessed;
                  sessionStorage.setItem('dataSourceStorageObj', JSON.stringify(existingStorage));
                }, 0);
              }

              const dataSourceStorageObj: { [key: string]: any[] } = {};
              const lastFilterObj = this.filterandDrilldownObjArray.filter_obj[this.filterandDrilldownObjArray.filter_obj.length - 1];
              const lastFilterObjMatch = lastFilterObj ? lastFilterObj.id === ele.id : false;

              let existingDataSourceStorageObj: { [key: string]: any[] } = {};
              const storedData = sessionStorage.getItem('dataSourceStorageObj');


              if (storedData) {
                existingDataSourceStorageObj = JSON.parse(storedData);
              }

              const isIdInStorage = Object.keys(existingDataSourceStorageObj).includes(ele.id);

              if (this.filterandDrilldownObjArray.filter_obj.length > 0) {
                if (!lastFilterObjMatch || !isIdInStorage) {
                  // Defer sessionStorage to not block UI rendering
                  setTimeout(() => {
                    existingDataSourceStorageObj[ele.id] = processedFirst1000;
                    sessionStorage.setItem('dataSourceStorageObj', JSON.stringify(existingDataSourceStorageObj));
                  }, 0);

                } else if (isIdInStorage) {
                  const storedData = existingDataSourceStorageObj[ele.id];
                  this.totalDataSource[ele.id] = storedData.slice(0, 1000);
                  ele.content.dataSource = this.totalDataSource[ele.id];
                }

              } else {
                existingDataSourceStorageObj = {}
                sessionStorage.removeItem('dataSourceStorageObj')
              }

              // Hide loader after data processing for large datasets
              const dataSize = this.originalData[ele.id]?.length || 0;
              if (dataSize >= 1000) {
                this.hideLoaderAfterProcessing(ele.id, 200);
              }

              return ele
            }

            else if (ele.panelType == 'InputBox') {
              // âœ… CRITICAL: InputBox - Skip processing entirely, just limit data
              const inputBoxDataSize = ele.content.dataSource?.length || 0;
              if (inputBoxDataSize > 100) {
                return {
                  ...ele,
                  content: {
                    ...ele.content,
                    dataSource: ele.content.dataSource.slice(0, 100)
                  }
                };
              }
              return ele;
            }





            else if (ele.panelType === "DropdownList") {
              let data = [...ele.content.dataSource];

              // Process first 1000 records immediately for fast UI binding
              let first1000 = data.slice(0, 1000);
              let processedFirst1000 = [...this.getSortedData(first1000, ele.content.selectedValues_dataSource, ele)];

              processedFirst1000.forEach(filter => {
                if (filter.isMatched) {
                  this.listBoxBgColor = 'matched';
                } else {
                  this.listBoxBgColor = 'non-matched';
                }
              });

              // Bind first 1000 to UI immediately
              this.totalDataSource[ele.id] = processedFirst1000;
              this.originalData[ele.id] = processedFirst1000; // Temporary

              // Initialize page index
              this.pageIndex[ele.id] = 0;

              // Process remaining records in background if data > 1000
              if (data.length > 1000) {
                setTimeout(() => {
                  let remaining = data.slice(1000);
                  let processedRemaining = [...this.getSortedData(remaining, ele.content.selectedValues_dataSource, ele)];
                  let fullProcessed = [...processedFirst1000, ...processedRemaining];

                  // Update with full processed data for filtering
                  this.originalData[ele.id] = fullProcessed;

                  // Update sessionStorage with full data
                  let existingStorage: { [key: string]: any[] } = {};
                  const stored = sessionStorage.getItem('dataSourceStorageObj');
                  if (stored) existingStorage = JSON.parse(stored);
                  existingStorage[ele.id] = fullProcessed;
                  sessionStorage.setItem('dataSourceStorageObj', JSON.stringify(existingStorage));
                }, 0);
              }

              // console.log('ele.content.fullDataSource', ele.content.fullDataSource)

              const dataSourceStorageObj: { [key: string]: any[] } = {};
              const lastFilterObj = this.filterandDrilldownObjArray.filter_obj[this.filterandDrilldownObjArray.filter_obj.length - 1];
              const lastFilterObjMatch = lastFilterObj ? lastFilterObj.id === ele.id : false;

              let existingDataSourceStorageObj: { [key: string]: any[] } = {};
              const storedData = sessionStorage.getItem('dataSourceStorageObj');
              if (storedData) {
                existingDataSourceStorageObj = JSON.parse(storedData);
              }

              const isIdInStorage = Object.keys(existingDataSourceStorageObj).includes(ele.id);

              if (this.filterandDrilldownObjArray.filter_obj.length > 0) {
                if (!lastFilterObjMatch || !isIdInStorage) {
                  // Defer sessionStorage to not block UI rendering
                  setTimeout(() => {
                    existingDataSourceStorageObj[ele.id] = processedFirst1000;
                    sessionStorage.setItem('dataSourceStorageObj', JSON.stringify(existingDataSourceStorageObj));
                  }, 0);

                } else if (isIdInStorage) {
                  const storedData = existingDataSourceStorageObj[ele.id];
                  this.totalDataSource[ele.id] = storedData.slice(0, 1000);
                }
              } else {
                existingDataSourceStorageObj = {}
                sessionStorage.removeItem('dataSourceStorageObj')
              }

              // Hide loader after data processing for large datasets
              const dataSize = this.originalData[ele.id]?.length || 0;
              if (dataSize >= 1000) {
                this.hideLoaderAfterProcessing(ele.id, 200);
              }


              return ele
            }

            else if (ele.panelType === 'Table') {
              if (ele.content.is_pagination_enabled == true) {
                let paginationTable = ele.content.table_pagination;

                this.initialPage = {
                  currentPage: paginationTable.current_page,
                  pageSizes: ['20', '50', '100', '200', '500', '1000'],
                  pageSize: paginationTable.items_per_page,
                  totalPage: paginationTable.total_pages,
                  totalRecordCount: paginationTable.total_records
                }

                const query = new Query();
                const currentResult: any = new DataManager(ele.content.dataSource).executeLocal(query);


                const tableRows = this.extractTableRows(ele.content.dataSource);
                let matchedFields = ele.content.matchedFieldDetails?.filter((field: any) =>
                  Object.keys(tableRows[0] || {}).includes(field.field)
                );
                matchedFields = matchedFields && matchedFields.length > 0
                  ? matchedFields
                  : this.buildTableFieldDetailsFromRows(tableRows);
                const measureArr = ele.content.measure || [];
                matchedFields = matchedFields.map((field: any) => {
                  const fieldKey = field?.field || field?.fieldName || field?.name;
                  return {
                    ...field,
                    field: fieldKey,
                    headerText: this.resolveTableHeaderText(ele, field, measureArr, fieldKey, this.getActiveTableDrillLevel(ele) || this.getBaseTableLevel(ele))
                  };
                });
                matchedFields = this.applyDrillHeaderToTableFields(ele, matchedFields);

                if (currentResult.length) {
                  let tableDataSource = {
                    result: currentResult, // Result of the data
                    count: this.initialPage.totalRecordCount // Total record count
                  };

                  let obj = {
                    ...ele,
                    content: {
                      ...ele.content,
                      dataSource: tableDataSource,
                      fieldDetails: matchedFields
                    }
                  }
                  return obj
                } else {
                  return ele
                }
              } else {
                const measureArr = ele.content.measure || [];
                const fieldDetails = (ele.content.fieldDetails || []).map((field: any) => {
                  const fieldKey = field?.field || field?.fieldName || field?.name;
                  return {
                    ...field,
                    field: fieldKey,
                    headerText: this.resolveTableHeaderText(ele, field, measureArr, fieldKey, this.getActiveTableDrillLevel(ele) || this.getBaseTableLevel(ele)),
                  };
                });

                let obj = {
                  ...ele,
                  content: {
                    ...ele.content,
                    fieldDetails: fieldDetails
                  }
                }
                return obj
              }

            }
            else if (ele.panelType === 'Box') {
              let resData = ele.content;

              const processDataSource = (dataSource: any[], rawQuery: string, fieldDetails: any[]): any[] => {

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

                return dataSource;

              }

              let obj = {
                ...ele,
                content: {
                  ...ele.content,
                }
              }

              obj.content.dataSource = obj.content.dataSource.map((item: any) => {
                let updatedItem = { ...item }; // Clone the object to prevent mutation

                // Iterate through fieldDetails and match fieldName with keys in dataSource object
                obj.content.fieldDetails.forEach((field: any) => {
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

              return obj

            }
            else if (ele.panelType === 'Pivot') {

              // const dataSourceSize = ele.content.dataSourceSettings.dataSource?.length || 0;
              // // Dynamic timeout based on datasource size: 200ms per 1000 rows, min 1.5s, max 30s.
              // const calculatedTimeout = Math.min(30000, Math.max(1500, Math.ceil(dataSourceSize / 1000) * 200));
              // ele.loaderTimeout = calculatedTimeout;

              // newly added for removing pullstop in the cell 
              //  ele.content.dataSourceSettings.dataSource = ele.content.dataSourceSettings.dataSource.map((row: any, index: number) => {
              //   const cleanedRow: any = {};

              //   // Ã¢Å“â€¦ Add a hidden unique identifier to prevent merging
              //   cleanedRow['_rowIndex'] = index;

              //   Object.keys(row).forEach(key => {
              //     const value = row[key];

              //     if (value !== null && value !== undefined) {
              //       // Only clean if it's a STRING type (not number)
              //       if (typeof value === 'string' && value.indexOf('.') !== -1) {
              //         // Check if it's NOT a numeric string (like "123.45")
              //         if (isNaN(Number(value))) {
              //           // It's a text string with period, clean it
              //           cleanedRow[key] = value.replace(/\./g, ' ').trim();
              //         } else {
              //           // It's a numeric string, keep as is
              //           cleanedRow[key] = value;
              //         }
              //       } else {
              //         cleanedRow[key] = value;
              //       }
              //     } else {
              //       cleanedRow[key] = value;
              //     }
              //   });

              //   return cleanedRow;
              // });
              // // 

              let total = 0;

              // Get fields where formatType is 'string' and intended for transformation
              const timeFields = ele.content.fieldDetails.filter(
                (f: any) => f.formatType === 'string' && f.name
              ).map((f: any) => f.name);

              const data = ele.content.dataSourceSettings.dataSource.map((row: any) => {
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

              ele.content.dataSourceSettings.dataSource = data;
              let obj = {
                ...ele,
                content: {
                  ...ele.content,
                  // dataSource: processDataSource(resData.dataSource, resData.rawQuery, resData.fieldDetails)
                }
              }

              return obj

            } else if (ele.panelType == 'Calender') {
              let ScedularData = ele;
              // console.log('scheduler', ScedularData);
              // Update the Id field in the dataSource
              let updatedDataSource = ScedularData.content.dataSource.map((item: any, index: number) => ({
                ...item,
                Id: index + 1
              }));

              // console.log('ele.content.resources.dataSource', ele.content.resources.dataSource)

              let updatedzresouceDataSource = ele.content.resources.dataSource.map((item: any, index: number) => ({
                ...item,
                Id: index + 1
              }));

              // console.log('updatedDataSource', updatedDataSource);

              ScedularData.content.dataSource = updatedDataSource;

              ele.content.resources.dataSource = this.getResourceData(ele.content.resources, updatedzresouceDataSource, ele.content.fieldDetails);
              ele.content.eventSettings.dataSource = updatedDataSource;

              // console.log('eventSettings', ele.content);
              return ele;
            }

            else {
              return ele
            }
          });

          // Set loading state: Only pivot tables show loader, others hide immediately
          panelsData.forEach((p: any) => {
            if (p.panelType === 'Pivot') {
              // Check if pivot dataSource is empty - hide loader immediately if empty
              const hasData = p.content?.dataSourceSettings?.dataSource &&
                Array.isArray(p.content.dataSourceSettings.dataSource) &&
                p.content.dataSourceSettings.dataSource.length > 0;

              if (hasData) {
                // Pivot tables will hide loader via enginePopulated event
                p.isLoading = true;
              } else {
                // Empty dataSource - hide loader immediately
                p.isLoading = false;
              }
            } else {
              // All other components hide loader immediately as data is ready
              p.isLoading = false;
            }
          });

          this.panelSeriesArray = panelsData;
          this.cdr.detectChanges();
          this.refreshRenderedCharts();

          // Hide loaders for pivot panels individually based on datasource size
          // if (this.panelSeriesArray) {
          //   this.panelSeriesArray.forEach((p: any) => {
          //     if (p.panelType === 'Pivot') {
          //       setTimeout(() => {
          //         p.isLoading = false;
          //         this.cdr.detectChanges();
          //       }, p.loaderTimeout || 1100); // Fallback to 1100ms
          //     }
          //   });
          // }
          // gauge
          setTimeout(() => {
            this.panelSeriesArray.forEach((panel: any) => {
              if (panel.panelType === 'Gauge') {
                this.initGaugeResizeObserver(panel.id);
              }
            });
          }, 600);
          // 
          console.log('PanelSeriesArray', this.panelSeriesArray)

          let emptyPanelsArray = this.panelSeriesArray.map((ele: any) => {
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
            } else if (ele.panelType == "Box" || ele.panelType == "Card" || ele.panelType == "DropdownList" || ele.panelType == "ListBox" || ele.panelType == "MultiSelectDropDown" || ele.panelType == 'InputBox') {
              return {
                ...ele,
                content: {
                  ...ele.content,
                  dataSource: [],
                  selectedValues_dataSource: [],

                }
              }
            }
            else if (ele.panelType == 'Calender') {
              // Exclude large calendar data from sessionStorage to prevent quota issues
              return {
                ...ele,
                content: {
                  ...ele.content,
                  dataSource: [], // Clear calendar events
                  eventSettings: {
                    ...ele.content.eventSettings,
                    dataSource: [] // Clear eventSettings dataSource
                  },
                  resources: {
                    ...ele.content.resources,
                    dataSource: [] // Clear resources dataSource
                  }
                }
              }

            } else if (ele.panelType == "DatePicker" || ele.panelType == "DateRangePicker" || ele.panelType == "RawDataDump") {
              return {
                ...ele
              }
            }
          })


          // Change detection handled automatically

          const panelSeriesArrayString = JSON.stringify(emptyPanelsArray);

          sessionStorage.setItem('panelSeriesArray', panelSeriesArrayString)
          this.cdr.detectChanges();

          // Hide global loader after rendering completes
          // Double requestAnimationFrame ensures components are rendered in both dev and prod builds
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              this.loaderService.hide();
              this.cdr.detectChanges();
            });
          });

        } else {
          // this.showPopup(false, '35px', res.message);
          this.loaderService.hide()

          // Hide all panel loaders on error
          if (this.panelSeriesArray) {
            this.panelSeriesArray.forEach((p: any) => {
              p.isLoading = false;
            });
          }

          // Change detection handled automatically
          this.popupService.showPopup({
            message: res.message,
            statusCode: res.status_code,
            status: false
          });

        }
      },

      (err: any) => {

        this.loaderService.hide();

        // Hide all panel loaders on error
        if (this.panelSeriesArray) {
          this.panelSeriesArray.forEach((p: any) => {
            p.isLoading = false;
          });
        }

        this.cdr.detectChanges();
        const errorMessage = err.error && err.error.message ? err.error.message : err.message;
        this.popupService.showPopup({
          message: errorMessage,
          statusCode: err.status,
          status: false
        });
      }
    )

  }


  onPivotRendered(item: any, pivotviewObj: PivotViewComponent) {
    if (item?.isLoading) {
      item.isLoading = false;
      this.cdr.markForCheck();
    }

    this.applyPivotValueAlignment(pivotviewObj);

    if (item?.content?.headerFormatting && Array.isArray(item.content.headerFormatting)) {
      this.applyPivotHeaderFormattingDOM(pivotviewObj, item);
    }
  }

  private applyPivotValueAlignment(pivotviewObj: PivotViewComponent): void {
    const pivotContainer = pivotviewObj?.element;
    if (!pivotContainer) {
      return;
    }

    const centerValueCells = () => {
      const valueCells = pivotContainer.querySelectorAll(
        '.e-valuescontent .e-rowcell, .e-valuescontent .e-cellvalue, .e-pivotvaluecell, .e-pivotvaluecell .e-cellvalue'
      );

      valueCells.forEach((cell: Element) => {
        const htmlCell = cell as HTMLElement;
        htmlCell.style.setProperty('text-align', 'center', 'important');
        htmlCell.style.setProperty('padding-right', '0', 'important');
        htmlCell.style.setProperty('justify-content', 'center', 'important');
        htmlCell.classList.remove('e-right-align', 'e-rightalign', 'e-right');
      });
    };

    centerValueCells();
    setTimeout(centerValueCells, 0);
    setTimeout(centerValueCells, 50);
  }


  // Track page size & offset
  pageSize = 1000;
  pageIndex: { [key: string]: number } = {}; // per-panel tracking
  // Ã°Å¸â€˜â€¡ add this line
  private scrollHandler: ((e: Event) => void) | null = null;
  private isLoadingMore: { [key: string]: boolean } = {}; // prevent multiple rapid loads
  // 
  private gaugeResizeObservers: Map<string, ResizeObserver> = new Map();

  // 

  onDropdownOpen(args: any, item: any, dropdownList: any) {
    // console.log('onMultiDropdownOpen args', args, item, dropdownList);

    setTimeout(() => {
      const popupElement = dropdownList.popupObj?.element?.querySelector('.e-content') as HTMLElement;
      if (!popupElement) return;

      // remove old listener if exists
      if (this.scrollHandler) {
        popupElement.removeEventListener('scroll', this.scrollHandler);
      }

      // assign new handler
      this.scrollHandler = (e: Event) => {
        const threshold = 20;
        if (popupElement.scrollTop + popupElement.clientHeight >= popupElement.scrollHeight - threshold) {
          // console.log('dropdownlist', dropdownList)
          this.loadMoreData(item, dropdownList);
        }
      };

      if (this.scrollHandler) {
        popupElement.addEventListener('scroll', this.scrollHandler);
      }
    });
  }


  loadMoreData(item: any, dropdownList: any) {
    const fullData = item.content.dataSource || [];
    const id = item.id;

    if (!this.pageIndex[id]) {
      this.pageIndex[id] = 1; // first 1000 already shown
    }

    const start = this.pageIndex[id] * this.pageSize;
    const end = start + this.pageSize;
    const nextChunk = fullData.slice(start, end);

    if (nextChunk.length > 0) {
      this.totalDataSource[id] = [...this.totalDataSource[id], ...nextChunk];
      this.pageIndex[id]++;

      // console.log('loadMoreData for', this.totalDataSource[id], 'nextChunk', nextChunk);
      // console.log(`Loading chunk for ${id} from ${start} to ${end} - chunk size:`, nextChunk.length);
      // console.log('nextChunk', nextChunk, this.totalDataSource[id].length - nextChunk.length)

      // Ã¢Å“â€¦ Append new items to popup without closing
      dropdownList.addItem(nextChunk, this.totalDataSource[id].length - nextChunk.length);
    }
  }



  // Called when popup opens
  onMultiDropdownOpen(args: any, item: any, multiselect: any) {
    // console.log('onMultiDropdownOpen args', args, item, multiselect);
    // console.log('totalDataSource for', item.id, ':', this.totalDataSource[item.id]?.length);
    // console.log('originalData for', item.id, ':', this.originalData[item.id]?.length);

    // Ã¢Å“â€¦ Initialize pageIndex if not already set - start from 0, will increment to 1 when first additional page loads
    if (!this.pageIndex[item.id]) {
      this.pageIndex[item.id] = 0; // First page (0-999) already loaded, next will be page 1 (1000-1999)
    }

    setTimeout(() => {
      // Try multiple selectors for multiselect popup content
      let popupElement = multiselect.popupObj?.element?.querySelector('.e-content') as HTMLElement;
      if (!popupElement) {
        popupElement = multiselect.popupObj?.element?.querySelector('.e-list-parent') as HTMLElement;
      }
      if (!popupElement) {
        popupElement = multiselect.popupObj?.element?.querySelector('.e-dropdownbase') as HTMLElement;
      }

      // console.log('MultiSelect popup element found:', !!popupElement, popupElement);
      if (!popupElement) return;

      if (this.scrollHandler) {
        popupElement.removeEventListener('scroll', this.scrollHandler);
      }

      this.scrollHandler = (e: Event) => {
        e.stopPropagation(); // Prevent event bubbling
        const threshold = 20;
        console.log('Multiselect scroll detected:', {
          scrollTop: popupElement.scrollTop,
          clientHeight: popupElement.clientHeight,
          scrollHeight: popupElement.scrollHeight,
          bottomReached: popupElement.scrollTop + popupElement.clientHeight >= popupElement.scrollHeight - threshold
        });

        if (popupElement.scrollTop + popupElement.clientHeight >= popupElement.scrollHeight - threshold) {
          // console.log('Ã¢Å“â€¦ MultiSelect scroll reached bottom - loading more data');
          e.preventDefault(); // Prevent any default scroll behavior
          this.loadMoreMultiselectData(item, multiselect);
        }
      };

      if (this.scrollHandler) {
        popupElement.addEventListener('scroll', this.scrollHandler);
        // console.log('Scroll handler attached to multiselect popup');
      }

      // Ã¢Å“â€¦ always bind already loaded data when opening
      multiselect.dataSource = this.totalDataSource[item.id] || [];
      multiselect.value = this.getMultiselectUiSelection(item.id);
      multiselect.dataBind();
    }, 100); // Increased timeout to ensure popup is fully rendered
  }

  // Called on scroll
  loadMoreMultiselectData(item: any, multiselect: any) {
    const id = item.id;

    // Ã¢Å“â€¦ Prevent multiple concurrent loads
    if (this.isLoadingMore[id]) {
      // console.log('Already loading more data for', id);
      return;
    }

    this.isLoadingMore[id] = true;
    // console.log('Ã°Å¸â€â€ž Loading more multiselect data for:', id);

    // Ã¢Å“â€¦ Use original full data instead of potentially filtered data
    const fullData = this.originalData[id] || item.content.dataSource || [];

    // console.log('Full data length:', fullData.length);
    // console.log('Current page index:', this.pageIndex[id]);
    // console.log('Current totalDataSource length:', this.totalDataSource[id]?.length);

    if (!this.pageIndex[id]) {
      this.pageIndex[id] = 0; // already showing first page (0-999)
    }

    // Calculate next page start - increment pageIndex first to get next page
    this.pageIndex[id]++;
    const start = this.pageIndex[id] * this.pageSize;
    const end = start + this.pageSize;
    const nextChunk = fullData.slice(start, end);

    // console.log('Loading chunk from', start, 'to', end, '- chunk size:', nextChunk.length);

    if (nextChunk.length > 0) {
      // Ã¢Å“â€¦ Completely replace the dataSource with new extended data
      const currentData = this.totalDataSource[id] || [];
      this.totalDataSource[id] = [...currentData, ...nextChunk];

      // console.log('Extended totalDataSource to', this.totalDataSource[id].length, 'records');

      // Ã¢Å“â€¦ Store current selected values to preserve them
      const currentValue = multiselect.value;

      // Ã¢Å“â€¦ Completely refresh the multiselect with new data
      multiselect.dataSource = [...this.totalDataSource[id]]; // Create new array reference
      multiselect.dataBind();

      // Ã¢Å“â€¦ Restore selected values
      if (currentValue && currentValue.length > 0) {
        multiselect.value = currentValue;
      } else {
        multiselect.value = this.getMultiselectUiSelection(id);
      }

      // console.log('Ã°Å¸â€â€ž MultiSelect refreshed with', this.totalDataSource[id].length, 'total records');

      // Ã¢Å“â€¦ Force change detection
      this.cdr.detectChanges();
    } else {
      // console.log('No more data to load');
    }

    // Ã¢Å“â€¦ Reset loading flag
    this.isLoadingMore[id] = false;
  }




  startTracking() {
    let loginTimeData: any = sessionStorage.getItem('loginSession');
    if (loginTimeData) {
      loginTimeData = JSON.parse(loginTimeData);

      // Check if view timing already stored
      let viewTracking: any = sessionStorage.getItem('viewTracking');
      if (!viewTracking) {
        const viewStartTime = new Date();
        viewTracking = {
          view_timing: viewStartTime.toISOString(),
          dashboard_name: this.dashboardName,
          dashboard_id: this.editDashboardId,
          session_unique_id: loginTimeData.session_unique_id,
          // user_id: loginTimeData.user_id,
          // username: loginTimeData.username,
          view_duration: 0
        };
        sessionStorage.setItem('viewTracking', JSON.stringify(viewTracking));
      } else {
        viewTracking = JSON.parse(viewTracking);
      }

      // Set the reference start time for timer calculations
      this.viewStartTime = new Date(viewTracking.view_timing);
      // console.log('First Tracking Call:', viewTracking);
      // console.log('Ã°Å¸â€¢â€™ View Timing in Local Time:', new Date(viewTracking.view_timing).toLocaleString());

      // Ã°Å¸â€Â¹ Immediate API call on load with duration 0
      this.chartService.DashboardTrackSubmit(viewTracking).subscribe({
        next: (res) => console.log('Initial tracked dashboard response:', res),
        error: (err) => console.error('Initial tracking failed:', err),
      });

      // Ã°Å¸â€Â Start the timer every 3 minutes (180000 ms)
      this.timerSubscription = interval(180000).subscribe(() => {
        const now = new Date();
        const diffMs = now.getTime() - this.viewStartTime.getTime();
        const diffMins = Math.floor(diffMs / 60000);

        const updatedObj = {
          ...viewTracking,
          view_duration: diffMins
        };
        sessionStorage.setItem('viewTracking', JSON.stringify(updatedObj));

        // console.log('Updated viewTracking:', updatedObj);
        // console.log('Ã°Å¸â€¢â€™ View Timing in Local Time:', new Date(viewTracking.view_timing).toLocaleString());

        // Ã°Å¸â€Â½ API call after every 3 minutes
        this.chartService.DashboardTrackSubmit(updatedObj).subscribe({
          next: (res) => console.log('Tracked Dashboard response:', res),
          error: (err) => console.error('Tracking failed:', err),
        });
      });
    }
  }


  // trackById(index: number, item: any): number | string {
  //   //// console.log('index', index, item);

  //   // return item.id; // Replace with a unique identifier
  //   return `${item.id}-${index}`;
  //   this.panelSeriesArray = [...this.panelSeriesArray]; 
  // }



  onBookmarkFilterSave() {

    //  let storedData: any = localStorage.getItem('storedDrilldownAndFilterArray');
    let storedData: any = sessionStorage.getItem('storedDrilldownAndFilterArray');
    if (storedData) {
      storedData = JSON.parse(storedData);

      let filterObjEle = {
        "filter_obj": storedData.filter_obj,
        "drilldown_obj": storedData.drilldown_obj,
        "disabled_filterObj": storedData.disabled_filterObj,
        drilldown_table_obj: storedData.drilldown_table_obj

        // "bookmark_filterObj" :storedData.filter_obj,
        // is_default_bookmark_filter : false
      }

      let obj = {
        "bookmark_filterObj": storedData.filter_obj,
        is_default_bookmark_filter: false
      }

      if (this.userInformationData.role == 'superadmin' || this.userInformationData.role == 'admin') {
        filterObjEle = {
          "filter_obj": storedData.filter_obj,
          "drilldown_obj": storedData.drilldown_obj,
          "disabled_filterObj": storedData.disabled_filterObj,
          drilldown_table_obj: storedData.drilldown_table_obj

          // "bookmark_filterObj" :storedData.filter_obj,
          // is_default_bookmark_filter : true
        }

        obj = {
          "bookmark_filterObj": storedData.filter_obj,
          is_default_bookmark_filter: true
        }

        this.bookmark_flag = true
      } else {
        this.bookmark_flag = false
      }

      // this.userInformationData.role
      this.defaultDialog1.hide();
      this.loaderService.show();
      this.cdr.detectChanges();

      //// //console.log(this.editDashboardId, obj.bookmark_filterObj, obj.is_default_bookmark_filter)
      this.chartService.createBookmarkFilterById(this.editDashboardId, this.bookmark_flag, obj.bookmark_filterObj).subscribe(
        (res: any) => {
          // this.showPopup(res.success, '35px', res.message);
          this.loaderService.hide();

          this.popupService.showPopup({
            message: res.message,
            statusCode: res.status_code,
            status: res.success
          });

        },

        (err: any) => {
          // this.showPopup(false, '35px', "Something Went wrong, Please reload the page");
          const errorMessage = err.error && err.error.message ? err.error.message : err.message;
          this.popupService.showPopup({
            message: errorMessage,
            statusCode: err.status,
            status: false
          });
          this.loaderService.hide();
        }

      )
      // this.onFetchData(this.editDashboardId, filterObjEle);
      //// //console.log('filterObjEle', filterObjEle);


      filterObjEle = {
        "filter_obj": storedData.filter_obj,
        "drilldown_obj": storedData.drilldown_obj,
        "disabled_filterObj": storedData.disabled_filterObj,
        drilldown_table_obj: storedData.drilldown_table_obj

        // "bookmark_filterObj" :[],
        // is_default_bookmark_filter : false

      }

      //  localStorage.setItem('storedDrilldownAndFilterArray', JSON.stringify(filterObjEle))
      sessionStorage.setItem('storedDrilldownAndFilterArray', JSON.stringify(filterObjEle))

    }


  }



  pivottoolbarClick(args: any, pivotviewInstance: PivotViewComponent, item: any) {
    //// //console.log('pivotviewInstance', pivotviewInstance, args, item)
    args.customToolbar.splice(3, 0, {
      prefixIcon: 'e-icons e-expand',
      tooltipText: 'Expand/Collapse',
      cssClass: 'e-btn',
      click: () => this.toolbarClicked(pivotviewInstance, item), // Bind to specific instance
    });

  }



  tableLevels: { [key: string]: number } = {};
  tableDrilldownLevelFlag: boolean = false;


  onGridCellClick(eve: any, item: any, grid: GridComponent) {
    if (!grid || !grid.element) {
      return;
    }
    let gridComponent = grid;

    const scrollPosition = window.scrollY;

    let matchedItemObj = this.panelSeriesArray.find((ele: any) => ele.id === item.id);
    if (matchedItemObj) {
      // const clickedCell = eve.target;
      // console.log('clickedCell', clickedCell)
      const targetEl = eve.target as HTMLElement;

      console.log('targetEl', targetEl);

      // Ensure the click originated from a grid cell and not a toolbar or other element
      const clickedCell = targetEl.closest('.e-rowcell') as HTMLElement;
      if (!clickedCell) {
        // console.log('Click did not originate from a grid cell, returning.');
        return; // Not a grid cell, so do nothing.
      }

      // Check if click was inside the comment button
      const commentButton = targetEl.closest('button.comment-btn');
      // console.log('commentButton', commentButton);

      if (commentButton) {
        // console.log("Comment button clicked Ã¢â€ â€™ open dialog");
        return; // stop drilldown
      }
      const anchorTag = clickedCell.closest('a');

      if (anchorTag) {
        eve.preventDefault(); // Stop the default hyperlink behavior
        return; // Exit without performing drilldown for hyperlinks
      }

      const grid = (document.querySelector('ejs-grid') as any).ej2_instances[0];
      // console.log('grid', grid);

      const clickedCellTd = (eve.target as HTMLElement).closest('td'); // find the parent <td>
      if (!clickedCell) return; // safety check


      const columnIndex = (clickedCellTd as HTMLTableCellElement).cellIndex;
      // console.log('columnIndex', columnIndex);

      const column = gridComponent.getColumns()[columnIndex];
      // console.log('column', column);

      const fieldName = column?.field;

      // console.log('Field Name:', fieldName);


      //    const filterIndex = this.filterandDrilldownObjArray.filter_obj.findIndex(
      //       (obj: any) => obj.field_name === fieldName
      //    );

      // Only update an existing table-drill filter for this panel.
      // Do not overwrite global filters (e.g., dateRangePicker) that can share the same field_name.
      const filterIndex = this.filterandDrilldownObjArray.filter_obj.findIndex(
        (obj: any) =>
          obj.id === item.id &&
          obj.object_type === 'Table' &&
          obj.field_name === fieldName &&
          obj.table_name === item.content.tableName
      );

      //console.log('filterIndex', filterIndex)
      const cellValue = this.parseValue(eve.target.textContent);

      let rawText = clickedCell.innerText.trim();

      // Remove the comment icon if present
      rawText = rawText.replace('Ã°Å¸â€™Â¬', '').trim();

      const cellValue1 = this.parseValue(rawText);

      // console.log('cellValue1>>>>>>>>>>>>>>>>>>>>>>>>>>>>', cellValue1)


      let filterObj: any = {
        id: item.id,
        field_name: fieldName,
        label_name: fieldName,
        table_name: item.content.tableName,
        values: [cellValue1],
        object_type: "Table",
        date_format: '',
        isInitialFilter: false,
      };


      // Check if dimensionLevels is available
      let dimensionLevels = matchedItemObj.content.dimension ? matchedItemObj.content.dimension.levels : [];

      // console.log('dimensiotnLevels', dimensionLevels)

      if (dimensionLevels && dimensionLevels.length > 0) {
        // console.log('helllllllllllo')
        // logic for drilldown 
        if (!this.tableLevels[item.id]) {
          this.tableLevels[item.id] = 0;
        }

        let maxLevel = dimensionLevels.length;
        // console.log('maxLevel', maxLevel)

        let currentLevel = this.tableLevels[item.id];
        // console.log('currentLevel', currentLevel)

        let selectedLevel = dimensionLevels[currentLevel];
        // console.log('selectedLevel', selectedLevel)

        // let matchedFieldLevel = dimensionLevels.find((ele: any) => ele.fieldName == fieldName);
        let matchedFieldLevel = dimensionLevels.find((ele: any) => ele.fieldName == fieldName);
        // console.log('matchedFieldLevel', matchedFieldLevel)

        if (fieldName !== selectedLevel.fieldName) {
          console.warn(
            `Ã¢â€ºâ€ Ignored click on ${fieldName}, expected ${selectedLevel.fieldName} for level ${currentLevel}`
          );
          return; // stop here
        }

        let matchedFieldLevel1 = selectedLevel;

        // console.log('matchedFieldLevel1', matchedFieldLevel1)



        this.tableDrilldownLevelFlag = true;

        if (matchedFieldLevel) {
          // console.log('matchedFieldLevel', matchedFieldLevel)
          if (matchedFieldLevel.fieldName == selectedLevel.fieldName) {
            this.tableLevels[item.id] = (currentLevel + 1 <= maxLevel) ? (currentLevel + 1) : maxLevel;

            selectedLevel = dimensionLevels[this.tableLevels[item.id]];
            // selectedLevel = dimensionLevels[this.tableLevels[item.id]];

            let newObj;

            if (selectedLevel != undefined) {
              if (currentLevel + 1 <= maxLevel) {
                newObj = { [item.id]: +(selectedLevel.level) };
              }
              filterObj.level = +(selectedLevel.level);
              this.filterandDrilldownObjArray.drilldown_table_obj.push(newObj);
            } else {
              newObj = { [item.id]: maxLevel };
              filterObj.level = maxLevel;

              this.filterandDrilldownObjArray.drilldown_table_obj.push(newObj);
            }
          }

          if (filterIndex !== -1) {
            this.filterandDrilldownObjArray.filter_obj[filterIndex].values = [cellValue1];
          } else {
            this.filterandDrilldownObjArray.filter_obj.push(filterObj);
          }

          // console.log('this.filterandDrilldownObjArray', this.filterandDrilldownObjArray)

          this.filterandDrilldownObjArray = {
            filter_obj: this.filterandDrilldownObjArray.filter_obj ? this.filterandDrilldownObjArray.filter_obj : [],
            drilldown_obj: this.filterandDrilldownObjArray.drilldown_obj ? this.filterandDrilldownObjArray.drilldown_obj : [],
            disabled_filterObj: this.filterandDrilldownObjArray.disabled_filterObj ? this.filterandDrilldownObjArray.disabled_filterObj : [],
            drilldown_table_obj: this.filterandDrilldownObjArray.drilldown_table_obj ? this.filterandDrilldownObjArray.drilldown_table_obj : [],
            // is_default_bookmark_filter : false
          };

          // console.log(' this.filterandDrilldownObjArray', this.filterandDrilldownObjArray)
          sessionStorage.setItem('storedDrilldownAndFilterArray', JSON.stringify(this.filterandDrilldownObjArray));
          //console.log('scrollPosition in table', scrollPosition)
          this.onFetchData(this.editDashboardId, this.filterandDrilldownObjArray, scrollPosition, matchedItemObj);

        }
      }



    }
  }


  // code for tooltip in table

  commentText: string = '';
  selectedCell: any = null;
  @ViewChild('commentDialog') commentDialog!: DialogComponent;
  // Store comments (you can later sync to backend or sessionStorage)
  cellComments: { [key: string]: string } = {};





  isEditing: boolean = false;
  existingComment: string | null = null;
  FieldNamesArray: any = []
  selectedUniqueColumn: string = '';
  onTableDropdown() {

  }

  openCommentDialog(rowData: any, field: string, event: MouseEvent, item: any, grid: GridComponent) {
    // event.stopPropagation();

    const rowIndex = rowData.index; // Ã¢Å“â€¦ 0-based, straight from Syncfusion
    const colIndex = grid.getColumnIndexByField(field); // Ã¢Å“â€¦ 0-based column index

    // console.log('Row Index:', rowIndex);
    // console.log('Column Index:', colIndex);
    // console.log('Cell Value:', field, rowData[field], rowData);
    // console.log('item', item)

    this.chartService.getColumnNameBYTableName(item.content.tableName, item.connection_id).subscribe((res: any) => {
      // console.log(res);
      let data = res['data']
      this.FieldNamesArray = Object.keys(data)

    })

    this.commentDialog.show();


    this.selectedCell = { row: rowData, field, rowIndex, colIndex, item, grid };
    const cellKey = this.getCellKey(rowData, field);

    let obj = item.content.comments_dataSource[0]

    // console.log(obj.
    //   unique_column_field, obj)
    // console.log('comment.field_name == field', obj.field_name, field);
    // console.log('comment.cell_value?.toString()', obj.cell_value?.toString(), rowData[field]?.toString());
    // console.log('obj.unique_column_id', obj.unique_column_field, rowData[obj.
    //   unique_column_field]);

    const matchedComment = item.content.comments_dataSource?.find((comment: any) =>
      comment.field_name == field &&
      comment.cell_value?.toString() == rowData[field]?.toString() && comment.unique_column_id == rowData[comment.
        unique_column_field]
    );

    // console.log('matchedComments', matchedComment)

    // If found, patch comment_Text, else empty
    this.commentText = matchedComment ? matchedComment.comment_Text : '';
    this.selectedUniqueColumn = matchedComment ? matchedComment.unique_column_field : ''
    this.isEditing = !!matchedComment;

    // this.commentText = this.cellComments[cellKey] || '';


  }


  getCellKey(rowData: any, field: string): string {
    // Use row unique ID + field name
    return `${rowData.index || rowData.id}_${field}`;
  }

  onCommentsDownload(eve: any) {
    // console.log('onCommentsDownload called', eve)
    let comments_dataSource = eve.content.comments_dataSource;

    let exportData = comments_dataSource.map((item: any) => ({
      'Dashboard Name': item.dashboard_name,
      'Comments': item.comment_Text,
      'Value': item.cell_value,
      'Created By': item.username,
      'Created At': item.created_at
    }));

    // console.log('exportData', exportData)
    this.excelService.exportAsExcelFile(exportData, eve.header);

  }


  saveComment() {
    // console.log('save comment called', this.selectedCell, this.selectedCell.row);
    if (this.selectedCell) {
      const cellKey = this.getCellKey(this.selectedCell.row, this.selectedCell.field);
      this.cellComments[cellKey] = this.commentText;
      this.commentDialog.hide();
      // console.log('Comment saved:', this.selectedUniqueColumn);

      const rowIndex = this.selectedCell.rowIndex;
      const colIndex = this.selectedCell.colIndex;
      // console.log('selectedCell', this.selectedCell)

      const rowElement = this.selectedCell.grid.getRowByIndex(rowIndex) as HTMLElement;
      const cellIndex = this.selectedCell.grid.getColumnIndexByField(this.selectedCell.field);
      const cell1 = rowElement.querySelectorAll('td')[cellIndex] as HTMLElement;

      // console.log('cell1','rowElement', rowElement,'cellIndex', cell1)


      let matchedFeildDetails = this.selectedCell.item.content.fieldDetails.find((ele: any) => ele.field == this.selectedCell.field)

      // console.log('matchedFeildDetails', matchedFeildDetails)

      // console.log('this.selectedCell.row', this.selectedCell.row[matchedFeildDetails.unique_column_field])

      // Ã¢Å“â€¦ Use Syncfusion API to get the exact cell element
      const cell = this.selectedCell.grid.getCellFromIndex(rowIndex, colIndex) as HTMLElement;

      // console.log('grid cells', this.selectedCell.grid)

      if (cell1) {
        // Destroy old tooltip if exists
        if ((cell as any).ej2_instances) {
          (cell as any).ej2_instances.forEach((inst: any) => inst.destroy && inst.destroy());
        }
        // Attach new tooltip
        // console.log('cell', cell)
        new Tooltip({ content: this.commentText }, cell);
      }

      const now = new Date().toISOString();

      let loginTimeData: any = sessionStorage.getItem('loginSession');

      if (loginTimeData) {
        loginTimeData = JSON.parse(loginTimeData);

        let obj = {
          dashboard_id: this.editDashboardId,
          panel_id: this.selectedCell.item.id,
          dashboard_name: this.dashboardName,
          comment_Text: this.commentText,
          row_index: +(rowIndex),
          col_index: colIndex,
          username: loginTimeData.username,
          user_id: loginTimeData.user_id,
          field_name: this.selectedCell.field,
          cell_value: this.selectedCell.row[this.selectedCell.field],
          "is_active": true,
          // unique_column_field : this.selectedUniqueColumn,
          // unique_column_id : this.selectedCell.row[this.selectedUniqueColumn],
          unique_column_field: matchedFeildDetails.unique_column_field,
          unique_column_id: this.selectedCell.row[matchedFeildDetails.unique_column_field],
          created_at: now,
          updated_at: now
        }

        // console.log('obj', obj);

        this.chartService.createComments(obj).subscribe((res: any) => {
          // console.log('res', res)

          // Ã¢Å“â€¦ Always read fresh from sessionStorage
          // let storedPanels = sessionStorage.getItem('panelSeriesArray');
          // let panelSeriesArray = storedPanels ? JSON.parse(storedPanels) : [];

          // // Update comments for the correct panel
          // const panelIndex = panelSeriesArray.findIndex((p: any) => p.id === this.selectedCell.item.id);
          // if (panelIndex !== -1) {
          //   if (!panelSeriesArray[panelIndex].content.comments_dataSource) {
          //     panelSeriesArray[panelIndex].content.comments_dataSource = [];
          //   }
          //   panelSeriesArray[panelIndex].content.comments_dataSource.push(obj);
          // }

          // // Store back in sessionStorage
          // sessionStorage.setItem('panelSeriesArray', JSON.stringify(panelSeriesArray));

          // // Update local copy too (optional, if you use it elsewhere in code)
          // this.panelSeriesArray = panelSeriesArray;

          this.changeDetectorRef.detectChanges();


        })
      }

      // console.log('Tooltip added at Row:', rowIndex, 'Col:', colIndex, 'Text:', this.commentText);
    }
  }

  closeDialog() {
    this.commentDialog.hide();
  }

  parseValue(value: string): string | number {
    if (!isNaN(Number(value)) && value.trim() !== '') {
      return Number(value); // Convert to number if it's valid
    }
    return value; // Return as string otherwise
  }


  onRecordsClick(eve: any) {
    // //console.log('eve in recordselected', eve)
  }




  toolbarClickedOld(args: any) {
    this.pivotview!.dataSourceSettings.expandAll = !this.pivotview!.dataSourceSettings.expandAll;
  }

  @ViewChildren('pivotview') pivotviews!: QueryList<PivotViewComponent>;
  toolbarClicked(pivotviewInstance: PivotViewComponent, item: any) {


    pivotviewInstance.dataSourceSettings.expandAll = !pivotviewInstance.dataSourceSettings.expandAll;
    // ((pivotviewInstance as PivotView).grid as Grid).excelQueryCellInfo = this.excelQueryCellInfo.bind(this);

    // ((pivotviewInstance as PivotView).grid as Grid).excelQueryCellInfo = this.excelQueryCellInfo.bind(this);

  }

  downloadPivotReports(item: any, pivotview: PivotViewComponent) {
    // //console.log('pivot view', pivotview)
    // pivotview.excelExport()
    // ((pivotview as PivotView).grid as Grid).excelQueryCellInfo = this.excelQueryCellInfo.bind(this);
    // ((pivotview as PivotView).grid as Grid).excelQueryCellInfo = this.excelQueryCellInfo.bind(this);


    const excelExportProperties: ExcelExportProperties = {
      theme: {
        header: { fontName: 'Segoe UI', fontColor: 'green' },
        record: { fontName: 'Segoe UI', fontColor: 'pink' }
      },
      fileName: 'PivotTableExport.xlsx'
    };
    // pivotview.excelExport(excelExportProperties);
  }


  beforeExport(args: BeforeExportEventArgs, item: any) {
    // //console.log('args in beforeexport', args)
    args.fileName = item.header; // Change filename dynamically

    // args.columns.forEach((column) => {
    //   column.cells.forEach((cell) => {
    //     if (cell.value === 0) { 
    //       cell.style = { border: '1px solid black' }; // Ensure border for 0 values
    //     }
    //   });
    // });


  }

  onDataBound(args: any): void {
    // Loop through all cells and apply consistent formatting
    const cells = this.pivotview.element.querySelectorAll('.e-cell');
    // //console.log('cells', cells)
    // //console.log('args', args)
    // cells.forEach((cell: HTMLElement) => {
    //   if (cell.innerText === '0') {
    //     cell.style.border = '1px solid black'; // Apply border to cells with value 0
    //   }
    // });
  }

  excelQueryCellInfo(args: any) {
    ((this.pivotview as PivotView).renderModule as any).columnCellBoundEvent(args);

    // //console.log('excel cell in excelQueryCellInfo', args)
    if (args.cell) {
      args.style = {
        border: { color: '#000000', lineStyle: 'Thin' } // Border for all data cells
      };
    }
  }

  excelHeaderQueryCellInfo(args: any) {
    // //console.log('excel cell in excelHeaderQueryCellInfo', args)

    if (args.cell) {
      args.style = {
        font: { bold: true }, // Make headers bold
        border: { color: '#000000', lineStyle: 'Thin' } // Border for header cells
      };
    }
  }


  onChartDownload(item: any) {

    let datasource = item.content.dataSource;

    this.excelService.exportAsExcelFile(datasource, item.header);


  }

  renameKeys(measure: any, data: any) {
    let transformedData: any = {};

    // Create a mapping of fieldName -> labelName
    let keyMapping: any = {};
    measure.forEach((item: { fieldName: string | number; labelName: string; }) => {
      keyMapping[item.fieldName] = item.labelName.trim(); // Trim to remove extra spaces
    });

    // Iterate over the second array keys and rename if they exist in keyMapping
    for (let key in data) {
      if (keyMapping[key]) {
        transformedData[keyMapping[key]] = data[key]; // Rename key
      } else {
        transformedData[key] = data[key]; // Keep key as is
      }
    }

    return transformedData;
  }


  onChartDropdwonSelect(eve: any, item: any) {
    const selectedValue = eve.item.properties.text;
    let datasource = item.content.dataSource;

    // Check if this is a Pie/Funnel/Pyramid chart and get datalabelFormat
    const isPieChart = item.content.series.some((s: any) =>
      s.type === 'Pie' || s.type === 'Funnel' || s.type === 'Pyramid'
    );

    const fieldToLabelMap = item.content.measure.reduce((acc: any, item: any) => {
      acc[item.fieldName] = item.labelName || item.fieldName;
      return acc;
    }, {});

    item.content.dimension.levels.forEach((level: any) => {
      fieldToLabelMap[level.fieldName] = level.labelName || level.fieldName;
    });

    const updatedSecondArray = datasource.map((obj: any) => {
      const newObj: any = {};
      for (const key in obj) {
        if (fieldToLabelMap.hasOwnProperty(key)) {
          newObj[fieldToLabelMap[key]] = obj[key];
        } else {
          newObj[key] = obj[key];
        }
      }
      return newObj;
    });

    // Get the chart instance to access the percentage values from Syncfusion
    let chartInstance: any = null;
    let percentageMap: { [key: string]: number } = {};

    if (isPieChart) {
      this.chartRefSData.forEach((chart: any) => {
        if (chart.element.id == item.id) {
          chartInstance = chart;
        }
      });

      // Build percentage map from chart's visible series points
      if (chartInstance && chartInstance.visibleSeries && chartInstance.visibleSeries.length > 0) {
        const series = chartInstance.visibleSeries[0];
        if (series.points && series.points.length > 0) {
          series.points.forEach((point: any) => {
            const xValue = point.x;
            const percentage = point.percentage; // Syncfusion's calculated percentage
            percentageMap[xValue] = percentage;
          });
        }
      }
    }

    // Calculate total sum for Pie charts (fallback if no chart instance)
    let totalSum = 0;
    let yNameField = '';
    let xNameField = '';
    if (isPieChart && item.content.series.length > 0) {
      yNameField = item.content.series[0].yName;
      xNameField = item.content.series[0].xName;
      totalSum = updatedSecondArray.reduce((sum: number, item: any) => {
        return sum + (Number(item[yNameField]) || 0);
      }, 0);
    }

    const updatedArray = updatedSecondArray.map((element: any) => {
      const newItem: any = {};
      const seriesMap = new Map<string, any>();

      item.content.series.forEach((seriesItem: any) => {
        if (seriesItem.type !== 'Pie' && seriesItem.type !== 'Funnel' && seriesItem.type !== 'Pyramid') {
          if (seriesItem.yName) seriesMap.set(seriesItem.yName, seriesItem);
          if (seriesItem.name) seriesMap.set(seriesItem.name, seriesItem);
        }
      });

      for (const key of Object.keys(element)) {
        const seriesItem = seriesMap.get(key);

        if (seriesItem) {
          const format = seriesItem?.marker?.dataLabel?.format || '';
          const match = format.match(/{value}(.)/);
          const symbol = match ? match[1] : '';

          // Check if it's a percentage format (p, p0, p1, p2, etc. or {value}%)
          const isPercentageFormat = /^p\d*$/i.test(format) || symbol === '%';

          console.log(`Normal chart - key: ${key}, value: ${element[key]}, format: ${format}, symbol: ${symbol}, isPercentage: ${isPercentageFormat}`);

          if (selectedValue === 'XLSX' && isPercentageFormat) {
            // Ã¢Å“â€¦ Excel export Ã¢â€ â€™ numeric percentage
            // If format is 'p' or 'p2', value is already in decimal (0.01854 = 1.854%)
            // If format is '{value}%', value needs to be divided by 100
            const excelValue = symbol === '%' ? element[key] / 100 : element[key];
            newItem[seriesItem.name] = excelValue;
            if (!newItem.__percentCols) newItem.__percentCols = [];
            newItem.__percentCols.push(seriesItem.name);
            console.log(`Exporting as percentage: ${newItem[seriesItem.name]}`);
          } else if (selectedValue === 'XLSX') {
            // Ã¢Å“â€¦ Excel export Ã¢â€ â€™ plain number
            newItem[seriesItem.name] = element[key];
            console.log(`Exporting as plain number: ${newItem[seriesItem.name]}`);
          } else {
            // Ã¢Å“â€¦ Chart/PDF/PNG Ã¢â€ â€™ string with symbol
            newItem[seriesItem.name] = `${element[key]}${symbol}`;
          }
        } else {
          // Handle Pie/Funnel/Pyramid charts - convert to percentage
          if (isPieChart && key === yNameField && totalSum > 0) {
            const xValue = element[xNameField]; // Get the x-axis value (e.g., "Valid_Cases")

            // Use Syncfusion's calculated percentage if available, otherwise calculate manually
            let percentageValue: number;
            if (percentageMap[xValue] !== undefined) {
              percentageValue = percentageMap[xValue];
            } else {
              const rawValue = Number(element[key]) || 0;
              percentageValue = (rawValue / totalSum) * 100;
            }

            if (selectedValue === 'XLSX') {
              // Excel export Ã¢â€ â€™ numeric percentage (0.0 to 1.0 format)
              newItem[key] = percentageValue / 100;
              if (!newItem.__percentCols) newItem.__percentCols = [];
              newItem.__percentCols.push(key);
            } else {
              // Other exports Ã¢â€ â€™ formatted percentage string
              newItem[key] = `${percentageValue}%`;
            }
          } else {
            newItem[key] = element[key];
          }
        }
      }

      return newItem;
    });


    console.log('updatedArray', updatedArray)

    this.chartRefSData.forEach((chartInstance, index) => {
      if (chartInstance.element.id == item.id) {
        if (selectedValue == 'XLSX') {
          this.excelService.exportAsExcelFileForChart(updatedArray, item.header);
        } else {
          chartInstance.exportModule.export(selectedValue, item.header);
        }
      }
    });
  }


  captureChartImage(chartInstance: any): Promise<string> {
    return new Promise((resolve) => {
      chartInstance.exportModule.getDataUrl('PNG').then((dataUrl: string) => {
        resolve(dataUrl);
      });
    });
  }

  tooltipRender(args: IAccTooltipRenderEventArgs | any, tooltipFormat: any, item: any): void {

    args.headerText = `${args.point.x}`;
    let value = args.point.y / args.series.sumOfPoints * 100;
    let textName = args.data.seriesName;

    if (tooltipFormat == 'Percentage') {


      args["text"] = textName + ' : ' + value + '' + '%';

    } else {

      const headerText = args.headerText;

      const yValue = args.point?.y;

      if (!item?.content?.measure || !item?.content?.dataSource?.length) return;

      const matchedMeasure = item.content.measure.find((measure: any) =>
        measure.labelName === headerText || measure.fieldName === headerText
      );
      if (!matchedMeasure) return;
      const dataSample = item.content.dataSource[0];

      // Determine which key exists in the dataSource: fieldName or labelName
      let keyToCheck: string | null = null;
      if (dataSample.hasOwnProperty(matchedMeasure.fieldName)) {
        keyToCheck = matchedMeasure.fieldName;
      } else if (dataSample.hasOwnProperty(matchedMeasure.labelName)) {
        keyToCheck = matchedMeasure.labelName;
      }

      if (!keyToCheck) return;

      const originalValue = dataSample[keyToCheck];
      // console.log('originalValue',originalValue)
      const isLikelyTimeFormat = typeof originalValue === 'string' && originalValue.includes(':');

      if (isLikelyTimeFormat && typeof yValue === 'number') {
        const formattedTime = this.formatSecondsToHHMMSS(yValue);
        // args.text = `${args.point.x} : ${formattedTime}`;
        args.text = `${textName} : ${formattedTime}`;

      } else {
        args.text = `${textName} : ${yValue}`;
        // args.text = `${args.point.x} : ${yValue}`;
      }

    }
  };

  onChartMouseMove(event: IMouseEventArgs, item: any) {
    // event.target, event.x, event.y can help
    // Custom logic to extract tooltip data from `item.content.series`
    // console.log('onChartMouseMove', event, item);
  }



  tooltipRenderColumnChart(args: ITooltipRenderEventArgs | any, item: any): void {
    const headerText = args.headerText;
    // console.log('args in tooltip', args)
    // console.log('args in tooltip', item)
    const yValue = args.point?.y;

    if (!item?.content?.measure || !item?.content?.dataSource?.length) return;

    const matchedMeasure = item.content.measure.find((measure: any) =>
      measure.labelName === headerText || measure.fieldName === headerText
    );

    if (!matchedMeasure) return;

    const dataSample = item.content.dataSource[0];

    // Determine which key exists in the dataSource: fieldName or labelName
    let keyToCheck = null;
    if (dataSample.hasOwnProperty(matchedMeasure.fieldName)) {
      keyToCheck = matchedMeasure.fieldName;
    } else if (dataSample.hasOwnProperty(matchedMeasure.labelName)) {
      keyToCheck = matchedMeasure.labelName;
    }

    if (!keyToCheck) return;

    const originalValue = dataSample[keyToCheck];
    const isLikelyTimeFormat = typeof originalValue === 'string' && originalValue.includes(':');
    let pointXtext = args.data.seriesName ? args.data.seriesName : args.point.x;

    if (isLikelyTimeFormat && typeof yValue === 'number') {
      const formattedTime = this.formatSecondsToHHMMSS(yValue);
      // args.text = `${args.point.x} : ${formattedTime}`;
      args.text = `${pointXtext} : ${formattedTime}`;

      // pointXtext
      //  args.text = `Score: ${formattedTime}<br>${args.point.x}`;
    } else {
      // args.text = `${args.point.x} : ${yValue}`;
      args.text = `${pointXtext} : ${yValue}`;

      //  args.text = ` ${yValue}<br>${args.point.x}`;
    }
    // console.log('args.text', args.data.seriesName)

    args.headerText = `${args.point.x}`;
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
  //             // console.log('pointValueafter ', pointValue, appliedColor)

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
  // new code 
  onPointRender(args: any, item: any): void {
    // Find the matching panel object for THIS chart only
    const matchedObj = this.panelSeriesArray.find(ele => ele.id === item.id);

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
          const cleaned = value.replace(/[%,\s$â‚¬Â£Â¥]/g, '').trim();
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



  getSortedData(source1: string[], source2: string[], ele: any): { item: string, isMatched: boolean }[] {

    // let storedFilterArray = sessionStorage.getItem('storedDrilldownAndFilterArray');

    // if (storedFilterArray) {
    //   storedFilterArray = JSON.parse(storedFilterArray) || [];
    //   this.filterandDrilldownObjArray = storedFilterArray;
    // }

    // let storedData: any = sessionStorage.getItem('dataSourceStorageObj');
    // if (storedData) {
    //   storedData = JSON.parse(storedData);

    // }

    const hasExplicitEmptySelection =
      !!this.explicitEmptySelectionMap[ele.id] ||
      (Array.isArray(this.selectedItemsMap[ele.id]) && this.selectedItemsMap[ele.id].includes(''));
    const cleanedSource2 = this.sanitizeSelectionValues(source2, hasExplicitEmptySelection);

    if (!cleanedSource2 || cleanedSource2.length === 0) {
      const allItems = source1
        .filter(item => item != null && item !== undefined)
        .map(item => ({
          item,
          isMatched: false
        }));

      // Put empty strings at the top
      const emptyItems = allItems.filter(i => i.item === '');
      const nonEmptyItems = allItems.filter(i => i.item !== '');
      return [...emptyItems, ...nonEmptyItems];
    }

    let filterObjMatch = this.filterandDrilldownObjArray.filter_obj.some((obj: any) => obj.id === ele.id);

    const matched = source1
      .filter(item => cleanedSource2.includes(item) && item != null && item !== undefined)
      .map(item => ({ item, isMatched: true }));
    const nonMatched = source1
      .filter(item => !cleanedSource2.includes(item) && item != null && item !== undefined)
      .map(item => ({ item, isMatched: false }));

    // Separate empty strings to put them at the top
    const emptyStrings = nonMatched.filter(item => item.item === '');
    const nonMatchedWithoutEmpty = nonMatched.filter(item => item.item !== '');

    const lastFilterObj = this.filterandDrilldownObjArray.filter_obj[this.filterandDrilldownObjArray.filter_obj.length - 1];
    const lastFilterObjMatch = lastFilterObj ? lastFilterObj.id === ele.id : false;

    if (!lastFilterObj || (lastFilterObjMatch && filterObjMatch)) {
      // No filters applied or current panel is the last filter - show all items with empty strings at top
      return [...emptyStrings, ...matched, ...nonMatchedWithoutEmpty];
    } else {
      // Other panel has filter - show only matched items, but ALWAYS include empty strings at top (visible but not selected)
      return [...emptyStrings, ...matched];
    }
  }




  showNote: boolean = false;

  onSwitchChange(value: boolean) {
    //// //console.log('value', value)
    this.userFlag = value;
    this.bookmark_flag = value;
    this.makeApiCall('true');

    // Trigger the sliding effect when the switch changes
    this.showNote = true;

    // Optionally, hide the note after some time (e.g., 3 seconds)
    setTimeout(() => {
      this.showNote = false;
    }, 3000);

  }

  makeApiCall(value: string) {
    let filterObjEle = {
      "filter_obj": [],
      "drilldown_obj": [],
      "disabled_filterObj": [],
      'drilldown_table_obj': []

    }
    this.chartService.getDashboardDataWithBookmarkFilterById(this.editDashboardId, filterObjEle, false, this.userFlag).subscribe((res: any) => {

      if (res) {
        console.log('res data in getDashboardDataWithBookmarkFilterById', res)
        this.loaderService.hide();

        let resObj = res['data'];

        let dateTimeValue = resObj.last_refreshed_time
        let formattedDate = this.datePipe.transform(dateTimeValue, 'yyyy-MM-dd HH:mm:ss');
        this.refreshCatcheTime = formattedDate

        const apiTitle = resObj.dashboard_name;
        this.dashboardName = apiTitle
        this.description = resObj.description;
        this.chartService.setTitle(apiTitle);

        let data = resObj.dashboard_setup.dashboardObj;
        //// //console.log('Dashboard View object', data);
        this.initialFilerObj = data.initialFilterObj;


        let storedFilterData: any = sessionStorage.getItem('storedDrilldownAndFilterArray');


        if (storedFilterData) {
          storedFilterData = JSON.parse(storedFilterData)
          // //console.log('storedFilterData', storedFilterData)

        }
        // //console.log('data.bookmark_filterObj', data.bookmark_filterObj);

        // let storedFilterData = sessionStorage.getItem(JSON.parse('storedDrilldownAndFilterArray'))

        // let bookmark_filterObjData = data.bookmark_filterObj ? data.bookmark_filterObj : [];
        // Determine the source of filter data
        let bookmark_filterObjData = data.bookmark_filterObj
          ? data.bookmark_filterObj
          : storedFilterData
            ? storedFilterData.filter_obj
            : [];

        // //console.log('bookmark_filterObjData', bookmark_filterObjData)
        // let bookmarkfilterflag = data.is_default_bookmark_filter ? data.is_default_bookmark_filter : true;
        // let bookmarkfilterflag = data.is_default_bookmark_filter !== undefined ? data.is_default_bookmark_filter : true;

        let bookmarkfilterflag =
          data.is_default_bookmark_filter !== undefined
            ? data.is_default_bookmark_filter
            : true;

        //// //console.log('bookmarkfilterflag', bookmarkfilterflag);

        let filterObjEle = {
          "filter_obj": bookmark_filterObjData,
          "drilldown_obj": [],
          "disabled_filterObj": [],
          'drilldown_table_obj': []
          // "bookmark_filterObj" :bookmark_filterObjData,
          // is_default_bookmark_filter : bookmarkfilterflag
        }
        this.filterandDrilldownObjArray = filterObjEle;
        //// //console.log(' this.filterandDrilldownObjArray ', this.filterandDrilldownObjArray)
        filterObjEle.filter_obj.forEach((ele: any) => {
          const sanitizedValues = this.sanitizeSelectionValues(
            ele.values,
            !!this.explicitEmptySelectionMap[ele.id]
          );
          ele.values = sanitizedValues;
          this.selectedItemsMap[ele.id] = sanitizedValues;

        })


        //  localStorage.setItem('storedDrilldownAndFilterArray', JSON.stringify(filterObjEle))
        sessionStorage.setItem('storedDrilldownAndFilterArray', JSON.stringify(filterObjEle))

      }
    })
  }

  getCssClass(data: any): string {
    return data.isMatched ? 'matched' : 'non-matched';
  }




  //////////// new code ////////////////

  onFetchData(dashboard_id: string, filterObj: any, scrollPosition: number, ele?: any) {
    // Show main loader first (same as page load behavior)
    this.loaderService.show();
    this.cdr.detectChanges();

    console.log('ele', ele)
    this.chartService.getDashboardDataWithFilterById(dashboard_id, filterObj).subscribe({
      next: (res: any) => {
        //console.log('res', res)
        if (res.success) {
          this.handleApiResponse(res['data'], scrollPosition, ele);
        } else {
          // this.showPopup(false, '35px', res.message);
          this.loaderService.hide();

          // âœ… FIX: Create new array with new panel objects for OnPush detection
          if (this.panelSeriesArray) {
            this.panelSeriesArray = this.panelSeriesArray.map((p: any) => ({
              ...p,
              isLoading: false
            }));
            this.cdr.detectChanges();
          }

          // Change detection handled automatically
          this.popupService.showPopup({
            message: res.message,
            statusCode: res.status_code,
            status: false
          });
        }
      },
      error: (err: any) => {
        this.loaderService.hide();

        // âœ… FIX: Create new array with new panel objects for OnPush detection
        if (this.panelSeriesArray) {
          this.panelSeriesArray = this.panelSeriesArray.map((p: any) => ({
            ...p,
            isLoading: false
          }));
          this.cdr.detectChanges();
        }

        // Change detection handled automatically
        const errorMessage = err.error && err.error.message ? err.error.message : err.message;
        this.popupService.showPopup({
          message: errorMessage,
          statusCode: err.status,
          status: false
        });

      }
    });
  }


  trackById(index: number, item: any): number | string {
    return item?.id ?? index;
  }


  handleApiResponse(data: any, scrollPosition: number, ele?: any) {
    const dashboardObj = data.dashboard_setup.dashboardObj;
    const panelsData = this.processPanels(dashboardObj.panels, ele);

    // âœ… FIX: Set loading state immutably - panelsData is already a new array from processPanels().map()
    // Each panel in panelsData is already a new object (from processXxxPanel methods)
    // Just update isLoading property immutably
    const updatedPanelsData = panelsData.map((p: any) => {
      if (p.panelType === 'Pivot') {
        // Check if pivot dataSource is empty - hide loader immediately if empty
        const hasData = p.content?.dataSourceSettings?.dataSource &&
          Array.isArray(p.content.dataSourceSettings.dataSource) &&
          p.content.dataSourceSettings.dataSource.length > 0;

        return { ...p, isLoading: hasData }; // true if has data, false if empty
      } else {
        // All other components hide loader immediately as data is ready
        return { ...p, isLoading: false };
      }
    });

    const chartPanelIds = panelsData
      .filter((p: any) => p.panelType === 'Chart')
      .map((p: any) => p.id);

    // Force remount for Syncfusion chart hosts so filtered series paint reliably.
    this.setChartMountState(chartPanelIds, false);
    this.cdr.detectChanges();

    // Direct assignment like in fetchBookmarkFilterData (old process)
    this.panelSeriesArray = updatedPanelsData;

    // Ã°Å¸"Â§ Force change detection and refresh grids for table drilldowns
    this.cdr.detectChanges();

    setTimeout(() => {
      this.grids?.forEach((gridInstance: GridComponent) => {
        try {
          // Find matching panel to check if it's a table with drilldown
          const panelId = gridInstance.element?.id?.replace('gridcomp', '');
          const matchingPanel = this.panelSeriesArray?.find((p: any) => p.id === panelId);

          if (matchingPanel && matchingPanel.panelType === 'Table') {
            console.log(`ðŸ”„ [Grid Refresh] Refreshing columns for grid: ${panelId}`);

            // âœ… Check if dataSource is empty
            const isEmpty = this.isGridDataSourceEmpty(matchingPanel.content.dataSource);

            if (isEmpty) {
              console.log(`âš ï¸ [Grid Refresh] Empty dataSource detected for grid: ${panelId}`);
              // Force clear and refresh for empty datasource
              if (typeof gridInstance.refresh === 'function') {
                gridInstance.dataSource = matchingPanel.content.dataSource;
                this.cdr.detectChanges(); // âœ… Trigger OnPush detection after dataSource assignment
                gridInstance.refresh();
              }
            }

            // Method 1: Refresh columns to rebind from fieldDetails
            if (typeof gridInstance.refreshColumns === 'function') {
              gridInstance.refreshColumns();
            }

            if (typeof gridInstance.refreshHeader === 'function') {
              gridInstance.refreshHeader();
            }

            // Method 2: Full grid refresh as fallback
            if (typeof gridInstance.refresh === 'function') {
              gridInstance.refresh();
            }

            // ðŸŽ¯ Hide the grid spinner/loader explicitly after refresh
            setTimeout(() => {
              if (typeof gridInstance.hideSpinner === 'function') {
                gridInstance.hideSpinner();
                console.log(`âœ… [Grid Refresh] Hidden spinner for grid: ${panelId}`);
              }
            }, 50);

            // ðŸ›¡ï¸ Safety: Hide spinner again after longer delay in case of slow operations
            setTimeout(() => {
              if (typeof gridInstance.hideSpinner === 'function') {
                gridInstance.hideSpinner();
              }
            }, 500);
          }
        } catch (error) {
          console.warn('Grid refresh error:', error);
        }
      });
    }, 100); // Small delay to ensure DOM is updated

    setTimeout(() => {
      this.setChartMountState(chartPanelIds, true);
      this.cdr.detectChanges();
      this.refreshRenderedCharts();
    }, 0);

    // Safety timeout: Force-hide pivot loaders if enginePopulated doesn't fire within 15 seconds
    setTimeout(() => {
      if (this.panelSeriesArray) {
        // âœ… FIX: Create new array with updated panels for OnPush detection
        const hasLoadingPivot = this.panelSeriesArray.some((p: any) => p.panelType === 'Pivot' && p.isLoading);
        if (hasLoadingPivot) {
          this.panelSeriesArray = this.panelSeriesArray.map((p: any) => {
            if (p.panelType === 'Pivot' && p.isLoading) {
              console.warn(`[Safety Timeout] Force-hiding loader for pivot panel: ${p.id}`);
              return { ...p, isLoading: false };
            }
            return p;
          });
          this.cdr.detectChanges();
        }
      }
    }, 15000); // 15 seconds safety timeout
    ///for Gauge
    setTimeout(() => {
      this.panelSeriesArray.forEach((panel: any) => {
        if (panel.panelType === 'Gauge') {
          this.initGaugeResizeObserver(panel.id);
        }
      });
    }, 600);
    ///for Gauge

    // Restore other state and side-effects from the original method
    this.refreshCatcheTime = this.formatDateTime(data.last_refreshed_time);
    this.dashboardName = data.dashboard_name;
    this.description = data.description;
    this.chartService.setTitle(this.dashboardName);
    this.initialFilerObj = dashboardObj.initialFilterObj;
    this.dashboardCreationObj.allowFloating = dashboardObj.allowFloating;

    let existingStorageObj = JSON.parse(sessionStorage.getItem('dataSourceStorageObj') || '{}');
    // âœ… FIX: Create new array with new panel objects for OnPush detection
    this.panelSeriesArray = this.panelSeriesArray.map((panel: any) => {
      if (existingStorageObj[panel.id]) {
        return {
          ...panel,
          content: {
            ...panel.content,
            dataSource: existingStorageObj[panel.id]
          }
        };
      }
      return panel;
    });

    // Store empty panels array in sessionStorage (same as fetchBookmarkFilterData)
    let emptyPanelsArray = this.panelSeriesArray.map((ele: any) => {
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
      } else if (ele.panelType == "Box" || ele.panelType == "Card" || ele.panelType == "DropdownList" || ele.panelType == "ListBox" || ele.panelType == "MultiSelectDropDown" || ele.panelType == 'InputBox') {
        return {
          ...ele,
          content: {
            ...ele.content,
            dataSource: [],
            selectedValues_dataSource: [],

          }
        }
      }
      else if (ele.panelType == 'Calender') {
        // Exclude large calendar data from sessionStorage to prevent quota issues
        return {
          ...ele,
          content: {
            ...ele.content,
            dataSource: [], // Clear calendar events
            eventSettings: {
              ...ele.content.eventSettings,
              dataSource: [] // Clear eventSettings dataSource
            },
            resources: {
              ...ele.content.resources,
              dataSource: [] // Clear resources dataSource
            }
          }
        }

      } else if (ele.panelType == "DatePicker" || ele.panelType == "DateRangePicker" || ele.panelType == "RawDataDump") {
        return {
          ...ele
        }
      }
    });

    const panelSeriesArrayString = JSON.stringify(emptyPanelsArray);
    sessionStorage.setItem('panelSeriesArray', panelSeriesArrayString);
    this.cdr.detectChanges();

    // Hide loader after rendering completes, then restore scroll position
    // Double requestAnimationFrame ensures components are rendered in both dev and prod builds
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.loaderService.hide();
        this.cdr.detectChanges();
        // Scroll after loader hides
        requestAnimationFrame(() => {
          window.scrollTo(0, scrollPosition);
        });
      });
    });
  }

  formatDateTime(dateTimeValue: string): string {
    return this.datePipe.transform(dateTimeValue, 'yyyy-MM-dd HH:mm:ss') || '';
  }

  // || ele.panelType == 'Calender'

  processPanels(panels: any[], ele: any): any {
    return panels.map((panel) => {
      switch (panel.panelType) {
        case 'Chart':
          return this.processChartPanel(panel);
        case 'ListBox':
          return this.processListBoxPanel(panel, ele);
        case 'DropdownList':
          return this.processDropdownPanel(panel, ele);
        case 'MultiSelectDropDown':
          return this.processMultiselectDropdownPanel(panel, ele)
        case 'InputBox':
          // InputBox doesn't need processing - return as is
          return panel;
        case 'Table':
          return this.processTablePanel(panel);
        case 'Box':
          return this.processBoxPanel(panel);
        case 'Pivot':
          return this.processPivotPanel(panel);
        case 'Calender':
          return this.processCalenderPanel(panel);
        case 'Kanban':
          return this.processKanbanPanel(panel);
        case 'Gauge':
          return this.processGaugePanel(panel);
        default:
          return panel;
      }
    });
  }
  processGaugePanel(panel: any) {
    if (!panel.content.dataSource || panel.content.dataSource.length === 0) {
      return panel;
    }

    const updatedDataSource = panel.content.dataSource.map((item: any, index: number) => ({
      ...item,
      Id: index + 1
    }));

    // Fix radius: Syncfusion requires string with '%' suffix
    const gauge = panel.content.gauge;
    let fixedGauge = gauge ? { ...gauge } : gauge;

    if (fixedGauge) {
      // Fix axis radius
      if (fixedGauge.radius !== undefined && fixedGauge.radius !== null) {
        fixedGauge.radius = typeof fixedGauge.radius === 'number'
          ? fixedGauge.radius + '%'
          : fixedGauge.radius;
      } else {
        fixedGauge.radius = '70%';
      }

      // Fix ranges radius
      if (fixedGauge.ranges && Array.isArray(fixedGauge.ranges)) {
        fixedGauge.ranges = fixedGauge.ranges.map((range: any) => ({
          ...range,
          startValue: range.startValue ?? 0,
          endValue: range.endValue ?? 0,
          width: range.width ?? 8,
          radius: range.radius
            ? (typeof range.radius === 'number' ? range.radius + '%' : range.radius)
            : '100%',
          roundedCornerRadius: range.roundedCornerRadius ?? 0
        }));
      }

      // Fix pointer cap radius (capRadius is a number, keep as is)
      if (fixedGauge.pointer) {
        fixedGauge.pointer = {
          ...fixedGauge.pointer,
          width: fixedGauge.pointer.width ?? 4,
          color: fixedGauge.pointer.color ?? '#000000'
        };
      }
    }

    return {
      ...panel,
      content: {
        ...panel.content,
        dataSource: updatedDataSource,
        gauge: fixedGauge
      }
    };
  }
  initGaugeResizeObserver(panelId: string): void {
    if (this.gaugeResizeObservers.has(panelId)) {
      this.gaugeResizeObservers.get(panelId)?.disconnect();
      this.gaugeResizeObservers.delete(panelId);
    }
    setTimeout(() => {
      const panelEl = document.querySelector(`#${panelId}`) as HTMLElement;
      if (!panelEl) return;
      const gaugeContainerEl = panelEl.querySelector(
        '.e-panel-container .e-panel-content ejs-circulargauge'
      ) as HTMLElement;
      if (!gaugeContainerEl) return;
      const observer = new ResizeObserver(() => {
        const gaugeObj = (gaugeContainerEl as any).ej2_instances?.[0];
        if (gaugeObj) {
          gaugeObj.width = '100%';
          gaugeObj.height = '100%';
          setTimeout(() => {
            gaugeObj.refresh();
          });
        }
      });
      observer.observe(gaugeContainerEl);
      this.gaugeResizeObservers.set(panelId, observer);
    }, 500);
  }
  processKanbanPanel(panel: any) {
    if (!panel.content.dataSource || panel.content.dataSource.length === 0) {
      return panel;
    }

    const updatedDataSource = panel.content.dataSource.map((card: any, index: number) => ({
      ...card,
      Id: card.Id || index + 1,
      [panel.content.keyField]: card[panel.content.keyField] || 'To Do'
    }));

    return {
      ...panel,
      content: {
        ...panel.content,
        dataSource: updatedDataSource
      }
    };
  }
  processCalenderPanel(panel: any) {

    let ScedularData = panel;
    // console.log('scheduler', ScedularData);
    let updatedDataSource = ScedularData.content.dataSource.map((item: any, index: number) => ({
      ...item,
      Id: index + 1
    }));

    let updatedzresouceDataSource = ScedularData.content.resources.dataSource.map((item: any, index: number) => ({
      ...item,
      Id: index + 1
    }));

    console.log('updatedDataSource', updatedDataSource);

    ScedularData.content.dataSource = updatedDataSource;


    // panel.content.resources.dataSource = this.getResourceData(panel.content.resources, updatedDataSource, panel.content.fieldDetails);    

    // Ã¢Å“â€¦ Only update resources if dataSource has events
    // if (updatedDataSource.length > 0) {
    //   panel.content.resources.dataSource = this.getResourceData(
    //     panel.content.resources,
    //     updatedzresouceDataSource,
    //     panel.content.fieldDetails
    //   );
    // } 


    panel.content.resources.dataSource = this.getResourceData(
      panel.content.resources,
      updatedzresouceDataSource,
      panel.content.fieldDetails
    );

    panel.content.eventSettings.dataSource = updatedDataSource;


    console.log('resources', panel.content);


    console.log('eventSettings', panel.content);
    return panel;

  }

  processPivotPanel(panel: any) {
    const fieldDetails = panel.content.fieldDetails;
    const panelId = panel.id;

    // Extract time fields from fieldDetails
    const timeFields = fieldDetails
      .filter((field: any) => field.formatType === 'string' && field.name)
      .map((field: any) => field.name);

    // Only process if there are time fields to convert
    if (timeFields.length > 0) {
      const dataSource = panel.content.dataSourceSettings.dataSource;

      // Convert time strings (HH:mm:ss) to seconds in place
      dataSource.forEach((row: any) => {
        timeFields.forEach((field: string | number) => {
          const timeStr = row[field];

          if (typeof timeStr === 'string' && timeStr.includes(':')) {
            const [h, m, s] = timeStr.split(':').map(Number);

            if (!isNaN(h) && !isNaN(m) && !isNaN(s)) {
              row[field] = h * 3600 + m * 60 + s;
            } else {
              row[field] = 0;
            }
          }
        });
      });
    }

    this.pivotTimeFieldsCache[panelId] = new Set<string>(timeFields);
    const valueFormatFieldNames = new Set<string>();
    (fieldDetails || []).forEach((ele: any) => {
      if (!ele?.valueFormat) return;
      if (panel?.content?.rawQuery && ele?.caption) {
        valueFormatFieldNames.add(String(ele.caption).trim());
      }
      if (ele?.name) {
        valueFormatFieldNames.add(String(ele.name).trim());
      }
    });
    this.pivotValueFormatFieldsCache[panelId] = valueFormatFieldNames;

    if (!this.pivotDisplayOptions[panel.id] && panel.content?.defaultView) {
      this.pivotDisplayOptions[panel.id] = panel.content.defaultView === 'chart' ? 'Chart' : 'Table';
    }
    const stablePivotGridSettings = {
      layout: panel?.content?.enableClassicLayout ? 'Tabular' : 'Compact',
      columnWidth: 140,
      excelQueryCellInfo: this.gridSettings?.excelQueryCellInfo,
      columnRender: this.gridSettings?.columnRender
    };
    // Return updated panel
    return {
      ...panel,
      content: {
        ...panel.content,
        height: '100%',
        pivotLightMode: this.isPivotLightMode(panel),
        enableVirtualization: panel?.content?.enableVirtualization !== false,
        gridSettings: stablePivotGridSettings
      }
    };
  }



  processBoxPanel(panel: any) {


    let resData = panel.content;

    //// //console.log('resData', resData)


    const processDataSource = (dataSource: any[], rawQuery: string, fieldDetails: any[]): any[] => {
      // if (rawQuery && rawQuery.trim() !== "") {

      //   let modifiedData = dataSource.map((ele: any) => {
      //     const key = Object.keys(ele)[0];
      //     let value = ele[key];

      //     fieldDetails.forEach((obj: any) => {
      //       if (obj.fieldName == ele.index) {
      //         value = this.applyFormat(value, obj.valueFormat);
      //       }
      //     });

      //     const processedItem: any = {
      //       "0": value,  // Apply formatted value here
      //       "index": ele.index,
      //     };

      //     return processedItem;
      //   });


      //   dataSource = modifiedData;

      //  // //console.log('if data', modifiedData)


      //   return dataSource;


      // } else {

      //   let modifiedData = dataSource.map((ele: any) => {
      //     const key = Object.keys(ele)[0];
      //     let value = ele[key];

      //     fieldDetails.forEach((obj: any) => {
      //       if (obj.fieldName == ele.index) {
      //         value = this.applyFormat(value, obj.valueFormat);
      //       }
      //     });

      //     const processedItem: any = {
      //       "0": value,  // Apply formatted value here
      //       "index": ele.index,
      //     };

      //     return processedItem;
      //   });

      //  // //console.log('else data', modifiedData)
      //   dataSource = modifiedData;

      //   return dataSource;
      // }

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


      // dataSource = modifiedData;
      dataSource;

      //// //console.log('if data', modifiedData)


      return dataSource;

    }



    let obj = {
      ...panel,
      content: {
        ...panel.content,
        dataSource: processDataSource(resData.dataSource, resData.rawQuery, resData.fieldDetails)
      }
    }

    obj.content.dataSource = obj.content.dataSource.map((item: any) => {
      let updatedItem = { ...item }; // Clone the object to prevent mutation

      // Iterate through fieldDetails and match fieldName with keys in dataSource object
      obj.content.fieldDetails.forEach((field: any) => {
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



    return obj

  }

  processChartPanel(panel: any) {
    // console.log('panel', panel)
    const dimensionLevelsArr = panel.content.dimension.levels;
    const fieldNames = dimensionLevelsArr.map((ele: any) => ele.fieldName);
    const dataSourceArr = panel.content.dataSource;
    const keys = dataSourceArr.flatMap((ele: any) => Object.keys(ele));
    const matchingValue = fieldNames.find((value: any) => keys.includes(value));
    let storedDrilldownAndFilterstr = JSON.parse(sessionStorage.getItem('storedDrilldownAndFilterArray') || '{}');

    // console.log('storedDrilldownAndFilterstr', storedDrilldownAndFilterstr)

    // Extract drilldown levels for the current panel
    const drilldownEntries = storedDrilldownAndFilterstr.drilldown_obj?.filter((obj: any) => obj[panel.id]);

    // console.log('drilldownEntries', drilldownEntries);

    // Get the max level from the matching drilldown entries
    const maxDrilldownLevel = drilldownEntries?.reduce((maxLevel: number, entry: any) => {
      return Math.max(maxLevel, entry[panel.id]);
    }, -1); // Initialize with -1 to ensure a valid max comparison

    // console.log('maxDrilldownLevel', maxDrilldownLevel);

    if (maxDrilldownLevel >= 0) {
      // Step 3: Find the maximum level in dimension.levels that is <= the maxDrilldownLevel
      const matchingLevel = dimensionLevelsArr
        .filter((level: any) => level.level <= maxDrilldownLevel) // Filter levels within range
        .reduce((maxLevel: any, currentLevel: any) =>
          currentLevel.level > (maxLevel?.level || -1) ? currentLevel : maxLevel, null); // Find max level

      // console.log('matchingLevel', matchingLevel);

      // Step 4: Update the header **only if levelTitle exists and is not empty**
      if (matchingLevel && matchingLevel.levelTitle) {
        panel.header = matchingLevel.levelTitle;
      } else {
        // //console.log("levelTitle is missing or empty, keeping header as is.");
      }
    }

    let measureArr = panel.content.measure;
    let MeasurefieldNames = measureArr.map((ele: any) => ele.fieldName);

    const updatedDataSource = dataSourceArr.map((entry: any) => {
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


    const barLikeTypes = new Set([
      'column',
      'bar',
      'stackingcolumn',
      'stackingbar',
      'stackingbar100',
      'stackingcolumn100'
    ]);

    const seriesArr = panel.content.series.map((seriesEle: any) => {
      const seriesType = String(seriesEle?.type || '').trim().toLowerCase();
      const isBarLike = barLikeTypes.has(seriesType);
      const isOpposed = this.toBoolean(seriesEle?.opposedPosition);
      const useSecondaryAxis = !isBarLike && isOpposed && !!seriesEle?.yAxisName;

      return {
        ...seriesEle,
        dataSource: updatedDataSource,
        xName: matchingValue,
        // Keep bars/columns on primary axis after filter refresh to avoid invisible bars.
        opposedPosition: useSecondaryAxis,
        yAxisName: useSecondaryAxis ? seriesEle.yAxisName : null,
      };
    });

    const hasBarSeries = seriesArr.some(
      (s: any) =>
        ['column', 'bar', 'stackingcolumn', 'stackingcolumn100', 'stackingbar', 'stackingbar100']
          .includes(String(s.type || '').trim().toLowerCase())
    );

    // Ã°Å¸â€Â¹ Only update the mode, keep other settings as they are
    // const zoomSettings = {
    //   ...panel.content.zoomSettings,
    //   mode: hasBarSeries ? 'Y' : 'X'
    // };


    const isMobile = this.isMobileScreen();
    const zoomSettings = {
      ...panel.content.zoomSettings,
      mode: hasBarSeries ? 'Y' : 'X',
      // enableMouseWheelZooming: !isMobile,
      // enablePinchZooming: isMobile,
      // enableSelectionZooming: !isMobile,
      // choose sensible zoomFactor for mobile if you want a different default
      zoomFactor: isMobile ? (panel.content.zoomSettings?.zoomFactorMobile ?? 0.6) : (panel.content.zoomSettings?.zoomFactor ?? 1),
    };


    // Ã°Å¸â€Â¹ Reusable font styles
    const labelStyle = {
      fontFamily: 'Roboto, Segoe UI, GeezaPro, DejaVu Serif, "Times New Roman", sans-serif',
      // fontWeight: 'bold',
      // size: '12px',
      color: 'black',
    };

    const textStyle = {
      fontFamily: 'Roboto, Segoe UI, GeezaPro, DejaVu Serif, "Times New Roman", sans-serif',
      fontWeight: 'bold',
      size: '13px',
      color: 'black',
    };



    let primaryYAxis = this.calculatePrimaryYAxis(seriesArr, panel.content.primaryYAxis);

    return {
      ...panel,
      content: {
        ...panel.content,
        series: seriesArr,
        zoomSettings: zoomSettings,
        primaryXAxis: {
          ...panel.content.primaryXAxis,
          labelStyle: labelStyle,

        },
        primaryYAxis: {
          ...primaryYAxis,
          labelStyle: labelStyle,
        },

        legends: {
          ...panel.content.legends,
          textStyle: {
            ...panel.content.legends.textStyle,
            fontFamily: 'Roboto, Segoe UI, GeezaPro, DejaVu Serif, "Times New Roman", sans-serif',
            // fontWeight: 'bold',
            // size: '12px',
            // color: 'black'
          }
        },



        // primaryYAxis,
        axis: this.calculateAxis(seriesArr, panel.content.axis, labelStyle),

      }
    };
  }

  calculatePrimaryYAxis(seriesArr: any[], primaryYAxis: any): any {
    if (seriesArr.length <= 2) {
      const maxDataValue = Math.max(...seriesArr.flatMap((series) =>
        series.dataSource.map((entry: any) => entry[series.yName])
      ));
      return {
        ...primaryYAxis,
        interval: primaryYAxis.interval !== undefined && primaryYAxis.interval !== null ? primaryYAxis.interval : undefined,
        minimum: primaryYAxis.minimum !== undefined && primaryYAxis.minimum !== null ? primaryYAxis.minimum : 0,
        maximum: primaryYAxis.maximum !== undefined && primaryYAxis.maximum !== null ? primaryYAxis.maximum : undefined,
      };
    }
    return primaryYAxis;
  }

  // calculateAxis(seriesArr: any[], axis: any[]) {
  //   return axis.map((ele) => {
  //     const dataSourceEntry = seriesArr.find((series) => series.opposedPosition === true);
  //     if (dataSourceEntry && dataSourceEntry.dataSource.length <= 2) {
  //       const maxDataValue = Math.max(...seriesArr.flatMap((series) =>
  //         series.dataSource.map((entry: any) => entry[series.yName])
  //       ));
  //       return { ...ele, minimum: 0, maximum: maxDataValue * 1.3 };
  //     }
  //     return ele;
  //   });
  // }

  calculateAxis(seriesArr: any[], axis: any[], labelStyle: any) {
    return axis.map((ele) => {
      const dataSourceEntry = seriesArr.find((series) => series.opposedPosition === true);
      if (dataSourceEntry && dataSourceEntry.dataSource.length <= 2) {
        const maxDataValue = Math.max(...seriesArr.flatMap((series) =>
          series.dataSource.map((entry: any) => entry[series.yName])
        ));
        return {
          ...ele,
          interval: ele.interval !== undefined && ele.interval !== null ? ele.interval : undefined,
          minimum: ele.minimum !== undefined && ele.minimum !== null ? ele.minimum : 0,
          maximum: ele.maximum !== undefined && ele.maximum !== null ? ele.maximum : undefined,
          labelStyle: labelStyle
        };
      }
      return ele;
    });
  }



  processListBoxPanel(panel: any, ele: any) {
    const data = [...panel.content.dataSource];
    this.listboxFilterItemData = data;

    // Process first 1000 records immediately for fast UI binding
    const first1000 = data.slice(0, 1000);
    const processedFirst1000 = this.getSortedData(first1000, panel.content.selectedValues_dataSource, panel);
    processedFirst1000.forEach(filter => this.listBoxBgColor = filter.isMatched ? 'matched' : 'non-matched');

    // Bind first 1000 to UI immediately
    this.filteredData[panel.id] = processedFirst1000;
    this.originalData[panel.id] = processedFirst1000; // Temporary

    // Store first 1000 in session immediately
    this.handleStorage(panel.id, processedFirst1000);

    // Process remaining records in background if data > 1000
    if (data.length > 1000) {
      setTimeout(() => {
        const remaining = data.slice(1000);
        const processedRemaining = this.getSortedData(remaining, panel.content.selectedValues_dataSource, panel);
        const fullProcessed = [...processedFirst1000, ...processedRemaining];

        // Update with full processed data for filtering
        this.originalData[panel.id] = fullProcessed;

        // Update session storage with full data
        this.handleStorage(panel.id, fullProcessed);
      }, 0);
    }

    return panel;
  }
  processDropdownPanel(panel: any, ele: any) {
    const data = [...panel.content.dataSource];

    // Process first 1000 records immediately for fast UI binding
    const first1000 = data.slice(0, 1000);
    const processedFirst1000 = this.getSortedData(first1000, panel.content.selectedValues_dataSource, panel);

    console.log('selectedValues_dataSource in dropdown', panel.content.selectedValues_dataSource)
    console.log('data in dropdown', data)
    console.log('selectedFilters in listbox', processedFirst1000)

    processedFirst1000.forEach(filter => this.listBoxBgColor = filter.isMatched ? 'matched' : 'non-matched');

    // Bind first 1000 to UI immediately
    this.totalDataSource[panel.id] = processedFirst1000;
    this.originalData[panel.id] = processedFirst1000; // Temporary

    // Initialize page index for scroll loading
    this.pageIndex[panel.id] = 0;

    console.log('processDropdownPanel', processedFirst1000)

    // Store first 1000 in session immediately
    this.handleStorage(panel.id, processedFirst1000);

    // Process remaining records in background if data > 1000
    if (data.length > 1000) {
      setTimeout(() => {
        const remaining = data.slice(1000);
        const processedRemaining = this.getSortedData(remaining, panel.content.selectedValues_dataSource, panel);
        const fullProcessed = [...processedFirst1000, ...processedRemaining];

        // Update with full processed data for filtering
        this.originalData[panel.id] = fullProcessed;

        // Update session storage with full data
        this.handleStorage(panel.id, fullProcessed);
      }, 0);
    }

    return panel;
  }

  processMultiselectDropdownPanel(panel: any, ele: any) {
    this.syncPanelSelectionState(panel);
    const data = [...panel.content.dataSource];

    // Process first 1000 records immediately for fast UI binding
    const first1000 = data.slice(0, 1000);
    const processedFirst1000 = this.decorateMultiselectData(
      this.getSortedData(first1000, panel.content.selectedValues_dataSource, panel),
      panel.id
    );

    processedFirst1000.forEach(filter => this.listBoxBgColor = filter.isMatched ? 'matched' : 'non-matched');

    // Bind first 1000 to UI immediately
    this.totalDataSource[panel.id] = processedFirst1000;
    this.originalData[panel.id] = processedFirst1000; // Temporary

    // Initialize page index for scroll loading
    this.pageIndex[panel.id] = 0;

    console.log('processMultiselectDropdownPanel', processedFirst1000)

    // Only store data for MultiSelectDropDown, not for InputBox
    if (panel.panelType === 'MultiSelectDropDown') {
      // Store first 1000 in session immediately
      this.handleStorage(panel.id, processedFirst1000);

      // Process remaining records in background if data > 1000
      if (data.length > 1000) {
        setTimeout(() => {
          const remaining = data.slice(1000);
          const processedRemaining = this.decorateMultiselectData(
            this.getSortedData(remaining, panel.content.selectedValues_dataSource, panel),
            panel.id
          );
          const fullProcessed = [...processedFirst1000, ...processedRemaining];

          // Update with full processed data for filtering
          this.originalData[panel.id] = fullProcessed;

          // Update session storage with full data
          this.handleStorage(panel.id, fullProcessed);
        }, 0);
      }
    }

    return panel;
  }

  processTablePanel(panel: any) {
    const isPaginationEnabled = panel?.content?.is_pagination_enabled === true;
    const tableRows = this.extractTableRows(panel?.content?.dataSource);
    const sampleKeys = this.getTableSampleKeys(tableRows);


    let updatedDataSource = panel?.content?.dataSource;
    if (isPaginationEnabled) {
      const paginationTable = panel.content.table_pagination;
      this.initialPage = {
        currentPage: paginationTable.current_page,
        pageSizes: ['20', '50', '100', '200', '500', '1000'],
        pageSize: paginationTable.items_per_page,
        totalPage: paginationTable.total_pages,
        totalRecordCount: paginationTable.total_records,
      };

      const currentResult: any = new DataManager(panel.content.dataSource).executeLocal(new Query());
      // âœ… FIX: Always create proper pagination object structure, even for empty data
      updatedDataSource = {
        result: currentResult.length ? currentResult : [],
        count: this.initialPage.totalRecordCount
      };
    } else {
      // âœ… FIX: Ensure non-paginated dataSource is cleared if empty
      updatedDataSource = tableRows.length ? tableRows : [];
    }

    const activeDrillLevel = this.getActiveTableDrillLevel(panel);
    const activeLevel = activeDrillLevel || this.getBaseTableLevel(panel);
    const preferredField = activeLevel?.fieldName || '';

    const fieldDetailsContent = panel.content.matchedFieldDetails?.length
      ? panel.content.matchedFieldDetails
      : panel.content.fieldDetails;

    let matchedFields: any[] = [];
    let hideHeaders = false;


    if (!tableRows.length) {
      // Priority 1: Use original fieldDetails if available
      if (fieldDetailsContent && fieldDetailsContent.length > 0) {
        matchedFields = fieldDetailsContent.map((field: any) => {
          const fieldKey = field?.field || field?.fieldName || field?.name;
          return {
            ...field,
            field: fieldKey,
            headerText: field.headerText || field.labelName || fieldKey,
            textAlign: field.textAlign || 'Left',
            type: field.type || 'string',
            visible: field.visible !== false
          };
        });
      }

      // Final check: if fieldDetails is empty, add a dummy column but hide the header row
      if (!matchedFields.length) {
        matchedFields = [{
          field: 'no_data_dummy',
          headerText: '',
          visible: true,
          width: 0
        }];
        hideHeaders = true;
      }
    }

    else if (fieldDetailsContent?.length && sampleKeys.length) {
      // Normal case: data exists, match fields
      const keySet = new Set(sampleKeys);
      matchedFields = fieldDetailsContent.filter((field: any) => {
        const fieldKey = field?.field || field?.fieldName || field?.name;
        return !!fieldKey && keySet.has(fieldKey);
      });
    }

    if (!matchedFields.length && tableRows.length) {
      // Fallback: build from actual data rows
      matchedFields = this.buildTableFieldDetailsFromRows(tableRows);
    }

    const firstRow = tableRows[0] || {};
    const measureArr = panel?.content?.measure || [];

    const preferredHeader = activeDrillLevel
      ? this.getGroupingLevelHeader(activeDrillLevel)
      : '';

    matchedFields = matchedFields.map((field: any) => {
      const fieldKey = field?.field || field?.fieldName || field?.name;
      return {
        ...field,
        field: fieldKey,
        headerText: this.resolveTableHeaderText(panel, field, measureArr, fieldKey, activeLevel),
        textAlign: field?.textAlign || 'Left',
        type: field?.type || (typeof firstRow[fieldKey] === 'number' ? 'number' : 'string'),
        visible: field?.visible !== false
      };
    }).filter((field: any) => !!field.field);

    if (preferredField) {
      const currentIndex = matchedFields.findIndex((field: any) => field.field === preferredField);
      if (currentIndex > 0) {
        const [preferred] = matchedFields.splice(currentIndex, 1);
        matchedFields.unshift(preferred);
      } else if (currentIndex === -1 && sampleKeys.includes(preferredField)) {
        matchedFields.unshift({
          field: preferredField,
          headerText: preferredHeader || this.getGroupingLevelHeader(activeLevel) || preferredField,
          textAlign: 'Left',
          type: typeof firstRow[preferredField] === 'number' ? 'number' : 'string',
          visible: true
        });
      }
    }

    const baseHeader = String(panel.header || '').trim();
    const nextHeader = activeDrillLevel
      ? (preferredHeader || this.getGroupingLevelHeader(activeLevel) || baseHeader)
      : (baseHeader || this.getGroupingLevelHeader(activeLevel));

    return {
      ...panel,
      header: nextHeader,
      content: {
        ...panel.content,
        fieldDetails: matchedFields,
        // âœ… Always preserve matchedFieldDetails for future empty data scenarios
        matchedFieldDetails: matchedFields,
        dataSource: updatedDataSource,
        hideHeaders: hideHeaders
      }
    };
  }

  private extractTableRows(dataSource: any): any[] {
    if (Array.isArray(dataSource)) {
      return dataSource;
    }
    if (Array.isArray(dataSource?.result)) {
      return dataSource.result;
    }
    return [];
  }

  // âœ… Helper to check if grid dataSource is empty
  private isGridDataSourceEmpty(dataSource: any): boolean {
    if (!dataSource) return true;
    if (Array.isArray(dataSource)) {
      return dataSource.length === 0;
    }
    if (dataSource.result !== undefined) {
      return !Array.isArray(dataSource.result) || dataSource.result.length === 0;
    }
    return false;
  }

  private buildTableFieldDetailsFromRows(rows: any[]): any[] {
    const keys = this.getTableSampleKeys(rows);
    const sampleRow = rows?.[0] || {};
    return keys.map((key: string) => ({
      field: key,
      headerText: key,
      textAlign: 'Left',
      format: '',
      type: typeof sampleRow[key] === 'number' ? 'number' : 'string',
      visible: true,
      isFrozen: false
    }));
  }

  private hasTableMeasures(panel: any): boolean {
    return Array.isArray(panel?.content?.measure) && panel.content.measure.length > 0;
  }

  private hasTableGrouping(panel: any): boolean {
    return Array.isArray(panel?.content?.dimension?.levels) && panel.content.dimension.levels.length > 0;
  }

  private hasTableRawQuery(panel: any): boolean {
    return !!String(panel?.content?.rawQuery || '').trim();
  }

  private getGroupingLevelHeader(level: any): string {
    return String(level?.levelTitle || level?.labelName || level?.fieldName || '').trim();
  }

  private getMeasureHeaderText(measureArr: any[], fieldKey: string): string {
    const normalizedFieldKey = String(fieldKey || '').trim().toLowerCase();
    const matchingMeasure = (measureArr || []).find((measure: any) => {
      const measureFieldKey = String(
        measure?.fieldName || measure?.field || measure?.name || ''
      ).trim().toLowerCase();
      return !!measureFieldKey && measureFieldKey === normalizedFieldKey;
    });

    if (!matchingMeasure) {
      return '';
    }

    return String(
      matchingMeasure.label ||
      matchingMeasure.labelName ||
      matchingMeasure.headerText ||
      ''
    ).trim();
  }

  private resolveTableHeaderText(panel: any, field: any, measureArr: any[], fieldKey: string, activeLevel?: any): string {
    const configuredHeader = String(field?.headerText || field?.labelName || '').trim();

    const measureHeader = this.getMeasureHeaderText(measureArr, fieldKey);
    if (measureHeader) {
      return measureHeader;
    }

    if (configuredHeader) {
      return configuredHeader;
    }

    if (!this.hasTableMeasures(panel) && this.hasTableRawQuery(panel)) {
      return fieldKey;
    }

    return fieldKey;
  }

  // here for trend summary, first column header should be 'MONTH' but in ui it is giving 'bill_month'.... in edit page it is showing correctly
  private getTableSampleKeys(rows: any[], sampleSize: number = 10): string[] {
    const keys = new Set<string>();
    const safeRows = Array.isArray(rows) ? rows : [];
    const limit = Math.min(sampleSize, safeRows.length);

    for (let i = 0; i < limit; i++) {
      const row = safeRows[i];
      if (row && typeof row === 'object') {
        Object.keys(row).forEach((key) => keys.add(key));
      }
    }

    return Array.from(keys);
  }

  private getActiveTableDrillLevel(panel: any): any {
    const dimensionLevelsArr = panel?.content?.dimension?.levels || [];
    if (!dimensionLevelsArr.length) {
      return null;
    }

    const stored = JSON.parse(sessionStorage.getItem('storedDrilldownAndFilterArray') || '{}');
    const drilldownEntries = stored?.drilldown_table_obj?.filter((obj: any) => obj[panel.id]) || [];
    const maxDrilldownLevel = drilldownEntries.reduce((maxLevel: number, entry: any) => {
      return Math.max(maxLevel, entry[panel.id]);
    }, -1);

    if (maxDrilldownLevel < 0) {
      return null;
    }

    return dimensionLevelsArr
      .filter((level: any) => level.level <= maxDrilldownLevel)
      .reduce((maxLevel: any, currentLevel: any) =>
        currentLevel.level > (maxLevel?.level || -1) ? currentLevel : maxLevel, null);
  }

  private getBaseTableLevel(panel: any): any {
    const dimensionLevelsArr = panel?.content?.dimension?.levels || [];
    if (!dimensionLevelsArr.length) {
      return null;
    }
    return dimensionLevelsArr.reduce((minLevel: any, currentLevel: any) =>
      currentLevel.level < (minLevel?.level ?? Number.MAX_SAFE_INTEGER) ? currentLevel : minLevel, null);
  }

  private applyDrillHeaderToTableFields(panel: any, fields: any[]): any[] {
    const activeLevel = this.getActiveTableDrillLevel(panel) || this.getBaseTableLevel(panel);
    if (!activeLevel || !fields?.length) {
      return fields;
    }

    const rawDesiredHeader = activeLevel.levelTitle || activeLevel.labelName || activeLevel.fieldName;
    if (!rawDesiredHeader) {
      return fields;
    }

    let targetColumn = fields.find((f: any) => f.field === activeLevel.fieldName);
    if (!targetColumn) {
      targetColumn = fields[0];
    }

    if (targetColumn) {
      const currentHeader = String(targetColumn.headerText || '').trim();
      const desiredHeader = String(rawDesiredHeader).trim();

      if (!currentHeader) {
        targetColumn.headerText = desiredHeader;
      }
    }

    return fields;
  }

  handleStorage(panelId: string, selectedFilters: any[]) {
    let existingStorageObj = JSON.parse(sessionStorage.getItem('dataSourceStorageObj') || '{}');
    console.log('selectedFilters', selectedFilters)

    // //console.log('existingStorageObj', existingStorageObj)
    let storedDrilldownAndFilterstr = JSON.parse(sessionStorage.getItem('storedDrilldownAndFilterArray') || '{}');

    this.filterandDrilldownObjArray = storedDrilldownAndFilterstr || { filter_obj: [], drilldown_obj: [], disabled_filterObj: [], drilldown_table_obj: [] };

    this.filterandDrilldownObjArray = {
      filter_obj: storedDrilldownAndFilterstr?.filter_obj || [],
      drilldown_obj: storedDrilldownAndFilterstr?.drilldown_obj || [],
      disabled_filterObj: storedDrilldownAndFilterstr?.disabled_filterObj || [],
      drilldown_table_obj: storedDrilldownAndFilterstr?.drilldown_table_obj || [],

    };


    const lastFilterObj = this.filterandDrilldownObjArray.filter_obj[this.filterandDrilldownObjArray.filter_obj.length - 1];
    const isStored = Object.keys(existingStorageObj).includes(panelId);

    if (this.filterandDrilldownObjArray.filter_obj.length > 0) {
      storedDrilldownAndFilterstr?.filter_obj?.forEach((ele: any) => {


        if (ele.object_type === "DropdownList") {
          // For DropdownList, store the first value or the entire array
          this.selectedDropdownValuesObj[ele.id] = ele.values.length === 1 ? ele.values[0] : ele.values;

        } else if (ele.object_type == "ListBox" || ele.object_type == 'MultiSelectDropDown' || ele.panelType == 'InputBox') {
          // For ListBox, store the values in selectedItemsMap
          const sanitizedValues = this.sanitizeSelectionValues(
            ele.values,
            !!this.explicitEmptySelectionMap[ele.id]
          );
          ele.values = sanitizedValues;
          this.selectedItemsMap[ele.id] = sanitizedValues;
        } else if (ele.object_type == "dateRangePicker") {
          // this.selectedDateRanges = {};
          this.selectedDateRanges[ele.id] = ele.values;

        } else if (ele.object_type == 'datePicker') {
          // this.selectedDateObject = {};
          this.selectedDateObject[ele.id] = ele.values;

        }
      });


    } else {
      this.selectedItemsMap = {};
      this.selectedDateRanges = {};
      this.selectedDropdownValuesObj = {}
    }

    sessionStorage.setItem('storedDrilldownAndFilterArray', JSON.stringify(this.filterandDrilldownObjArray))

    if (this.filterandDrilldownObjArray.filter_obj.length > 0) {
      if (lastFilterObj?.id !== panelId || !isStored) {
        // existingStorageObj[panelId] = selectedFilters;
        // Ã°Å¸Å¡â‚¬ Limit to 1000 records before saving
        existingStorageObj[panelId] = selectedFilters.slice(0, 1000);
        sessionStorage.setItem('dataSourceStorageObj', JSON.stringify(existingStorageObj));
      } else {
        this.filteredData[panelId] = existingStorageObj[panelId];
      }
    } else {
      sessionStorage.removeItem('dataSourceStorageObj');
    }

    // Assign `existingStorageObj[panelId]` to the corresponding panel in panelSeriesArray
    //   this.panelSeriesArray.forEach((panel: any) => {
    //     if (existingStorageObj[panel.id]) {
    //         panel.content.dataSource = existingStorageObj[panel.id]; // Assign stored filters to dataSource
    //     }
    // });

    // console.log("Updated panelSeriesArray:", this.panelSeriesArray);
  }


  storePanelsLocally(panelSeriesArray: any[]): string {
    const panelArray = panelSeriesArray.map(panel => ({
      ...panel,
      content: {
        ...panel.content,
        dataSource: [],
      },
    }));
    return JSON.stringify(panelArray);
  }



  closePopup(): void {
    const popup = document.getElementById('popup');
    const backdrop = document.getElementById('backdrop');

    if (popup && backdrop) {
      popup.style.display = 'none';
      backdrop.style.display = 'none';
      this.refreshPage()
    }
  }

  showPopup(status: any, fontSize: string = '40px', resMessage: string): void {
    const popup = document.getElementById('popup');
    const backdrop = document.getElementById('backdrop');
    const popupMessage = document.getElementById('popup-message');

    if (popup && backdrop && popupMessage) {
      const iconClass = status === true ? 'fa-check-circle' : 'fa-times-circle';
      const iconColor = status === true ? 'green' : 'red';

      popupMessage.innerHTML = `<span style="color: ${iconColor};"><i class="fas ${iconClass}" style="font-size: ${fontSize};"></i></span>`;

      const statusElement = document.createElement('h5');
      statusElement.textContent = status === true ? 'Success' : 'Error';
      popupMessage.appendChild(statusElement);

      const messageElement = document.createElement('div');
      messageElement.innerHTML = `<h6>${resMessage}</h6>`;
      popupMessage.appendChild(messageElement);

      const scrollTop = document.documentElement.scrollTop;
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      const popupHeight = popup.offsetHeight;

      const topPosition = Math.max(0, scrollTop + windowHeight / 2 - popupHeight / 2);

      popup.style.top = topPosition + 'px';
      popup.style.display = 'block';
      backdrop.style.display = 'block';
    }
  }




  multiSelectDropdownValues: any = []

  columnMenuOpen(args: ColumnMenuOpenEventArgs, isPaging: boolean) {
    if (isPaging == true) {
      for (const item of (args as any).items) {
        //  // //console.log('item', item)
        if (item.text === 'Filter') {
          (item as ColumnMenuItemModel).hide = true;
        }
      }
    }

  }




  onDataStateChange(event: any, item: any, gridInstance: GridComponent, action?: DataStateChangeEventArgs) {

    let sortedObj = event.sorted ? event.sorted[0] : {};

    let panelData: any = sessionStorage.getItem('storedDrilldownAndFilterArray')

    if (panelData) {
      panelData = JSON.parse(panelData)
      this.filterandDrilldownObjArray = panelData;
    }

    let drilldownObj = panelData?.drilldown_obj ? panelData?.drilldown_obj : [];
    let drilldownTableObj = panelData?.drilldown_table_obj ? panelData?.drilldown_table_obj : [];
    let tableLevel = 0; // Default level is 0

    if (drilldownTableObj.length > 0) {
      let matchingLevels: number[] = [];
      drilldownTableObj.forEach((obj: any) => {
        Object.keys(obj).forEach((key) => {
          if (item.id === key) {
            matchingLevels.push(obj[key]);
          }
        });
      });

      tableLevel = matchingLevels.length > 0 ? Math.max(...matchingLevels) : 0;
      console.log('tableLevel', tableLevel);
    }

    const state = { skip: (event.action.currentPage - 1) * event.action.pageSize, take: event.action.pageSize };

    let sorting_obj = sortedObj ? {
      "field_name": sortedObj.name,
      "direction": sortedObj.direction
    } : {}

    if (event.action.requestType == 'paging') {

      let pagingObj = item.content.table_pagination;
      let paginationObj = {
        "filter_obj": this.filterandDrilldownObjArray.filter_obj ? this.filterandDrilldownObjArray.filter_obj : [],
        "pagination_obj": {
          "items_per_page": event.action.pageSize,
          "total_pages": pagingObj.total_pages,
          "total_records": pagingObj.total_records,
          "current_page": event.action.currentPage
        },
        sorting_obj: sorting_obj ? sorting_obj : {}
      }


      this.chartService.getTablePaginationByItemPerPage(this.editDashboardId, item.id, paginationObj, tableLevel).subscribe((res: any) => {
        let data = res['data'];
        console.log('item per page data', data);
        const query = new Query();
        const currentResult: any = new DataManager(data.content.dataSource).executeLocal(query);
        console.log('currentResult in paging', currentResult);

        if (currentResult.length) {
          let tableDataSource = {
            result: currentResult, // Result of the data
            count: pagingObj.total_records // Total record count
          };
          let obj = {
            ...data,
            content: {
              ...data.content,
              dataSource: tableDataSource
            }
          }
          console.log('tableDataSource in paging', tableDataSource);
          item.content.dataSource = tableDataSource
        } else {
          item.content.dataSource = data.content.dataSource
        }

        if (typeof gridInstance.hideSpinner === 'function') {
          gridInstance.hideSpinner();
        }
        this.cdr.detectChanges();
      })
    } else if (event.action.requestType == 'sorting') {
      const query = new Query();
      const skip = event.skip ?? 0;
      const take = event.take ?? 50;
      const currentPage = Math.floor(skip / take) + 1;

      const state = { skip, take };
      // const state = { skip: (event.action.currentPage - 1) * event.action.pageSize, take: event.action.pageSize };
      if (event.sorted) {
        event.sorted.length ? this.applySorting(query, event.sorted) :
          event.sorted.columns.length ? this.applySorting(query, event.sorted.columns) : null
      }
      console.log('event in sorting', event, item)
      console.log('sorting_obj', sorting_obj)
      let pagingObj = item.content.table_pagination;
      let paginationObj = {
        "filter_obj": this.filterandDrilldownObjArray.filter_obj ? this.filterandDrilldownObjArray.filter_obj : [],
        "pagination_obj": {
          "items_per_page": event.take,
          "total_pages": pagingObj.total_pages,
          "total_records": pagingObj.total_records,
          "current_page": currentPage
        },
        sorting_obj: sorting_obj ? sorting_obj : {}
      }
      console.log('paginationObj in sorting', paginationObj)
      query.isCountRequired = true;

      this.chartService.getTablePaginationByItemPerPage(this.editDashboardId, item.id, paginationObj, tableLevel).subscribe((res: any) => {
        let data = res['data'];
        console.log('item per page data in sorting ', res);
        if (!res.success) {
          console.error('Ã¢ÂÅ’ Error in sorting API response:', res.message);
          console.log('Ã°Å¸â€Â Returning item as it is:', item.content.dataSource);
          let dataSource = item.content.dataSource.result ? item.content.dataSource.result : item.content.dataSource;
          console.log('Ã°Å¸â€Â Returning item content dataSource:', gridInstance.dataSource, dataSource);
          // gridInstance.dataSource = dataSource;
          item.content.dataSource.result = dataSource; // Ensure the dataSource is updated
          gridInstance.hideSpinner()
          this.cdr.detectChanges();
          // gridInstance.refresh();
          return; // Exit without modifying anything
        }

        if (res.success) {
          const currentTotalResult: any = new DataManager(data.content.dataSource).executeLocal(query);
          console.log('currentTotalResult in sorting', currentTotalResult);
          const currentResult: any = new DataManager(item.content.dataSource.result).executeLocal(query);
          // console.log('currentResult in api', currentResult);
          if (currentTotalResult.result.length) {
            const currentResult: any = new DataManager(item.content.dataSource.result).executeLocal(query);
            // console.log('currentResult in api', currentResult);
            if (currentTotalResult.result.length) {
              let tableDataSource = {
                result: currentTotalResult.result, // Result of the data
                count: paginationObj.pagination_obj.total_records // Total record count
              };
              console.log('tableDataSource in sorting', tableDataSource);
              let obj = {
                ...item,
                content: {
                  ...item.content,
                  dataSource: tableDataSource
                }
              }
              item.content.dataSource = tableDataSource;
            } else {
              item.content.dataSource = item.content.dataSource;
            }
          }
        }

        if (typeof gridInstance.hideSpinner === 'function') {
          gridInstance.hideSpinner();
        }
        this.cdr.detectChanges();
      }
      )

    } else if (event.action.requestType == 'grouping') {

      const query = new Query();
      query.isCountRequired = true;

      let pagingObj = item.content.table_pagination;

      let paginationObj = {
        "filter_obj": this.filterandDrilldownObjArray.filter_obj ? this.filterandDrilldownObjArray.filter_obj : [],
        "pagination_obj": {
          "items_per_page": pagingObj.total_records,
          "total_pages": pagingObj.total_pages,
          "total_records": pagingObj.total_records,
          "current_page": 1
        }
      }
      const currentResult: any = new DataManager(item.content.dataSource.result).executeLocal(query);

      if (currentResult.result.length) {
        let tableDataSource = {
          result: currentResult.result, // Result of the data
          count: pagingObj.total_records // Total record count
        };
        let obj = {
          ...item,
          content: {
            ...item.content,
            dataSource: tableDataSource
          }
        }
        //
        item.content.dataSource = tableDataSource;

      } else {
        item.content.dataSource = item.content.dataSource

      }

      this.cdr.detectChanges();
    } else if (event.action.requestType == "ungrouping") {
      const state = { skip: (event.action.currentPage - 1) * event.action.pageSize, take: event.action.pageSize };
      let pagingObj = item.content.table_pagination;

      const query = new Query();

      let paginationObj = {
        "filter_obj": this.filterandDrilldownObjArray.filter_obj ? this.filterandDrilldownObjArray.filter_obj : [],
        "pagination_obj": {
          "items_per_page": pagingObj.total_records,
          "total_pages": pagingObj.total_pages,
          "total_records": pagingObj.total_records,
          "current_page": 1
        }
      }
      const currentResult: any = new DataManager(item.content.dataSource.result).executeLocal(query);

      if (currentResult.length) {
        let tableDataSource = {
          result: currentResult, // Result of the data
          count: pagingObj.total_records // Total record count
        };
        let obj = {
          ...item,
          content: {
            ...item.content,
            dataSource: tableDataSource
          }
        }

        item.content.dataSource = tableDataSource;

      } else {
        item.content.dataSource = item.content.dataSource;

      }

      this.cdr.detectChanges();

    } else if (event.action.requestType == "filterchoicerequest") {
      const query = new Query();

      query.isCountRequired = true
      let pagingObj = item.content.table_pagination;
      let paginationObj = {
        "filter_obj": this.filterandDrilldownObjArray.filter_obj ? this.filterandDrilldownObjArray.filter_obj : [],
        "pagination_obj": {
          "items_per_page": pagingObj.total_records,
          "total_pages": pagingObj.total_pages,
          "total_records": pagingObj.total_records,
          "current_page": 1
        },
        sorting_obj: sorting_obj ? sorting_obj : {}
      }

      this.chartService.getTablePaginationByItemPerPage(this.editDashboardId, item.id, paginationObj, tableLevel).subscribe((res: any) => {
        let data = res['data'];
        const currentResult: any = new DataManager(data.content.dataSource).executeLocal(event.action.query);
        if (currentResult.result.length) {
          let tableDataSource = {
            result: currentResult.result, // Result of the data
            count: pagingObj.total_records // Total record count
          };
          let obj = {
            ...data,
            content: {
              ...data.content,
              dataSource: tableDataSource
            }
          }
          gridInstance.dataSource = tableDataSource;

        } else {
          gridInstance.dataSource = data.content.dataSource;
        }

        this.cdr.detectChanges();
      })
    }

  }


  applySorting(query: Query, sorted: any): void {
    if (sorted && sorted.length > 0) {
      sorted.forEach((sort: any) => {

        const sortField = sort.name || sort.field;

        query.sortBy(sortField as string, sort.direction);
      });
    }
  }


  // dataBound(item: any, grid: any) {
  //   const columns = grid.getColumns();
  //   if (item.content.autoFitColumns === true) {
  //     grid.autoFitColumns([]);
  //   }
  dataBound(item: any, grid: any) {
    const columns = grid.getColumns();

    if (item.content.autoFitColumns === true) {
      grid.autoFitColumns([]);
    }

    if (item.content.allowWrapping == true) {
      this.wrapSettings = { wrapMode: 'Both' }
      // this.wrapSettings = { wrapMode: 'Content' }
    }

    // Hide spinner after all grid operations are complete
    setTimeout(() => {
      if (typeof grid.hideSpinner === 'function') {
        grid.hideSpinner();
      }
    });


    // if (item.content.headerConditonalFormatting?.length > 0) {
    //       // Object.keys(data).forEach((fieldName) => {
    //       item.content.headerConditonalFormatting.forEach((headerConfig: any) => {
    //         //console.log('headerConfig', headerConfig)

    //         const headerElement = (grid as GridComponent).getColumnHeaderByField(headerConfig.fieldName) as HTMLElement;
    //         //console.log('headerElement', headerElement)

    //         if (headerElement) {
    //           headerElement.style.background = headerConfig.backgroundColor; // Change background color
    //           headerElement.style.color = headerConfig.color; // Change text color
    //           // headerElement.style.fontSize =headerConfig.fontSize; // Change text color
    //           // headerElement.style.fontWeight = headerConfig.fontWeight; // Change text color
    //           headerElement.style.fontStyle = headerConfig.fontStyle; // Change text color

    //           // Find the span inside and apply the font size
    //           const headerTextElement = headerElement.querySelector('.e-headertext') as HTMLElement;
    //           if (headerTextElement) {
    //             headerTextElement.style.fontSize = headerConfig.fontSize;
    //             headerElement.style.fontWeight = headerConfig.fontWeight; // Change text color

    //           } else {
    //             console.warn("Header text element not found inside:", headerElement);
    //           }

    //         }
    //       });
    //     }


    this.applyTableHeaderFormatting(grid as GridComponent, item);


  }

  private applyTableHeaderFormatting(grid: GridComponent, item: any): void {
    const headerConfigs = [
      ...(Array.isArray(item?.content?.headerConditonalFormatting) ? item.content.headerConditonalFormatting : []),
      ...(Array.isArray(item?.content?.headerFormatting) ? item.content.headerFormatting : [])
    ];

    if (!headerConfigs.length) {
      return;
    }

    const applyFormatting = () => {
      headerConfigs.forEach((headerConfig: any) => {
        const rawFieldNames = Array.isArray(headerConfig?.fieldName)
          ? headerConfig.fieldName
          : [headerConfig?.fieldName];

        rawFieldNames.filter((fieldName: string) => !!fieldName).forEach((fieldName: string) => {
          const matchingFields = (item?.content?.fieldDetails || []).filter((field: any) => {
            const candidates = [field?.field, field?.fieldName, field?.name, field?.headerText, field?.labelName]
              .filter((value: any) => value !== null && value !== undefined)
              .map((value: any) => String(value).trim().toLowerCase());

            return candidates.includes(String(fieldName).trim().toLowerCase());
          });

          const targetFields = matchingFields.length
            ? matchingFields.map((field: any) => field.field || field.fieldName || field.name).filter(Boolean)
            : [fieldName];

          targetFields.forEach((targetField: string) => {
            const headerNode = grid.getColumnHeaderByField(targetField) as HTMLElement;
            const headerElement = (headerNode?.closest('.e-headercell') as HTMLElement) || headerNode;

            if (!headerElement) {
              return;
            }

            if (headerConfig.backgroundColor) {
              headerElement.style.setProperty('background', headerConfig.backgroundColor, 'important');
              headerElement.style.setProperty('background-color', headerConfig.backgroundColor, 'important');
            }

            if (headerConfig.color) {
              headerElement.style.setProperty('color', headerConfig.color, 'important');
            }

            if (headerConfig.fontStyle) {
              headerElement.style.setProperty('font-style', headerConfig.fontStyle, 'important');
            }

            if (headerConfig.fontWeight) {
              headerElement.style.setProperty('font-weight', headerConfig.fontWeight, 'important');
            }

            headerElement.querySelectorAll('.e-headertext, .e-headercelldiv, .e-sortfilterdiv, .e-icons, span, div').forEach((el: Element) => {
              const htmlEl = el as HTMLElement;

              if (headerConfig.color) {
                htmlEl.style.setProperty('color', headerConfig.color, 'important');
              }

              if (headerConfig.fontSize) {
                htmlEl.style.setProperty('font-size', headerConfig.fontSize, 'important');
              }

              if (headerConfig.fontWeight) {
                htmlEl.style.setProperty('font-weight', headerConfig.fontWeight, 'important');
              }

              if (headerConfig.fontStyle) {
                htmlEl.style.setProperty('font-style', headerConfig.fontStyle, 'important');
              }
            });
          });
        });
      });
    };

    applyFormatting();
    setTimeout(applyFormatting, 0);
    setTimeout(applyFormatting, 100);
  }


  handleHyperlinkClick(args: QueryCellInfoEventArgs, item: any, url: string): void {
    // this.onGridCellClick({ target: args.cell }, item, this.grid); // Call drilldown first

    const gridToPass = this.grids.find(g => g.element.id === 'gridcomp' + item.id);
    if (gridToPass) {
      this.onGridCellClick({ target: args.cell }, item, gridToPass); // Call drilldown first
    }


    setTimeout(() => {
      window.open(url, '_blank'); // Redirect after drilldown execution
    }, 500); // Small delay to ensure drilldown logic runs first
  }

  commentDatasourcesArray = []

  onQueryCellInfo(args: QueryCellInfoEventArgs, item: any): void {
    let matchedObj = this.panelSeriesArray.find((ele: any) => ele.id === item.id);
    let data: any = args.data

    if (matchedObj && args.column && args.data && args.cell) {

      const rowData = args.data as any;

      const matched = item.content.comments_dataSource?.find((ele: any) =>
        ele.panel_id == item.id &&
        rowData[ele.unique_column_field]?.toString() == ele.unique_column_id?.toString() &&
        ele.field_name == args.column?.field   // Ã°Å¸â€˜Ë† extra check for column
      );

      if (matched) {
        new Tooltip(
          {
            content: matched.comment_Text,
            position: "TopCenter"
          },
          args.cell as HTMLElement
        );

      }   // Ã°Å¸â€Â¹ New logic: show raw cell value if enableTooltip is true
      else if (item.content.enableTooltip === true) {
        const cellValue = rowData[args.column.field];
        if (cellValue !== null && cellValue !== undefined && cellValue !== "") {
          new Tooltip(
            {
              content: cellValue.toString(),
              // position: "TopCenter"
            },
            args.cell as HTMLElement
          );
        }
      }
    }


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

              // console.log('allValues', allValues)


              const sum = allValues.reduce((a: number, b: number) => a + b, 0);
              const avg = allValues.length > 0 ? sum / allValues.length : 0;

              // console.log(`Calculated values for ${condition.measure} - Sum: ${sum}, Average: ${avg}`);

              // Ã¢Å“â€¦ Assign the computed value back to condition.value1 dynamically
              // condition.value1 = calculatedValue.toLowerCase() === 'sum' ? sum : avg;

              // Ã¢Å“â€¦ Only override if Sum or Average; else keep user's entered value
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




  compareValues(value: string | number | null, threshold: string | number | number[], condition: string): boolean {
    // Handle "notContains" (empty/null only)
    // console.log('value', value, threshold)
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

    // At this point, if value is null but condition is not about null Ã¢â€ â€™ false
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
      console.log('value', value, 'threshold', threshold)
      switch (condition) {
        case "=": return value.toLowerCase() == threshold.toLowerCase();
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
      case "=": return Number(value) == Number(threshold);
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




  dropDownData: object[] = [
    { text: 'CurrentPage', value: 'CurrentPage' },
    { text: 'AllPages', value: 'AllPages' },
  ];

  toolbarClick(args: ClickEventArgs, item: any, grid: GridComponent): void {
    if (args) {

      this.loaderService.show()
      this.cdr.detectChanges();

      if (args.item.text == 'Excel Export') {
        const exportProperties: ExcelExportProperties = {
          exportType: 'CurrentPage',
        };

        let obj: any = []
        // let panelData: any = localStorage.getItem('storedDrilldownAndFilterArray');
        let panelData: any = sessionStorage.getItem('storedDrilldownAndFilterArray');
        if (panelData) {
          panelData = JSON.parse(panelData)
        }
        let filterObj = panelData?.filter_obj ? panelData?.filter_obj : [];
        // //console.log('filterobj', filterObj, this.tableLevels)
        this.chartService.downloadTableExportExcel(this.editDashboardId, item.id, filterObj, 0).subscribe(
          (res: any) => {
            this.loaderService.hide()

            if (res.success == true) {

              let data: any = res['data'].dataSource;

              let fieldDetails = item.content.fieldDetails;

              let orderedDataSource;
              const supportedFormats = [
                'short', 'medium', 'long', 'full',
                'shortDate', 'mediumDate', 'longDate', 'fullDate',
                'shortTime', 'mediumTime', 'longTime', 'fullTime'
              ];

              const dateFormats = [
                { format: 'dd-MM-yyyy', regex: /^\d{2}-\d{2}-\d{4}$/, separator: '-' },
                { format: 'MM-dd-yyyy', regex: /^\d{2}-\d{2}-\d{4}$/, separator: '-' },
                { format: 'yyyy-MM-dd', regex: /^\d{4}-\d{2}-\d{2}$/, separator: '-' }

              ]

              if (fieldDetails && fieldDetails.length > 0) {
                orderedDataSource = data.map((item: any) => {
                  let orderedItem: any = {};
                  fieldDetails.forEach((field: any) => {
                    let fieldValue = item[field.field];

                    if (field.type === 'date') {

                      if (typeof (fieldValue) === 'number') {
                        fieldValue = this.datePipe.transform(fieldValue, field.format);
                      } else if (typeof (fieldValue) === 'string') {

                        let matchedFormat = null;
                        for (let dateFormat of dateFormats) {
                          if (dateFormat.regex.test(fieldValue)) {
                            matchedFormat = dateFormat;
                            break;
                          }
                        }

                        if (matchedFormat) {
                          const parts = fieldValue.split(matchedFormat.separator);
                          let standardizedDate: string | null = null;

                          if (matchedFormat.format === 'dd-MM-yyyy') {
                            standardizedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
                          } else if (matchedFormat.format === 'MM-dd-yyyy') {
                            standardizedDate = `${parts[2]}-${parts[0]}-${parts[1]}`;
                          } else if (matchedFormat.format === 'yyyy-MM-dd') {
                            standardizedDate = `${parts[0]}-${parts[1]}-${parts[2]}`;
                          }

                          if (standardizedDate) {
                            fieldValue = this.datePipe.transform(standardizedDate, field.format);
                          }
                        } else {

                          try {
                            fieldValue = this.datePipe.transform(fieldValue, field.format);
                          } catch (error) {

                            //  console.error('Date transformation error:', error);
                            fieldValue = item[field.field];
                          }
                        }
                      }
                    } else {
                      fieldValue = fieldValue
                    }
                    orderedItem[field.headerText] = fieldValue;
                  });
                  return orderedItem;
                });

              } else {
                orderedDataSource = data; // Pass data as it is
              }

              this.excelService.exportAsExcelFile(orderedDataSource, item.header);

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
            // this.showPopup(false, '35px', "Something Went wrong, Please reload the page");

            const errorMessage = err.error && err.error.message ? err.error.message : err.message;
            this.popupService.showPopup({
              message: errorMessage,
              statusCode: err.status,
              status: false
            });
          }
        )

      } else if (args.item.text == 'CSV Export') {
        grid.csvExport();
        // this.grid.csvExport()
      }
    }
  }



  isDownloadingMap: { [key: string]: boolean } = {};
  // Declare this at the top of your component class



  downloadDumpReports(item: any) {
    this.isDownloadingMap[item.id] = true;
    this.cdr.detectChanges();

    const panelData: any = sessionStorage.getItem('storedDrilldownAndFilterArray');
    let filterObj = panelData ? JSON.parse(panelData).filter_obj || [] : [];

    this.chartService.downloadDumpReports(this.editDashboardId, item.id, filterObj).subscribe(
      (res: any) => {
        const contentType = res.headers.get('Content-Type');
        const fileExtension = contentType?.includes('spreadsheetml.sheet') ? 'xlsx' : 'csv';
        console.log('fileExtension', fileExtension, 'contentType', contentType);
        const reader = new FileReader();

        reader.onload = () => {
          try {
            const json = JSON.parse(reader.result as string);
            if (json && json.success === false) {
              this.popupService.showPopup({
                message: json.message || 'Unknown error occurred',
                statusCode: json.status_code || 400,
                status: false
              });
              this.isDownloadingMap[item.id] = false;
              this.cdr.detectChanges();
              return;
            }
          } catch (e) {
            // Valid file
            const blob = new Blob([res.body], { type: contentType });

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${item.header || 'report'}.${fileExtension}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
          }

          this.isDownloadingMap[item.id] = false;
          this.cdr.detectChanges();
        };

        reader.readAsText(res.body);

      },
      (err: any) => {
        console.error('Error downloading dump report:', err);
        const finishDownload = () => {
          this.isDownloadingMap[item.id] = false;
          this.cdr.detectChanges();
        };

        const showErrorPopup = (message: string, statusCode?: number) => {
          this.popupService.showPopup({
            message: message || 'Failed to download report',
            statusCode: statusCode || err.status || 500,
            status: false
          });
        };

        if (err?.error instanceof Blob) {
          const reader = new FileReader();
          reader.onload = () => {
            try {
              const errorJson = JSON.parse(reader.result as string);
              showErrorPopup(
                errorJson?.message || 'Failed to download report',
                errorJson?.status_code || err.status
              );
            } catch {
              showErrorPopup(err?.message || 'Failed to download report', err?.status);
            }
            finishDownload();
          };
          reader.onerror = () => {
            showErrorPopup(err?.message || 'Failed to download report', err?.status);
            finishDownload();
          };
          reader.readAsText(err.error);
          return;
        }

        if (err?.error && typeof err.error === 'object') {
          showErrorPopup(err.error.message || err.message, err.error.status_code || err.status);
          finishDownload();
          return;
        }

        showErrorPopup(err?.message || 'Failed to download report', err?.status);
        finishDownload();
      }
    );
  }


  onselect(eve: any, item: any, paging: boolean) {
    // //console.log('eve', item.content)
    if (this.isDownloadingMap[item.id]) {
      return;
    }

    const grid = this.grids.find(g => g.element.id === 'gridcomp' + item.id);
    if (!grid) {
      console.error('Could not find grid for export:', item.id);
      return;
    }

    this.isDownloadingMap[item.id] = true;
    this.cdr.detectChanges();

    const selectedValue = eve.item.properties.text;

    if (selectedValue == 'Current Page') {
      try {
        let currentPageData: any[] = [];
        if (grid && typeof (grid as any).getCurrentViewRecords === 'function') {
          currentPageData = ((grid as any).getCurrentViewRecords() || []) as any[];
        }

        if (!Array.isArray(currentPageData) || currentPageData.length === 0) {
          if (Array.isArray(item.content?.dataSource)) {
            currentPageData = item.content.dataSource;
          } else if (item.content?.dataSource?.result && Array.isArray(item.content.dataSource.result)) {
            currentPageData = item.content.dataSource.result;
          }
        }

        const orderedData = this.convertDates(currentPageData || [], item.content.fieldDetails);
        this.excelService.exportAsExcelFile(orderedData, item.header);
      } catch (err: any) {
        const errorMessage = err?.message || 'Failed to export current page';
        this.popupService.showPopup({
          message: errorMessage,
          statusCode: 500,
          status: false
        });
      } finally {
        this.isDownloadingMap[item.id] = false;
        this.cdr.detectChanges();
      }

    } else {
      let panelData: any = sessionStorage.getItem('storedDrilldownAndFilterArray');
      if (panelData) {
        panelData = JSON.parse(panelData);
        console.log('panelData', panelData)

      }
      let filterObj = panelData?.filter_obj ? panelData?.filter_obj : [];
      let drilldownObj = panelData?.drilldown_obj ? panelData?.drilldown_obj : [];
      let drilldownTableObj = panelData?.drilldown_table_obj ? panelData?.drilldown_table_obj : [];
      let tableLevel = 0; // Default level is 0

      if (drilldownTableObj.length > 0) {
        let matchingLevels: number[] = [];

        drilldownTableObj.forEach((obj: any) => {
          Object.keys(obj).forEach((key) => {
            if (item.id === key) {
              matchingLevels.push(obj[key]);
            }
          });
        });

        tableLevel = matchingLevels.length > 0 ? Math.max(...matchingLevels) : 0;
        console.log('tableLevel', tableLevel, 'matchingLevels', matchingLevels);
      }



      this.chartService.downloadTableExportExcel(this.editDashboardId, item.id, filterObj, tableLevel).subscribe(
        (res: any) => {
          this.isDownloadingMap[item.id] = false;

          if (res.success == true) {
            let data: any = res['data'].dataSource;
            const orderedData = this.convertDates(data, item.content.fieldDetails);
            this.excelService.exportAsExcelFile(orderedData, item.header);

          } else {
            this.popupService.showPopup({
              message: res.message,
              statusCode: res.status_code,
              status: res.success
            });
          }
          this.cdr.detectChanges();
        },
        (err: any) => {
          this.isDownloadingMap[item.id] = false;
          const errorMessage = err.error && err.error.message ? err.error.message : err.message;
          this.popupService.showPopup({
            message: errorMessage,
            statusCode: err.status,
            status: false
          });
          this.cdr.detectChanges();

        }
      )
    }
  }

  private convertDates(data: any[], fieldDetails: any[]): any[] {

    if (!fieldDetails || fieldDetails.length === 0) {
      return data; // Return the original data if fieldDetails is empty
    }

    const dateFormats = [
      { format: 'dd-MM-yyyy', regex: /^\d{2}-\d{2}-\d{4}$/, separator: '-' },
      { format: 'MM-dd-yyyy', regex: /^\d{2}-\d{2}-\d{4}$/, separator: '-' },
      { format: 'yyyy-MM-dd', regex: /^\d{4}-\d{2}-\d{2}$/, separator: '-' }
    ];

    return data.map((item: any) => {
      let orderedItem: any = {};
      fieldDetails.forEach((field: any) => {

        const fieldKey = field.field.toLowerCase();
        let fieldValue: any;


        // Find a matching key in `item` with case insensitivity
        const matchedKey = Object.keys(item).find(key => key.toLowerCase() === fieldKey);

        if (matchedKey) {
          fieldValue = item[matchedKey];

          if (field.type === 'date') {
            if (typeof fieldValue === 'number') {
              fieldValue = this.datePipe.transform(fieldValue, field.format);
            } else if (typeof fieldValue === 'string') {
              let matchedFormat = dateFormats.find(format => format.regex.test(fieldValue));

              if (matchedFormat) {
                const parts = fieldValue.split(matchedFormat.separator);
                let standardizedDate: string | null = null;

                if (matchedFormat.format === 'dd-MM-yyyy') {
                  standardizedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
                } else if (matchedFormat.format === 'MM-dd-yyyy') {
                  standardizedDate = `${parts[2]}-${parts[0]}-${parts[1]}`;
                } else if (matchedFormat.format === 'yyyy-MM-dd') {
                  standardizedDate = `${parts[0]}-${parts[1]}-${parts[2]}`;
                }

                if (standardizedDate) {
                  fieldValue = this.datePipe.transform(standardizedDate, field.format);
                }
              } else {
                try {
                  fieldValue = this.datePipe.transform(fieldValue, field.format);
                } catch (error) {
                  //   console.error('Date transformation error:', error);
                  fieldValue = item[field.field];
                }
              }
            }
          }
          orderedItem[field.headerText] = fieldValue;
        }


        //  let fieldValue = item[field.field];
        //// //console.log('fieldValue', fieldValue)

        //// //console.log('orderedItem', orderedItem)
      });
      return orderedItem;
    });
  }


  applyFormat(value: any, format: any) {
    console.log('applyFormat:', { value, format, type: typeof value });
    if (value === null || value === undefined || value === '' || isNaN(value)) {
      if (format === 'percent' ||
        (typeof format === 'string' && format.toLowerCase().includes('percent'))) {
        return '0';
      }
      return 0;
    }
    console.log('value', value, format)
    switch (format) {
      case 'currency-usd':
        value = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
        break;
      case 'currency-inr':
        value = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value);
        break;
      case 'percent':

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
        //// //console.log('value', value)
        value = (Math.round(value * 1000) / 1000).toFixed(3);

        break;
      default:
        value = value;
    }
    return value;
  }



  onCancelWithFilterClear() {

    let confirmFilter = window.confirm('Do you want to clear the filters');
    const scrollPosition = window.scrollY;

    if (confirmFilter) {
      // this.loaderService.show()

      this.explicitEmptySelectionMap = {};
      this.selectedItems = [];
      this.selectedDateRanges = {};
      this.selectedDateObject = {};
      this.selectedDropdownValuesObj = {};
      this.selectDateFromDate = "";
      this.selectDatePickerFromDate = "";
      this.selectedItems = [];
      //   this.inputBoxTags = {};
      // this.inputBoxText = {};
      // this.inputBoxSuggestions = {};
      // this.inputBoxDropdownVisible = {};    
      this.selectedDropdownValue = '',
        this.filterandDrilldownObjArray = {
          filter_obj: [],
          drilldown_obj: this.filterandDrilldownObjArray.drilldown_obj ? this.filterandDrilldownObjArray.drilldown_obj : [],
          disabled_filterObj: [],
          drilldown_table_obj: this.filterandDrilldownObjArray.drilldown_table_obj ? this.filterandDrilldownObjArray.drilldown_table_obj : [],
        };

      Object.keys(this.selectedItemsMap).forEach(key => {
        this.selectedItemsMap[key] = [];
      });
      this.defaultDialog1.hide()

      this.changeDetectorRef.detectChanges();

      let filterObjEle = {
        filter_obj: [],
        drilldown_obj: this.filterandDrilldownObjArray.drilldown_obj ? this.filterandDrilldownObjArray.drilldown_obj : [],
        disabled_filterObj: [],
        drilldown_table_obj: this.filterandDrilldownObjArray.drilldown_table_obj ? this.filterandDrilldownObjArray.drilldown_table_obj : [],
      }


      this.onFetchData(this.editDashboardId, filterObjEle, scrollPosition);


      sessionStorage.setItem('storedDrilldownAndFilterArray', JSON.stringify(filterObjEle));

      sessionStorage.removeItem('dataSourceStorageObj')

    } else {

    }


  }

  // refreshPage() {
  //   const currentUrl = this.router.url;
  //   this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
  //     this.router.navigate([currentUrl]);
  //   });
  // }

  onInitialPageReload() {
    let confirmFilter = window.confirm('Do you want to clear the filters');

    if (confirmFilter) {
      this.refreshPage()
    }

  }

  onCancel() {

    let confirmFilter = window.confirm('Do you want to clear the filters');
    const scrollPosition = window.scrollY;

    this.selectSceduleDateFilter = new Date()

    if (confirmFilter) {
      // this.loaderService.show()

      this.explicitEmptySelectionMap = {};
      this.selectedItems = [];
      this.selectedDateRanges = {};
      this.selectedDateObject = {};
      this.selectedDropdownValuesObj = {};
      this.selectDateFromDate = "";
      this.selectDatePickerFromDate = "";
      this.selectedItems = [];
      this.chartLevels = {};
      this.tableLevels = {}
      this.selectedDropdownValue = '',
        // this.inputBoxTags = {};
        // this.inputBoxText = {};
        // this.inputBoxSuggestions = {};
        // this.inputBoxDropdownVisible = {};
        this.filterandDrilldownObjArray = {
          filter_obj: [],
          drilldown_obj: [],
          disabled_filterObj: [],
          drilldown_table_obj: [],
        };

      Object.keys(this.selectedItemsMap).forEach(key => {
        this.selectedItemsMap[key] = [];
      });
      this.defaultDialog1.hide()

      this.changeDetectorRef.detectChanges();

      let filterObjEle = {
        filter_obj: [],
        drilldown_obj: [],
        disabled_filterObj: [],
        drilldown_table_obj: [],
      }

      this.onFetchData(this.editDashboardId, filterObjEle, scrollPosition);

      sessionStorage.setItem('storedDrilldownAndFilterArray', JSON.stringify(filterObjEle));

      sessionStorage.removeItem('dataSourceStorageObj')

    } else {

    }


  }


  clearBookmarkFilter(bookmark_flag: any) {
    let confirmFilter = window.confirm('Do you want to delete the bookmark filters');

    //  // //console.log('bookmark_flag', bookmark_flag)


    if (confirmFilter) {
      this.loaderService.show();
      this.cdr.detectChanges();
      this.chartService.deleteDashboardDataWithBookmarkFilterById(this.editDashboardId, this.bookmark_flag).subscribe(
        (res: any) => {
          //  // //console.log(res);
          this.loaderService.hide();
          // this.showPopup(res.success, '35px', res.message);
          this.popupService.showPopup({
            message: res.message,
            statusCode: res.status_code,
            status: res.success
          });
          this.defaultDialog1.hide()
        },

        (err: any) => {
          this.loaderService.hide()
          this.defaultDialog1.hide()
          const errorMessage = err.error && err.error.message ? err.error.message : err.message;
          this.popupService.showPopup({
            message: errorMessage,
            statusCode: err.status,
            status: false
          });

        }

      )
      // if(this.userInformationData.role == 'admin' || this.userInformationData.role == "superadmin"){
      //   this.chartService.deleteDashboardDataWithBookmarkFilterById(this.editDashboardId, true).subscribe(
      //     (res : any) =>{
      //    // //console.log(res);
      //     this.loaderService.hide();
      //     this.showPopup(res.success, '35px', res.message);
      //     this.defaultDialog1.hide()
      //   },

      //   (err : any) =>{
      //     this.loaderService.hide()
      //     this.showPopup(err.success, '35px', err.message);
      //     this.defaultDialog1.hide()
      //   }

      //  )
      // }else{
      //   this.chartService.deleteDashboardDataWithBookmarkFilterById(this.editDashboardId, false).subscribe(
      //     (res : any) =>{
      //    // //console.log(res);
      //     this.loaderService.hide();
      //     this.showPopup(res.success, '35px', res.message);
      //     this.defaultDialog1.hide()
      //   },

      //   (err : any) =>{
      //     this.loaderService.hide()
      //     this.showPopup(err.success, '35px', err.message);
      //     this.defaultDialog1.hide()
      //   }

      //  )
      // }
    }


  }
  onDashboardRefresh() {

    this.loaderService.show();
    this.cdr.detectChanges();

    this.chartService.deleteDashboardCache(this.editDashboardId).subscribe(
      (res: any) => {
        //  // //console.log(res)

        this.loaderService.hide();
        this.popupService.showPopup({
          message: res.message,
          statusCode: res.status_code,
          status: res.success
        });


      },
      (err: any) => {
        this.loaderService.hide();
        const errorMessage = err.error && err.error.message ? err.error.message : err.message;
        this.popupService.showPopup({
          message: errorMessage,
          statusCode: err.status,
          status: false
        });
      }

    )
  }

  onEditClick() {
    this.router.navigate(['/sidebar/panel/edit', this.editDashboardId]);
  }

  getPermissionById(dashboardId: string): any {
    if (this.dashboardBasedPermssionArray && this.dashboardBasedPermssionArray.length > 0) {
      return this.dashboardBasedPermssionArray.find((permission: any) => permission.dashboard_id === dashboardId);
    }
    return null; // or handle it in a way that fits your logic
  }

  refreshPage() {
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }


  onListboxSelectionChange(item: any, eve: any): void {
    const selectedVal = this.decodeMultiselectValues(eve.value, item.id);  // The currently selected (checked) values from the listbox

    const allowEmptyString =
      eve?.isInteracted === true &&
      Array.isArray(selectedVal) &&
      selectedVal.includes('');

    this.explicitEmptySelectionMap[item.id] = allowEmptyString;

    const filteredSelectedVal = this.sanitizeSelectionValues(selectedVal, allowEmptyString);

    const matchingObj = this.panelSeriesArray.find((ele: any) => ele.id === item.id);

    if (matchingObj) {
      const originalObject = {
        id: matchingObj.id,
        field_name: matchingObj.content.fieldDetails.fieldName,
        label_name: matchingObj.content.fieldDetails.labelName,
        table_name: matchingObj.content.tableName,
        values: filteredSelectedVal,  // Update with filtered selected values
        object_type: 'MultiSelectDropDown',
        date_format: '',
        isInitialFilter: false
      };

      // Check if field_name is already present in the filter_obj array
      // const existingFieldObjectIndex = this.filterandDrilldownObjArray.filter_obj.findIndex(
      //   (obj: any) => obj.field_name === matchingObj.content.fieldDetails.fieldName
      // );

      const existingFieldObjectIndex = this.filterandDrilldownObjArray.filter_obj.findIndex(
        (obj: any) =>
          obj.field_name === matchingObj.content.fieldDetails.fieldName &&
          obj.table_name === matchingObj.content.tableName
      );


      // //console.log('existingFieldObjectIndex', existingFieldObjectIndex)
      if (existingFieldObjectIndex !== -1) {
        // Field name exists, check and update values
        const existingObject = this.filterandDrilldownObjArray.filter_obj[existingFieldObjectIndex];
        existingObject.values = this.sanitizeSelectionValues(
          existingObject.values,
          !!this.explicitEmptySelectionMap[item.id]
        );

        // Keep only the values that are still selected.
        existingObject.values = existingObject.values.filter((val: any) =>
          filteredSelectedVal.includes(val)
        );

        // Add new selected values that are not already present
        filteredSelectedVal.forEach((val: any) => {
          if (!existingObject.values.includes(val)) {
            existingObject.values.push(val);
          }
        });

        // Update the selectedItemsMap for UI
        this.selectedItemsMap[item.id] = existingObject.values;

        // If no values are selected, remove the object
        if (existingObject.values.length === 0) {
          this.filterandDrilldownObjArray.filter_obj.splice(existingFieldObjectIndex, 1);
          this.selectedItemsMap[item.id] = [];
          //// //console.log(`Removed object with field_name: ${matchingObj.content.fieldDetails.fieldName} because values are empty.`);
        } else {
          // // //console.log(`Updated object with field_name: ${matchingObj.content.fieldDetails.fieldName}`, existingObject);
        }
      } else {
        // Field name not found, add new object only if there are valid values
        if (filteredSelectedVal.length > 0) {
          this.filterandDrilldownObjArray.filter_obj.push(originalObject);
          this.selectedItemsMap[item.id] = originalObject.values;
        } else {
          this.selectedItemsMap[item.id] = [];
        }
        // // //console.log(`Added new object with field_name: ${matchingObj.content.fieldDetails.fieldName}`, originalObject);
      }

      // // //console.log('this.selectedItemsMap[item.id]', this.selectedItemsMap[item.id]);

      // Update filterandDrilldownObjArray to reflect the changes
      this.filterandDrilldownObjArray = {
        filter_obj: this.filterandDrilldownObjArray.filter_obj,
        drilldown_obj: this.filterandDrilldownObjArray.drilldown_obj,
        disabled_filterObj: this.filterandDrilldownObjArray.disabled_filterObj,
        drilldown_table_obj: this.filterandDrilldownObjArray.drilldown_table_obj,
        // bookmark_filterObj: this.filterandDrilldownObjArray.bookmark_filterObj,
        // is_default_bookmark_filter : false


      };

      // // //console.log('Updated filterandDrilldownObjArray:', this.filterandDrilldownObjArray);

      // Save the updated filterandDrilldownObjArray in localStorage
      // localStorage.setItem('storedDrilldownAndFilterArray', JSON.stringify(this.filterandDrilldownObjArray));
      sessionStorage.setItem('storedDrilldownAndFilterArray', JSON.stringify(this.filterandDrilldownObjArray));

      // //console.log('this.selectedItemsMap[item.id]', this.selectedItemsMap[item.id])
      // //console.log('this.filterandDrilldownObjArray.drilldown_obj', this.filterandDrilldownObjArray.drilldown_obj)

      this.filterandDrilldownObjArray = {
        filter_obj: this.filterandDrilldownObjArray.filter_obj,
        drilldown_obj: this.filterandDrilldownObjArray.drilldown_obj,
        disabled_filterObj: [],
        drilldown_table_obj: []
        // bookmark_filterObj: [],
        // is_default_bookmark_filter : false

      };
    }
  }

  applyFilter(item: any) {
    // let storedFilterData: any = localStorage.getItem('storedDrilldownAndFilterArray');
    let storedFilterData: any = sessionStorage.getItem('storedDrilldownAndFilterArray');
    const scrollPosition = window.scrollY;

    if (storedFilterData) {
      storedFilterData = JSON.parse(storedFilterData);

      // //console.log('storedFilterData in applyfilter', storedFilterData)

      let filterObject = storedFilterData.filter_obj.find((obj: any) => obj.id === item.id);

      if (filterObject) {

        // this.loaderService.show();

        this.onFetchData(this.editDashboardId, storedFilterData, scrollPosition);


      } else {
        // // //console.log('No filter found for this item:', item.id);
        this.onFetchData(this.editDashboardId, storedFilterData, scrollPosition);

      }
    } else {
      // // //console.log('No stored filters available.');
    }
  }

  onBoxFilter(item: any) {
    let storedFilterData: any = sessionStorage.getItem('storedDrilldownAndFilterArray');
    const scrollPosition = window.scrollY;

    if (storedFilterData) {
      storedFilterData = JSON.parse(storedFilterData);
      let fieldDetails = item.content.fieldDetails;
      let dataSource = item.content.dataSource[0]; // Get first object from dataSource

      // Process each field detail
      fieldDetails.forEach((field: any) => {
        // Check if fieldName exists in dataSource
        if (dataSource.hasOwnProperty(field.fieldName)) {
          const selectedValue = dataSource[field.fieldName];

          // Create filter object for each field
          const filterObject = {
            id: item.id,
            field_name: field.fieldName,
            label_name: field.labelName,
            table_name: item.content.tableName,
            values: [selectedValue], // Wrap single value in array
            object_type: "Box",
            date_format: '',
            isInitialFilter: false
          };

          // Find existing filter index
          const filterIndex = storedFilterData.filter_obj.findIndex(
            (obj: any) => obj.field_name === field.fieldName
          );

          if (filterIndex !== -1) {
            // Update existing filter
            storedFilterData.filter_obj[filterIndex].values = [selectedValue];
          } else {
            // Add new filter
            storedFilterData.filter_obj.push(filterObject);
          }
        }
      });

      // Update filter array structure
      this.filterandDrilldownObjArray = {
        filter_obj: storedFilterData.filter_obj || [],
        drilldown_obj: storedFilterData.drilldown_obj || [],
        disabled_filterObj: storedFilterData.disabled_filterObj || [],
        drilldown_table_obj: storedFilterData.drilldown_table_obj || []
      };

      // Store updated filters
      sessionStorage.setItem('storedDrilldownAndFilterArray', JSON.stringify(this.filterandDrilldownObjArray));

      // Fetch updated data
      this.onFetchData(this.editDashboardId, this.filterandDrilldownObjArray, scrollPosition);
    }
  }



  onlistboxClearFiltersOld(item: any) {
    // let storedFilterData: any = localStorage.getItem('storedDrilldownAndFilterArray');
    let storedFilterData: any = sessionStorage.getItem('storedDrilldownAndFilterArray');
    const scrollPosition = window.scrollY;

    if (storedFilterData) {
      storedFilterData = JSON.parse(storedFilterData);

      const filterIndex = storedFilterData.filter_obj.findIndex((obj: any) => obj.fieldName !== item.fieldName);

      // // //console.log(filterIndex)
      // // //console.log(storedFilterData)

      if (filterIndex !== -1) {
        storedFilterData.filter_obj.splice(filterIndex, 1);
        this.selectedItemsMap[item.id] = [];

        // // //console.log(storedFilterData)

        this.loaderService.show()
        this.cdr.detectChanges();
        // localStorage.setItem('storedDrilldownAndFilterArray', JSON.stringify(storedFilterData));
        sessionStorage.setItem('storedDrilldownAndFilterArray', JSON.stringify(storedFilterData));
        this.onFetchData(this.editDashboardId, storedFilterData, scrollPosition);


      } else {
        //  // //console.log(`No filter found for item.id ${item.id}`);

      }

    } else {
      // // //console.log('No stored filters available.');
    }
  }

  onlistboxClearFilters(item: any) {
    // let storedFilterData: any = localStorage.getItem('storedDrilldownAndFilterArray');
    let storedFilterData: any = sessionStorage.getItem('storedDrilldownAndFilterArray');
    const scrollPosition = window.scrollY;

    if (storedFilterData) {
      storedFilterData = JSON.parse(storedFilterData);

      // First, find the index of the object where the id matches
      const filterIndex = storedFilterData.filter_obj.findIndex((obj: any) => obj.id === item.id);

      if (filterIndex !== -1) {
        // Remove the filter object with the matching id from the array
        storedFilterData.filter_obj.splice(filterIndex, 1);

        // Clear selected items for this id
        this.selectedItemsMap[item.id] = [];
        // this.inputBoxTags[item.id] = [];
        // this.inputBoxText[item.id] = '';        //////console.log('Updated storedFilterData:', storedFilterData);

        // Update the localStorage with the modified filter data
        // localStorage.setItem('storedDrilldownAndFilterArray', JSON.stringify(storedFilterData));
        sessionStorage.setItem('storedDrilldownAndFilterArray', JSON.stringify(storedFilterData));

        this.onFetchData(this.editDashboardId, storedFilterData, scrollPosition);

        //////console.log(`Filter with id ${item.id} has been removed.`);
      } else {
        // //console.log(`No filter found for item.id ${item.id}`, storedFilterData);
        sessionStorage.setItem('storedDrilldownAndFilterArray', JSON.stringify(storedFilterData));
        // this.inputBoxTags[item.id] = [];
        // this.inputBoxText[item.id] = '';
        this.onFetchData(this.editDashboardId, storedFilterData, scrollPosition);
      }
    } else {
      //////console.log('No stored filters available.');
    }
  }


  applyGlobalFilter() {
    // let storedFilterData = localStorage.getItem('storedDrilldownAndFilterArray');
    let storedFilterData = sessionStorage.getItem('storedDrilldownAndFilterArray');
    const scrollPosition = window.scrollY;

    if (storedFilterData) {
      storedFilterData = JSON.parse(storedFilterData);
      //////console.log('storedFilterData', storedFilterData)
      // this.loaderService.show()
      this.onFetchData(this.editDashboardId, storedFilterData, scrollPosition);
    }
  }



  onDateRangePickerChange(event: any, item: any): void {
    let selectedValues = event.value;
    this.selectDateFromDate = selectedValues;
    const scrollPosition = window.scrollY;

    let matchedItemObj = this.panelSeriesArray.find((ele: any) => ele.id === item.id);

    if (matchedItemObj) {
      const formattedDates = selectedValues.map((date: any) => {
        return this.datePipe.transform(date, matchedItemObj.content.dateFormat);
      });

      this.selectedDateRanges[item.id] = formattedDates;


      // const filterIndex = this.filterandDrilldownObjArray.filter_obj.findIndex(
      //   (obj: any) => obj.field_name === matchedItemObj.content.fieldDetails.fieldName
      // );

      const filterIndex = this.filterandDrilldownObjArray.filter_obj.findIndex(
        (obj: any) =>
          obj.field_name === matchedItemObj.content.fieldDetails.fieldName &&
          obj.table_name === matchedItemObj.content.tableName
      );

      let filterObj = {
        id: matchedItemObj.id,
        field_name: matchedItemObj.content.fieldDetails.fieldName,
        label_name: matchedItemObj.content.fieldDetails.labelName,
        table_name: matchedItemObj.content.tableName,
        values: [...formattedDates],
        object_type: "dateRangePicker",
        date_format: matchedItemObj.content.dateFormat,
        isInitialFilter: matchedItemObj.content.isInitialFilter
      };

      //// //console.log('filterObj', filterObj)

      if (filterIndex !== -1) {
        this.filterandDrilldownObjArray.filter_obj[filterIndex].values = [...formattedDates];

        //// //console.log('  this.filterandDrilldownObjArray in if condition', this.filterandDrilldownObjArray)
      } else {
        this.filterandDrilldownObjArray.filter_obj.push(filterObj);
        //// //console.log('  this.filterandDrilldownObjArray in else condition', this.filterandDrilldownObjArray)

      }

      this.filterandDrilldownObjArray = {
        filter_obj: this.filterandDrilldownObjArray.filter_obj ? this.filterandDrilldownObjArray.filter_obj : [],
        drilldown_obj: this.filterandDrilldownObjArray.drilldown_obj ? this.filterandDrilldownObjArray.drilldown_obj : [],
        disabled_filterObj: this.filterandDrilldownObjArray.disabled_filterObj ? this.filterandDrilldownObjArray.disabled_filterObj : [],
        drilldown_table_obj: this.filterandDrilldownObjArray.drilldown_table_obj ? this.filterandDrilldownObjArray.drilldown_table_obj : [],


      };

      console.log('Updated filterandDrilldownObjArray after date change:', this.filterandDrilldownObjArray);
      //// //console.log("Filter Obj to store", this.filterandDrilldownObjArray);
      // localStorage.setItem('storedDrilldownAndFilterArray', JSON.stringify(this.filterandDrilldownObjArray));
      sessionStorage.setItem('storedDrilldownAndFilterArray', JSON.stringify(this.filterandDrilldownObjArray));

      this.onFetchData(this.editDashboardId, this.filterandDrilldownObjArray, scrollPosition);
    }
  }


  onReturnBackClick(item: any) {

    // this.loaderService.show()
    const scrollPosition = window.scrollY;


    // let storedDrilldownAndFilterstr = localStorage.getItem('storedDrilldownAndFilterArray');
    let storedDrilldownAndFilterstr = sessionStorage.getItem('storedDrilldownAndFilterArray');
    this.filterandDrilldownObjArray = storedDrilldownAndFilterstr ? JSON.parse(storedDrilldownAndFilterstr) : { filter_obj: [], drilldown_obj: [], disabled_filterObj: [], drilldown_table_obj: [] }


    // this.selectedItems = []
    // this.selectedItemsMap[item.id] = [];


    const matchedObjs = this.filterandDrilldownObjArray.drilldown_obj.filter((obj: {}) => {
      //////console.log('Object.keys(obj)', Object.keys(obj))
      return Object.keys(obj).includes(item.id);
    });
    // //console.log('matchedObjs', matchedObjs)



    if (matchedObjs.length > 0) {

      const maxObj = matchedObjs.reduce((prev: { [x: string]: number; }, curr: { [x: string]: number; }) => {
        return curr[item.id] > prev[item.id] ? curr : prev;
      });
      //////console.log('maxObj', maxObj)
      const maxValue = maxObj[item.id];
      //////console.log('maxValue', maxValue)

      const maxIndex = this.filterandDrilldownObjArray.drilldown_obj.findIndex((obj: any) => {
        return obj[item.id] === maxValue;
      });
      // //console.log('maxIndex', maxIndex)

      this.filterandDrilldownObjArray.filter_obj = this.filterandDrilldownObjArray.filter_obj.filter((ele: any) => ele.level !== maxIndex);

      if (maxIndex === 0) {

        this.filterandDrilldownObjArray.drilldown_obj = [];
        //////console.log('chartLevels before making 0', this.chartLevels)
        this.chartLevels[item.id] = 0;

        //////console.log('chartLevels before after 0', this.chartLevels)

        this.drilldownFlag = false;
        // localStorage.setItem('storedDrilldownAndFilterArray', JSON.stringify(this.filterandDrilldownObjArray));
        sessionStorage.setItem('storedDrilldownAndFilterArray', JSON.stringify(this.filterandDrilldownObjArray));

        this.onFetchData(this.editDashboardId, this.filterandDrilldownObjArray, scrollPosition);

        return
      }

      this.filterandDrilldownObjArray.drilldown_obj.splice(maxIndex, 1);

      // //console.log('filter drilldown obj', this.filterandDrilldownObjArray)
      // //console.log('filter drilldown obj chartLevels' , this.chartLevels)


      // localStorage.setItem('storedDrilldownAndFilterArray', JSON.stringify(this.filterandDrilldownObjArray));
      sessionStorage.setItem('storedDrilldownAndFilterArray', JSON.stringify(this.filterandDrilldownObjArray));

      this.onFetchData(this.editDashboardId, this.filterandDrilldownObjArray, scrollPosition);



    } else {

      this.chartLevels = {}

      this.filterandDrilldownObjArray.filter_obj = this.filterandDrilldownObjArray.filter_obj.filter((ele: any) => ele.id !== item.id);

      // localStorage.setItem('storedDrilldownAndFilterArray', JSON.stringify(this.filterandDrilldownObjArray));
      sessionStorage.setItem('storedDrilldownAndFilterArray', JSON.stringify(this.filterandDrilldownObjArray));

      this.onFetchData(this.editDashboardId, this.filterandDrilldownObjArray, scrollPosition);

    }

  }

  onchartDrillUp1(item: any) {

    let storedDrilldownAndFilterstr = sessionStorage.getItem('storedDrilldownAndFilterArray');
    this.filterandDrilldownObjArray = storedDrilldownAndFilterstr ? JSON.parse(storedDrilldownAndFilterstr) : { filter_obj: [], drilldown_obj: [], disabled_filterObj: [], drilldown_table_obj: [] }
    const scrollPosition = window.scrollY;


    let matchedItemObj = this.panelSeriesArray.find((ele: any) => ele.id === item.id);

    // this.loaderService.show();

    // //console.log('chartlevels', this.chartLevels);
    // //console.log('filtered array ' , this.filterandDrilldownObjArray);

    if (matchedItemObj) {

      let currentLevel = this.chartLevels[item.id] || 0;

      // console.log('this.tableLevels', this.tableLevels, 'chartlevels', this.chartLevels)


      let dimensionLevels = matchedItemObj.content.dimension ? matchedItemObj.content.dimension.levels : [];
      let maxLevel = dimensionLevels.length;

      let drilldownsForId = this.filterandDrilldownObjArray.drilldown_obj.filter(
        (drilldown: any) => drilldown[item.id] !== undefined
      );

      // console.log('drilldownsForId', drilldownsForId)


      if (currentLevel > 0) {
        this.chartLevels[item.id] = currentLevel - 1;

        // Remove the item from drilldown_table_obj
        let drilldownTableObjIndex = this.filterandDrilldownObjArray.drilldown_obj.findIndex((obj: any) => obj[item.id] !== undefined);

        if (drilldownTableObjIndex !== -1) {
          this.filterandDrilldownObjArray.drilldown_obj.splice(drilldownTableObjIndex, 1);
        }


        // Step 3: Remove the item from filter_obj
        let filterObjIndex = this.filterandDrilldownObjArray.filter_obj.findIndex((obj: any) => obj.id === item.id);
        if (filterObjIndex !== -1) {
          this.filterandDrilldownObjArray.filter_obj.splice(filterObjIndex, 1);
        }

        // console.log('filtered array', this.filterandDrilldownObjArray);
        // console.log('this.tableLevels', this.tableLevels, 'chartlevels', this.chartLevels)

        // Update the session storage with the modified filterandDrilldownObjArray
        sessionStorage.setItem('storedDrilldownAndFilterArray', JSON.stringify(this.filterandDrilldownObjArray));

        // Fetch data with the updated filter and drilldown objects
        this.onFetchData(this.editDashboardId, this.filterandDrilldownObjArray, scrollPosition);

      } else {
        this.drilldownFlag = false
      }
    }


  }

  onchartDrillUp(item: any) {
    let storedDrilldownAndFilterstr = sessionStorage.getItem('storedDrilldownAndFilterArray');
    const scrollPosition = window.scrollY;


    // console.log('=====================================================================')
    this.filterandDrilldownObjArray = storedDrilldownAndFilterstr ? JSON.parse(storedDrilldownAndFilterstr) : { filter_obj: [], drilldown_obj: [], disabled_filterObj: [], drilldown_table_obj: [] };

    let matchedItemObj = this.panelSeriesArray.find((ele: any) => ele.id === item.id);

    // this.loaderService.show();

    //// //console.log('chartlevels', this.chartLevels);
    //// //console.log('filtered array ', this.filterandDrilldownObjArray);

    if (matchedItemObj) {
      let currentLevel = this.chartLevels[item.id] || 0;

      //// console.log('this.tableLevels', this.tableLevels, 'chartlevels', this.chartLevels);

      let dimensionLevels = matchedItemObj.content.dimension ? matchedItemObj.content.dimension.levels : [];
      let maxLevel = dimensionLevels.length;

      let drilldownsForId = this.filterandDrilldownObjArray.drilldown_obj.filter(
        (drilldown: any) => drilldown[item.id] !== undefined
      );

      // console.log('drilldownsForId', dimensionLevels);

      if (currentLevel > 0) {
        this.chartLevels[item.id] = currentLevel - 1;

        // Find the drilldown object with the maximum value for the given id
        let maxDrilldownValue = -1;
        let maxDrilldownIndex = -1;

        drilldownsForId.forEach((drilldown: any, index: number) => {
          if (drilldown[item.id] > maxDrilldownValue) {
            maxDrilldownValue = drilldown[item.id];
            maxDrilldownIndex = index;
          }
        });

        // Remove the drilldown object with the maximum value
        if (maxDrilldownIndex !== -1) {
          this.filterandDrilldownObjArray.drilldown_obj.splice(maxDrilldownIndex, 1);
        }

        // Find the filter object with the maximum level for the given id
        let filtersForId = this.filterandDrilldownObjArray.filter_obj.filter(
          (filter: any) => filter.id === item.id
        );

        // console.log('filtersForId', filtersForId)

        let maxFilterLevel = -1;
        let maxFilterIndex = -1;
        // //console.log('maxFilterIndex', maxFilterIndex)


        filtersForId.forEach((filter: any, index: number) => {
          if (filter.level > maxFilterLevel) {
            maxFilterLevel = filter.level;
            maxFilterIndex = index;
          }
        });



        //   if (maxFilterIndex !== -1) {

        //     this.filterandDrilldownObjArray.filter_obj = this.filterandDrilldownObjArray.filter_obj.filter(
        //         (filter: any) => {
        //             // Check if filter.id matches item.id
        //             if (filter.id !== item.id) return true;

        //             // Find the matching dimension object
        //             let matchedDimension = dimensionLevels.find((obj: any) => obj.
        //             fieldName
        //              == filter.
        //              field_name
        //              );

        //             // If no matching dimension found, keep the filter
        //             if (!matchedDimension) return true;

        //             // If level matches, remove this filter
        //             return filter.level !== matchedDimension.level;
        //         }
        //     );
        // }


        if (maxFilterIndex !== -1) {
          this.filterandDrilldownObjArray.filter_obj = this.filterandDrilldownObjArray.filter_obj.filter(
            (filter: any) => {
              // Keep filters that don't match item.id
              if (filter.id !== item.id) return true;

              // Find the highest-level drilldown value for this ID
              let maxDrilldownValue = Math.max(...drilldownsForId.map((d: any) => d[item.id]));

              // Remove only the filter object that has this max drilldown level
              return filter.level !== maxDrilldownValue - 1;
            }
          );
        }



        // Update the session storage with the modified filterandDrilldownObjArray
        sessionStorage.setItem('storedDrilldownAndFilterArray', JSON.stringify(this.filterandDrilldownObjArray));
        // console.log('=====================================================================')

        // Fetch data with the updated filter and drilldown objects
        this.onFetchData(this.editDashboardId, this.filterandDrilldownObjArray, scrollPosition);
      } else {
        this.drilldownFlag = false;
      }
    }
  }


  onTableDrillUpClick(item: any) {
    // Step 1: Retrieve stored drilldown and filter data from sessionStorage
    let storedDrilldownAndFilterstr = sessionStorage.getItem('storedDrilldownAndFilterArray');


    this.filterandDrilldownObjArray = storedDrilldownAndFilterstr ? JSON.parse(storedDrilldownAndFilterstr) : { filter_obj: [], drilldown_obj: [], disabled_filterObj: [], drilldown_table_obj: [] };

    // console.log('storedDrilldownAndFilterstr',  this.filterandDrilldownObjArray )

    const scrollPosition = window.scrollY;

    // Step 2: Find the matched item in panelSeriesArray
    let matchedItemObj = this.panelSeriesArray.find((ele: any) => ele.id === item.id);

    // console.log('matchedItemObj', matchedItemObj)


    if (matchedItemObj) {
      // Step 3: Get the current level of the item
      let currentLevel = this.tableLevels[item.id] || 0;

      // Step 4: Get the dimension levels for the item
      let dimensionLevels = matchedItemObj.content.dimension ? matchedItemObj.content.dimension.levels : [];
      let maxLevel = dimensionLevels.length;

      // Step 5: Find all drilldown objects for the item
      let drilldownsForId = this.filterandDrilldownObjArray.drilldown_table_obj.filter(
        (drilldown: any) => drilldown[item.id] !== undefined
      );

      // console.log('drilldownsForId', drilldownsForId);
      // console.log('currentLevel', currentLevel);
      // console.log('maxLevel', maxLevel);


      // Step 6: Check if the current level is greater than 0 (can drill up)
      if (currentLevel > 0) {
        // Step 7: Decrement the level
        this.tableLevels[item.id] = currentLevel - 1;

        // console.log('this.tableLevels', this.tableLevels)

        // // Step 8: Find the drilldown object with the maximum value for the given id
        // let maxDrilldownValue = -1;
        // let maxDrilldownIndex = -1;

        // drilldownsForId.forEach((drilldown: any, index: number) => {
        //   if (drilldown[item.id] > maxDrilldownValue) {
        //     maxDrilldownValue = drilldown[item.id];
        //     maxDrilldownIndex = index;
        //   }
        // });

        // // Step 9: Remove the drilldown object with the maximum value
        // if (maxDrilldownIndex !== -1) {
        //   this.filterandDrilldownObjArray.drilldown_table_obj.splice(maxDrilldownIndex, 1);
        // }

        let maxDrilldownLevel = -1;
        let drilldownToRemove: any = null;

        this.filterandDrilldownObjArray.drilldown_table_obj.forEach((drilldown: any) => {
          if (drilldown[item.id] !== undefined && drilldown[item.id] > maxDrilldownLevel) {
            maxDrilldownLevel = drilldown[item.id];
            drilldownToRemove = drilldown;
          }
        });

        if (drilldownToRemove) {
          const indexToRemove = this.filterandDrilldownObjArray.drilldown_table_obj.indexOf(drilldownToRemove);
          if (indexToRemove !== -1) {
            this.filterandDrilldownObjArray.drilldown_table_obj.splice(indexToRemove, 1);
          }
        }
        // console.log('filtered array', this.filterandDrilldownObjArray);

        // Step 10: Find all filter objects for the item
        let filtersForId = this.filterandDrilldownObjArray.filter_obj.filter(
          (filter: any) => filter.id === item.id
        );

        // console.log('filtersForId', filtersForId)

        // Step 11: Find the filter object with the maximum level for the given id
        // let maxFilterLevel = -1;
        // let maxFilterIndex = -1;

        // filtersForId.forEach((filter: any, index: number) => {
        //   console.log('filter', filter)
        //   if (filter.level > maxFilterLevel) {
        //     maxFilterLevel = filter.level;
        //     maxFilterIndex = index;
        //   }
        // });
        // console.log('maxFilterIndex in filtersForId', maxFilterIndex, maxFilterLevel)

        // // Step 12: Remove the filter object with the maximum level
        // if (maxFilterIndex !== -1) {
        //   this.filterandDrilldownObjArray.filter_obj.splice(maxFilterIndex, 1);
        // }

        // Step 11: Find the filter object with the maximum level for the given id
        let maxFilterLevel = -1;
        let filterToRemove: any = null;

        this.filterandDrilldownObjArray.filter_obj.forEach((filter: any) => {
          if (filter.id === item.id && filter.level !== undefined) {
            if (filter.level > maxFilterLevel) {
              maxFilterLevel = filter.level;
              filterToRemove = filter;
            }
          }
        });

        // Step 12: Remove the matched filter from filter_obj
        if (filterToRemove) {
          const indexToRemove = this.filterandDrilldownObjArray.filter_obj.indexOf(filterToRemove);
          if (indexToRemove !== -1) {
            this.filterandDrilldownObjArray.filter_obj.splice(indexToRemove, 1);
          }
        }

        // console.log('filtered array after removing table', this.filterandDrilldownObjArray);

        //console.log('maxfilterIndex in table', maxFilterIndex)

        //   if (maxFilterIndex !== -1) {
        //     // Get the dimension array from matchedItemObj
        //   //  let dimensionArray = matchedItemObj.content.dimension ? matchedItemObj.content.dimension.levels : [];

        //     // Remove only the filter objects that match all conditions
        //     this.filterandDrilldownObjArray.filter_obj = this.filterandDrilldownObjArray.filter_obj.filter(
        //         (filter: any) => {
        //           //console.log('filter', filter)
        //           //console.log('dimensionLevels', dimensionLevels)
        //             // Check if filter.id matches item.id
        //             if (filter.id !== item.id) return true;

        //             // Find the matching dimension object
        //             let matchedDimension = dimensionLevels.find((obj: any) => obj.
        //             fieldName
        //              == filter.
        //              field_name
        //              );

        //              //console.log('matchedDimension', matchedDimension)
        //             // If no matching dimension found, keep the filter
        //             if (!matchedDimension) return true;

        //             // If level matches, remove this filter
        //             return filter.level !== matchedDimension.level;
        //         }
        //     );
        // }


        //  console.log('filtered array', this.filterandDrilldownObjArray);
        //  //console.log('this.tableLevels', this.tableLevels);

        // Step 13: Update sessionStorage with the modified filterandDrilldownObjArray
        sessionStorage.setItem('storedDrilldownAndFilterArray', JSON.stringify(this.filterandDrilldownObjArray));
        // Step 13: Update sessionStorage with the modified filterandDrilldownObjArray
        sessionStorage.setItem('storedDrilldownAndFilterArray', JSON.stringify(this.filterandDrilldownObjArray));

        // Step 14: Fetch data with the updated filter and drilldown objects
        this.onFetchData(this.editDashboardId, this.filterandDrilldownObjArray, scrollPosition);
      } else {
        // Step 15: If already at the base level, set the drilldown flag to false
        this.tableDrilldownLevelFlag = false;
        // //console.log('Already at the base level, cannot drill up further.');
      }
    } else {
      // //console.log('Item not found in panelSeriesArray.');
    }
  }

  getRandomLightColor() {
    const r = Math.floor(Math.random() * 156 + 100);  // Values between 100-255 to ensure light color
    const g = Math.floor(Math.random() * 156 + 100);
    const b = Math.floor(Math.random() * 156 + 100);
    return `rgb(${r}, ${g}, ${b})`;
  }

  OnDrillup() {

    // this.loaderService.show()
    const scrollPosition = window.scrollY;

    // let storedDrilldownAndFilterstr = localStorage.getItem('storedDrilldownAndFilterArray');
    let storedDrilldownAndFilterstr = sessionStorage.getItem('storedDrilldownAndFilterArray');
    this.filterandDrilldownObjArray = storedDrilldownAndFilterstr
      ? JSON.parse(storedDrilldownAndFilterstr)
      : { filter_obj: [], drilldown_obj: [], disabled_filterObj: [], drilldown_table_obj: [] };

    //////console.log('localstorage data before', this.filterandDrilldownObjArray);
    //////console.log('this.chartLevels', this.chartLevels);
    //////console.log('this.selectedItemsMap', this.selectedItemsMap);


    if (this.filterandDrilldownObjArray.drilldown_obj.length > 0) {
      const removedDrilldown = this.filterandDrilldownObjArray.drilldown_obj.pop();

      //////console.log('removedDrilldown', removedDrilldown)

      const keyToRemove = Object.keys(removedDrilldown)[0];

      //////console.log('keyToRemove', keyToRemove)

      this.filterandDrilldownObjArray.filter_obj = this.filterandDrilldownObjArray.filter_obj.filter(
        (filterObj: any) => filterObj.id !== keyToRemove
      );

      //////console.log(' this.filterandDrilldownObjArray.filter_obj', this.filterandDrilldownObjArray.filter_obj)

      //////console.log('this.chartLevels', this.chartLevels)

      delete this.chartLevels[keyToRemove];
    }

    this.onFetchData(this.editDashboardId, this.filterandDrilldownObjArray, scrollPosition);
    // localStorage.setItem('storedDrilldownAndFilterArray', JSON.stringify(this.filterandDrilldownObjArray));
    sessionStorage.setItem('storedDrilldownAndFilterArray', JSON.stringify(this.filterandDrilldownObjArray));


  }


  selectDatePickerFromDate: any
  selectedDateObject: { [key: string]: any } = {};

  selectSceduleDateFilter: any = new Date();
  // old code
  // ondatePickerFIlterChange(eve: any, item: any) {
  //   let selectValue = eve.value;
  //   const scrollPosition = window.scrollY;
  //   console.log('selectValue', selectValue);

  //   this.selectSceduleDateFilter = selectValue ? selectValue : new Date()

  //   // this.loaderService.show()

  //   let matchedItemObj = this.panelSeriesArray.find((ele: any) => ele.id === item.id);

  //   if (matchedItemObj) {
  //     const formattedDates = this.datePipe.transform(selectValue, matchedItemObj.content.dateFormat);

  //     this.selectDatePickerFromDate = formattedDates;

  //     this.selectedDateObject[item.id] = formattedDates;

  //     // old code 
  //     // const filterIndex = this.filterandDrilldownObjArray.filter_obj.findIndex(
  //     //   (obj: any) => obj.field_name === matchedItemObj.content.fieldName
  //     // );

  //     const filterIndex = this.filterandDrilldownObjArray.filter_obj.findIndex(
  //       (obj: any) =>
  //         obj.field_name === matchedItemObj.content.fieldName &&
  //         obj.table_name === matchedItemObj.content.tableName
  //     );




  //     let originalObj = {
  //       "id": matchedItemObj.id,
  //       "field_name": matchedItemObj.content.fieldName,
  //       "label_name": matchedItemObj.content.labelName,
  //       "values": formattedDates,
  //       "table_name": matchedItemObj.content.tableName,
  //       "object_type": "datePicker",
  //       "date_format": matchedItemObj.content.dateFormat,
  //       "isInitialFilter": false
  //     }

  //     if (filterIndex !== -1) {
  //       // Replace the old value with the new value
  //       this.filterandDrilldownObjArray.filter_obj[filterIndex].values = formattedDates;

  //     } else {
  //       // Add new filter object
  //       this.filterandDrilldownObjArray.filter_obj.push(originalObj);

  //     }

  //     this.filterandDrilldownObjArray = {
  //       filter_obj: this.filterandDrilldownObjArray.filter_obj ? this.filterandDrilldownObjArray.filter_obj : [],
  //       drilldown_obj: this.filterandDrilldownObjArray.drilldown_obj ? this.filterandDrilldownObjArray.drilldown_obj : [],
  //       disabled_filterObj: this.filterandDrilldownObjArray.disabled_filterObj ? this.filterandDrilldownObjArray.disabled_filterObj : [],
  //       //       ,
  //       drilldown_table_obj: this.filterandDrilldownObjArray.drilldown_table_obj ? this.filterandDrilldownObjArray.drilldown_table_obj : [],

  //     };
  //     sessionStorage.setItem('storedDrilldownAndFilterArray', JSON.stringify(this.filterandDrilldownObjArray));
  //     this.onFetchData(this.editDashboardId, this.filterandDrilldownObjArray, scrollPosition);

  //   }
  // }
  // new code
  ondatePickerFIlterChange(eve: any, item: any) {
    const selectValue = eve.value;
    const scrollPosition = window.scrollY;

    this.selectSceduleDateFilter = selectValue || new Date();

    const matchedItemObj = this.panelSeriesArray.find((ele: any) => ele.id === item.id);
    if (!matchedItemObj) return;

    // Ã¢Å“â€¦ Format date - handles Date objects, strings, and invalid dates
    const formattedDate = this.datePipe.transform(
      selectValue || new Date(),
      'yyyy-MM-dd'
    );

    // Ã¢Å“â€¦ Safety check: if formatting fails, skip API call
    if (!formattedDate) {
      console.error('Invalid date selected');
      return;
    }

    this.selectDatePickerFromDate = formattedDate;
    this.selectedDateObject[item.id] = formattedDate;

    // Find or create filter
    const filterIndex = this.filterandDrilldownObjArray.filter_obj.findIndex(
      (obj: any) => obj.field_name === matchedItemObj.content.fieldName &&
        obj.table_name === matchedItemObj.content.tableName
    );

    const filterObj = {
      id: matchedItemObj.id,
      field_name: matchedItemObj.content.fieldName,
      label_name: matchedItemObj.content.labelName,
      values: formattedDate,
      table_name: matchedItemObj.content.tableName,
      object_type: "datePicker",
      date_format: 'yyyy-MM-dd',
      isInitialFilter: false
    };

    // Update or add filter
    if (filterIndex !== -1) {
      this.filterandDrilldownObjArray.filter_obj[filterIndex].values = formattedDate;
    } else {
      this.filterandDrilldownObjArray.filter_obj.push(filterObj);
    }

    // Update and save
    this.filterandDrilldownObjArray = {
      filter_obj: this.filterandDrilldownObjArray.filter_obj || [],
      drilldown_obj: this.filterandDrilldownObjArray.drilldown_obj || [],
      disabled_filterObj: this.filterandDrilldownObjArray.disabled_filterObj || [],
      drilldown_table_obj: this.filterandDrilldownObjArray.drilldown_table_obj || []
    };

    sessionStorage.setItem('storedDrilldownAndFilterArray', JSON.stringify(this.filterandDrilldownObjArray));
    this.onFetchData(this.editDashboardId, this.filterandDrilldownObjArray, scrollPosition);
  }

  updateChipTexts() {
    this.chipTexts = this.filterandDrilldownObjArray.filter_obj.map((item: any) => this.getChipText(item));
    //////console.log(this.chipTexts)
  }




  ondropdownFilter(args: any, item: any) {
    const scrollPosition = window.scrollY;

    // this.loaderService.show()

    if (args.value === null) {
      this.loaderService.hide()
      return; // Early exit if no value is selected
    } else {
      let matchedPanelObj = this.panelSeriesArray.find((ele: any) => ele.id === item.id);

      if (matchedPanelObj) {
        const selectedValue = args.value;
        let fieldDetailsObj = matchedPanelObj.content.fieldDetails;

        this.selectedDropdownValue = selectedValue;
        this.selectedDropdownValuesObj[item.id] = Array.isArray(selectedValue) ? [...selectedValue] : [selectedValue];

        // old code 
        // const filterIndex = this.filterandDrilldownObjArray.filter_obj.findIndex(
        //   (obj: any) => obj.field_name === matchedPanelObj.content.fieldDetails.fieldName
        // );


        const filterIndex = this.filterandDrilldownObjArray.filter_obj.findIndex(
          (obj: any) =>
            obj.field_name === matchedPanelObj.content.fieldDetails.fieldName &&
            obj.table_name === matchedPanelObj.content.tableName
        );




        const originalObject = {
          field_name: fieldDetailsObj.fieldName,
          label_name: fieldDetailsObj.labelName,
          table_name: matchedPanelObj.content.tableName,
          values: [selectedValue],
          object_type: "DropdownList",
          date_format: '',
          id: matchedPanelObj.id,
          isInitialFilter: false,
        };

        if (filterIndex !== -1) {
          this.filterandDrilldownObjArray.filter_obj[filterIndex].values = [selectedValue];
        } else {
          this.filterandDrilldownObjArray.filter_obj.push(originalObject);
        }

        if (!this.filterandDrilldownObjArray.disabled_filterObj) {
          this.filterandDrilldownObjArray.disabled_filterObj = [];
        }

        const selectedValues_dataSource = item.content.selectedValues_dataSource; // Assuming this is where 
        const filteredValues = originalObject.values.filter(value => !selectedValues_dataSource.includes(value));
        console.log('filteredValues', filteredValues);

        if (filteredValues.length > 0) {


          // old code with fieldname match only
          // const disabledFilterIndex = this.filterandDrilldownObjArray.disabled_filterObj.findIndex(
          //   (obj: any) => obj.field_name === matchedPanelObj.content.fieldDetails.fieldName
          // );

          const disabledFilterIndex = this.filterandDrilldownObjArray.disabled_filterObj.findIndex(
            (obj: any) =>
              obj.field_name === matchedPanelObj.content.fieldDetails.fieldName &&
              obj.table_name === matchedPanelObj.content.tableName
          );




          const disabledObject = {
            id: matchedPanelObj.id,
            field_name: matchedPanelObj.content.fieldDetails.fieldName,
            label_name: matchedPanelObj.content.fieldDetails.labelName,
            table_name: matchedPanelObj.content.tableName,
            values: filteredValues,
            object_type: "DropdownList",
            date_format: '',
            isInitialFilter: false
          };

          console.log('disabledObject', disabledObject);

          if (disabledFilterIndex !== -1) {
            this.filterandDrilldownObjArray.disabled_filterObj[disabledFilterIndex].values = [...filteredValues];
          } else {
            this.filterandDrilldownObjArray.disabled_filterObj.push(disabledObject);
          }
        }

        this.filterandDrilldownObjArray = {
          filter_obj: this.filterandDrilldownObjArray.filter_obj,
          drilldown_obj: this.filterandDrilldownObjArray.drilldown_obj,
          disabled_filterObj: this.filterandDrilldownObjArray.disabled_filterObj,
          drilldown_table_obj: this.filterandDrilldownObjArray.drilldown_table_obj,
        };

        this.onFetchData(this.editDashboardId, this.filterandDrilldownObjArray, scrollPosition);
        this.filterandDrilldownObjArray = {
          filter_obj: this.filterandDrilldownObjArray.filter_obj,
          drilldown_obj: this.filterandDrilldownObjArray.drilldown_obj,
          disabled_filterObj: this.filterandDrilldownObjArray.disabled_filterObj,
          drilldown_table_obj: this.filterandDrilldownObjArray.drilldown_table_obj,
        };

        sessionStorage.setItem('storedDrilldownAndFilterArray', JSON.stringify(this.filterandDrilldownObjArray));


      }
    }


  }


  onInputBoxString: string = '';
  onInputBoxFilter(event: any, item: any) {
    console.log('event in inputBox', event.target.value);

    let selectedVal = event.target.value;

    // If it's a string with commas, split it into an array
    if (typeof selectedVal === 'string') {
      selectedVal = selectedVal.split(',').map(val => val.trim());
    }
    // If it's already an array, keep as-is
    else if (Array.isArray(selectedVal)) {
      selectedVal = selectedVal.flatMap(val =>
        typeof val === 'string' ? val.split(',').map(v => v.trim()) : val
      );
    }

    // Filter out null, undefined, and empty strings from selected values
    selectedVal = Array.isArray(selectedVal)
      ? selectedVal.filter((val: any) => val !== null && val !== undefined && val !== '')
      : [];

    console.log('selectedVal', selectedVal);

    const matchingObj = this.panelSeriesArray.find((ele: any) => ele.id === item.id);

    // console.log('matching object', matchingObj);
    if (matchingObj) {
      const originalObject = {
        id: matchingObj.id,
        field_name: matchingObj.content.fieldDetails.fieldName,
        label_name: matchingObj.content.fieldDetails.labelName,
        table_name: matchingObj.content.tableName,
        values: Array.isArray(selectedVal) ? selectedVal : [selectedVal], // Ensure values is an array
        object_type: 'InputBox',
        date_format: '',
        isInitialFilter: false
      };

      console.log('originalObject', originalObject);
      // Check if field_name is already present in the filter_obj array
      const existingFieldObjectIndex = this.filterandDrilldownObjArray.filter_obj.findIndex(
        (obj: any) => obj.field_name === matchingObj.content.fieldDetails.fieldName
      );

      // console.log('existingFieldObjectIndex', existingFieldObjectIndex);
      if (existingFieldObjectIndex !== -1) {
        // Field name exists, check and update values
        const existingObject = this.filterandDrilldownObjArray.filter_obj[existingFieldObjectIndex];

        // console.log('existingObject', existingObject);

        // Ensure existingObject.values is an array
        if (!Array.isArray(existingObject.values)) {
          existingObject.values = typeof existingObject.values === 'string' ? [existingObject.values] : [];
        }

        // Filter out values that are no longer selected (and filter out empty strings)
        existingObject.values = existingObject.values.filter((val: any) =>
          selectedVal.includes(val) && val !== null && val !== undefined && val !== ''
        );

        // Add new selected values that are not already present
        selectedVal.forEach((val: any) => {
          if (!existingObject.values.includes(val)) {
            existingObject.values.push(val);
          }
        });

        // Update the selectedItemsMap for UI
        this.selectedItemsMap[item.id] = existingObject.values;

        // If no values are selected, remove the object
        if (existingObject.values.length === 0) {
          this.filterandDrilldownObjArray.filter_obj.splice(existingFieldObjectIndex, 1);
          this.selectedItemsMap[item.id] = [];
        }
      } else {
        // Field name not found, add new object only if there are valid values
        if (selectedVal.length > 0) {
          this.filterandDrilldownObjArray.filter_obj.push(originalObject);
          this.selectedItemsMap[item.id] = originalObject.values;
        } else {
          this.selectedItemsMap[item.id] = [];
        }
      }

      // console.log('this.selectedItemsMap[item.id]', this.selectedItemsMap[item.id]);
      this.filterandDrilldownObjArray = {
        filter_obj: this.filterandDrilldownObjArray.filter_obj,
        drilldown_obj: this.filterandDrilldownObjArray.drilldown_obj,
        disabled_filterObj: this.filterandDrilldownObjArray.disabled_filterObj,
        drilldown_table_obj: this.filterandDrilldownObjArray.drilldown_table_obj,

      };

      sessionStorage.setItem('storedDrilldownAndFilterArray', JSON.stringify(this.filterandDrilldownObjArray));

      // console.log('this.selectedItemsMap[item.id]', this.selectedItemsMap[item.id]);
      // console.log('this.filterandDrilldownObjArray.drilldown_obj', this.filterandDrilldownObjArray.drilldown_obj);

      this.filterandDrilldownObjArray = {
        filter_obj: this.filterandDrilldownObjArray.filter_obj,
        drilldown_obj: this.filterandDrilldownObjArray.drilldown_obj,
        disabled_filterObj: this.filterandDrilldownObjArray.disabled_filterObj,
        drilldown_table_obj: this.filterandDrilldownObjArray.drilldown_table_obj,

      };
    }
  }


  checkIfFilterValueExists(field_name: string, value: any): boolean {
    // let storedDrilldownAr: any = localStorage.getItem('storedDrilldownAndFilterArray');
    let storedDrilldownAr: any = sessionStorage.getItem('storedDrilldownAndFilterArray');


    if (storedDrilldownAr != null) {
      const parsedStoredDrilldownAr = JSON.parse(storedDrilldownAr);
      const storedFilterArray = parsedStoredDrilldownAr.filter_obj;
      return storedFilterArray.some((obj: any) => {
        return obj.field_name === field_name &&
          (obj.values.includes(value) ||
            (Array.isArray(value) && value.every((v: any) => obj.values.includes(v))));
      });
    }

    return false;
  }


  private getPanelArrayDataFromLocalStorage() {
    // let panelData = localStorage.getItem('panelSeriesArray');
    let panelData = sessionStorage.getItem('panelSeriesArray');
    if (panelData !== null) {
      this.panelSeriesArray = JSON.parse(panelData);

    } else {
      this.panelSeriesArray = [];
    }
  }

  chartLevels: { [key: string]: number } = {};


  isParent: boolean = true;



  onChartMouseClick(args: IMouseEventArgs, item: any) {

    // console.log('item in single click event', item)
    // console.log('args in single click event', args)

    if (item.content?.clickType && item.content.clickType !== 'Single') {
      return;
    }
    // if (item.content?.clickType && !['Single', 'Double'].includes(item.content.clickType)) {
    //   return;
    // }
    if (item.content?.enableFilter === false) {
      return;
    }



    let index = indexFinder(args.target);
    const scrollPosition = window.scrollY;

    if (index.point != null && index.series != null && this.isParent) {
      if (!isNaN(index.point) && !isNaN(index.series)) {
        this.isparent = false;

        // this.loaderService.show()

        let newObject = this.panelSeriesArray.find((ele: any) => ele.id == item.id);

        if (newObject) {

          if (!this.chartLevels[item.id]) {
            this.chartLevels[item.id] = 0;
          }
          // // //console.log('newObject', newObject)

          this.drilldownFlag = true;
          this.clickedChartId = newObject.id;
          let dimensionLevels = item.content.dimension.levels;

          let maxLevel = dimensionLevels.length;
          let currentLevel = this.chartLevels[item.id];
          let selectedLevel = dimensionLevels[currentLevel];

          if (selectedLevel) {
            let filteredObj = dimensionLevels.find((ele: any) => ele.level == selectedLevel.level);
            // //console.log('filteredObj', filteredObj)
            let fieldName = filteredObj.fieldName;
            // //console.log('tablename', item.content.tableName)
            let dataSourceArr = item.content.dataSource;
            let filteredData = dataSourceArr.map((data: any) => data[fieldName]).filter((value: any) => value !== undefined && value !== null);

            const selectedValue = filteredData[index.point];

            if (selectedValue !== undefined && selectedValue !== null) {
              let filterEleObj = {
                "id": item.id,
                "field_name": filteredObj.fieldName,
                "label_name": filteredObj.labelName,
                "values": [selectedValue],
                "object_type": "Chart",
                "date_format": "",
                "level": selectedLevel.level,
                "table_name": item.content.tableName,
                isInitialFilter: false
              };


              let filterObjArray = sessionStorage.getItem('storedDrilldownAndFilterArray');

              if (filterObjArray) {
                filterObjArray = JSON.parse(filterObjArray);
                this.filterandDrilldownObjArray = filterObjArray;
              }

              const filterIndex = this.filterandDrilldownObjArray.filter_obj.findIndex(
                (obj: any) => obj.field_name === filterEleObj.field_name
              );

              if (filterIndex !== -1) {
                this.filterandDrilldownObjArray.filter_obj[filterIndex].values = [selectedValue];
              } else {
                this.filterandDrilldownObjArray.filter_obj.push(filterEleObj);
              }

              this.chartLevels[item.id] = (currentLevel + 1 <= maxLevel) ? (currentLevel + 1) : maxLevel;

              selectedLevel = dimensionLevels[this.chartLevels[item.id]];

              let newObj;

              if (selectedLevel != undefined) {
                if (currentLevel + 1 <= maxLevel) {
                  newObj = { [item.id]: selectedLevel.level };
                }
                this.filterandDrilldownObjArray.drilldown_obj.push(newObj);
              } else {
                newObj = { [item.id]: maxLevel };
                this.filterandDrilldownObjArray.drilldown_obj.push(newObj);
              }

              // console.log('filter drilldown obj', this.filterandDrilldownObjArray)
              // console.log('filter drilldown obj chartLevels' , this.chartLevels)
              sessionStorage.setItem('storedDrilldownAndFilterArray', JSON.stringify(this.filterandDrilldownObjArray));

              this.onFetchData(this.editDashboardId, this.filterandDrilldownObjArray, scrollPosition);
            }
          } else {
            this.loaderService.hide()
          }

        }
      }
    }
  }

  chartDoubleClick(args: IMouseEventArgs, item: any) {
    // console.log('item in double click event', item)
    // console.log('args in double click event', args)
    // console.log('item.content?.clickType && item.content.clickType', item.content?.clickType, item.content.clickType !== 'Double')

    // Only proceed if clickType is Double or not specified
    // if (item.content?.clickType && item.content.clickType !== 'Double') {
    //   return;
    // }`

    if (item.content?.clickType !== 'Double') {
      return;
    }

    if (item.content?.enableFilter === false) {
      return;
    }

    let index = indexFinder(args.target);
    const scrollPosition = window.scrollY;

    // console.log('index', index, this.isParent)

    if (index.point != null && index.series != null && this.isParent) {
      if (!isNaN(index.point) && !isNaN(index.series)) {
        this.isparent = false;

        // this.loaderService.show()

        let newObject = this.panelSeriesArray.find((ele: any) => ele.id == item.id);

        if (newObject) {

          if (!this.chartLevels[item.id]) {
            this.chartLevels[item.id] = 0;
          }

          this.drilldownFlag = true;
          this.clickedChartId = newObject.id;
          let dimensionLevels = item.content.dimension.levels;

          let maxLevel = dimensionLevels.length;
          let currentLevel = this.chartLevels[item.id];
          let selectedLevel = dimensionLevels[currentLevel];

          if (selectedLevel) {
            let filteredObj = dimensionLevels.find((ele: any) => ele.level == selectedLevel.level);
            let fieldName = filteredObj.fieldName;
            let dataSourceArr = item.content.dataSource;
            let filteredData = dataSourceArr.map((data: any) => data[fieldName]).filter((value: any) => value !== undefined && value !== null);

            const selectedValue = filteredData[index.point];

            if (selectedValue !== undefined && selectedValue !== null) {
              let filterEleObj = {
                "id": item.id,
                "field_name": filteredObj.fieldName,
                "label_name": filteredObj.labelName,
                "values": [selectedValue],
                "object_type": "Chart",
                "date_format": "",
                "level": selectedLevel.level,
                "table_name": item.content.tableName,
                isInitialFilter: false
              };


              let filterObjArray = sessionStorage.getItem('storedDrilldownAndFilterArray');

              if (filterObjArray) {
                filterObjArray = JSON.parse(filterObjArray);
                this.filterandDrilldownObjArray = filterObjArray;
              }

              const filterIndex = this.filterandDrilldownObjArray.filter_obj.findIndex(
                (obj: any) => obj.field_name === filterEleObj.field_name
              );

              if (filterIndex !== -1) {
                this.filterandDrilldownObjArray.filter_obj[filterIndex].values = [selectedValue];
              } else {
                this.filterandDrilldownObjArray.filter_obj.push(filterEleObj);
              }

              this.chartLevels[item.id] = (currentLevel + 1 <= maxLevel) ? (currentLevel + 1) : maxLevel;

              selectedLevel = dimensionLevels[this.chartLevels[item.id]];

              let newObj;

              if (selectedLevel != undefined) {
                if (currentLevel + 1 <= maxLevel) {
                  newObj = { [item.id]: selectedLevel.level };
                }
                this.filterandDrilldownObjArray.drilldown_obj.push(newObj);
              } else {
                newObj = { [item.id]: maxLevel };
                this.filterandDrilldownObjArray.drilldown_obj.push(newObj);
              }
              sessionStorage.setItem('storedDrilldownAndFilterArray', JSON.stringify(this.filterandDrilldownObjArray));

              this.onFetchData(this.editDashboardId, this.filterandDrilldownObjArray, scrollPosition);
            }
          } else {
            this.loaderService.hide()
          }

        }
      }
    }
  }


  load(args: ILoadedEventArgs): void {
    if (args.chart && args.chart.zoomModule) {
      args.chart.zoomModule.isZoomed = true;
    }
  }






  removeItem(item: any, index: number) {
    const scrollPosition = window.scrollY;

    // console.log('item', item, 'index', index)

    // this.loaderService.show()

    let storedDrilldownAndFilterstr = sessionStorage.getItem('storedDrilldownAndFilterArray');

    this.filterandDrilldownObjArray = storedDrilldownAndFilterstr ? JSON.parse(storedDrilldownAndFilterstr) : { filter_obj: [], drilldown_obj: [], disabled_filterObj: [], drilldown_table_obj: [] }
    // console.log("this.filterandDrilldownObjArray", this.filterandDrilldownObjArray)

    const removedItem = this.filterandDrilldownObjArray.filter_obj[index];
    // console.log("this.removedItem", removedItem)

    if (removedItem && removedItem.id) {
      // Remove the corresponding entry from selectedDateRanges
      delete this.selectedDateRanges[removedItem.id];
      delete this.selectedDateObject[removedItem.id];
      delete this.selectedDropdownValuesObj[removedItem.id];
      //delete this.selectedItemsMap[removedItem.id];
      this.selectedItemsMap[removedItem.id] = [];

    }
    // console.log("this.selectedDropdownValuesObj", this.selectedDropdownValuesObj)
    // console.log("this.selectedDateObject", this.selectedDateObject)
    // console.log("this.selectedDateRanges", this.selectedDateRanges)
    // console.log("this.selectedItemsMap", this.selectedItemsMap)
    if (index !== -1) {
      this.filterandDrilldownObjArray.filter_obj.splice(index, 1);

    }

    if (this.filterandDrilldownObjArray.filter_obj.length === 0) {
      this.defaultDialog1.hide();

    }

    this.defaultDialog1.hide();


    this.filterandDrilldownObjArray = {
      "filter_obj": this.filterandDrilldownObjArray.filter_obj ? this.filterandDrilldownObjArray.filter_obj : [],
      "drilldown_obj": this.filterandDrilldownObjArray.drilldown_obj ? this.filterandDrilldownObjArray.drilldown_obj : [],
      "disabled_filterObj": this.filterandDrilldownObjArray.disabled_filterObj ? this.filterandDrilldownObjArray.disabled_filterObj : [],
      "drilldown_table_obj": this.filterandDrilldownObjArray.drilldown_table_obj ? this.filterandDrilldownObjArray.drilldown_table_obj : []

    };

    // console.log("Filter Object", this.filterandDrilldownObjArray)

    if (this.filterandDrilldownObjArray.drilldown_obj.length === 0) {
      this.drilldownFlag = false;
      this.chartLevels = {};
    }
    // localStorage.setItem('storedDrilldownAndFilterArray', JSON.stringify(this.filterandDrilldownObjArray));
    sessionStorage.setItem('storedDrilldownAndFilterArray', JSON.stringify(this.filterandDrilldownObjArray));

    this.onFetchData(this.editDashboardId, this.filterandDrilldownObjArray, scrollPosition);

  }


  ngOnDestroy(): void {

    if (this.titleSubscription) {
      this.titleSubscription.unsubscribe();
    }
    this.chartService.setTitle('');


    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }


    if (this.routerEventsSub) {
      this.routerEventsSub.unsubscribe();
    }

    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }

    if (this.chartRefreshTimer) {
      clearTimeout(this.chartRefreshTimer);
    }
    if (this.chartRefreshRetryTimers.length > 0) {
      this.chartRefreshRetryTimers.forEach((timerRef) => clearTimeout(timerRef));
      this.chartRefreshRetryTimers = [];
    }

    Object.values(this.pivotHeaderFormattingTimers).forEach((timerRef: any) => clearTimeout(timerRef));
    this.pivotHeaderFormattingTimers = {};
    this.pivotTimeFieldsCache = {};
    this.pivotValueFormatFieldsCache = {};
    this.pivotLightModeCache = {};


    this.gaugeResizeObservers.forEach(observer => observer.disconnect());
    this.gaugeResizeObservers.clear();

  }
  markdownContent: any = {};
  isMarkdownLoading: boolean = false;
  selectedELement: any;


  submitMarkdownPrompt() {
    // console.log('Markdown prompt submitted:', this.userPrompt);
    const finalPrompt = this.userPrompt.trim() || this.selectedPrompt;
    const containsHash = finalPrompt.includes('#');
    this.promptDialog.hide();
    this.isMarkdownLoading = true;
    if (!finalPrompt) {
      alert("Please enter or select a prompt.");
      return;
    }

    if (containsHash) {
      const chartOrTableMatches = [...finalPrompt.matchAll(/#(?:chart|table|pivot):(?:"([^"]+)"|'([^']+)'|([^,]+))/gi)];
      const headerNames = chartOrTableMatches.map(match =>
        match[1]?.trim() || match[2]?.trim() || match[3]?.trim()
      ).filter(Boolean);

      const matchedObjects = this.panelSeriesArray.filter((item: any) =>
        headerNames.some(header => item.header?.toLowerCase() === header.toLowerCase())
      );

      // Function to rename dataSource fields
      const renameDataSourceFields = (element: any) => {
        const fieldToLabelMap = element.content.measure.reduce((acc: any, item: any) => {
          acc[item.fieldName] = item.labelName || item.fieldName;
          return acc;
        }, {});

        element.content.dimension.levels.forEach((level: any) => {
          fieldToLabelMap[level.fieldName] = level.labelName || level.fieldName;
        });

        return element.content.dataSource.map((obj: any) => {
          const newObj: any = {};
          for (const key in obj) {
            newObj[fieldToLabelMap[key] || key] = obj[key];
          }
          return newObj;
        });
      };

      // let finalObj = {
      //   data: matchedObjects.map((item: any) => ({
      //     data: item.panelType === 'Chart' ? renameDataSourceFields(item) : item.content.dataSource.result || item.content.dataSource
      //   })),
      //   prompt: finalPrompt
      // };

      let finalObj = {
        data: matchedObjects.map((item: any) => {
          let data;

          if (item.panelType === 'Chart') {
            data = renameDataSourceFields(item);
          } else if (item.panelType === 'Pivot') {
            data = item.content.dataSource;
          } else if (item.panelType === 'Table') {
            data = item.content.dataSource?.result || item.content.dataSource;
          }

          return {
            data,
            prompt: this.userPrompt  // Add the prompt to each entry
          };
        })
      };

      this.editerViewDlg.show();

      // console.log('finalObj', finalObj)
      this.chartService.createHTMLViewer(finalObj).subscribe((res: any) => {
        this.isMarkdownLoading = false;
        if (res?.html) {
          this.markdownContent = res.html;
        }
      });

    }
    // Match all items whose header is included in the prompt


    // console.log('Submitted prompt:', finalPrompt);
    // console.log(' this.panelSeriesArray:', this.panelSeriesArray);
    // this.promptDialog.hide();
    // this.isMarkdownLoading = true;
  }

  promptOptions = [
    { text: 'Give me an overview of the data.', value: 'Give me an overview of the data.' },
    { text: 'Summarize the key insights from this dataset.', value: 'Summarize the key insights from this dataset.' },
    // { text: 'What are the top 5 values by revenue?', value: 'What are the top 5 values by revenue?' },
    // { text: 'Show trends over time.', value: 'Show trends over time.' },
    { text: 'Highlight any outliers or anomalies.', value: 'Highlight any outliers or anomalies.' },
    { text: 'What is the average and median of each metric?', value: 'What is the average and median of each metric?' },
    // { text: 'Compare category-wise performance.', value: 'Compare category-wise performance.' },
    // { text: 'Give me a count of records grouped by category.', value: 'Give me a count of records grouped by category.' },
    // { text: 'Generate a summary report in markdown format.', value: 'Generate a summary report in markdown format.' },
    // { text: 'List all columns with their data types and a sample value.', value: 'List all columns with their data types and a sample value.' }
  ];

  onPromptSelect(event: any) {
    // Append the selected value with a space or newline
    this.userPrompt = (this.userPrompt ? this.userPrompt + '\n' : '') + event.value;
  }

  showMarkdwonBox() {
    this.dialogMode = 'markdown';  // set the mode
    this.promptDialog.show();
    this.userPrompt = ''
  }

  trackThunderInfoObj: any = {
    "dashboard_id": "",
    "dashboard_name": "",
    "panel_id": "",
    "panel_name": "",
    "icon_clicked_at": new Date(),
    "response": "",
    "user_prompt": "",
    "session_unique_id": ""
  }

  onOpenEditerDlg(item: any) {
    this.dialogMode = 'edit';      // set the mode
    this.userPrompt = ''
    this.promptDialog.show()
    this.selectedELement = item;

    let loginTimeData: any = sessionStorage.getItem('loginSession');
    loginTimeData = JSON.parse(loginTimeData);
    const sessionId = loginTimeData ? loginTimeData.session_unique_id : '';
    this.trackThunderInfoObj = {
      icon_clicked_at: new Date().toISOString(),
      dashboard_id: this.editDashboardId,
      dashboard_name: this.dashboardName,
      panel_id: item.id,
      panel_name: item.header,
      session_unique_id: sessionId,
    }
  }

  userPrompt: string = '';
  selectedPrompt: string = '';
  dialogMode: 'markdown' | 'edit' = 'markdown'; // default mode



  submitPrompt() {
    // console.log('this.userPrompt', this.userPrompt)
    const finalPrompt = this.userPrompt.trim() || this.selectedPrompt;

    if (!finalPrompt) {
      alert("Please enter or select a prompt.");
      return;
    }

    // console.log('Submitted prompt:', finalPrompt);
    this.promptDialog.hide();
    this.isMarkdownLoading = true;
    this.cdr.detectChanges();

    // console.log('item', this.selectedELement);

    let modifedDataSource: any = [];

    if (this.selectedELement.panelType === 'Chart') {
      let datasource = this.selectedELement.content.dataSource;

      const fieldToLabelMap = this.selectedELement.content.measure.reduce((acc: any, item: any) => {
        acc[item.fieldName] = item.labelName || item.fieldName;
        return acc;
      }, {});

      this.selectedELement.content.dimension.levels.forEach((level: any) => {
        fieldToLabelMap[level.fieldName] = level.labelName || level.fieldName;
      });

      modifedDataSource = datasource.map((obj: any) => {
        const newObj: any = {};
        for (const key in obj) {
          newObj[fieldToLabelMap[key] || key] = obj[key];
        }
        return newObj;
      });

    } else if (this.selectedELement.panelType === 'Table') {
      modifedDataSource = this.selectedELement.content.dataSource.result || this.selectedELement.content.dataSource;
    } else {
      modifedDataSource = this.selectedELement.content.DataSource;
    }

    this.editerViewDlg.show();

    const obj = {
      data: modifedDataSource,
      query: finalPrompt
      // prompt: finalPrompt;

    };

    // console.log('obj for payload', obj);

    this.chartService.createHTMLViewer(obj).subscribe(
      (res: any) => {
        // console.log('res of api', res);
        this.isMarkdownLoading = false;
        if (res?.html) {
          this.markdownContent = res.html;

          const trackPayload = {
            dashboard_id: this.trackThunderInfoObj.dashboard_id,
            dashboard_name: this.trackThunderInfoObj.dashboard_name || '',
            panel_id: this.trackThunderInfoObj.panel_id || '',
            panel_name: this.trackThunderInfoObj.panel_name || '',
            icon_clicked_at: this.trackThunderInfoObj.icon_clicked_at || '',  // stored earlier
            response: res?.html || '',            // response content
            user_prompt: finalPrompt,
            session_unique_id: this.trackThunderInfoObj.session_unique_id  // generate once per session
          };

          // console.log("Track payload", trackPayload);

          this.chartService.trackThunderaDetails(trackPayload).subscribe(
            () => console.log("User action tracked"),
            (err: any) => console.error("Error tracking user action", err)
          );


        }
        this.cdr.detectChanges();
      },
      (error: any) => {
        console.log('Error fetching markdown content:', error);
        this.isMarkdownLoading = false;
        this.markdownContent = '<p>Error fetching markdown content</p>'; // Set an error message or handle it as needed
        this.cdr.detectChanges();
        // message
      }

    );
  }

  // expand panels code 
  expandedPanels: { [key: string]: boolean } = {};

  togglePanelExpansion(panelId: string, event?: Event) {
    if (event) event.stopPropagation();

    const panel = this.panelSeriesArray.find(p => p.id === panelId);
    if (!panel) return;

    const isCurrentlyExpanded = this.isPanelExpanded(panelId);

    if (isCurrentlyExpanded) {
      // Collapsing the panel
      panel.originalSizeY = panel.originalSizeY || panel.sizeY;
      panel.sizeY = 2;
      this.expandedPanels[panelId] = false;
    } else {
      // Expanding the panel
      panel.sizeY = panel.originalSizeY || panel.sizeY;
      this.expandedPanels[panelId] = true;
    }
    const dashboardLayout = this.createDashboard;

    if (dashboardLayout) {
      // Check if any panel is collapsed
      const hasCollapsedPanels = Object.values(this.expandedPanels).some(
        expanded => expanded === false
      );

      // Enable floating if any panel is collapsed, disable if all are expanded
      dashboardLayout.allowFloating = hasCollapsedPanels;

      // Refresh layout to rearrange panels
      if (hasCollapsedPanels) {
        setTimeout(() => {
          dashboardLayout.refresh();
        }, 300); // Wait for animation to complete
      }
    }

    // Optional: Trigger change detection if needed
    // this.cdr.detectChanges();
  }

  isPanelExpanded(panelId: string): boolean {
    return this.expandedPanels[panelId] === undefined ? true : this.expandedPanels[panelId];
  }

  // kanban code 
  // public enableContent: boolean = true;
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
  onDialogOpen(args: any): void {
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
          const inputs = dialog.querySelectorAll('input:not([type="button"]), TextArea');
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

  // scheduler virtualscroll
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

  //   this.cdr.detectChanges();
  // }

  // downloading panels data 
  isDownloadingAllPanels: boolean = false;
  showManualPopup = false;
  manualPopupMessage = '';

  showMessage(msg: string) {
    this.manualPopupMessage = msg;
    this.showManualPopup = true;

    setTimeout(() => {
      this.showManualPopup = false;
    }, 1000);
  }

  async downloadAllPanelsData() {
    this.isDownloadingAllPanels = true;

    try {
      const wb = XLSX.utils.book_new();
      let sheetsAdded = 0;

      const excludeTypes = [
        'DatePicker', 'DropdownList', 'ListBox',
        'MultiSelectDropDown', 'InputBox',
        'DateRangePicker', 'rawDump'
      ];

      const dataPanels = this.panelSeriesArray
        .filter(p => !excludeTypes.includes(p.panelType));

      let panelData: any = sessionStorage.getItem('storedDrilldownAndFilterArray');
      panelData = panelData ? JSON.parse(panelData) : null;
      const filterObj = panelData?.filter_obj || [];

      // Ã°Å¸â€Â¹ Track duplicate headers
      const sheetNameCount: Record<string, number> = {};

      const promises = dataPanels.map(async (panel) => {
        let data: any[] = [];

        const baseHeader = panel.header || 'Panel';
        const baseSheetName = `${baseHeader}_${panel.panelType}`
          .replace(/[\\\/\?\*\[\]:]/g, '_')
          .substring(0, 31)
          .trim();

        try {
          if (panel.panelType === 'Table') {
            const res: any = await this.chartService
              .downloadTableExportExcel(this.editDashboardId, panel.id, filterObj, 0)
              .toPromise();

            if (res?.success && Array.isArray(res?.data?.dataSource)) {
              data = res.data.dataSource;
            }
          }
          else if (panel.panelType === 'Pivot') {
            data = panel.content?.dataSourceSettings?.dataSource || [];
          }
          else if (
            ['Chart', 'Pie', 'Donut', 'PieChart', 'Doughnut']
              .includes(panel.panelType)
          ) {
            panel.content?.series?.forEach((s: any) => {
              s.dataSource?.forEach((d: any) => {
                data.push({ Series: s.name, ...d });
              });
            });
          }
          else if (panel.panelType === 'Kanban') {
            data = panel.content?.dataSource || [];
          } else if (panel.panelType === 'Gauge') {
            data = panel.content?.dataSource || [];
          }
          else if (panel.panelType === 'Calendar' || panel.panelType === 'Calender') {
            data =
              panel.content?.eventSettings?.dataSource ||
              panel.content?.dataSource ||
              [];
          }

          return data.length ? { baseSheetName, data } : null;

        } catch (err) {
          console.error(`Panel failed: ${panel.header}`, err);
          return null;
        }
      });

      const results = await Promise.all(promises);

      results.forEach(result => {
        if (!result) return;

        const ws = XLSX.utils.json_to_sheet(result.data);

        // Ã°Å¸â€Â¹ Count occurrences
        sheetNameCount[result.baseSheetName] =
          (sheetNameCount[result.baseSheetName] || 0) + 1;

        let finalSheetName = result.baseSheetName;

        // Ã°Å¸â€Â¹ Add suffix ONLY if duplicate exists
        if (sheetNameCount[result.baseSheetName] > 1) {
          const suffix = `_${sheetNameCount[result.baseSheetName] - 1}`;
          finalSheetName =
            result.baseSheetName.substring(0, 31 - suffix.length) + suffix;
        }

        XLSX.utils.book_append_sheet(wb, ws, finalSheetName);
        sheetsAdded++;
      });

      if (!sheetsAdded) {
        this.showMessage('No data panels found to download!');
        return;
      }

      const timestamp = new Date()
        .toISOString()
        .replace(/[:.]/g, '-')
        .substring(0, 19);

      const filename = `${this.dashboardName || 'Dashboard'}_${timestamp}.xlsx`;
      XLSX.writeFile(wb, filename);

      this.showMessage(`Successfully downloaded ${sheetsAdded} panel(s)!`);

    } catch (error) {
      console.error('Download failed:', error);
      this.showMessage('Error occurred while downloading. Please try again.');
    } finally {
      this.isDownloadingAllPanels = false;
      this.cdr.detectChanges();
    }
  }
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
      const allHeaders = pivotContainer.querySelectorAll(
        '.e-rowsheader, .e-columnsheader, .e-columnheader, .e-stackedheadercelldiv, .e-stot, .e-gtot'
      );

      allHeaders.forEach((headerCell: Element) => {
        const headerElement = headerCell as HTMLElement;
        const cellValue = headerElement.querySelector('.e-cellvalue');

        let headerText = '';
        if (cellValue) {
          headerText = (cellValue as HTMLElement).innerText?.trim() || '';
        } else {
          headerText = headerElement.innerText?.trim() || '';
        }

        if (!headerText) return;

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
          if (!format?.fieldName) return;

          const fieldNames = Array.isArray(format.fieldName)
            ? format.fieldName
            : [format.fieldName];

          fieldNames.forEach((fieldName: string) => {
            if (belongsToField?.toLowerCase() === fieldName.toLowerCase()) {

              // Ã¢Å“â€¦ Apply styles with !important to prevent overriding
              if (format.backgroundColor) {
                headerElement.style.setProperty('background-color', format.backgroundColor, 'important');
              }

              if (format.color) {
                headerElement.style.setProperty('color', format.color, 'important');
                // Apply to all nested elements
                headerElement.querySelectorAll('*').forEach((el: Element) => {
                  (el as HTMLElement).style.setProperty('color', format.color, 'important');
                });
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

              // Ã¢Å“â€¦ Also apply to nested .e-cellvalue
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
      });
    };

    // Apply formatting once after initial render
    applyFormatting();
  }

  onEventRendered(args: any, item: any): void {
    console.log('Event Rendered - args:', args);
    console.log('Event Rendered - item:', item);
    console.log('Conditional Formatting:', item.content.conditionalFormatting);

    // Check if conditional formatting is configured
    if (!item.content.conditionalFormatting || item.content.conditionalFormatting.length === 0) {
      console.log('No conditional formatting rules found');
      return;
    }

    const eventData = args.data;
    console.log('Event Data:', eventData);

    // Loop through all conditional formatting rules
    item.content.conditionalFormatting.forEach((condition: any) => {
      console.log('Checking condition:', condition);

      const fieldValue = eventData[condition.measure];
      console.log(`Field: ${condition.measure}, Value: ${fieldValue}`);

      // Skip if field doesn't exist in event data
      if (fieldValue === undefined || fieldValue === null) {
        console.log(`Field ${condition.measure} not found in event data`);
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

      console.log('Should apply style:', shouldApplyStyle);

      // Apply styles if condition is met
      if (shouldApplyStyle && condition.style) {
        if (args.element) {
          console.log('Applying styles to element:', condition.style);

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
          console.log('args.element is null or undefined');
        }
      }
    });
  }
  formatHour(hour: number): string {
    if (hour === undefined || hour === null) {
      return '09:00';
    }
    return hour.toString().padStart(2, '0') + ':00';
  }


  getGaugePointerValue(item: any): number {
    const valueField = item.content?.gauge?.valueField;
    if (!item.content?.dataSource || item.content.dataSource.length === 0) {
      return 0;
    }
    const firstRow = item.content.dataSource[0];
    const value = firstRow[valueField];
    return value !== null && value !== undefined ? +value : 0;
  }

  getGaugeTitle(item: any): string {
    return item.content?.title || '';
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
      textStyle: {
        size: legends?.textStyle?.size
          ? String(legends.textStyle.size).replace('px', '') + 'px'
          : '11px',
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

  // input box filter code 
  // inputBoxSuggestions: { [key: string]: any[] } = {};
  // inputBoxDropdownVisible: { [key: string]: boolean } = {};
  // inputBoxText: { [key: string]: string } = {};
  // inputBoxTags: { [key: string]: string[] } = {};

  // getInputBoxTags(id: string): string[] {
  //   return this.inputBoxTags[id] || [];
  // }

  // onInputBoxSearch(event: any, item: any): void {
  //   const id = item.id;
  //   const currentTyping = (event.target.value || '').trim().toLowerCase();

  //   this.inputBoxText[id] = event.target.value || '';

  //   if (!currentTyping) {
  //     this.inputBoxSuggestions[id] = [];
  //     this.inputBoxDropdownVisible[id] = false;
  //     return;
  //   }

  //   const fullData: any[] = this.originalData[id] || item.content?.dataSource || [];

  //   const matched = fullData
  //     .filter((entry: any) => {
  //       const val = entry?.item !== undefined ? entry.item : entry;
  //       return val != null && String(val).toLowerCase().includes(currentTyping);
  //     })
  //     .slice(0, 10);

  //   this.inputBoxSuggestions[id] = matched;
  //   this.inputBoxDropdownVisible[id] = matched.length > 0;
  // }

  // selectInputBoxSuggestion(suggestion: any, item: any): void {
  //   const id = item.id;
  //   const value = String(suggestion?.item ?? suggestion);

  //   if (!this.inputBoxTags[id]) {
  //     this.inputBoxTags[id] = [];
  //   }

  //   // Avoid duplicates
  //   if (!this.inputBoxTags[id].includes(value)) {
  //     this.inputBoxTags[id] = [...this.inputBoxTags[id], value];
  //   }

  //   // Clear typing input
  //   this.inputBoxText[id] = '';

  //   // Apply filter with all committed tags
  //   this.applyInputBoxTagFilter(item);

  //   this.inputBoxSuggestions[id] = [];
  //   this.inputBoxDropdownVisible[id] = false;
  // }

  // removeInputBoxTag(index: number, item: any): void {
  //   const id = item.id;
  //   this.inputBoxTags[id] = (this.inputBoxTags[id] || []).filter((_: any, i: number) => i !== index);
  //   this.applyInputBoxTagFilter(item);
  // }

  // applyInputBoxTagFilter(item: any): void {
  //   const tags = this.inputBoxTags[item.id] || [];
  //   const filterValue = tags.join(', ');
  //   this.onInputBoxFilter({ target: { value: filterValue } }, item);
  // }

  // onInputBoxEnter(event: any, item: any): void {
  //   event.preventDefault();
  //   const id = item.id;
  //   const text = (this.inputBoxText[id] || '').trim();
  //   if (!text) return;

  //   if (!this.inputBoxTags[id]) {
  //     this.inputBoxTags[id] = [];
  //   }

  //   if (!this.inputBoxTags[id].includes(text)) {
  //     this.inputBoxTags[id] = [...this.inputBoxTags[id], text];
  //   }

  //   this.inputBoxText[id] = '';
  //   this.applyInputBoxTagFilter(item);
  //   this.inputBoxSuggestions[id] = [];
  //   this.inputBoxDropdownVisible[id] = false;
  // }

  // onInputBoxBackspace(event: any, item: any): void {
  //   const id = item.id;
  //   // Only remove last tag if typing area is empty
  //   if ((this.inputBoxText[id] || '') === '') {
  //     const tags = this.inputBoxTags[id] || [];
  //     if (tags.length > 0) {
  //       this.inputBoxTags[id] = tags.slice(0, -1);
  //       this.applyInputBoxTagFilter(item);
  //     }
  //   }
  // }

  // onInputBoxFocus(item: any): void {
  //   const id = item.id;
  //   const text = (this.inputBoxText[id] || '').trim().toLowerCase();
  //   if (!text) return;

  //   const fullData: any[] = this.originalData[id] || item.content?.dataSource || [];
  //   const matched = fullData
  //     .filter((entry: any) => {
  //       const val = entry?.item !== undefined ? entry.item : entry;
  //       return val != null && String(val).toLowerCase().includes(text);
  //     })
  //     .slice(0, 10);

  //   this.inputBoxSuggestions[id] = matched;
  //   this.inputBoxDropdownVisible[id] = matched.length > 0;
  // }

  // onInputBoxBlur(item: any): void {
  //   setTimeout(() => {
  //     this.inputBoxDropdownVisible[item.id] = false;
  //   }, 300);
  // }

  // highlightMatch(text: string, search: string): string {
  //   if (!text || !search) return String(text);
  //   const escaped = search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  //   if (!escaped) return String(text);
  //   const regex = new RegExp(`(${escaped})`, 'gi');
  //   return String(text).replace(regex, '<strong>$1</strong>');
  // }

  // onInputBoxPaste(event: any, item: any): void {
  //   const input = event.target as HTMLInputElement;
  //   // Wait for paste to complete, then stretch to fill
  //   setTimeout(() => {
  //     input.style.width = '100%';
  //     this.inputBoxText[item.id] = input.value;
  //     this.onInputBoxSearch({ target: input }, item);
  //   }, 0);
  // }


  onGaugeDropdownSelect(eve: any, item: any) {
    const selectedValue = eve.item.properties.text;
    if (selectedValue === 'XLSX') {
      const exportData = item.content?.dataSource || [];
      this.excelService.exportAsExcelFileForChart(exportData, item.header);
    }
    else if (selectedValue === 'SVG') {
      // Custom SVG export â€” centered
      const gaugeEl = document.querySelector(`#${item.id}`) as HTMLElement;
      if (gaugeEl) {
        const svgEl = gaugeEl.querySelector('svg');
        if (svgEl) {
          const originalSvg = svgEl.cloneNode(true) as SVGElement;
          const width = svgEl.getAttribute('width') || '500';
          const height = svgEl.getAttribute('height') || '350';

          // Wrap in a centered full-page SVG
          const wrappedSvg = `
          <svg xmlns="http://www.w3.org/2000/svg" width="800" height="600"
            viewBox="0 0 ${width} ${height}"
            style="display:block; margin:auto;">
            ${originalSvg.innerHTML}
          </svg>`;

          const blob = new Blob([wrappedSvg], { type: 'image/svg+xml' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${item.header}.svg`;
          a.click();
          URL.revokeObjectURL(url);
        }
      }
    } else {
      // PNG, PDF etc â€” use Syncfusion export as before
      let gaugeFound = false;
      this.gaugeRefSData.forEach((gaugeInstance: any) => {
        if (gaugeInstance.element.id === item.id) {
          gaugeFound = true;
          gaugeInstance.export(selectedValue as ExportType, item.header);
        }
      });
      if (!gaugeFound) {
        const gaugeEl = document.querySelector(`#${item.id}`) as any;
        if (gaugeEl?.ej2_instances?.[0]) {
          gaugeEl.ej2_instances[0].export(selectedValue as ExportType, item.header);
        }
      }
    }
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

  //  this.scedularTemplateForm.get('rawQuery')!.setValue("") add this instead of this while doing clear this.scedularTemplateForm.get('rawQuery')!.reset();

}

