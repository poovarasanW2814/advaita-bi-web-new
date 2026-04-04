import { ThisReceiver } from '@angular/compiler';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AnimationSettingsModel, DialogComponent } from '@syncfusion/ej2-angular-popups';
import { UserService } from 'src/app/core/AuthServices/user.service';
import { ChartService } from 'src/app/core/services/chart.service';
import { DashboardBasedAccessService } from 'src/app/core/services/dashboard-based-access.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { MenuBasedAccessService } from 'src/app/core/services/menu-based-access.service';
import { PopupService } from 'src/app/core/services/popup.service';

// Add interface for Group and Dashboard at the top of the file
interface Dashboard {
  dashboard_id: string;
  dashboard_name: string;
  description?: string;
  group_name: string[];
  [key: string]: any; // For any additional properties
}

interface Group {
  id: string;
  group_name: string;
  dashboards: Dashboard[];
  group_description?: string;
  header_background_color?: string,
  body_background_color?: string,
}

@Component({
  selector: 'app-grouping-dashboard',
  templateUrl: './grouping-dashboard.component.html',
  styleUrls: ['./grouping-dashboard.component.scss'],
  standalone: false
})
export class GroupingDashboardComponent implements OnInit , AfterViewInit {

  constructor(private chartService: ChartService, private fb: FormBuilder, private loaderService: LoaderService, private popupService: PopupService, private router: Router, private menuBasedAccessService: MenuBasedAccessService, private dashboardBasedAccessService: DashboardBasedAccessService, private userService: UserService) { }

  dialogHeader: string = 'Dashboard Setup';
  dialogCloseIcon: Boolean = true;
  dialogWidth: string = '500px';
  contentData: string = 'This is a dialog with draggable support.';
  dialogdragging: Boolean = true;
  animationSettings: AnimationSettingsModel = { effect: 'None' };
  isModal: Boolean = true;
  target: string = '.grouping-target';
  showCloseIcon: Boolean = false;
  visible: Boolean = false;
  dashboardDataList: Group[] = [];
  flattenedDashboards: Dashboard[] = [];
  unGroupedDashboards: Dashboard[] = [];
  @ViewChild('groupingDialog') groupingDialog!: DialogComponent;
  selectedGroup: Group | null = null;
  availableDashboards: Dashboard[] = [];
  @ViewChild('editDashboardDialog') editDashboardDialog!: DialogComponent;
  editDashboardDialogVisible: boolean = false;
  dashboardToEdit: any = null;
  editDashboardForm!: FormGroup;
  editGroupNames: any[] = [];
  isEditCustomGroup: boolean = false;
  createGroupForm!: FormGroup
  showToaster: boolean = false;
  toasterMessage: string = '';
  toasterType: 'success' | 'error' = 'success';

  dashboardBasedPermssionArray: any = []
  role: string = ''
  ngOnInit(): void {
    this.groupingFormInit()
    this.editDashboardFormInit()
    // this.loadDashboardData();
    this.createGroupFormInit()

    let userData: any = sessionStorage.getItem('userInformation');

    let userInfoData = this.userService.getUser();

    console.log('userInfoData', userInfoData, userData)
    this.role = userInfoData.username;
    console.log(' this.role',  this.role,  this.role)

    if (userData) {
      userData = JSON.parse(userData);
      console.log('userData', userData);

      if (this.role == 'supueradmin') {
        this.loadDashboardData();
      }
      let dashboardBasedLocalStorageData = this.dashboardBasedAccessService.updatedashboardAccessFromLocalStorage();
      console.log('dashboardBasedLocalStorageData', dashboardBasedLocalStorageData)

      let role_id = dashboardBasedLocalStorageData.role_id;
      let user_id = dashboardBasedLocalStorageData.user_id;
      this.loaderService.show();
      if (dashboardBasedLocalStorageData.role_id && dashboardBasedLocalStorageData.user_id) {
        this.chartService.getAllUserDashboardPermissionByRoleidUserId(role_id, user_id).subscribe((res: any) => {
          if (res.success) {
            let data = res['data'];
            let dashboardBasedPermssionArray = data?.permission_details || [];
            this.dashboardBasedAccessService.setdashboardAccess(data);
            this.loadDashboardData();
            this.dashboardBasedPermssionArray = dashboardBasedPermssionArray
          }

        });
      } else {
        this.chartService.getAllRoleDashboardPermissionByRoleid(role_id).subscribe((res: any) => {
          console.log('Role-based permission_details', res);

          if (res.success) {
            let data = res['data']
            let dashboardBasedPermssionArray = res['data']?.permission_details || [];
            console.log('Role-based permission_details', res['data']);
            this.dashboardBasedAccessService.setdashboardAccess(data);
            this.dashboardBasedPermssionArray = dashboardBasedPermssionArray
            this.loadDashboardData();

          }
        });
      }



    }

  }

  syncLeftPanelHeight() {
  const rightPanel = document.querySelector('.grouping-target') as HTMLElement;
   const rightPanelDiv = document.querySelector('.right-panel') as HTMLElement;
  const leftPanel = document.querySelector('.left-panel') as HTMLElement;
    console.log('rightPanel', rightPanel)
    console.log('leftPanel', leftPanel)
  if (rightPanel && leftPanel) {
    
    const rightHeight = rightPanel.scrollHeight + 70;

    console.log('rightPanel.scrollHeight', rightPanel.scrollHeight, rightPanelDiv.scrollHeight)

    leftPanel.style.height = `${rightHeight}px`;
  }
}

ngAfterViewInit(): void {
  setTimeout(() => {
    this.syncLeftPanelHeight();
  }, 100); // slight delay to wait for view rendering
}


  createGroupFormInit() {
    this.createGroupForm = this.fb.group({
      group_name: [[], Validators.required],
      group_description: ['']
    });
  }

  loadDashboardData() {
    this.chartService.getAllDashboardDetails().subscribe(
      (res: any) => {
      this.loaderService.hide()
      console.log('res in grouping page', res);
      console.log('res in grouping this.dashboardBasedPermssionArray', this.dashboardBasedPermssionArray);
      const dashboardData = res['data'];
      let filteredDashboards: any[]
      // ✅ Check for superadmin
      console.log('this.role', this.role)
      if (this.role === 'superadmin') {
        // Superadmin gets full access to all dashboards
        filteredDashboards = dashboardData;

      } else {
        // Assuming you already have this.dashboardBasedPermissionArray defined somewhere

        filteredDashboards = dashboardData.filter((dashboard: any) => {
          const permission = this.dashboardBasedPermssionArray.find(
            (perm: any) => perm.dashboard_id === dashboard.dashboard_id
          );

          // Include if any one permission is true
          return permission && (
            permission.can_view ||
            permission.can_edit ||
            permission.can_delete ||
            permission.can_update ||
            permission.can_download ||
            permission.can_schedule ||
            permission.can_create
          );
        });


        console.log('res in grouping page filteredDashboards', filteredDashboards);

      }

      console.log('filteredDashboards', filteredDashboards)
      this.unGroupedDashboards = filteredDashboards;
      this.availableDashboards = [...this.unGroupedDashboards]; // Store all dashboards
      // sessionStorage.setItem('dashboardList', JSON.stringify(this.unGroupedDashboards));
      // this.processDashboardData(dashboardData);
      this.processDashboardData(filteredDashboards);
    },
    (err :any) =>{
      this.loaderService.hide();
      const errorMessage = err.error && err.error.message ? err.error.message : err.message;
      this.popupService.showPopup({
        message: errorMessage,
        statusCode: err.status,
        status: false
      })

    }
  );
  }

  processDashboardDataOld(dashboardData: any[]) {
    const groupedDashboards: any[] = [];
    const uniqueGroupNames: Set<string> = new Set();

    dashboardData.forEach((dashboard: any) => {
      let groupName = dashboard.group_name && dashboard.group_name.length && dashboard.group_name[0]
        ? dashboard.group_name[0]
        : 'No Grouping';

      uniqueGroupNames.add(groupName);

      let group = groupedDashboards.find(g => g.group_name === groupName);

      if (!group) {
        group = {
          id: (groupedDashboards.length + 1).toString(),
          group_name: groupName,
          sub_group: [],
          dashboards: []
        };
        groupedDashboards.push(group);
      }

      group.dashboards.push(dashboard);
    });

    this.dashboardDataList = groupedDashboards;
    this.updateFlattenedDashboards();
    this.groupNames = [{ name: 'Create New' }, ...Array.from(uniqueGroupNames).map(name => ({ name }))];
  }

  processDashboardData1(dashboardData: any[]) {
    const groupedDashboards: any[] = [];
    const uniqueGroupNames: Set<string> = new Set();

    dashboardData.forEach((dashboard: any) => {
      // ✅ Only process if valid group_name exists
      if (!dashboard.group_name || !dashboard.group_name.length || !dashboard.group_name[0]) {
        return; // Skip dashboards without a valid group name
      }

      const groupName = dashboard.group_name[0];
      uniqueGroupNames.add(groupName);

      let group = groupedDashboards.find(g => g.group_name === groupName);

      if (!group) {
        group = {
          id: (groupedDashboards.length + 1).toString(),
          group_name: groupName,
          sub_group: [],
          dashboards: []
        };
        groupedDashboards.push(group);
      }

      group.dashboards.push(dashboard);
    });

    this.dashboardDataList = groupedDashboards;
    this.updateFlattenedDashboards();

    console.log('this.dashboardDataList', this.dashboardDataList)

    this.groupNames = [
      { name: 'Create New' },
      ...Array.from(uniqueGroupNames).map(name => ({ name }))
    ];
  }


  processDashboardDataLatest(dashboardData: any[]) {
    const groupedDashboards: any[] = [];
    const uniqueGroupNames: Set<string> = new Set();

    dashboardData.forEach((dashboard: any) => {
      const groupNames = dashboard.group_name;

      // Skip dashboards with no group names
      if (!groupNames) {
        return;
      }

      groupNames.forEach((groupName: string) => {
        // Skip invalid/empty group names
        if (!groupName || typeof groupName !== 'string' || groupName.trim() === '') return;

        uniqueGroupNames.add(groupName);

        let group = groupedDashboards.find(g => g.group_name === groupName);

        if (!group) {
          group = {
            id: (groupedDashboards.length + 1).toString(),
            group_name: groupName,
            dashboards: []
          };
          groupedDashboards.push(group);
        }

        // Prevent duplicates
        if (!group.dashboards.find((d: any) => d.dashboard_id === dashboard.dashboard_id)) {
          group.dashboards.push(dashboard);
        }
      });
    });

    this.dashboardDataList = groupedDashboards;
    this.updateFlattenedDashboards();
    this.groupNames = [{ name: 'Create New' }, ...Array.from(uniqueGroupNames).map(name => ({ name }))];
  }

  processDashboardData(dashboardData: any[]) {
    const groupedDashboards: any[] = [];
    const uniqueGroupNames: Set<string> = new Set();

    const colorPairs = [
      { header: 'rgb(100 164 230 / 84%)', body: 'rgb(190 212 235 / 63%)' }, // Dark Blue & Light Gray
      { header: '10% center rgb(232 53 97 / 94%)', body: 'rgb(231, 129, 154) 10%' }, // Dark Blue & Light Blue

      { header: 'rgb(69 231 69)', body: 'rgb(163 230 163 / 84%)' }, // Dark Green & Light Green
      { header: 'rgb(230 100 151 / 84%)', body: 'rgb(235 190 220 / 63%)' }, // Dark Red & Light Red
      { header: 'rgb(227 230 100 / 84%)', body: 'rgb(234 236 155 / 38%)' }, // Dark Purple & Light Purple
      { header: 'rgb(185 239 40 / 84%)', body: 'rgb(212 236 148 / 55%)' }, // Dark Orange & Light Orange
      { header: 'rgb(245, 165, 5)', body: 'rgb(240, 204, 132) 10%' }, // Dark Teal & Light Teal
      { header: 'rgb(227, 30, 79) 10%', body: 'rgb(231, 129, 154) 10%' }, // Dark Blue & Light Blue
      { header: '#2AFADF', body: 'rgb(151, 248, 235)' }, // Dark Red & Light Pink
      { header: '#4C83FF', body: 'rgb(165, 190, 249) 100%)' }, // Dark Purple & Light Lavender
      { header: '#654321', body: '#ffcc99' }, // Dark Brown & Light Peach
    ];

    const backgroundColors = [
      "linear-gradient(135deg,rgb(240, 204, 132) 10%,rgb(47, 35, 45) 100%)",
      "linear-gradient(135deg, #F12711 10%, #F5AF19 100%)",
      "linear-gradient(135deg, #cc208e 10%, #6713d2 100%)",
      "linear-gradient(135deg,rgb(231, 129, 154) 10%, #ffb199 100%)",
      "linear-gradient(135deg,rgb(151, 248, 235) 10%,rgb(165, 190, 249) 100%)"
    ];

    const groupColorMap = new Map<string, { header: string; body: string }>();
    let colorIndex = 0;

    dashboardData.forEach((dashboard: any) => {
      // Ensure group_name is always an array
      const groupNames = Array.isArray(dashboard.group_name) 
        ? dashboard.group_name 
        : (dashboard.group_name ? [dashboard.group_name] : []);

      if (!groupNames || groupNames.length === 0) return;

      groupNames.forEach((groupName: string) => {
        if (!groupName || typeof groupName !== 'string' || groupName.trim() === '') return;

        uniqueGroupNames.add(groupName);

        // Assign a unique color pair per group
        if (!groupColorMap.has(groupName)) {
          groupColorMap.set(groupName, colorPairs[colorIndex % colorPairs.length]);
          colorIndex++;
        }

        let group = groupedDashboards.find(g => g.group_name === groupName);

        if (!group) {
          const color = groupColorMap.get(groupName);

          group = {
            id: (groupedDashboards.length + 1).toString(),
            group_name: groupName,
            header_background_color: color?.header,
            body_background_color: color?.body,

            dashboards: []
          };
          groupedDashboards.push(group);
        }

        if (!group.dashboards.find((d: any) => d.dashboard_id === dashboard.dashboard_id)) {
          group.dashboards.push(dashboard);
        }
      });
    });

    this.dashboardDataList = groupedDashboards;

    // this.dashboardDataList = this.dashboardDataList.map((item: any, index: number) => ({
    //   ...item,
    //   backgroundColor: backgroundColors[index % backgroundColors.length],
    // }));

    console.log('dashboard list', this.dashboardDataList);
    this.updateFlattenedDashboards();
    this.groupNames = [{ name: 'Create New' }, ...Array.from(uniqueGroupNames).map(name => ({ name }))];
  }



  private updateFlattenedDashboards() {
    this.flattenedDashboards = this.dashboardDataList.reduce((acc: any[], group: any) => {
      return [...acc, ...group.dashboards];
    }, []);
  }

  groupForm!: FormGroup;
  groupNames = [{ name: 'Create New' }, { name: 'Marketing' }, { name: 'Sales' }, { name: 'Support' }];
  isCustomGroup = false;

  groupingFormInit() {
    this.groupForm = this.fb.group({
      group_name: [[], Validators.required],
      customGroupName: [''],
      dashboardNames: [[]],
      group_description: ['']
    });
  }


  dashboardGroups = [
    {
      id: '1', group_name: 'trendz',
      dashboards: [
        { name: 'Finance Overview', description: 'Key financial KPIs', image: 'finance.jpg' },
        { name: 'HR Analytics', description: 'HR and recruitment stats', image: 'hr.jpg' }
      ]
    },
    {
      id: '2', group_name: 'unGrouping',
      dashboards: [
        { name: 'Sales Dashboard', description: 'Track sales performance', image: 'sales.jpg' }
      ]
    },
    {
      id: '3', group_name: 'States',
      dashboards: [
        { name: 'Marketing Insights', description: 'Campaign metrics', image: 'marketing.jpg' }
      ]
    }
  ];

  createGroupingOld() {
    // Logic to create a new grouping
    console.log('Create Grouping');
    this.groupingDialog.show();
    this.groupingFormInit();

    // editDashboardDialog;

  }

  toggleGroupDetails(group: any) {
    console.log('group', group)
    console.log('this.selectedGroup', this.selectedGroup)
    if (this.selectedGroup && this.selectedGroup.group_name === group.group_name) {
      this.selectedGroup = null; // Deselect the group if it's already selected
    } else {
      this.selectedGroup = group;
    }
  }



  removeGrouping(item: any) {
    if (confirm(`Are you sure you want to remove the group "${item.group_name}"?`)) {

      // ✅ Only process dashboards that belong to this group
      const modifiedDashboards = this.availableDashboards
        .filter(dashboard => {
          // Ensure currentGroups is always an array
          const currentGroups = Array.isArray(dashboard.group_name) 
            ? dashboard.group_name 
            : (dashboard.group_name ? [dashboard.group_name] : []);
          
          // Only include dashboards that have this group
          return currentGroups.includes(item.group_name);
        })
        .map(dashboard => {
          // Ensure currentGroups is always an array
          const currentGroups = Array.isArray(dashboard.group_name) 
            ? dashboard.group_name 
            : (dashboard.group_name ? [dashboard.group_name] : []);
          
          // Remove the deleted group from the dashboard's group_name array
          const updatedGroupNames = currentGroups.filter(
            (gName: string) => gName !== item.group_name && gName.trim() !== ''
          );
          
          return {
            ...dashboard,
            group_name: updatedGroupNames
          };
        });

      console.log('Modified dashboards (only those affected):', modifiedDashboards);

      // ✅ Only send dashboards that were actually modified
      this.loaderService.show();
      this.chartService.updateDashboardDetails(modifiedDashboards).subscribe(
        (res: any) => {
          this.loaderService.hide();
     
          this.popupService.showPopup({
            message: res.message,
            statusCode: res.status_code,
            status: res.success
          });
          this.loadDashboardData();

        },
        (err: any) => {
          this.loaderService.hide();
          const errorMessage = err.error && err.error.message ? err.error.message : err.message;
          this.popupService.showPopup({
            message: errorMessage,
            statusCode: err.status,
            status: false
          });
          this.loadDashboardData(); // Rollback on failure
        }
      );
    }
  }


  onGroupMultiChange(event: any) {
    const selectedGroups = event.value || [];
    this.isCustomGroup = selectedGroups.includes('Create New');
    if (!this.isCustomGroup) {
      this.groupForm.get('customGroupName')?.setValue('');
    }
  }



  onSubmit() {
    if (this.groupForm.invalid) {
      return;
    }

    const formValue = this.groupForm.value;
    // Ensure newGroupNames is always an array
    const newGroupNames = Array.isArray(formValue.group_name) 
      ? formValue.group_name 
      : (formValue.group_name ? [formValue.group_name] : []);
    const selectedDashboardIds = formValue.dashboardNames || [];

    // Update local state
    this.unGroupedDashboards = this.unGroupedDashboards.map(dashboard => {
      if (selectedDashboardIds.includes(dashboard.dashboard_id)) {
        // Ensure currentGroups is always an array
        const currentGroups = Array.isArray(dashboard.group_name) 
          ? dashboard.group_name 
          : (dashboard.group_name ? [dashboard.group_name] : []);
        const updatedGroups = [...new Set([...currentGroups, ...newGroupNames])]; // merge & dedupe
        return {
          ...dashboard,
          
          group_name: updatedGroups
        };
      }
      return dashboard;
    });

    // Update groups
    this.processDashboardData(this.unGroupedDashboards);

    // Prepare data for API update
    const updatedDashboards = this.availableDashboards.map(dashboard => {
      const isSelected = selectedDashboardIds.includes(dashboard.dashboard_id);
      if (isSelected) {
        // Ensure currentGroups is always an array
        const currentGroups = Array.isArray(dashboard.group_name) 
          ? dashboard.group_name 
          : (dashboard.group_name ? [dashboard.group_name] : []);
        const updatedGroups = [...new Set([...currentGroups, ...newGroupNames])]; // merge & dedupe
        return {
          ...dashboard,
          sub_group : [],
          group_name: updatedGroups
        };
      }
      return dashboard;
    });

    // Filter to only send modified dashboards (ones that were selected)
    const modifiedDashboards = updatedDashboards.filter(dashboard => 
      selectedDashboardIds.includes(dashboard.dashboard_id)
    );

    console.log('modifiedDashboards', modifiedDashboards)
    this.loaderService.show();
    this.groupingDialog.hide();

    this.chartService.updateDashboardDetails(modifiedDashboards).subscribe(
      (res: any) => {
        this.popupService.showPopup({
          message: res.message,
          statusCode: res.status_code,
          status: res.success
        });
        this.loadDashboardData(); // loadDashboardData will hide the loader
      },
      (err: any) => {
        this.loaderService.hide();
        const errorMessage = err.error && err.error.message ? err.error.message : err.message;
        this.popupService.showPopup({
          message: errorMessage,
          statusCode: err.status,
          status: false
        });
        this.loadDashboardData(); // Rollback on failure
      }
    );
  }


  editGrouping(item: any) {
    // Reset form first
    this.groupingFormInit();

    console.log('item', item)
    // Get all dashboard IDs from the group
    const dashboardIds = item.dashboards.map((d: any) => d.dashboard_id);

    // Ensure group_name is always an array
    const groupNameArray = Array.isArray(item.group_name) 
      ? item.group_name 
      : (item.group_name ? [item.group_name] : []);

    // Set form values
    this.groupForm.patchValue({
      group_name: groupNameArray,
      customGroupName: '',
      dashboardNames: dashboardIds
    });

    // Show dialog
    this.groupingDialog.show();
  }


  addDashboardsToGroup(group: any) {
    // All dashboards (so user can add/remove)
    this.flattenedDashboards = this.availableDashboards;

    // IDs of dashboards already in this group
    const dashboardIds = group.dashboards.map((d: any) => d.dashboard_id);

    // this.editGroupNames = group.group_name && group.group_name.length ? this.groupNames : [{ name: 'Create New' }];
    // Patch form with current group(s)
    const currentGroups = group.group_name ? [group.group_name] : [];

    console.log('currentGroups', group)

    // Patch form: pre-select current dashboards
    this.groupForm.patchValue({
      group_name: currentGroups,
      customGroupName: '',
      dashboardNames: dashboardIds
    });

    this.groupingDialog.show();
  }








  editDashboardFormInit() {
    this.editDashboardForm = this.fb.group({
      group_names: [[], Validators.required],
      customGroupName: ['']
    });
    this.isEditCustomGroup = false;
  }

  openEditDashboardDialog(dashboard: any, group: any) {
    this.dashboardToEdit = dashboard;
    // Prepare group names (reuse groupNames, but ensure 'Create New' is present)
    this.editGroupNames = this.groupNames && this.groupNames.length ? this.groupNames : [{ name: 'Create New' }];
    // Patch form with current group(s)
    const currentGroups = Array.isArray(dashboard.group_name) ? dashboard.group_name : [];
    this.editDashboardForm.patchValue({
      group_names: currentGroups,
      customGroupName: ''
    });
    this.isEditCustomGroup = false;
    this.editDashboardDialogVisible = true;
    setTimeout(() => {
      if (this.editDashboardDialog) this.editDashboardDialog.show();
    });
  }


  onEditGroupChange(event: any) {
    // event.value is array of selected group names
    const selectedGroups = event.value || [];
    this.isEditCustomGroup = selectedGroups.includes('Create New');
    if (!this.isEditCustomGroup) {
      this.editDashboardForm.get('customGroupName')?.setValue('');
    }
  }

  // saveGrouping(){
  //   let formValue = this.createGroupForm.value;
  //   console.log(formValue)
  //   // this.loadDashboardData()
  // }

  createGroupDialogVisible: boolean = false;
  createGrouping() {
    this.createGroupFormInit();
    this.createGroupDialogVisible = true;
    setTimeout(() => {
      if (this.editDashboardDialog) this.editDashboardDialog.show();
    });
  }

  onCreateGroupSubmit() {
    if (this.createGroupForm.invalid) {
      return;
    }

    const colorPairs = [
      { header: 'rgb(100 164 230 / 84%)', body: 'rgb(190 212 235 / 63%)' }, // Dark Blue & Light Gray
      { header: '10% center rgb(232 53 97 / 94%)', body: 'rgb(231, 129, 154) 10%' }, // Dark Blue & Light Blue

      { header: 'rgb(69 231 69)', body: 'rgb(163 230 163 / 84%)' }, // Dark Green & Light Green
      { header: 'rgb(230 100 151 / 84%)', body: 'rgb(235 190 220 / 63%)' }, // Dark Red & Light Red
      { header: 'rgb(227 230 100 / 84%)', body: 'rgb(234 236 155 / 38%)' }, // Dark Purple & Light Purple
      { header: 'rgb(185 239 40 / 84%)', body: 'rgb(212 236 148 / 55%)' }, // Dark Orange & Light Orange
      { header: 'rgb(245, 165, 5)', body: 'rgb(240, 204, 132) 10%' }, // Dark Teal & Light Teal
      { header: 'rgb(227, 30, 79) 10%', body: 'rgb(231, 129, 154) 10%' }, // Dark Blue & Light Blue
      { header: '#2AFADF', body: 'rgb(151, 248, 235)' }, // Dark Red & Light Pink
      { header: '#4C83FF', body: 'rgb(165, 190, 249) 100%)' }, // Dark Purple & Light Lavender
      { header: '#654321', body: '#ffcc99' }, // Dark Brown & Light Peach
    ];

    const groupColorMap = new Map<string, { header: string; body: string }>();
    let colorIndex = 0;

    const formValue = this.createGroupForm.value;


    if (!groupColorMap.has(formValue.group_name)) {
      groupColorMap.set(formValue.group_name, colorPairs[colorIndex % colorPairs.length]);
      colorIndex++;
    }
    const color = groupColorMap.get(formValue.group_name);



    const newGroup: Group = {
      id: (this.dashboardDataList.length + 1).toString(),
      group_name: formValue.group_name,
      group_description: formValue.group_description ? formValue.group_description : '',
      header_background_color: color?.header,
      body_background_color: color?.body,
      dashboards: []
    };

    // Update local state
    this.dashboardDataList = [
      ...this.dashboardDataList.filter(group => group.group_name !== 'No Grouping'),
      newGroup
    ];

    // Update the groups in the UI
    this.groupNames = [
      { name: 'Create New' },
      ...this.dashboardDataList.map(group => ({ name: group.group_name }))
    ];

    // Close the dialog and show success message
    this.createGroupDialogVisible = false;
    if (this.editDashboardDialog) this.editDashboardDialog.hide();
    this.showToasterMessage('Group created successfully');
    // this.popupService.showPopup({
    //   message:'Group created successfully',
    //   statusCode: 200,
    //   status: true
    // });

    // Reset the form
    this.createGroupFormInit();

    // Optional: Save to session storage if needed
    // sessionStorage.setItem('dashboardList', JSON.stringify(this.dashboardDataList));
  }


  onEditDashboardSubmit() {
    if (this.editDashboardForm.invalid || !this.dashboardToEdit) return;
    const formValue = this.editDashboardForm.value;
    let finalGroups = formValue.group_names.filter((g: string) => g !== 'Create New');
    if (formValue.group_names.includes('Create New') && formValue.customGroupName) {
      finalGroups = [...finalGroups, formValue.customGroupName];
    }
    // Prepare updated dashboard object
    const updatedDashboard = {
      ...this.dashboardToEdit,
      group_name: finalGroups
    };
    this.loaderService.show();
    this.chartService.updateDashboardDetails([updatedDashboard]).subscribe(
      (res: any) => {
        this.loaderService.hide();
        this.editDashboardDialogVisible = false;
        if (this.editDashboardDialog) this.editDashboardDialog.hide();
        this.popupService.showPopup({
          message: res.message,
          statusCode: res.status_code,
          status: res.success
        });
        this.loadDashboardData();
      },
      (err: any) => {
        this.loaderService.hide();
        this.editDashboardDialogVisible = false;
        if (this.editDashboardDialog) this.editDashboardDialog.hide();
        const errorMessage = err.error && err.error.message ? err.error.message : err.message;
        this.popupService.showPopup({
          message: errorMessage,
          statusCode: err.status,
          status: false
        });
      }
    );
  }



  removeGroupFromDashboard(dashboard: Dashboard, groupToRemove: string) {

    if (confirm(`Are you sure you want to remove  dashboard"${dashboard.dashboard_name}" from "${groupToRemove}"?`)) {
      // Update the local state first
      this.unGroupedDashboards = this.unGroupedDashboards.map(d => {
        if (d.dashboard_id === dashboard.dashboard_id) {
          // Ensure group_name is always an array before filtering
          const currentGroups = Array.isArray(d.group_name) 
            ? d.group_name 
            : (d.group_name ? [d.group_name] : []);
          return {
            ...d,
            group_name: currentGroups.filter((group: string) => group !== groupToRemove)
          };
        }
        return d;
      });

      // Update the grouped dashboards
      this.dashboardDataList = this.dashboardDataList.map((group: Group) => {
        if (group.group_name === groupToRemove) {
          return {
            ...group,
            dashboards: group.dashboards.filter(d => d.dashboard_id !== dashboard.dashboard_id)
          };
        }
        return group;
      });

      // Prepare the API update
      // Ensure group_name is an array before filtering
      const currentGroupNames = Array.isArray(dashboard.group_name) 
        ? dashboard.group_name 
        : (dashboard.group_name ? [dashboard.group_name] : []);
      
      const updatedDashboard = {
        ...dashboard,
        group_name: currentGroupNames.filter(group => group !== groupToRemove)
      };

      console.log('Updated dashboard after removing group:', updatedDashboard);
      this.loaderService.show();
      this.chartService.updateDashboardDetails([updatedDashboard]).subscribe(
        (res: any) => {
          this.loaderService.hide();
          this.popupService.showPopup({
            message: res.message,
            statusCode: res.status_code,
            status: res.success
          });
          // Local state is already updated, no need to reload unless you want fresh data
          // this.loadDashboardData();

        },
        (err: any) => {
          this.loaderService.hide();
          const errorMessage = err.error && err.error.message ? err.error.message : err.message;
          this.popupService.showPopup({
            message: errorMessage,
            statusCode: err.status,
            status: false
          });

          // ✅ Rollback local changes if API fails
          this.loadDashboardData();
        }
      );
    }

  }

  showToasterMessage(message: string, type: 'success' | 'error' = 'success') {
    this.toasterMessage = message;
    this.toasterType = type;
    this.showToaster = true;
    setTimeout(() => {
      this.showToaster = false;
    }, 5000);
  }
}

