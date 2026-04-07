import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashbordPageViewwComponent } from './panelComponents/dashbord-page-vieww/dashbord-page-vieww.component';
import { DashboardPanelRoutingModule } from './dashboard-panel-routing.module';


import { PivotPropertiesComponent } from './Panel Properties/pivot-properties/pivot-properties.component';
import { DropdownPropertiesComponent } from './Panel Properties/dropdown-properties/dropdown-properties.component';
import { ListboxPropertiesComponent } from './Panel Properties/listbox-properties/listbox-properties.component';
import { DatepickerComponent } from './Panel Properties/datepicker/datepicker.component';
import { DaterangepickerComponent } from './Panel Properties/daterangepicker/daterangepicker.component';
import { CreateDashboardComponent } from './panelComponents/create-dashboard/create-dashboard.component';
import { EditDashboardComponent } from './panelComponents/edit-dashboard/edit-dashboard.component';
import { RoleMappingComponent } from './Panel Properties/role-mapping/role-mapping.component';
import { AddRolesComponent } from './panelComponents/add-roles/add-roles.component';
import { AddUsersComponent } from './panelComponents/add-users/add-users.component';
import { ConnectionDatabaseComponent } from './panelComponents/connection-database/connection-database.component';
import { UserBasedPermissionComponent } from './panelComponents/user-based-permission/user-based-permission.component';
import { RoleBasedPermissionComponent } from './panelComponents/role-based-permission/role-based-permission.component';
import { UserDashboardAccessComponent } from './panelComponents/user-dashboard-access/user-dashboard-access.component';
import { RoleDashboardAccessComponent } from './panelComponents/role-dashboard-access/role-dashboard-access.component';
import { FileUploadPageComponent } from './panelComponents/file-upload-page/file-upload-page.component';
import { PropertyChartComponent } from './Panel Properties/property-chart/property-chart.component';
import { PropertyBoxComponent } from './Panel Properties/property-box/property-box.component';
import { PropertyTableComponent } from './Panel Properties/property-table/property-table.component';
import { JoinTableComponent } from './Panel Properties/join-table/join-table.component';
import { DashbordHomepageComponent } from './panelComponents/dashbord-homepage/dashbord-homepage.component';
import { FilterPipe } from './services/filter.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UpdateUserComponent } from './Panel Properties/update-user/update-user.component';
import { PagingTableComponent } from './panelComponents/paging-table/paging-table.component';
import { DashboardRearrangeComponent } from './panelComponents/dashboard-rearrange/dashboard-rearrange.component';
import { PropertyMultiselectdropdownComponent } from './Panel Properties/property-multiselectdropdown/property-multiselectdropdown.component';
import { DashboardCardsComponent } from './panelComponents/dashboard-cards/dashboard-cards.component';
import { PopupComponent } from './Panel Properties/popup/popup.component';
import { InitialFiltersComponent } from './Panel Properties/initial-filters/initial-filters.component';
import { ResponsiveSidebarComponent } from './panelComponents/responsive-sidebar/responsive-sidebar.component';

import { LoaderComponent } from './Panel Properties/loader/loader.component';
import { RawdatadumpComponent } from './Panel Properties/rawdatadump/rawdatadump.component';
import { InputBoxPropertiesComponent } from './Panel Properties/input-box-properties/input-box-properties.component';
import { AutoCompleteModule } from '@syncfusion/ej2-angular-dropdowns';
import { CardTemplateComponent } from './Panel Properties/card-template/card-template.component';
import { UnauthorizedComponent } from './panelComponents/unauthorized/unauthorized.component';
import { DashboardPageComponent } from './panelComponents/dashboard-page/dashboard-page.component';
import { RoleBasedMultiselectDashboardPermissionComponent } from './role-based-multiselect-dashboard-permission/role-based-multiselect-dashboard-permission.component';
import { MultipleDashboardRolePermissionComponent } from './panelComponents/multiple-dashboard-role-permission/multiple-dashboard-role-permission.component';
import { MultipleDashboardUserPermissionComponent } from './panelComponents/multiple-dashboard-user-permission/multiple-dashboard-user-permission.component';

import { GroupingDashboardComponent } from './panelComponents/grouping-dashboard/grouping-dashboard.component';
import { ViewGroupedDashboardComponent } from './panelComponents/view-grouped-dashboard/view-grouped-dashboard.component';
import { PropertySceduleComponent } from './Panel Properties/property-scedule/property-scedule.component';
import { ExpandableFiltersComponent } from './Panel Properties/expandable-filters/expandable-filters.component';
import { ExpandableFiltersDisplayComponent } from './Panel Properties/expandable-filters/expandable-filters-display.component';
import { KanbanComponent } from './Panel Properties/kanban/kanban.component';
import { ColumnsModel, CardSettingsModel, SwimlaneSettingsModel, DialogSettingsModel, CardRenderedEventArgs, KanbanModule } from '@syncfusion/ej2-angular-kanban';
import { CircularGaugeModule,GaugeTooltipService, AnnotationsService, LegendService } from '@syncfusion/ej2-angular-circulargauge';
import { guageChartPropertiesComponent } from './Panel Properties/guage-chart-properties/guage-chart-properties.component';




@NgModule({
    imports: [
    CommonModule,
    DashboardPanelRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AutoCompleteModule,
    KanbanModule,
    CircularGaugeModule,
    DashbordPageViewwComponent,
    PivotPropertiesComponent,
    DropdownPropertiesComponent,
    ListboxPropertiesComponent,
    DatepickerComponent,
    DaterangepickerComponent,
    CreateDashboardComponent,
    EditDashboardComponent,
    RoleMappingComponent,
    AddRolesComponent,
    AddUsersComponent,
    ConnectionDatabaseComponent,
    UserBasedPermissionComponent,
    RoleBasedPermissionComponent,
    UserDashboardAccessComponent,
    RoleDashboardAccessComponent,
    FileUploadPageComponent,
    PropertyChartComponent,
    PropertyBoxComponent,
    PropertyTableComponent,
    JoinTableComponent,
    DashbordHomepageComponent,
    FilterPipe,
    UpdateUserComponent,
    PagingTableComponent,
    DashboardRearrangeComponent,
    PropertyMultiselectdropdownComponent,
    DashboardCardsComponent,
    PopupComponent,
    InitialFiltersComponent,
    ResponsiveSidebarComponent,
    LoaderComponent,
    RawdatadumpComponent,
    InputBoxPropertiesComponent,
    CardTemplateComponent,
    UnauthorizedComponent,
    DashboardPageComponent,
    RoleBasedMultiselectDashboardPermissionComponent,
    MultipleDashboardRolePermissionComponent,
    MultipleDashboardUserPermissionComponent,
    GroupingDashboardComponent,
    ViewGroupedDashboardComponent,
    PropertySceduleComponent,
    ExpandableFiltersComponent,
    ExpandableFiltersDisplayComponent,
    KanbanComponent,
    guageChartPropertiesComponent,
],
    exports: [
        LoaderComponent,
        PopupComponent
    ],
})
export class DashboardPanelModule { }
