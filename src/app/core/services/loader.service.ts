import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  constructor() { }

  private activeRequests = 0;
  private loading = new BehaviorSubject<boolean>(false);
  public isLoading$ = this.loading.asObservable();

  show() {
    this.activeRequests++;
    this.loading.next(true);
  }

  hide() {
    if (this.activeRequests > 0) {
      this.activeRequests--;
    }
    if (this.activeRequests === 0) {
      this.loading.next(false);
    }
  }

  forceHide() {
    this.activeRequests = 0;
    this.loading.next(false);
  }
}
