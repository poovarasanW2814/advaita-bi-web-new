import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ButtonComponent } from '@syncfusion/ej2-angular-buttons';
import { DialogComponent, AnimationSettingsModel } from '@syncfusion/ej2-angular-popups';
import { ChartService } from 'src/app/core/services/chart.service';

@Component({
  selector: 'app-role-mapping',
  templateUrl: './role-mapping.component.html',
  styleUrls: ['./role-mapping.component.scss']
})


export class RoleMappingComponent implements OnInit ,OnChanges{

  userMappingForm! : FormGroup;
  userMappingArr : any[] = [];
  @Input() getConnectionObj : any;
  @Input() getMappingObj : any;
  roleFields : any =  { text: 'role', value: 'role' };

  
  @Output() sendMappingObj = new EventEmitter()
  saveflag : boolean = true;
  updateFlag : boolean = false;
  connection_id : any;

  constructor(private fb : FormBuilder, private chartService : ChartService) { }

  ngOnChanges(changes: SimpleChanges): void {


    if(changes['getConnectionObj'] != undefined){
    let currentValue = changes['getConnectionObj'].currentValue;

      if(currentValue != null || currentValue != undefined){
        this.connection_id = currentValue.connection_Id;
        this.chartService.getTableNamesArrary(this.connection_id).subscribe((res : any) =>{
          let data = res['data'];
          this.tableNamesArray = data

          if (this.getMappingObj?.tableName) {
            this.onTableDropdown(this.getMappingObj.tableName);
          }
        })
  
        
        this.chartService.getAllRolesDetails().subscribe((res : any) =>{
          let data = res['data'];
          console.log('res in all roles', res)
          // this.RolesArray = data;
        })

        this.chartService.getAllActiveRoleDetails().subscribe((res : any ) =>{
          let data = res['data'];
          this.RolesArray = data;

          console.log('res in active', res)
        })

      }
    }

    if(changes['getMappingObj'] != undefined){
      let currentValue = changes['getMappingObj'].currentValue;

      this.userMappingArr = []; // Initialize as an empty array

      if (currentValue != null) {
        this.getMappingObj = currentValue;
        // mapping
      
        console.log(this.getMappingObj);
      
        let newArray: any[] = [];

        if (this.getMappingObj && this.getMappingObj.mapping) {
          newArray = this.getMappingObj.mapping.map((ele: any) => {
            const entries = Object.entries(ele); // Get an array of [key, value] pairs from ele
        
            const newElements = entries.map(([roleName, fieldName]) => ({
              tableName: this.getMappingObj.tableName,
              roleName: roleName,
              fieldName: fieldName
            }));
        
            return newElements;
          }).flat();
        }
        
        this.userMappingArr = newArray.length > 0 ? newArray : [];
        
      
        console.log(newArray);
      } else {
        this.userMappingArr = [];
      }
      


    }
    //console.log(changes)

  }

  tableNamesArray : any = [];
  fieldNamesArray : any = [];
  RolesArray : any = [];
  

  ngOnInit(): void {
    this.userMappingForm = this.fb.group({
      tableName : [''],
      fieldName : [''],
      roleName : ['']
   
    })

 //    console.log(this.getMappingObj)

  }

  @ViewChild('defaultDialog')
  public defaultDialog!: DialogComponent;

  @ViewChild('dialogBtn')
  public dialogBtn!: ButtonComponent;

  public dialogHeader: string = 'Dashboard Role Mapping';
  public dialogCloseIcon: Boolean = true;
  public dialogWidth: string = '700px';
  public contentData: string = 'This is a dialog with draggable support.';
  public dialogdragging: Boolean = true;
  public animationSettings: AnimationSettingsModel = { effect: 'None' };
  public isModal: Boolean = true;
  public target: string = '.control-section';
  public showCloseIcon: Boolean = false;
  public visible: Boolean = true;

  public dialogBtnClick = (): void => {
      this.defaultDialog.show();
      this.dialogOpen();
  }

  public dialogClose = (): void => {
      // this.dialogBtn.element.style.display = 'block';
  }

  public dialogOpen = (): void => {
      // this.dialogBtn.element.style.display = 'none';
  }
  onMappingFormSubmit(){
    let value = this.userMappingForm.value;
   
     console.log(value);
     //Old code
    this.userMappingArr.push(value);
    this.userMappingArr = [ ...this.userMappingArr]
    console.log(this.userMappingArr);

    //New code 
    //  const { tableName, fieldName, roleName } = value;
    //  if (Array.isArray(fieldName) && fieldName.length > 0) {
    //   fieldName.forEach(selectedField => {
    //     let mapping = {
    //       tableName: tableName,
    //       fieldName: selectedField,
    //       roleName: roleName
    //     };
    //     this.userMappingArr.push(mapping);
    //   });
    //   this.userMappingArr = [...this.userMappingArr];
    //   console.log(this.userMappingArr);
    // } else {
    //   console.warn("No field name selected. Please select at least one field.");
    // }


    //  this.userMappingForm.reset()

  }

  
  
  id : any;
  editRecord(data: any) {
    console.log(data);
    this.saveflag = false;
    this.updateFlag = true;
    this.id = +(data.index);
    let fieldNames = Array.isArray(data.fieldName) ? data.fieldName : [data.fieldName];
    // Patch tableName first and trigger onTableDropdown
    let obj = {
      tableName: data.tableName || '',
      roleName: data.roleName || '',
      fieldName: data.fieldName || ''  // Ensure fieldName is an array
    };
  
    console.log(obj)
    // Patch the form values to show in the dropdowns
    this.userMappingForm.patchValue(obj);

  }
  
  editRecordNew(data: any) {
    console.log(data);
    this.saveflag = false;
    this.updateFlag = true;
    this.id = +(data.index);
    console.log('this.id in edit', this.id)
    let fieldNames = Array.isArray(data.fieldName) ? data.fieldName : [data.fieldName];
    // Patch tableName first and trigger onTableDropdown
    let obj = {
      tableName: data.tableName || '',
      roleName: data.roleName || '',
      fieldName: data.fieldName || ''  // Ensure fieldName is an array
    };
  
    console.log(obj)
    // Patch the form values to show in the dropdowns
    this.userMappingForm.patchValue(obj);


  }
  updateForm() {
    let formValue = this.userMappingForm.value;
    console.log(formValue);
  //  this.userMappingForm.reset()
 //   this.onTableDropdown(formValue.tableName);
    let updatedObj = {
      tableName: formValue.tableName || '',
      fieldName: formValue.fieldName || '',
      roleName: formValue.roleName || '',
    };
  
    console.log('this.id', this.id)
    // Update the object at the specified index
    this.userMappingArr[this.id] = updatedObj;
   this.userMappingArr = [...this.userMappingArr]
  
    console.log(this.userMappingArr);
  
    this.saveflag = true;
    this.updateFlag = false;
  }

  ///////////////////// the code will work for updating one field only/////////////////////////
  // updateForm() {
  //   let formValue = this.userMappingForm.value;
  //   console.log(formValue);
  
  //   // Ensure fieldName is an array
  //   let fieldNames = Array.isArray(formValue.fieldName) ? formValue.fieldName : [formValue.fieldName];
  
  //   // Create an updated object from the form values
  //   let updatedObj = {
  //     tableName: formValue.tableName,
  //     fieldName: fieldNames,  // This will reflect the updated fieldName(s) selected in the dropdown
  //     roleName: formValue.roleName
  //   };

  //   const { tableName, fieldName, roleName } = formValue;
  //   if (Array.isArray(fieldName) && fieldName.length > 0) {
  //    fieldName.forEach(selectedField => {
  //      let updatedObj = {
  //        tableName: tableName,
  //        fieldName: selectedField,
  //        roleName: roleName
  //      };
  //     //  this.userMappingArr.push(updatedObj);
  //     this.userMappingArr[this.id] = updatedObj;
  //    });
  
  //   }
    
  //   // Update the specific record at the given index (`this.id`)
  
  
  //   // Use the spread operator to ensure immutability
  //   this.userMappingArr = [...this.userMappingArr];
  
  //   console.log(this.userMappingArr);
  
  //   // Reset flags for save/update button visibility
  //   this.saveflag = true;
  //   this.updateFlag = false;
  
  //   // Optionally reset the form
  //   this.userMappingForm.reset();
  // }
  
  
  
  deleteRecord(data : any){
    let id = +(data.index)
    let obj = {
      tableName : data.tableName || '',
      fieldName : data.fieldName || '',
      roleName : data.roleName || ''
    }
    this.userMappingArr.splice(data.index, 1)
    this.userMappingArr = [...this.userMappingArr];

    console.log( this.userMappingArr)

  }
  onTableDropdown(dropdownValue: any) {
    // const dropdownValue = eve.target.value;
  //  console.log('dropdownValue', dropdownValue)
    if (!dropdownValue) {
      return;
    }

    if (dropdownValue != undefined || dropdownValue != "" || dropdownValue != null) {
      this.chartService.getColumnNameBYTableName(dropdownValue, this.connection_id).subscribe((res: any) => {
        console.log(res);
        if (res) {
          let data = res['data']
          // for(let )
          this.fieldNamesArray = Object.keys(data);
          
        }

      })
      
    }

  }
  onSubmit(){
    console.log(this.userMappingArr, this.userMappingForm.value);
    let formValue = this.userMappingForm.value;
    console.log(formValue);
    console.log(this.userMappingArr);
    let tableName = this.userMappingArr.length > 0 ? this.userMappingArr[0].tableName : formValue.tableName;
    if(this.userMappingArr.length > 0){
      let mappingArr = this.userMappingArr.reduce((acc, obj) => {
        acc.mappingArr.push({
          [obj.roleName]: obj.fieldName
        });
        return acc;
      }, {mappingArr: []});
      
      console.log(mappingArr);
      let roleMapping = {
        tableName : tableName,
        mapping  : mappingArr.mappingArr
      }
      console.log(roleMapping);
      this.sendMappingObj.emit(roleMapping)
    }else{
      let roleMapping = {}
      console.log(roleMapping);
      this.sendMappingObj.emit(roleMapping);
    }


  }
}