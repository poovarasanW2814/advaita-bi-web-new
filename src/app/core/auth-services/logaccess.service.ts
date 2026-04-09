// logaccess.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LogaccessService {

  private isAuthenticated: boolean = false;
  private authToken: string | null = null;
  private accessTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  accessToken$: Observable<string | null> = this.accessTokenSubject.asObservable();

  private tokenChanged = new Subject<string>();
  public tokenChanged$ = this.tokenChanged.asObservable();
  constructor() {}

  login(token: string): void {
    this.isAuthenticated = true;

    // localStorage.setItem('authenticatedUser', JSON.stringify(this.isAuthenticated))

    sessionStorage.setItem('authenticatedUser', JSON.stringify(this.isAuthenticated))



    this.authToken = token;
    this.accessTokenSubject.next(token);
    this.tokenChanged.next(token);
    this.saveTokenToLocalStorage(token);
    // console.log(token)
  }

  logout(): void {
    this.isAuthenticated = false;
    // localStorage.removeItem('authenticatedUser');
    sessionStorage.removeItem('authenticatedUser');

    this.authToken = null;
    this.removeTokenFromLocalStorage();
  }

  isAuthenticatedUser(): boolean {
    return this.isAuthenticated;
  }

  getAuthToken(): Observable<string | null> {
    // this.authToken = localStorage.getItem('authToken');
    this.authToken = sessionStorage.getItem('authToken');
    // console.log(this.authToken)
    return of(this.authToken);
  }
  
  
  // getAuthToken(): Observable<string | null> {
  //   return this.accessTokenSubject.asObservable();
  // }
  getAccessToken(): string | null {
    return this.accessTokenSubject.value;
  }
  private saveTokenToLocalStorage(token: string): void {
    // localStorage.setItem('authToken', token);
    sessionStorage.setItem('authToken', token);
  }
  
  private removeTokenFromLocalStorage(): void {
    // localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');
  }


    private redirectUrl: string | null = null; // Store the redirect URL
    // Methods to manage redirect URL
    setRedirectUrl(url: string): void {
      this.redirectUrl = url;
    }
  
    getRedirectUrl(): string | null {
      return this.redirectUrl;
    }
  
    clearRedirectUrl(): void {
      this.redirectUrl = null;
    }
}
