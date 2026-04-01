import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TabComponent } from '@syncfusion/ej2-angular-navigations';
import { ChartService } from 'src/app/core/services/chart.service';

@Component({
  selector: 'app-initial-filters',
  templateUrl: './initial-filters.component.html',
  styleUrls: ['./initial-filters.component.scss']
})
export class InitialFiltersComponent implements OnInit {


  filterForm!: FormGroup;
  tableNamesArray : string[] = []
  selectedTableFieldName : string[] = []
  headerText: any = [{ text: "Initial Filters" } ];
  showSecondDropdown = false;
  firstDropdownValue = '';
  connection_id : any;

  @Input() getInitialFIlterObj: any;
  @ViewChild('tabComponent') tab! : TabComponent

  @Output() sendInitialFIlterObj = new EventEmitter()
  boxIdCount: any = 0;
  fieldNameValue : string = ''

  constructor(private fb : FormBuilder, private chartService : ChartService) { }

  ngOnInit(): void {
    
    if (this.tab) {
      this.tab.selectedItem = 0;
    }

    this.filterForm = this.fb.group({
      tableName : ['', [Validators.required]],
      fieldName :['', [Validators.required]],
      labelName :[''],
     // type : [""],
      filterType: ['', [Validators.required]],
      currentOrPrevious: ['', [Validators.required]],
      previousNumber: [1],
      startDate : "",
      endDate : ""
    })

    this.filterForm.get('filterType')?.valueChanges.subscribe(value => {
      this.onFirstDropdownChange(value);
    });

    this.filterForm.get('currentOrPrevious')?.valueChanges.subscribe(value => {
      if (value === 'current') {
        this.filterForm.patchValue({ previousNumber: 0 });
      }
    });
  }

  ngOnChanges(changes: SimpleChanges){
    let currentValue = changes['getInitialFIlterObj'].currentValue;

   // console.log('currentValue', currentValue)

    if(currentValue != null || currentValue != undefined){
      this.connection_id = currentValue.connection_id

      this.filterForm.patchValue({
        tableName : currentValue.tableName || '',
        fieldName : currentValue.fieldName || '',
        labelName : currentValue.labelName || '',
        // type : [""],
        filterType: currentValue.filterType || '',
        currentOrPrevious: currentValue.currentOrPrevious || '',
        previousNumber: currentValue.previousNumber || 1,
        startDate : currentValue.startDate || '',
        endDate : currentValue.endDate || ''
      })

      if(this.connection_id != undefined || this.connection_id != null){
        this.chartService.getTableNamesArrary(this.connection_id).subscribe((res: any) => {
          let data = res['data'];
          //  console.log(data)
          this.tableNamesArray = data;
          console.log(data)
          this.fieldNameValue = currentValue.fieldName;

          if (currentValue.tableName) {
          
           this.onTableDropdown(currentValue.tableName)
        
          }
        })
      }

    }


  }

  // onTableDropdown(dropdownValue: any) {
 
  //   if (!dropdownValue) {
  //     return;
  //   }

  //   const tableNameControl = this.filterForm.get('tableName');
  //   tableNameControl!.setValue(dropdownValue);

  //   if (dropdownValue != undefined || dropdownValue != "" || dropdownValue != null) {
  //     this.chartService.getColumnNameBYTableName(dropdownValue, this.connection_id).subscribe((res: any) => {
  //       console.log(res);
  //       if (res && res.data) { // Check if response and data are defined
  //         const data = res['data'];
  //         this.selectedTableFieldName = Object.keys(data);
  //       }

  //     })
  //   }else{
  //     this.selectedTableFieldName =  []

  //   }
  // }

  onTableDropdown(dropdownValue: any) {
    if (!dropdownValue) {
      this.selectedTableFieldName = []
      return;
    }
  
    const tableNameControl = this.filterForm.get('tableName');
    console.log(dropdownValue)
    tableNameControl!.setValue(dropdownValue);
  
    if (dropdownValue !== undefined && dropdownValue !== "" && dropdownValue !== null) {
      this.chartService.getColumnNameBYTableName(dropdownValue, this.connection_id).subscribe((res: any) => {
        console.log(res);
        if (res && res.data) {
          const data = res['data'];
          this.selectedTableFieldName = Object.keys(data);
  
          // Once the array is populated, patch the fieldName value
          if (this.fieldNameValue) {
            this.filterForm.patchValue({ fieldName: this.fieldNameValue || '' });
          }
        }
      });
    } else {
      this.selectedTableFieldName = [];
    }
  }
  
  onFirstDropdownChange(value: string): void {
    this.firstDropdownValue = value;
    if (value === '') {
      this.filterForm.get('currentOrPrevious')?.reset();
    } else {
      this.filterForm.get('currentOrPrevious')?.setValue('current');
    }
  }
  onInitialFilterSubmit(){
    let formValue = this.filterForm.value;

    if(this.filterForm.invalid){
      this.filterForm.markAllAsTouched();  // This will show validation messages for all invalid fields
      return false;
    }

    if(this.filterForm.valid){
      this.sendInitialFIlterObj.emit(formValue)
      console.log(formValue)
     
    }
    return true
  
  }

  deleteInitialFilter(){
    this.onTableDropdown('')
    this.selectedTableFieldName = [];
    this.tableNamesArray = [];
    let resetObj = {}
    this.filterForm.reset({
      tableName: '',
      fieldName: '',
      labelName: '',
      filterType: '',
      currentOrPrevious: '',
      previousNumber: 1, // reset to default value of 1
      startDate: '',
      endDate: ''
    });
    // this.sendInitialFIlterObj.emit(this.filterForm.value)
    this.sendInitialFIlterObj.emit(resetObj)

    console.log(resetObj)

  }

  


}
