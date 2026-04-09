import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SidebarComponent } from '@syncfusion/ej2-angular-navigations';
import { LoginComponent } from 'src/app/components/login/login.component';
import { UserSettingsSidebarComponent } from '../user-settings-sidebar/user-settings-sidebar.component';
import { ProfilePageComponent } from './profile-page/profile-page.component';
import { SecurityPageComponent } from './security-page/security-page.component';

const routes: Routes = [
  // { path: '', redirectTo: 'userprofile', pathMatch: 'full' },
  // { path: 'userprofile', component: ProfilePageComponent },
  // { path: 'securityPage', component: SecurityPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class userSettingsRoutingModule { }
