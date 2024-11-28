/*
 *   Copyright (c) 2024 KappuCitti.
 *   All rights reserved.
 *
 *   Licensed under the MIT License.
 *   See LICENSE file in the project root for full license information.
 */
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeopleAddressDisplayComponent } from './people-address-display.component';

describe('PeopleAddressDisplayComponent', () => {
  let component: PeopleAddressDisplayComponent;
  let fixture: ComponentFixture<PeopleAddressDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PeopleAddressDisplayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PeopleAddressDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
