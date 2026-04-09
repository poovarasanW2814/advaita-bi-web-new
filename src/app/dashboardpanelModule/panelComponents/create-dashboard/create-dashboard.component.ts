import { ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, Query, QueryList, ViewChild, ViewChildren, inject} from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { ChartComponent, AccumulationChartComponent, ToolbarItems, AnimationModel, ILoadedEventArgs, IAccTextRenderEventArgs, IAccTooltipRenderEventArgs, ExportType, ChartModule, AccumulationChartModule } from '@syncfusion/ej2-angular-charts';
import { DropDownListComponent, SelectionSettingsModel, ToolbarSettingsModel, DropDownListModule, ListBoxModule, MultiSelectModule } from '@syncfusion/ej2-angular-dropdowns';
import { GridComponent, GroupSettingsModel, FilterSettingsModel, DataStateChangeEventArgs, PageEventArgs, QueryCellInfoEventArgs, GridModule } from '@syncfusion/ej2-angular-grids';
import { DashboardLayoutComponent, PanelModel, DashboardLayoutModule } from '@syncfusion/ej2-angular-layouts';
import { ClickEventArgs } from '@syncfusion/ej2-angular-navigations';
import { DisplayOption, EnginePopulatedEventArgs, PivotViewComponent, PivotViewModule } from '@syncfusion/ej2-angular-pivotview';
import { DialogComponent, AnimationSettingsModel, ButtonPropsModel, Tooltip, DialogModule, hideSpinner } from '@syncfusion/ej2-angular-popups';


import { ChartService } from 'src/app/core/services/chart.service';
import { DashboardBasedAccessService } from 'src/app/core/services/dashboard-based-access.service';
import { MenuBasedAccessService } from 'src/app/core/services/menu-based-access.service';
import { PanelServiceService } from 'src/app/core/services/panel-service.service';
import { GridSettings } from '@syncfusion/ej2-pivotview/src/pivotview/model/gridsettings';
import { v4 as uuidv4 } from 'uuid';
import { PropertyChartComponent } from '../../panel-properties/property-chart/property-chart.component';
import { PropertyTableComponent } from '../../panel-properties/property-table/property-table.component';
import { PivotPropertiesComponent } from '../../panel-properties/pivot-properties/pivot-properties.component';
import { PropertyBoxComponent } from '../../panel-properties/property-box/property-box.component';
import { ListboxPropertiesComponent } from '../../panel-properties/listbox-properties/listbox-properties.component';
import { DropdownPropertiesComponent } from '../../panel-properties/dropdown-properties/dropdown-properties.component';
import { DatepickerComponent } from '../../panel-properties/datepicker/datepicker.component';
import { DaterangepickerComponent } from '../../panel-properties/daterangepicker/daterangepicker.component';
import { Observable } from 'rxjs';
import { PropertyMultiselectdropdownComponent } from '../../panel-properties/property-multiselectdropdown/property-multiselectdropdown.component';
import { Browser } from '@syncfusion/ej2/base';
import { InitialFiltersComponent } from '../../panel-properties/initial-filters/initial-filters.component';
import { LoaderService } from 'src/app/core/services/loader.service';
import { RawdatadumpComponent } from '../../panel-properties/rawdatadump/rawdatadump.component';
import { PopupService } from 'src/app/core/services/popup.service';
import { InputBoxPropertiesComponent } from '../../panel-properties/input-box-properties/input-box-properties.component';
import { CardTemplateComponent } from '../../panel-properties/card-template/card-template.component';
import { AIAssistViewComponent, PromptModel, PromptRequestEventArgs, ResponseToolbarSettingsModel, AIAssistViewModule } from '@syncfusion/ej2-angular-interactive-chat';
import { PropertySceduleComponent } from '../../panel-properties/property-scedule/property-scedule.component';
import { ExpandableFiltersComponent } from '../../panel-properties/expandable-filters/expandable-filters.component';
import { KanbanComponent } from '../../panel-properties/kanban/kanban.component';
import { guageChartPropertiesComponent } from '../../panel-properties/guage-chart-properties/guage-chart-properties.component';
import { CircularGaugeComponent, GaugeTheme, CircularGaugeModule } from '@syncfusion/ej2-angular-circulargauge';
import { LegendService, GaugeTooltipService } from '@syncfusion/ej2-angular-circulargauge';
import { ButtonModule } from '@syncfusion/ej2-angular-buttons';
import { NgFor, NgIf, NgClass, NgStyle } from '@angular/common';
import { KanbanModule } from '@syncfusion/ej2-angular-kanban';
import { ScheduleModule } from '@syncfusion/ej2-angular-schedule';
import { DateRangePickerModule, DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import { RoleMappingComponent } from '../../panel-properties/role-mapping/role-mapping.component';


@Component({
    selector: 'app-create-dashboard',
    templateUrl: './create-dashboard.component.html',
    providers: [LegendService, GaugeTooltipService],
    styleUrls: ['./create-dashboard.component.scss'],
    imports: [ButtonModule, DashboardLayoutModule, NgFor, NgIf, GridModule, NgClass, ChartModule, KanbanModule, PivotViewModule, AccumulationChartModule, NgStyle, ScheduleModule, AIAssistViewModule, DateRangePickerModule, DatePickerModule, DropDownListModule, ListBoxModule, MultiSelectModule, CircularGaugeModule, DialogModule, FormsModule, ReactiveFormsModule, RoleMappingComponent, InitialFiltersComponent, PropertyChartComponent, PropertyTableComponent, PivotPropertiesComponent, PropertyBoxComponent, ListboxPropertiesComponent, DropdownPropertiesComponent, DatepickerComponent, DaterangepickerComponent, PropertySceduleComponent, PropertyMultiselectdropdownComponent, RawdatadumpComponent, InputBoxPropertiesComponent, CardTemplateComponent, ExpandableFiltersComponent, KanbanComponent, guageChartPropertiesComponent]
})

export class CreateDashboardComponent implements OnInit {


  @ViewChild('grid') grid!: GridComponent;
  @ViewChild('grid') grid1!: GridComponent;

  @ViewChild('defaultDialog') defaultDialog!: DialogComponent;
  @ViewChild('formPopup') formPopup!: DialogComponent;
  @ViewChild('pivotview') pivotview!: PivotViewComponent;

  @ViewChild('dashboardTitlePopup') dashboardTitlePopup!: DialogComponent;
  @ViewChild('connectionFormPopup') connectionFormPopup!: DialogComponent;
  @ViewChild('userMappingModel') userMappingModel!: DialogComponent;
  @ViewChild('initalFilterPopup') initalFilterPopup!: DialogComponent;



  @ViewChild('icons') iconDropDownList!: DropDownListComponent;

  @ViewChild(DropdownPropertiesComponent) DropdownPropertiesComponent!: DropdownPropertiesComponent;
  @ViewChild(PropertyBoxComponent) PropertyBoxComponent!: PropertyBoxComponent;
  @ViewChild(PropertyChartComponent) PropertyChartComponent!: PropertyChartComponent;
  @ViewChild(PivotPropertiesComponent) PivotPropertiesComponent!: PivotPropertiesComponent;
  @ViewChild(PropertyTableComponent) PropertyTableComponent!: PropertyTableComponent;
  @ViewChild(ListboxPropertiesComponent) ListboxPropertiesComponent!: ListboxPropertiesComponent;
  @ViewChild(RawdatadumpComponent) RawdatadumpComponent!: RawdatadumpComponent;
  @ViewChild(CardTemplateComponent) CardTemplateComponent!: CardTemplateComponent;

  @ViewChild(PropertyMultiselectdropdownComponent) PropertyMultiselectdropdownComponent!: PropertyMultiselectdropdownComponent;
  @ViewChild(InputBoxPropertiesComponent) InputBoxPropertiesComponent!: InputBoxPropertiesComponent;


  @ViewChild(DatepickerComponent) DatepickerComponent!: DatepickerComponent;
  @ViewChild(DaterangepickerComponent) DaterangepickerComponent!: DaterangepickerComponent;
  @ViewChild(InitialFiltersComponent) InitialFiltersComponent!: InitialFiltersComponent;

  @ViewChild(PropertySceduleComponent) PropertySceduleComponent!: PropertySceduleComponent;

  @ViewChild(ExpandableFiltersComponent) ExpandableFiltersComponent!: ExpandableFiltersComponent;
  @ViewChild(KanbanComponent) KanbanComponent!: KanbanComponent;
  @ViewChild(guageChartPropertiesComponent) guageChartPropertiesComponent !: guageChartPropertiesComponent;

  //  dialogHeader: string = 'Select Type';
  dialogCloseIcon: Boolean = true;
  dialogWidth: string = '300px';
  dialogdragging: Boolean = true;
  animationSettings: AnimationSettingsModel = { effect: 'Zoom' };
  isModal: Boolean = true;
  target: string = '.control-section';
  visible: Boolean = true;
  selectedPanelType!: string;
  sendConnectionObj: any;
  initialPage: any = { pageSizes: ['20', '50', '100', '200', '500', '1000'], pageCount: 4 };
  gridtoolbarOptions?: ToolbarItems[];
  PivottoolbarOptions!: ToolbarItems[]
  groupOptions!: GroupSettingsModel;
  filterSettings!: FilterSettingsModel;
  gridSettings!: GridSettings;
  count: any = 0;
  sendEditPanelObj: any;
  getPanelIndex: any;
  height: string = '200px';
  panelType: any;
  childPanelObj: any;
  date: Date = new Date();
  panelHeader: string = 'Create Panel'

  panelTypeForm!: FormGroup;
  dashboardTitleForm!: FormGroup;
  onTextRender: Function | any;
  cellSpacing: number[] = Browser?.isDevice ? [5, 2] : [10, 10];
  cellAspectRatio: any;
  wrapSettings: any;



  iconFields: any = { text: 'PanelType', iconCss: 'Class', value: 'PanelType' };
  panelTypeDataArray: any[] = [
    { Class: 'fas fa-chart-bar', PanelType: 'Chart', Id: '1' },
    { Class: 'fas fa-tv', PanelType: 'Box', Id: '2' },
    { Class: 'fas fa-table', PanelType: 'Table', Id: '3' },
    { Class: 'fas fa-table', PanelType: 'Pivot', Id: '4' },
    { Class: 'fas fa-calendar-alt', PanelType: 'DatePicker', Id: '5' },
    { Class: 'fas fa-calendar-alt', PanelType: 'DateRangePicker', Id: '6' },
    { Class: 'fas fa-th-list', PanelType: 'ListBox', Id: '7' },
    { Class: 'fas fa-caret-square-down', PanelType: 'DropdownList', Id: '8' },
    { Class: 'fas fa-chevron-circle-down', PanelType: 'MultiSelectDropDown', Id: '9' },
    { Class: 'fas fa-download', PanelType: 'RawDataDump', Id: '10' },
    { Class: 'fas fa-search', PanelType: 'InputBox', Id: '11' },
    { Class: 'fas fa-tv', PanelType: 'Card', Id: '12' },
    { Class: 'fas fa-calendar-week', PanelType: 'Calender', Id: '13' },
    // { Class: 'fas fa-filter', PanelType: 'ExpandableFilters', Id: '14' },
    { Class: 'fas fa-tasks', PanelType: 'Kanban', Id: '14' },
    { Class: 'fas fa-tachometer-alt', PanelType: 'Gauge', Id: '15' }


  ];

  // <i class="fas fa-chevron-circle-down"></i>
  public pageSettings: object = { pageSize: ['50', '100', '200', '500', '1000'] };

  animation: AnimationModel = { enable: true, duration: 2000, delay: 0 };
  selectionSettings: SelectionSettingsModel = { showCheckbox: true };
  connectionNameForm!: FormGroup;

  dashboardCreationObj: any = {
    allowFloating: false,
    allowDragging: true,
    showGridLines: true,
    cellAspectRatio: "100/80",
    cellSpacing: [10, 10],
    allowResizing: true,
    panels: []
  }

  connectionIdFlag: boolean = true;
  connectionSubmitFlag: boolean = true;
  connectionUpdateFlag: boolean = false;
  loaderFlag: boolean = false;


  connectionDatabaseNameLabel!: string;
  dataBaseNameLabel!: string;
  menuBasedAccess: any = {};
  permissionObj: any = {};
  menuBasedPermissionControlArray: any = [];
  dashboardBasedAccess: any = {};
  dashboardPermissionObj: any = {};
  dashboardBasedPermssionArray: any = [];
  connectionDetailsArray: any[] = [];
  roleMappingObj: any

  panelSeriesArray: any[] = [];
  dashboardNameListArray: any[] = [];
  query!: Query;
  connectionId!: number;
  databaseNameArr: any = []

  @HostListener('window:unload', ['$event'])
  onUnload(): void {
    // Set a flag in localStorage indicating that the user is leaving the page
    // localStorage.setItem('leavingPage', 'true');
    sessionStorage.setItem('leavingPage', 'true');
  }

  // Add this to your ngOnInit or constructor
  checkLeavingPage(): void {
    // const leavingPage = localStorage.getItem('leavingPage');
    const leavingPage = sessionStorage.getItem('leavingPage');
    if (leavingPage) {
      // Do something when the user is leaving the page (e.g., show a message)
      alert('Are you sure you want to leave this page?');
      // Clear the flag in localStorage
      // localStorage.removeItem('leavingPage');
      // localStorage.removeItem('panelSeriesArray');
      // localStorage.removeItem('createPanelSeriesArray');
      // // localStorage.removeItem('storeEditObj');
      // localStorage.removeItem('connectionIdObj');

      sessionStorage.removeItem('leavingPage');
      sessionStorage.removeItem('panelSeriesArray');
      sessionStorage.removeItem('createPanelSeriesArray');
      // sessionStorage.removeItem('storeEditObj');
      sessionStorage.removeItem('connectionIdObj');
    }
  }
  private isNavigatingAway = false;
  canDeactivate(): boolean | Observable<boolean> {
    if (this.popupService.shouldSkipGuard) {
      this.popupService.resetGuard();
      return true;
    }
    return this.showConfirmation();

  }

  showConfirmation(): boolean {
    const returnMessage = window.confirm('Are you sure you want to leave this page?');

    if (returnMessage) {
      sessionStorage.removeItem('leavingPage');
      sessionStorage.removeItem('panelSeriesArray');
      sessionStorage.removeItem('createPanelSeriesArray');
      sessionStorage.removeItem('connectionIdObj');
    }

    return returnMessage; // <-- important: return true or false
  }

  public observable = new Observable();


  private readonly panelService = inject(PanelServiceService);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  private readonly formBuilder = inject(FormBuilder);
  private readonly chartService = inject(ChartService);
  private readonly router = inject(Router);
  private readonly menuBasedAccessService = inject(MenuBasedAccessService);
  private readonly dashboardBasedAccessService = inject(DashboardBasedAccessService);
  private readonly loaderService = inject(LoaderService);
  private readonly popupService = inject(PopupService);
  constructor() {
    // this.router.events.subscribe(event => {
    //   if (event instanceof NavigationEnd) {
    //     // localStorage.removeItem('panelSeriesArray');
    //     // localStorage.removeItem('createPanelSeriesArray');
    //     // localStorage.removeItem('storeEditObj');
    //     // localStorage.removeItem('connectionIdObj');
    //   }
    // });
  }

  public connectionFields: Object = { text: 'connection_name', value: 'connection_id' };
  public displayOption?: DisplayOption;
  loggedUserInformationData: any;

  groupNames: any;
  subGroupNames: any;

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
    // console.log('seriesList', seriesList, item)

    const dataSource = item?.content?.dataSource;
    const firstObj = dataSource?.[0];

    if (!firstObj) return;

    const keys = Object.keys(firstObj);

    // Check all series in the axis
    for (const series of seriesList) {
      const yName = series?.properties?.yName;
      const seriesName = series?.properties?.name;

      // console.log('yName', yName, seriesName)

      const matchedKey = keys.find(key => key === yName || key === seriesName);
      // console.log('matchedKey', matchedKey)

      if (matchedKey) {
        const value = firstObj[matchedKey];
        // console.log('value', value)

        // Check if the value has a colon (indicating time format)
        if (typeof value === 'string' && value.includes(':')) {
          const numericValue = Number(args.text);

          // Format only if it's a valid number
          if (!isNaN(numericValue)) {
            args.text = this.formatSecondsToHHMMSS(numericValue);
            // console.log('args.text', args.text)

          }

          // No need to check further series if one match is enough
          break;
        }
      }
    }
  }

  tooltipRenderColumnChart(args: any | any, item: any): void {
    const headerText = args.headerText;
    const yValue = args.point?.y;
    // console.log('args in tooltipRenderColumnChart', args, item)

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
      args.text = `${pointXtext} : ${formattedTime}`;
    } else {
      args.text = `${pointXtext} : ${yValue}`;
    }

    args.headerText = `${args.point.x}`;
  }

  ngOnInit(): void {

    let userData: any = sessionStorage.getItem('userInformation');

    if (userData) {
      userData = JSON.parse(userData);
      this.loggedUserInformationData = userData
    }

    this.cellAspectRatio = Browser?.isDevice ? 100 / 8 : 100 / 70;

    this.displayOption = { view: 'Both' } as DisplayOption;


    let onTextRender1 = (args: any, datalabelFormat: any, item: any) => {
      const percentValue = args.point.percentage;
      const seriesProps = args.series?.properties;
      const yName = seriesProps?.yName;
      const seriesName = seriesProps?.name;

      // console.log('text render', args.series);
      // console.log('text properties', yName, seriesName);

      if (datalabelFormat === "Percentage") {
        // args.text = Math.ceil(percentValue) + "%";
        if (
          percentValue != null && // handles null and undefined
          !String(args.text).includes('%') // avoid duplicate %
        ) {
          args.text = Math.ceil(percentValue) + "%";
        }
      } else {
        const firstObj = item.content.dataSource?.[0]; // Adjust if your data source is elsewhere

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


    this.onTextRender = (args: any, datalabelFormat: any, item: any) => {
      const percentValue = args.point.percentage;
      const seriesProps = args.series?.properties;
      const yName = seriesProps?.yName;
      const seriesName = seriesProps?.name;


      const point = args.point || {};
      const label = (point.x != null) ? String(point.x) : (seriesName || '');
      const rawValue = point.y;

      // console.log('================================', item.id, item.header , '=====================================')
      // console.log('label', label)

      // console.log('point', point);
      // console.log('args', args);
      // console.log('yName==', yName, 'seriesName==', seriesName);

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



    this.chartService.getAllDashboardDetailsWithEmptyData().subscribe((res: any) => {
      let data = res['data'];
      console.log('data of dashboards', data)
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

      console.log(' this.groupNames', this.groupNames)


    })


    this.menuBasedAccessService.menuAccess$.subscribe((menuAccess) => {

      this.menuBasedAccess = menuAccess;
      //  console.log('this.menuBasedAccess from subjectData', this.menuBasedAccess)

      this.menuBasedPermissionControlArray = this.menuBasedAccess?.permission_details
      const formNameToFind = 'createDashboard';
      const permissionDetailsForHome = this.menuBasedPermissionControlArray?.find(
        (permission: any) => permission.form_name === formNameToFind
      );
      if (permissionDetailsForHome) {
        this.permissionObj = permissionDetailsForHome
      }
    });

    this.chartService.getAllDashboardDetails().subscribe((res: any) => {
      let data = res['data'];
      if (data) {
        this.dashboardNameListArray = data.map((ele: any) => ele.dashboard_name);

      }
    })
    this.chartService.getAllDbConncetionDetails().subscribe((res: any) => {
      const resData = res['data'];
      if (!resData) return;
      this.connectionDetailsArray = [
        { connection_id: 0, connection_name: 'Internal' },
        ...resData
      ];
    })


    // let storedConnectionId: any = localStorage.getItem('connectionIdObj');
    let storedConnectionId: any = sessionStorage.getItem('connectionIdObj');
    console.log('storedConnectionId', storedConnectionId)

    if (storedConnectionId != null || storedConnectionId != undefined) {
      this.connectionIdFlag = false;
      storedConnectionId = JSON.parse(storedConnectionId)
      this.connectionDatabaseNameLabel = storedConnectionId.connectionName;
      this.dataBaseNameLabel = storedConnectionId.databaseName
      // this.connectionDatabaseNameLabel = storedConnectionId.connectionName + '-' + storedConnectionId.databaseName
    } else {
      this.connectionIdFlag = true
    }
    this.groupOptions = { showGroupedColumn: true };
    this.filterSettings = { type: 'CheckBox' };

    // this.toolbarOptions = [ 'ExcelExport', 'ConditionalFormatting'] as any as ToolbarItems[];
    this.PivottoolbarOptions = [
      'Export'] as any as ToolbarItems[];

    //    this.PivottoolbarOptions = [
    // 'Export', 'SubTotal', 'GrandTotal', 'FieldList','Grid','Chart'] as any as ToolbarItems[];


    // this.gridtoolbarOptions = [ 'ExcelExport', 'CsvExport'] as any as ToolbarItems[];
    this.gridtoolbarOptions = ['ExcelExport', 'PdfExport', 'CsvExport'] as any as ToolbarItems[];
    // ['New', 'Save', 'SaveAs', 'Rename', 'Remove', 'Load',
    //         'Grid', 'Chart', 'Export', 'SubTotal', 'GrandTotal', 'Formatting', 'FieldList'] as ToolbarItems[];

    this.gridSettings = {

      // allowResizing: true,
      columnWidth: 150,
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

    this.panelTypeForm = this.formBuilder.group({
      panelType: ['', Validators.required]
    })

    this.dashboardTitleForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: [''],
      dashboard_image: [''],
      specific_cache_exp: [''],
      auto_refresh: [''],
      version: [''],
      group_name: [''],
      sub_group: ['']

    })

    this.connectionNameForm = this.formBuilder.group({
      connectionName: [''],
      databaseName: ['']
    })
    this.getPanelArrayDataFromLocalStorage();

    this.panelSeriesArray.forEach((panel: any) => {
      if (panel.panelType === 'Pivot' && panel.content?.defaultView) {
        this.pivotDisplayOptions[panel.id] = panel.content.defaultView === 'chart' ? 'Chart' : 'Table';
      }
    });

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

  alignHeadersRecursively(columns: any[]): void {
    columns.forEach(column => {
      column.textAlign = 'Center'; // Align column headers to the center
      column.headerTextAlign = 'Center';
    });

  }


  queryCellHeaderINfo(args: any): void {
    // console.log('args in querycell info', args.node.innerText)

    if (args.node.innerText == 'Grand Total') {
      args.node.innerText = 'Total'
    }

  }
  pivottoolbarClickOld(args: any) {
    console.log('args', args)

    args.customToolbar.splice(3, 0, {
      prefixIcon: ' e-icons e-expand', tooltipText: 'Expand/Collapse',
      cssClass: ' e-btn',
      click: this.toolbarClicked.bind(this),
    });

  }

  pivottoolbarClick(args: any, pivotviewInstance: PivotViewComponent, item: any) {
    args.customToolbar.splice(3, 0, {
      prefixIcon: 'e-icons e-expand',
      tooltipText: 'Expand/Collapse',
      cssClass: 'e-btn',
      click: () => this.toolbarClicked(pivotviewInstance, item), // Bind to specific instance
    });
  }


  toolbarClickedOld(args: any) {
    console.log('toolbarclikc', args)
    this.pivotview!.dataSourceSettings.expandAll = !this.pivotview!.dataSourceSettings.expandAll;
  }

  @ViewChildren('pivotview') pivotviews!: QueryList<PivotViewComponent>;
  toolbarClicked(pivotviewInstance: PivotViewComponent, item: any) {
    pivotviewInstance.dataSourceSettings.expandAll = !pivotviewInstance.dataSourceSettings.expandAll;

    // Log to confirm it is working correctly
    console.log('Expand/Collapse toggled for', item);
  }

  // secondsToHms(totalSeconds: number): string {

  //   if (isNaN(totalSeconds) || totalSeconds == null) {
  //     return '00:00:00';  // or return '--:--:--' if you prefer
  //   }

  //   const h = Math.floor(totalSeconds / 3600);
  //   const m = Math.floor((totalSeconds % 3600) / 60);
  //   const s = Math.floor(totalSeconds % 60);

  //   return (
  //     ('0' + h).slice(-2) + ':' +
  //     ('0' + m).slice(-2) + ':' +
  //     ('0' + s).slice(-2)
  //   );
  // }

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


  onPivotAggregateCellInfo1(args: any, pivotviewObj: PivotViewComponent, item: any) {

    // item = this.processPivotPanel(item)

    // let targetPivot = this.pivotviews.find((pv) => pv.element.id === pivotviewObj.element.id);

    // targetPivot = targetPivot ? pivotviewObj : targetPivot

    let targetPivot = this.pivotviews.filter((pv) => pv.element.id === pivotviewObj.element.id);
    let matchTable = targetPivot[0] ? pivotviewObj : targetPivot[0];

    if (!matchTable) {
      // console.error('PivotView instance not found for the given item');
      return;
    }


    // matchTable.grid.headerCellInfo = this.queryCellHeaderINfo.bind(this);
    // targetPivot.grid.queryCellInfo = this.queryCell.bind(this);

    const timeFields = item.content.fieldDetails.filter(
      (f: any) => f.formatType === 'string' && f.name
    ).map((f: { name: any; }) => f.name);

    if (timeFields.includes(args.fieldName)) {
      args.value = this.secondsToHms(args.value);
    }

    console.log('timeFields', timeFields)

    if (item.content.showGrandAvg) {
      const fieldName = args.fieldName;
      const grandTotalValue = args.value;
      args.skipFormatting = true;


      if (args.rowCellType === 'grandTotal' || args.columnCellType === 'grandTotal') {


        let columns = item.content.dataSourceSettings.columns.map((col: any) => col.name);
        let rows = item.content.dataSourceSettings.rows.map((row: any) => row.name);
        let values = item.content.dataSourceSettings.values.map((row: any) => row.name);

        if (item.content.grandTotalAverageType == "AverageWithZero") {
          const rowaxis = args.row.valueSort.axis;
          const colaxis = args.column.valueSort.axis;


          let nonMatchingKey: any = Object.keys(args.cellSets[0]).find(key =>
            key !== rowaxis && key !== colaxis && key !== 'index' && key !== fieldName && !(values.includes(key))
          );

          const distinctValues = new Set(
            args.cellSets.map((item: any) => item[nonMatchingKey]) // Include all values including zeros
          );

          const distinctObjects = args.cellSets.reduce((acc: any[], cur: { [x: string]: any; }) => {
            const key = cur[nonMatchingKey];
            if (!acc.some((obj: { [x: string]: any; }) => obj[nonMatchingKey] === key)) {
              acc.push(cur);
            }
            return acc;
          }, []);


          const distinctCount = distinctValues.size;
          const distinctObjectsCount = distinctObjects.length;

          let averageCount = distinctObjectsCount > 0 ? (grandTotalValue / distinctObjectsCount).toFixed(2) : 0;

          args.value = `Sum : ${grandTotalValue} - Avg :  ${averageCount}`;

        } else if (item.content.grandTotalAverageType == "AverageWithoutZero") {

          const rowaxis = args.row.valueSort.axis;
          const colaxis = args.column.valueSort.axis;

          let nonMatchingKey: any = Object.keys(args.cellSets[0]).find(key =>
            key !== rowaxis && key !== colaxis && key !== 'index' && key !== fieldName && !(values.includes(key))
          );

          const distinctObject: { [key: string]: any[] } = {};

          const distinctValues = new Set(
            args.cellSets
              .filter((item: any) => item[fieldName] !== 0)
              .map((item: any) => item[nonMatchingKey])
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

          // Count of distinct values
          const distinctCount = distinctValues.size;
          const distinctObjectsCount = distinctObjects.length;

          let averageCount = grandTotalValue / distinctObjectsCount ? (grandTotalValue / distinctObjectsCount).toFixed(2) : 0
          args.value = `sum : ${grandTotalValue} - Avg :  ${averageCount}`;

        } else {

          const rowaxis = args.row.valueSort.axis;
          const colaxis = args.column.valueSort.axis;
          let skillSetDatasource = item.content.dataSourceSettings.dataSource;

          if (args.rowCellType === 'grandTotal' && args.columnCellType === 'value') {

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
            let averageCount = grandTotalValue / distinctObjectsCount ? (grandTotalValue / distinctObjectsCount).toFixed(2) : 0

            args.value = `sum : ${grandTotalValue} - Avg :  ${averageCount}`;

          } else if (args.columnCellType === 'grandTotal' && args.rowCellType === 'value') {


            let nonMatchingKey: any = Object.keys(skillSetDatasource[0]).find(key =>
              key !== rowaxis && key !== 'index' && key !== fieldName && !(values.includes(key))
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


            // // console.log('distinctObjects in columnCellType', distinctObjects)
            const distinctObjectsCount = distinctObjects.length;
            let averageCount = grandTotalValue / distinctObjectsCount ? (grandTotalValue / distinctObjectsCount).toFixed(2) : 0
            args.value = `sum : ${grandTotalValue} - Avg  :  ${averageCount}`;
          }
        }

      }
    }


  }


  onPivotAggregateCellInfoChatbot(args: any, pivotviewObj: PivotViewComponent, item: any) {


    let targetPivot = this.pivotviews.filter((pv) => pv.element.id === pivotviewObj.element.id);
    let matchTable = targetPivot[0] ? pivotviewObj : targetPivot[0];
    if (!matchTable) {
      return;
    }

    // after removing this method 
    // matchTable.grid.headerCellInfo = this.queryCellHeaderINfo.bind(this);

    const timeFields = item.content.fieldDetails.filter(
      (f: any) => f.formatType === 'string' && f.name
    ).map((f: { name: any; }) => f.name);

    if (timeFields.includes(args.fieldName)) {
      args.value = this.secondsToHms(args.value);
    }

    if (item.content.showGrandAvg) {

      const fieldName = args.fieldName;
      const grandTotalValue = args.value;
      args.skipFormatting = false;

      let conditionalFOrmattingArray = item.content.dataSourceSettings.conditionalFormatSettings;
      let columns = item.content.dataSourceSettings.columns.map((col: any) => col.name);
      let rows = item.content.dataSourceSettings.rows.map((row: any) => row.name);
      let values = item.content.dataSourceSettings.values.map((row: any) => row.name);

      const rowaxis = args.row.valueSort.axis;
      const colaxis = args.column.valueSort.axis;

      if (args.rowCellType === 'grandTotal' || args.columnCellType === 'grandTotal') {

        // console.log('args', item.id, args)
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

          // args.value = `Sum : ${grandTotalValue} - Avg :  ${averageCount}`;
          // args.value = `${averageCount}`;
          // args.averageCount = averageCount;
          // this.grandTotalAvgValue = averageCount;


          const fieldDetail = item.content.fieldDetails.find((f: any) => f.name === args.fieldName);
          const format = fieldDetail.format;
          if (format) {
            args.value = `${averageCount}%`; // numeric value for conditional formatting
            args.displayText = `${averageCount.toFixed(2)}%`; // formatted display

          } else {
            args.value = averageCount;
            args.displayText = averageCount;
          }

          args.averageCount = averageCount;
          this.grandTotalAvgValue = averageCount;
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
          // args.value = `sum : ${grandTotalValue} - Avg :  ${averageCount}`;
          // args.value = `${averageCount}`;
          // args.averageCount = averageCount;
          // this.grandTotalAvgValue = averageCount;


          const fieldDetail = item.content.fieldDetails.find((f: any) => f.name === args.fieldName);
          const format = fieldDetail.format;
          if (format) {
            args.value = `${averageCount}%`; // numeric value for conditional formatting
            args.displayText = `${averageCount.toFixed(2)}%`; // formatted display

          } else {
            args.value = averageCount;
            args.displayText = averageCount;
          }

          args.averageCount = averageCount;
          this.grandTotalAvgValue = averageCount;
          args.skipFormatting = false;

        } else {

          let skillSetDatasource = item.content.dataSourceSettings.dataSource;

          if (args.rowCellType === 'grandTotal' && args.columnCellType === 'grandTotal') {
            // console.log('args..........args.value', args.value, args);

            let nonMatchingKey: any;

            // Determine which axis to compare based on grand total position
            if (args.rowCellType === 'grandTotal' && args.columnCellType === 'grandTotal') {
              // When both are grandTotal, prefer column axis first
              nonMatchingKey = Object.keys(skillSetDatasource[0]).find(key =>
                key !== colaxis && key !== 'index' && key !== fieldName && !(values.includes(key))
              );
            } else if (args.rowCellType === 'grandTotal') {
              // When only row is grand total
              nonMatchingKey = Object.keys(skillSetDatasource[0]).find(key =>
                key !== colaxis && key !== 'index' && key !== fieldName && !(values.includes(key))
              );
            } else if (args.columnCellType === 'grandTotal') {
              // When only column is grand total
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

            const distinctObjectsCount = distinctObjects.length;
            const averageCount: any = grandTotalValue / distinctObjectsCount
              ? (grandTotalValue / distinctObjectsCount).toFixed(2)
              : 0;

            const fieldDetail = item.content.fieldDetails.find((f: any) => f.name === args.fieldName);
            const format = fieldDetail.format;

            // args.value = `sum : ${grandTotalValue} - Avg : ${averageCount}`;
            // args.value =`${averageCount}`;
            // args.displayText =  `${averageCount}%`;


            args.averageCount = averageCount;
            this.grandTotalAvgValue = averageCount;
            args.skipFormatting = false;

            if (format) {
              args.value = `${averageCount}`; // numeric value for conditional formatting
              args.displayText = `${averageCount.toFixed(2)}%`; // formatted display

            } else {
              args.value = averageCount;
              args.displayText = averageCount;
            }


          }

          else if (args.rowCellType === 'grandTotal' && args.columnCellType === 'value') {
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
            args.value = `sum : ${grandTotalValue} - Avg :  ${averageCount}`;
            args.averageCount = averageCount;
            this.grandTotalAvgValue = averageCount;

          }

          else if (args.columnCellType === 'grandTotal' && (args.rowCellType === 'value' || args.rowCellType === 'subTotal')) {
            console.log('args', args)

            const fieldDetail = item.content.fieldDetails.find((f: any) => f.name === args.fieldName);
            const format = fieldDetail.format;
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
              console.log('averageCount..........', averageCount)

              const fieldDetail = item.content.fieldDetails.find(
                (f: any) => f.name === args.fieldName
              );

              if (fieldDetail?.format) {
                args.value = averageCount; // numeric value for conditional formatting
                args.displayText = `${averageCount.toFixed(2)}%`; // formatted display
                console.log('args.displayText..........', args.displayText, args.value);
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

              if (format) {
                args.value = rawValue1;
                args.displayText = `${rawValue1.toFixed(2)}%`;
                console.log('args.displayText..........', args.displayText, args.value)

              } else {
                args.value = rawValue1;
                args.displayText = `${rawValue1.toFixed(2)}`;
              }

            }

          }









        }
      }
    }
  }

  onPivotAggregateCellInfo_MYCODE(args: any, pivotviewObj: PivotViewComponent, item: any) {

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
            console.log('args in grand total', item.id, args)

            let nonMatchingKey: any;

            // Determine which axis to compare based on grand total position
            if (args.rowCellType === 'grandTotal' && args.columnCellType === 'grandTotal') {
              // When both are grandTotal, prefer column axis first
              nonMatchingKey = Object.keys(skillSetDatasource[0]).find(key =>
                key !== colaxis && key !== 'index' && key !== fieldName && !(values.includes(key))
              );
            } else if (args.rowCellType === 'grandTotal') {
              // When only row is grand total
              nonMatchingKey = Object.keys(skillSetDatasource[0]).find(key =>
                key !== colaxis && key !== 'index' && key !== fieldName && !(values.includes(key))
              );
            } else if (args.columnCellType === 'grandTotal') {
              // When only column is grand total
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

            const distinctObjectsCount = distinctObjects.length;
            const averageCount: any = grandTotalValue / distinctObjectsCount
              ? (grandTotalValue / distinctObjectsCount).toFixed(2)
              : 0;

            const fieldDetail = item.content.fieldDetails.find((f: any) => f.name === args.fieldName);
            const format = fieldDetail.format;

            const isPercentFormat = format == 'P' ||
              format == "###0.00 '%'" || format == "###0 '%'" || format == "###0.0 '%'";

            if (isPercentFormat) {
              args.value = `${averageCount}`; // numeric value for conditional formatting
              args.displayText = `${averageCount}%`; // formatted display

            } else {
              args.value = averageCount;
              args.displayText = averageCount;
            }

            args.value = averageCount;
            args.displayText = averageCount;
            args.averageCount = averageCount;
            // this.grandTotalAvgValue = averageCount;
            args.skipFormatting = false;

          }

          else if (args.rowCellType === 'grandTotal' && args.columnCellType === 'value') {

            console.log(
              'args in grand total row total', item.id, args
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
            args.value = `sum : ${grandTotalValue} - Avg :  ${averageCount}`;
            args.averageCount = averageCount;
            // this.grandTotalAvgValue = averageCount;
          }

          else if (args.columnCellType === 'grandTotal' && (args.rowCellType === 'value' || args.rowCellType === 'subTotal')) {
            // console.log('args', args)

            console.log(
              'args in grand total columnCellType total', item.id, args
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

    if (item.content.showGrandTotals) {
      if (args.rowCellType === 'grandTotal' && args.columnCellType === 'grandTotal') {
        let value = Number(args.value);
        args.value = value.toFixed(2);
        args.displayText = value.toFixed(2);  // Show just number
        args.skipFormatting = true;           // prevent Syncfusion reformatting
      }
    }

  }


  onPivotAggregateCellInfo22(args: any, pivotviewObj: PivotViewComponent, item: any) {

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

  onPivotAggregateCellInfo(args: any, pivotviewObj: PivotViewComponent, item: any) {

    let targetPivot = this.pivotviews.filter((pv) => pv.element.id === pivotviewObj.element.id);
    let matchTable = targetPivot[0] ? pivotviewObj : targetPivot[0];
    if (!matchTable) {
      return;
    }
    matchTable.grid.headerCellInfo = this.queryCellHeaderINfo.bind(this);

    // â”€â”€ STRING VALUE FIELD OVERRIDE â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
    // â”€â”€ END STRING VALUE FIELD OVERRIDE â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

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

              console.log('..................value is null or not RowCellType', rawValue, args.value)

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



  grandTotalAvgValue: number = 0

  onEnginePopulated1(args: EnginePopulatedEventArgs, item: any) {

    // if(item.id == 'layout_8'){
    if (args.pivotValues) {
      args.pivotValues.forEach((row) => {
        // console.log('row', row)
        row.forEach((cell) => {
          if (cell) {

            // if(cell.axis === 'column' &&  cell.actualText == ele.name)
            // cell.axis === 'value'
            // cell.formattedText = `${cell.value}%`; // Append '%' only for value cells

            let valuesArray = item.content.fieldDetails;


            // console.log(valuesArray)
            valuesArray.forEach((ele: any) => {
              //  console.log('valuesArray', ele);

              // if (cell.actualText == ele.name) {
              //   if (cell.axis === 'value' && ele.valueFormat && cell.value != undefined) {
              //     console.log('cell', cell.value)

              //     cell.formattedText = `${cell.value}%`;
              //   }
              // }

              // if (cell.actualText == ele.caption) {
              //   console.log('cell.axis', cell.axis, ele.valueFormat, cell.value)

              //    if (cell.axis === 'value' && ele.valueFormat && cell.value != undefined) {
              //      cell.formattedText = `${cell.value}%`;
              //      console.log('formatted value', cell.value)
              //    }
              //  }


              if (item.content.rawQuery) {
                //  console.log(cell.actualText , ele.caption, ele.name);

                if (cell.actualText == ele.caption || cell.actualText == ele.name) {
                  // console.log('cell.axis', cell.axis, ele.valueFormat, cell.value)

                  if (cell.axis === 'value' && ele.valueFormat && cell.value != undefined) {
                    cell.formattedText = `${cell.value}%`;
                    // console.log('formatted value item.content.rawQuery', cell.value)
                  }
                }
              } else {
                if (cell.actualText == ele.name) {
                  // console.log('cell.axis', cell.axis, ele.valueFormat, cell.value)

                  if (cell.axis === 'value' && ele.valueFormat && cell.value != undefined) {
                    cell.formattedText = `${cell.value}%`;
                    // console.log('formatted value ', cell.value)

                    //  console.log('formatted value', cell.value)
                  }
                }
              }


            })
          }
        });
      });
    }
    // }


  }

  onEnginePopulated(args: EnginePopulatedEventArgs, item: any) {

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

                  }
                }
              }

            })
          }
        });
      });
    }

    if (item?.content?.headerFormatting && Array.isArray(item.content.headerFormatting)) {
      // Use setTimeout to ensure DOM is fully ready
      setTimeout(() => {
        const pivotInstance = this.pivotviews.find(pv => pv.element.id === item.id);
        if (pivotInstance) {
          this.applyPivotHeaderFormattingDOM(pivotInstance, item);
        }
      }, 100);
    }
  }




  tooltipRender1(args: IAccTooltipRenderEventArgs, tooltipFormat: any): void {
    let value = args.point.y / args.series.sumOfPoints * 100;
    // console.log('tooltip render', args.point.x, value, args.point.y, tooltipFormat)
    // console.log('tooltip render', args.point.x, value, args.point.y, tooltipFormat)

    if (tooltipFormat == 'Percentage') {
      args["text"] = args.point.x + ' : ' + Math.ceil(value) + '' + '%';

    } else {
      args["text"] = args.point.x + ' : ' + args.point.y;

    }
  };


  tooltipRender(args: IAccTooltipRenderEventArgs | any, tooltipFormat: any, item: any): void {
    console.log('formaargsttedTime', args)

    // let value = args.point.y / args.series.sumOfPoints * 100;

    args.headerText = `${args.point.x}`;
    let value = args.point.y / args.series.sumOfPoints * 100;
    let textName = args.data.seriesName;

    if (tooltipFormat == 'Percentage') {
      args["text"] = textName + ' : ' + Math.ceil(value) + '' + '%';

    } else {
      // args["text"] = args.point.x + ' : ' + args.point.y;

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
      console.log('originalValue', originalValue)
      const isLikelyTimeFormat = typeof originalValue === 'string' && originalValue.includes(':');

      if (isLikelyTimeFormat && typeof yValue === 'number') {
        const formattedTime = this.formatSecondsToHHMMSS(yValue);
        args.text = `${textName} : ${formattedTime}`;
      } else {
        args.text = `${textName} : ${yValue}`;
      }

    }
  };



  onchartDownload(eve: any, item: any, chart: any) {
    let chart1 = chart as ChartComponent;

    chart1.exportModule.export(<ExportType>'CSV', 'chart4');


  }

  imageUrl: any;
  imageName: any;

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        // console.log(e.target)
        this.imageUrl = e.target?.result;
        //  console.log(this.imageUrl)
      };

      reader.readAsDataURL(file);
      this.imageName = file.name;
      console.log('Selected file name:', file.name);
    }
  }




  onConnectionNameSelect(event: any) {
    //  console.log('event', event)
    // const selectedValue = event.target.value;



    // if (selectedValue) {
    //   // const [connectionName, connectionId] = selectedValue.split('-');
    //   // Do something with connectionName and connectionId
    //   // console.log(connectionId);
    //   this.connectionId = +(selectedValue);

    //   // console.log('connectionId',  this.connectionId);

    //   // this.chartService.getAllDatabaseNameById( this.connectionId).subscribe((res : any) =>{
    //   //   console.log(res,'res ')
    //   //   let data = res['data'];
    //   //   this.databaseNameArr = data.databases
    //   // })
    // }

    let itemData = event.itemData;
    let connectionName_Id = itemData.connection_id;
    //  console.log('connectionName_Id', connectionName_Id, typeof (connectionName_Id))

    if (connectionName_Id) {
      this.connectionId = +(connectionName_Id);
      console.log('this.connectionId', this.connectionId)

    }

  }

  onMappingUserBtn() {
    this.userMappingModel.show()
    // let storedConnectionId: any = localStorage.getItem('connectionIdObj')

    let storedConnectionId: any = sessionStorage.getItem('connectionIdObj')

    if (storedConnectionId != null || storedConnectionId != undefined) {
      storedConnectionId = JSON.parse(storedConnectionId);
      this.sendConnectionObj = storedConnectionId;
      this.connectionId = storedConnectionId.connection_Id

      // console.log(this.sendConnectionObj, this.connectionId )

    }

  }
  // dataBound(item : any) {
  //   debugger;
  //   const columns = (this.grid as any).getColumns();
  //   (this.grid as any).autoFitColumns([]);

  // }
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

  dataBound(item: any, grid: any) {

    const columns = grid.getColumns();

    if (item.content.autoFitColumns === true) {
      grid.autoFitColumns([]);
    }


    if (item.content.allowWrapping == true) {

      this.wrapSettings = { wrapMode: 'Both' }
    }

    // Hide spinner after all grid operations are complete
    setTimeout(() => {
      this.clearGridSpinner(grid);
    }, 0);

    // Syncfusion occasionally leaves the pane visible after the first render.
    setTimeout(() => {
      this.clearGridSpinner(grid);
    }, 150);

    if (item.content.headerConditonalFormatting?.length > 0) {
      // Object.keys(data).forEach((fieldName) => {
      item.content.headerConditonalFormatting.forEach((headerConfig: any) => {
        console.log('headerConfig', headerConfig)

        const headerElement = (grid as GridComponent).getColumnHeaderByField(headerConfig.fieldName) as HTMLElement;
        console.log('headerElement', headerElement)

        if (headerElement) {
          headerElement.style.background = headerConfig.backgroundColor; // Change background color
          headerElement.style.color = headerConfig.color; // Change text color
          // headerElement.style.fontSize =headerConfig.fontSize; // Change text color
          // headerElement.style.fontWeight = headerConfig.fontWeight; // Change text color
          headerElement.style.fontStyle = headerConfig.fontStyle; // Change text color

          // Find the span inside and apply the font size
          const headerTextElement = headerElement.querySelector('.e-headertext') as HTMLElement;
          if (headerTextElement) {
            headerTextElement.style.fontSize = headerConfig.fontSize;
            headerElement.style.fontWeight = headerConfig.fontWeight; // Change text color

          } else {
            console.warn("Header text element not found inside:", headerElement);
          }

        }
      });
    }


  }
  ngAfterViewInit(): void {

  }
  onActionBegin(args: PageEventArgs) {
    if (args.requestType === 'paging') {
      // console.log('onActionBegin'  , args)

      // this.message = (currentPage as string) > (previousPage as string)
      //     ? `You are going to switch to page ${parseInt((currentPage as string), 10) + 1}`
      //     : `You are going to switch to page ${previousPage}`;
    }
  }
  onQueryCellInfo(args: QueryCellInfoEventArgs, item: any): void {

    //console.log( 'Args in pivot table' ,args)

    let matchedObj = this.panelSeriesArray.find((ele: any) => ele.id === item.id);

    if (matchedObj) {
      let conditionalData = matchedObj.content.formattingCondition;

      matchedObj.content.fieldDetails.forEach((ele: any) => {
        if (args.column && args.data && args.cell) {
          let data: any = args.data

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

      if (Array.isArray(conditionalData) && conditionalData.length > 0) {
        conditionalData.forEach((condition: any) => {
          if (args.column && args.data && args.cell && args.column.field === condition.measure) {
            const fieldValue: any = args.data[condition.measure as keyof typeof args.data]; // Type assertion here
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

              // âœ… Assign the computed value back to condition.value1 dynamically
              // condition.value1 = calculatedValue.toLowerCase() === 'sum' ? sum : avg;

              // âœ… Only override if Sum or Average; else keep user's entered value
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
            }
            else if (condition.conditions === "notContains") {
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

    // At this point, if value is null but condition is not about null â†’ false
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

  compareValuesWorkin(value: string | number, threshold: string | number | number[], condition: string): boolean {

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

    console.log('Processed values:', value, threshold, condition);

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



  // Function to apply styles to the cell
  applyStyles(cell: HTMLElement, style: any): void {
    // Apply each style property to the cell
    Object.keys(style).forEach(property => {
      if (property === 'backgroundColor' || property === 'color') {
        cell.style[property] = style[property];
      } else if (property === 'fontSize') {
        cell.style.fontSize = style[property];
      }
    });
  }

  // Function to apply styles to the cell
  //  applyStyles(cell: HTMLElement, style: any): void {
  //   Object.keys(style).forEach(property => {
  //     (cell as HTMLElement).style[property] = style[property]; // Type assertion here
  //   });
  // }


  onActionComplete(args: PageEventArgs) {
    if (args.requestType === 'paging') {
      // console.log('onActionComplete', args)

      // this.totalCount = this.data.length;
      // this.totalPages = Math.ceil(this.totalCount / this.pageSettings['pageSize']);
      // this.message1 = 'Now you are in page ' + args.currentPage;
    }
  }
  closePopup(): void {
    const popup = document.getElementById('popup');
    const backdrop = document.getElementById('backdrop');

    if (popup && backdrop) {
      popup.style.display = 'none';
      backdrop.style.display = 'none';
    }
  }

  progressBarTop = '50%';
  @HostListener('window:scroll', ['$event'])
  onScroll(event: Event): void {
    this.updateProgressBarPosition();
  }
  private updateProgressBarPosition(): void {
    const viewportHeight = window.innerHeight;
    const windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
    const scrollY = window.scrollY

    const topPosition = Math.max(0, (windowHeight - viewportHeight) / 2 + scrollY);
    this.progressBarTop = `${topPosition}px`;
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

  public BtnClick = (): void => {
    this.connectionSubmitFlag = false;
    this.connectionUpdateFlag = true;
    this.connectionFormPopup.show();
    // let storeConnectionObj: any = localStorage.getItem('connectionIdObj')
    let storeConnectionObj: any = sessionStorage.getItem('connectionIdObj')



    if (storeConnectionObj != null || storeConnectionObj != undefined) {
      storeConnectionObj = JSON.parse(storeConnectionObj);
      // console.log(storeConnectionObj, storeConnectionObj)
      // let storedObj = {
      //   connectionName : storeConnectionObj.connectionName + '-' +storeConnectionObj.connection_id ,
      //    databaseName : storeConnectionObj.databaseName
      //  }
      this.connectionNameForm.patchValue({
        connectionName: storeConnectionObj.connection_Id,
        databaseName: storeConnectionObj.databaseName
      })

    }
  }


  onConnectionUpdate() {
    console.log('this.connectionNameForm.value in update', this.connectionNameForm.value)
    let formValue = this.connectionNameForm.value;
    let connectionid = +(formValue.connectionName);

    console.log('connectionid', connectionid)
    this.connectionIdFlag = false;

    if (connectionid == 0) {
      let obj = {
        "connectionName": "internal",
        "connection_Id": connectionid,
        "databaseName": ""
      }
      // console.log(obj)
      this.connectionDatabaseNameLabel = obj.connectionName;
      // localStorage.setItem("connectionIdObj", JSON.stringify(obj))
      sessionStorage.setItem("connectionIdObj", JSON.stringify(obj))


    } else {
      this.chartService.getDbConnectionDetailById(connectionid).subscribe((res: any) => {
        let data = res['data'];
        this.connectionDatabaseNameLabel = data.connection_name;
        this.connectionId = this.dashboardCreationObj.connection_id

        let obj = {
          "connectionName": data.connection_name,
          "connection_Id": data.connection_id,
          "databaseName": data.default_database_name
        }
        // localStorage.setItem("connectionIdObj", JSON.stringify(obj));
        sessionStorage.setItem("connectionIdObj", JSON.stringify(obj));



      })
    }

    const storedPanels = sessionStorage.getItem('createPanelSeriesArray');

    if (storedPanels) {
      // Parse the stored string back to an array
      const panelSeriesArray = JSON.parse(storedPanels);

      // Perform your desired operations on the array
      panelSeriesArray.forEach((panel: any) => {
        panel.connection_id = this.connectionId; // Update connection_id or any other property
      });

      // Convert the updated array back to a string
      const updatedPanelSeriesArrayString = JSON.stringify(panelSeriesArray);

      // Save the updated string back to sessionStorage
      sessionStorage.setItem('createPanelSeriesArray', updatedPanelSeriesArrayString);

      console.log('Updated panelSeriesArrayString:', updatedPanelSeriesArrayString);
    } else {
      console.error('No panelSeriesArray found in sessionStorage.');
    }



    this.connectionSubmitFlag = true;
    this.connectionUpdateFlag = false;
    this.connectionFormPopup.hide();

  }

  onConnectionFormSubmit() {
    let formValue = this.connectionNameForm.value;
    console.log('formValue in connection', formValue)
    let connectionid = +(formValue.connectionName);

    this.connectionIdFlag = false;
    if (connectionid == 0) {
      let obj = {
        "connectionName": "internal",
        "connection_Id": connectionid,
        "databaseName": ""
      }
      this.connectionDatabaseNameLabel = obj.connectionName;
      sessionStorage.setItem("connectionIdObj", JSON.stringify(obj))
      // localStorage.setItem("connectionIdObj", JSON.stringify(obj))

      this.connectionFormPopup.hide()
    } else {

      this.chartService.getDbConnectionDetailById(connectionid).subscribe((res: any) => {
        let data = res['data'];

        this.connectionIdFlag = false;

        let obj = {
          "connectionName": data.connection_name,
          "connection_Id": data.connection_id,
          "databaseName": data.default_database_name
        }
        this.connectionDatabaseNameLabel = obj.connectionName;
        // localStorage.setItem("connectionIdObj", JSON.stringify(obj))
        sessionStorage.setItem("connectionIdObj", JSON.stringify(obj))

        this.connectionFormPopup.hide()
      })
    }


  }

  getRoleMappingObj(eve: any) {
    // console.log(eve);
    this.roleMappingObj = eve;
    this.userMappingModel.hide();

  }
  toolbarClick(args: ClickEventArgs, item: any, grid: GridComponent): void {
    // console.log(args.item.text);


    if (args) {
      if (args.item.text == 'Excel Export') {
        grid.excelExport();


      } else {
        // console.log(args.item.text)
        grid.csvExport();
      }
    }

    // if(item.content.autoFitColumns  === true){
    //   if(args){
    //     if (args.item.text == 'Excel Export') {
    //       this.grid.excelExport();
    //     } else {
    //       console.log(args.item.text)
    //       this.grid.csvExport();
    //     }
    //   }


    // }else{
    //   if(args){
    //     if (args.item.text == 'Excel Export') {
    //       this.grid1.excelExport();
    //     } else {
    //       console.log(args.item.text)
    //       this.grid1.csvExport();
    //     }
    //   }

    // }



  }
  reorganizePanelIds() {
    for (let i = 0; i < this.panelSeriesArray.length; i++) {
      const newId = `layout_${i}`;
      this.panelSeriesArray[i].id = newId;
      // this.panelSeriesArray[i].header = `Panel ${i}`;
    }
  }
  onAddPanel() {
    this.defaultDialog.show();
  }

  toggleFloating() {
    this.dashboardCreationObj.allowFloating = !this.dashboardCreationObj.allowFloating;

    const status = this.dashboardCreationObj.allowFloating ? 'Enabled' : 'Disabled';
    this.showToast(`Floating is ${status}`);
  }

  showToast(message: string) {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #4CAF50;
      color: white;
      padding: 8px 20px;
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

  onPanelDropdownSubmit() {
    const selectedItem = this.panelTypeForm.value.panelType;

    // Retrieve stored connection ID from sessionStorage
    let storedConnectionId: any = sessionStorage.getItem('connectionIdObj');
    if (storedConnectionId != null) {
      storedConnectionId = JSON.parse(storedConnectionId);
      this.connectionId = storedConnectionId.connection_Id;
    }

    this.panelType = selectedItem;

    console.log('panelSeriesArray in submit', this.panelSeriesArray);

    // Retrieve existing panel array from localStorage/sessionStorage
    this.getPanelArrayDataFromLocalStorage();

    // Initialize variables for determining position
    let maxNumericId = 0;
    let maxEndRow = 0; // Bottom-most position (row + sizeY) across all panels

    // Calculate `maxNumericId` and `maxEndRow`
    for (const panel of this.panelSeriesArray) {
      const numericId = parseInt(panel.id.split('_')[1]);
      if (!isNaN(numericId) && numericId > maxNumericId) {
        maxNumericId = numericId;
      }

      const panelEndRow = panel.row + panel.sizeY;
      if (panelEndRow > maxEndRow) {
        maxEndRow = panelEndRow;
      }
    }

    // Determine the new panel's ID and position
    const newNumericId = this.panelSeriesArray.length === 0 ? 0 : maxNumericId + 1;
    const newRow = maxEndRow; // Place the new panel below the bottom-most panel

    this.panelHeader = `Create Panel - ${this.panelType}`


    // Create the new panel object
    const newPanel = {
      id: `layout_${newNumericId}`,
      sizeX: 10, // Default width
      sizeY: 8,  // Default height
      row: newRow,
      col: 0, // Default to the first column
      content: {},
      panelType: `${this.panelType}`,
      header: ` ${this.panelType} ${newNumericId}`,
      // header: `Panel ${newNumericId}`,
      connection_id: this.connectionId,
    };

    // console.log('newPanel', newPanel);

    // Add the new panel to the array
    this.panelSeriesArray.push(newPanel);

    // Save the updated panel array in sessionStorage
    const panelSeriesArrayString = JSON.stringify(this.panelSeriesArray);
    sessionStorage.setItem('createPanelSeriesArray', panelSeriesArrayString);

    // Reset form and close the dialog
    this.panelTypeForm.reset();
    this.defaultDialog.hide();
  }

  onPanelDropdownSubmit1() {
    let selectedItem = this.panelTypeForm.value.panelType;


    // let storedConnectionId: any = localStorage.getItem('connectionIdObj')
    let storedConnectionId: any = sessionStorage.getItem('connectionIdObj')


    if (storedConnectionId != null || storedConnectionId != undefined) {
      storedConnectionId = JSON.parse(storedConnectionId);
      // console.log(storedConnectionId, 'storedConnectionId');
      this.connectionId = storedConnectionId.connection_Id
    }

    this.panelType = selectedItem;
    // console.log('panelSeriesArray in submit', this.panelSeriesArray)
    this.getPanelArrayDataFromLocalStorage();



    this.count = this.panelSeriesArray.length - 1;

    let lastIndexObj = this.panelSeriesArray[this.panelSeriesArray.length - 1];

    let lastObjCOl = lastIndexObj ? lastIndexObj.col : 0;
    let lastObjRow = lastIndexObj ? lastIndexObj.row + lastIndexObj.sizeY : 0;

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

    this.count = this.count + 1;
    let maxNumericId = 0;
    for (const panel of this.panelSeriesArray) {
      const numericId = parseInt(panel.id.split('_')[1]);
      // console.log(numericId)
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
      "connection_id": this.connectionId
    }

    // console.log('panel', panel)

    this.panelSeriesArray.push(panel);

    const panelSeriesArrayString = JSON.stringify(this.panelSeriesArray);
    // localStorage.setItem('createPanelSeriesArray', panelSeriesArrayString);
    sessionStorage.setItem('createPanelSeriesArray', panelSeriesArrayString);

    this.panelTypeForm.reset()
    this.defaultDialog.hide();
    //  this.scrollToBottom();

  }




  // @ViewChild('panelContainer') panelContainer!: ElementRef;

  // scrollToBottom(): void {
  //   try {
  //     this.panelContainer.nativeElement.scrollTop = this.panelContainer.nativeElement.scrollHeight;
  //   } catch (err) {
  //     console.error('Error scrolling to bottom:', err);
  //   }
  // }

  load(args: ILoadedEventArgs): void {
    if (args && args.chart && args.chart.zoomModule) {
      args.chart.zoomModule.isZoomed = true;
    }
  };

  calculatedListBoxHeight: string = '150px'; // Initial default value

  calculateDynamicHeight(item: any): void {

    const calculatedHeight = 'calc(100% - 10px)';
    // console.log('calculatedHeight', calculatedHeight)
    this.calculatedListBoxHeight = calculatedHeight;


  }


  onResizeStop(args: any) {
    const panelElement = args.element;

    if (panelElement) {
      const offsetHeight: any = panelElement.offsetHeight - 50;
      const dataCol = panelElement.getAttribute('data-col');
      const dataRow = panelElement.getAttribute('data-row');
      const datasizex = panelElement.getAttribute('data-sizex');
      const datasizey = panelElement.getAttribute('data-sizey');


      // let panelData = localStorage.getItem('createPanelSeriesArray');
      let panelData = sessionStorage.getItem('createPanelSeriesArray');

      if (panelData !== null) {
        panelData = JSON.parse(panelData);

        if (Array.isArray(panelData)) {
          let panelold: any | null = panelData.find((panel) => panel.id === panelElement.id);
          if (panelold) {
            panelold.sizeX = +datasizex;
            panelold.sizeY = +datasizey;
            panelold.col = +dataCol;
            panelold.row = +dataRow;

            if (panelold.panelType == "ListBox") {
              let height = panelElement.offsetHeight - 75;
              this.boxHeight = height + 'px';
              panelold.content.height = this.boxHeight
              //  this.calculateDynamicHeight(panelold);
            }

            if (panelold.panelType == "Pivot") {
              // panelold.content.height = +(offsetHeight);
              let pivotHeight = offsetHeight - 20;
              panelold.content.height = pivotHeight + 'px';

            }

            // localStorage.setItem('createPanelSeriesArray', JSON.stringify(panelData));
            sessionStorage.setItem('createPanelSeriesArray', JSON.stringify(panelData));

            this.changeDetectorRef.detectChanges();
          }


        }
      }

      if (panelElement.querySelector('.e-panel-container .e-panel-content')) {
        if (panelElement.querySelector('.e-panel-container .e-panel-content ejs-chart')) {
          const chartObj = panelElement.querySelector('.e-panel-container .e-panel-content ejs-chart').ej2_instances[0];
          chartObj.height = '100%';
          chartObj.width = '100%';
          // console.log(chartObj , 'Chart');
          chartObj.refresh();

        } else if (panelElement.querySelector('.e-panel-container .e-panel-content ejs-accumulationchart')) {
          const chartObj = panelElement.querySelector('.e-panel-container .e-panel-content ejs-accumulationchart').ej2_instances[0];
          chartObj.height = '100%';
          chartObj.width = '100%';
          // console.log(chartObj, 'pie chart');
          chartObj.refresh();

        } else if (panelElement.querySelector('.e-panel-container .e-panel-content ejs-grid')) {
          const chartObj = panelElement.querySelector('.e-panel-container .e-panel-content ejs-grid').ej2_instances[0];
          chartObj.height = '96%';
          chartObj.width = '100%';
          // console.log(chartObj.height, chartObj.width, 'Table ');
          chartObj.refresh();

        } else if (panelElement.querySelector('.e-panel-container .e-panel-content ejs-pivotview')) {
          const pivotObj = panelElement.querySelector('.e-panel-container .e-panel-content ejs-pivotview').ej2_instances[0];
          pivotObj.height = offsetHeight;
          //  pivotObj.height = '96%';
          // this.pivotHeight = offsetHeight;
          pivotObj.width = '100%';
          // console.log(pivotObj.height, pivotObj.width, pivotObj, 'Pivot Table ');
          pivotObj.refresh();

        } else if (panelElement.querySelector('.e-panel-container .e-panel-content ejs-listbox')) {
          const listboxObj = panelElement.querySelector('.e-panel-container .e-panel-content ejs-listbox').ej2_instances[0];
          let height = panelElement.offsetHeight - 55;

          console.log('height', height)
          listboxObj.height = height + 'px';
          // listboxObj.width = '100%';
          // console.log(listboxObj.height, listboxObj.width, listboxObj, 'Pivot Table ');
          listboxObj.refresh();

        } else if (panelElement.querySelector('.e-panel-container .e-panel-content ejs-schedule')) {
          const listboxObj = panelElement.querySelector('.e-panel-container .e-panel-content ejs-schedule').ej2_instances[0];
          let height = panelElement.offsetHeight - 55;

          console.log('height', height)
          listboxObj.height = height + 'px';

          listboxObj.refresh();
        }

        // else if (panelElement.querySelector('.e-panel-container .e-panel-content ejs-listbox')) {
        //   const listboxObj = panelElement.querySelector('.e-panel-container .e-panel-content ejs-listbox').ej2_instances[0];
        //   const parentContainer = panelElement.querySelector('.e-panel-container .e-panel-content');
        //   let availableHeight = parentContainer.offsetHeight - 20; // Adjust this value based on your design
        //   console.log('availableHeight', availableHeight)
        //   console.log('offsetHeight', offsetHeight)

        //   listboxObj.height = availableHeight + 'px';
        //   listboxObj.width = '100%';

        //   console.log(listboxObj.height, listboxObj.width, listboxObj, 'Pivot Table ');
        //   listboxObj.refresh();
        // }

      }

    }
  }

  refreshPage() {
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }

  onDeletePanel(eve: any, id: any) {
    let panelElement = ((<HTMLElement>eve.target).offsetParent);
    this.getPanelArrayDataFromLocalStorage();

    if (panelElement) {
      // console.log(panelElement.id);
      let panelId = panelElement.id
      this.panelSeriesArray = this.panelSeriesArray.filter(panel => panel.id !== panelId);
      // console.log(this.panelSeriesArray);
      this.reorganizePanelIds();
      // console.log(this.panelSeriesArray);

      // localStorage.setItem('createPanelSeriesArray', JSON.stringify(this.panelSeriesArray));


      const preprocessedPanels = this.preprocessPanelsForStorage(this.panelSeriesArray);

      // console.log('preprocessedPanels', preprocessedPanels)


      try {
        // localStorage.setItem('createPanelSeriesArray', JSON.stringify(preprocessedPanels));
        sessionStorage.setItem('createPanelSeriesArray', JSON.stringify(preprocessedPanels));


        // console.log('Panel successfully deleted and updated in sessionStorage.');
      } catch (error) {
        console.error('Error saving to sessionStorage:', error);
      }

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
      } else if (panel.panelType === 'Kanban') {
        return {
          ...panel,
          content: {
            ...panel.content,
            dataSource: []
          }
        };
      }
      return panel; // Return unmodified for other panel types
    });
  }

  copyPanel1(event: any, obj: any) {
    console.log('Duplicating panel:', obj);

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

    // console.log('panelWithMaxRow', panelWithMaxRow);

    // console.log(' this.panelSeriesArray', this.panelSeriesArray)
    // Calculate new row and col for the duplicated panel
    const newRow = lastRow + lastSizeY;
    const newCol = obj.col; // Retain the same column

    // Create a new panel object by cloning the original and modifying required fields
    const newPanel = {
      id: `layout_${newNumericId}`,
      row: newRow,
      col: 0,
      "sizeX": obj.sizeX,
      "sizeY": obj.sizeY,
      header: `${this.panelType} ${newNumericId}`,
      connection_id: obj.connection_id,

      "content": obj.content,
      "panelType": obj.panelType,

    };


    // Push the new panel to the panelSeriesArray
    this.panelSeriesArray.push(newPanel);

    // Update the session storage
    const panelSeriesArrayString = JSON.stringify(this.panelSeriesArray);
    sessionStorage.setItem('createPanelSeriesArray', panelSeriesArrayString);

    // console.log('New panel created:', newPanel);
  }

  copyPanel2(event: any, obj: any) {
    // console.log('Duplicating panel:', obj);

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

    // console.log(`Panel farthest from top:`, panelWithMaxDistance);

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

    // console.log('New panel created:', newPanel);
  }

  copyPanel(event: any, obj: any) {
    // console.log('Duplicating panel:', obj);

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

    // console.log(`Panel farthest from top:`, panelWithMaxDistance);
    // console.log(`Bottom-most panel row + sizeY:`, maxEndRow);

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

    // Update session storage
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
    // console.log('preprocessedPanels', preprocessedPanels);

    try {
      sessionStorage.setItem('createPanelSeriesArray', JSON.stringify(preprocessedPanels));
      // console.log('Panel successfully added and updated in sessionStorage.');
    } catch (error) {
      console.error('Error saving to sessionStorage:', error);
    }

    // console.log('New panel created:', newPanel);
  }

  onEditPanel1(event: any, index: any) {
    // console.log(event)
    this.formPopup.show();
    let panelElement = ((<HTMLElement>event.target).offsetParent);
    this.getPanelIndex = index;
    // console.log(index)
    if (panelElement) {
      this.getPanelArrayDataFromLocalStorage();
      let panelId = panelElement.id;
      let panel: any = this.panelSeriesArray.find((panel) => panel.id === panelId);
      // let storeConnectionObj: any = localStorage.getItem('connectionIdObj')
      let storeConnectionObj: any = sessionStorage.getItem('connectionIdObj')


      // console.log("On Edit Panel", panel);

      if (storeConnectionObj != null || storeConnectionObj != undefined) {
        storeConnectionObj = JSON.parse(storeConnectionObj);
        // console.log(storeConnectionObj, 'storeConnectionObj');
        this.connectionId = storeConnectionObj.connection_Id;


        // console.log(this.connectionId)
        panel = {
          ...panel,
          connection_id: this.connectionId

        }

        this.panelHeader = `Create Panel - ${panel.panelType}`

        // console.log("On Edit this.panelSeriesArray",this.panelSeriesArray);
        // console.log("On Edit Panel",panel);
        this.panelSeriesArray.splice(this.getPanelIndex, 1, panel);
        // localStorage.setItem('createPanelSeriesArray', JSON.stringify(this.panelSeriesArray));

        const preprocessedPanels = this.preprocessPanelsForStorage(this.panelSeriesArray);

        // console.log('preprocessedPanels', preprocessedPanels)

        try {
          // localStorage.setItem('createPanelSeriesArray', JSON.stringify(preprocessedPanels));
          sessionStorage.setItem('createPanelSeriesArray', JSON.stringify(preprocessedPanels));


          // console.log('Panel successfully deleted and updated in localStorage.');
        } catch (error) {
          console.error('Error saving to localStorage:', error);
        }

        this.sendEditPanelObj = panel;
        // console.log(' this.sendEditPanelObj', this.sendEditPanelObj)
        this.panelType = panel.panelType;
        this.selectedPanelType = panel.panelType;


      }


    }


  }

  currentScrollPosition: any;


  onEditPanel2(event: any, index: any) {

    let panelElement = ((<HTMLElement>event.target).offsetParent);
    if (!panelElement) return;
    this.getPanelIndex = index;
    console.log('window.scrollY', window.scrollY)

    let currentPosition = window.scrollY

    this.formPopup.position = { X: 'center', Y: currentPosition + 100 }; // Show below the clicked panel
    setTimeout(() => {
      window.scrollTo(0, currentPosition);
    }, 10);

    // this.currentScrollPosition = window.scrollY;

    if (panelElement) {
      this.getPanelArrayDataFromLocalStorage();
      let panelId = panelElement.id;
      let panel: any = this.panelSeriesArray.find((panel) => panel.id === panelId);

      let storedConnectionId: any = sessionStorage.getItem('connectionIdObj')

      this.panelHeader = `Create Panel - ${panel.panelType}`

      if (storedConnectionId != null || storedConnectionId != undefined) {
        storedConnectionId = JSON.parse(storedConnectionId);

        this.connectionId = storedConnectionId.connection_Id;

        // console.log(this.connectionId)
        panel = {
          ...panel,
          connection_id: this.connectionId

        }

        this.sendEditPanelObj = panel;
        this.panelType = panel.panelType;
        this.selectedPanelType = panel.panelType;
        this.formPopup.show()
      }

    }


  }

  onEditPanel(event: any, index: any) {
    const panelElement = (<HTMLElement>event.target).offsetParent;
    if (!panelElement) return;

    this.getPanelIndex = index;
    const currentScrollY = window.scrollY;

    this.getPanelArrayDataFromLocalStorage();
    const panelId = panelElement.id;
    let panel: any = this.panelSeriesArray.find((panel) => panel.id === panelId);

    const storedConnectionId = sessionStorage.getItem('connectionIdObj');

    this.panelHeader = `Create Panel - ${panel.panelType}`;

    if (storedConnectionId) {
      const connectionObj = JSON.parse(storedConnectionId);
      this.connectionId = connectionObj.connection_Id;

      panel = {
        ...panel,
        connection_id: this.connectionId
      };

      this.sendEditPanelObj = panel;
      this.panelType = panel.panelType;
      this.selectedPanelType = panel.panelType;

      // STEP 1: Set position first
      this.formPopup.position = { X: 'center', Y: currentScrollY + 100 };
      // this.formPopup.show();
      // STEP 2: Delay the show slightly to allow position to take effect properly
      setTimeout(() => {
        this.formPopup.show();

        // STEP 3: (Optional) Refresh popup layout if it still shifts
        // @ts-ignore
        if (this.formPopup.refreshPosition) {
          this.formPopup.refreshPosition(); // Syncfusion Dialog has this method
        }

        window.scrollTo(0, currentScrollY);
      }, 50); // 50ms ensures DOM is ready
    }
  }


  getEditBoxObj(event: any) {
    console.log(event);
    //this.loaderFlag = false;
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

        console.log('âœ” Total Valid Seconds:', total);
        console.log('data', data);

        // Update the dataSource with transformed data
        boxObj.content.dataSourceSettings.dataSource = data;
      }

      // Process boxObj and resObj
      this.childPanelObj = boxObj;
      this.getPanelArrayDataFromLocalStorage();

      this.panelSeriesArray.splice(this.getPanelIndex, 1, this.childPanelObj);

      let emptyDatasourceArr = this.panelSeriesArray.map((ele: any) => {
        let obj: any = ele
        if (ele.panelType != 'Chart') {
          obj = {
            ...obj,
            content: {
              ...obj.content,
              dataSource: []
            }
          }
        }
        return obj
      })
      // localStorage.setItem('createPanelSeriesArray', JSON.stringify(emptyDatasourceArr));

      const preprocessedPanels = this.preprocessPanelsForStorage(this.panelSeriesArray);

      console.log('preprocessedPanels', preprocessedPanels)

      try {
        // localStorage.setItem('createPanelSeriesArray', JSON.stringify(preprocessedPanels));
        sessionStorage.setItem('createPanelSeriesArray', JSON.stringify(preprocessedPanels));


        console.log('Panel successfully deleted and updated in sessionStorage.');
      } catch (error) {
        console.error('Error saving to sessionStorage:', error);
      }

      const resSuccess = resObj.resSuccess;
      const resMessage = resObj.resMessage;
      const statusCode = resObj.statusCode;

      if (resSuccess === false) {
        // this.showPopup(resSuccess, '35px', resMessage)
        this.popupService.showPopup({
          message: resMessage,
          statusCode: statusCode,
          status: resSuccess
        });
      }
    }
  }


  private getPanelArrayDataFromLocalStorageOld() {
    // let panelData = localStorage.getItem('createPanelSeriesArray');
    let panelData = sessionStorage.getItem('createPanelSeriesArray');


    if (panelData !== null) {
      const parsedArray = JSON.parse(panelData);

      this.panelSeriesArray = parsedArray.map((parsedObj: any) => {
        // Find the corresponding object in this.panelSeriesArray
        const existingObj = this.panelSeriesArray.find((existingObj) => existingObj.id === parsedObj.id);

        // Use existing dataSource value if available, otherwise set to an empty array
        const dataSourceValue = existingObj ? existingObj.content.dataSource : [];

        // Create a new object with values from parsedObj and existing dataSource
        const modifiedObj = {
          ...parsedObj,
          content: {
            ...parsedObj.content,
            dataSource: dataSourceValue
          }
        };

        return modifiedObj;
      });
    } else {
      this.panelSeriesArray = [];
    }
  }


  private getPanelArrayDataFromLocalStorage() {
    // console.log('panelsarr', this.panelSeriesArray);
    // let panelData = localStorage.getItem('createPanelSeriesArray');
    let panelData = sessionStorage.getItem('createPanelSeriesArray');



    if (panelData !== null) {
      const parsedArray = JSON.parse(panelData);
      // console.log('panelsarr after storage', this.panelSeriesArray);

      this.panelSeriesArray = parsedArray.map((parsedObj: any) => {
        const existingObj = this.panelSeriesArray.find((existingObj) => existingObj.id === parsedObj.id);

        // console.log(existingObj);

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
          }
          else {
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
        } else if (parsedObj.panelType === 'Kanban') {
          modifiedObj = {
            ...parsedObj,
            content: {
              ...parsedObj.content,
              dataSource: dataSourceVal
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


  onPositionLocalstorageChange(args: any) {
    const changedPanels = args.changedPanels;

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

            this.changeDetectorRef.detectChanges();
          }
        }
      }
    }
  }
  onPositionChange(args: any) {
    const changedPanels = args.changedPanels;
    //  console.log('this.panelSeriesArray', this.panelSeriesArray)
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

            // console.log('panelData', panelData)

            // localStorage.setItem('createPanelSeriesArray', JSON.stringify(panelData));
            sessionStorage.setItem('createPanelSeriesArray', JSON.stringify(panelData));

            // Manually trigger change detection to update the view
            this.changeDetectorRef.detectChanges();
          }
        }
      }
    }
  }

  pivotHeight: string = '200';

  boxHeight: string = '150';


  onTitleSearch(eve: any) {

    let val = eve.target.value;
    // console.log(val)

    this.chartService.getDashboardByDashboardName(val).subscribe(
      (res: any) => {
        // console.log(res)
      }
    )

  }
  views = ['Week', 'Month', 'TimelineWeek', 'TimelineMonth', 'TimelineDay', 'MonthAgenda', 'TimelineYear', 'Agenda'];
  onDashboardTitleSubmitNew() {
    let uniqueID = uuidv4();
    let formValue = this.dashboardTitleForm.value;
    let connectionString: string = "";

    // let storedConnectionId: any = localStorage.getItem('connectionIdObj');
    let storedConnectionId: any = sessionStorage.getItem('connectionIdObj');



    if (storedConnectionId != null || storedConnectionId != undefined) {
      storedConnectionId = JSON.parse(storedConnectionId);
      // console.log(storedConnectionId, 'storedConnectionId');
      connectionString = storedConnectionId.connectionName;

      this.connectionId = storedConnectionId.connection_Id
    }


    let dashboardApiObj = {
      "dashboard_id": "dashboard_" + uniqueID,
      "dashboard_name": "TNA-TNI Dashboard Fk",
      "dashboard_setup": {
        "dashboardObj": {
          "allowFloating": false,
          "allowDragging": true,
          "showGridLines": true,
          "cellAspectRatio": "100/80",
          "cellSpacing": [10, 10],
          "allowResizing": true,
          "connection_id": this.connectionId,
          "connection_Name": connectionString,

          "roleMapping": this.roleMappingObj == undefined ? {} : this.roleMappingObj,
          "panels": [],
          "initialFilterObj": {
            "tableName": "combined_defenition_values_tmnnew",
            "fieldName": "created_on",
            "filterType": "month",
            "currentOrPrevious": "current",
            "previousNumber": 0,
            "startDate": "2024-12-01 04:18:01",
            "endDate": "2024-12-09 18:29:57"
          }
        }
      },
      specific_cache_exp: formValue.specific_cache_exp ? formValue.specific_cache_exp : null,
      auto_refresh: formValue.auto_refresh ? formValue.auto_refresh : 0,


      version: null,
      "image_name": formValue.dashboard_image ? this.imageName : "",
      'dashboard_image': formValue.dashboard_image ? this.imageUrl : "",
      "description": formValue.description ? formValue.description : "",
      "group_name": formValue.group_name ? formValue.group_name : [],
      "sub_group": formValue.sub_group ? formValue.sub_group : [],

      "is_active": true
    }

    this.dashboardTitlePopup.hide()
    // console.log(dashboardApiObj, 'dashboardApiObj')
    this.chartService.postDashboardCreationObj(dashboardApiObj).subscribe(
      (res: any) => {
        //  console.log('dashboard api obj', res);

        if (res.success) {
          // localStorage.removeItem('createPanelSeriesArray');
          // localStorage.removeItem('connectionIdObj');

          sessionStorage.removeItem('createPanelSeriesArray');
          sessionStorage.removeItem('connectionIdObj');



          this.router.navigate(['/sidebar/panel/dashboardHome']);
        } else {
          this.popupService.showPopup({
            message: res.message,
            statusCode: res.status_code,
            status: res.success
          });
        }


      },
      (err: any) => {
        this.loaderService.hide();

        this.popupService.showPopup({
          message: err.message,
          statusCode: err.status,
          status: false
        });
      }
    )


  }

  onDashboardTitleSubmit() {
    let uniqueID = uuidv4();
    let formValue = this.dashboardTitleForm.value;


    if (this.dashboardTitleForm.valid) {
      // Handle the form submission logic
      // console.log('Form Submitted', this.dashboardTitleForm.value);

      if (this.dashboardNameListArray.includes(formValue.title)) {
        alert(`This ${formValue.title} name is already exists!.`);
      } else {
        this.getPanelArrayDataFromLocalStorage();

        // console.log(formValue, 'formValue');
        let connectionString: string = "";

        // let storedConnectionId: any = localStorage.getItem('connectionIdObj');
        let storedConnectionId: any = sessionStorage.getItem('connectionIdObj');



        if (storedConnectionId != null || storedConnectionId != undefined) {
          storedConnectionId = JSON.parse(storedConnectionId);
          // console.log(storedConnectionId, 'storedConnectionId');
          connectionString = storedConnectionId.connectionName;

          this.connectionId = storedConnectionId.connection_Id
        }

        // let storedInitialFilters = localStorage.getItem('initialFilters');
        let storedInitialFilters = sessionStorage.getItem('initialFilters');



        if (storedInitialFilters != null || storedInitialFilters != undefined) {
          storedInitialFilters = JSON.parse(storedInitialFilters);

          this.initialFilterObj = storedInitialFilters
        }

        // this.dashboardObjId = this.dashboardObjId + 1;

        let apiPanelsArr = this.panelSeriesArray.map((ele: any) => {

          console.log('ele', ele)
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
          } else if (ele.panelType == "Box" || ele.panelType == "DropdownList" || ele.panelType == "ListBox" || ele.panelType == 'MultiSelectDropDown' || ele.panelType == 'InputBox') {
            return {
              ...ele,
              content: {
                ...ele.content,
                dataSource: [],
              }
            }
          } else if (ele.panelType == 'Calender') {
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
          else if (ele.panelType == "Kanban") {
            return {
              ...ele,
              content: {
                ...ele.content,
                dataSource: []
              }
            }
          }

          else if (ele.panelType == "DatePicker" || ele.panelType == "DateRangePicker" || ele.panelType == "RawDataDump" || ele.panelType == 'Card') {
            return {
              ...ele
            }
          } else {
            return {
              ...ele
            }
          }

        })

        console.log('apiPanelsArr', apiPanelsArr)

        if (apiPanelsArr.length === 0) {
          alert('Please add panels to your dashboard before submitting.');
        } else {
          // console.log(apiPanelsArr)

          let hasEmptyPanel = false;

          this.panelSeriesArray.forEach((ele: any) => {
            if (ele.panelType === 'Card') {
              // hasEmptyPanel = false
              return; // Skip this iteration
            }
            const panelKeys = Object.keys(ele.content);
            if (!panelKeys.includes('tableName')) {
              hasEmptyPanel = true;
            }
          });



          if (hasEmptyPanel) {
            alert("Please do not submit the dashboard with an empty panel.");
          } else {

            let dashboardApiObj = {
              "dashboard_id": "dashboard_" + uniqueID,
              "dashboard_name": formValue.title,
              "dashboard_setup": {
                "dashboardObj": {
                  "allowFloating": this.dashboardCreationObj.allowFloating,
                  "allowDragging": true,
                  "showGridLines": true,
                  "cellAspectRatio": "100/80",
                  "cellSpacing": [10, 10],
                  "allowResizing": true,
                  "connection_id": this.connectionId,
                  "connection_Name": connectionString,
                  "roleMapping": this.roleMappingObj == undefined ? {} : this.roleMappingObj,
                  "panels": apiPanelsArr,
                  "initialFilterObj": this.initialFilterObj ? this.initialFilterObj : {}
                }
              },
              specific_cache_exp: formValue.specific_cache_exp ? formValue.specific_cache_exp : null,
              auto_refresh: formValue.auto_refresh ? formValue.auto_refresh : 0,
              version: null,
              "group_name": formValue.group_name ? formValue.group_name : [],
              "sub_group": formValue.sub_group ? formValue.sub_group : [],
              "image_name": formValue.dashboard_image ? this.imageName : "",
              'dashboard_image': formValue.dashboard_image ? this.imageUrl : "",
              "description": formValue.description ? formValue.description : "",
              "is_active": true
            }

            this.dashboardTitlePopup.hide()
            console.log(dashboardApiObj, 'dashboardApiObj')
            this.chartService.postDashboardCreationObj(dashboardApiObj).subscribe(
              (res: any) => {
                //  console.log('dashboard api obj', res);

                if (res.success) {
                  // localStorage.removeItem('createPanelSeriesArray');
                  // localStorage.removeItem('connectionIdObj');

                  sessionStorage.removeItem('createPanelSeriesArray');
                  sessionStorage.removeItem('connectionIdObj');



                  this.router.navigate(['/sidebar/panel/dashboardHome']);
                } else {
                  this.popupService.showPopup({
                    message: res.message,
                    statusCode: res.status_code,
                    status: res.success
                  });
                }


              },
              (err: any) => {
                this.loaderService.hide();

                this.popupService.showPopup({
                  message: err.message,
                  statusCode: err.status,
                  status: false
                });
              }
            )
          }


        }

      }
    } else {
      this.dashboardTitleForm.markAllAsTouched(); // Mark all fields as touched to show validation messages
    }


  }

  onPopupOpen(args: any, item: any) {
    console.log('onPopupOpen args', args, item.content.enablePopup);
    // ðŸ‘‰ Option: disable popup for event clicks

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


  submitForm() {
    this.loaderService.show()

    if (this.selectedPanelType == "Chart") {
      let validForm: any = this.PropertyChartComponent.onDashboardCreationForm();
      if (validForm) {
        this.formPopup.hide()
      } else {
        this.loaderService.hide()
      }

    }
    if (this.selectedPanelType == "Table") {

      let validForm: any = this.PropertyTableComponent.onTableFormSubmit();
      if (validForm) {
        this.formPopup.hide()
      } else {
        this.loaderService.hide()
      }
    }
    if (this.selectedPanelType == "Pivot") {
      this.loaderService.hide()
      this.PivotPropertiesComponent.onGeneralFormSubmit();
      this.formPopup.hide()

    }
    if (this.selectedPanelType == "Box") {

      let validForm: any = this.PropertyBoxComponent.onBoxFormSubmit();
      if (validForm) {
        this.formPopup.hide()
      } else {
        this.loaderService.hide()

      }

    }
    if (this.selectedPanelType == "ListBox") {

      let validForm: any = this.ListboxPropertiesComponent.onBoxFormSubmit();

      if (validForm) {
        this.formPopup.hide()
      } else {
        this.loaderService.hide()
      }

    }
    if (this.selectedPanelType == "DropdownList") {

      let validForm: any = this.DropdownPropertiesComponent.onBoxFormSubmit();

      if (validForm) {
        this.formPopup.hide()
      } else {
        this.loaderService.hide()
      }

    }
    if (this.selectedPanelType == "DatePicker") {

      let validForm: any = this.DatepickerComponent.onBoxFormSubmit();;

      if (validForm) {
        this.formPopup.hide()
      } else {
        this.loaderService.hide()
      }


    }
    if (this.selectedPanelType == "DateRangePicker") {

      let validForm: any = this.DaterangepickerComponent.onBoxFormSubmit();

      if (validForm) {
        this.formPopup.hide()
      } else {
        this.loaderService.hide()
      }


    } if (this.selectedPanelType == "Kanban") {
      let validForm: any = this.KanbanComponent.onKanbanFormSubmit();

      if (validForm) {
        this.formPopup.hide();
      } else {
        this.loaderService.hide();
      }
    }
    if (this.selectedPanelType == "Gauge") {
      let validForm: any = this.guageChartPropertiesComponent.onDashboardCreationForm();

      if (validForm) {
        this.formPopup.hide();
      } else {
        this.loaderService.hide();
      }
    }
    if (this.selectedPanelType == "MultiSelectDropDown") {

      let validForm: any = this.PropertyMultiselectdropdownComponent.onBoxFormSubmit();
      if (validForm) {
        this.formPopup.hide()
      } else {
        this.loaderService.hide()
      }

    }

    if (this.selectedPanelType == "InputBox") {

      let validForm: any = this.InputBoxPropertiesComponent.onBoxFormSubmit();

      if (validForm) {
        this.formPopup.hide()
      } else {
        this.loaderService.hide()
      }

    }


    if (this.selectedPanelType == "RawDataDump") {

      const isFormValid = this.RawdatadumpComponent.onSubmit();
      console.log('isFormValid', isFormValid)

      if (isFormValid) {
        this.formPopup.hide();
      } else {
        this.loaderService.hide()

      }
    }

    if (this.selectedPanelType == "Card") {

      // const isFormValid = this.CardTemplateComponent.onBoxFormSubmit();
      // console.log('isFormValid', isFormValid)
      this.CardTemplateComponent.onBoxFormSubmit();
      this.loaderService.hide()
      this.formPopup.hide();


    }


    if (this.selectedPanelType == "Calender") {


      // this.PropertySceduleComponent.onSubmit();
      // this.loaderService.hide()
      // this.formPopup.hide();

      let validForm: any = this.PropertySceduleComponent.onSubmit();
      if (validForm) {
        this.formPopup.hide()
      } else {
        this.loaderService.hide()

      }



    }



    setTimeout(() => {
      window.scrollTo({ top: this.currentScrollPosition, behavior: "smooth" });
    }, 0);
  }

  onDashboardSave() {
    this.dashboardTitlePopup.show()
  }

  // initial filters
  sendfilterObj: any;
  initialFilterObj: any;

  applyInititalFilters() {
    this.initalFilterPopup.show()
    // let storedConnectionId: any = localStorage.getItem('connectionIdObj');
    let storedConnectionId: any = sessionStorage.getItem('connectionIdObj');



    if (storedConnectionId != null || storedConnectionId != undefined) {
      storedConnectionId = JSON.parse(storedConnectionId);
      console.log(storedConnectionId, 'storedConnectionId');
      this.connectionId = storedConnectionId.connection_Id


      let obj = {
        connection_id: this.connectionId,
        ...this.initialFilterObj
      }
      console.log(obj)

      this.sendfilterObj = obj

      // let storedInitialFIlters: any = localStorage.getItem('initialFilters');
      let storedInitialFIlters: any = sessionStorage.getItem('initialFilters');



      if (storedInitialFIlters != null || storedInitialFIlters != undefined) {
        storedInitialFIlters = JSON.parse(storedInitialFIlters);
        console.log(storedInitialFIlters)
        this.initialFilterObj = storedInitialFIlters
        let obj = {
          connection_id: this.connectionId,
          ...this.initialFilterObj
        }
        console.log(obj)

        this.sendfilterObj = obj
      }


    }
  }

  initialFilterSubmitClose() {
    this.InitialFiltersComponent.onInitialFilterSubmit()

    this.initalFilterPopup.hide()
  }

  initialFilterDeleteClose() {
    this.InitialFiltersComponent.deleteInitialFilter()

    this.initalFilterPopup.hide()

  }


  getInitialFIlters(eve: any) {
    this.initialFilterObj = eve;
    console.log(this.initialFilterObj)
    // localStorage.setItem('initialFilters', JSON.stringify(this.initialFilterObj))
    sessionStorage.setItem('initialFilters', JSON.stringify(this.initialFilterObj))


  }


  // code for ai chatbot 
  @ViewChild('dialogAIAssistView')
  dialogAIAssistView!: AIAssistViewComponent;
  @ViewChild('AssistViewDlg')
  AssistViewDlg!: DialogComponent;

  openChatbot() {
    console.log('this.loggedUserInformationData', this.loggedUserInformationData)
    this.AssistViewDlg.show();
    this.userMessage = `Hello ${this.loggedUserInformationData.username}, How can i help you`;
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
    this.AssistViewDlg.visible = !this.AssistViewDlg.visible;
  };

  assistViewToolbarSettings: any = {
    items: [{ iconCss: 'e-icons e-close', align: 'Right' }],
    itemClicked: this.toolbarItemClicked
  };

  responseToolbarSettings: ResponseToolbarSettingsModel = {
    itemClicked: this.toolbarItemClicked
  };

  promptRequestOld = (args: PromptRequestEventArgs) => {
    console.log('args prompt', args)
    setTimeout(() => {
      var foundPrompt = this.prompts.find((promptObj) => promptObj['prompt'] === args.prompt);
      var defaultResponse = 'For real-time prompt processing, connect the AI AssistView control to your preferred AI service, such as OpenAI or Azure Cognitive Services. Ensure you obtain the necessary API credentials to authenticate and enable seamless integration.';

      this.dialogAIAssistView.addPromptResponse(foundPrompt ? foundPrompt['response'] : defaultResponse);
      this.dialogAIAssistView.promptSuggestions = foundPrompt?.['suggestions'] as string[] || this.suggestions;

    }, 2000);
  };

  // old code
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

  userMessage: string = '';
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

        if (res[0].error) {
          foundPrompt = 'No relevant information was found based on the documentation';
          this.dialogAIAssistView.addPromptResponse(foundPrompt);

        }

        let suggessions = resData.Suggestions

        console.log('foundPrompt ', foundPrompt);

        let defaultResponse = 'No relevant information was found based on the documentation';

        let suggestionArray: string[] = [];

        this.dialogAIAssistView.addPromptResponse(foundPrompt ? foundPrompt : defaultResponse);

        if (suggessions) {
          const parser = new DOMParser();
          const doc = parser.parseFromString(suggessions, 'text/html');
          const listItems = doc.querySelectorAll('li');
          suggestionArray = Array.from(listItems).map(item => item.textContent?.trim() || '');

          console.log('suggestionArray', suggestionArray);
          this.dialogAIAssistView.promptSuggestions = resData ? suggestionArray : this.suggestions;

        }
      },

      (err: any) => {
        console.log('err', err)
      })

    setTimeout(() => {


    }, 2000);
  };


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

      console.log('ðŸ“Œ Total header cells found:', allHeaders.length);

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

        console.log('ðŸ“Œ Processing header:', headerText, 'Classes:', headerElement.className);

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
            // âœ… Apply styles with !important to prevent overriding
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

            // âœ… Also apply to nested .e-cellvalue
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

    // âœ… Apply immediately
    applyFormatting();

    // âœ… Re-apply after a delay to catch any re-renders
    setTimeout(() => applyFormatting(), 100);
    setTimeout(() => applyFormatting(), 300);
    setTimeout(() => applyFormatting(), 500);
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



  // legend and tooltip code for gauge 

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
}
