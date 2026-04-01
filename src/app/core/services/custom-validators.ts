// custom-validators.ts
import { AbstractControl, ValidationErrors } from '@angular/forms';

export function passwordValidator(control: AbstractControl): ValidationErrors | null {

  const value = control.value;

  // Password should be at least 8 characters, with at least 5 letters, 1 special character, and 1 number
  const regex = /^(?=.*[A-Za-z]{5,})(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  if (!value) {
    return { required: true, message: 'Password is required' };
  }

  if (value.length < 8) {
    return { minLength: true, message: 'Password must be at least 8 characters long' };
  }

  if (!regex.test(value)) {

    console.log()
    return {
      invalidPasswordFormat: true,
      message: 'Password should have at least 5 letters, 1 uppercase letter, 1 special character, and 1 number'
    };
  }
  return null;
}

