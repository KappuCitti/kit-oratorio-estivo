import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamViewComponent } from './team-view.component';

describe('TeamViewComponent', () => {
  let component: TeamViewComponent;
  let fixture: ComponentFixture<TeamViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeamViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeamViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
