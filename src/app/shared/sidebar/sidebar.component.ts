import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild, inject} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router, RouterOutlet, RouterLinkActive, RouterLink } from '@angular/router';
import { ChartTheme, IAxisLabelRenderEventArgs, ILoadedEventArgs } from '@syncfusion/ej2-angular-charts';
import { PanelModel } from '@syncfusion/ej2-angular-layouts';
import { ClickEventArgs, SelectEventArgs, TreeViewComponent, SidebarModule } from '@syncfusion/ej2-angular-navigations';
import { AnimationSettingsModel, ButtonPropsModel, DialogComponent } from '@syncfusion/ej2-angular-popups';
import { ItemModel, DropDownButtonModule } from '@syncfusion/ej2-angular-splitbuttons';
import { Browser } from '@syncfusion/ej2/base';
import { filter, first, Subscription } from 'rxjs';
import { ChartService } from 'src/app/core/services/chart.service';
import { DashboardBasedAccessService } from 'src/app/core/services/dashboard-based-access.service';
import { MenuBasedAccessService } from 'src/app/core/services/menu-based-access.service';
import { AIAssistViewComponent, PromptModel, PromptRequestEventArgs, ResponseToolbarSettingsModel, User, AIAssistViewModule } from '@syncfusion/ej2-angular-interactive-chat';
import { UserService } from 'src/app/core/auth-services/user.service';
import { v4 as uuidv4 } from 'uuid';
import { marked } from 'marked';
import { LoaderService } from 'src/app/core/services/loader.service';
import { NgClass, NgStyle } from '@angular/common';
import { LoaderComponent } from '../../dashboardpanelModule/panel-properties/loader/loader.component';
import { PopupComponent } from '../../dashboardpanelModule/panel-properties/popup/popup.component';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
    imports: [NgClass, NgStyle, DropDownButtonModule, LoaderComponent, PopupComponent, RouterOutlet, SidebarModule, RouterLinkActive, RouterLink, AIAssistViewModule]
})
export class SidebarComponent implements OnInit, OnDestroy {
  [x: string]: any;

  sidebarIsOpen: boolean = false;
  windowWidth: any;
  @ViewChild('sidebarInstance')
  sidebarInstance!: SidebarComponent;
  enableDock: boolean = true;
  type: string = 'Auto';
  smlDoclSize: string = '220px';
  docksizeWidth: string = '60px'

  target: string = '#target';
  enablesmartlabel: boolean = true;
  isExpand: boolean = true
  username: string = 'superadmin';
  showSidebar: boolean = false
  dashboard_Name: string = '';
  menuBasedAccess: any = {};
  menubasedPermissionObj: any = {}
  menuBasedPermissionArray: any = [];
  app_logo: string = '';
  app_name: string = 'Syntheta';
  appDisplayName: string = 'Syntheta';
  sessionThreadId: string = '';


  org_Properteis_obj: any = {
    font_style: '',
    font_color: '',
    menu_color: '',
    menu_hover_color: '',
    menu_bar_bg: '',
    nav_bar_bg: '',
    dashboard_bg: '',
    panel_header_bg: '',
  }

  showChatPopup: boolean = false;
  userEmail: string = '';
  userMessage: string = '';
  loggedUserInformationData: any;

  @ViewChild('dialogAIAssistView')
  dialogAIAssistView!: AIAssistViewComponent;

  promptsData: PromptModel[] = [
    {
      response: "Ask Questions, to better understand how your prompt interacts with AI-generated or default data responses..!"
    }
  ];

  defaultSuggestions: string[] = [
    "How to create a box templates?",
    "How to create a chart?",
    "How to assign role mapping?",
  ];

  defaultPromptResponseData: { [key: string]: string | string[] }[] = [
    {
      prompt: "How to create a box templates?",
      response: "<p>To create box component click on add icon then add a form  <p>Would you like more tips on any of these steps?</p>",
      suggestions: [
        "How to add background color to box?",
        "How to add fieldDetails here?"
      ]
    }
  ];

  prompts: { [key: string]: string | string[] }[] = this.defaultPromptResponseData;
  // suggestions: string[] = this.defaultSuggestions;

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    // Get the current window width
    const windowWidth = event.target.innerWidth;
    this.windowWidth = windowWidth;
    // console.log('windowWidth', windowWidth)

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
    // console.log(eve, selectedValue)

    switch (selectedValue) {
      case 'Logout':
        this.onLogOutCLick();

        break;
      case 'User Settings':

        //main url
        // this.router.navigate(['/sidebar/panel/updateUser', this.username]);


        // this.router.navigate(['/usersettings']);
        this.router.navigate(['/usersettings/settings/userprofile']);

        break;
      default:
        break;
    }
  }

  private dashboardAccessSub!: Subscription;
  private menuAccessSub!: Subscription;

  private readonly chartService = inject(ChartService);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly menuBasedAccessService = inject(MenuBasedAccessService);
  private readonly dashboardBasedAccessService = inject(DashboardBasedAccessService);
  private readonly userService = inject(UserService);
  private readonly route = inject(ActivatedRoute);
  private readonly loaderService = inject(LoaderService);

  createDashboardObj: any = {};
  createRoleObj: any = {};
  createUserObj: any = {};
  createjointableObj: any = {};
  createDatabaseConnectionObj: any = {};
  fileUploadObj: any = {};
  DashboardSetupObj: any = {};

  resetSidebarHeight() {
    // Set sidebar height to the top
    // const sidebar = document.getElementById('sidebar-content');
    // if (sidebar) {
    //   // console.log('sidebar.scrollTop', sidebar.scrollTop)

    //    sidebar.scrollTop = 0;
    // }
  }



  usersData: any = {};
  chatbotSetupObj: any = {};

  private titleSub!: Subscription;
  role: any;
  isCredPresent: boolean = false;
  userInitials: string = '';
  roleLabel: string = '';

  public isHomeTreeviewOpen: boolean = false;
  isDashboardsLoaded: boolean = false;
  public isLoadingDashboards: boolean = false;

  @ViewChild('treeviewInstance')
  public treeview!: TreeViewComponent;
  // public toggleHomeTreeview(): void {

  //   this.isHomeTreeviewOpen = !this.isHomeTreeviewOpen;

  //   if (this.isHomeTreeviewOpen) {

  //     if (!this.isDashboardsLoaded) {
  //       this.loaderService.show();
  //     }

  //     // EXPAND: This runs when opening the tree view.
  //     if (this.sidebarInstance['isOpen']) { // If sidebar is narrow (60px)
  //       if (this.windowWidth <= 1024) {
  //         this.type = 'Over';
  //         this.smlDoclSize = '0px';
  //         this.docksizeWidth = '220px';
  //       } else {
  //         this.type = 'Auto';
  //         this.smlDoclSize = '220px';
  //         this.docksizeWidth = '60px';
  //       }
  //       this.sidebarInstance['toggle'](); // Make it wide (220px)
  //     }
  //   } else {
  //     // COLLAPSE: This runs when closing the tree view.
  //     if (!this.sidebarInstance['isOpen']) { // If sidebar is wide (220px)
  //       if (this.windowWidth <= 1024) {
  //         this.type = 'Over';
  //         this.smlDoclSize = '0px';
  //         this.docksizeWidth = '220px';
  //       } else {
  //         this.type = 'Auto';
  //         this.smlDoclSize = '220px';
  //         this.docksizeWidth = '60px';
  //       }
  //       this.sidebarInstance['toggle'](); // Make it narrow (60px)
  //     }
  //   }
  // }

  public toggleHomeTreeview(): void {
    // Clear hover timeout when manually toggling
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout);
    }

    this.isHomeTreeviewOpen = !this.isHomeTreeviewOpen;

    if (this.isHomeTreeviewOpen) {
      // Mark as expanded so hover doesn't interfere
      this.isSidebarExpanded = true;

      if (!this.isDashboardsLoaded) {
        this.isLoadingDashboards = true;

        const checkInterval = setInterval(() => {
          if (this.isDashboardsLoaded) {
            this.isLoadingDashboards = false;
            clearInterval(checkInterval);
          }
        }, 100);

        setTimeout(() => {
          this.isLoadingDashboards = false;
          clearInterval(checkInterval);
        }, 10000);
      }

      if (this.sidebarInstance['isOpen']) {
        if (this.windowWidth <= 1024) {
          this.type = 'Over';
          this.smlDoclSize = '0px';
          this.docksizeWidth = '220px';
        } else {
          this.type = 'Auto';
          this.smlDoclSize = '220px';
          this.docksizeWidth = '60px';
        }
        this.sidebarInstance['toggle']();
      }
    } else {
      // Reset expansion state when closing
      this.isSidebarExpanded = false;

      if (!this.sidebarInstance['isOpen']) {
        if (this.windowWidth <= 1024) {
          this.type = 'Over';
          this.smlDoclSize = '0px';
          this.docksizeWidth = '220px';
        } else {
          this.type = 'Auto';
          this.smlDoclSize = '220px';
          this.docksizeWidth = '60px';
        }
        this.sidebarInstance['toggle']();
      }
    }
  }
  // chatbotSetupObj : any = {};
  ngOnInit(): void {


    this.windowWidth = window.innerWidth;
    let sideDiv = document.getElementById('sidebar-content');

    if (this.windowWidth <= 1024) {
      this.type = 'Over';
      this.smlDoclSize = '0px';
      this.docksizeWidth = '220px';
      // this.sidebarInstance['toggle']()
    } else {
      this.type = 'Auto';
      this.smlDoclSize = '220px';
      this.docksizeWidth = '60px'
      // this.sidebarInstance['toggle']()

    }

    this.router.events.pipe(
      filter(_ => _ instanceof NavigationEnd) // Use _ to indicate that the variable is not used
    ).subscribe(() => { // Remove event parameter as it's not used
      // Reset sidebar height whenever navigation changes
      this.resetSidebarHeight();
    });

    // this.route.queryParams.subscribe(params => {
    //   console.log('params', params)
    //   // this.isCredPresent = !!params['credaqa']; // true if 'cred' exists
    // });

    const url = window.location.href;
    this.isCredPresent = url.includes('credaqa');

    if (this.isCredPresent) {
      this.isWizardMode = true;
      this.suggestions = [...this.wizardSuggestions];
    } else {
      this.isWizardMode = false;
      this.suggestions = [...this.synthetaSuggestions];
    }

    this.sessionThreadId = uuidv4(); // generate only once when component is initialized
    // console.log('Generated UUID on load:', this.sessionThreadId);

    let userInfoData = this.userService.getUser();
    console.log('userInfoData in role page', userInfoData);
    this.role = userInfoData.username;
    this.loggedUserInformationData = userInfoData;
    console.log('loggedUserInformationData', this.loggedUserInformationData)
    this.usersData = userInfoData;


    let userData: any = sessionStorage.getItem('userInformation');

    if (userData) {
      userData = JSON.parse(userData);
      // console.log(userData)
      this.username = userData.username;
    }

    // Compute derived display values
    this.userInitials = this.username
      ? this.username.slice(0, 2).toUpperCase()
      : 'U';
    this.roleLabel = this.role === 'superadmin' ? 'Super Admin'
      : this.role ? this.role.charAt(0).toUpperCase() + this.role.slice(1)
      : 'User';

    this.titleSub = this.chartService.title$.subscribe(title => {
      this.dashboard_Name = title;

    });

    this.menuAccessSub = this.menuBasedAccessService.menuAccess$.subscribe((menuAccess) => {
      console.log('menuAccess', menuAccess)
      this.menuBasedAccess = menuAccess;

      this.menuBasedPermissionArray = this.menuBasedAccess?.permission_details;
      console.log(this.menuBasedPermissionArray)

      this.menuBasedPermissionArray?.forEach((element: any) => {

        if (element.form_name == 'createDashboard') {
          this.createDashboardObj = element;
        } else if (element.form_name == 'addRole') {
          this.createRoleObj = element;
        } else if (element.form_name == 'addUser') {
          this.createUserObj = element;
        }
        else if (element.form_name == 'tableJoin') {
          this.createjointableObj = element;
        } else if (element.form_name == 'dbConnection') {
          this.createDatabaseConnectionObj = element;
        } else if (element.form_name == 'fileUploadToDb') {
          this.fileUploadObj = element;
        }
        else if (element.form_name == 'dashboardSetup') {
          this.DashboardSetupObj = element;
        } else if (element.form_name == 'chatbotSetup') {
          this.chatbotSetupObj = element;
        }
      });


    });
    // console.log('this.app_logo', this.app_logo, 'assets/images/SynthetaLogoDarkfont4.png')
    let orgDetailsFormStorage: any = sessionStorage.getItem('orgDetailsObj');
    // console.log('orgDetailsFormStorage', orgDetailsFormStorage)

    if (orgDetailsFormStorage) {
      orgDetailsFormStorage = JSON.parse(orgDetailsFormStorage);

      this.app_name = orgDetailsFormStorage.name ? orgDetailsFormStorage.name : "Syntheta"
      this.appDisplayName = this.app_name;
      this.app_logo =
        orgDetailsFormStorage.client_logo_inside ||
        orgDetailsFormStorage.client_logo ||
        orgDetailsFormStorage.app_logo_inside ||
        orgDetailsFormStorage.app_logo ||
        "assets/images/SynthetaLogoDarkfont4.png"; // Fallback value
    } else {
      this.app_name = "Syntheta"
      this.appDisplayName = this.app_name;
      this.app_logo = 'assets/images/SynthetaLogoDarkfont4.png'

    }


    this.org_Properteis_obj = {
      font_style: '',
      font_color: '#0D5C7A',
      menu_color: 'color',
      menu_hover_color: '',
      menu_bar_bg: 'linear-gradient(135deg, #0D5C7A 0%, #0891B2 60%, #22D3EE 100%)',
      default_menu_bar: '#0D5C7A',
      nav_bar_bg: '',
      dashboard_bg: '',
      panel_header_bg: '',
    }

    sessionStorage.setItem('orgPropertiesObj', JSON.stringify(this.org_Properteis_obj))
    if (this.role === 'superadmin') {
      this.isLoadingDashboards = true;

      this.chartService
        .getAllDashboardDetailsWithEmptyData()
        .pipe(first())
        .subscribe({
          next: (res: any) => {
            this.dashboardBasedPermssionArray = res?.data || [];
            this.isDashboardsLoaded = true;
            this.isLoadingDashboards = false;
          },
          error: () => {
            this.isLoadingDashboards = false;
          }
        });

      return;
    }

    let dashboardBasedLocalStorageData = this.dashboardBasedAccessService.updatedashboardAccessFromLocalStorage();

    console.log('dashboardBasedLocalStorageData .... in sidebar', dashboardBasedLocalStorageData);

    this.dashboardAccessSub = this.dashboardBasedAccessService.dashboardAccess$.subscribe((dashboardData: any) => {
      // console.log('Dashboard access data received:', dashboardData);

      if (dashboardData && dashboardData.permission_details) {
        this.dashboardBasedPermssionArray = dashboardData.permission_details;
        // console.log('Loaded dashboards from observable:', this.dashboardBasedPermssionArray);
      } else if (dashboardData && dashboardData.data) {
        // Fallback for superadmin response format
        this.dashboardBasedPermssionArray = dashboardData.data;
        console.log('Loaded dashboards (superadmin format):', this.dashboardBasedPermssionArray);
      }

    });

    // let dashboardBasedLocalStorageData = this.dashboardBasedAccessService.updatedashboardAccessFromLocalStorage();

    // console.log('dashboardBasedLocalStorageData .... in sidebar', dashboardBasedLocalStorageData);

    // let role_id = dashboardBasedLocalStorageData?.role_id ? userInfoData.role_id : userInfoData.role_id ;
    // let user_id = dashboardBasedLocalStorageData?.user_id ? userInfoData?.user_id : null;


    //  if (userInfoData.username == 'superadmin') {
    //   console.log('Role is superadmin, fetching all dashboard details directly...');
    //    this.chartService.getAllDashboardDetailsWithEmptyData().subscribe((res: any) => {
    //     console.log('res in grouping page', res);
    //     this.dashboardBasedPermssionArray = res['data'] || [];
    //   });
    //   }else if (role_id && user_id) {
    //   this.chartService.getAllUserDashboardPermissionByRoleidUserId(role_id, user_id).subscribe(
    //     (res: any) => {
    //     if (res.success) {
    //       console.log('User-based permission_details in homepage', res);
    //       let dashboardBasedPermssionArray = res['data']?.permission_details || [];
    //       this.dashboardBasedPermssionArray = dashboardBasedPermssionArray;
    //     }
    //   },

    //   (err:any) => {
    //     console.log('error', err)

    //   }
    // );
    // } else {
    //   this.chartService.getAllRoleDashboardPermissionByRoleid(role_id).subscribe((res: any) => {
    //     console.log('Role-based permission_details', res);

    //     if (res.success) {
    //       let dashboardBasedPermssionArray = res['data']?.permission_details || [];
    //       this.dashboardBasedPermssionArray = dashboardBasedPermssionArray;
    //       console.log('Role-based permission_details', res['data']);

    //     }else{

    //     }
    //   },

    //   (err:any) => {
    //     console.log('error', err)
    //   }
    // );
    // }


  }

  dashboardBasedPermssionArray: any = [];

  ngOnDestroy() {
    this.titleSub?.unsubscribe();
    this.dashboardAccessSub?.unsubscribe();
    this.menuAccessSub?.unsubscribe();
  }

  get viewableDashboards(): any[] {
    const arr = this.dashboardBasedPermssionArray || [];
    // ensure safe access, include superadmin override
    return arr.filter((d: any) => !!d?.can_view || this.role === 'superadmin');
  }



  onClickMenu() {

    if (this.windowWidth <= 1024) {
      this.type = 'Over';
      this.smlDoclSize = '0px';
      this.docksizeWidth = '220px'
      this.sidebarInstance['toggle']()

    } else {
      this.type = 'Auto';
      this.smlDoclSize = '220px';
      this.docksizeWidth = '60px'
      this.sidebarInstance['toggle']()

    }
  }


  private adjustSidebar(toggle: boolean): void {
    if (this.windowWidth <= 1024) {
      this.type = 'Over';
      this.smlDoclSize = '0px';
      this.docksizeWidth = '220px';
    } else {
      this.type = 'Auto';
      this.smlDoclSize = '220px';
      this.docksizeWidth = '60px';
    }

    if (toggle) {
      this.sidebarInstance['toggle']();
    }
  }



  onLogOutCLick() {

    sessionStorage.clear()
    this.router.navigate(['login']);

  }

  toggleChatPopup() {
    this.showChatPopup = !this.showChatPopup;
  }

  public cssClass: string = 'custom-aiassistview';

  startChat() {
    if (this.userEmail && this.validateEmail(this.userEmail)) {
      // Here you can implement the actual chat start logic
      console.log('Starting chat with email:', this.userEmail);
    } else {
      // Handle invalid email
      alert('Please enter a valid email address');
    }
  }

  private validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }



  openChatbot() {
    const url = window.location.href;
    console.log('url', url, url.includes('credaqa'));

    this.isCredPresent = url.includes('credaqa');
    // this.isCredPresent = true
    // Only set wizard mode if cred
    if (this.isCredPresent) {
      this.isWizardMode = true;
      this.suggestions = [...this.wizardSuggestions];
    }

    this.showChatPopup = !this.showChatPopup;

    if (this.showChatPopup) {
      this.userMessage = `Hello ${this.loggedUserInformationData?.username || 'User'}, How can I help you`;

      // Show tooltip only if not cred user
      if (!this.isCredPresent) {
        const tooltip = document.getElementById('tooltipText');
        if (tooltip) {
          tooltip.classList.add('show');
          setTimeout(() => {
            tooltip.classList.remove('show');
          }, 3000);
        }
      }
    }
  }


  toolbarItemClicked = (args: any) => {
    if (args.item.iconCss === 'e-icons e-close') {
      this.toggleChatPopup();
    }
    if (args.item.iconCss === 'e-icons e-assist-copy') {
      var targetElem = document.querySelector('.right-content .content');
      var response = this.dialogAIAssistView.prompts[args.dataIndex].response;
      if (targetElem) {
        targetElem.innerHTML += response + '<br />';
        this.toggleChatPopup();
      }
    }
  };

  assistViewToolbarSettings: any = {
    items: [{ iconCss: 'e-icons e-close', align: 'Right' }],
    itemClicked: this.toolbarItemClicked
  };

  responseToolbarSettings: ResponseToolbarSettingsModel = {
    itemClicked: this.toolbarItemClicked
  };
  panelSeriesArray: any;




  isWizardMode: boolean = false;

  wizardSuggestions: string[] = ['How many escalation were there', 'which location has maximum escalation'];
  synthetaSuggestions: string[] = [

    'how to create database connection',
    'How to create a chart',
    'How to apply initial filters in dashboard',
  ];

  suggestions: string[] = [...this.synthetaSuggestions]; // default

  // Toggle wizard/syntheta mode
  toggleChatMode() {
    this.isWizardMode = !this.isWizardMode;
    this.suggestions = this.isWizardMode ? this.wizardSuggestions : this.synthetaSuggestions;
  }

  /**
   * Extract dashboard context from current URL and fetch complete dashboard data
   * Returns Observable that emits dashboard context with all properties populated
   * If not on a dashboard page, returns empty object
   */
  private extractDashboardContext(): any {
    const url = this.router.url;

    // Check if on panelView (dashboard view) page
    const panelViewMatch = url.match(/panelView\/([^\/\?]+)/);
    // Check if on edit-dashboard page
    const editDashboardMatch = url.match(/edit-dashboard\/([^\/\?]+)/);

    const dashboardId = panelViewMatch ? panelViewMatch[1] : (editDashboardMatch ? editDashboardMatch[1] : null);

    // If not on a dashboard page, return empty object wrapped in Observable
    if (!dashboardId) {
      return { dashboard_id: dashboardId };
    }

    return { dashboard_id: dashboardId };
  }

  /**
   * Build dashboard context by fetching full dashboard data from API
   * Extracts: filters, KPIs (from Box panels), table_view (from Table panels), and time_range
   */
  private buildDashboardContextFromApi(dashboardId: string): any {
  // const filterObjEle = {
  //   filter_obj: [],
  //   drilldown_obj: [],
  //   disabled_filterObj: [],
  //   drilldown_table_obj: []
  // };
  const storedFilters = sessionStorage.getItem('storedDrilldownAndFilterArray');

  let filterObjEle = {
    filter_obj: [],
    drilldown_obj: [],
    disabled_filterObj: [],
    drilldown_table_obj: []
  };

  if (storedFilters) {
    try {
      const parsedFilters = JSON.parse(storedFilters);
      filterObjEle = {
        filter_obj: parsedFilters.filter_obj || [],
        drilldown_obj: parsedFilters.drilldown_obj || [],
        disabled_filterObj: parsedFilters.disabled_filterObj || [],
        drilldown_table_obj: parsedFilters.drilldown_table_obj || []
      };
    } catch (err) {
      console.error('Invalid storedDrilldownAndFilterArray payload', err);
    }
  }

  const hasAppliedFilters =
    (filterObjEle.filter_obj?.length || 0) > 0 ||
    (filterObjEle.drilldown_obj?.length || 0) > 0;

  // Keep chatbot context aligned with the same API path used by dashboard UI filter refresh.
  const dashboardDataRequest$ = hasAppliedFilters
    ? this.chartService.getDashboardDataWithFilterById(dashboardId, filterObjEle)
    : this.chartService.getDashboardDataWithBookmarkFilterById(dashboardId, filterObjEle, true, true);

  return dashboardDataRequest$
    .toPromise()
    .then((res: any) => {
      let resObj = res['data'];
      let data = resObj.dashboard_setup.dashboardObj;
      // let panels = data.panels || [];

      // // Extract filters from dashboard setup or filter objects
      // const filters: any = {};
      //  Get filters from session storage
      const filters = this.getFiltersFromSession();

      // Extract KPIs from Box panels and table_views from Table panels
      const kpis: any = {};
      const table_views: any[] = [];

      // Initialize time_range with current day by default
      const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
      let time_range = {
        from: today,
        to: today,
        granularity: 'day'
      };

      // Track label name occurrences to handle duplicates
      const labelNameCounts: any = {};
      

      const panels = resObj.dashboard_setup.dashboardObj.panels || [];

      panels.forEach((panel: any) => {

        if (panel.panelType === 'Box') {

          const dataSource = panel?.content?.dataSource;

          if (!dataSource) return;

          let row: any = null;

          if (Array.isArray(dataSource)) {
            row = dataSource[0];
          }
          else if (dataSource?.result?.length) {
            row = dataSource.result[0];
          }

          if (!row) return;

          const fieldName = Object.keys(row)[0];
          let value = row[fieldName];

          let labelName = fieldName;

          const fieldDetail = panel?.content?.fieldDetails?.find(
            (f: any) => f.fieldName === fieldName
          );

          if (fieldDetail?.labelName) {
            labelName = fieldDetail.labelName;
          }

          if (typeof value === 'string') {
            const cleanValue = value.replace('%', '').trim();
            value = isNaN(parseFloat(cleanValue)) ? value : parseFloat(cleanValue);
          }

          kpis[labelName] = value;
        }

        if (panel.panelType === 'DateRangePicker') {

          const selectedValues = panel?.content?.selectedValues_dataSource;

          if (selectedValues?.length) {
            time_range.from = selectedValues[0];
            time_range.to = selectedValues[selectedValues.length - 1];
            time_range.granularity = 'day';
          }

        }

        if (panel.panelType === 'Table') {

          const dataSource = panel?.content?.dataSource;

            if (!dataSource || !dataSource.length) return;
            const firstRow = dataSource[0];
            const columns = Object.keys(firstRow);

            table_views.push({
              name: panel?.content?.tableName,
              columns: columns,
              panel_header: panel?.header
            });

          }

      });
      // panels.forEach((panel: any) => {
        // Extract KPIs from ALL Box panels - use labelName from fieldDetails configuration as key
        // if (panel.panelType === 'Box' && panel.content && panel.content.dataSource) {
        //   const dataSourceRow = panel.content.dataSource[0];
        //   if (dataSourceRow) {
        //     // Get the actual field name from dataSource keys
        //     const fieldNameKey = Object.keys(dataSourceRow)[0];
        //     let value = dataSourceRow[fieldNameKey];
            
        //     // Find the corresponding labelName from fieldDetails configuration
        //     let labelName = fieldNameKey; // Default to fieldName if labelName not found
        //     if (panel.content.fieldDetails && Array.isArray(panel.content.fieldDetails)) {
        //       const fieldDetail = panel.content.fieldDetails.find((f: any) => f.fieldName === fieldNameKey);
        //       if (fieldDetail && fieldDetail.labelName) {
        //         labelName = fieldDetail.labelName;
        //       }
        //     }
            
        //     // Parse KPI value - remove "%" if present and convert to number
        //     if (typeof value === 'string') {
        //       const cleanValue = value.replace('%', '').trim();
        //       value = isNaN(parseFloat(cleanValue)) ? value : parseFloat(cleanValue);
        //     }
            
        //     // Handle duplicate keys by appending counter
        //     let finalKey = labelName;
        //     if (kpis.hasOwnProperty(labelName)) {
        //       // Key already exists, append counter
        //       if (!labelNameCounts[labelName]) {
        //         labelNameCounts[labelName] = 2;
        //       }
        //       finalKey = `${labelName}_${labelNameCounts[labelName]}`;
        //       labelNameCounts[labelName]++;
        //     }
            
        //     // Add to kpis object with unique key using labelName
        //     kpis[finalKey] = value;
        //   }
        // }
  
        // Extract DateRangePicker values for time_range
      //   if (panel.panelType === 'DateRangePicker' && panel.content && panel.content.selectedValues_dataSource) {
      //     const selectedValues = panel.content.selectedValues_dataSource;
      //     if (selectedValues && selectedValues.length > 0) {
      //       time_range.from = selectedValues[0] || '';
      //       time_range.to = selectedValues[selectedValues.length - 1] || '';
      //       time_range.granularity = 'day'; // Set default granularity to day
      //     }
      //   }

      //   // Extract table_views from ALL Table panels
      //   if (panel.panelType === 'Table' && panel.content && panel.content.dataSource && panel.content.dataSource.length > 0) {
      //     const tableName = panel.content.tableName;
      //     const firstRow = panel.content.dataSource[0];
          
      //     if (firstRow) {
      //       // Extract column names from the keys of the first dataSource row
      //       const columns = Object.keys(firstRow);
            
      //       table_views.push({
      //         name: tableName, // Use actual table_name directly
      //         columns: columns,
      //         panel_header: panel.header || 'Table View' // Include panel header for identification
      //       });
      //     }
      //   }
      // });

      // Build complete dashboard context
      const dashboardContext: any = {
        dashboard_id: dashboardId,
        timezone: 'Asia/Kolkata', // Set to Asia/Kolkata timezone
        time_range: time_range,
        filters: filters,
        kpis: kpis,
        table_views: table_views // Include table views filtered by tableName
      };

      // Add empty active_widget
      dashboardContext.active_widget = {};

      return dashboardContext;
    })
    .catch((err: any) => {
      console.error('Error fetching dashboard context:', err);
      // Return basic context on error with current day
      const today = new Date().toISOString().split('T')[0];
      return {
        dashboard_id: dashboardId,
        timezone: 'Asia/Kolkata',
        time_range: { from: today, to: today, granularity: 'day' },
        filters: {},
        kpis: {},
        table_views: [],
        active_widget: {}
      };
    });
}



  /**
   * Build the new payload structure for wizard chatbot API
   */
 // private buildWizardChatPayload(prompt: string, threadId: string, dashboardContext: any): any {
 //   const payload = {
 //     thread_id: threadId,
 //     content: prompt,
 //     dashboard_context: dashboardContext
 //   };

 //   return payload;
//  }



private getFiltersFromSession(): any {
  const filtersObj: any = {};
  const storedFilters = sessionStorage.getItem('storedDrilldownAndFilterArray');
  if (!storedFilters) return filtersObj;

  try {
    const parsedData = JSON.parse(storedFilters);
    const filtersArray = parsedData?.filter_obj || [];
    filtersArray.forEach((filter: any) => {

      if (
        filter?.field_name &&
        Array.isArray(filter?.values) &&
        filter.values.length > 0
      ) {
        filtersObj[filter.field_name] = filter.values;
      }

    });

  } catch (err) {
    console.error('Error reading filters from session storage', err);
  }

  return filtersObj;
}


promptRequest = (args: PromptRequestEventArgs) => {
    console.log('args prompt', args);
    console.log('isWizardMode', this.isWizardMode)
    console.log('isCredPresent', this.isCredPresent)
    const prompt: any = args.prompt?.trim();
    if (!prompt) {
      this.dialogAIAssistView.addPromptResponse('Prompt is empty. Please enter a valid query.');
      return;
    }

    

    const containsHash = prompt.includes('#');
    const url = this.router.url;
    const threadId : any = uuidv4();
  
    
      // if (prompt.toLowerCase().startsWith('#wizard') || url.includes('credaqa')) {
      if (this.isWizardMode) {
          // Extract dashboard ID from URL
          const basicContext = this.extractDashboardContext();
          const dashboardId = basicContext.dashboard_id;
          
          let db_name = 'cred'
          
          // Build dashboard context from API if on dashboard page
          if (dashboardId) {
            this.buildDashboardContextFromApi(dashboardId).then((dashboardContext: any) => {
              // const wizardPayload = this.buildWizardChatPayload(prompt, this.sessionThreadId, dashboardContext);
              const wizardPayload = {
                thread_id: this.sessionThreadId,
                content: prompt,
                dashboard_context: dashboardContext
              };
              console.log('wizardPayload with full context:', wizardPayload);

              this.chartService.wizardChatApiWithFiles(wizardPayload, db_name).subscribe(
                (res: any) => {
                  console.log('Wizard API response:', res);
                  const wizardResponse = res.response || 'No response from wizard API.';
                  const html = marked.parse(wizardResponse);

                  this.dialogAIAssistView.addPromptResponse({
                    response: html,
                    isHtml: true,
                  });
                },
                (err: any) => {
                  console.error('Wizard API error:', err);
                  this.dialogAIAssistView.addPromptResponse('An error occurred while processing the Wizard request.');
                }
              );
            });
          } else {
            // Not on dashboard page, send with empty dashboard context but current day
            // const today = new Date().toISOString().split('T')[0];
            // const emptyContext = {
            //   dashboard_id: undefined,
            //   timezone: 'UTC',
            //   time_range: { from: today, to: today, granularity: 'day' },
            //   filters: {},
            //   kpis: {},
            //   table_views: []
            // };
            // const wizardPayload = this.buildWizardChatPayload(prompt, this.sessionThreadId, emptyContext);
            
            const wizardPayload = {
              thread_id: this.sessionThreadId,
              content: prompt
            };

            console.log('wizardPayload (no dashboard page):', wizardPayload);
            this.chartService.wizardChatApiWithFiles(wizardPayload, db_name).subscribe(
              (res: any) => {
                console.log('Wizard API response:', res);
                const wizardResponse = res.response || 'No response from wizard API.';
                const html = marked.parse(wizardResponse);

                this.dialogAIAssistView.addPromptResponse({
                  response: html,
                  isHtml: true,
                });
              },
              (err: any) => {
                console.error('Wizard API error:', err);
                this.dialogAIAssistView.addPromptResponse('An error occurred while processing the Wizard request.');
              }
            );
          }

      return; // Skip rest of the logic
    }


    // If prompt contains '#', call the first API
    if (containsHash) {
      const match = url.match(/panelView\/([^\/]+)/); // Extract dashboard ID

      if (!match) {
        this.dialogAIAssistView.addPromptResponse('Could not determine dashboard ID from route.');
        return;
      }

      const dashboardId = match[1];
      const filterObjEle = {
        filter_obj: [],
        drilldown_obj: [],
        disabled_filterObj: [],
        drilldown_table_obj: []
      };

      this.chartService.getDashboardDataWithBookmarkFilterById(dashboardId, filterObjEle, true, true)
        .subscribe((res: any) => {
          let resObj = res['data'];
          let data = resObj.dashboard_setup.dashboardObj;
          let dashboardName = resObj.dashboard_name;
          this.panelSeriesArray = data.panels;

          console.log('this.panelSeriesArray', this.panelSeriesArray)

          const chartOrTableMatches = [
            ...prompt.matchAll(/#(chart|table|pivot)\s*:\s*(?:"([^"]+)"|'([^']+)'|([^\s,]+))/gi)
          ];

          console.log('chartOrTableMatchesOld', chartOrTableMatches)
          
          const parsedPromptTags = chartOrTableMatches.map(match => {
            return {
              panelType: match[1]?.trim().toLowerCase(),
              header: match[2]?.trim() || match[3]?.trim() || match[4]?.trim()
            };
          }).filter(tag => tag.panelType && tag.header);
          console.log('chartOrTableMatches', chartOrTableMatches, )

          const headerNames = chartOrTableMatches.map(match =>
            match[1]?.trim() || match[2]?.trim() || match[3]?.trim()
          ).filter(Boolean);

          console.log('headerNames', headerNames)

          const matchedObjects = this.panelSeriesArray.filter((item: any) => {
            console.log('Ã°Å¸â€Â Checking item:', item);

            const isMatched = parsedPromptTags.some(tag => {
              console.log('   Ã¢â€ ÂªÃ¯Â¸Â Comparing with tag:', tag);
              const itemHeader = item.header || '';
              const tagHeader = tag.header || '';
              const itemPanelType = item.panelType?.toLowerCase();
              const tagPanelType = tag.panelType?.toLowerCase();

              // Normalize: lowercase, trim, and reduce multiple spaces to a single space
              const normalize = (str: string) => str.toLowerCase().replace(/\s+/g, ' ').trim();

              const normalizedItemHeader = normalize(itemHeader);
              const normalizedTagHeader = normalize(tagHeader);

              // console.log(`     - itemHeader: '${normalizedItemHeader}', tagHeader: '${normalizedTagHeader}'`);
              // console.log(`     - itemPanelType: '${itemPanelType}', tagPanelType: '${tagPanelType}'`);

              const match = normalizedItemHeader === normalizedTagHeader && itemPanelType === tagPanelType;
              // console.log(`     Ã¢Å“â€¦ Match result: ${match}`);

              return match;
            });

            return isMatched;
          });

          console.log('matchedObjects', matchedObjects)

          // Function to rename dataSource fields
          const renameDataSourceFields = (element: any) => {
            const fieldToLabelMap = element.content.measure.reduce((acc: any, item: any) => {
              acc[item.fieldName] = item.labelName || item.fieldName;
              return acc;
            }, {});

            element.content.dimension.levels.forEach((level: any) => {
              fieldToLabelMap[level.fieldName] = level.labelName || level.fieldName;
            });

            return element.content.dataSource.map((obj: any) => {
              const newObj: any = {};
              for (const key in obj) {
                newObj[fieldToLabelMap[key] || key] = obj[key];
              }
              return newObj;
            });
          };

          let finalObj = {
            data: matchedObjects.map((item: any) => ({
              data: item.panelType === 'Chart' ? renameDataSourceFields(item) : item.content.dataSource?.result || item.content.dataSource
            })),
            query: prompt
            // prompt: prompt

          };

          console.log('finalObj', finalObj)

              let loginTimeData: any = sessionStorage.getItem('loginSession');
    loginTimeData = JSON.parse(loginTimeData);
    const sessionId = loginTimeData ? loginTimeData.session_unique_id : '';


        });


    } else {
      // If prompt doesn't contain '#', call second API
      const obj = { prompt: prompt };

      this.chartService.postPromptToAi(obj).subscribe(
        (res: any) => {
             // let resData = res[0].output;
          // let resData =  res.output;

          let resData: any;

          if (Array.isArray(res) && res.length > 0) {
            resData = res[0].output;
          } else if (res?.output) {
            resData = res.output;
          } else {
            this.dialogAIAssistView.addPromptResponse('Unexpected response format from server.');
            return;
          }
          
          let foundPrompt = resData.response;

          console.log('resData', resData)

          this.dialogAIAssistView.addPromptResponse(foundPrompt || 'No relevant information was found.');

          const suggestions = resData?.Suggestions;
          if (suggestions) {
            const parser = new DOMParser();
            const doc = parser.parseFromString(suggestions, 'text/html');
            const listItems = doc.querySelectorAll('li');
            
            // Map over the list items, and if no suggestions, fall back to an empty array
            const suggestionArray = listItems.length > 0
              ? Array.from(listItems).map(item => item.textContent?.trim() || '')
              : []; // If no items found, use empty array
          
            // Assign suggestions to the state or view
            this.suggestions = suggestionArray;
          } else {
            // If no suggestions are present, assign an empty array
            this.suggestions = [];
          }
          
        },
        (err: any) => {
          console.log('err', err);
          this.dialogAIAssistView.addPromptResponse('An error occurred while processing your request.');
        }
      );
    }
  };


  toggleTooltip() {
    const tooltip = document.getElementById('tooltipText');
    if (tooltip) {
      tooltip.classList.toggle('show');
    }
  }

  navigateToHome(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.arrow-click-area')) {
      // Reset hover state
      this.isHovering = false;
      this.isSidebarExpanded = false;
      if (this.hoverTimeout) {
        clearTimeout(this.hoverTimeout);
      }
      this.router.navigate(['/sidebar/panel/dashboardHome']);
    }
  }
  private expandSidebarOnHover(): void {
    if (this.sidebarInstance['isOpen'] && !this.isSidebarExpanded) {
      this.isAnimating = true;
      this.isSidebarExpanded = true;

      if (this.windowWidth <= 1024) {
        this.type = 'Over';
        this.smlDoclSize = '0px';
        this.docksizeWidth = '220px';
      } else {
        this.type = 'Auto';
        this.smlDoclSize = '220px';
        this.docksizeWidth = '60px';
      }

      this.sidebarInstance['toggle']();

      // Reset animation flag after sidebar animation completes
      setTimeout(() => {
        this.isAnimating = false;
      }, 300); // Match your sidebar animation duration
    }
  }
  private collapseSidebarFromHover(): void {
    if (!this.sidebarInstance['isOpen'] && this.isSidebarExpanded) {
      this.isAnimating = true;
      this.isSidebarExpanded = false;

      if (this.windowWidth <= 1024) {
        this.type = 'Over';
        this.smlDoclSize = '0px';
        this.docksizeWidth = '220px';
      } else {
        this.type = 'Auto';
        this.smlDoclSize = '220px';
        this.docksizeWidth = '60px';
      }

      this.sidebarInstance['toggle']();

      setTimeout(() => {
        this.isAnimating = false;
      }, 300);
    }
  }
  private hoverTimeout: any;
  private isHovering: boolean = false;
  private isSidebarExpanded: boolean = false;
  private isAnimating: boolean = false;
  onHomeHover(isEntering: boolean): void {
    // Don't process hover events during animation
    if (this.isAnimating) {
      return;
    }

    if (isEntering) {
      this.isHovering = true;

      // Clear any existing timeout
      if (this.hoverTimeout) {
        clearTimeout(this.hoverTimeout);
      }

      // Only expand if sidebar is narrow AND not already expanded
      if (this.sidebarInstance['isOpen'] && !this.isSidebarExpanded) {
        this.hoverTimeout = setTimeout(() => {
          if (this.isHovering && !this.isSidebarExpanded && !this.isAnimating) {
            this.expandSidebarOnHover();
          }
        }, 100); // Shorter delay for better UX
      }
    } else {
      this.isHovering = false;

      // Clear timeout if mouse leaves before expansion
      if (this.hoverTimeout) {
        clearTimeout(this.hoverTimeout);
      }

      // Only collapse if it was expanded by hover AND mouse truly left
      if (this.isSidebarExpanded && !this.isHomeTreeviewOpen) {
        setTimeout(() => {
          if (!this.isHovering && !this.isAnimating) {
            this.collapseSidebarFromHover();
          }
        }, 200); // Small delay to prevent flicker
      }
    }
  }
}
