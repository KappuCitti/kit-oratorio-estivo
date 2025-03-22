import { Component, OnInit } from '@angular/core';
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
  templateUrl: './enrollments-search.component.html',
  styleUrl: './enrollments-search.component.css',
})
export class EnrollmentsSearchComponent implements OnInit {
  faThumbTackSlash = faThumbTackSlash;
  faThumbTack = faThumbTack;
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

  elements: number = 0;
  page: number = 1;
  size: number = 25;

  year: number = new Date().getFullYear();
  searchForm: FormGroup;

  enrollmentToDelete: EnrollmentSearch | null = null;
  isDeleteModalOpen: boolean = false;
  errorDelete: string | null = null;

  constructor(
    private api: ApiService,
    private fb: FormBuilder,
    private utils: UtilsService
  ) {
    this.searchForm = this.fb.group({
      year: [this.year, [Validators.required, Validators.min(1980)]],
      week: [''],
      search: ['', [Validators.maxLength(100)]],
      schoolType: [''],
      className: [''],
      team: [''],
    });

    this.searchForm.valueChanges.subscribe((value) => {
      if (this.searchForm.valid) {
        if (value.year != this.year) {
          this.year = value.year;
          this.searchForm.patchValue({ week: '' });
          this.loadWeeks();
        } else {
          this.loadEnrollments();
        }
      }
    });
  }

  ngOnInit() {
    this.api.getTeams().subscribe((response) => {
      if (response.status == 200 && response.body?.data) {
        this.teams = response.body?.data;
      }
    });

    this.loadWeeks();
  }

  loadWeeks() {
    this.api.getWeeks(this.year).subscribe((response) => {
      if (response.status == 200 && response.body?.data) {
        this.weeks = response.body?.data;
        this.loadEnrollments();
      }
    });
  }

  loadEnrollments() {
    this.api.getWeeks(this.year).subscribe((response) => {
      if (response.status == 200 && response.body?.data) {
        this.weeks = response.body?.data;
      }
    });

    const q: EnrollmentGetRequest = {
      year: this.year,
      page: this.page,
      size: this.size,
    };

    if (this.searchForm.value.week) {
      q.weekId = this.searchForm.value.week;
    }
    if (this.searchForm.value.search) {
      q.query = this.searchForm.value.search;
    }
    if (this.searchForm.value.schoolType) {
      q.schoolType = this.searchForm.value.schoolType;
    }
    if (this.searchForm.value.className) {
      q.className = this.searchForm.value.className;
    }
    if (this.searchForm.value.team) {
      q.teamId = this.searchForm.value.team;
    }

    this.api.getEnrollments(q).subscribe((response) => {
      if (response.status == 200 && response.body?.data) {
        this.enrollments = response.body?.data.enrollments;
        this.elements = response.body?.data.count;
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
          isPaid: enrolled?.isPaid || false,
          startDate: week.startDate,
          endDate: week.endDate,
          price: week.price,
        };
      });
  }

  getTotalWeeksPayed(weeks: EnrollmentWeekSearch[]): number {
    const res = weeks.length - weeks.filter((week) => !week.isPaid).length;
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
      week: '',
      search: '',
      schoolType: '',
      className: '',
      team: '',
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
          this.errorDelete = this.utils.handleResponse(error, null);
        },
      });
    }
  }
}
