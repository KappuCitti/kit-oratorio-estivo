/*
 *   Copyright (c) 2024 KappuCitti.
 *   All rights reserved.
 *
 *   Licensed under the MIT License.
 *   See LICENSE file in the project root for full license information.
 */
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaderboardRanksComponent } from './leaderboard-ranks.component';

describe('LeaderboardRanksComponent', () => {
  let component: LeaderboardRanksComponent;
  let fixture: ComponentFixture<LeaderboardRanksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeaderboardRanksComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeaderboardRanksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
