import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeopleCreateComponent } from './people-create.component';

describe('PeopleCreateComponent', () => {
  let component: PeopleCreateComponent;
  let fixture: ComponentFixture<PeopleCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PeopleCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PeopleCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
