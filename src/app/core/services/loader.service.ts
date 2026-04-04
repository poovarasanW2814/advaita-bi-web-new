import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  constructor() { }

  private loading = new BehaviorSubject<boolean>(false);
  public isLoading$ = this.loading.asObservable();

  show() {
      this.loading.next(true);
  }

  hide() {
    // setTimeout(() => {
    //   this.loading.next(false);
    // }, 100);
      this.loading.next(false);
  }


}

