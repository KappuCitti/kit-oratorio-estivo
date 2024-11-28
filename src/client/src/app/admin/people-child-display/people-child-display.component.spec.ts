/*
 *   Copyright (c) 2024 KappuCitti.
 *   All rights reserved.
 *
 *   Licensed under the MIT License.
 *   See LICENSE file in the project root for full license information.
 */
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeopleChildDisplayComponent } from './people-child-display.component';

describe('PeopleChildDisplayComponent', () => {
  let component: PeopleChildDisplayComponent;
  let fixture: ComponentFixture<PeopleChildDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PeopleChildDisplayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PeopleChildDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
