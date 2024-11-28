/*
 *   Copyright (c) 2024 KappuCitti.
 *   All rights reserved.
 *
 *   Licensed under the MIT License.
 *   See LICENSE file in the project root for full license information.
 */
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendancesMovementsComponent } from './attendances-movements.component';

describe('AttendancesMovementsComponent', () => {
  let component: AttendancesMovementsComponent;
  let fixture: ComponentFixture<AttendancesMovementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttendancesMovementsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttendancesMovementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
