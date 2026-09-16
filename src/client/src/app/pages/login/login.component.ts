import { HttpResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { ApiService } from '../../../services/api.service';
import { SessionService } from '../../../services/session.service';
import { UtilsService } from '../../../services/utils.service';

@Component({
  selector: 'app-login',
  imports: [FontAwesomeModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private api = inject(ApiService);
  private utils = inject(UtilsService);
  private session = inject(SessionService);
  private router = inject(Router);

  faArrowLeft = faArrowLeft;

  form: FormGroup;
  readonly error = signal<string | null>(null);

  constructor() {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  login(): void {
    this.api
      .login(this.form.value.username, this.form.value.password)
      .subscribe({
        next: (response) => {
          if (response.status === 200) return this.onLoggedIn();
          this.error.set(this.utils.handleResponse(response, null));
        },
        error: (error) => {
          console.error(error);
          this.error.set(this.utils.handleResponse(error, null));
        },
      });
  }

  /**
   * Dopo il login la destinazione dipende dai permessi dell'utente.
   *
   * Prima si faceva `window.location.href = '/user'` per chiunque: un
   * amministratore finiva nell'area utente, e ci arrivava ricaricando l'intera
   * applicazione invece di navigare. Ora si chiede al server chi e' l'utente e
   * si va dove quei permessi consentono di stare.
   */
  private onLoggedIn(): void {
    // La sessione precedente va scartata, altrimenti resterebbe in memoria
    // quella di chi si era collegato prima su questo browser.
    this.session.clear();
    this.session
      .load()
      .subscribe(() => this.router.navigateByUrl(this.session.landingPath()));
  }
}
