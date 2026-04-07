import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileSettingRoutingModule } from './profile-setting-routing.module';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserSecurityComponent } from './user-security/user-security.component';



@NgModule({
    imports: [
    CommonModule,
    ProfileSettingRoutingModule,
    UserProfileComponent,
    UserSecurityComponent
],
    exports: [
        UserProfileComponent
    ]
})
export class ProfileSettingModule { }
