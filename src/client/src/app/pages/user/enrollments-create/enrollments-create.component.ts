import { Component, OnInit, inject, signal } from '@angular/core';
import { NavbarComponent } from '../../../components/navbar/navbar.component';
import { FooterComponent } from '../../../components/footer/footer.component';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  faInfo,
  faUsers,
  faCalendar,
  faIdCardClip,
  faClipboardCheck,
} from '@fortawesome/free-solid-svg-icons';
import Enrollment from '../../../../models/Enrollment.model';
import { ChildSearch, Child, Parent } from '../../../../models/Family.model';
import { EnrollmentCreateRequest } from '../../../../models/Request.model';
import { ApiService } from '../../../../services/api.service';
import { UtilsService } from '../../../../services/utils.service';
import { NgClass, DatePipe } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { EnrollmentComponent } from '../../../components/enrollment/enrollment.component';
import { PaginationComponent } from '../../../components/pagination/pagination.component';

/**
 * Steps description:
 * 0: Choose year
 * 1: Choose existing child
 * 2: Create enrollment
 * 3: Confirm data
 */

@Component({
  selector: 'app-enrollments-create',
  imports: [
    NavbarComponent,
    FooterComponent,
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

  // TODO - Create enrollment form
  // This page will show to child's parents to create an enrollment for their child

  faInfo = faInfo;
  faUsers = faUsers;
  faCalendar = faCalendar;
  faIdCardClip = faIdCardClip;
  faClipboardCheck = faClipboardCheck;

  readonly step = signal(0);
  readonly maxStep = signal(0);

  readonly elements = signal(0);
  page: number = 1;
  size: number = 25;

  searchForm: FormGroup;
  readonly childs = signal<ChildSearch[]>([]);

  readonly child = signal<Child | null>(null);
  readonly enrollment = signal<EnrollmentCreateRequest>(
    {} as EnrollmentCreateRequest
  );

  isChildValid: boolean = false;
  isParentOneValid: boolean = false;
  isParentTwoValid: boolean = false;
  isEnrollmentValid: boolean = false;

  readonly error = signal<string | null>(null);
  readonly loading = signal(true);

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
      // TODO - Validate child id if it belongs to current session family
      const id = params['child'];
      const year = params['year'];

      console.table({ id, year });

      this.loadChilds();
      if (year) {
        if (this.checkIfYearIsValid(year)) this.patchEnrollment({ year });
      } else {
        this.patchEnrollment({ year: new Date().getFullYear() });
      }
      this.maxStep.set(1);

      // Child id is valid only if year is selected
      if (id && this.enrollment().year) {
        this.patchEnrollment({ child: id });
        this.step.set(2);
      }
    });
  }

  loadChilds() {
    this.loading.set(true);
    this.api.getChilds({ query: this.searchForm.value.query }).subscribe({
      next: (response) => {
        if (response.status === 200 && response.body?.success) {
          this.childs.set(response.body.data.elements);
          this.elements.set(response.body.data.count);

          this.step.set(2);
          this.maxStep.set(2);

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

  // `enrollment` e' un signal: va sostituito, non modificato sul posto.
  private patchEnrollment(changes: Partial<EnrollmentCreateRequest>) {
    this.enrollment.update((enrollment) => ({ ...enrollment, ...changes }));
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

  checkIfYearIsValid(year: number) {
    return year && year > 1980;
  }

  onSelectedChildChange(id: string | number) {
    this.patchEnrollment({ child: parseInt(id.toString()) });
    this.maxStep.set(2);
  }

  onYearChange(year: number) {
    if (this.checkIfYearIsValid(year)) {
      this.patchEnrollment({ year });
      this.maxStep.set(1);
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
    this.maxStep.set(valid ? 3 : 2);
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
      this.step.set(1);
    } else if (step == 1) {
      this.step.set(2);
    } else if (step == 2) {
      this.setStep(3);
    }
  }

  previousStep() {
    const step = this.step();

    if (step == 3) {
      this.step.set(2);
    } else if (step == 2) {
      this.step.set(1);
    } else if (step == 1) {
      this.maxStep.set(0);
      this.step.set(0);
    }
  }

  createEnrollment() {
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
