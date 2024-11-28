/*
 *   Copyright (c) 2024 KappuCitti.
 *   All rights reserved.
 *
 *   Licensed under the MIT License.
 *   See LICENSE file in the project root for full license information.
 */
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeopleEditComponent } from './people-edit.component';

describe('PeopleEditComponent', () => {
  let component: PeopleEditComponent;
  let fixture: ComponentFixture<PeopleEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PeopleEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PeopleEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
