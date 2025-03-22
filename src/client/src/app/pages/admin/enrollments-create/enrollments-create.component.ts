import { Component, OnInit } from '@angular/core';
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
import { CommonModule } from '@angular/common';
import { EnrollmentComponent } from '../../../components/enrollment/enrollment.component';
import { EnrollmentCreateRequest } from '../../../../models/Request.model';
import { zip } from 'rxjs';

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
    CommonModule,
    EnrollmentComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './enrollments-create.component.html',
  styleUrl: './enrollments-create.component.css',
})
export class EnrollmentsCreateComponent implements OnInit {
  faInfo = faInfo;
  faUsers = faUsers;
  faCalendar = faCalendar;
  faIdCardClip = faIdCardClip;
  faClipboardCheck = faClipboardCheck;

  existing: boolean = false;
  step: number = 0;
  maxStep: number = 0;

  searchForm: FormGroup;
  childs: ChildSearch[] = [];

  child: Child | null = null;
  parentOne: Parent | null = null;
  parentTwo: Parent | null = null;
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
      const existing = params['existing'];
      const id = params['child'];
      const year = params['year'];

      console.table({ existing, id, year });
      this.existing = existing == 'true';

      if (existing == 'false') {
        this.step = 1;
      } else if (existing == 'true') {
        this.loadChilds();
      }

      if (year) {
        if (this.checkIfYearIsValid(year)) this.enrollment.year = year;
      } else {
        this.enrollment.year = new Date().getFullYear();
      }

      if (id) {
        this.enrollment.child = id;
        this.step = 3;
      }
    });
  }

  createFromExistingEnrollment(existing: boolean) {
    this.existing = existing;
    if (!existing) {
      this.step = 1;
    } else {
      this.loadChilds();
    }

    this.maxStep = 1;
  }

  loadChilds() {
    this.loading = true;
    this.api.getChilds({ query: this.searchForm.value.query }).subscribe({
      next: (response) => {
        if (response.status === 200 && response.body?.data) {
          this.childs = response.body.data;

          this.loading = false;
          this.step = 2;
          this.maxStep = 2;

          if (this.enrollment.child) {
            this.maxStep = 3;
          }
        }
      },
      error: (error) => {
        this.loading = false;
        this.error = this.utils.handleResponse(error, null);
      },
    });
  }

  onChildChange(updated: Child | null) {
    this.child = updated ? { ...updated } : null;
  }

  onIsChildValidChange(valid: boolean) {
    this.isChildValid = valid;
    this.checkIfNewFamilyIsValid();
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

  onParentChange(parent: Parent | null, index: number) {
    if (index == 1) {
      this.parentOne = parent;
    } else if (index == 2) {
      this.parentTwo = parent;
    }
  }

  onIsParentValidChange(valid: boolean, index: number) {
    if (index == 1) {
      this.isParentOneValid = valid;
    } else {
      this.isParentTwoValid = valid;
    }
    this.checkIfNewFamilyIsValid();
  }

  get isFamilyFormValid(): boolean {
    return this.isChildValid && this.isParentOneValid && this.isParentTwoValid;
  }

  checkIfNewFamilyIsValid() {
    const valid = this.isFamilyFormValid;
    if (valid) {
      this.maxStep = 3;

      if (this.checkIfYearIsValid(this.enrollment.year)) {
        this.maxStep = 4;
      }
    }
  }

  checkIfYearIsValid(year: number) {
    return year && year > 1980;
  }

  onSelectedChildChange(id: string | number) {
    this.enrollment.child = parseInt(id.toString());
    this.maxStep = 3;

    if (this.checkIfYearIsValid(this.enrollment.year)) {
      this.maxStep = 4;
    }
  }

  onYearChange(year: number) {
    if (this.checkIfYearIsValid(year)) {
      this.enrollment.year = year;
      this.maxStep = 4;
    }
  }

  onEnrollmentChange(enrollment: Enrollment | null) {
    console.log('Enrollment changed', enrollment);
    this.enrollment = {
      child: this.enrollment.child
        ? parseInt(this.enrollment.child.toString())
        : -1,
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
      this.maxStep = 5;
    } else {
      this.maxStep = 4;
    }
  }

  setStep(step: number) {
    console.log('Setting step from', this.step, 'to', step);

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
      this.step = this.existing ? 2 : 1;
    } else if (this.step == 1 || this.step == 2) {
      this.step = 3;
    } else if (this.step == 3) {
      this.step = 4;
    } else if (this.step == 4) {
      this.setStep(5);
    }
  }

  previousStep() {
    if (this.step == 3) {
      this.step = this.existing ? 2 : 1;
    } else if (this.step == 1 || this.step == 2) {
      this.maxStep = 0;
      this.step = 0;
    } else if (this.step == 4) {
      this.step = 3;
    } else if (this.step == 5) {
      this.step = 4;
    }
  }

  createEnrollment() {
    if (!this.existing) {
      if (
        this.child &&
        this.parentOne &&
        this.parentTwo &&
        this.isFamilyFormValid &&
        this.isEnrollmentValid
      ) {
        const data: any = { ...this.enrollment };
        delete data.child;

        this.api
          .createFamilyWithEnrollment({
            childs: [{ ...this.child, enrollments: [data] }],
            parents: [this.parentOne, this.parentTwo],
          })
          .subscribe({
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
    } else {
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
}
