import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, inject} from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartService } from 'src/app/core/services/chart.service';
import { ColorPickerModule } from '@syncfusion/ej2-angular-inputs';
import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';

@Component({
    selector: 'app-card-template',
    templateUrl: './card-template.component.html',
    styleUrls: ['./card-template.component.scss'],
    imports: [FormsModule, ReactiveFormsModule, ColorPickerModule, DropDownListModule]
})
export class CardTemplateComponent implements OnInit , OnChanges{


  boxTemplateForm! : FormGroup;
  @Input() getPanelObj : any;
  @Output() sendBoxObj = new EventEmitter();

  panelSeriesArray : any = [];
  connection_id : any;
  iconFields: any = { text: 'PanelType', iconCss: 'Class', value: 'Class' };
  panelTypeDataArray: any[] = [
    { Class: 'select', PanelType: 'Select', Id: '1' },

    { Class: 'bi bi-reception-4', PanelType: 'Signal', Id: '2' },
    { Class: 'bi bi-currency-dollar', PanelType: 'Dollar', Id: '3' },
    { Class: 'bi bi-currency-rupee', PanelType: 'Rupee', Id: '4' },
    { Class: 'bi bi-chat-dots', PanelType: 'Comments', Id: '5' },
    { Class: 'bi bi-person', PanelType: 'User', Id: '6' },
    { Class: 'bi bi-percent', PanelType: 'Percentage', Id: '7' },
    { Class: 'bi bi-plus-lg', PanelType: 'Plus', Id: '8' },
    { Class: 'bi bi-telephone', PanelType: 'Phone', Id: '9' },
    { Class: 'bi bi-voicemail', PanelType: 'VoiceMail', Id: '10' },
    { Class: 'bi bi-check-circle', PanelType: 'Success', Id: '11' },
    { Class: 'bi bi-exclamation-triangle', PanelType: 'Warning', Id: '12' },
    { Class: 'bi bi-heart', PanelType: 'Favorites', Id: '13' },
    { Class: 'bi bi-clock', PanelType: 'Time', Id: '14' },
    { Class: 'bi bi-speedometer2', PanelType: 'Performance', Id: '15' },
    { Class: 'bi bi-cart', PanelType: 'Sales', Id: '16' },
    { Class: 'bi bi-eye', PanelType: 'Views', Id: '17' },
    { Class: 'bi bi-calendar', PanelType: 'Calendar', Id: '18' },
    { Class: 'bi bi-gear-wide-connected', PanelType: 'Settings', Id: '19' },
    { Class: 'bi bi-bullseye', PanelType: 'Target', Id: '20' },
    { Class: 'bi bi-lightbulb', PanelType: 'Ideas', Id: '21' },
    { Class: 'bi bi-wallet2', PanelType: 'Budget', Id: '22' },
    { Class: 'bi bi-graph-up', PanelType: 'Trend', Id: '23' },
    { Class: 'bi bi-people', PanelType: 'Team', Id: '24' },
    { Class: 'bi bi-envelope', PanelType: 'Email', Id: '25' },
    { Class: 'bi bi-database', PanelType: 'Database', Id: '26' },
    { Class: 'bi bi-arrow-repeat', PanelType: 'Sync', Id: '27' },
    { Class: 'bi bi-trash', PanelType: 'Delete', Id: '28' },
    { Class: 'bi bi-pencil-square', PanelType: 'Edit', Id: '29' },
    { Class: 'bi bi-download', PanelType: 'Download', Id: '30' },
    { Class: 'bi bi-cloud-upload', PanelType: 'Upload', Id: '31' },
    { Class: 'bi bi-funnel', PanelType: 'Filter', Id: '32' },
    { Class: 'bi bi-search', PanelType: 'Search', Id: '33' },
    { Class: 'bi bi-info-circle', PanelType: 'Info', Id: '34' },
    { Class: 'bi bi-question-circle', PanelType: 'Help', Id: '35' },
    { Class: 'bi bi-star', PanelType: 'Star', Id: '36' },
    { Class: 'bi bi-bell', PanelType: 'Notifications', Id: '37' },
    { Class: 'bi bi-geo-alt', PanelType: 'Location', Id: '38' },
    { Class: 'bi bi-link-45deg', PanelType: 'Link', Id: '39' },


    { Class: 'bi bi-bar-chart-line', PanelType: 'Chart', Id: '40' },


    { Class: 'bi bi-arrow-up', PanelType: 'Growth', Id: '41' },
    { Class: 'bi bi-arrow-down', PanelType: 'Decline', Id: '42' },
    { Class: 'bi bi-check-lg', PanelType: 'Success', Id: '43' },
    { Class: 'bi bi-exclamation', PanelType: 'Warning', Id: '44' },
    { Class: 'bi bi-x-lg', PanelType: 'Error', Id: '45' },
    { Class: 'bi bi-currency-dollar', PanelType: 'Revenue', Id: '46' },
    { Class: 'bi bi-graph-up', PanelType: 'Line Graph', Id: '47' },
    { Class: 'bi bi-activity', PanelType: 'Health', Id: '48' },
    { Class: 'bi bi-battery-full', PanelType: 'Energy', Id: '49' },
    { Class: 'bi bi-hand-thumbs-up', PanelType: 'Approval', Id: '50' },
  ];

 

  private readonly fb = inject(FormBuilder);
  private readonly chartService = inject(ChartService);
  constructor() {
    this.createForm()
  }
  
  ngOnChanges(changes: SimpleChanges): void {

    let currentValue = changes['getPanelObj'].currentValue;

    console.log('currentValue', currentValue);

    if(currentValue != null || currentValue != undefined){
      let panelsArrData: any = sessionStorage.getItem('createPanelSeriesArray');
      this.panelSeriesArray = panelsArrData;

      if(this.panelSeriesArray){
        this.panelSeriesArray = JSON.parse(this.panelSeriesArray);
        // console.log('panel changed obj', currentValue)
        this.getPanelObj = currentValue;

        this.connection_id = this.getPanelObj.connection_id;

        let matchingObject= this.panelSeriesArray.find((ele : any) => ele.id === this.getPanelObj.id);

        if(matchingObject){
          this.getPanelObj = {
            ...matchingObject,
            connection_id: this.connection_id, // Preserve the original connection_id
          };

          console.log('panelObj', this.getPanelObj)

          this.boxTemplateForm.patchValue({

            labelName: this.getPanelObj.content.labelName,
            labelFontSize: this.getPanelObj.content.labelFontSize,
            labelFontColor: this.getPanelObj.content.labelFontColor,
            backgroundColor: this.getPanelObj.content.backgroundColor,
            labelAlignment: this.getPanelObj.content.labelAlignment,
            icon: this.getPanelObj.content.icon,
            iconFontSize: this.getPanelObj.content.iconFontSize,
            iconColor: this.getPanelObj.content.iconColor,
            layout: this.getPanelObj.content.layout,
          });

        }
      }
    }

  }




  ngOnInit(): void {

    // this.createForm()
  }

  createForm(){


    this.boxTemplateForm = this.fb.group({
      // tableName: [''],
      // fieldName: [''],
      labelName: [''],
      labelFontSize: [16],
      labelFontColor: ['#000000'],
      backgroundColor: ['#ffffff'],
      labelAlignment: ['center'],
      icon: [''],
      iconFontSize: [''],
      iconColor: [""],
      layout: [""],
    })
  }


  onBoxFormSubmit() {
    console.log('Form Data:', this.boxTemplateForm);

    let formValue = this.boxTemplateForm.value;

    if(this.panelSeriesArray){
      let object = this.panelSeriesArray.find((ele : any) => ele.id === this.getPanelObj.id);

      const matchingObjectIndex = Array.isArray(this.panelSeriesArray)
      ? this.panelSeriesArray.findIndex(obj => obj.id === this.getPanelObj.id)
      : -1;

      let boxApiObj =  {
        "object_id":this.getPanelObj.id,
        "object_setup": {
          "content": {
            "id": 'Card_'  + this.getPanelObj.id,
           
            "labelName":  formValue.labelName,
            "labelFontSize":  formValue.labelFontSize,
            "labelFontColor":  formValue.labelFontColor,
            "backgroundColor":  formValue.backgroundColor,
            "labelAlignment":  formValue.labelAlignment,
            "icon": formValue.icon,
            "iconFontSize": formValue.iconFontSize,
            "iconColor": formValue.iconColor,
            "layout": formValue.layout, //reverse-horizontal-layout , vertical-layout, horizontal-layout

             "panelType": "Card"
        },

      },

      "object_type": "Card",
      "connection_id": this.connection_id,



    }

    console.log('boxApiObj', boxApiObj)
    
    if (matchingObjectIndex !== -1) {
      // Update the existing object with the new data
      this.panelSeriesArray[matchingObjectIndex] = {
        ...this.getPanelObj,
        header : formValue.labelName,
        content : {
         ... boxApiObj.object_setup.content
        }
      };
    }

    sessionStorage.setItem('createPanelSeriesArray', JSON.stringify(this.panelSeriesArray));

    this.chartService.objectPivotCreate(boxApiObj).subscribe(
      (res : any) =>{
      // console.log(res);
  
      if(res.success){
        let resobj = res['data'];

        console.log(resobj)

        let data = resobj.content;
        if(data == undefined || data != undefined){
          console.log(data)
          let boxObj = { 
          ...this.getPanelObj,
          header : data.labelName,
          content : {
           ...data,   
          }
          
         }
         console.log(boxObj)
    
         this.sendBoxObj.emit({ boxObj: boxObj, resObj: { resSuccess: res.success, resMessage: res.message , statusCode : res.status_code} });
  
        }
      }else{
        let boxObj = this.panelSeriesArray[matchingObjectIndex]
        this.sendBoxObj.emit({ boxObj: boxObj, resObj: { resSuccess: false, resMessage: res.message, statusCode : res.status_code } });
      }
     },
     (err : any) =>{
      let boxObj = this.panelSeriesArray[matchingObjectIndex]
      const errorMessage = err.error && err.error.message ? err.error.message : err.message;
       this.sendBoxObj.emit({ boxObj: boxObj, resObj: { resSuccess: false, resMessage: errorMessage, statusCode : err.status } });
      }
     )


  }

}

}

