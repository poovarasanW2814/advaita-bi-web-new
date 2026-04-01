import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColorPickerModule, NumericTextBoxModule, UploaderModule } from '@syncfusion/ej2-angular-inputs';
import { AccordionModule, MenuAllModule, SidebarModule, TabModule, ToolbarModule } from '@syncfusion/ej2-angular-navigations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule, ChipListModule, SwitchModule, CheckBoxModule, FabModule } from '@syncfusion/ej2-angular-buttons';
import { DateRangePickerModule, DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import { ChartModule, ChartAllModule, AccumulationChartModule, AccumulationChartAllModule } from '@syncfusion/ej2-angular-charts';
import { DropDownListModule, MultiSelectModule, MultiSelectAllModule, ListBoxModule, ListBoxAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { Freeze, Grid, GridComponent, GridModule, PagerAllModule, PagerModule, RowDD } from '@syncfusion/ej2-angular-grids';
import { DashboardLayoutModule } from '@syncfusion/ej2-angular-layouts';
import { ListViewModule } from '@syncfusion/ej2-angular-lists';
import { MessageModule } from '@syncfusion/ej2-angular-notifications';
import { PivotViewAllModule } from '@syncfusion/ej2-angular-pivotview';
import { DialogModule } from '@syncfusion/ej2-angular-popups';
import { ProgressBarAllModule } from '@syncfusion/ej2-angular-progressbar';
import { DropDownButtonModule } from '@syncfusion/ej2-angular-splitbuttons';
import { KanbanModule } from '@syncfusion/ej2-angular-kanban';
import { UserSettingsModule } from '../UserSettingsPages/user-settings/user-settings.module';
import { AIAssistViewModule } from '@syncfusion/ej2-angular-interactive-chat';
import { RichTextEditorAllModule } from '@syncfusion/ej2-angular-richtexteditor';
import { ScheduleModule } from '@syncfusion/ej2-angular-schedule';
// import { ChartpanelModule } from 'src/chartpanel/chartpanel.module';

// GridComponent.Inject(RowDD, Freeze, Selection);
// Grid.Inject(RowDD, Freeze, Selection);

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    
    ColorPickerModule,
    ToolbarModule,
    UploaderModule,
    MessageModule,
    GridModule,
    ChartModule,
    ChartAllModule,
    MenuAllModule,
    AccumulationChartModule ,
    AccumulationChartAllModule ,
    HttpClientModule,
    DashboardLayoutModule ,
    ListViewModule,
    SidebarModule,
    DropDownListModule,
    DialogModule ,
    ButtonModule ,
    AccordionModule,
    NumericTextBoxModule,
    ChipListModule,
    FormsModule,
    ReactiveFormsModule,
    TabModule,
    MultiSelectModule,
    SwitchModule,
    GridModule,
    PivotViewAllModule,
    // PivotViewModule,
    // PivotFieldListAllModule,
    CheckBoxModule,
    MultiSelectAllModule,
    ToolbarModule,
    DateRangePickerModule,
    DatePickerModule,
    ListBoxModule,
    ProgressBarAllModule,
    FabModule,
    PagerModule,
    PagerAllModule,
    KanbanModule,
    ListBoxAllModule ,
    MultiSelectModule ,
    RichTextEditorAllModule,
    ScheduleModule
  ],
  exports : [
    CommonModule,
    ColorPickerModule,
    ToolbarModule,
    UploaderModule,
    MessageModule,
    GridModule,
    ChartModule,
    ChartAllModule,
    MenuAllModule,
    AccumulationChartModule ,
    AccumulationChartAllModule ,
    HttpClientModule,
    DashboardLayoutModule ,
    ListViewModule,
    SidebarModule,
    DropDownListModule,
    DialogModule ,
    ButtonModule ,
    AccordionModule,
    NumericTextBoxModule,
    ChipListModule,
    FormsModule,
    ReactiveFormsModule,
    TabModule,
    MultiSelectModule,
    SwitchModule,
    GridModule,
    PivotViewAllModule,
    // PivotFieldListAllModule,
    CheckBoxModule,
    MultiSelectAllModule,
    ToolbarModule,
    DateRangePickerModule,
    DatePickerModule,
    ListBoxModule,
    ProgressBarAllModule,
    FabModule,
    DropDownButtonModule,
    KanbanModule,
    ListBoxAllModule,
    MultiSelectModule ,
    // PivotViewModule,
    RichTextEditorAllModule,
    ScheduleModule,
    AIAssistViewModule
    // UserSettingsModule
    // ChartpanelModule
  ]
})
export class SharedComponentModule { }
