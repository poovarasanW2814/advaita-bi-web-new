import { Injectable } from '@angular/core';
import { PanelModel } from '@syncfusion/ej2-angular-layouts';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PanelServiceService {

  panels: PanelModel[] = [];

  constructor() { }

  addPanel(panel: PanelModel) {
    this.panels.push(panel);
  }

  removePanel(panelId: string) {
    this.panels = this.panels.filter(panel => panel.id !== panelId);
  }

  getPanels() {
    return this.panels;
  };


  private array: any[] = [];
  private subject = new Subject<any[]>();


  pushToArray(object: any) {
    this.array.push(object);
    this.subject.next(this.array);
  }

  getArray() {
    return this.subject.asObservable();
  }

  private panelsArray: PanelModel[] = [];

  getPanelsArray(): PanelModel[] {
    return this.panelsArray;
  }

  setPanelsArray(panelsArray: PanelModel[]): void {
    this.panelsArray = panelsArray;
  }

  
//   https://lenovo-api.syntheta.net and https://lenovo.syntheta.net
// https://keus.syntheta.net and https://keus-api.syntheta.net


  //apd_base url of instance of lenovo
  // lenovo_url = `https://lenovo.syntheta.net`
 // base_url  =  "https://lenovo-api.syntheta.net";
//https://lenovo-api.syntheta.net/docs

    //apd_base url of instance of keus
  // angular link = `https://keus.syntheta.net`
 // base_url  =  "https://keus-api.syntheta.net";

  //apd_base url of instance of apd
  // apd_url = `https://apd-api.syntheta.net`
  // base_url  =  "https://apd-api.syntheta.net";

  /***************  Popular instance   *******************************/

 // base_url = "https://popular-api.syntheta.net:8443"


  // <----------------------- live baseUrl -------------------------->
     //base_url  =  "https://api.syntheta.net";
  
  // <--------------------- kalyan baseurl ---------------------->
  
  // base_url = 'https://kalyan-api.syntheta.net';
  
  //<-------------- kalyan new url ----------------------->
  
     //base_url = "https://kal-api.idamtat.in:8445"
  
  
  //////demo url with port NO 8082
  // base_url  =  "http://164.52.217.212";
    // base_url =  "https://api.syntheta.net:8082"
  
  // Dwani api urls
  // https://dwani-api.syntheta.net/
  // base_url  =  "https://dwani-api.syntheta.net";
  
  // https://dwani-api.syntheta.net/docs
  // https://dwani.syntheta.net/docs
  
  // lenovo new url 
  
    //////////// base_url = "https://tst-lenovo.syntheta.net:9001"
    //  base_url = "https://tstapi-lenovo.syntheta.net"
   
  
}
