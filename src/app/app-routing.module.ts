import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';

// import { RegistrationPageComponent } from './Auth Pages/registration-page/registration-page.component';

//import { RoleFormPageComponent } from './Auth Pages/role-form-page/role-form-page.component';
// import { LoginPageComponent } from './Auth Pages/login-page/login-page.component';
// import { TableJointsComponent } from './Auth Pages/table-joints/table-joints.component';
//import { RoleBasedAccessComponent } from './Auth Pages/role-based-access/role-based-access.component';
// import { UploadFileToDBComponent } from './Auth Pages/upload-file-to-db/upload-file-to-db.component';
// import { UserBaseAccessComponent } from './Auth Pages/user-base-access/user-base-access.component';

// import { RoleBasedDashboardAcessComponent } from './Auth Pages/role-based-dashboard-acess/role-based-dashboard-acess.component';
import { authGuard } from './core/AuthServices/auth.guard';
import { SidebarNavbarComponent } from './shared/sidebar-navbar/sidebar-navbar.component';
// import { ProfilePageComponent } from './UserSettingsPages/user-settings/profile-page/profile-page.component';
// import { SecurityPageComponent } from './UserSettingsPages/user-settings/security-page/security-page.component';
import { UserSettingsSidebarComponent } from './UserSettingsPages/user-settings-sidebar/user-settings-sidebar.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },

  // { path: 'userSettingSidebar', component: UserSettingsSidebarComponent },
 
  {path: 'sidebar', component: SidebarComponent, children : [

   { path: 'panel', loadChildren: () => import('./dashboardpanelModule/dashboard-panel.module').then(m => m.DashboardPanelModule) },

  ]},

  // { 
  //   path: 'userSettingSidebar', 
  //   component: UserSettingsSidebarComponent, 
  //   children: [
  //     { 
  //       path: 'userSettings', // default path for this component
  //       loadChildren: () => import('./UserSettingsPages/user-settings/user-settings.module')
  //         .then(m => m.UserSettingsModule) 
  //     }
  //   ]
  // },

  {path: 'usersettings', component: UserSettingsSidebarComponent, children : [

    { path: 'settings', loadChildren: () => import('./profile-setting/profile-setting.module').then(m => m.ProfileSettingModule) },
 
   ]},
 

  // ProfileSettingModule
  
  //  
  
];

@NgModule({
  // imports: [RouterModule.forRoot(routes)],
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
