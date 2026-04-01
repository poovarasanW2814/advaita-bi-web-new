import { TabComponent } from '@syncfusion/ej2-angular-navigations';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AnimationSettingsModel, Dialog, DialogComponent } from '@syncfusion/ej2-angular-popups';
import { ChartService } from 'src/app/core/services/chart.service';
import { DataManager, UrlAdaptor } from '@syncfusion/ej2-data';
import { Freeze, Grid, GridComponent, RowDD } from '@syncfusion/ej2-angular-grids';

@Component({
  selector: 'app-kanban',
  templateUrl: './kanban.component.html',
  styleUrls: ['./kanban.component.scss']
})
export class KanbanComponent implements OnInit, OnChanges {
  @ViewChild('tabComponent') tab!: TabComponent;
  @ViewChild('grid') grid!: GridComponent;
  @Input() getPanelType: any;
  @Input() getPanelObj: any;
  @Output() sendBoxObj = new EventEmitter<any>();

  columnTemplateForm!: FormGroup;

  headerText: any = [{ text: "General" },
  { text: "Measure" }, { text: "Condition" }, { text: "Raw Query" }];

  rawQueryDimension!: Dialog;
  showUpdateButton: boolean = false;
  showAddButton: boolean = true;
  tableNameObj: any;
  tableNamesArray: any = []
  connection_id!: number;
  fieldDetailsArrayAsArray: any;
  fieldDetailsArray: any[] = [];
  dataSourceArray: any = [];
  ApiPanelSeriesArray: any = [];
  columnObj: any;
  idCount: any = 0;
  panelSeriesArray: any = [];
  editFieldName: string = "";
  changeDetectorRef: any;
  // kanbanFieldNames: string[] = [];
  selectedTableFieldName: string[] = [];

  kanbanColumns: any[] = [];
  dialogSettings: any = { fields: [] };
  typeFieldName: string = '';
  priorityFieldName: string = '';
  item: any;
  // public kanbanData: Object[] = [
  //   {
  //     Id: 'Task 1',
  //     Title: 'Task - 29001',
  //     Status: 'Open',
  //     Summary: 'Analyze the new requirements gathered from the customer.',
  //     Assignee: 'vandana',
  //     Type: 'Story',
  //     StartDate: '2025-11-01',
  //     EndDate: '2025-11-05'
  //   },
  //   {
  //     Id: 'Task 2',
  //     Title: 'Task - 29002',
  //     Status: 'InProgress',
  //     Summary: 'Improve application performance',
  //     Assignee: 'vandana',
  //     Priority: 'High',
  //     Type: 'Epic',
  //     StartDate: '2025-11-03',
  //     EndDate: '2025-11-10'
  //   },
  //   {
  //     Id: 'Task 3',
  //     Title: 'Task - 29006',
  //     Status: 'Close',
  //     Summary: 'Arrange a web meeting with the customer to get the login page requirements.',
  //     Assignee: 'vandana',
  //     Priority: 'Low',
  //     Type: 'Story',
  //     StartDate: '2025-11-04',
  //     EndDate: '2025-11-06'
  //   },
  //   {
  //     Id: 'Task 4',
  //     Title: 'Task - 29007',
  //     Status: 'Validation',
  //     Summary: 'Validate new requirements',
  //     Assignee: 'vandana',
  //     Priority: 'Low',
  //     Type: 'Bug',
  //     StartDate: '2025-11-05',
  //     EndDate: '2025-11-08'
  //   },
  //   {
  //     Id: 'Task 5',
  //     Title: 'Task - 29009',
  //     Status: 'Open',
  //     Summary: 'Improve the performance of the editing functionality.',
  //     Assignee: 'Anagha',
  //     Priority: 'High',
  //     Type: 'Epic',
  //     StartDate: '2025-11-02',
  //     EndDate: '2025-11-12'
  //   }
  // ];

  fieldDetailsObject: any;
  constructor(private fb: FormBuilder, private chartService: ChartService,) {
    this.columnTemplateForm = this.fb.group({
      header: [''],
      tableName: ['', [Validators.required]],
      conditions: [""],
      rawQuery: [""],
      orderBy: [""],
      orderByType: [""],
      groupBy: [""],
      enableTooltip: [true],
      fieldDetails: this.fb.group({
        tableName: [""],
        titleField: [''],
        headerField: [''],
        contentField: [''],
        typeField: [''],
        keyField: [''],
        priorityField: [''],
        assigneeField: [''],
        startDateField: [''],
        endDateField: [''],
      }),

      dataSource: [],

    });
  }

  ngOnInit(): void {
    console.log('getPanelObj:', this.getPanelObj);
    console.log('getPanelType:', this.getPanelType);
    console.log('connection_id:', this.connection_id);

    let parseApiPanelSeriesArray = sessionStorage.getItem('ApiPanelSeriesArray')
    if (parseApiPanelSeriesArray) {
      this.ApiPanelSeriesArray = JSON.parse(parseApiPanelSeriesArray)
    }
  }

  // onKanbanFormSubmit() {
  //   console.log(this.columnTemplateForm.value);
  //   let formValue = this.columnTemplateForm.value;

  //   if (this.columnTemplateForm.invalid) {
  //     console.log(this.columnTemplateForm.invalid);
  //     this.columnTemplateForm.markAllAsTouched();
  //     return false;
  //   }

  //   let fieldDetailsArray = [];
  //   if (formValue.fieldDetails) {
  //     if (Array.isArray(formValue.fieldDetails)) {
  //       fieldDetailsArray = formValue.fieldDetails;
  //     } else {
  //       fieldDetailsArray = [formValue.fieldDetails];
  //     }
  //   }

  //   let panelId = this.getPanelObj.id;
  //   let id = panelId + "_kanban_" + this.idCount;

  //   let panelsArrData: any = sessionStorage.getItem('createPanelSeriesArray');
  //   this.panelSeriesArray = panelsArrData;

  //   if (this.panelSeriesArray != null) {
  //     this.panelSeriesArray = JSON.parse(this.panelSeriesArray);
  //     let object = this.panelSeriesArray.find((ele: any) => ele.id === this.getPanelObj.id);

  //     const matchingObjectIndex = Array.isArray(this.panelSeriesArray)
  //       ? this.panelSeriesArray.findIndex(obj => obj.id === this.getPanelObj.id)
  //       : -1;

  //     let kanbanObj: any = {
  //       "tableName": formValue.tableName,
  //       "tableTitle": formValue.header || "",
  //       "height": "100%",
  //       "width": "100%",
  //       "fieldDetails": fieldDetailsArray,
  //       "keyField": formValue.fieldDetails?.keyField,
  //       "cardSettings": {
  //         "contentField": formValue.fieldDetails?.contentField,
  //         "headerField": formValue.fieldDetails?.headerField,
  //       },
  //       "dataSource": [],
  //       "enableTooltip": formValue.enableTooltip !== undefined ? formValue.enableTooltip : true,
  //       "rawQuery": (formValue.rawQuery === "" || formValue.rawQuery === undefined) ? "" : formValue.rawQuery,
  //       "orderBy": (formValue.orderBy === "" || formValue.orderBy === undefined) ? [] : formValue.orderBy,
  //       "orderByType": (formValue.orderByType === "" || formValue.orderByType === undefined) ? "" : formValue.orderByType,
  //       "groupBy": (formValue.groupBy === "" || formValue.groupBy === undefined) ? [] : formValue.groupBy,
  //       "conditions": (formValue.conditions === "" || formValue.conditions === undefined) ? "" : formValue.conditions,
  //       "swimlaneSettings": {
  //         "keyField": formValue.fieldDetails?.assigneeField,
  //       }
  //     };

  //     let kanbanObjApi = {
  //       "object_id": this.getPanelObj.id,
  //       "object_setup": {
  //         "content": {
  //           ...kanbanObj,
  //         }
  //       },
  //       "object_type": "kanban",
  //       "connection_id": this.connection_id,
  //     };

  //     console.log(kanbanObj);
  //     console.log(kanbanObjApi);

  //     if (matchingObjectIndex !== -1) {
  //       // Update the existing object with the new data
  //       this.panelSeriesArray[matchingObjectIndex] = {
  //         ...this.getPanelObj,
  //         content: {
  //           ...kanbanObj,
  //         }
  //       };
  //     }

  //     console.log(this.panelSeriesArray);

  //     let boxObj = this.panelSeriesArray[matchingObjectIndex];
  //     console.log(boxObj);
  //     sessionStorage.setItem('createPanelSeriesArray', JSON.stringify(this.panelSeriesArray));

  //     let kanbanData = this.chartService.objectPivotCreate(kanbanObjApi);
  //     console.log(kanbanObjApi);

  //     kanbanData.subscribe(
  //       (res: any) => {
  //         console.log("res", res);

  //         if (res.success === true) {
  //           let resobj = res['data'];
  //           let data = resobj.object_setup.content;

  //           let dataSource = new DataManager({
  //             json: data.dataSource,
  //             adaptor: new UrlAdaptor()
  //           });

  //           let selecteddatasource = data.dataSource;

  //           const dataSourceKeys = data.dataSource && data.dataSource.length > 0
  //             ? Object.keys(data.dataSource[0])
  //             : [];

  //           const filteredFieldDetails = data.fieldDetails
  //             ? data.fieldDetails.filter((fieldDetail: any) => dataSourceKeys.includes(fieldDetail.field))
  //             : [];

  //           let updateObj = {
  //             ...this.getPanelObj,
  //             header: formValue.header,
  //             content: {
  //               id: "kanban_" + this.idCount,
  //               ...data,
  //               fieldDetails: data.fieldDetails ? data.fieldDetails : []
  //             }
  //           };

  //           console.log('updateObj', updateObj);
  //           console.log('dataSource', dataSource);

  //           this.sendBoxObj.emit({
  //             boxObj: updateObj,
  //             resObj: {
  //               resSuccess: res.success,
  //               resMessage: res.message,
  //               statusCode: res.status_code
  //             }
  //           });

  //           this.columnTemplateForm.reset();
  //         } else {
  //           let boxObj = this.panelSeriesArray[matchingObjectIndex];

  //           this.sendBoxObj.emit({
  //             boxObj: boxObj,
  //             resObj: {
  //               resSuccess: false,
  //               resMessage: res.message,
  //               statusCode: res.status_code
  //             }
  //           });
  //         }
  //       },


  //       (err: any) => {
  //         let boxObj = this.panelSeriesArray[matchingObjectIndex];

  //         this.sendBoxObj.emit({
  //           boxObj: boxObj,
  //           resObj: {
  //             resSuccess: false,
  //             resMessage: err.message,
  //             statusCode: err.status
  //           }
  //         });
  //       }
  //     );
  //   }

  //   return true;
  // }

  onKanbanFormSubmit() {
    console.log(this.columnTemplateForm.value);
    let formValue = this.columnTemplateForm.value;

    if (this.columnTemplateForm.invalid) {
      console.log(this.columnTemplateForm.invalid);
      this.columnTemplateForm.markAllAsTouched();
      return false;
    }

    let fieldDetailsArray = [];
    if (formValue.fieldDetails) {
      if (Array.isArray(formValue.fieldDetails)) {
        fieldDetailsArray = formValue.fieldDetails;
      } else {
        fieldDetailsArray = [formValue.fieldDetails];
      }
    }

    let panelId = this.getPanelObj.id;
    let id = panelId + "_kanban_" + this.idCount;

    let panelsArrData: any = sessionStorage.getItem('createPanelSeriesArray');
    this.panelSeriesArray = panelsArrData;

    if (this.panelSeriesArray != null) {
      this.panelSeriesArray = JSON.parse(this.panelSeriesArray);

      const matchingObjectIndex = Array.isArray(this.panelSeriesArray)
        ? this.panelSeriesArray.findIndex(obj => obj.id === this.getPanelObj.id)
        : -1;

      this.fieldDetailsArray = this.fieldDetailsArray?.map((obj, index) => {
        return {
          ...obj,
          index: index + 1
        };
      });


      let kanbanObj: any = {
        "tableName": formValue.tableName || '',
        "tableTitle": formValue.header || "",
        "height": "100%",
        "width": "100%",
        "fieldDetails": fieldDetailsArray,
        "keyField": formValue.fieldDetails?.keyField || '',
        "cardSettings": {
          "contentField": formValue.fieldDetails?.contentField || '',
          "headerField": formValue.fieldDetails?.headerField || '',
        },
        "dataSource": [],
        "enableTooltip": formValue.enableTooltip != null ? formValue.enableTooltip : true,
        "rawQuery": formValue.rawQuery || '',
        "orderBy": formValue.orderBy || [],
        "orderByType": formValue.orderByType || '',
        "groupBy": formValue.groupBy || [],
        "conditions": formValue.conditions || '',
        "swimlaneSettings": {
          "keyField": formValue.fieldDetails?.assigneeField || '',
        }
      };

      let kanbanObjApi = {
        "object_id": this.getPanelObj.id,
        "object_setup": {
          "content": {
            ...kanbanObj,
          }
        },
        "object_type": "kanban",
        "connection_id": this.connection_id,
      };

      console.log(kanbanObj);
      console.log(kanbanObjApi);

      if (matchingObjectIndex !== -1) {
        this.panelSeriesArray[matchingObjectIndex] = {
          ...this.getPanelObj,
          content: {
            ...kanbanObj,
          }
        };
      }

      console.log(this.panelSeriesArray);

      let boxObj = this.panelSeriesArray[matchingObjectIndex];
      console.log(boxObj);
      sessionStorage.setItem('createPanelSeriesArray', JSON.stringify(this.panelSeriesArray));

      let kanbanData = this.chartService.objectPivotCreate(kanbanObjApi);
      console.log(kanbanObjApi);

      kanbanData.subscribe(
        (res: any) => {
          console.log("res", res);

          if (res.success === true) {
            let resobj = res['data'];
            let data = resobj.object_setup.content;

            console.log('Data Source from API:', data.dataSource);
            console.log('Field Details:', data.fieldDetails);


            let dataSource = new DataManager({
              json: data.dataSource,
              adaptor: new UrlAdaptor()
            });

            let selecteddatasource = data.dataSource;


            const dataSourceKeys = data.dataSource && data.dataSource.length > 0
              ? Object.keys(data.dataSource[0])
              : [];


            let updateObj = {
              ...this.getPanelObj,
              header: formValue.header,
              content: {
                id: "kanban_" + this.idCount,
                ...data,
                fieldDetails: data.fieldDetails
              }
            };


            console.log('updateObj', updateObj);
            console.log('dataSource', dataSource);

            this.sendBoxObj.emit({
              boxObj: updateObj,
              resObj: {
                resSuccess: res.success,
                resMessage: res.message,
                statusCode: res.status_code
              }
            });

            this.columnTemplateForm.reset();
          } else {
            let boxObj = this.panelSeriesArray[matchingObjectIndex];

            this.sendBoxObj.emit({
              boxObj: boxObj,
              resObj: {
                resSuccess: false,
                resMessage: res.message,
                statusCode: res.status_code
              }
            });
          }
        },
        (err: any) => {
          let boxObj = this.panelSeriesArray[matchingObjectIndex];

          const errorMessage = err.error && err.error.message ? err.error.message : err.message;
          this.sendBoxObj.emit({
            boxObj: boxObj,
            resObj: {
              resSuccess: false,
              resMessage: errorMessage,
              statusCode: err.status
            }
          });
        }
      );
    }

    return true;
  }

  ngOnChanges(changes: SimpleChanges): void {

    console.log('Changes object:', changes);

    let currentValue = changes['getPanelObj'].currentValue;
    if (currentValue != undefined || currentValue != null) {

      if (this.tab) {
        this.tab.selectedItem = 0;
      }

      let panelsArrData: any = sessionStorage.getItem('createPanelSeriesArray');
      this.panelSeriesArray = panelsArrData
      this.getPanelObj = currentValue;

      if (this.panelSeriesArray) {
        this.panelSeriesArray = JSON.parse(this.panelSeriesArray);
        let matchingPanel = this.panelSeriesArray.find((panel: any) => panel.id === currentValue.id);

        if (matchingPanel) {
          console.log('panel changed currentValue', currentValue)

          matchingPanel = {
            ...matchingPanel,
            connection_id: this.getPanelObj.connection_id
          }

          this.getPanelObj = matchingPanel;
          this.connection_id = matchingPanel.connection_id;

          console.log('this.getPanelObj', this.getPanelObj)
          console.log('this.connection_id', this.connection_id)

          if (this.fieldDetailsArray && this.fieldDetailsArray.length > 0) {
            if (this.selectedTableFieldName && this.selectedTableFieldName.length > 0) {
              console.log('selectedTableFieldName from table:', this.selectedTableFieldName);
            }
          }

          this.columnTemplateForm.patchValue({
            header: this.getPanelObj.header || '',
            tableName: this.getPanelObj.content.tableName || '',
            orderBy: this.getPanelObj.content.orderBy || [],
            orderByType: this.getPanelObj.content.orderByType || '',
            groupBy: this.getPanelObj.content.groupBy || [],
            conditions: this.getPanelObj.content.conditions || '',
            rawQuery: this.getPanelObj.content.rawQuery || '',
            enableTooltip: this.getPanelObj.content.enableTooltip != null ? this.getPanelObj.content.enableTooltip : true,
          })

          if (this.getPanelObj.content.fieldDetails) {
            this.columnTemplateForm.get('fieldDetails')?.patchValue({
              tableName: this.getPanelObj.content.tableName || '',
              titleField: this.getPanelObj.content.fieldDetails.titleField || '',
              headerField: this.getPanelObj.content.fieldDetails.headerField || '',
              contentField: this.getPanelObj.content.fieldDetails.contentField || '',
              priorityField: this.getPanelObj.content.fieldDetails.priorityField || '',
              typeField: this.getPanelObj.content.fieldDetails.typeField || '',
              keyField: this.getPanelObj.content.fieldDetails.keyField || '',
              assigneeField: this.getPanelObj.content.fieldDetails.assigneeField || '',
              startDateField: this.getPanelObj.content.fieldDetails.startDateField || '',
              endDateField: this.getPanelObj.content.fieldDetails.endDateField || '',
            });
          }

          this.rawQueryValue = this.getPanelObj.content.rawQuery;
          this.conditionValue = this.getPanelObj.content.conditions;

          if (this.getPanelObj.content.fieldDetails) {
            let fieldDetails = this.getPanelObj.content.fieldDetails;
            if (!Array.isArray(fieldDetails)) {
              fieldDetails = [fieldDetails];
            }

            this.columnTemplateForm.get('fieldDetails')?.patchValue(fieldDetails[0]);
          }



          this.chartService.getTableNamesArrary(this.connection_id).subscribe((res: any) => {
            let data = res['data'];
            this.tableNamesArray = data;

            // Fetch the field names based on the patched tableName value
            if (this.getPanelObj.content.tableName) {
              this.onTableDropdown(this.getPanelObj.content.tableName);
            }
          });

        }

      }
    }
  }

  onTableDropdown(dropdownValue: any) {
    if (!dropdownValue) {
      this.selectedTableFieldName = []
      return;
    }
    console.log(dropdownValue, 'firstDropdownValue');
    const tableNameControl = this.columnTemplateForm.get('tableName');
    const fieldDetailControl = this.columnTemplateForm.get('fieldDetails');
    const fieldDetailTableName = fieldDetailControl!.get('tableName');

    tableNameControl!.setValue(dropdownValue);
    fieldDetailTableName!.setValue(dropdownValue);
    console.log(fieldDetailControl)

    if (dropdownValue != undefined || dropdownValue != "" || dropdownValue != null) {
      this.chartService.getColumnNameBYTableName(dropdownValue, this.connection_id).subscribe((res: any) => {
        console.log(res);
        let data = res['data'];
        if (data) {
          this.selectedTableFieldName = Object.keys(data);

        }
        // this.selectedTableFieldName = Object.keys(data);

      })
      console.log(this.selectedTableFieldName);
    } else {
      this.selectedTableFieldName = []

    }

  }


  filterArrayByKeyNames(array: any[], keyNames: string[]): any[] {
    return array.map((obj) => {
      let newObj: any = {};
      keyNames.forEach((key) => {
        newObj[key] = obj[key];
      });
      return newObj;
    });
  }

  headerTextValueArray: string[] = [];
  fieldHeaderPairs: { field: string; headerText: string }[] = []
  headerTextValue: any;

  conditionValue: any = "";
  rawQueryValue: any = "";
  cursorConditionPosition: number = 0;
  cursorPosition: number = 0;


  addToTextarea(name: string) {
    const operator = ' ' + name + ' ';

    const currentText = this.rawQueryValue;

    if (operator) {
      const beforeCursor = currentText.slice(0, this.cursorPosition);
      const afterCursor = currentText.slice(this.cursorPosition);
      this.rawQueryValue = `${beforeCursor}${operator}${afterCursor}`;

      this.cursorPosition += operator.length;

      const textarea = document.getElementById("pop_chart_expression") as HTMLTextAreaElement;
      if (textarea) {
        textarea.focus();
        textarea.setSelectionRange(this.cursorPosition, this.cursorPosition);
      }
    }
  }
  selectedFieldNameModel: any;
  fields: { text: string; value: string } = { text: 'value', value: 'value' };
  onClearConditions() {
    this.conditionValue = "";
    this.columnTemplateForm.get('conditions')!.setValue("");
  }
  onClearRawQuery() {
    this.rawQueryValue = "";
    this.columnTemplateForm.get('rawQuery')!.setValue("");
  }
  updateCursorPositionCondition(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;
    this.cursorConditionPosition = textarea.selectionStart;
  }
  updateCursorPosition(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;
    this.cursorPosition = textarea.selectionStart;
  }

  addText(event: any) {
    const operator = event.target.value || "";
    const currentText = this.conditionValue;

    if (operator) {
      const operatorWithSpaces = ` ${operator} `;
      const beforeCursor = currentText.slice(0, this.cursorConditionPosition);
      const afterCursor = currentText.slice(this.cursorConditionPosition);
      this.conditionValue = `${beforeCursor}${operatorWithSpaces}${afterCursor}`;
      this.cursorConditionPosition += operatorWithSpaces.length;

      const textarea = document.getElementById("pop_chart_condition") as HTMLTextAreaElement;
      if (textarea) {
        textarea.focus();
        textarea.setSelectionRange(this.cursorConditionPosition, this.cursorConditionPosition);
      }
    }
  }
  addToConditionTextarea(name: string) {
    const currentText = this.conditionValue || '';
    const beforeCursor = currentText.slice(0, this.cursorConditionPosition);
    const afterCursor = currentText.slice(this.cursorConditionPosition);
    this.conditionValue = `${beforeCursor} ${name} ${afterCursor}`;
    this.cursorConditionPosition += name.length + 2;

    const textarea = document.getElementById("pop_chart_condition") as HTMLTextAreaElement;
    if (textarea) {
      textarea.focus();
      textarea.setSelectionRange(this.cursorConditionPosition, this.cursorConditionPosition);
    }
  }
  copyMessage: string = '';
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
  addRawQueryText(event: any) {
    const operator = event.target.value;
    const currentText = this.rawQueryValue;

    if (operator) {
      const operatorWithSpaces = ` ${operator} `;
      const beforeCursor = currentText.slice(0, this.cursorPosition);
      const afterCursor = currentText.slice(this.cursorPosition);
      this.rawQueryValue = `${beforeCursor}${operatorWithSpaces}${afterCursor}`;
      this.cursorPosition += operatorWithSpaces.length;

      const textarea = document.getElementById("pop_chart_expression") as HTMLTextAreaElement;
      if (textarea) {
        textarea.focus();
        textarea.setSelectionRange(this.cursorPosition, this.cursorPosition);
      }
    }
  }




}