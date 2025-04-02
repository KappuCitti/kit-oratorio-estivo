import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendancesSearchComponent } from './attendances-search.component';

describe('AttendancesSearchComponent', () => {
  let component: AttendancesSearchComponent;
  let fixture: ComponentFixture<AttendancesSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttendancesSearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttendancesSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
