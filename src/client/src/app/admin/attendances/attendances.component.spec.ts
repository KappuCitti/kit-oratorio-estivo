/*
 *   Copyright (c) 2024 KappuCitti.
 *   All rights reserved.
 *
 *   Licensed under the MIT License.
 *   See LICENSE file in the project root for full license information.
 */
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendancesComponent } from './attendances.component';

describe('AttendancesComponent', () => {
  let component: AttendancesComponent;
  let fixture: ComponentFixture<AttendancesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttendancesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttendancesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
