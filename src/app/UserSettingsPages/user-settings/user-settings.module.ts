import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfilePageComponent } from './profile-page/profile-page.component';
import { SecurityPageComponent } from './security-page/security-page.component';



@NgModule({
  declarations: [  
      ProfilePageComponent,
    SecurityPageComponent,],
  imports: [
    CommonModule,

  ],
  exports : [
    ProfilePageComponent,
    SecurityPageComponent,
  ]
})
export class UserSettingsModule { }
