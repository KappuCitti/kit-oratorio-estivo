import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { ParentComponent } from '../../components/parent/parent.component';
import { Parent } from '../../../models/Family.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-signup',
  imports: [
    FaIconComponent,
    FormsModule,
    ReactiveFormsModule,
    ParentComponent,
    RouterLink,
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  faArrowLeft = faArrowLeft;

  parent: Parent | null = null;
  isParentValid: boolean = false;
  form: FormGroup;
  error: string | null = null;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group(
      {
        confirmPasswordOne: [
          '',
          [Validators.required, Validators.minLength(8)],
        ],
        confirmPasswordTwo: [
          '',
          [Validators.required, Validators.minLength(8)],
        ],
      },
      {
        validators: [this.matchPasswordsValidator, this.isParentOkValidator],
      }
    );
  }

  onParentChange(parent: Parent | null) {
    this.parent = parent;
  }

  onIsParentValidChange(isValid: boolean) {
    this.isParentValid = isValid;
    this.form.updateValueAndValidity();
  }

  isParentOkValidator = (control: AbstractControl): ValidationErrors | null => {
    return this.isParentValid ? null : { isParentValid: true };
  };

  matchPasswordsValidator(control: AbstractControl): ValidationErrors | null {
    const one = control.get('confirmPasswordOne')?.value;
    const two = control.get('confirmPasswordTwo')?.value;

    return one == two ? null : { passwordsMismatch: true };
  }

  // TODO - Implement the signup logic
  signup() {}
}
