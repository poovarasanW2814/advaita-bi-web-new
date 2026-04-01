import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileSettingRoutingModule } from './profile-setting-routing.module';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserSecurityComponent } from './user-security/user-security.component';
import { SharedComponentModule } from '../shared-component/shared-component.module';


@NgModule({
  declarations: [
    UserProfileComponent,
    UserSecurityComponent
  ],
  imports: [
    CommonModule,
    ProfileSettingRoutingModule,
    SharedComponentModule
  ],
  exports :[
    UserProfileComponent
  ]
})
export class ProfileSettingModule { }
