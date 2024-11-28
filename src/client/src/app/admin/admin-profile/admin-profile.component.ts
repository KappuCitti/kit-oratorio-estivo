/*
 *   Copyright (c) 2024 KappuCitti.
 *   All rights reserved.
 *
 *   Licensed under the MIT License.
 *   See LICENSE file in the project root for full license information.
 */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import User from 'src/models/User.model';
import { ApiService } from 'src/services/api.service';

@Component({
  selector: 'app-admin-profile',
  templateUrl: './admin-profile.component.html',
  styleUrls: ['./admin-profile.component.scss']
})
export class AdminProfileComponent implements OnInit {
  user: User | null = null;

  updatePasswordNeeded: boolean = false;
  profileForm: FormGroup;
  passwordForm: FormGroup;

  constructor(private api: ApiService, private fb: FormBuilder) {
    this.profileForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(/^[a-zA-Z]+$/)]],
      surname: ['', [Validators.required, Validators.pattern(/^[a-zA-Z]+$/)]],
      email: ['', [Validators.email]],
      theme: ['', [Validators.required]],
    });

    this.passwordForm = this.fb.group({
      oldPassword: ['', [Validators.required, Validators.minLength(8)]],
      newPassword: ['', []],
      confirmPassword: ['', []],
    });

    // Update validation
    this.passwordForm.valueChanges.subscribe(() => {
      this.isPasswordFormValid();
    });
  }

  ngOnInit(): void {
    this.api.getUser().subscribe(data => {
      if (data.body) {
        this.user = data.body?.data || null;

        this.profileForm.patchValue({
          name: this.user?.name,
          surname: this.user?.surname,
          email: this.user?.email,
          theme: this.user?.theme
        })
      }
    })
  }

  setUpdatePasswordNeeded(updatePasswordNeeded: boolean) {
    this.updatePasswordNeeded = updatePasswordNeeded;
  }

  isPasswordFormValid() {
    if (!this.updatePasswordNeeded) {
      return (
        this.passwordForm.valid
      );
    } else {
      return (
        this.passwordForm.valid &&
        this.passwordForm.get('newPassword')?.value === this.passwordForm.get('confirmPassword')?.value &&
        this.passwordForm.get('newPassword')?.value?.length >= 8
      );
    }
  }

  update() {
    if (this.updatePasswordNeeded) {
      this.updatePassword();
    } else {
      this.updateData();
    }

    this.passwordForm.reset();
  }

  updateData() {
    if (this.user?.id)
      this.api.updateUserData(this.user?.id.toString(), this.passwordForm.get('oldPassword')?.value, this.profileForm.get('name')?.value, this.profileForm.get('surname')?.value, this.profileForm.get('email')?.value, this.profileForm.get('theme')?.value).subscribe(data => {
        if (data.body) {
          window.location.reload();
        }
      })
  }

  updatePassword() {
    if (this.user?.id)
      this.api.updateUserPassword(this.user?.id.toString(), this.passwordForm.get('oldPassword')?.value, this.passwordForm.get('newPassword')?.value).subscribe(data => {
        if (data.body) {
          window.location.reload();
        }
      })
  }
}