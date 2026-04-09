import { Component, OnInit, HostListener, ElementRef, inject} from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/core/auth-services/user.service';
import { ChartService } from 'src/app/core/services/chart.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { CustomPasswordValidator } from 'src/app/core/validators/password_validator';
import { PopupService } from 'src/app/core/services/popup.service';

@Component({
    selector: 'app-user-security',
    templateUrl: './user-security.component.html',
    styleUrls: ['./user-security.component.scss'],
    imports: [FormsModule, ReactiveFormsModule]
})
export class UserSecurityComponent implements OnInit {

  passwordForm!: FormGroup;
  user_id!: number;
  showPasswordRequirements = false;
  
  passwordRequirements = {
    minLength: 'Minimum 8 characters required',
    uppercase: 'At least one uppercase letter required',
    lowercase: 'At least one lowercase letter required',
    number: 'At least one number required',
    special: 'At least one special character required'
  };

  private readonly fb = inject(FormBuilder);
  private readonly userService = inject(UserService);
  private readonly chartService = inject(ChartService);
  private readonly elementRef = inject(ElementRef);
  private readonly router = inject(Router);
  private readonly loaderService = inject(LoaderService);
  private readonly popupService = inject(PopupService);

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    // Check if the click was inside the tooltip or the question icon
    const clickedInside = this.elementRef.nativeElement.querySelector('.info-icon')?.contains(event.target as Node);
    if (!clickedInside) {
      this.showPasswordRequirements = false;
    }
  }

  ngOnInit(): void {
    this.passwordForm = this.fb.group(
      {
        new_password: ['', [
          Validators.required, 
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
          
        ]],
        confirm_Password: ['', [
          Validators.required, 
          Validators.minLength(8)
        ]]
      },
      { validators: this.passwordMatchValidator }
    );

    let userData: any = sessionStorage.getItem('userInformation');
    let userInfoData = this.userService.getUser();
    this.user_id = userInfoData.user_id;
    console.log('userData', userData);
    console.log('userInfoData', userInfoData);
  }

  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('new_password')?.value;
    const confirmPassword = form.get('confirm_Password')?.value;
    return newPassword === confirmPassword ? null : { passwordMismatch: true };
  }

  getPasswordErrors(field: string): string[] {
    const control = this.passwordForm.get(field);
    const errors: string[] = [];
    
    if (control?.errors && (control.dirty || control.touched)) {
      if (control.errors['required']) {
        errors.push('This field is required');
      }
      if (control.errors['minlength']) {
        errors.push(this.passwordRequirements.minLength);
      }
      if (control.errors['pattern']) {
        const value = control.value || '';
        if (!/[A-Z]/.test(value)) {
          errors.push(this.passwordRequirements.uppercase);
        }
        if (!/[a-z]/.test(value)) {
          errors.push(this.passwordRequirements.lowercase);
        }
        if (!/\d/.test(value)) {
          errors.push(this.passwordRequirements.number);
        }
        if (!/[@$!%*?&]/.test(value)) {
          errors.push(this.passwordRequirements.special);
        }
      }
    }
    
    return errors;
  }

  shouldShowPasswordMismatch(): boolean {
    const newPassword = this.passwordForm.get('new_password')?.value;
    const confirmPassword = this.passwordForm.get('confirm_Password')?.value;
    return newPassword && confirmPassword && newPassword !== confirmPassword;
  }

  togglePasswordRequirements(event: Event) {
    event.stopPropagation(); // Prevent the document click event from firing
    this.showPasswordRequirements = !this.showPasswordRequirements;
  }

  onSubmit() {
    let formValue = this.passwordForm.value;
    console.log(formValue, this.passwordForm.valid)
    if (this.passwordForm.valid) {
      console.log('Password form values:', this.passwordForm.value);

      let newObj = {
        "confirm_Password": formValue.confirm_Password,
        "new_password": formValue.new_password
      }

      console.log(newObj);
      this.loaderService.show()

      this.chartService.ResetPassword(this.user_id, newObj).subscribe(
        (res: any) => {
        console.log('res', res);
        if (res.success) {
          this.loaderService.hide();
          this.onLogOutCLick()

          // let confirmMsg = confirm("Do you want to logout?")
          // if(confirmMsg == true){
          //   this.onLogOutCLick()

          // }
          // this.popupService.showPopup({
          //   message: res.message,
          //   statusCode: res.status_code,
          //   status: res.success
          // });
          // this.router.navigate(['/sidebar/panel/dashboardHome']);
        } else {
          alert(res.message);
        }
      },

      
      (err : any) =>{
        this.loaderService.hide();
        const errorMessage = err.error && err.error.message ? err.error.message : err.message;
        this.popupService.showPopup({
          message: errorMessage,
          statusCode: err.status,
          status: false
        });
      }
    
    );
    }
  }

  onLogOutCLick() {

    sessionStorage.clear()
    this.router.navigate(['login']);

  }

  onInputFocus(event: FocusEvent) {
    const input = event.target as HTMLInputElement;
    input.classList.add('focused');
  }

  onInputBlur(event: any) {
    const input = event.target as HTMLInputElement;
    input.classList.remove('focused');
  }
}
