import { Component } from '@angular/core';
import { NavbarComponent } from "../../../components/navbar/navbar.component";
import { FooterComponent } from "../../../components/footer/footer.component";
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { faInfo, faUsers, faCalendar, faIdCardClip, faClipboardCheck } from '@fortawesome/free-solid-svg-icons';
import Enrollment from '../../../../models/Enrollment.model';
import { ChildSearch, Child, Parent } from '../../../../models/Family.model';
import { EnrollmentCreateRequest } from '../../../../models/Request.model';
import { ApiService } from '../../../../services/api.service';
import { UtilsService } from '../../../../services/utils.service';
import { CommonModule } from '@angular/common';
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
  imports: [NavbarComponent,
    FooterComponent,
    FormsModule,
    FontAwesomeModule,
    CommonModule,
    EnrollmentComponent,
    ReactiveFormsModule,
    PaginationComponent,],
  templateUrl: './enrollments-create.component.html',
  styleUrl: './enrollments-create.component.css',
})
export class EnrollmentsCreateComponent {
  // TODO - Create enrollment form
  // This page will show to child's parents to create an enrollment for their child

  faInfo = faInfo;
  faUsers = faUsers;
  faCalendar = faCalendar;
  faIdCardClip = faIdCardClip;
  faClipboardCheck = faClipboardCheck;

  step: number = 0;
  maxStep: number = 0;

  elements: number = 0;
  page: number = 1;
  size: number = 25;

  searchForm: FormGroup;
  childs: ChildSearch[] = [];

  child: Child | null = null;
  enrollment: EnrollmentCreateRequest = {} as EnrollmentCreateRequest;

  isChildValid: boolean = false;
  isParentOneValid: boolean = false;
  isParentTwoValid: boolean = false;
  isEnrollmentValid: boolean = false;

  error: string | null = null;
  loading: boolean = true;

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private utils: UtilsService,
    private fb: FormBuilder
  ) {
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
        if (this.checkIfYearIsValid(year)) this.enrollment.year = year;
      } else {
        this.enrollment.year = new Date().getFullYear();
      }
      this.maxStep = 1;

      // Child id is valid only if year is selected
      if (id && this.enrollment.year) {
        this.enrollment.child = id;
        this.step = 2;
      }
    });
  }

  loadChilds() {
    this.loading = true;
    this.api.getChilds({ query: this.searchForm.value.query }).subscribe({
      next: (response) => {
        if (response.status === 200 && response.body?.data) {
          this.childs = response.body.data.childs;
          this.elements = response.body.data.count;

          this.step = 2;
          this.maxStep = 2;

          if (this.enrollment.child) {
            this.maxStep = 2;
          }
          this.loading = false;
        }
      },
      error: (error) => {
        console.error(error);
        this.error = this.utils.handleResponse(error, null);
        this.loading = false;
      },
    });
  }

  getChildInfo(): string {
    const child: ChildSearch = this.childs.filter(
      (c) => c.id == this.enrollment.child
    )[0];
    if (this.child) {
      return `${this.child.name} ${this.child.surname}`;
    }
    return child ? `${child.name} ${child.surname}` : '';
  }



  checkIfYearIsValid(year: number) {
    return year && year > 1980;
  }

  onSelectedChildChange(id: string | number) {
    this.enrollment.child = parseInt(id.toString());
    this.maxStep = 2;

    if (this.checkIfYearIsValid(this.enrollment.year)) {
      this.maxStep = 2;
    }
  }

  onYearChange(year: number) {
    if (this.checkIfYearIsValid(year)) {
      this.enrollment.year = year;
      this.maxStep = 1;
    }
  }

  onEnrollmentChange(enrollment: Enrollment | null) {
    this.enrollment = {
      child: this.enrollment.child
        ? parseInt(this.enrollment.child.toString())
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
    };
  }

  onIsEnrollmentValidChange(valid: boolean) {
    this.isEnrollmentValid = valid;
    if (valid) {
      this.maxStep = 3;
    } else {
      this.maxStep = 2;
    }
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
    if (this.step == 0) {
      this.maxStep = 0;
      this.step = 0;
      return;
    }
    if (step <= this.maxStep) {
      this.step = step;
    }
  }

  nextStep() {
    if (this.step == 0) {
      this.step = 1;
    } else if (this.step == 1) {
      this.step = 2;
    } else if (this.step == 2) {
      this.setStep(3);
    }
  }

  previousStep() {
    if (this.step == 3) {
      this.step = 2;
    } else if (this.step == 2) {
      this.step = 1;
    } else if (this.step == 1) {
      this.maxStep = 0;
      this.step = 0;
    }
  }

  createEnrollment() {
    this.api.createEnrollment(this.enrollment).subscribe({
      next: (response) => {
        if (response.status === 200 && response.body?.data) {
          window.location.href = '/admin/enrollments';
        }
      },
      error: (error) => {
        console.error(error);
        this.error = this.utils.handleResponse(error, null);
      },
    });

  }
}
