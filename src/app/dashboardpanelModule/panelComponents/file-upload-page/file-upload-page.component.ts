import { Component, OnInit, ViewChild, inject} from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonComponent, SwitchModule } from '@syncfusion/ej2-angular-buttons';
import { AnimationModel } from '@syncfusion/ej2-angular-charts';
import { GridComponent, GridModule } from '@syncfusion/ej2-angular-grids';
import { DialogComponent, AnimationSettingsModel, DialogModule } from '@syncfusion/ej2-angular-popups';
import { ChartService } from 'src/app/core/services/chart.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { MenuBasedAccessService } from 'src/app/core/services/menu-based-access.service';
import { PopupService } from 'src/app/core/services/popup.service';
import * as XLSX from 'xlsx';
import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns'; 
@Component({
    selector: 'app-file-upload-page',
    templateUrl: './file-upload-page.component.html',
    styleUrls: ['./file-upload-page.component.scss'],
    imports: [FormsModule, ReactiveFormsModule, DropDownListModule, SwitchModule, DialogModule, GridModule]
})

export class FileUploadPageComponent implements OnInit {


  myForm!: FormGroup;
  public dropEle?: HTMLElement ;
  connectionId : any;
  
  connectionDetailsArray : any = []
  tableNamesArray : any = [];
  internalTableNameArray : any = []
  resMessage : string = '';
  popupType: 'success' | 'error' = 'success';
  private readonly formBuilder = inject(FormBuilder);
  private readonly chartService = inject(ChartService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly menuBasedAccessService = inject(MenuBasedAccessService);
  private readonly loaderService = inject(LoaderService);
  private readonly popupService = inject(PopupService);



  uploadedFileName : any;
  base64StringValue : any;
  loaderFlag : boolean =  false 
  animation: AnimationModel = { enable: true, duration: 2000, delay: 0 };

  menuBasedAccess : any = {};
  permissionObj : any = {};
  roleBasedAccessObj : any = {}
  menuBasedPermissionControlArray : any = []
  message! : string;
  success: boolean = false;
  displayPopup: boolean = false;

  ngOnInit() {
    this.myForm = this.formBuilder.group({
      selectedOption: ['new'],
      target_db : [''],
      newTableData: this.formBuilder.group({
        tableName : ['', [Validators.required]],
        connectionName : ['', Validators.required],
        file : ['', Validators.required]
      }),  // Add controls for home data here
      existingTableData: this.formBuilder.group({
        tableName : ['', Validators.required],
        file : ['', Validators.required],
        is_append : [false],
        connectionName : ['', Validators.required],

      })   // Add controls for about data here
    });


        ///Add this valueChanges listener
    this.myForm.get('selectedOption')?.valueChanges.subscribe((value:string)=>{
      if (value === 'existing' && this.myForm.get('target_db')?.value === 'internal') {
        this.fetchInternalTableNames();
      }
    });
////

    this.myForm.get('target_db')?.valueChanges.subscribe((value: string) => {
      if (value === 'internal' && this.myForm.get('selectedOption')?.value === 'existing') {
        this.fetchInternalTableNames();
      }
    });

    this.chartService.getAllDbConncetionDetails().subscribe((res : any) =>{
      let resData = res['data'];

      this.connectionDetailsArray = resData;
      this.connectionDetailsArray.unshift({
        connection_id: 0,
        connection_name: 'Internal'
      });
    })
 
    const localStorageData = this.menuBasedAccessService.updateMenuAccessFromLocalStorage();

    if(localStorageData){
      this.menuBasedAccess = localStorageData ;
      this.menuBasedPermissionControlArray = this.menuBasedAccess?.permission_details
      const formNameToFind = 'fileUploadToDb';
      const permissionDetailsForHome = this.menuBasedPermissionControlArray?.find(
        (permission : any) => permission.form_name === formNameToFind
      );
 
      if (permissionDetailsForHome) {
       this.permissionObj = permissionDetailsForHome
      }
 
    }else{
      this.menuBasedAccessService.menuAccess$.subscribe((menuAccess) => {
        this.menuBasedAccess = menuAccess;
      this.menuBasedPermissionControlArray = this.menuBasedAccess?.permission_details


      });
  
    }
    this.dropEle = document.getElementById('droparea') as HTMLElement;
  }
  ///fetchInternalTablenames
      fetchInternalTableNames() {
    const internalConn = this.connectionDetailsArray.find((c: any) => c.connection_name?.toLowerCase() === 'internal');
    this.connectionId = internalConn?.connection_id || 0;
    this.chartService.getTableNamesArrary(this.connectionId).subscribe((res : any) =>{
      console.log('Full Internal DB response:',res);
      let data = res['data'];
      console.log('Internal DB Tables:', data)
      if (data && data.length > 0) {
        this.tableNamesArray = data;
      } else {
        console.warn('No tables found for internal DB-data is null or empty');
        this.tableNamesArray = [];
      }
    }, (error:any) => {
      console.error('Error fetching internal DB tables:', error);
      this.tableNamesArray = [];
    })
  }

  resetFileFields() {
    this.myForm.get('newTableData.file')?.setValue('');
    this.myForm.get('existingTableData.file')?.setValue('');
  }
  setActionValue(value: string): void {
    this.myForm.get('existingTableData');
  }
  public connectionFields: Object = { text: 'connection_name', value: 'connection_id' };

  onConnectionNameSelect(event : any){


    let itemData = event.itemData;
    let connectionName_Id = itemData.connection_id;
    console.log('connectionName_Id', connectionName_Id, typeof (connectionName_Id))

      this.connectionId = +(connectionName_Id);
      console.log('this.connectionId', this.connectionId)
      this.chartService.getTableNamesArrary(this.connectionId).subscribe((res : any) =>{
        let data = res['data'];
       console.log(data)
        this.tableNamesArray = data;
      })


  }
  refreshPage() {
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }
  handleUpload(event : any) {
    console.log(event)
    const file = event.target.files[0];


    if (file) {
      this.uploadedFileName = file.name
      const reader = new FileReader();
  
      reader.onload = () => {
        const base64String = reader.result?.toString().split(',')[1];
        console.log(reader.result?.toString());
        this.base64StringValue = base64String
      };
  
      reader.readAsDataURL(file);
    }

}
jsonData : any = [];
onFileChange(event: any) {
  let file = event.target.files[0];
  if (file) {
    if (file.name.endsWith('.xlsx')) {
      this.readExcel(file);
    } else if (file.name.endsWith('.csv')) {
      this.readCSV(file);
    }
    this.convertToBase64(file);
  }
}

@ViewChild('grid')  grid! : GridComponent
onDataBound(grid : GridComponent){
  grid.autoFitColumns([])
}
gridDatasource : any = [];

readExcel(file: any) {
  let fileReader = new FileReader();
  this.defaultDialog.show();
  fileReader.onload = (e) => {
    if (e.target) {
      let data = new Uint8Array((e.target as FileReader).result as ArrayBuffer);
      let workbook = XLSX.read(data, { type: 'array' });
      let sheetName = workbook.SheetNames[0];
      let sheet = workbook.Sheets[sheetName];
      this.jsonData = XLSX.utils.sheet_to_json(sheet, { raw: true });
      console.log('excel data', this.jsonData);
      this.grid.refreshColumns()

      // Take the first 10 records
      const first10Records = this.jsonData.slice(0, 5);
      console.log('excel data', first10Records);
      this.grid.columns = [];
      this.gridDatasource = first10Records; // Assign updated data source directly
      console.log('excel data',  this.gridDatasource);
    }
  };
  fileReader.readAsArrayBuffer(file);
}


readCSV(file: any) {
  let fileReader = new FileReader();
  fileReader.onload = (e) => {
    if (e.target) {
      let results: any[] = [];
      let lines = (e.target as FileReader).result?.toString().split('\n');
      
      if (lines) {
        // Extract headers
        let headers = lines[0].split(',');
        
        // Skip the first line if it contains headers
        let startIndex = headers.length > 1 ? 1 : 0;
        
        // Loop through lines, start from startIndex
        lines.slice(startIndex).forEach((line, index) => {
          if (index < 5) { // Only take the first 10 records
            let values = line.split(',');
            let obj: any = {};
            // Create object with key-value pairs
            headers.forEach((header, i) => {
              obj[header.trim()] = values[i].trim();
            });
            results.push(obj);
          }
        });
        this.jsonData = []
        this.jsonData = results;
        console.log('csv data', this.jsonData);
        this.grid.columns = [];

        this.gridDatasource =  this.jsonData;
        this.defaultDialog.show();
      } else {
        console.log('No data found in the CSV file.');
      }
    }
  };
  fileReader.readAsText(file);
}


convertToBase64(file: any) {
  let fileReader = new FileReader();
  fileReader.onload = (e) => {
    if (e.target) {
      const base64String = (e.target as FileReader).result?.toString().split(',')[1];
      this.base64StringValue = base64String;
    }
  };
  fileReader.readAsDataURL(file);
}
public onUploadFailure(args: any): void  {
    console.log('File failed to upload');
    }
  public path: Object = {
    saveUrl: 'uploadbox/Save',
    removeUrl: 'uploadbox/Remove' };
    public onUploadSuccess(args: any): void  {
      console.log(args)
      if (args.operation === 'upload') {
          console.log('File uploaded successfully');
      }
  }
  showSuccessMessage: boolean = false;
  showErrorMessage: boolean = false;

  switchTargetDB(targetDB: string) {
    this.myForm.get('target_db')?.setValue(targetDB);
    this.resetFileFields();
  }

  resetExternalDBControls() {
    // Reset form controls associated with the external database section
   // this.myForm.get('target_db')?.reset(); // Reset selectedOption radio button
    this.myForm.get('selectedOption')?.reset(); // Reset selectedOption radio button
    this.myForm.get('newTableData')?.reset(); // Reset new table data form group
    this.myForm.get('existingTableData')?.reset(); // Reset existing table data form group
  }
  onPreviews() {
    const formData = this.myForm.value;
    console.log(formData)
    if (formData.selectedOption === 'new') {
      const file = formData.newTableData.file;
      if (file) {
        console.log(file)
        this.uploadedFileName = file.name;
        if (file.endsWith('.xlsx')) {
          this.readExcel(file);
        } else if (file.endsWith('.csv')) {
          this.readCSV(file);
        }
        this.convertToBase64(file);
      } else {
        console.log('No file selected.');
      }
    } else {
      const file = formData.existingTableData.file;
      if (file) {
        console.log(file)
        this.uploadedFileName = file.name;
        if (file.name.endsWith('.xlsx')) {
          this.readExcel(file);
        } else if (file.name.endsWith('.csv')) {
          this.readCSV(file);
        }
        this.convertToBase64(file);// Example function call
      } else {
        console.log('No file selected.');
      }
    }
  }
  onPreview() {
    let fileInputs = document.querySelectorAll('.fileInput') as NodeListOf<HTMLInputElement>;
    
    fileInputs.forEach(fileInput => {
      console.log(fileInput);
      if (fileInput.files && fileInput.files.length > 0) {
        let file = fileInput.files[0];
        if (file) {
          this.uploadedFileName = file.name;
          if (file.name.endsWith('.xlsx')) {
            this.readExcel(file);
          } else if (file.name.endsWith('.csv')) {
            this.readCSV(file);
          }
          this.convertToBase64(file);
        }
      } else {
        console.log('No file selected.');
      }
    });
  }
  

  onCancel(){
    this.defaultDialog.hide()
    this.gridDatasource = [];
  }
  // onSubmit() {
  //   const formData = this.myForm.value;
  //  // this.loaderFlag = true
  //   console.log(formData)
  //   let tableName;
  //   if(formData.selectedOption == 'new'){
  //     tableName = formData.newTableData.tableName
  //   }else {
  //     tableName = formData.existingTableData.tableName
  //   }

  //   this.loaderService.show();

  //   console.log(formData);  // Access selected option and other data here;

  //   let apiObj = {
  //     "target_db": formData.target_db,
  //     "upload_type": formData.selectedOption,
  //     "file_name": this.uploadedFileName,
  //     "table_name":tableName,
  //     "is_append": formData.existingTableData.is_append,
  //     "file_base" : this.base64StringValue,
  //     "connection_id" : formData.target_db == 'internal' ? 0 : this.connectionId
  //   }

  //   this.defaultDialog.hide()
  //   this.myForm.reset()
  //   this.chartService.uploadFileApi(apiObj).subscribe(
  //     (res : any) =>{
  //     console.log(res);
  //     this.loaderService.hide();

  //     console.log(res.message.length)
  //  //   this.showPopup(res.success, '35px', res.message);
  //     this.gridDatasource = []
  //     this.popupService.showPopup({
  //       message: res.message,
  //       statusCode: res.status_code,
  //       status : res.success
  //     });

  //   },
  //   (err : any) =>{
  //     this.loaderService.hide();
  //     // this.showPopup(false, '35px', "Something Went wrong, Please reload the page");
  //     // this.showPopup(res.success, '35px', res.message);
  //     this.popupService.showPopup({
  //       message: err.message,
  //       statusCode: err.status,
  //       status :false
  //     });
  //     this.gridDatasource = []
  //   }
  //   )
    

  // }
  onSubmit() {
    const formData = this.myForm.value;
   // this.loaderFlag = true
    console.log(formData)
    let tableName;
    if(formData.selectedOption == 'new'){
      tableName = formData.newTableData.tableName
    }else {
      tableName = formData.existingTableData.tableName
    }

    this.loaderService.show();

    console.log(formData);  // Access selected option and other data here;

   if (formData.selectedOption==='existing' && formData.existingTableData)
    {
     const appendFlag =formData.existingTableData.is_append===true;

   formData.existingTableData.is_append = !appendFlag;
   formData.existingTableData.is_replace = appendFlag;
   console.log('switch value (is_append):',appendFlag);
   console.log('after: is_append=',formData.existingTableData.is_append,',is_replace=',formData.existingTableData.is_append);
    }
    let connectionId=formData.target_db == 'internal' ? (this.connectionDetailsArray.find((conn:any) => conn.connection_name?.toLowerCase() === 'internal')?.connection_id || 0): this.connectionId;

    let apiObj = {
      "target_db": formData.target_db,
      "upload_type": formData.selectedOption,
      "file_name": this.uploadedFileName,
      "table_name":tableName,
      "is_append": formData.existingTableData?.is_append || false,
      "is_replace": formData.existingTableData?.is_replace || false,
      "file_base" : this.base64StringValue,
      // "connection_id" : formData.target_db == 'internal' ? 0 : this.connectionId
      "connection_id" : connectionId
    }


    this.defaultDialog.hide()
    this.myForm.reset()
    this.chartService.uploadFileApi(apiObj).subscribe(
      (res : any) =>{
      console.log(res);
      this.loaderService.hide();

      console.log(res.message.length)
   //   this.showPopup(res.success, '35px', res.message);
      this.gridDatasource = []
      this.popupService.showPopup({
        message: res.message,
        statusCode: res.status_code,
        status : res.success
      });

    },
    (err : any) =>{
      this.loaderService.hide();
      // this.showPopup(false, '35px', "Something Went wrong, Please reload the page");
      // this.showPopup(res.success, '35px', res.message);
      const errorMessage = err.error && err.error.message ? err.error.message : err.message;
      this.popupService.showPopup({
        message: errorMessage,
        statusCode: err.status,
        status :false
      });
      this.gridDatasource = []
    }
    )


  }

  showSuccessPopup() {
    this.popupType = 'success';
  }

  showErrorPopup() {
    this.popupType = 'error';
  }

 

  closePopup(): void {
    const popup = document.getElementById('popup');
    const backdrop = document.getElementById('backdrop');

    if (popup && backdrop) {
      
      popup.style.display = 'none';
      backdrop.style.display = 'none';
      this.refreshPage()
    }
  }

  showPopup(status: any, fontSize: string = '40px', resMessage: string): void {
    const popup = document.getElementById('popup');
    const backdrop = document.getElementById('backdrop');
    const popupMessage = document.getElementById('popup-message');
  
    if (popup && backdrop && popupMessage) {
        const iconClass = status === true ? 'fa-check-circle' : 'fa-times-circle';
        const iconColor = status === true ? 'green' : 'red';

        // Truncate the resMessage if it exceeds a certain length
        const maxMessageLength = 230; // Maximum length of the message
        const truncatedMessage = resMessage.length > maxMessageLength ?
            resMessage.substring(0, maxMessageLength) + '...' : resMessage;
  
        // Use innerHTML for the icon
        popupMessage.innerHTML = `<span style="color: ${iconColor};"><i class="fas ${iconClass}" style="font-size: ${fontSize};"></i></span>`;
  
        // Create a separate element for status (h5) and truncated message (h6)
        const statusElement = document.createElement('h5');
        statusElement.textContent = status === true ? 'Success' : 'Error';
        popupMessage.appendChild(statusElement);
  
        const messageElement = document.createElement('div');
        messageElement.innerHTML = `<h6>${truncatedMessage}</h6>`;
        popupMessage.appendChild(messageElement);
  
        // Calculate the top position based on the current scroll position
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        const popupHeight = popup.offsetHeight;
  
        const topPosition = Math.max(0, scrollTop + windowHeight / 2 - popupHeight / 2);
  
        // Apply the calculated position to the popup
        popup.style.top = topPosition + 'px';
        popup.style.display = 'block';
  
        backdrop.style.display = 'block';
    }
}



  ////////////////////////////////////

  @ViewChild('defaultDialog')
  public defaultDialog!: DialogComponent;


  public dialogHeader: string = '';
  public dialogCloseIcon: Boolean = true;
  public dialogWidth: string = '900px';
  public contentData: string = 'This is a dialog with draggable support.';
  public dialogdragging: Boolean = true;
  public animationSettings: AnimationSettingsModel = { effect: 'Zoom' };
  public isModal: Boolean = true;
  public target: string = '.control-section';
  public showCloseIcon: Boolean = false;
  public visible: Boolean = false;

  public dialogBtnClick = (): void => {
      this.defaultDialog.show();
      this.dialogOpen();
  }

  public dialogClose = (): void => {
  }

  public dialogOpen = (): void => {
  }

}
