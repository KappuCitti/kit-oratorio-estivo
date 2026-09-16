import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { NavbarComponent } from '../../../components/navbar/navbar.component';
import { FooterComponent } from '../../../components/footer/footer.component';
import { ApiService } from '../../../../services/api.service';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  faArrowRotateLeft,
  faCamera,
  faDoorClosed,
  faDoorOpen,
  faDroplet,
  faPen,
  faPlus,
  faThumbTack,
  faThumbTackSlash,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from '../../../components/pagination/pagination.component';
import {
  EnrollmentSearch,
  EnrollmentWeekSearch,
} from '../../../../models/Enrollment.model';
import Week from '../../../../models/Week.model';
import { EnrollmentGetRequest } from '../../../../models/Request.model';
import { UtilsService } from '../../../../services/utils.service';
import Team from '../../../../models/Team.model';
import { Class, School } from '../../../../models/School.model';

interface EnrollmentWeekEnrolled extends Week {
  index?: number;
  enrolled?: boolean;
  isPaid: boolean;
}

@Component({
  selector: 'app-enrollments-search',
  imports: [
    NavbarComponent,
    FooterComponent,
    FormsModule,
    FontAwesomeModule,
    CommonModule,
    PaginationComponent,
    ReactiveFormsModule,
    RouterLink,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './enrollments-search.component.html',
})
export class EnrollmentsSearchComponent implements OnInit {
  private api = inject(ApiService);
  private fb = inject(FormBuilder);
  private utils = inject(UtilsService);

  faThumbTackSlash = faThumbTackSlash;
  faThumbTack = faThumbTack;
  faCamera = faCamera;
  faDoorClosed = faDoorClosed;
  faDoorOpen = faDoorOpen;
  faPen = faPen;
  faTrash = faTrash;
  faDroplet = faDroplet;
  faArrowRotateLeft = faArrowRotateLeft;
  faPlus = faPlus;

  enrollments: EnrollmentSearch[] = [];
  weeks: Week[] = [];
  teams: Team[] = [];

  schools: School[] = [];
  classes: Class[] = [];

  elements: number = 0;
  page: number = 1;
  size: number = 25;

  year: number = new Date().getFullYear();
  searchForm: FormGroup;

  enrollmentToDelete: EnrollmentSearch | null = null;
  isDeleteModalOpen: boolean = false;
  errorDelete: string | null = null;

  constructor() {
    this.searchForm = this.fb.group({
      year: [this.year, [Validators.required, Validators.min(1980)]],
      week: [null],
      query: ['', [Validators.minLength(2), Validators.maxLength(100)]],
      schoolId: [null],
      classId: [null],
      teamId: [null],
    });

    this.searchForm.valueChanges.subscribe((value) => {
      if (
        this.searchForm.get('schoolId')?.value != value.schoolId ||
        this.searchForm.get('schoolId')?.value == null
      ) {
        this.searchForm.patchValue({ classId: null }, { emitEvent: false });
      }
      // If no one is selected get all, else filter by school
      const selectedSchool = this.schools.find(
        (school) => school.id == value.schoolId
      );
      this.classes = selectedSchool
        ? selectedSchool.classes.map((cls) => ({
            ...cls,
            school: { ...selectedSchool, classes: undefined },
          }))
        : [];

      if (this.searchForm.valid) {
        if (value.year != this.year) {
          this.year = value.year;
          this.searchForm.patchValue({ week: null });
          this.loadWeeks();
        } else {
          this.loadEnrollments();
        }
      }
    });
  }

  ngOnInit() {
    this.api.getSchools().subscribe({
      next: (response) => {
        if (response.status == 200 && response.body?.success) {
          this.schools = response.body.data;
        }
      },
    });
    this.api.getTeams().subscribe((response) => {
      if (response.status == 200 && response.body?.success) {
        this.teams = response.body.data;
      }
    });

    this.loadWeeks();
  }

  loadWeeks() {
    this.api.getWeeks(this.year).subscribe((response) => {
      if (response.status == 200 && response.body?.success) {
        this.weeks = response.body.data;
        this.loadEnrollments();
      }
    });
  }

  loadEnrollments() {
    this.api.getWeeks(this.year).subscribe((response) => {
      if (response.status == 200 && response.body?.success) {
        this.weeks = response.body.data;
      }
    });

    const params: EnrollmentGetRequest = {
      year: this.year,
      page: this.page,
      size: this.size,
    };

    if (this.searchForm.get('week')?.value) {
      params.weekId = this.searchForm.get('week')?.value;
    }
    if (this.searchForm.get('query')?.value) {
      params.query = this.searchForm.get('query')?.value;
    }
    if (this.searchForm.get('schoolId')?.value) {
      params.schoolId = this.searchForm.get('schoolId')?.value;
    }
    if (this.searchForm.get('classId')?.value) {
      params.classId = this.searchForm.get('classId')?.value;
    }
    if (this.searchForm.get('teamId')?.value) {
      params.teamId = this.searchForm.get('teamId')?.value;
    }

    this.api.getEnrollments(params).subscribe((response) => {
      if (response.status == 200 && response.body?.success) {
        this.enrollments = response.body.data.elements;
        console.log(this.enrollments);
        this.elements = response.body.data.count;
      }
    });
  }

  getWeeksStatus(weeks: EnrollmentWeekSearch[]): EnrollmentWeekEnrolled[] {
    return [...this.weeks]
      .sort((a, b) => a.id - b.id)
      .map((week, index) => {
        const enrolled = weeks.find((w) => w.weekId === week.id);
        return {
          id: week.id,
          index: index + 1,
          enrolled: enrolled != undefined,
          isPaid: !!enrolled?.isPaid,
          startDate: week.startDate,
          endDate: week.endDate,
          price: week.price,
          maxEnrollments: week.maxEnrollments,
          registrationOpenDate: week.registrationOpenDate,
          registrationCloseDate: week.registrationCloseDate,
        };
      });
  }

  isEnrollmentWeekEnrolled(
    weeks: EnrollmentWeekSearch[] | null | undefined,
    id: number
  ): boolean | null {
    if (!weeks || weeks.length === 0) return null;

    const match = weeks.find((w) => w.weekId == id);
    return match ? true : null;
  }

  isEnrollmentWeekPaid(
    weeks: EnrollmentWeekSearch[] | null | undefined,
    id: number
  ): boolean | null {
    if (!weeks || weeks.length === 0) return null;

    const match = weeks.find((w) => w.weekId == id && w.isPaid);
    return match ? true : null;
  }

  getTotalWeeksPayed(weeks: EnrollmentWeekSearch[]): number {
    const res = weeks.filter((w) => w.isPaid).length;
    return res;
  }

  onPageChange(page: number) {
    this.page = page;
    this.loadEnrollments();
  }
  onSizeChange(size: number) {
    this.size = size;
    this.loadEnrollments();
  }

  editEnrollment(id: number) {
    window.location.href = `/admin/enrollments/${id}`;
  }

  onResetSearch() {
    const now = new Date();
    this.searchForm.reset({
      year: now.getFullYear(),
      week: null,
      query: '',
      schoolId: null,
      classId: null,
      teamId: null,
    });
  }

  openDeleteModal(e: EnrollmentSearch) {
    this.enrollmentToDelete = e;
    this.isDeleteModalOpen = true;

    this.errorDelete = null;
  }

  closeDeleteModal() {
    this.enrollmentToDelete = null;
    this.isDeleteModalOpen = false;
  }

  deleteEnrollment() {
    if (this.enrollmentToDelete) {
      this.api.deleteEnrollment(this.enrollmentToDelete.id).subscribe({
        next: (response) => {
          if (response.status == 200) {
            this.loadEnrollments();
            this.closeDeleteModal();
          }
        },
        error: (error) => {
          console.error(error);
          this.errorDelete = this.utils.handleResponse(error, null);
        },
      });
    }
  }
}
