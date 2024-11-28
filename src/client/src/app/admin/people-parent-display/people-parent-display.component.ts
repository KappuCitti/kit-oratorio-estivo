/*
 *   Copyright (c) 2024 KappuCitti.
 *   All rights reserved.
 *
 *   Licensed under the MIT License.
 *   See LICENSE file in the project root for full license information.
 */
import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Parent } from 'src/models/Enrollment.model';
import { ApiService } from 'src/services/api.service';

@Component({
  selector: 'app-people-parent-display',
  templateUrl: './people-parent-display.component.html',
  styleUrls: ['./people-parent-display.component.scss']
})
export class PeopleParentDisplayComponent implements OnChanges {
  parentForm: FormGroup;

  @Input() inputParent: Parent = {} as Parent;
  @Input() title: string = 'Genitore';
  @Output() parentChange = new EventEmitter<Parent>();
  @Output() isValid = new EventEmitter<boolean>();

  parent: Parent = {} as Parent;
  string: string = this.generateRandomString();

  constructor(private fb: FormBuilder) {
    this.parentForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(/^[a-zA-Z]+$/)]],
      surname: ['', [Validators.required, Validators.pattern(/^[a-zA-Z]+$/)]],
      gender: ['', [Validators.required, Validators.pattern(/^(M|F|Other)$/)]],
      mail: ['', [Validators.email]],
      phone: ['', []],
    });

    // Subscrive to form edit ad update parent
    this.parentForm.valueChanges.subscribe(() => {
      this.parent.name = this.parentForm.get('name')?.value;
      this.parent.surname = this.parentForm.get('surname')?.value;
      this.parent.gender = this.parentForm.get('gender')?.value;
      this.parent.email = this.parentForm.get('mail')?.value;
      this.parent.phone = this.parentForm.get('phone')?.value;
      this.parentChange.emit(this.parent);
      this.isValid.emit(this.parentForm.valid);
    });
  }

  ngOnChanges(): void {
    this.parentForm.get('name')?.setValue(this.inputParent.name);
    this.parentForm.get('surname')?.setValue(this.inputParent.surname);
    this.parentForm.get('gender')?.setValue(this.inputParent.gender);
    this.parentForm.get('mail')?.setValue(this.inputParent.email);
    this.parentForm.get('phone')?.setValue(this.inputParent.phone);
  }

  generateRandomString() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 10; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }
}
