import { Component, OnInit, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { FooterComponent } from '../../../components/footer/footer.component';
import { NavbarComponent } from '../../../components/navbar/navbar.component';
import { ThemeService } from '../../../../services/theme.service';
import { ApiService } from '../../../../services/api.service';
import User from '../../../../models/User.model';
import { LoadingComponent } from '../../../components/loading/loading.component';
import { UtilsService } from '../../../../services/utils.service';

@Component({
  selector: 'app-my',
  imports: [
    ReactiveFormsModule,
    FooterComponent,
    NavbarComponent,
    LoadingComponent,
  ],
  templateUrl: './my.component.html',
  styleUrl: './my.component.css',
})
export class MyComponent implements OnInit {
  user!: User;

  dataForm: FormGroup;
  passwordForm: FormGroup;

  error: string | null = null;

  isPasswordFieldOpened = signal(false); // Signal per gestire lo stato di apertura del details
  isPasswordFormValid = signal(false); // Signal per lo stato della validità del form
  isPasswordFormEmpty = signal(true); // Signal per lo stato di vuotezza dei campi del form

  constructor(
    private fb: FormBuilder,
    private theme: ThemeService,
    private api: ApiService,
    private utils: UtilsService
  ) {
    this.dataForm = this.fb.group({
      surname: [{ value: '', disabled: true }, Validators.required],
      name: [{ value: '', disabled: true }, Validators.required],
      email: [
        { value: '', disabled: true },
        [Validators.required, Validators.email],
      ],
      theme: ['System', Validators.required],
    });

    this.passwordForm = this.fb.group(
      {
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPasswordOne: [
          '',
          [Validators.required, Validators.minLength(8)],
        ],
        confirmPasswordTwo: [
          '',
          [Validators.required, Validators.minLength(8)],
        ],
      },
      { validators: this.matchPasswordsValidator }
    );
  }

  ngOnInit(): void {
    this.api.getUser().subscribe((response) => {
      if (response.status === 200 && response.body?.data) {
        this.user = response.body?.data;

        this.dataForm.patchValue(this.user);
      }
    });

    this.passwordForm.valueChanges.subscribe(() => {
      this.isPasswordFormValid.set(this.passwordForm.valid);

      const password = this.passwordForm.get('password')?.value;
      const one = this.passwordForm.get('confirmPasswordOne')?.value;
      const two = this.passwordForm.get('confirmPasswordTwo')?.value;
      this.isPasswordFormEmpty.set(!password && !one && !two);
    });
  }

  onChangeTheme(): void {
    const selected = this.dataForm.get('theme')?.value;
    this.theme.updateCookieAndSetTheme(selected);
  }

  onSubmit(): void {
    if (this.passwordForm.valid) {
      this.error = null;

      this.api
        .setUserPassword(
          this.passwordForm.get('password')?.value,
          this.passwordForm.get('confirmPasswordOne')?.value
        )
        .subscribe({
          next: (response) => {
            if (response.status === 200) {
              this.onResetPasswordForm();
            }
          },
          error: (error) => {
            this.error = this.utils.handleResponse(error, null);
          },
        });
    }
  }

  onResetPasswordForm(): void {
    this.error = null;

    this.passwordForm.reset();
    this.isPasswordFieldOpened.set(false);
    document.querySelector('details')?.removeAttribute('open');
  }

  matchPasswordsValidator(control: AbstractControl): ValidationErrors | null {
    const one = control.get('confirmPasswordOne')?.value;
    const two = control.get('confirmPasswordTwo')?.value;

    return one == two ? null : { passwordsMismatch: true };
  }
}
