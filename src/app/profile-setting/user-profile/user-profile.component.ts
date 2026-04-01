import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/core/AuthServices/user.service';
import { ChartService } from 'src/app/core/services/chart.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { PopupService } from 'src/app/core/services/popup.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  profileForm!: FormGroup;
  userEmail: string = 'alexarawles@gmail.com';
  profileImage: string = 'https://winaero.com/blog/wp-content/uploads/2018/08/Windows-10-user-icon-big.png';
  backgroundImage: string = 'https://images.unsplash.com/photo-1506383796573-caf02b4a79ab';
  username: string = 'Amanda';
  currentDate: string = 'Tue, 07 June 2022';
  isEditMode: boolean = false;
  user_id !: number;

  // Mock user data - replace with actual API data
  userData = {
    username: '',
    first_name: '',
    last_name: '',
    role: '',
    email: ''
  };

  constructor(private http: HttpClient, private fb: FormBuilder, private userService: UserService, private chartService: ChartService, private loaderService: LoaderService, private popupService : PopupService) {
    this.initializeForm();
  }

  ngOnInit(): void {


    this.loaderService.show()

    let userInfoData = this.userService.getUser();
    console.log('userInfoData', userInfoData);
    this.user_id = userInfoData.user_id;
   

    this.chartService.getUserDetailsById(userInfoData.user_id).subscribe((res: any) => {
      console.log('res', res);
      if (res.success) {
        this.userData = res.data;
        this.patchFormValues();
      } else {
        alert(res.message);
      }
  })
 

  }

  private initializeForm() {
    this.profileForm = this.fb.group({
      username: [{ value: '', disabled: true }],
      first_name: [{ value: '', disabled: true }, [Validators.required]],
      last_name: [{ value: '', disabled: true }, [Validators.required]],
      role: [{ value: '', disabled: true }],
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]]
    });
  }

  private patchFormValues() {
    this.profileForm.patchValue(this.userData);
  }

  toggleEditMode() {
    this.isEditMode = !this.isEditMode;
    
    if (this.isEditMode) {
      Object.keys(this.profileForm.controls).forEach(key => {
        const control = this.profileForm.get(key);
        if (control && key !== 'username' && key !== 'role') { // Keep email always disabled
          control.enable();
        }
      });
    } else {
      Object.keys(this.profileForm.controls).forEach(key => {
        const control = this.profileForm.get(key);
        if (control) {
          control.disable();
        }
      });
    }
  }

  onSubmit() {
    if (this.profileForm.invalid) {
      // Mark all fields as touched to show validation errors
      Object.keys(this.profileForm.controls).forEach(key => {
        const control = this.profileForm.get(key);
        if (control) {
          control.markAsTouched();
        }
      });
      return;
    }

    this.loaderService.show()
    
    this.chartService.getRoleDetailsByRolename(this.userData.role).subscribe((res: any) => {
      console.log(res);
      let data = res['data'];
      let roleId = data.id;

      // Get form values and filter out empty fields
      const formValues = this.profileForm.getRawValue();
      const updatedValues = Object.entries(formValues).reduce((acc, [key, value]) => {
        if (value !== '') {
          acc[key] = value;
        }
        return acc;
      }, {} as any);

      let obj = {
        ...updatedValues,
        is_active: true,
        role_id: roleId,
        password: null,
      }

      console.log('obj', obj);

      this.chartService.updateUserById(this.user_id, obj).subscribe(
        (res: any) => {
          console.log(res);
          this.loaderService.hide()
          this.popupService.showPopup({
            message: res.message,
            statusCode: res.status_code,
            status: res.success
          });
        },
        (err: any) => {
          const errorMessage = err.error && err.error.message ? err.error.message : err.message;
          this.popupService.showPopup({
            message: errorMessage,
            statusCode: err.status,
            status: false
          });
        }
      )

      // Disable edit mode
      this.toggleEditMode();
    })
  }

  onProfileImageChange(event: any) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profileImage = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onBackgroundImageChange(event: any) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.backgroundImage = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
}
