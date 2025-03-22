import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrollmentsCreateComponent } from './enrollments-create.component';

describe('EnrollmentsCreateComponent', () => {
  let component: EnrollmentsCreateComponent;
  let fixture: ComponentFixture<EnrollmentsCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnrollmentsCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnrollmentsCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
