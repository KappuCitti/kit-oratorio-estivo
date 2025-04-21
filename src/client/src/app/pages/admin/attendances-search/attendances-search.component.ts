import { Component, OnInit } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import {
  faArrowRotateLeft,
  faCalendarDay,
  faPen,
  faRightFromBracket,
  faRightToBracket,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FooterComponent } from '../../../components/footer/footer.component';
import { PaginationComponent } from '../../../components/pagination/pagination.component';
import { NavbarComponent } from '../../../components/navbar/navbar.component';
import { ApiService } from '../../../../services/api.service';
import { UtilsService } from '../../../../services/utils.service';
import { AttendanceGetRequest } from '../../../../models/Request.model';
import Attendance, {
  AttendanceSearch,
} from '../../../../models/Attendances.model';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-attendances-search',
  imports: [
    FaIconComponent,
    ReactiveFormsModule,
    FooterComponent,
    PaginationComponent,
    NavbarComponent,
    CommonModule,
    FormsModule,
    RouterLink,
  ],
  templateUrl: './attendances-search.component.html',
  styleUrl: './attendances-search.component.css',
})
export class AttendancesSearchComponent implements OnInit {
  faArrowRotateLeft = faArrowRotateLeft;
  faPen = faPen;
  faTrash = faTrash;
  faRightToBracket = faRightToBracket;
  faRightFromBracket = faRightFromBracket;
  faCalendarDay = faCalendarDay;

  loading: boolean = true;
  error: string | null = null;
  attendances: AttendanceSearch[] = [];

  elements: number = 0;
  page: number = 1;
  size: number = 25;

  searchForm: FormGroup;

  isExtraordinaryAttendanceModalOpen: boolean = false;
  extraordinaryAttendanceForm: FormGroup;
  selectedAttendance: AttendanceSearch | null = null;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private utils: UtilsService
  ) {
    this.searchForm = this.fb.group({
      date: ['', [Validators.required]],
      schoolType: [''],
      className: [''],
      query: ['', [Validators.minLength(2), Validators.maxLength(100)]],
    });

    this.extraordinaryAttendanceForm = this.fb.group({
      type: ['', [Validators.required]],
      time: ['', [Validators.required]],
      notes: [''],
    });

    this.searchForm.valueChanges.subscribe((value) => {
      if (this.searchForm.valid) this.loadAttendances();
    });
  }

  ngOnInit(): void {
    this.onResetSearch();
  }

  onResetSearch() {
    this.searchForm.reset();
    const now = new Date();

    this.searchForm.patchValue({
      // TODO - Fix this when the backend is ready
      // date: now.toISOString().slice(0, 10),
      date: '2025-06-09',
    });
  }

  onPageChange(page: number) {
    this.page = page;
    this.loadAttendances();
  }
  onSizeChange(size: number) {
    this.size = size;
    this.loadAttendances();
  }

  loadAttendances() {
    this.loading = true;

    const params: AttendanceGetRequest = {
      date: this.searchForm.get('date')?.value,
      page: this.page,
      size: this.size,
    };

    if (this.searchForm.get('schoolType')?.value) {
      params.schoolType = this.searchForm.get('schoolType')?.value;
    }
    if (this.searchForm.get('className')?.value) {
      params.className = this.searchForm.get('className')?.value;
    }
    if (this.searchForm.get('query')?.value) {
      params.query = this.searchForm.get('query')?.value;
    }

    this.api.getAttendances(params).subscribe({
      next: (response) => {
        if (response.status == 200 && response.body?.data) {
          this.elements = response.body?.data.count;
          this.attendances = response.body?.data.elements;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error(error);
        this.error = this.utils.handleResponse(error, null);
        this.loading = false;
      },
    });
  }

  updateAttendance(attendance: AttendanceSearch) {
    if (!attendance.present) {
      attendance.eatsInOratory = false;
      attendance.eatsPlain = false;
    }

    const params: Attendance = {
      enrollmentId: attendance.enrollmentId,
      date: attendance.date,
      present: attendance.present,
      eatsInOratory: attendance.eatsInOratory,
      eatsPlain: attendance.eatsPlain,
    };

    this.api.updateAttendance(attendance.id, params).subscribe({
      next: (response) => {
        if (response.status == 200) {
          this.loadAttendances();
        }
      },
      error: (error) => {
        console.error(error);
        this.error = this.utils.handleResponse(error, null);
      },
    });
  }

  openExtraordinaryAttendanceModal(
    attendance: AttendanceSearch,
    type: 'Join' | 'Left'
  ) {
    this.selectedAttendance = attendance;
    this.extraordinaryAttendanceForm.patchValue({
      type: type,
    });

    this.isExtraordinaryAttendanceModalOpen = true;
  }

  closeExtraordinaryAttendanceModal() {
    this.isExtraordinaryAttendanceModalOpen = false;
    this.extraordinaryAttendanceForm.reset();
  }

  onSaveNewExtraordinaryAttendance() {
    // TODO - Add call to api to save extraordinary attendance when the backend is ready
  }
}
