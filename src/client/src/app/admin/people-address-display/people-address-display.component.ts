/*
 *   Copyright (c) 2024 KappuCitti.
 *   All rights reserved.
 *
 *   Licensed under the MIT License.
 *   See LICENSE file in the project root for full license information.
 */
import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Address } from 'src/models/Enrollment.model';

@Component({
  selector: 'app-people-address-display',
  templateUrl: './people-address-display.component.html',
  styleUrls: ['./people-address-display.component.scss']
})
export class PeopleAddressDisplayComponent implements OnInit, OnChanges {
  addressForm: FormGroup;
  @Input() inputAddress: Address = {} as Address;
  @Input() title: string = 'Indirizzo';
  @Output() addressChange = new EventEmitter<Address>();
  @Output() isValid = new EventEmitter<boolean>();

  address: Address = {} as Address;

  constructor(private fb: FormBuilder) {
    this.addressForm = this.fb.group({
      city: ['', Validators.required],
      street: ['', Validators.required],
      zip: ['', [Validators.required, Validators.pattern(/^[0-9]{5}$/)]],
      country: ['Italia', Validators.required]
    });

    // Subscrive to form edit ad update parent
    this.addressForm.valueChanges.subscribe(() => {
      this.address.city = this.addressForm.get('city')?.value;
      this.address.street = this.addressForm.get('street')?.value;
      this.address.zip = this.addressForm.get('zip')?.value;
      this.address.country = this.addressForm.get('country')?.value;
      this.addressChange.emit(this.address);
      this.isValid.emit(this.addressForm.valid);
    });
  }

  ngOnInit(): void {
    // Emit defialt values
    this.address.city = this.addressForm.get('city')?.value;
    this.address.street = this.addressForm.get('street')?.value;
    this.address.zip = this.addressForm.get('zip')?.value;
    this.address.country = this.addressForm.get('country')?.value;
    this.addressChange.emit(this.address);

    this.isValid.emit(this.addressForm.valid);
  }

  ngOnChanges(): void {
    this.addressForm.get('city')?.setValue(this.inputAddress.city);
    this.addressForm.get('street')?.setValue(this.inputAddress.street);
    this.addressForm.get('zip')?.setValue(this.inputAddress.zip);
    this.addressForm.get('country')?.setValue(this.inputAddress.country);
  }
}
