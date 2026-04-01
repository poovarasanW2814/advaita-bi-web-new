import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userSubject = new BehaviorSubject<any>(null);
  public user$ = this.userSubject.asObservable();

  constructor() {
    const storedUser = sessionStorage.getItem('usersLoginInfo');
    if (storedUser) {
      this.userSubject.next(JSON.parse(storedUser)); // Initialize with stored data
    }
  }

  setUser(user: any) {
    this.userSubject.next(user);
    sessionStorage.setItem('usersLoginInfo', JSON.stringify(user)); // Persist data
  }

  getUser() {
    return this.userSubject.value;
  }

  clearUser() {
    this.userSubject.next(null);
    sessionStorage.removeItem('usersLoginInfo');
  }
}
