

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashbordPageViewwComponent } from './panelComponents/dashbord-page-vieww/dashbord-page-vieww.component';
import { CreateDashboardComponent } from './panelComponents/create-dashboard/create-dashboard.component';
import { EditDashboardComponent } from './panelComponents/edit-dashboard/edit-dashboard.component';
import { RoleBasedPermissionComponent } from './panelComponents/role-based-permission/role-based-permission.component';
import { UserBasedPermissionComponent } from './panelComponents/user-based-permission/user-based-permission.component';
import { FileUploadPageComponent } from './panelComponents/file-upload-page/file-upload-page.component';
import { ConnectionDatabaseComponent } from './panelComponents/connection-database/connection-database.component';
import { AddUsersComponent } from './panelComponents/add-users/add-users.component';
import { AddRolesComponent } from './panelComponents/add-roles/add-roles.component';
import { DashbordHomepageComponent } from './panelComponents/dashbord-homepage/dashbord-homepage.component';
import { canDeactivateGuard } from './services/can-deactivate.guard';
import { JoinTableComponent } from './panel-properties/join-table/join-table.component';
import { UpdateUserComponent } from './panel-properties/update-user/update-user.component';
import { PagingTableComponent } from './panelComponents/paging-table/paging-table.component';
import { DashboardRearrangeComponent } from './panelComponents/dashboard-rearrange/dashboard-rearrange.component';
import { authGuard } from '../core/auth-services/auth.guard';
import { UnauthorizedComponent } from './panelComponents/unauthorized/unauthorized.component';
import { permissionResolver } from '../core/resolvers/permission.resolver';
import { GroupingDashboardComponent } from './panelComponents/grouping-dashboard/grouping-dashboard.component';
import { ViewGroupedDashboardComponent } from './panelComponents/view-grouped-dashboard/view-grouped-dashboard.component';

// const routes: Routes = [
//   { path: 'panelView/:name', component: DashbordPageViewwComponent },
//   {path : 'dashboardHome', component : DashbordHomepageComponent},
  
//   {path :'create', component : CreateDashboardComponent, canDeactivate: [CanDeactivateGuard]},
//    {path : 'edit/:id', component : EditDashboardComponent,  canDeactivate: [CanDeactivateGuard]},
//   {path:'role', component : AddRolesComponent},
//   {path : 'user', component : AddUsersComponent},
//   {path:'fileupload', component : FileUploadPageComponent},
//   {path:'databaseConnection', component:ConnectionDatabaseComponent},
//   {path : 'jointable', component : JoinTableComponent},
//   {path: 'updateUser/:username', component  : UpdateUserComponent},
//    {path : 'dashboardRearrage', component : DashboardRearrangeComponent}
// ];

export const routes: Routes = [
  { path: '', redirectTo: 'dashboardHome', pathMatch: 'full' },

  { 
    path: 'edit/:id', 
    component: EditDashboardComponent,  
    data: { formName: 'editDashboard' }, 
    canActivate: [authGuard], 
    resolve: { permissions: permissionResolver } 
  },
  { 
    path: 'panelView/:name', 
    component: DashbordPageViewwComponent,  
    data: { formName: 'viewDashboard' }, 
    canActivate: [authGuard], 
    resolve: { permissions: permissionResolver }
  },
  //old one
  // { path: 'dashboardHome', component: DashbordHomepageComponent, data: { formName: 'home' }, canActivate: [authGuard] },

  // new one
  { path: 'dashboardHome', component: ViewGroupedDashboardComponent, data: { formName: 'home' }, canActivate: [authGuard] },
  { path: 'create', component: CreateDashboardComponent, canDeactivate: [canDeactivateGuard], data: { formName: 'createDashboard' }, canActivate: [authGuard] },
  { path: 'role', component: AddRolesComponent, data: { formName: 'addRole' }, canActivate: [authGuard] },
  { path: 'user', component: AddUsersComponent, data: { formName: 'addUser' }, canActivate: [authGuard] },
  { path: 'fileupload', component: FileUploadPageComponent, data: { formName: 'fileUploadToDb' }, canActivate: [authGuard] },
  { path: 'databaseConnection', component: ConnectionDatabaseComponent, data: { formName: 'dbConnection' }, canActivate: [authGuard] },
  { path: 'jointable', component: JoinTableComponent, data: { formName: 'tableJoin' }, canActivate: [authGuard] },
  { path: 'groupingDashboard', component: GroupingDashboardComponent, data: { formName: 'home' }, canActivate: [authGuard] },
  // { path: 'groupingViewDashboard', component: ViewGroupedDashboardComponent, data: { formName: 'home' }, canActivate: [authGuard] },
  { path: 'dashboardRearrage', component: DashboardRearrangeComponent, data: { formName: 'dashboardSetup' }, canActivate: [authGuard] },
   { path: 'unauthorized', component: UnauthorizedComponent },
   {path: 'updateUser/:username', component  : UpdateUserComponent, data: { formName: 'updateUser' } },
  //  { path: '**', redirectTo: '/login' }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardPanelRoutingModule { }

// GroupingDashboardComponent