import { Component } from '@angular/core';
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
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  faArrowLeft = faArrowLeft;

  form: FormGroup;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private utils: UtilsService
  ) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });

    this.form.valueChanges.subscribe((value) => {});
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
    if (this.error) this.error = null;
    this.error = this.utils.handleResponse(response, '/admin');
  }
}
