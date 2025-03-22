import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrollmentsSearchComponent } from './enrollments-search.component';

describe('EnrollmentsSearchComponent', () => {
  let component: EnrollmentsSearchComponent;
  let fixture: ComponentFixture<EnrollmentsSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnrollmentsSearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnrollmentsSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
