import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { MenuBasedAccessService } from '../services/menu-based-access.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private menuBasedAccessService: MenuBasedAccessService) { }

  private accessTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  accessToken$: Observable<string | null> = this.accessTokenSubject.asObservable();

  private tokenChanged = new Subject<string>();
  public tokenChanged$ = this.tokenChanged.asObservable();
  
  setAccessToken(token: string): void {
    // localStorage.setItem('accessToken', token);
    sessionStorage.setItem('accessToken', token);
    this.accessTokenSubject.next(token);
    this.tokenChanged.next(token);
  }

  getAccessToken(): string | null {
    return this.accessTokenSubject.value;
  }

  clearAccessToken(): void {
    this.accessTokenSubject.next(null);
  }

  getAuthHeaders(): HttpHeaders | null {
    const accessToken = this.getAccessToken();

    if (!accessToken) {
      console.error('Access token is not available');
      return null;
    }

    return new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
    });
  }
}
