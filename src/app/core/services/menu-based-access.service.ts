import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuBasedAccessService {
  private localStorageKey = 'menu_based_access_data';

  private menuAccessSubject = new BehaviorSubject<any>(this.getMenuAccessFromLocalStorage());
  menuAccess$ = this.menuAccessSubject.asObservable();

  getMenuAccessSnapshot(): any {
    return this.menuAccessSubject.getValue();
  }

  constructor() { }

  setMenuAccess(menuAccess: any) {
    this.menuAccessSubject.next(menuAccess);
    // localStorage.setItem(this.localStorageKey, JSON.stringify(menuAccess));
    sessionStorage.setItem(this.localStorageKey, JSON.stringify(menuAccess));
  }

  private getMenuAccessFromLocalStorage(): any {
    try {
      const storedData = sessionStorage.getItem(this.localStorageKey);
      // const storedData = localStorage.getItem(this.localStorageKey);
      
      // Check if storedData is not null or undefined
      if (storedData != null) {
        let obj = {};
        if(storedData == 'undefined'){
          return obj;
        } else {
          return JSON.parse(storedData);
        }
      } else {
        console.warn('Data in sessionStorage is null or undefined.');
        return null;
      }
    } catch (error) {
      console.error('Error parsing data from sessionStorage:', error);
      return null;
    }
  }

  // Added method to manually update the observable with data from sessionStorage
  updateMenuAccessFromLocalStorage() {
    const menuAccess = this.getMenuAccessFromLocalStorage();
    this.menuAccessSubject.next(menuAccess);
    return menuAccess;
  }
}
