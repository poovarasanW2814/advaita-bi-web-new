import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild ,ChangeDetectorRef, inject} from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TabComponent, TabModule } from '@syncfusion/ej2-angular-navigations';
import { ChartService } from 'src/app/core/services/chart.service';
import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';
import { SwitchModule, ButtonModule } from '@syncfusion/ej2-angular-buttons';
import { NgIf, NgFor } from '@angular/common';
import { ColorPickerModule } from '@syncfusion/ej2-angular-inputs';

interface ViewConfig {
  scheduleView: string;
  startHour: string;
  endHour: string;
  enableTimelineView: boolean;
}

@Component({
    selector: 'app-property-scedule',
    templateUrl: './property-scedule.component.html',
    styleUrls: ['./property-scedule.component.scss'],
    imports: [TabModule, FormsModule, ReactiveFormsModule, DropDownListModule, SwitchModule, NgIf, NgFor, ButtonModule, ColorPickerModule]
})
export class PropertySceduleComponent implements OnInit, OnChanges {

  private readonly fb = inject(FormBuilder);
  private readonly chartService = inject(ChartService);
  private readonly cdr = inject(ChangeDetectorRef);
  constructor() {
    this.onFormInit();
  }


  @Input() getPanelObj: any;
  @Output() sendBoxObj = new EventEmitter()

  @ViewChild('tabComponent') tab!: TabComponent
  public headerText: any = [{ text: "General" },
  { text: "Measure" }, { text: "Grouping" },{ text: "Raw Query" },{ text: "Views" },{text: "Conditional Formatting"}];


  //   public headerText: any = [{ text: "General" },
  // { text: "Measure" }, { text: "Grouping" }, { text: "Views" }, { text: "Raw Query" }];

  tableNamesArray: any = [];
  selectedTableFieldName: any = []
  connection_id: any = '';
  isEditMode = false;
  editIndex: number | null = null;
  resourceList: any[] = [];
  viewsList: any[] = [];
  isViewEditMode = false;
  viewEditIndex: number | null = null;
  selectedConditionType!: string;
  showConditionAddBtn: boolean = true;
  updateConditonBtn: boolean = false;
  conditionalFormatSettingsArray: any[] = [];

  normalViews: Object[] = [
    { text: 'Day', value: 'Day' },
    { text: 'Week', value: 'Week' },
    { text: 'Month', value: 'Month' },
    { text: 'Year', value: 'Year' },
    { text: 'Agenda', value: 'Agenda' }
  ];

  timelineViews: Object[] = [
    { text: 'Timeline Day', value: 'TimelineDay' },
    { text: 'Timeline Week', value: 'TimelineWeek' },
    { text: 'Timeline Month', value: 'TimelineMonth' },
    { text: 'Timeline Year', value: 'TimelineYear' }
  ];
  currentViewOptions: any[] = [];
  viewFields: Object = { text: 'text', value: 'value' };

  editConditionIndex: number | null = null;
  ngOnInit(): void {
        this.onFormInit();

    const enableTimelineControl =
      this.scedularTemplateForm.get('viewSettings.enableTimelineView'); // Changed here

    this.currentViewOptions = this.normalViews;

    enableTimelineControl?.valueChanges.subscribe((isEnabled: boolean) => {
      this.scedularTemplateForm
        .get('viewSettings.scheduleView')
        ?.setValue('');

      this.currentViewOptions = isEnabled
        ? this.timelineViews
        : this.normalViews;
    });
  }

  // ngOnChanges(changes: SimpleChanges): void {
  //   let currentValue = changes['getPanelObj'].currentValue;
  //   console.log('getPanelObj', currentValue)
  //   if (currentValue != undefined || currentValue != null) {
  //     this.getPanelObj = currentValue;
  //     if (this.tab) {
  //       this.tab.selectedItem = 0;

  //     }

  //     if (currentValue) {
  //       this.connection_id = currentValue.connection_id;
  //     }

  //     this.chartService.getTableNamesArrary(this.connection_id).subscribe((res: any) => {
  //       let data = res['data'];
  //       this.tableNamesArray = data;

  //       console.log('tableres', res)

  //       if (this.getPanelObj.content.tableName) {
  //         this.onTableDropdown(this.getPanelObj.content.tableName);
  //       }
  //     });

  //           if (this.getPanelObj.content.viewsConfiguration && Array.isArray(this.getPanelObj.content.viewsConfiguration) && this.getPanelObj.content.viewsConfiguration.length > 0) {
  //       this.viewsList = [...this.getPanelObj.content.viewsConfiguration];
  //       console.log('Loaded viewsList from viewsConfiguration:', this.viewsList);
  //     } else if (this.getPanelObj.content.viewsList && Array.isArray(this.getPanelObj.content.viewsList) && this.getPanelObj.content.viewsList.length > 0) {
  //       this.viewsList = [...this.getPanelObj.content.viewsList];
  //       console.log('Loaded viewsList from viewsList:', this.viewsList);
  //     } else {
  //       this.viewsList = [];
  //       console.log('No viewsList found, initialized as empty');
  //     }

  //     this.conditionalFormatSettingsArray = this.getPanelObj.content.conditionalFormatting
  //       ? this.getPanelObj.content.conditionalFormatting
  //       : [];
  //     this.resourceList = this.getPanelObj.content.resources ? this.getPanelObj.content.resources : [];
  //     this.viewsList = this.getPanelObj.content.viewsList ? this.getPanelObj.content.viewsList : [];
  //     this.rawQueryValue = this.getPanelObj.content.rawQuery ? this.getPanelObj.content.rawQuery : '';
  //     this.scedularTemplateForm.patchValue({
  //       title: this.getPanelObj.header || this.getPanelObj.content.title || '',
  //       tableName: this.getPanelObj.content.tableName || '',
  //       rawQuery: this.getPanelObj.content.rawQuery || '',
  //       scheduleView : this.getPanelObj.content.scheduleView || 'Week',
  //       selectedDate: this.getPanelObj.content.selectedDate || new Date(),
  //       enablePopup : this.getPanelObj.content.enablePopup != null ? this.getPanelObj.content.enablePopup : false,
  //       fieldDetails: {
  //         idField: this.getPanelObj.content.fieldDetails?.idField || '',
  //         subject: this.getPanelObj.content.fieldDetails?.subject || '',
  //         startTime: this.getPanelObj.content.fieldDetails?.startTime || '',
  //         endTime: this.getPanelObj.content.fieldDetails?.endTime || '',
  //         description: this.getPanelObj.content.fieldDetails?.description || '',
  //         location: this.getPanelObj.content.fieldDetails?.location || ''
  //       },
  //       resources: {
  //         GroupIdField: this.getPanelObj.content.resources?.GroupIdField || '', // fro grouping parent
  //         name: this.getPanelObj.content.resources?.name || '', //for label
  //         field: this.getPanelObj.content.resources?.field || '', // group by field
  //         text: this.getPanelObj.content.resources?.text || '' ,// for label

  //           dataSource : []
  //       },
  //       timeScale: {
  //         enable: this.getPanelObj.content.timeScale?.enable != null ? this.getPanelObj.content.timeScale.enable : false, // fro grouping parent
  //         interval: this.getPanelObj.content.timeScale?.interval || 60, //for label
  //         slotCount: this.getPanelObj.content.timeScale?.slotCount || ''
  //       },
  //               viewSettings: {
  //         scheduleView: '',
  //         enableTimelineView: false,
  //         startHour: '09:00:00',
  //         endHour: '20:00:00'
  //       },
  //       viewConfig: this.fb.group({
  //         view: ['Day'],
  //         startHour: ['8'],
  //         endHour: ['18'],
  //         interval: ['60']
  //       })
  //     });

  //     if (this.viewsList.length > 0) {
  //       this.currentViewOptions = this.viewsList[0].enableTimelineView
  //         ? this.timelineViews
  //         : this.normalViews;
  //       console.log('currentViewOptions set based on first view');
  //     } else {
  //       this.currentViewOptions = this.normalViews;
  //     }
  //     this.cdr.detectChanges(); 
  //   }
  // }
ngOnChanges(changes: SimpleChanges): void {
  let currentValue = changes['getPanelObj'].currentValue;
  console.log('getPanelObj', currentValue);
  
  if (currentValue == undefined && currentValue == null) return;

  this.getPanelObj = currentValue;
  if (this.tab) this.tab.selectedItem = 0;
  this.connection_id = currentValue.connection_id;

  // âœ… Load views - only set ONCE, no overwrite below
  if (this.getPanelObj.content.viewsConfiguration?.length > 0) {
    this.viewsList = [...this.getPanelObj.content.viewsConfiguration];
  } else if (this.getPanelObj.content.viewsList?.length > 0) {
    this.viewsList = [...this.getPanelObj.content.viewsList];
  } else {
    this.viewsList = [];
  }

  this.conditionalFormatSettingsArray = this.getPanelObj.content.conditionalFormatting ?? [];
  this.resourceList = this.getPanelObj.content.resources ?? [];
  this.rawQueryValue = this.getPanelObj.content.rawQuery ?? '';

  // âœ… Step 1: Load table names
  this.chartService.getTableNamesArrary(this.connection_id).subscribe((res: any) => {
    this.tableNamesArray = res['data'];

    if (this.getPanelObj.content.tableName) {

      // âœ… Step 2: Load column names THEN patch form
      this.chartService.getColumnNameBYTableName(
        this.getPanelObj.content.tableName,
        this.connection_id
      ).subscribe((colRes: any) => {
        if (colRes) {
          this.selectedTableFieldName = [
            { text: 'Select', value: '' },
            ...Object.keys(colRes['data']).map((key: string) => ({ text: key, value: key }))
          ];

          console.log('selectedTableFieldName loaded:', this.selectedTableFieldName);

          // âœ… Step 3: Patch form AFTER columns are available
          this.scedularTemplateForm.patchValue({
            title: this.getPanelObj.header || this.getPanelObj.content.title || '',
            tableName: this.getPanelObj.content.tableName || '',
            rawQuery: this.getPanelObj.content.rawQuery || '',
            selectedDate: this.getPanelObj.content.selectedDate || new Date(),
            enablePopup: this.getPanelObj.content.enablePopup ?? false,
            fieldDetails: {
              idField:     this.getPanelObj.content.fieldDetails?.idField || '',
              subject:     this.getPanelObj.content.fieldDetails?.subject || '',
              startTime:   this.getPanelObj.content.fieldDetails?.startTime || '',
              endTime:     this.getPanelObj.content.fieldDetails?.endTime || '',
              description: this.getPanelObj.content.fieldDetails?.description || '',
              location:    this.getPanelObj.content.fieldDetails?.location || ''
            },
            resources: {
              GroupIdField: this.getPanelObj.content.resources?.GroupIdField || '',
              name:         this.getPanelObj.content.resources?.name || '',
              field:        this.getPanelObj.content.resources?.field || '',
              text:         this.getPanelObj.content.resources?.text || '',
              dataSource:   []
            },
            timeScale: {
              enable:    this.getPanelObj.content.timeScale?.enable ?? false,
              interval:  this.getPanelObj.content.timeScale?.interval || 60,
              slotCount: this.getPanelObj.content.timeScale?.slotCount || ''
            },
            viewSettings: {
              scheduleView:       '',
              enableTimelineView: false,
              startHour:          '09:00:00',
              endHour:            '20:00:00'
            }
          });

          if (this.viewsList.length > 0) {
            this.currentViewOptions = this.viewsList[0].enableTimelineView
              ? this.timelineViews
              : this.normalViews;
          } else {
            this.currentViewOptions = this.normalViews;
          }

          this.cdr.detectChanges();
        }
      });
    } else {
      // No tableName saved yet - still patch non-dropdown fields
      this.scedularTemplateForm.patchValue({
        title: this.getPanelObj.header || this.getPanelObj.content.title || '',
        rawQuery: this.getPanelObj.content.rawQuery || '',
        selectedDate: this.getPanelObj.content.selectedDate || new Date(),
        enablePopup: this.getPanelObj.content.enablePopup ?? false,
        timeScale: {
          enable:    this.getPanelObj.content.timeScale?.enable ?? false,
          interval:  this.getPanelObj.content.timeScale?.interval || 60,
          slotCount: this.getPanelObj.content.timeScale?.slotCount || ''
        }
      });
      this.cdr.detectChanges();
    }
  });
}

  scedularTemplateForm!: FormGroup;
  selectFieldName: string = '';
  intervalData: string[] = ['30', '60', '90', '120', '150', '180', '240', '300', '720'];
  slotCountData: string[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
  scheduleViewDatas: string[] = ['Day', 'Week', 'Month', 'Year', 'TimelineDay', 'TimelineWeek', 'TimelineMonth', 'Agenda'];
  hoursData: string[] = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];

  onFormInit() {
    this.scedularTemplateForm = this.fb.group({
      tableName: ['', [Validators.required]],
      title: [''],
      rawQuery: [''],
      selectedDate: [''],
      groupBy: [""],
      conditions: [""],
      orderBy: [""],
      orderByType: [""],
      // scheduleView : ['TimelineWeek'],
      enablePopup : [''],
      fieldDetails: this.fb.group({
        idField: [''],
        subject: [''],
        startTime: [''],
        endTime: [''],
        description: [''],
        location: ['']
      }),
      resources: this.fb.group({
        GroupIdField: [''], // fro grouping parent 
        name: [''], //for label
        field: [''], // group by field
        text: [''], // for label
        dataSource : []
      }),
      timeScale: this.fb.group({
        enable: [true], // fro grouping parent 
        interval: [''], //for label
        slotCount: [''], // group by field

      }),
      viewConfig: this.fb.group({
        view: ['Day'],
        startHour: ['8'],
        endHour: ['18'],
        interval: ['60']
      }),
      formattingCondition: this.fb.group({
        measureField: [''],
        value1: [''],
        value2: [''],
        conditionFormat: [''],
        BackgroundColor: ['#199e3f'],
        Fontcolor: ['#080606'],
        fontSize: ['14px'],
        fontFamily: ['Tahoma']
      }),
      viewSettings: this.fb.group({
        enableTimelineView: [false],
        scheduleView: [''],
        startHour: ['09:00:00'],
        endHour: ['20:00:00']
      }),
    })

  }

onGroupingFieldChange(e: any) {
  const resourcesGroup = this.scedularTemplateForm.get('resources') as FormGroup;

  resourcesGroup.patchValue({
    name: e.itemData.text   // âœ… auto-patch inside "resources" group
  });
}



  onTableDropdown(dropdownValue: any) {

    console.log('dropdownValue', dropdownValue)

    if (!dropdownValue) {
      this.selectedTableFieldName = []
      return;
    }
    const tableNameControl = this.scedularTemplateForm.get('tableName');
    tableNameControl!.setValue(dropdownValue);

    if (dropdownValue != undefined || dropdownValue != "" || dropdownValue != null) {
      this.chartService.getColumnNameBYTableName(dropdownValue, this.connection_id).subscribe((res: any) => {
        console.log(res);
        if (res) {
          let data: any = res['data'];
          let objdata: any = Object.keys(data)

          // this.selectedTableFieldName = Object.keys(data);
          this.selectedTableFieldName = [
            { text: "Select", value: "" },
            ...Object.keys(data).map(key => ({ text: key, value: key }))
          ];

          console.log('selectedTableFieldName', this.selectedTableFieldName);

        }
      });
    } else {
      this.selectedTableFieldName = []; // Reset the field name array if no table name is selected
    }
  }

  onSecondDropdownChange(eve: any) {
    let dropdownValue = eve;

    console.log('eve', eve)
    let labelNameControl = this.scedularTemplateForm.get('labelName');

    // labelNameControl!.setValue(dropdownValue);
    // this.selectFieldName = dropdownValue
  }

  onClearRawQuery() {
    this.rawQueryValue = "";
    // this.scedularTemplateForm.get('rawQuery')!.reset();
    this.scedularTemplateForm.get('rawQuery')!.setValue("");
  }

  updateCursorPosition(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;
    this.cursorPosition = textarea.selectionStart;
  }


  cursorPosition: number = 0;
  rawQueryValue: string = '';

  addRawQueryText(event: any) {
    const operator = event.target.value; // Value from the button
    const currentText = this.rawQueryValue;

    console.log('currentText', currentText);
    if (operator) {
      // Add space before and after the operator
      const operatorWithSpaces = ` ${operator} `;

      // Insert the operator (with spaces) at the cursor position
      const beforeCursor = currentText.slice(0, this.cursorPosition);
      const afterCursor = currentText.slice(this.cursorPosition);
      this.rawQueryValue = `${beforeCursor}${operatorWithSpaces}${afterCursor}`;

      // Update the cursor position to be after the newly inserted operator (including spaces)
      this.cursorPosition += operatorWithSpaces.length;

      // Optionally, restore focus to the textarea and set the cursor position
      const textarea = document.getElementById("pop_chart_expression") as HTMLTextAreaElement;
      if (textarea) {
        textarea.focus();
        textarea.setSelectionRange(this.cursorPosition, this.cursorPosition);
      }
    }
  }

  addToTextarea(name: string) {
    // const operator = name + ' ';
    const operator = ' ' + name + ' ';

    const currentText = this.rawQueryValue;

    if (operator) {
      // Insert the operator at the cursor position
      const beforeCursor = currentText.slice(0, this.cursorPosition);
      const afterCursor = currentText.slice(this.cursorPosition);
      this.rawQueryValue = `${beforeCursor}${operator}${afterCursor}`;

      // Update the cursor position to be after the newly inserted operator
      this.cursorPosition += operator.length;

      // Optionally, restore focus to the textarea
      const textarea = document.getElementById("pop_chart_expression") as HTMLTextAreaElement;
      if (textarea) {
        textarea.focus();
        textarea.setSelectionRange(this.cursorPosition, this.cursorPosition);
      }
    }
  }


   @ViewChild('tabComponent') tabObj!: TabComponent;
   submitted = false;


  // Helper method to extract invalid controls (recursively for nested form groups)
findInvalidControls(formGroup: FormGroup, parentKey: string = ''): string[] {
  let invalidControls: string[] = [];

  Object.keys(formGroup.controls).forEach(key => {
    const control = formGroup.get(key);
    const controlName = parentKey ? `${parentKey}.${key}` : key;

    if (control instanceof FormGroup) {
      // if nested form group, check inside recursively
      invalidControls = invalidControls.concat(this.findInvalidControls(control, controlName));
    } else if (control?.invalid) {
      // add the field name if invalid
      invalidControls.push(controlName);
    }
  });

  return invalidControls;
}

// Returns true if a given FormGroup has invalid controls
isTabInvalid(...tabGroupNames: string[]): boolean {
  return tabGroupNames.some(groupName => {
    const group = this.scedularTemplateForm.get(groupName);
    return group ? group.invalid && (group.touched || this.submitted) : false;
  });
}


  onSubmit() {

    this.submitted = true;
     this.scedularTemplateForm.markAllAsTouched();

   if (this.scedularTemplateForm.invalid) {
    const firstInvalid = this.findInvalidControls(this.scedularTemplateForm)[0];

    console.log('firstInvalid', firstInvalid);
    console.log('this.tabObj', this.tabObj);

    if (firstInvalid.includes('fieldDetails')) {
      this.tabObj.select(1); // switch to Field Details tab
    } else if (firstInvalid.includes('timeScale')) {
      this.tabObj.select(1); // switch to Time Scale tab
    }
     else if (firstInvalid.includes('viewConfig')) {
      this.tabObj.select(3); // switch to Views tab
    }
     else if (firstInvalid.includes('rawQuery')) {
      this.tabObj.select(4); // switch to Raw Query tab
    } else {
      this.tabObj.select(0); // default tab
    }

    // alert("Please fill in all mandatory fields: " + firstInvalid);
    return;
   }

      
    console.log('scedularTemplateForm', this.scedularTemplateForm.value)
    let formValue = this.scedularTemplateForm.value;
    console.log('formValue', formValue)

    let panelsArrData: any = sessionStorage.getItem('createPanelSeriesArray');

    if (panelsArrData != null || panelsArrData != undefined) {
      panelsArrData = JSON.parse(panelsArrData);
      console.log('panelsArrData', panelsArrData);

      const matchingObjectIndex = Array.isArray(panelsArrData)
        ? panelsArrData.findIndex(obj => obj.id === this.getPanelObj.id)
        : -1;

      // let views = ['Day', 'Week', 'Month', 'TimelineWeek', 'TimelineMonth', 'TimelineDay', 'MonthAgenda', 'TimelineYear', 'Agenda'];
      let views = this.viewsList.length > 0 ? this.viewsList.map(v => v.view) : ['Day', 'Week', 'Month',  'TimelineDay', 'TimelineWeek', 'TimelineMonth', 'Agenda'];

      let eventSettings = {
        dataSource: [], // assign from response or existing data
        allowAdding: false,
        allowEditing: false,
        allowDeleting: false,
        // enableIndicator: true,
        enableTooltip: true,
        fields: {
          id: formValue.fieldDetails.idField,
          subject: { name: formValue.fieldDetails.subject, title: 'Subject' },
          location: formValue.fieldDetails.location
            ? { name: formValue.fieldDetails.location, title: 'Location' }
            : undefined,
          description: formValue.fieldDetails.description
            ? { name: formValue.fieldDetails.description, title: 'Description' }
            : undefined,
          startTime: { name: formValue.fieldDetails.startTime, title: 'From' },
          endTime: { name: formValue.fieldDetails.endTime, title: 'To' }
        }
      };

      let obj = {
        ...this.getPanelObj,
        header: formValue.title,
        content: {
          tableName: formValue.tableName || '',
          rawQuery: formValue.rawQuery || '',
          selectedDate: formValue.selectedDate || new Date(),
          scheduleView : formValue.scheduleView || 'Week',
          enablePopup : formValue.enablePopup != null ? formValue.enablePopup : false,
          views: views,
          viewsConfiguration: this.viewsList,
          fieldDetails: {
            idField: formValue.fieldDetails.idField || '',
            subject: formValue.fieldDetails.subject || '',
            startTime: formValue.fieldDetails.startTime || '',
            endTime: formValue.fieldDetails.endTime || '',
            description: formValue.fieldDetails.description || '',
            location: formValue.fieldDetails.location || ''
          },
          resources: {
            GroupIdField: formValue.resources.GroupIdField || '', // fro grouping parent
            name: formValue.resources.name || '', //for label
            field: formValue.resources.field || '',  // group by field,
            text: formValue.fieldDetails.text || '',
            dataSource : []

          },

          timeScale: {
            enable: formValue.timeScale.enable != null ? formValue.timeScale.enable : false, // fro grouping parent 
            interval: formValue.timeScale.interval || 60, //for label
            slotCount: formValue.timeScale.slotCount || '' // group by field
          },
          viewsList: this.viewsList,
          eventSettings: eventSettings,
          conditionalFormatting: this.conditionalFormatSettingsArray || [],
          "orderBy": formValue.orderBy || [],
          "orderByType": formValue.orderByType || '',
          "groupBy": formValue.groupBy || [],
          "conditions": formValue.conditions || ''

        }
      }

      if (matchingObjectIndex !== -1) {
        panelsArrData[matchingObjectIndex] = {
          ...obj
        }
      }
      sessionStorage.setItem('createPanelSeriesArray', JSON.stringify(panelsArrData));
      let boxApiObj = {
        "object_id": this.getPanelObj.id,
        "object_setup": {
          ...obj
        },
        "connection_id": this.connection_id,
        "object_type": "calender"
      }

      console.log('boxApiObj', boxApiObj)

      this.chartService.objectPivotCreate(boxApiObj).subscribe((res: any) => {
        console.log('boxApiObj res', res);
        if (res.success) {
          let resobj = res['data'];
          let data = resobj.object_setup.content;
          let updatedDataSource = data.dataSource.map((item: any, index: number) => ({
            ...item,
            Id: index + 1
          }));


          let eventSettings = {
            dataSource: updatedDataSource, // assign from response or existing data
            allowAdding: false,
            allowEditing: false,
            allowDeleting: false,
            // enableIndicator: true,
            enableTooltip: true,
            fields: {
              ...data.eventSettings.fields,
              id : 'Id'
              
            }
          };
          console.log('eventSettings', eventSettings);

           let updatedzresouceDataSource = data.resources.dataSource.map((item: any, index: number) => ({
              ...item,
              Id: index + 1
           }));


          if (data.resources && data.resources.field) {
            // data.resources.dataSource = this.getResourceData(data.resources, updatedDataSource, data.fieldDetails);

            // this line add when api gave resource datasource
           data.resources.dataSource = this.getResourceData(data.resources, updatedzresouceDataSource, data.fieldDetails);
          }

          // console.log('resourcesData', resourcesData);
          let groupsList = data.resources.name ? [data.resources.name] : [];
          // console.log('resourcesData', resourcesData);
          let boxObj = {
            ...this.getPanelObj,
            header: formValue.title,
            content: {
              ...data,
              eventSettings,
              group: {
                // enableCompactView: false,
                resources: groupsList
              }
            }
          }

          console.log('boxObj', boxObj);
          // this.sendBoxObj.emit(boxObj);
          this.sendBoxObj.emit({ boxObj: boxObj, resObj: { resSuccess: res.success, resMessage: res.message, statusCode: res.status_code } });

          this.scedularTemplateForm.reset();
        } else {
          let boxObj = panelsArrData[matchingObjectIndex];
          this.sendBoxObj.emit({ boxObj: boxObj, resObj: { resSuccess: false, resMessage: res.message, statusCode: res.status_code } });
          console.error('Error creating box object');
        }
      }, (error: any) => {
        let boxObj = panelsArrData[matchingObjectIndex];
        const errorMessage = error.error && error.error.message ? error.error.message : error.message;
        this.sendBoxObj.emit({ boxObj: boxObj, resObj: { resSuccess: false, resMessage: errorMessage, statusCode: error.status } });
        console.error('Error creating box object', error);
      });


    }



  }



  getResourceData1(res: any, dataSource: any, fieldDetails: any): any[] {
    console.log('getResourceData1 res', res);
    // Extract unique values from dataSource for this resource field
    const uniqueVals = Array.from(
      new Set(dataSource.map((d: any) => d[res.field]))
    );

    console.log('uniqueVals', uniqueVals)

    // Convert to [{ text, id, color }]
    return uniqueVals.map((val, index) => {
      // Find the first matching record in dataSource to extract the id from fieldDetails.idField
      const matchingRecord = dataSource.find((d: any) => d[res.field] === val);
      const idValue = matchingRecord ? matchingRecord[fieldDetails.idField] : index;

      return {
        // text: val,
        text: val,
        id: val,
        color: this.randomColor(index)
      };
    });
  }

  getResourceData(res: any, dataSource: any, fieldDetails: any): any[] {
    // Extract unique values for the given resource field
        console.log('getResourceData1 res', res);
    const uniqueVals = Array.from(
      new Set(dataSource.map((d: any) => d[res.field]))
    );

    console.log('uniqueVals', uniqueVals);

    return uniqueVals.map((val, index) => {
      // Find the first matching record in the dataSource
      const matchingRecord = dataSource.find((d: any) => d[res.field] === val);

      return {
        // Use res.textField if provided, else fallback to the value
        text: matchingRecord
          ? matchingRecord[res.text || res.field]
          : val,
        id: val, // keep id same as unique value
        color: this.randomColor(index)
      };
    });
  }

  randomColor(index: number): string {
    const colors = ['#98AFC7', '#99c68e', '#C2B280', '#3090C7', '#95b9c7', '#deb887', '#778899', '#f4a460', '#dda0dd'];
    return colors[index % colors.length];
  }






  onCancel() {
    this.scedularTemplateForm.reset();
    this.sendBoxObj.emit(null);
  }


  // Add new row
  onAdd() {
    const resource = this.scedularTemplateForm.get('resources')?.value;
    this.resourceList.push(resource);
    // this.scedularTemplateForm.reset();
  }

  // Populate form for editing
  onEdit(index: number) {
    this.isEditMode = true;
    this.editIndex = index;
    const resource = this.resourceList[index];
    this.scedularTemplateForm.patchValue({ resources: resource });
  }

  // Update the selected row
  onUpdate() {
    if (this.editIndex !== null) {
      this.resourceList[this.editIndex] = this.scedularTemplateForm.get('resources')?.value;
      this.isEditMode = false;
      this.editIndex = null;
      // this.scedularTemplateForm.reset();
    }
  }

  // Delete row
  onDelete(index: number) {
    this.resourceList.splice(index, 1);
  }

  // Reset form
  onReset() {
    this.scedularTemplateForm.reset();
    this.isEditMode = false;
    this.editIndex = null;
  }

  showViewAddBtn: boolean = true;
  updateViewBtn: boolean = false;
  // View Configuration Methods
onAddView() {
  console.log('onAddView called!');

  const viewSettings = this.scedularTemplateForm.get('viewSettings')?.value;

  if (!viewSettings?.scheduleView) {
    alert('Please select a view');
    return;
  }

  if (!viewSettings.startHour || !viewSettings.endHour) {
    alert('Please set start and end hours');
    return;
  }

  const newView: ViewConfig = {
    scheduleView: viewSettings.scheduleView,
    startHour: viewSettings.startHour,
    endHour: viewSettings.endHour,
    enableTimelineView: viewSettings.enableTimelineView ?? false
  };

  this.viewsList.push(newView);

  // âœ… Only reset viewSettings group, not the entire form
  this.scedularTemplateForm.get('viewSettings')?.reset({
    scheduleView: '',
    startHour: '09:00:00',
    endHour: '20:00:00',
    enableTimelineView: false
  }, { emitEvent: false }); // âœ… emitEvent: false prevents triggering valueChanges

  this.currentViewOptions = this.normalViews;
  this.cdr.detectChanges();
}

onEditView(index: number) {
  this.isViewEditMode = true;
  this.viewEditIndex = index;
  this.showViewAddBtn = false;
  this.updateViewBtn = true;

  const viewConfig = this.viewsList[index];

  this.currentViewOptions = viewConfig.enableTimelineView
    ? this.timelineViews
    : this.normalViews;

  // âœ… emitEvent: false prevents side effects on other form controls
  this.scedularTemplateForm.get('viewSettings')?.patchValue({
    scheduleView: viewConfig.scheduleView,
    enableTimelineView: viewConfig.enableTimelineView,
    startHour: viewConfig.startHour,
    endHour: viewConfig.endHour
  }, { emitEvent: false });
}

onUpdateView() {
  if (this.viewEditIndex !== null) {
    const viewConfig = this.scedularTemplateForm.get('viewSettings')?.value;

    this.viewsList[this.viewEditIndex] = {
      scheduleView: viewConfig.scheduleView,
      startHour: viewConfig.startHour,
      endHour: viewConfig.endHour,
      enableTimelineView: viewConfig.enableTimelineView ?? false
    };

    this.isViewEditMode = false;
    this.viewEditIndex = null;
    this.showViewAddBtn = true;
    this.updateViewBtn = false;

    // âœ… Only reset viewSettings, emitEvent: false to avoid side effects
    this.scedularTemplateForm.get('viewSettings')?.reset({
      scheduleView: '',
      startHour: '09:00:00',
      endHour: '20:00:00',
      enableTimelineView: false
    }, { emitEvent: false });

    this.currentViewOptions = this.normalViews;
    this.cdr.detectChanges();
  }
}

onDeleteView(index: number) {
  this.viewsList.splice(index, 1);
  this.cdr.detectChanges(); // âœ… Ensure table updates after delete
}

  onResetView() {
    this.scedularTemplateForm.get('viewConfig')?.reset({
      view: 'Day',
      startHour: '8',
      endHour: '18',
      interval: '60'
    });
    this.isViewEditMode = false;
    this.viewEditIndex = null;
  }

    copyMessage: string = '';
  copyDimensionMessage: string = '';

  onCopyRawQuery() {
    const queryText = this.rawQueryValue || '';

    if (queryText.trim() !== '') {
      navigator.clipboard.writeText(queryText).then(() => {
        this.copyMessage = "Query copied!";
        setTimeout(() => this.copyMessage = '', 2000);
      }).catch(err => {
        console.error("Failed to copy: ", err);
        this.copyMessage = "Failed to copy!";
        setTimeout(() => this.copyMessage = '', 2000);
      });
    } else {
      this.copyMessage = "No query to copy!";
      setTimeout(() => this.copyMessage = '', 2000);
    }
  }
  
  
    onAddConditionFormat() {
    const formattingCondition = this.scedularTemplateForm.get('formattingCondition')?.value;

    if (formattingCondition.conditionFormat === 'Between' && formattingCondition.value2 === null) {
      alert('Please enter End Value for Between condition');
      return;
    }

    const newRule = {
      measure: formattingCondition.measureField,
      conditions: formattingCondition.conditionFormat,
      value1: formattingCondition.value1,
      value2: formattingCondition.value2,
      style: {
        backgroundColor: formattingCondition.BackgroundColor,
        color: formattingCondition.Fontcolor,
        fontSize: formattingCondition.fontSize,
        fontFamily: formattingCondition.fontFamily
      }
    };

    this.conditionalFormatSettingsArray.push(newRule);

    // Use patchValue instead of reset
    this.scedularTemplateForm.get('formattingCondition')?.patchValue({
      measureField: '',
      conditionFormat: '',
      value1: '',
      value2: '',
      BackgroundColor: '#f44336',
      Fontcolor: '#ffffff',
      fontSize: '14px',
      fontFamily: 'Tahoma'
    });

    this.selectedConditionType = '';
    console.log('Conditional Format Settings Array:', this.conditionalFormatSettingsArray);
  }

  // Updated onEditConditionObj - Remove value3 and referenceFieldName
  onEditConditionObj(item: any, index: number) {
    this.editConditionIndex = index;
    this.showConditionAddBtn = false;
    this.updateConditonBtn = true;
    this.selectedConditionType = item.conditions;

    this.scedularTemplateForm.get('formattingCondition')?.patchValue({
      measureField: item.measure,
      conditionFormat: item.conditions,
      value1: item.value1,
      value2: item.value2,
      BackgroundColor: item.style.backgroundColor,
      Fontcolor: item.style.color,
      fontSize: item.style.fontSize,
      fontFamily: item.style.fontFamily
    });
  }

  onUpdateConditonObj() {
    if (this.editConditionIndex === null) return;

    const formattingCondition = this.scedularTemplateForm.get('formattingCondition')?.value;

    this.conditionalFormatSettingsArray[this.editConditionIndex] = {
      measure: formattingCondition.measureField,
      conditions: formattingCondition.conditionFormat,
      value1: formattingCondition.value1,
      value2: formattingCondition.value2,
      style: {
        backgroundColor: formattingCondition.BackgroundColor,
        color: formattingCondition.Fontcolor,
        fontSize: formattingCondition.fontSize,
        fontFamily: formattingCondition.fontFamily
      }
    };

    // Use patchValue instead of reset
    this.scedularTemplateForm.get('formattingCondition')?.patchValue({
      measureField: '',
      conditionFormat: '',
      value1: '',
      value2: '',
      BackgroundColor: '#f44336',
      Fontcolor: '#ffffff',
      fontSize: '14px',
      fontFamily: 'Tahoma'
    });

    this.showConditionAddBtn = true;
    this.updateConditonBtn = false;
    this.editConditionIndex = null;
    this.selectedConditionType = '';
  }
  hasAnyBetweenCondition(): boolean {
    return this.conditionalFormatSettingsArray.some((item: any) => item.conditions === 'Between');
  }
  onSelectCondtionFormatValue(eve: any) {
    let value = eve.target.value;
    this.selectedConditionType = value
  }

  onDeleteConditionObj(index: number) {
    this.conditionalFormatSettingsArray.splice(index, 1);
  }
  onTimelineViewToggle(event: any): void {
    const isEnabled = event.checked;
    this.currentViewOptions = isEnabled ? this.timelineViews : this.normalViews;
    this.scedularTemplateForm.get('viewSettings.scheduleView')?.setValue('');
    this.cdr.detectChanges();
  }
  onSecondDropdownMeasureChange(eve: any) {

    console.log('eve', eve)
  }

}

