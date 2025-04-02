import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamsSearchComponent } from './teams-search.component';

describe('TeamsSearchComponent', () => {
  let component: TeamsSearchComponent;
  let fixture: ComponentFixture<TeamsSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeamsSearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeamsSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
