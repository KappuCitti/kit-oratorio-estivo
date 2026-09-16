import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { NavbarComponent } from '../../../components/navbar/navbar.component';
import { FooterComponent } from '../../../components/footer/footer.component';
import { ApiService } from '../../../../services/api.service';
import { ActivatedRoute } from '@angular/router';
import { UtilsService } from '../../../../services/utils.service';
import Enrollment from '../../../../models/Enrollment.model';
import { ChildComponent } from '../../../components/child/child.component';
import { ParentComponent } from '../../../components/parent/parent.component';
import { Child, ChildSearch, Parent } from '../../../../models/Family.model';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  faCalendar,
  faClipboardCheck,
  faIdCardClip,
  faInfo,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgClass, DatePipe } from '@angular/common';
import { EnrollmentComponent } from '../../../components/enrollment/enrollment.component';
import { EnrollmentCreateRequest } from '../../../../models/Request.model';
import { PaginationComponent } from '../../../components/pagination/pagination.component';

/**
 * Steps description:
 * 0: Choose new or existing enrollment
 * 1: Create new family tree
 * 2: Choose existing child
 * 3: Choose year
 * 4: Create enrollment
 * 5: Confirm data
 */

@Component({
  selector: 'app-enrollments-create',
  imports: [
    NavbarComponent,
    FooterComponent,
    ChildComponent,
    ParentComponent,
    FormsModule,
    FontAwesomeModule,
    EnrollmentComponent,
    ReactiveFormsModule,
    PaginationComponent,
    DatePipe,
    NgClass
],
  templateUrl: './enrollments-create.component.html',
})
export class EnrollmentsCreateComponent implements OnInit {
  private api = inject(ApiService);
  private route = inject(ActivatedRoute);
  private utils = inject(UtilsService);
  private fb = inject(FormBuilder);

  faInfo = faInfo;
  faUsers = faUsers;
  faCalendar = faCalendar;
  faIdCardClip = faIdCardClip;
  faClipboardCheck = faClipboardCheck;

  readonly existing = signal(false);
  readonly step = signal(0);
  readonly maxStep = signal(0);

  readonly elements = signal(0);
  page: number = 1;
  size: number = 25;

  searchForm: FormGroup;
  readonly childs = signal<ChildSearch[]>([]);

  readonly child = signal<Child | null>(null);
  readonly parentOne = signal<Parent | null>(null);
  readonly parentTwo = signal<Parent | null>(null);
  readonly enrollment = signal<EnrollmentCreateRequest>(
    {} as EnrollmentCreateRequest
  );

  private readonly isChildValid = signal(false);
  private readonly isParentOneValid = signal(false);
  private readonly isParentTwoValid = signal(false);
  private isEnrollmentValid: boolean = false;

  readonly error = signal<string | null>(null);
  readonly loading = signal(true);

  readonly isFamilyFormValid = computed(
    () =>
      this.isChildValid() && this.isParentOneValid() && this.isParentTwoValid()
  );

  constructor() {
    this.searchForm = this.fb.group({
      query: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.pattern(/^[a-zA-Z0-9\s]*$/),
        ],
      ],
    });

    this.searchForm.valueChanges.subscribe(() => {
      if (this.searchForm.valid || this.searchForm.value.query.length == 0) {
        this.loadChilds();
      }
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      const existing = params['existing'];
      const id = params['child'];
      const year = params['year'];

      console.table({ existing, id, year });
      this.existing.set(existing == 'true');

      if (existing == 'false') {
        this.step.set(1);
      } else if (existing == 'true') {
        this.loadChilds();
      }

      if (year) {
        if (this.checkIfYearIsValid(year)) this.patchEnrollment({ year });
      } else {
        this.patchEnrollment({ year: new Date().getFullYear() });
      }

      if (id) {
        this.patchEnrollment({ child: id });
        this.step.set(3);
      }
    });
  }

  // `enrollment` e' un signal: va sostituito, non modificato sul posto.
  private patchEnrollment(changes: Partial<EnrollmentCreateRequest>) {
    this.enrollment.update((enrollment) => ({ ...enrollment, ...changes }));
  }

  createFromExistingEnrollment(existing: boolean) {
    this.existing.set(existing);
    if (!existing) {
      this.step.set(1);
    } else {
      this.loadChilds();
    }

    this.maxStep.set(1);
  }

  loadChilds() {
    this.loading.set(true);
    this.api.getChilds({ query: this.searchForm.value.query }).subscribe({
      next: (response) => {
        if (response.status === 200 && response.body?.success) {
          this.childs.set(response.body.data.elements);
          this.elements.set(response.body.data.count);

          this.step.set(2);
          this.maxStep.set(this.enrollment().child ? 3 : 2);

          this.loading.set(false);
        }
      },
      error: (error) => {
        console.error(error);
        this.error.set(this.utils.handleResponse(error, null));
        this.loading.set(false);
      },
    });
  }

  onChildChange(updated: Child | null) {
    this.child.set(updated ? { ...updated } : null);
  }

  onIsChildValidChange(valid: boolean) {
    this.isChildValid.set(valid);
    this.checkIfNewFamilyIsValid();
  }

  getChildInfo(): string {
    const child = this.child();
    if (child) {
      return `${child.name} ${child.surname}`;
    }

    const selected = this.childs().filter(
      (c) => c.id == this.enrollment().child
    )[0];
    return selected ? `${selected.name} ${selected.surname}` : '';
  }

  onParentChange(parent: Parent | null, index: number) {
    if (index == 1) {
      this.parentOne.set(parent);
    } else if (index == 2) {
      this.parentTwo.set(parent);
    }
  }

  onIsParentValidChange(valid: boolean, index: number) {
    if (index == 1) {
      this.isParentOneValid.set(valid);
    } else {
      this.isParentTwoValid.set(valid);
    }
    this.checkIfNewFamilyIsValid();
  }

  checkIfNewFamilyIsValid() {
    if (this.isFamilyFormValid()) {
      this.maxStep.set(
        this.checkIfYearIsValid(this.enrollment().year) ? 4 : 3
      );
    }
  }

  checkIfYearIsValid(year: number) {
    return year && year > 1980;
  }

  onSelectedChildChange(id: string | number) {
    this.patchEnrollment({ child: parseInt(id.toString()) });
    this.maxStep.set(this.checkIfYearIsValid(this.enrollment().year) ? 4 : 3);
  }

  onYearChange(year: number) {
    if (this.checkIfYearIsValid(year)) {
      this.patchEnrollment({ year });
      this.maxStep.set(4);
    }
  }

  onEnrollmentChange(enrollment: Enrollment | null) {
    const current = this.enrollment();

    this.enrollment.set({
      child: current.child
        ? parseInt(current.child.toString())
        : enrollment!.family.child.id,
      team: enrollment!.team?.id || null,
      shirt: enrollment!.shirt?.id || null,
      weeks: enrollment!.weeks.map((week) => ({
        id: week.id,
        isPaid: week.isPaid,
      })),
      dataProcessingConsent: enrollment!.dataProcessingConsent,
      exitAuthorization: enrollment!.exitAuthorization,
      schoolType: enrollment!.schoolType,
      className: enrollment!.className,
      section: enrollment!.section,
      year: enrollment!.year,
      parentNotes: enrollment!.parentNotes || null,
      managerNotes: enrollment!.managerNotes || null,
    });
  }

  onIsEnrollmentValidChange(valid: boolean) {
    this.isEnrollmentValid = valid;
    this.maxStep.set(valid ? 5 : 4);
  }

  onPageChange(page: number) {
    this.page = page;
    this.loadChilds();
  }
  onSizeChange(size: number) {
    this.size = size;
    this.loadChilds();
  }

  setStep(step: number) {
    if (this.step() == 0) {
      this.maxStep.set(0);
      this.step.set(0);
      return;
    }
    if (step <= this.maxStep()) {
      this.step.set(step);
    }
  }

  nextStep() {
    const step = this.step();

    if (step == 0) {
      this.step.set(this.existing() ? 2 : 1);
    } else if (step == 1 || step == 2) {
      this.step.set(3);
    } else if (step == 3) {
      this.step.set(4);
    } else if (step == 4) {
      this.setStep(5);
    }
  }

  previousStep() {
    const step = this.step();

    if (step == 3) {
      this.step.set(this.existing() ? 2 : 1);
    } else if (step == 1 || step == 2) {
      this.maxStep.set(0);
      this.step.set(0);
    } else if (step == 4) {
      this.step.set(3);
    } else if (step == 5) {
      this.step.set(4);
    }
  }

  createEnrollment() {
    if (!this.existing()) {
      const child = this.child();
      const parentOne = this.parentOne();
      const parentTwo = this.parentTwo();

      if (
        child &&
        parentOne &&
        parentTwo &&
        this.isFamilyFormValid() &&
        this.isEnrollmentValid
      ) {
        const data: any = { ...this.enrollment() };
        delete data.child;

        this.api
          .createFamilyWithEnrollment({
            childs: [{ ...child, enrollments: [data] }],
            parents: [parentOne, parentTwo],
          })
          .subscribe({
            next: (response) => {
              if (response.status === 200 && response.body?.success) {
                window.location.href = '/admin/enrollments';
              }
            },
            error: (error) => {
              console.error(error);
              this.error.set(this.utils.handleResponse(error, null));
            },
          });
      }
    } else {
      this.api.createEnrollment(this.enrollment()).subscribe({
        next: (response) => {
          if (response.status === 200 && response.body?.success) {
            window.location.href = '/admin/enrollments';
          }
        },
        error: (error) => {
          console.error(error);
          this.error.set(this.utils.handleResponse(error, null));
        },
      });
    }
  }
}
