import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";

import { AppComponent } from './app.component';
import { ColumnMenuService, CommandColumnService, FilterService, ForeignKeyService, FreezeService, GridModule, GroupService, PageService, PdfExportService, ResizeService, SortService, ToolbarService, ReorderService, RowDDService, PagerModule,  SelectionService as GridSelectionService , ExcelExportService as GridExcelExportService} from '@syncfusion/ej2-angular-grids';

import { AccumulationChartAllModule, AccumulationChartModule, AccumulationDataLabelService, AccumulationDistributionIndicatorService, AccumulationLegend, AccumulationLegendService, AreaSeriesService, AtrIndicatorService, BarSeriesService, BollingerBandsService, BoxAndWhiskerSeriesService, BubbleSeriesService, CategoryService, ChartAllModule, ChartAnnotationService, ChartModule, ColumnSeriesService, DataLabel, DataLabelService, DateTimeCategoryService, DateTimeService, ErrorBarService, HiloOpenCloseSeriesService, HiloSeriesService, HistogramSeriesService, LegendService, LineSeriesService, LogarithmicService, MultiColoredLineSeriesService, MultiLevelLabel, MultiLevelLabelService, ParetoSeriesService, PieSeriesService, PolarSeriesService, PyramidSeriesService, RadarSeriesService, RangeAreaSeriesService, RangeColumnSeriesService, RangeStepAreaSeriesService, ScatterSeriesService, SelectionService, SplineAreaSeriesService, SplineRangeAreaSeriesService, SplineSeriesService, StackingAreaSeriesService, StackingBarSeriesService, StackingColumnSeriesService, StackingLineSeriesService, StackingStepAreaSeriesService, StepAreaSeriesService, StepLineSeriesService, TooltipService, TrendlinesService, WaterfallSeriesService } from '@syncfusion/ej2-angular-charts';

import { DashboardLayoutModule } from '@syncfusion/ej2-angular-layouts';
import {  AccordionModule, MenuAllModule, SidebarModule, TabModule, ToolbarModule } from '@syncfusion/ej2-angular-navigations';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
// import { FooterComponent } from './shared/footer/footer.component';
import { ListViewModule } from '@syncfusion/ej2-angular-lists';
// import { Dashboard1Component } from './dashboardpanelModule/UnUsedComponents/dashboard1/dashboard1.component';
import { CheckBoxSelectionService, DropDownListModule, ListBoxModule, MultiSelectAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { DialogModule } from '@syncfusion/ej2-angular-popups';
import { ButtonModule, CheckBoxModule, ChipListModule, FabModule, SwitchModule } from '@syncfusion/ej2-angular-buttons';
import { ColorPickerModule, NumericTextBoxModule, UploaderModule } from '@syncfusion/ej2-angular-inputs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './components/login/login.component';


// import { DashboardViewComponent } from './dashboardpanelModule/UnUsedComponents/dashboard-view/dashboard-view.component';


// import { EditableDashboardComponent } from './dashboardpanelModule/UnUsedComponents/editable-dashboard/editable-dashboard.component';


import { CalculatedFieldService, ConditionalFormattingService, DrillThroughService, FieldListService, GroupingBarService, NumberFormattingService, PivotFieldListAllModule, PivotViewAllModule, PivotViewModule , ExcelExportService, PDFExportService, PagerService, VirtualScrollService} from '@syncfusion/ej2-angular-pivotview';

// import { ChartExpressionComponent } from './dashboardpanelModule/UnUsedComponents/chart-expression/chart-expression.component';
// import { ChartConditionComponent } from './dashboardpanelModule/UnUsedComponents/chart-condition/chart-condition.component';


// import { LoginPageComponent } from './Auth Pages/login-page/login-page.component';
// import { RegistrationPageComponent } from './Auth Pages/registration-page/registration-page.component';


// import { DashboardCreateFormComponent } from '../chartpanel/allComps/dashboard-create-form/dashboard-create-form.component';


// import { TablePropertiesComponent } from './Dashboards/properties/table-properties/table-properties.component';

// import { CreatePivotTableComponent } from './Dashboards/properties/create-pivot-table/create-pivot-table.component';

// import { DashboardEditComponent } from '../chartpanel/allComps/dashboard-edit/dashboard-edit.component';

import { DatePickerModule, DateRangePickerModule } from '@syncfusion/ej2-angular-calendars';
// import { ListBoxFilterPropertiesComponent } from './Dashboards/properties/list-box-filter-properties/list-box-filter-properties.component';
// import { DropdownListFilterProperitesComponent } from './Dashboards/properties/dropdown-list-filter-properites/dropdown-list-filter-properites.component';
// import { DatePickerPropertiesComponent } from './Dashboards/properties/date-picker-properties/date-picker-properties.component';
// import { DateRangePickerPropertiesComponent } from './Dashboards/properties/date-range-picker-properties/date-range-picker-properties.component';
import { DatePipe } from '@angular/common';

//import { RoleFormPageComponent } from './Auth Pages/role-form-page/role-form-page.component';
// import { DatabaseConnectionComponent } from './Auth Pages/database-connection/database-connection.component';
// import { TableJointsComponent } from './Auth Pages/table-joints/table-joints.component';
import { ProgressBarAllModule } from '@syncfusion/ej2-angular-progressbar';
import { TokenInterceptorInterceptor } from './core/AuthServices/token-interceptor.interceptor';
// import { UserBasedAccessComponent } from './Auth Pages/user-based-access/user-based-access.component';
//import { RoleBasedAccessComponent } from './Auth Pages/role-based-access/role-based-access.component';
// import { UploadFileToDBComponent } from './Auth Pages/upload-file-to-db/upload-file-to-db.component';
import { MessageModule } from '@syncfusion/ej2-angular-notifications';
// import { UserBaseAccessComponent } from './Auth Pages/user-base-access/user-base-access.component';

// import { RoleBasedDashboardAcessComponent } from './Auth Pages/role-based-dashboard-acess/role-based-dashboard-acess.component';
// import { ChartpanelModule } from 'src/chartpanel/chartpanel.module';
import { DashboardPanelModule } from './dashboardpanelModule/dashboard-panel.module';
import { LogaccessService } from './core/AuthServices/logaccess.service';
import { ChartService } from './core/services/chart.service';
import { SharedComponentModule } from './shared-component/shared-component.module';
// import { DashboardPagesModule } from './dashboard-pages/dashboard-pages.module';
import { FilterPipe } from './core/services/filter.pipe';
import { TimeOutInterceptor } from './core/AuthServices/time-out.interceptor';
import { SessionExpirationInterceptor } from './core/AuthServices/session-expiration.interceptor';
import { OrdersService } from './dashboardpanelModule/panelComponents/paging-table/orderService';
import { SidebarNavbarComponent } from './shared/sidebar-navbar/sidebar-navbar.component';
import { ScrollService } from './core/scroll.service';
import { LinkService, ImageService, HtmlEditorService,   ToolbarService as RichTextEditorToolbarService } from '@syncfusion/ej2-angular-richtexteditor';
// import { ProfilePageComponent } from './UserSettingsPages/user-settings/profile-page/profile-page.component';
// import { SecurityPageComponent } from './UserSettingsPages/user-settings/security-page/security-page.component';
import { UserSettingsSidebarComponent } from './UserSettingsPages/user-settings-sidebar/user-settings-sidebar.component';
import { UserSettingsModule } from './UserSettingsPages/user-settings/user-settings.module';
import { AgendaService, DayService, DragAndDropService as DragAndDropScedularService, ICalendarExportService, ICalendarImportService, MonthAgendaService, MonthService, ScheduleModule, TimelineMonthService, TimelineViewsService, TimelineYearService, WeekService, WorkWeekService, YearService , ExcelExportService as ScedularExcelExportService, ResizeService as ScedularResizeService } from '@syncfusion/ej2-angular-schedule';
// import { LinkService, ImageService, HtmlEditorService,   ToolbarService as RichTextEditorToolbarService } from '@syncfusion/ej2-angular-richtexteditor';
import {CircularGaugeModule} from '@syncfusion/ej2-angular-circulargauge';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    // FooterComponent,
    // Dashboard1Component,
    LoginComponent,

    // LoginPageComponent,
    // RegistrationPageComponent,
    // DashboardCreateFormComponent,
    // TablePropertiesComponent,
    // CreatePivotTableComponent,
    // DashboardEditComponent,
    // ListBoxFilterPropertiesComponent,
    // DropdownListFilterProperitesComponent,
    // DatePickerPropertiesComponent,
    // DateRangePickerPropertiesComponent,
   // RoleFormPageComponent,
    // DatabaseConnectionComponent,
    // TableJointsComponent,
    // UserBasedAccessComponent,
    //RoleBasedAccessComponent,
    // UploadFileToDBComponent,
    // UserBaseAccessComponent,

    FilterPipe,
     SidebarNavbarComponent,
    //  ProfilePageComponent,
    //  SecurityPageComponent,
     UserSettingsSidebarComponent,
  
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    // UploaderModule,
    DashboardPanelModule,
    // DashboardPagesModule,
    FormsModule,
    ReactiveFormsModule,
    SharedComponentModule,
    PagerModule,
    UserSettingsModule,
    CircularGaugeModule,
    // ColorPickerModule,
    // ToolbarModule,
    // MessageModule,
    // GridModule,
    // ChartModule,
    // ChartAllModule,
    // MenuAllModule,
    // AccumulationChartModule ,
    // AccumulationChartAllModule ,
    // HttpClientModule,
    // DashboardLayoutModule ,
    // ListViewModule,
    // SidebarModule,
    // DropDownListModule,
    // DialogModule ,
    // ButtonModule ,
    // AccordionModule,
    // NumericTextBoxModule,
    // ChipListModule,
    // FormsModule,
    // ReactiveFormsModule,
    // TabModule,
    // MultiSelectModule,
    // SwitchModule,
    // GridModule,
    // PivotViewAllModule,
    // PivotFieldListAllModule,
    // CheckBoxModule,
    // MultiSelectAllModule,
    // ToolbarModule,
    // DateRangePickerModule,
    // DatePickerModule,
    // ListBoxModule,
    // ProgressBarAllModule,
    // FabModule,
    // ChartpanelModule,
    // ScheduleModule
  ],

  
  providers: [
    ChartService,
    LogaccessService,
 
    LineSeriesService,VirtualScrollService,DrillThroughService,ConditionalFormattingService,
    LegendService, TooltipService, DataLabelService, CategoryService, DateTimeCategoryService, DateTimeService, 
    LogarithmicService, MultiLevelLabelService, MultiColoredLineSeriesService,LineSeriesService, SplineSeriesService,StepLineSeriesService, StackingLineSeriesService,AreaSeriesService , SplineAreaSeriesService,
    RangeStepAreaSeriesService,FieldListService,CommandColumnService,PDFExportService,
    RangeAreaSeriesService,
    SplineRangeAreaSeriesService,DatePipe,
    StackingAreaSeriesService ,
    StackingStepAreaSeriesService , RowDDService, RadarSeriesService, 
    SelectionService, CheckBoxSelectionService, PolarSeriesService , GridSelectionService,
    DayService, WeekService, WorkWeekService, MonthService, AgendaService, MonthAgendaService, TimelineViewsService, TimelineMonthService, YearService, ICalendarImportService, ICalendarExportService, ScedularExcelExportService , ScedularResizeService , DragAndDropScedularService , TimelineYearService,  

    {
      provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptorInterceptor,
    multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: SessionExpirationInterceptor,
      multi: true
    },
    // {
    //   provide: HTTP_INTERCEPTORS,
    // useClass: TimeOutInterceptor,
    // multi: true,
    // },
    ColumnSeriesService, 
    RangeColumnSeriesService,
    BarSeriesService ,
    StackingColumnSeriesService ,
    StackingBarSeriesService,
    HiloSeriesService ,
    HiloOpenCloseSeriesService ,
    ScatterSeriesService,
    BubbleSeriesService,
    PieSeriesService ,PyramidSeriesService ,DataLabelService, AccumulationLegendService, AccumulationDataLabelService,
    WaterfallSeriesService,
    HistogramSeriesService,
    BoxAndWhiskerSeriesService,ErrorBarService ,TrendlinesService ,ParetoSeriesService, AccumulationDistributionIndicatorService, AtrIndicatorService, BollingerBandsService, ChartAnnotationService, PageService, SortService, FilterService,
    GroupService, ResizeService, ForeignKeyService, ToolbarService, ColumnMenuService, FreezeService,ReorderService,
    FieldListService,GroupingBarService,CalculatedFieldService, ExcelExportService, PdfExportService, OrdersService, GridExcelExportService,
    ScrollService, PagerService,
    RichTextEditorToolbarService, LinkService, ImageService, HtmlEditorService
  ],
  
  bootstrap: [AppComponent]
})
export class AppModule { }
