/*
 *   Copyright (c) 2024 KappuCitti.
 *   All rights reserved.
 *
 *   Licensed under the MIT License.
 *   See LICENSE file in the project root for full license information.
 */
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeopleParentDisplayComponent } from './people-parent-display.component';

describe('PeopleParentDisplayComponent', () => {
  let component: PeopleParentDisplayComponent;
  let fixture: ComponentFixture<PeopleParentDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PeopleParentDisplayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PeopleParentDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
