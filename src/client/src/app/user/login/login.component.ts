/*
 *   Copyright (c) 2024 KappuCitti.
 *   All rights reserved.
 *
 *   Licensed under the MIT License.
 *   See LICENSE file in the project root for full license information.
 */
import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/services/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  errorMessage: string = '';

  constructor(private api: ApiService, private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.pattern(/^[a-zA-Z]+\.[a-zA-Z]+$/)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    })
  }

  ngOnInit(): void {
  }

  login() {
    this.errorMessage = '';
    this.api.login(this.loginForm.value.username, this.loginForm.value.password).subscribe({
      next: (data) => {
        this.addError(data);
      },

      error: (err) => {
        this.addError(err);
      }
    })
  }

  addError(data: HttpResponse<any>) {
    switch (data.status) {
      case 200:
        this.errorMessage = '';
        window.location.href = "/admin";
        break;
      case 401:
        this.errorMessage = "L'username o la password sono errati!";
        break;
      case 403:
        this.errorMessage = "L'utente non ha i permessi necessari!";
        break;
      case 500:
      default:
        this.errorMessage = 'Si è verificato un errore, riprova più tardi!';
        break;
    }
  }
}
