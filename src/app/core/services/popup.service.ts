import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class PopupService {

  constructor(private router: Router) { }
  private skipGuard = false;

  // This getter allows the guard to access the flag
  get shouldSkipGuard() {
    return this.skipGuard;
  }


  private popupDataSource = new BehaviorSubject< null>(null);
  popupData$ = this.popupDataSource.asObservable();

  showPopup(data: any) {
    // Attach current route to the popup data
    const dataWithRoute = {
      ...data,
      originRoute: this.router.url
    };
    this.popupDataSource.next(dataWithRoute);
  }

  closePopup() {
    this.skipGuard = true;
    this.popupDataSource.next(null);
  }

  resetGuard() {
    this.skipGuard = false;
  }


}
