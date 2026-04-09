import { Component, OnInit, ViewChild, inject} from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ClickEventArgs, SidebarComponent, ToolbarModule, SidebarModule } from '@syncfusion/ej2-angular-navigations';
import { PopupComponent } from '../../dashboardpanelModule/panel-properties/popup/popup.component';
import { ListViewModule } from '@syncfusion/ej2-angular-lists';

@Component({
    selector: 'app-user-settings-sidebar',
    templateUrl: './user-settings-sidebar.component.html',
    styleUrls: ['./user-settings-sidebar.component.scss'],
    imports: [ToolbarModule, RouterOutlet, PopupComponent, SidebarModule, ListViewModule]
})
export class UserSettingsSidebarComponent implements OnInit {

  private readonly router = inject(Router);

  ngOnInit(): void {
  }
  @ViewChild('dockBar')
  public dockBar!: SidebarComponent;
  public enableDock: boolean = true;
  public showIcon: boolean = true;
  target : any = '.dockmaincontent'
//   <i class="bi bi-key"></i>
  listFields: { [key: string]: Object } = { id: "id", text: "text", iconCss: "iconcss" };
  public ListData: { [key: string]: Object }[] = [
      { id: "1", text: "Profile", iconcss: "bi bi-person" },
      { id: "2", text: "Change Password", iconcss: "bi bi-key", 
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

