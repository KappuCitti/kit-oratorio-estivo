/*
 *   Copyright (c) 2024 KappuCitti.
 *   All rights reserved.
 *
 *   Licensed under the MIT License.
 *   See LICENSE file in the project root for full license information.
 */
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrollmentComponent } from './enrollment.component';

describe('EnrollmentComponent', () => {
  let component: EnrollmentComponent;
  let fixture: ComponentFixture<EnrollmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnrollmentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnrollmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
