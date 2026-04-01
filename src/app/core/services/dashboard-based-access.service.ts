import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardBasedAccessService {

  private localStorageKey = 'dashboard_based_access_data';

  private dashboardAccessSubject = new BehaviorSubject<any>(this.getdashboardAccessFromLocalStorage());
  dashboardAccess$ = this.dashboardAccessSubject.asObservable();

  constructor() { }

  setdashboardAccess(dashboardAccess: any) {
    this.dashboardAccessSubject.next(dashboardAccess);
    sessionStorage.setItem(this.localStorageKey, JSON.stringify(dashboardAccess));
    // localStorage.setItem(this.localStorageKey, JSON.stringify(dashboardAccess));
  }

  private getdashboardAccessFromLocalStorage(): any {
    const storedData = sessionStorage.getItem(this.localStorageKey);
    // const storedData = localStorage.getItem(this.localStorageKey);
    if(storedData != null){
      return storedData == 'undefined' ?  {} : JSON.parse(storedData);
    }
  }

  // Added method to manually update the observable with data from localStorage
  updatedashboardAccessFromLocalStorage() {
    const dashboardAccess = this.getdashboardAccessFromLocalStorage();
    this.dashboardAccessSubject.next(dashboardAccess);
    return dashboardAccess;
  }
}
