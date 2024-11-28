/*
 *   Copyright (c) 2024 KappuCitti.
 *   All rights reserved.
 *
 *   Licensed under the MIT License.
 *   See LICENSE file in the project root for full license information.
 */
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrollmentEditComponent } from './enrollment-edit.component';

describe('EnrollmentEditComponent', () => {
  let component: EnrollmentEditComponent;
  let fixture: ComponentFixture<EnrollmentEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnrollmentEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnrollmentEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
