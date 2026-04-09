// import { AbstractControl, ValidationErrors } from '@angular/forms';

// export function CustomPasswordValidator(control: AbstractControl): ValidationErrors | null {
//   const value = control.value;

//   if (!value) {
//     return { required: 'Password is required' };
//   }

//   // Initial error message
//   if (value.length === 0) {
//     return { initial: 'Password should have at least 5 letters, 1 uppercase letter, 1 special character, and 1 number.' };
//   }

//   if (value.length < 8) {
//     return { minLength: 'Password must be at least 8 characters long.' };
//   }
//   if (!/[A-Z]/.test(value)) {
//     return { uppercase: 'Password must contain at least one uppercase letter.' };
//   }
//   if (!/\d/.test(value)) {
//     return { number: 'Password must contain at least one number.' };
//   }
//   if (!/[@$!%*?&]/.test(value)) {
//     return { specialCharacter: 'Password must contain at least one special character (@$!%*?&).' };
//   }
//   if (!/[A-Za-z]{5,}/.test(value)) {
//     return { letterCount: 'Password must contain at least 5 letters.' };
//   }

//   return null; // No errors, valid password
// }

import { AbstractControl, ValidationErrors } from '@angular/forms';

export function CustomPasswordValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;

  if (!value) {
    return { error: 'Password is required.' };
  }

  const isValidLength = value.length >= 8;
  const hasUppercase = /[A-Z]/.test(value);
  const hasSpecialChar = /[@$!%*?&]/.test(value);

  if (!isValidLength || !hasUppercase || !hasSpecialChar) {
    return { 
      error: 'Password must be at least 8 characters long and include at least 1 uppercase letter and 1 special character .' 
    };
  }

  return null; // Password meets all criteria
}
