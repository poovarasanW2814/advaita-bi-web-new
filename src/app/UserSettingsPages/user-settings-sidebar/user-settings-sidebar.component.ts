import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ClickEventArgs, SidebarComponent } from '@syncfusion/ej2-angular-navigations';

@Component({
  selector: 'app-user-settings-sidebar',
  templateUrl: './user-settings-sidebar.component.html',
  styleUrls: ['./user-settings-sidebar.component.scss']
})
export class UserSettingsSidebarComponent implements OnInit {

  constructor(private router : Router) { }

  ngOnInit(): void {
  }
  @ViewChild('dockBar')
  public dockBar!: SidebarComponent;
  public enableDock: boolean = true;
  public showIcon: boolean = true;
  target : any = '.dockmaincontent'
//   <i class="fas fa-key"></i>
  listFields: { [key: string]: Object } = { id: "id", text: "text", iconCss: "iconcss" };
  public ListData: { [key: string]: Object }[] = [
      { id: "1", text: "Profile", iconcss: "fas fa-user" },
      { id: "2", text: "Change Password", iconcss: "fas fa-key", 
          }]

  toolbarCliked(args: ClickEventArgs) {
      if(args.item.tooltipText == "Menu") {
          this.dockBar.toggle();
      }
  }

  onreturnBack(){
    this.router.navigate(['/sidebar/panel/dashboardHome'])

  }
  onSelect(args: any) {
    console.log('args', args)
    let textValue = args.text;

    console.log('this.router', textValue, this.router)
    if(textValue == 'Profile'){
        // this.router.navigate(['/userprofile']);
        this.router.navigate(['/usersettings/settings/userprofile']);



    }else if ( textValue == 'Change Password'){
        // this.router.navigate(['/securityPage']);
        this.router.navigate(['/usersettings/settings/securityPage']);


       
    }

  }
}
