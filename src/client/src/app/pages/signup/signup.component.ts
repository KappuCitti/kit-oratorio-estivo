import { Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { switchMap } from 'rxjs';
import { RegisterRequest } from '../../../models/Request.model';
import { ApiService } from '../../../services/api.service';
import { SessionService } from '../../../services/session.service';
import { UtilsService } from '../../../services/utils.service';

/**
 * Registrazione pubblica di un genitore.
 *
 * Prima `signup()` era vuoto: il pulsante non faceva nulla. Il form usava
 * `app-parent`, che raccoglie i campi dello schema v1 e non chiede il codice
 * fiscale, che per il server e' l'identificativo dell'utente e il nome con cui
 * si accede. Ora raccoglie esattamente quello che chiede POST /user/register.
 *
 * Il ruolo non si sceglie: lo decide il server. Dopo la registrazione si
 * accede subito, cosi' il genitore arriva direttamente alla propria pagina.
 */
@Component({
  selector: 'app-signup',
  imports: [FaIconComponent, ReactiveFormsModule, RouterLink],
  templateUrl: './signup.component.html',
})
export class SignupComponent {
  private fb = inject(FormBuilder);
  private api = inject(ApiService);
  private session = inject(SessionService);
  private utils = inject(UtilsService);
  private router = inject(Router);

  faArrowLeft = faArrowLeft;

  form: FormGroup;
  readonly error = signal<string | null>(null);
  readonly submitting = signal(false);

  constructor() {
    this.form = this.fb.group(
      {
        cf: [
          '',
          [
            Validators.required,
            Validators.minLength(16),
            Validators.maxLength(16),
          ],
        ],
        name: ['', [Validators.required, Validators.minLength(2)]],
        surname: ['', [Validators.required, Validators.minLength(2)]],
        // Lo stesso formato che accetta il server (phoneSchema): prefisso
        // facoltativo e dieci cifre, eventualmente separate da spazi.
        phoneNumber: [
          '',
          [
            Validators.required,
            Validators.pattern(/^(\+?\d{1,3})?\s?\d{3}\s?\d{3}\s?\d{4}$/),
          ],
        ],
        email: ['', [Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: [this.matchPasswordsValidator] }
    );
  }

  matchPasswordsValidator(control: AbstractControl): ValidationErrors | null {
    const one = control.get('password')?.value;
    const two = control.get('confirmPassword')?.value;
    return one == two ? null : { passwordsMismatch: true };
  }

  signup() {
    if (this.form.invalid || this.submitting()) return;

    const value = this.form.value;
    const cf = (value.cf as string).toUpperCase();
    const data: RegisterRequest = {
      cf,
      name: value.name,
      surname: value.surname,
      phoneNumber: value.phoneNumber,
      password: value.password,
    };
    // La stringa vuota non e' un'email valida per il server: se non c'e' non
    // si invia.
    if (value.email) data.email = value.email;

    this.submitting.set(true);
    this.error.set(null);

    this.api
      .register(data)
      .pipe(switchMap(() => this.api.login(cf, value.password)))
      .subscribe({
        next: () => {
          this.session.clear();
          this.session.load().subscribe(() => {
            this.submitting.set(false);
            this.router.navigateByUrl(this.session.landingPath());
          });
        },
        error: (error) => {
          console.error(error);
          this.submitting.set(false);
          this.error.set(this.utils.handleResponse(error, null));
        },
      });
  }
}
