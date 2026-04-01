import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ChartService } from 'src/app/core/services/chart.service';
import { passwordValidator } from 'src/app/core/services/custom-validators';
import { CustomPasswordValidator } from 'src/app/core/services/password_validator';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.scss']
})
export class UpdateUserComponent implements OnInit {

  userName! : string;
  registrationForm!: FormGroup;
  rolesObjArr :any = []
  editColumnObjIndex: any;
  constructor(private route : ActivatedRoute, private router : Router, private chartService : ChartService, private formBuilder: FormBuilder, ) { }

  ngOnInit(): void {
    
    this.registrationForm = this.formBuilder.group({
      current_password: ['', [Validators.required, Validators.minLength(8), CustomPasswordValidator]],
      new_password: ['', [Validators.required, Validators.minLength(8), CustomPasswordValidator]],
    });

     this.route.params.subscribe((param : Params) =>{
      console.log('param in user', param);
      this.userName = param['username'];

      console.log('data in user', this.userName);

      this.chartService.getUserDetailByUsername(this.userName).subscribe((res : any) =>{
        console.log(res);
        let data = res['data'];
        console.log(data);
        this.editColumnObjIndex = data.user_id
        let roleObject : any ;
        // this.chartService.getRoleDetailsByRolename(data.role).subscribe((res : any) => {
        //   console.log('res role', res);
        //   roleObject = res['data'];
          
        //   this.registrationForm.patchValue({
        //     username: data.username,
        //     firstName: data.first_name,
        //     lastName: data.last_name,   
        //     role: roleObject.id,   
        //     email: data.email,
        //     password: data.password,
        //     // password: ['', [Validators.required, Validators.minLength(6)]],
        //     confirmPassword: data.password
        //   })
        // })

        // let roleObj = this.rolesObjArr.find((ele : any) => ele.role === data.role);




      })

    })

    // this.chartService.getAllActiveRoleDetails().subscribe((res : any) =>{
    //   let data = res['data'];
    //   this.rolesObjArr = data;
    //   // console.log(this.rolesObjArr)
    //   // this.rolesArray = data.map((ele : any) => ele.role)
    //   // console.log(data, 'data', 'res', this.rolesArray)
    //   // this.rolesArray = data.role
    // })


  }
  onInputFocus(event: FocusEvent) {
    const input = event.target as HTMLInputElement;
    input.classList.add('focused');
  }

  onInputBlur(event: any) {
    const input = event.target as HTMLInputElement;
    input.classList.remove('focused');
  }
  onUpdate(){
    const updatedObj = this.registrationForm.value;
    console.log(this.editColumnObjIndex);
    console.log('updatedObj', updatedObj, this.registrationForm.valid)

    if(this.registrationForm.valid){

      let newObj ={
        "current_password": updatedObj.current_password,
        "new_password":updatedObj.new_password
        }

      console.log(newObj)

      this.chartService.ResetPassword(this.editColumnObjIndex, newObj).subscribe((res : any) =>{
        console.log('res', res)
        if(res.success){
          this.router.navigate(['/sidebar/panel/dashboardHome']);
        }else{
          alert(res.message)
        }
      })

    }

  }
}
