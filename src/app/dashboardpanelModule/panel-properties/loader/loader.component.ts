import { Component, HostListener, OnInit, inject} from '@angular/core';
import { AnimationModel, ProgressBarModule } from '@syncfusion/ej2-angular-progressbar';
import { LoaderService } from 'src/app/core/services/loader.service';

@Component({
    selector: 'app-loader',
    templateUrl: './loader.component.html',
    styleUrls: ['./loader.component.scss'],
    imports: [ProgressBarModule]
})
export class LoaderComponent implements OnInit {


  isVisible: boolean = true;
  animation: AnimationModel = { enable: true, duration: 200, delay: 0 }; // Reduced duration to 500ms for faster loading
  colorPalette: string[] = [
    '#FFD700', '#FF69B4', '#BA55D3', '#7B68EE', '#00FA9A',
    '#20B2AA', '#FF4500', '#4682B4', '#DDA0DD', '#ADFF2F',
    '#00CED1', '#9370DB'
  ];

  private readonly loaderService = inject(LoaderService);


  ngOnInit(): void {

    this.loaderService.isLoading$.subscribe((loading) => {
      this.isVisible = loading;
      if (this.isVisible) {
        // Use setTimeout to ensure the DOM is updated
        setTimeout(() => {
          this.updateLoaderPosition();
        }, 0);
      }
    });

    // Initial position update
    setTimeout(() => {
      this.updateLoaderPosition();
    }, 0);

    // Update loader position initially
    // this.updateLoaderPosition();
  }
  
 
  @HostListener('window:scroll')
  onResize() {
    this.updateLoaderPosition();
  }

  // progress bar loader

  private updateLoaderPosition = () => {
    const loader = document.querySelector('.progressBar') as HTMLElement;
    if (loader && this.isVisible) {
      const windowHeight = window.innerHeight;
      loader.style.top = `${window.scrollY + windowHeight / 2}px`;
      // console.log('windowHeight', windowHeight, loader.style.top, 'loader.style.top')
    }
  };


  
// progress mov
  // private updateLoaderPosition = () => {
  //   const loader = document.querySelector('.loader-video') as HTMLElement;
  //   if (loader && this.isVisible) {
  //     const windowHeight = window.innerHeight;
  //     loader.style.top = `${window.scrollY + windowHeight / 2}px`;
  //   }
  // };
  


  // progress bar for gif 
  // private updateLoaderPosition = () => {
  //   const loader = document.querySelector('.loader-gif') as HTMLElement;
  //   if (loader && this.isVisible) {
  //     const windowHeight = window.innerHeight;
  //     loader.style.top = `${window.scrollY + windowHeight / 2}px`;
  //   }
  // };
  
}

