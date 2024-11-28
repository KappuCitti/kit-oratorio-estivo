/*
 *   Copyright (c) 2024 KappuCitti.
 *   All rights reserved.
 *
 *   Licensed under the MIT License.
 *   See LICENSE file in the project root for full license information.
 */
import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Child } from 'src/models/Enrollment.model';

@Component({
  selector: 'app-people-child-display',
  templateUrl: './people-child-display.component.html',
  styleUrls: ['./people-child-display.component.scss']
})
export class PeopleChildDisplayComponent implements OnInit, OnChanges {
  childForm: FormGroup;

  @Input() inputChild: Child = {} as Child;
  @Input() title: string = 'Ragazzo';
  @Input() isReadOnly: boolean = false;
  @Output() childChange = new EventEmitter<Child>();
  @Output() isValid = new EventEmitter<boolean>();

  child: Child = {} as Child;

  constructor(private fb: FormBuilder) {
    this.childForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(/^[a-zA-Z]+$/)]],
      surname: ['', [Validators.required, Validators.pattern(/^[a-zA-Z]+$/)]],
      gender: ['', [Validators.required, Validators.pattern(/^(M|F|Other)$/)]],
      birthdate: ['', [Validators.required]],
      birthplace: ['', [Validators.required]],
    });

    // Subscrive to form edit ad update parent
    this.childForm.valueChanges.subscribe(() => {
      this.child.name = this.childForm.get('name')?.value;
      this.child.surname = this.childForm.get('surname')?.value;
      this.child.gender = this.childForm.get('gender')?.value;
      this.child.birthDate = this.childForm.get('birthdate')?.value;
      this.child.birthPlace = this.childForm.get('birthplace')?.value;
      this.childChange.emit(this.child);
      this.isValid.emit(this.childForm.valid);
    });
  }

  ngOnInit(): void {
    // Emit defialt values
    this.child.name = this.childForm.get('name')?.value;
    this.child.surname = this.childForm.get('surname')?.value;
    this.child.gender = this.childForm.get('gender')?.value;
    this.child.birthDate = this.childForm.get('birthdate')?.value;
    this.child.birthPlace = this.childForm.get('birthplace')?.value;
    this.childChange.emit(this.child);

    if (this.isReadOnly) {
      this.childForm.disable();
    }
  }

  ngOnChanges(): void {
    this.childForm.get('name')?.setValue(this.inputChild.name);
    this.childForm.get('surname')?.setValue(this.inputChild.surname);
    this.childForm.get('gender')?.setValue(this.inputChild.gender);
    this.childForm.get('birthdate')?.setValue(new Date(this.inputChild.birthDate).toLocaleDateString('en-CA'));
    this.childForm.get('birthplace')?.setValue(this.inputChild.birthPlace);
  }

}
