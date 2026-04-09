import { Component, ElementRef, OnInit, ViewChild, inject} from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AnimationModel, ProgressBarModule } from '@syncfusion/ej2-angular-progressbar';
import { finalize, tap } from 'rxjs';
import { AuthService } from 'src/app/core/auth-services/auth.service';
import { LogaccessService } from 'src/app/core/auth-services/logaccess.service';
import { UserService } from 'src/app/core/auth-services/user.service';
import { ChartService } from 'src/app/core/services/chart.service';
import { passwordValidator } from 'src/app/core/validators/custom-validators';
import { DashboardBasedAccessService } from 'src/app/core/services/dashboard-based-access.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { MenuBasedAccessService } from 'src/app/core/services/menu-based-access.service';
import { PopupService } from 'src/app/core/services/popup.service';
import { v4 as uuidv4 } from 'uuid';
import { NgStyle, NgClass } from '@angular/common';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    imports: [NgStyle, FormsModule, ReactiveFormsModule, NgClass, ProgressBarModule]
})
export class LoginComponent implements OnInit {
  form!: FormGroup;
  public formHeader: string = 'Success';
  loaderFlag: boolean = false
  animation: AnimationModel = { enable: true, duration: 200, delay: 0 };

  orgDetailsObj: any = {
    app_logo: '',
    app_logo_name: 'Syntheta',
    client_logo: '',
    client_logo_name: '',
    client_loader: '',
    client_loader_name: '',
    copyright_text: '',
    app_logo_inside: '',
    client_logo_inside: '',
  };

  // logoImgPath!: string;
  logoImgPath: string = 'assets/images/SynthetaLogoDarkfont4.png';

  @ViewChild('passwordInput') passwordInput!: ElementRef<HTMLInputElement>;
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly chartService = inject(ChartService);
  private readonly authService = inject(AuthService);
  private readonly LogaccesService = inject(LogaccessService);
  private readonly menuBasedAccessService = inject(MenuBasedAccessService);
  private readonly dashboardBasedAccessService = inject(DashboardBasedAccessService);
  private readonly loaderService = inject(LoaderService);
  private readonly popupService = inject(PopupService);
  private readonly userService = inject(UserService);
  private readonly loaderservice = inject(LoaderService);

   loginBgStyle: any = {};
   contentBgColor: any = { 'background': 'white' };

  ngOnInit(): void {

    this.form = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
      // password: ['', [Validators.required,  Validators.minLength(8), passwordValidator]],
    });



    let locationUrl = window.location.origin.replace(/^https?:\/\//, '');


    this.chartService.getOrgnizationData(locationUrl).subscribe(
      (res: any) => {

        if (res) {
          let data = res['data'];

          this.orgDetailsObj = {
            app_logo: data.app_logo,
            name: data.name,
            app_logo_name: data.app_logo_name,
            client_logo: data.client_logo,
            client_logo_name: data.client_logo_name,
            client_loader: data.client_loader,
            client_loader_name: data.client_loader_name,
            copyright_text: data.copyright_text,
            app_logo_inside: data.app_logo_inside,
            client_logo_inside: data.client_logo_inside,
            app_background_img : '',
            app_background_color: '',
            
          }

          this.logoImgPath = data.client_logo ? data.client_logo : data.app_logo;



          

          sessionStorage.setItem('orgDetailsObj', JSON.stringify(this.orgDetailsObj))
        } else {
          this.logoImgPath = 'assets/images/SynthetaLogoDarkfont4.png'

        }


      },
      (err: any) => {
        this.logoImgPath = 'assets/images/SynthetaLogoDarkfont4.png'

        console.log('Error fetching organization data:', err);

      }
    );

    this.popupService.closePopup();

  }


  isPasswordVisible = false; // Initially, password is hidden

  togglePasswordVisibility(input: HTMLInputElement) {
    this.isPasswordVisible = !this.isPasswordVisible;

    // Ensure text security matches the visibility state
    (input.style as any).webkitTextSecurity = this.isPasswordVisible ? 'none' : 'disc';
  }


  Submitold(): void {
    const formObj = this.form.value;


    if (this.form.valid) {

      console.log(formObj)
      let obj = {
        username: formObj.username,
        password: formObj.password
      }
      // console.log(obj)
      this.loaderFlag = true;
      const backdrop = document.getElementById('backdrop');

      if (backdrop) {
        backdrop.style.display = 'block';
      }
      this.chartService.loginUser(obj).subscribe({
        next: (res: any) => {
          if (res.success == true) {
            let data = res['data'];
            let userdata = data.user;
            sessionStorage.setItem('userInformation', JSON.stringify(userdata));


            console.log(data);
            this.loaderFlag = false;

            if (backdrop) {
              backdrop.style.display = 'none';
            }

            let menuBasedAccess = data.menu_based_access;
            let dashboardBasedAccess = data.dashboard_based_access;

            this.menuBasedAccessService.setMenuAccess(menuBasedAccess);
            this.dashboardBasedAccessService.setdashboardAccess(dashboardBasedAccess);
            const authToken = data.access_token;
            this.LogaccesService.login(authToken);

            const redirectUrl = this.LogaccesService.getRedirectUrl();
            console.log('redirectUrl', redirectUrl);

            if (userdata) {
              console.log('userdata in loggin', userdata)
              this.chartService.getUserDetailByUsername(userdata.username).subscribe((res: any) => {
                let roleData = res['data'];

                this.userService.setUser(roleData);

              });
            }


            if (redirectUrl) {
              this.router.navigate([redirectUrl]);
              this.LogaccesService.clearRedirectUrl(); // Clear the stored redirect URL
            } else {
              this.router.navigate(['/sidebar/panel/dashboardHome'])

              
            }

          } else {

            this.loaderFlag = false;

            if (backdrop) {
              backdrop.style.display = 'none';
            }
            if (res.statusCode == 500 || res.statusCode == 0) {
              alert("Something went wrong , please try again later")
            } else {
              alert(res.message)

            }


          }

        }

        ,
        error: (err: any) => {
          console.log(err);
          this.loaderFlag = false;

          if (backdrop) {
            backdrop.style.display = 'none';
          }
          
          // Handle error response properly - show actual error message for 400/401/422
          if (err.error && err.error.message) {
            if (err.status === 400 || err.status === 401 || err.status === 422) {
              alert(err.error.message);
            } else {
              alert('Something went wrong, please try again later');
            }
          } else {
            alert('Something went wrong, please try again later');
          }


        }
      });


    } else {
      console.log('Form is invalid');
    }

  }

  SubmitCorrect(): void {
    const formObj = this.form.value;

    if (this.form.valid) {
      console.log(formObj);
      let obj = {
        username: formObj.username,
        password: formObj.password
      };

      this.loaderFlag = true;
      const backdrop = document.getElementById('backdrop');

      if (backdrop) {
        backdrop.style.display = 'block';
      }

      this.chartService.loginUser(obj).subscribe({
        next: (res: any) => {
          if (res.success) {
            let data = res['data'];
            let userdata = data.user;
            sessionStorage.setItem('userInformation', JSON.stringify(userdata));

            let menuBasedAccess = data.menu_based_access;
            let dashboardBasedAccess = data.dashboard_based_access;

            this.menuBasedAccessService.setMenuAccess(menuBasedAccess);
            this.dashboardBasedAccessService.setdashboardAccess(dashboardBasedAccess);
            const authToken = data.access_token;
            this.LogaccesService.login(authToken);

            const redirectUrl = this.LogaccesService.getRedirectUrl();
            console.log('redirectUrl', redirectUrl);

            if (userdata) {
              console.log('Fetching user details...');
              this.chartService.getUserDetailByUsername(userdata.username).subscribe({
                next: (res: any) => {
                  let roleData = res['data'];
                  this.userService.setUser(roleData);

                  // Hide loader and redirect AFTER user details are fetched
                  this.loaderFlag = false;
                  if (backdrop) backdrop.style.display = 'none';

                  if (redirectUrl) {
                    console.log('redirectUrl', redirectUrl)
                    this.router.navigate([redirectUrl]);
                    this.LogaccesService.clearRedirectUrl();

                    // this.router.navigateByUrl(redirectUrl); // Use navigateByUrl for full URL
                    // this.logaccessService.clearRedirectUrl();
                  } else {
                    this.router.navigate(['/sidebar/panel/dashboardHome']);
                  }
                },
                error: (err: any) => {
                  console.log('Error fetching user details:', err);
                  this.loaderFlag = false;
                  if (backdrop) backdrop.style.display = 'none';
                  
                  // Handle error response properly
                  if (err.error && err.error.message) {
                    if (err.status === 400 || err.status === 401 || err.status === 422) {
                      alert(err.error.message);
                    } else {
                      alert('Something went wrong while fetching user details.');
                    }
                  } else {
                    alert('Something went wrong while fetching user details.');
                  }
                }
              });
            } else {
              // Hide loader if user details are not needed
              this.loaderFlag = false;
              if (backdrop) backdrop.style.display = 'none';

              if (redirectUrl) {
                this.router.navigate([redirectUrl]);
                this.LogaccesService.clearRedirectUrl();
              } else {
                this.router.navigate(['/sidebar/panel/dashboardHome']);
              }
            }
          } else {
            this.loaderFlag = false;
            if (backdrop) backdrop.style.display = 'none';
            alert(res.statusCode == 500 || res.statusCode == 0 ? 'Something went wrong, please try again later' : res.message);
          }
        },
        error: (err: any) => {
          console.log(err);
          this.loaderFlag = false;
          if (backdrop) backdrop.style.display = 'none';
          
          // Handle error response properly - show actual error message for 400/401/422
          if (err.error && err.error.message) {
            if (err.status === 400 || err.status === 401 || err.status === 422) {
              alert(err.error.message);
            } else {
              alert('Something went wrong, please try again later');
            }
          } else {
            alert('Something went wrong, please try again later');
          }
        }
      });
    } else {
      console.log('Form is invalid');
    }
  }

  Submit(): void {
    const formObj = this.form.value;

    if (this.form.valid) {
      console.log(formObj);
      let obj = {
        username: formObj.username,
        password: formObj.password
      };

      this.loaderFlag = true;
      const backdrop = document.getElementById('backdrop');

      if (backdrop) {
        backdrop.style.display = 'block';
      }

      this.chartService.loginUser(obj).subscribe({
        next: (res: any) => {
          if (res.success) {
            let data = res['data'];
            let userdata = data.user;
            sessionStorage.setItem('userInformation', JSON.stringify(userdata));

            let menuBasedAccess = data.menu_based_access;
            let dashboardBasedAccess = data.dashboard_based_access;

            this.menuBasedAccessService.setMenuAccess(menuBasedAccess);
            this.dashboardBasedAccessService.setdashboardAccess(dashboardBasedAccess);
            const authToken = data.access_token;
            this.LogaccesService.login(authToken);

            const redirectUrl = this.LogaccesService.getRedirectUrl();
            console.log('redirectUrl', redirectUrl);

            


            if (userdata) {
              console.log('Fetching user details...');
              this.loaderFlag = false;
              if (backdrop) backdrop.style.display = 'none';
              this.userService.setUser(userdata);

              if (redirectUrl) {

                console.log('redirectUrl', redirectUrl)
                this.router.navigate([redirectUrl]);
                this.LogaccesService.clearRedirectUrl();

     
              } else {
                this.router.navigate(['/sidebar/panel/dashboardHome']);
              }


                        

            } else {
              // Hide loader if user details are not needed
              this.loaderFlag = false;
              if (backdrop) backdrop.style.display = 'none';

              if (redirectUrl) {
                this.router.navigate([redirectUrl]);
                this.LogaccesService.clearRedirectUrl();
              } else {
                this.router.navigate(['/sidebar/panel/dashboardHome']);
              }
            }

             let uniqueID = uuidv4();
             let loginStoreObj = {
                username: userdata.username,
                user_id: userdata.user_id,
                login_datetime: new Date().toISOString(),
                session_unique_id : uniqueID,
              }

              let loginObj = {
                // username: userdata.username,
                // user_id: userdata.user_id,
                login_datetime: new Date().toISOString(),
                session_unique_id : uniqueID,
              }
              console.log('Login session object:', loginObj);
              sessionStorage.setItem('loginSession', JSON.stringify(loginStoreObj));

              this.chartService.loginTrackSubmit(loginObj).subscribe({
                  next: (res) => console.log('Tracked Login Response:', res),
                  error: (err) => console.error('Tracking failed:', err),
              });



          } else {
            this.loaderFlag = false;
            if (backdrop) backdrop.style.display = 'none';
            alert(res.statusCode == 500 || res.statusCode == 0 ? 'Something went wrong, please try again later' : res.message);
          }
        },
        error: (err: any) => {
          console.log(err);
          this.loaderFlag = false;
          if (backdrop) backdrop.style.display = 'none';
          
          // Handle error response properly - show actual error message for 400/401/422
          if (err.error && err.error.message) {
            if (err.status === 400 || err.status === 401 || err.status === 422) {
              alert(err.error.message);
            } else {
              alert('Something went wrong, please try again later');
            }
          } else {
            alert('Something went wrong, please try again later');
          }
        }
      });
    } else {
      console.log('Form is invalid');
    }
  }

  private showAlert(message: string): void {
    const isConfirmed = window.confirm(message);
    // this.router.navigate(['/login'])
    if (!isConfirmed) {
      this.router.navigate(['/login']);
    }
  }


  closePopup(): void {
    const popup = document.getElementById('popup');
    const backdrop = document.getElementById('backdrop');

    if (popup && backdrop) {
      popup.style.display = 'none';
      backdrop.style.display = 'none';
      this.refreshPage()
    }
  }
  refreshPage() {
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }

  showPopup(status: any, fontSize: string = '40px', resMessage: string): void {
    const popup = document.getElementById('popup');
    const backdrop = document.getElementById('backdrop');
    const popupMessage = document.getElementById('popup-message');

    if (popup && backdrop && popupMessage) {
      const iconClass = status === true ? 'fa-check-circle' : 'fa-times-circle';
      const iconColor = status === true ? 'green' : 'red';

      popupMessage.innerHTML = `<span style="color: ${iconColor};"><i class="fas ${iconClass}" style="font-size: ${fontSize};"></i></span>`;

      const statusElement = document.createElement('h5');
      statusElement.textContent = status === true ? 'Success' : 'Error';
      popupMessage.appendChild(statusElement);

      const messageElement = document.createElement('div');
      messageElement.innerHTML = `<h6>${resMessage}</h6>`;
      popupMessage.appendChild(messageElement);

      const scrollTop = document.documentElement.scrollTop;
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      const popupHeight = popup.offsetHeight;

      const topPosition = Math.max(0, scrollTop + windowHeight / 2 - popupHeight / 2);

      popup.style.top = topPosition + 'px';
      popup.style.display = 'block';

    }
  }

}
