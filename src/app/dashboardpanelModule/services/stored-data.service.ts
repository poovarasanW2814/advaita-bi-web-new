import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StoredDataService {

  constructor() { }

  storeDataInLocalStorage(data: any) {
    sessionStorage.setItem('myData', JSON.stringify(data));
  }

  getDataFromLocalStorage() {
    const storedData = sessionStorage.getItem('myData');
    return storedData ? JSON.parse(storedData) : null;
  }
}
