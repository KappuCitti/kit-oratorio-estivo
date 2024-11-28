/*
 *   Copyright (c) 2024 KappuCitti.
 *   All rights reserved.
 *
 *   Licensed under the MIT License.
 *   See LICENSE file in the project root for full license information.
 */
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageUnauthorizedComponent } from './page-unauthorized.component';

describe('PageUnauthorizedComponent', () => {
  let component: PageUnauthorizedComponent;
  let fixture: ComponentFixture<PageUnauthorizedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageUnauthorizedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageUnauthorizedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
