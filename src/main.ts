import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';



import { registerLicense } from '@syncfusion/ej2-base';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { tokenInterceptor } from './app/core/AuthServices/token-interceptor.interceptor';
import { sessionExpirationInterceptor } from './app/core/AuthServices/session-expiration.interceptor';
import { LineSeriesService, LegendService, TooltipService, DataLabelService, CategoryService, DateTimeCategoryService, DateTimeService, LogarithmicService, MultiLevelLabelService, MultiColoredLineSeriesService, SplineSeriesService, StepLineSeriesService, StackingLineSeriesService, AreaSeriesService, SplineAreaSeriesService, RangeStepAreaSeriesService, RangeAreaSeriesService, SplineRangeAreaSeriesService, StackingAreaSeriesService, StackingStepAreaSeriesService, RadarSeriesService, SelectionService, PolarSeriesService, BarSeriesService, ColumnSeriesService, StackingBarSeriesService, StackingColumnSeriesService, ScatterSeriesService, BubbleSeriesService, WaterfallSeriesService, HistogramSeriesService, StepAreaSeriesService, AccumulationDataLabelService, AccumulationLegendService, AccumulationTooltipService, FunnelSeriesService, PyramidSeriesService, AccumulationSelectionService, PieSeriesService, ZoomService, CrosshairService, StripLineService, ScrollBarService, ExportService } from '@syncfusion/ej2-angular-charts';
import { VirtualScrollService, DrillThroughService, ConditionalFormattingService, FieldListService, PDFExportService, PagerService } from '@syncfusion/ej2-angular-pivotview';
import { CommandColumnService, RowDDService, SelectionService as GridSelectionService, PagerModule } from '@syncfusion/ej2-angular-grids';
import { DatePipe } from '@angular/common';
import { CheckBoxSelectionService } from '@syncfusion/ej2-angular-dropdowns';
import { DayService, WeekService, WorkWeekService, MonthService, AgendaService, MonthAgendaService, TimelineViewsService, TimelineMonthService, YearService, ICalendarImportService, ICalendarExportService, ExcelExportService as ScedularExcelExportService, ResizeService as ScedularResizeService, DragAndDropService as DragAndDropScedularService, TimelineYearService } from '@syncfusion/ej2-angular-schedule';
import { ScrollService } from './app/core/scroll.service';
import { ToolbarService as RichTextEditorToolbarService, LinkService, ImageService, HtmlEditorService } from '@syncfusion/ej2-angular-richtexteditor';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { AppRoutingModule } from './app/app-routing.module';
import { DashboardPanelModule } from './app/dashboardpanelModule/dashboard-panel.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CircularGaugeModule } from '@syncfusion/ej2-angular-circulargauge';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';

// registerLicense("Ngo9BigBOggjHTQxAR8/V1NGaF1cWGhIfEx1RHxQdld5ZFRHallYTnNWUj0eQnxTdEZjUXxfcHVXQ2RbWEJyXg==");

//version 22
// registerLicense("Ngo9BigBOggjHTQxAR8/V1NGaF5cXmdCf1FpRmJGdld5fUVHYVZUTXxaS00DNHVRdkdnWXdec3RcRGNYU0RyXUM=");
// registerLicense("Ngo9BigBOggjHTQxAR8/V1NGaF5cXmdCf1FpRmJGdld5fUVHYVZUTXxaS00DNHVRdkdnWXdccXRSRWlfUEJ0W0Q=");

//version 23
//registerLicense("Ngo9BigBOggjHTQxAR8/V1NHaF5cXmVCf1FpRmJGdld5fUVHYVZUTXxaS00DNHVRdkdnWH1fdnRQR2dZVEJ1V0M=");

//version 28
registerLicense("Ngo9BigBOggjHTQxAR8/V1NMaF5cXmBCf1FpRmJGdld5fUVHYVZUTXxaS00DNHVRdkdnWH1dcXRTRWhfUkFxXEE=");





bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(BrowserModule, AppRoutingModule, DashboardPanelModule, FormsModule, ReactiveFormsModule, PagerModule, CircularGaugeModule),
        provideHttpClient(withInterceptors([tokenInterceptor, sessionExpirationInterceptor])),
        LineSeriesService, VirtualScrollService, DrillThroughService, ConditionalFormattingService,
        LegendService, TooltipService, DataLabelService, CategoryService, DateTimeCategoryService, DateTimeService,
        LogarithmicService, MultiLevelLabelService, MultiColoredLineSeriesService, LineSeriesService, SplineSeriesService, StepLineSeriesService, StackingLineSeriesService, AreaSeriesService, SplineAreaSeriesService,
        RangeStepAreaSeriesService, FieldListService, CommandColumnService, PDFExportService,
        RangeAreaSeriesService,
        SplineRangeAreaSeriesService, DatePipe,
        StackingAreaSeriesService,
        StackingStepAreaSeriesService, RowDDService, RadarSeriesService,
        SelectionService, CheckBoxSelectionService, PolarSeriesService, GridSelectionService,
        BarSeriesService, ColumnSeriesService, StackingBarSeriesService, StackingColumnSeriesService,
        ScatterSeriesService, BubbleSeriesService, WaterfallSeriesService, HistogramSeriesService,
        StepAreaSeriesService, PieSeriesService, FunnelSeriesService, PyramidSeriesService,
        AccumulationDataLabelService, AccumulationLegendService, AccumulationTooltipService, AccumulationSelectionService,
        ZoomService, CrosshairService, StripLineService, ScrollBarService, ExportService,
        DayService, WeekService, WorkWeekService, MonthService, AgendaService, MonthAgendaService, TimelineViewsService, TimelineMonthService, YearService, ICalendarImportService, ICalendarExportService, ScedularExcelExportService, ScedularResizeService, DragAndDropScedularService, TimelineYearService,
        ScrollService, PagerService,
        RichTextEditorToolbarService, LinkService, ImageService, HtmlEditorService
    ]
})
  .catch(err => console.error(err));


