import { AbstractControl, ValidationErrors } from '@angular/forms';

export function passwordMatchValidator(
  form: AbstractControl
): ValidationErrors | null {
  const password = form.get('password');
  const confirmPassword = form.get('confirmPassword');

  if (!password || !confirmPassword) return null;

  if (password.value !== confirmPassword.value) {
    if (password.errors?.['required'] || password.errors?.['minlength'])
      return null;

    if (
      confirmPassword.errors?.['required'] ||
      confirmPassword.errors?.['minlength']
    )
      return null;

    password.setErrors({ passwordsDoNotMatch: true });
    confirmPassword.setErrors({ passwordsDoNotMatch: true });
    return { passwordsDoNotMatch: true };
  }

  deletePasswordDoNotMatchError(password);
  deletePasswordDoNotMatchError(confirmPassword);
  return null;
}

function deletePasswordDoNotMatchError(control: AbstractControl) {
  if (control.errors && control.errors['passwordsDoNotMatch']) {
    const errors = control.errors;
    delete errors['passwordsDoNotMatch'];
    control.setErrors(Object.keys(errors).length > 0 ? errors : null);
  }
}
