import { Component, inject, signal } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { HttpResponse } from '@angular/common/http';
import { RouterLink } from '@angular/router';
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
          this.handleResponse(response);
        },
        error: (error) => {
          console.error(error);
          this.handleResponse(error);
        },
      });
  }

  handleResponse(response: HttpResponse<any>): void {
    this.error.set(this.utils.handleResponse(response, '/user'));
  }
}
