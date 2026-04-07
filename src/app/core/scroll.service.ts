import { Injectable, inject} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ScrollService {

  private readonly router = inject(Router);
  constructor() {
    this.router.events.subscribe((event) => {
          console.log('event', event)
          if (event instanceof NavigationEnd) {
            window.scrollTo(0, 0);
  }
    });
  }
}
