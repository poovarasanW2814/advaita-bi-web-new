// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { Router } from '@angular/router';
// import { AnimationModel } from '@syncfusion/ej2-angular-progressbar';
// import { finalize, tap } from 'rxjs';
// import { AuthService } from 'src/app/core/AuthServices/auth.service';
// import { LogaccessService } from 'src/app/core/AuthServices/logaccess.service';
// import { UserService } from 'src/app/core/AuthServices/user.service';
// import { ChartService } from 'src/app/core/services/chart.service';
// import { passwordValidator } from 'src/app/core/services/custom-validators';
// import { DashboardBasedAccessService } from 'src/app/core/services/dashboard-based-access.service';
// import { LoaderService } from 'src/app/core/services/loader.service';
// import { MenuBasedAccessService } from 'src/app/core/services/menu-based-access.service';
// import { PopupService } from 'src/app/core/services/popup.service';

// @Component({
//   selector: 'app-login',
//   templateUrl: './login.component.html',
//   styleUrls: ['./login.component.scss']
// })
// export class LoginComponent implements OnInit {
//   form!: FormGroup;
//   public formHeader: string = 'Success';
//   loaderFlag : boolean = false
//   animation: AnimationModel = { enable: true, duration: 200, delay: 0 };

//   orgDetailsObj : any = {
//     app_logo : '',
//     app_logo_name : 'Syntheta',
//     client_logo : '',
//     client_logo_name : '',
//     client_loader : '',
//     client_loader_name : '',
//     copyright_text : '',
//   };

//   logoImgPath! : string;

//   constructor(private formBuilder: FormBuilder, private router : Router, private chartService : ChartService, private authService: AuthService, private LogaccesService: LogaccessService, private menuBasedAccessService: MenuBasedAccessService, private dashboardBasedAccessService : DashboardBasedAccessService, private loaderService : LoaderService, private popupService : PopupService, private userService : UserService, private loaderservice : LoaderService) { }

//   ngOnInit(): void {

//     this.form = this.formBuilder.group({
//       username: ['', [Validators.required]],
//       password: ['', [Validators.required]],
//       // password: ['', [Validators.required,  Validators.minLength(8), passwordValidator]],
//     });

//     this.popupService.closePopup();

//     this.orgDetailsObj = {
//       app_logo : '',
//       app_logo_name : '',
//       client_logo : '',
//       client_logo_name : '',
//       client_loader : '',
//       client_loader_name : '',
//       copyright_text : '',

//     }

//     this.logoImgPath =   this.orgDetailsObj.client_logo ? this.orgDetailsObj.client_logo : this.orgDetailsObj.app_logo ;

//     sessionStorage.setItem('orgDetailsObj', JSON.stringify(this.orgDetailsObj))


//     // console.log('hello i this is before login console')
//     // console.log('hello i  have logged in successfully')
//   }
//   password: string = '';
//   isPasswordVisible = false;

//   togglePasswordVisibility() {
//     this.isPasswordVisible = !this.isPasswordVisible;
//   }

//   Submitold(): void {
//     const formObj = this.form.value;
//   //  console.log(formObj)
//     // this.loaderService.show()

//     if (this.form.valid) {

//       console.log(formObj)
//       let obj = {
//         username : formObj.username,
//         password : formObj.password 
//       }
//      // console.log(obj)
//       this.loaderFlag = true;
//       const backdrop = document.getElementById('backdrop');

//       if ( backdrop) {
//         backdrop.style.display = 'block';
//       }
//       this.chartService.loginUser(obj).subscribe({
//         next: (res: any) => {
//           if(res.success == true){
//             let data = res['data'];
//             let userdata = data.user;
//             sessionStorage.setItem('userInformation', JSON.stringify(userdata));

            
//             console.log(data);
//             this.loaderFlag = false;

//             if ( backdrop) {
//               backdrop.style.display = 'none';
//             }

//             let menuBasedAccess = data.menu_based_access;
//             let dashboardBasedAccess = data.dashboard_based_access;

//             this.menuBasedAccessService.setMenuAccess(menuBasedAccess);
//             this.dashboardBasedAccessService.setdashboardAccess(dashboardBasedAccess);
//             const authToken = data.access_token;
//             this.LogaccesService.login(authToken);

//             const redirectUrl = this.LogaccesService.getRedirectUrl();
//             console.log('redirectUrl', redirectUrl);

//             if (userdata) {
//               console.log('userdata in loggin', userdata)
//               this.chartService.getUserDetailByUsername(userdata.username).subscribe((res: any) => {
//                 let roleData = res['data'];

//                  this.userService.setUser(roleData);

//               });
//             }


//             if (redirectUrl) {
//               this.router.navigate([redirectUrl]);
//               this.LogaccesService.clearRedirectUrl(); // Clear the stored redirect URL
//             } else {
//               this.router.navigate(['/sidebar/panel/dashboardHome'])
//             }

//           }else{

//           this.loaderFlag = false;
         
//           if ( backdrop) {
//             backdrop.style.display = 'none';
//           }
//           if(res.statusCode == 500 || res.statusCode == 0 ){
//             alert("Something went wrong , please try again later")
//           }else{
//           alert(res.message)

//           }
       

//           }
        
//         }
        
//         ,
//         error: (err: any) => {
//           console.log(err);
//           this.loaderFlag = false;

//           if ( backdrop) {
//             backdrop.style.display = 'none';
//           }
//           alert("Something went wrong , please try again later")

       
//         }
//       });
      

//     } else {
//       console.log('Form is invalid');
//     }
    
//   }
  
//   Submit(): void {
//     const formObj = this.form.value;
  
//     if (this.form.valid) {
//       console.log(formObj);
//       let obj = {
//         username: formObj.username,
//         password: formObj.password
//       };
  
//       this.loaderFlag = true;
//       const backdrop = document.getElementById('backdrop');
  
//       if (backdrop) {
//         backdrop.style.display = 'block';
//       }
  
//       this.chartService.loginUser(obj).subscribe({
//         next: (res: any) => {
//           if (res.success) {
//             let data = res['data'];
//             let userdata = data.user;
//             sessionStorage.setItem('userInformation', JSON.stringify(userdata));
  
//             let menuBasedAccess = data.menu_based_access;
//             let dashboardBasedAccess = data.dashboard_based_access;
  
//             this.menuBasedAccessService.setMenuAccess(menuBasedAccess);
//             this.dashboardBasedAccessService.setdashboardAccess(dashboardBasedAccess);
//             const authToken = data.access_token;
//             this.LogaccesService.login(authToken);
  
//             const redirectUrl = this.LogaccesService.getRedirectUrl();
//             console.log('redirectUrl', redirectUrl);
  
//             if (userdata) {
//               console.log('Fetching user details...');
//               this.chartService.getUserDetailByUsername(userdata.username).subscribe({
//                 next: (res: any) => {
//                   let roleData = res['data'];
//                   this.userService.setUser(roleData);
  
//                   // Hide loader and redirect AFTER user details are fetched
//                   this.loaderFlag = false;
//                   if (backdrop) backdrop.style.display = 'none';
  
//                   if (redirectUrl) {
//                     this.router.navigate([redirectUrl]);
//                     this.LogaccesService.clearRedirectUrl();
//                   } else {
//                     this.router.navigate(['/sidebar/panel/dashboardHome']);
//                   }
//                 },
//                 error: (err: any) => {
//                   console.log('Error fetching user details:', err);
//                   this.loaderFlag = false;
//                   if (backdrop) backdrop.style.display = 'none';
//                   alert('Something went wrong while fetching user details.');
//                 }
//               });
//             } else {
//               // Hide loader if user details are not needed
//               this.loaderFlag = false;
//               if (backdrop) backdrop.style.display = 'none';
  
//               if (redirectUrl) {
//                 this.router.navigate([redirectUrl]);
//                 this.LogaccesService.clearRedirectUrl();
//               } else {
//                 this.router.navigate(['/sidebar/panel/dashboardHome']);
//               }
//             }
//           } else {
//             this.loaderFlag = false;
//             if (backdrop) backdrop.style.display = 'none';
//             alert(res.statusCode == 500 || res.statusCode == 0 ? 'Something went wrong, please try again later' : res.message);
//           }
//         },
//         error: (err: any) => {
//           console.log(err);
//           this.loaderFlag = false;
//           if (backdrop) backdrop.style.display = 'none';
//           alert('Something went wrong, please try again later');
//         }
//       });
//     } else {
//       console.log('Form is invalid');
//     }
//   }

  
//   private showAlert(message: string): void {
//     const isConfirmed = window.confirm(message);
//     // this.router.navigate(['/login'])
//     if (!isConfirmed) {
//       this.router.navigate(['/login']);
//     }
//   }
  

//   closePopup(): void {
//     const popup = document.getElementById('popup');
//     const backdrop = document.getElementById('backdrop');

//     if (popup && backdrop) {
//       popup.style.display = 'none';
//       backdrop.style.display = 'none';
//       this.refreshPage()
//     }
//   }
//   refreshPage() {
//     const currentUrl = this.router.url;
//     this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
//       this.router.navigate([currentUrl]);
//     });
//   }

//   showPopup(status: any, fontSize: string = '40px', resMessage: string): void {
//     const popup = document.getElementById('popup');
//     const backdrop = document.getElementById('backdrop');
//     const popupMessage = document.getElementById('popup-message');
  
//     if (popup && backdrop && popupMessage) {
//       const iconClass = status === true ? 'fa-check-circle' : 'fa-times-circle';
//       const iconColor = status === true ? 'green' : 'red';
  
//       popupMessage.innerHTML = `<span style="color: ${iconColor};"><i class="fas ${iconClass}" style="font-size: ${fontSize};"></i></span>`;
  
//       const statusElement = document.createElement('h5');
//       statusElement.textContent = status === true ? 'Success' : 'Error';
//       popupMessage.appendChild(statusElement);
  
//       const messageElement = document.createElement('div');
//       messageElement.innerHTML = `<h6>${resMessage}</h6>`;
//       popupMessage.appendChild(messageElement);
  
//       const scrollTop =  document.documentElement.scrollTop;
//       const windowHeight = window.innerHeight || document.documentElement.clientHeight;
//       const popupHeight = popup.offsetHeight;
  
//       const topPosition = Math.max(0, scrollTop + windowHeight / 2 - popupHeight / 2);
  
//       popup.style.top = topPosition + 'px';
//       popup.style.display = 'block';
  
//       // backdrop.style.display = 'block';
//     }
//   }
  
// }
