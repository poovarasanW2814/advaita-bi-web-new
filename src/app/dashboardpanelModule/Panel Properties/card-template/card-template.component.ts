import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ChartService } from 'src/app/core/services/chart.service';

@Component({
  selector: 'app-card-template',
  templateUrl: './card-template.component.html',
  styleUrls: ['./card-template.component.scss']
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

    { Class: 'fas fa-signal', PanelType: 'Signal', Id: '2' },
    { Class: 'fas fa-dollar-sign', PanelType: 'Dollar', Id: '3' },
    { Class: 'fas fa-rupee-sign', PanelType: 'Rupee', Id: '4' },
    { Class: 'fas fa-comments', PanelType: 'Comments', Id: '5' },
    { Class: 'fas fa-user', PanelType: 'User', Id: '6' },
    { Class: 'fas fa-percentage', PanelType: 'Percentage', Id: '7' },
    { Class: 'fas fa-plus', PanelType: 'Plus', Id: '8' },
    { Class: 'fas fa-phone', PanelType: 'Phone', Id: '9' },
    { Class: 'fas fa-voicemail', PanelType: 'VoiceMail', Id: '10' },
    { Class: 'fas fa-check-circle', PanelType: 'Success', Id: '11' },
    { Class: 'fas fa-exclamation-triangle', PanelType: 'Warning', Id: '12' },
    { Class: 'fas fa-heart', PanelType: 'Favorites', Id: '13' },
    { Class: 'fas fa-clock', PanelType: 'Time', Id: '14' },
    { Class: 'fas fa-tachometer-alt', PanelType: 'Performance', Id: '15' },
    { Class: 'fas fa-shopping-cart', PanelType: 'Sales', Id: '16' },
    { Class: 'fas fa-eye', PanelType: 'Views', Id: '17' },
    { Class: 'fas fa-calendar', PanelType: 'Calendar', Id: '18' },
    { Class: 'fas fa-cogs', PanelType: 'Settings', Id: '19' },
    { Class: 'fas fa-bullseye', PanelType: 'Target', Id: '20' },
    { Class: 'fas fa-lightbulb', PanelType: 'Ideas', Id: '21' },
    { Class: 'fas fa-wallet', PanelType: 'Budget', Id: '22' },
    { Class: 'fas fa-chart-line', PanelType: 'Trend', Id: '23' },
    { Class: 'fas fa-users', PanelType: 'Team', Id: '24' },
    { Class: 'fas fa-envelope', PanelType: 'Email', Id: '25' },
    { Class: 'fas fa-database', PanelType: 'Database', Id: '26' },
    { Class: 'fas fa-sync', PanelType: 'Sync', Id: '27' },
    { Class: 'fas fa-trash', PanelType: 'Delete', Id: '28' },
    { Class: 'fas fa-edit', PanelType: 'Edit', Id: '29' },
    { Class: 'fas fa-download', PanelType: 'Download', Id: '30' },
    { Class: 'fas fa-upload', PanelType: 'Upload', Id: '31' },
    { Class: 'fas fa-filter', PanelType: 'Filter', Id: '32' },
    { Class: 'fas fa-search', PanelType: 'Search', Id: '33' },
    { Class: 'fas fa-info-circle', PanelType: 'Info', Id: '34' },
    { Class: 'fas fa-question-circle', PanelType: 'Help', Id: '35' },
    { Class: 'fas fa-star', PanelType: 'Star', Id: '36' },
    { Class: 'fas fa-bell', PanelType: 'Notifications', Id: '37' },
    { Class: 'fas fa-map-marker-alt', PanelType: 'Location', Id: '38' },
    { Class: 'fas fa-link', PanelType: 'Link', Id: '39' },


    { Class: 'fas fa-chart-bar', PanelType: 'Chart', Id: '40' },


    { Class: 'fas fa-arrow-up', PanelType: 'Growth', Id: '41' },
    { Class: 'fas fa-arrow-down', PanelType: 'Decline', Id: '42' },
    { Class: 'fas fa-check', PanelType: 'Success', Id: '43' },
    { Class: 'fas fa-exclamation', PanelType: 'Warning', Id: '44' },
    { Class: 'fas fa-times', PanelType: 'Error', Id: '45' },
    { Class: 'fas fa-dollar-sign', PanelType: 'Revenue', Id: '46' },
    { Class: 'fas fa-chart-line', PanelType: 'Line Graph', Id: '47' },
    { Class: 'fas fa-heartbeat', PanelType: 'Health', Id: '48' },
    { Class: 'fas fa-battery-full', PanelType: 'Energy', Id: '49' },
    { Class: 'fas fa-thumbs-up', PanelType: 'Approval', Id: '50' },
  ];

 

  constructor(private fb : FormBuilder, private chartService : ChartService) {
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
