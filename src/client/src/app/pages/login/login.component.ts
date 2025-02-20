import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { HttpResponse } from '@angular/common/http';
import { RouterLink } from '@angular/router';

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

  constructor(private fb: FormBuilder, private api: ApiService) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });

    this.form.valueChanges.subscribe((value) => {
      console.log(value);
    });
  }

  login(): void {
    this.error = null;
    this.api
      .login(this.form.value.username, this.form.value.password)
      .subscribe((response) => {
        console.log(response);
        // this.handleResponse(response);
      });
  }

  handleResponse(response: HttpResponse<any>): void {
    switch (response.status) {
      case 200:
        window.location.href = '/admin';
        break;
      case 401:
        this.error = 'Username o password errati!';
        break;
      case 403:
        this.error = "L'utente non ha i permessi necessari!";
        break;
      case 500:
      default:
        this.error = 'Si è verificato un errore, riprova più tardi!';
        break;
    }
  }
}
