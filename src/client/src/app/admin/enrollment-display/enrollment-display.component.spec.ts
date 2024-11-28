/*
 *   Copyright (c) 2024 KappuCitti.
 *   All rights reserved.
 *
 *   Licensed under the MIT License.
 *   See LICENSE file in the project root for full license information.
 */
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrollmentDisplayComponent } from './enrollment-display.component';

describe('EnrollmentDisplayComponent', () => {
  let component: EnrollmentDisplayComponent;
  let fixture: ComponentFixture<EnrollmentDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnrollmentDisplayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnrollmentDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
