import {inject,  Component, HostListener, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router, NavigationEnd, RouterOutlet, RouterLinkActive, RouterLink } from '@angular/router';
import { SidebarComponent, SidebarModule } from '@syncfusion/ej2-angular-navigations';
import { filter, Subscription } from 'rxjs';
import { ChartService } from 'src/app/core/services/chart.service';
import { DashboardBasedAccessService } from 'src/app/core/services/dashboard-based-access.service';
import { MenuBasedAccessService } from 'src/app/core/services/menu-based-access.service';
import { ItemModel, DropDownButtonModule } from '@syncfusion/ej2-angular-splitbuttons';
import { LoaderComponent } from '../../dashboardpanelModule/panel-properties/loader/loader.component';
import { PopupComponent } from '../../dashboardpanelModule/panel-properties/popup/popup.component';
import { UpperCasePipe } from '@angular/common';

@Component({
    selector: 'app-sidebar-navbar',
    templateUrl: './sidebar-navbar.component.html',
    styleUrls: ['./sidebar-navbar.component.scss'],
    imports: [DropDownButtonModule, RouterOutlet, LoaderComponent, PopupComponent, SidebarModule, RouterLinkActive, RouterLink, UpperCasePipe]
})
// export class SidebarNavbarComponent implements OnInit {

//   constructor() { }

//   ngOnInit(): void {
//   }

  
  
// }
export class SidebarNavbarComponent implements OnInit, OnDestroy {
    [x: string]: any;
  
    sidebarIsOpen: boolean = false;
    windowWidth: any;
    @ViewChild('sidebarInstance')
    sidebarInstance!: SidebarComponent;
    enableDock: boolean = true;
    type: string = 'Auto';

    private menuAccessSub!: Subscription;
    private titleSub!: Subscription;
    private routerSub!: Subscription;
    smlDoclSize: string = '60px';
    target: string = '#target';
    enablesmartlabel: boolean = true;
    isExpand: boolean = true
    username: string = 'superadmin';
    showSidebar: boolean = false
    dashboard_Name: string = '';
    menuBasedAccess: any = {};
    menubasedPermissionObj: any = {}
    menuBasedPermissionArray: any = []
  
    @HostListener('window:resize', ['$event'])
    onResize(event: any): void {
      // Get the current window width
      const windowWidth = event.target.innerWidth;
      this.windowWidth = windowWidth;
      console.log('windowWidth', windowWidth)
      let sideDiv = document.getElementById('sidebar-content');
  
  
    }
    public items: ItemModel[] = [
  
      {
        text: 'User Settings',
        iconCss: 'bi bi-person-gear',
      },
      {
        text: 'Logout',
        iconCss: 'bi bi-power'
      }];
  
    onselect(eve: any) {
      const selectedValue = eve.item.properties.text;
      console.log(eve, selectedValue)
  
      switch (selectedValue) {
        case 'Logout':
          this.onLogOutCLick();
  
          break;
        case 'User Settings':
  
          this.router.navigate(['/sidebar/panel/updateUser', this.username]);
  
          break;
        default:
          break;
      }
    }
  
  
    private readonly chartService = inject(ChartService);
    private readonly fb = inject(FormBuilder);
    private readonly router = inject(Router);
    private readonly menuBasedAccessService = inject(MenuBasedAccessService);
    private readonly dashboardBasedAccessService = inject(DashboardBasedAccessService);
  
    resetSidebarHeight() {
      // Set sidebar height to the top
      const sidebar = document.getElementById('sidebar-content');
      if (sidebar) {
        console.log(sidebar.scrollTop)
  
        sidebar.scrollTop = 0;
      }
    }
  
  
  
  
  
    ngOnInit(): void {
  
      console.log('innerWidth', window.innerWidth)
      this.windowWidth = window.innerWidth;
      let sideDiv = document.getElementById('sidebar-content');
  
      if (this.windowWidth <= 760) {
        // Initially hide the sidebar for mobile view
        this.smlDoclSize = '0px';
        sideDiv?.classList.add('width3');
      } else {
        // Show the sidebar for larger screens
        this.smlDoclSize = '60px';
        sideDiv?.classList.add('width2');
      }
  
      this.routerSub = this.router.events.pipe(
        filter(_ => _ instanceof NavigationEnd)
      ).subscribe(() => {
        this.resetSidebarHeight();
      });
  
      let userData: any = sessionStorage.getItem('userInformation');
  
      if (userData) {
        userData = JSON.parse(userData);
        console.log(userData)
        this.username = userData.username;
      }
  
      this.titleSub = this.chartService.title$.subscribe(title => {
        this.dashboard_Name = title
      });
  
      this.menuAccessSub = this.menuBasedAccessService.menuAccess$.subscribe((menuAccess) => {
        this.menuBasedAccess = menuAccess;
        this.menuBasedPermissionArray = this.menuBasedAccess?.permission_details;
  
        this.menuBasedPermissionArray?.forEach((element: any) => {
          this.menubasedPermissionObj = element;
        });
  
      });
  
  
    }
  
  
    onClickMenu() {
  
      let sideDiv = document.getElementById('sidebar-content');
      let menuBar = document.querySelector('.menuBar') as HTMLElement;
      console.log(this.smlDoclSize)
      if (this.windowWidth <= 760) {
        if (this.smlDoclSize === '0px') {
          // If the sidebar is currently 0px, change it to 60px
          this.smlDoclSize = '200px';
          // sideDiv?.classList.remove('width3');
          // sideDiv?.classList.add('width2');
          // menuBar.style.left = '53pxpx';
        } else {
          // If the sidebar is currently 60px, change it to 0px
          this.smlDoclSize = '0px';
          // sideDiv?.classList.remove('width2');
          // sideDiv?.classList.add('width3');
        }
      } else {
        this.isExpand = !this.isExpand;
        // For window width greater than 320px, toggle between 60px and 200px
        if (this.smlDoclSize === '60px') {
          this.smlDoclSize = '200px';
          sideDiv?.classList.remove('width2');
          sideDiv?.classList.add('width1');
          menuBar.style.left = '211px';
        } else {
          this.smlDoclSize = '60px';
          sideDiv?.classList.remove('width1');
          sideDiv?.classList.add('width2');
          menuBar.style.left = '72px';
        }
      }
  
      console.log(this.smlDoclSize)
      // Update the sidebar width
      this.sidebarInstance['setProperties']({ dockSize: this.smlDoclSize });
      this.sidebarInstance['setProperties']({ width: this.smlDoclSize });
    }
  
  
  
    onLogOutCLick() {
  
      sessionStorage.clear()
      this.router.navigate(['login']);
  
    }

    ngOnDestroy(): void {
      this.menuAccessSub?.unsubscribe();
      this.titleSub?.unsubscribe();
      this.routerSub?.unsubscribe();
    }
  
  }
  
