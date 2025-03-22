import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrollmentsEditComponent } from './enrollments-edit.component';

describe('EnrollmentsEditComponent', () => {
  let component: EnrollmentsEditComponent;
  let fixture: ComponentFixture<EnrollmentsEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnrollmentsEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnrollmentsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
