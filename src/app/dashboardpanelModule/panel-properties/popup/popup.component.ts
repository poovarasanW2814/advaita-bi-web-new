import { Component, HostListener, OnDestroy, OnInit, ViewChild, inject} from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { PopupService } from 'src/app/core/services/popup.service';

@Component({
    selector: 'app-popup',
    templateUrl: './popup.component.html',
    styleUrls: ['./popup.component.scss']
})
export class PopupComponent implements OnInit, OnDestroy {

  message: string = '';
  isSuccess: boolean = true;
  isVisible!: boolean;
  popupData: any;
  showMore = false;
  private routerSubscription!: Subscription;
  @ViewChild(PopupComponent) PopupComponent!: PopupComponent;


  private readonly popupService = inject(PopupService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  ngOnInit(): void {
    this.popupService.popupData$.subscribe((data) => {
      if (data) {
        this.popupData = data;

        // Check if we're still on the same route where the error originated
        const currentRoute = this.router.url;
        const originRoute = this.popupData.originRoute;
        
        // Only show popup if we're still on the same route
        if (originRoute && currentRoute !== originRoute) {
          // Silently ignore errors from previous routes
          return;
        }

        if (this.popupData.statusCode == 200 || this.popupData.statusCode == 201) {
          this.showPopupMessage()
          setTimeout(() => {
            this.updatePopupPosition();
          }, 0);
          this.message = this.popupData.message;
          this.isSuccess = true
        } else {
          this.isSuccess = false;
          setTimeout(() => {
            this.updatePopupPosition();
          }, 0);

          // Show specific error messages for 400, 401, 402, 404, 422 (interceptor handles token expiration)
          if (this.popupData.statusCode == 400 || this.popupData.statusCode == 401 || 
              this.popupData.statusCode == 402 || this.popupData.statusCode == 404 || 
              this.popupData.statusCode == 422) {
            this.message = this.popupData.message;
            this.showPopupMessage()
          }
          // Show generic message for server errors
          else if (this.popupData.statusCode == 500 || this.popupData.statusCode == 0 || 
                   this.popupData.statusCode == 502 || this.popupData.statusCode == 504) {
            this.message = "Something Went Wrong ";
            this.showPopupMessage()
          }
          // Show actual message for any other error
          else {
            this.message = this.popupData.message
            this.showPopupMessage()
          }

        }
      }


    });




    this.routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.closePopup();

      }
    });


  }

  @HostListener('window:scroll')
  @HostListener('window:resize')
  onWindowScrollOrResize() {
    this.updatePopupPosition();
    // this.showPopupMessage()
  }

  private updatePopupPosition() {
    let popup = document.querySelector('.popup1') as HTMLElement;
    let backdrop = document.getElementById('backdrop2');
    if (popup && backdrop) {
      const windowHeight = window.innerHeight;
      popup.style.top = `${window.scrollY + windowHeight / 2}px`;

    }
  }


  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }


  showPopupMessage() {
    const popup = document.getElementById('popup1');
    const backdrop = document.getElementById('backdrop2');
    const popupMessage = document.getElementById('popup-message1');

    // console.log(popup,backdrop)
    if (popup && backdrop) {

      popup.style.display = 'block';

      backdrop.style.display = 'block';
    }
  }

  closePopup() {
    this.popupService.closePopup();
    const popup = document.getElementById('popup1');
    const backdrop = document.getElementById('backdrop2');

    if (popup && backdrop) {
      popup.style.display = 'none';
      backdrop.style.display = 'none';
      // this.refreshPage()

      const currentRoute = this.router.url;

      // console.log('currentRoute', currentRoute)
  
      if (currentRoute.includes('edit') || currentRoute.includes('dashboardHome')) {
        // console.log('Popup closed. Staying on the edit page.');
        // Perform logic specific to the edit page
      }else {
        // console.log('Popup closed. Refreshing the page.');
        this.refreshPage(); // Logic for other pages
      }
    }

  }

  
  removePopup() {
    this.popupService.closePopup();
    const popup = document.getElementById('popup1');
    const backdrop = document.getElementById('backdrop2');

    if (popup && backdrop) {
      popup.style.display = 'none';
      backdrop.style.display = 'none';
      // this.refreshPage()
    }
  }

  toggleMessage() {
    this.showMore = !this.showMore;
  }

  

  refreshPage() {
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }

}

