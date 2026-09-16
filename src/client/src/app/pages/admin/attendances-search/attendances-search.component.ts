import { Component, OnInit, inject, signal } from '@angular/core';
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
import {
  AttendanceSearch,
  EnrollmentAttendanceSearch,
} from '../../../../models/Attendances.model';

import { RouterLink } from '@angular/router';
import { EnrollmentSearch } from '../../../../models/Enrollment.model';
import { zip } from 'rxjs';
import { EnrollmentGetRequest } from '../../../../models/Request.model';
import { Class, School } from '../../../../models/School.model';
import Week from '../../../../models/Week.model';

// TODO - Use computed, zip: GET /enrollments and GET /attendances and map the results

@Component({
  selector: 'app-attendances-search',
  imports: [
    FaIconComponent,
    ReactiveFormsModule,
    FooterComponent,
    PaginationComponent,
    NavbarComponent,
    FormsModule,
    RouterLink
],
  templateUrl: './attendances-search.component.html',
})
export class AttendancesSearchComponent implements OnInit {
  private fb = inject(FormBuilder);
  private api = inject(ApiService);
  private utils = inject(UtilsService);

  faArrowRotateLeft = faArrowRotateLeft;
  faPen = faPen;
  faTrash = faTrash;
  faRightToBracket = faRightToBracket;
  faRightFromBracket = faRightFromBracket;
  faCalendarDay = faCalendarDay;

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly attendances = signal<AttendanceSearch[]>([]);
  readonly enrollments = signal<EnrollmentSearch[]>([]);
  readonly enrollmentAttendances = signal<EnrollmentAttendanceSearch[]>([]);
  readonly weeks = signal<Week[]>([]);

  readonly schools = signal<School[]>([]);
  readonly classes = signal<Class[]>([]);

  readonly elements = signal(0);
  page: number = 1;
  size: number = 25;

  searchForm: FormGroup;

  readonly isExtraordinaryAttendanceModalOpen = signal(false);
  extraordinaryAttendanceForm: FormGroup;
  readonly selectedAttendance = signal<AttendanceSearch | null>(null);

  constructor() {
    this.searchForm = this.fb.group({
      date: ['', [Validators.required]],
      schoolId: [null],
      classId: [null],
      query: ['', [Validators.minLength(2), Validators.maxLength(100)]],
    });

    this.extraordinaryAttendanceForm = this.fb.group({
      type: ['', [Validators.required]],
      time: ['', [Validators.required]],
      notes: [''],
    });

    this.searchForm.valueChanges.subscribe((value) => {
      if (
        this.searchForm.get('schoolId')?.value != value.schoolId ||
        this.searchForm.get('schoolId')?.value == null
      ) {
        this.searchForm.patchValue({ classId: null }, { emitEvent: false });
      }
      // If no one is selected get all, else filter by school
      const selectedSchool = this.schools().find(
        (school) => school.id == value.schoolId
      );
      this.classes.set(
        selectedSchool
          ? selectedSchool.classes.map((cls) => ({
              ...cls,
              school: { ...selectedSchool, classes: undefined },
            }))
          : []
      );

      if (this.searchForm.valid) this.loadAttendances();
    });
  }

  ngOnInit(): void {
    this.onResetSearch();

    this.api.getSchools().subscribe({
      next: (response) => {
        if (response.status == 200 && response.body?.success) {
          this.schools.set(response.body.data);
        }
      },
      error: (error) => {
        console.error(error);
        this.error.set(this.utils.handleResponse(error, null));
      },
    });
    this.api
      .getWeeks(new Date(this.searchForm.get('date')?.value).getFullYear())
      .subscribe({
        next: (response) => {
          if (response.status == 200 && response.body?.success) {
            this.weeks.set(response.body.data);
          }
        },
        error: (error) => {
          console.error(error);
          this.error.set(this.utils.handleResponse(error, null));
        },
      });
  }

  onResetSearch() {
    this.searchForm.reset();
    const now = new Date();

    this.searchForm.patchValue({
      date: now.toISOString().slice(0, 10),
      // TODO - Remove this when the backend is ready
      // date: '2025-06-09',
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
    this.loading.set(true);

    const params: EnrollmentGetRequest = {
      year: new Date(this.searchForm.get('date')?.value).getFullYear(),
      page: this.page,
      size: this.size,
    };

    if (this.searchForm.get('schoolId')?.value) {
      params.schoolId = this.searchForm.get('schoolId')?.value;
    }
    if (this.searchForm.get('classId')?.value) {
      params.classId = this.searchForm.get('classId')?.value;
    }
    if (this.searchForm.get('query')?.value) {
      params.query = this.searchForm.get('query')?.value;
    }

    console.table(params);

    zip(
      this.api.getAttendances({ date: this.searchForm.get('date')?.value }),
      this.api.getEnrollments(params)
    ).subscribe({
      next: ([attendanceResponse, enrollmentResponse]) => {
        if (
          attendanceResponse.status == 200 &&
          attendanceResponse.body?.success
        ) {
          this.attendances.set(attendanceResponse.body.data);
        }
        if (
          enrollmentResponse.status == 200 &&
          enrollmentResponse.body?.success
        ) {
          this.enrollments.set(enrollmentResponse.body.data.elements);
          this.elements.set(enrollmentResponse.body.data.count);
        }

        // mix attendances with enrollments
        // Filter attendances by week if the searchForm date is within a week's range
        const searchDate = new Date(this.searchForm.get('date')?.value);

        // Trova la settimana in cui rientra la data cercata
        const activeWeek = this.weeks().find(
          (w) =>
            new Date(w.startDate) <= searchDate &&
            searchDate <= new Date(w.endDate)
        );

        // Filtra solo gli enrollments che includono quella settimana
        const filteredEnrollments = activeWeek
          ? this.enrollments().filter((enrollment) => {
              // L'enrollment è valido solo se contiene la settimana attiva e isPaid è true
              const isEnrolledAndPaid = enrollment.weeks?.some(
                (week) => week.weekId == activeWeek.id
                // TODO - Add isPaid check
              );

              // console.log(
              //   `Enrollment ID ${enrollment.id} - valid:`,
              //   isEnrolledAndPaid
              // );

              return isEnrolledAndPaid;
            })
          : [];

        // Costruisci l’array di enrollment + attendance
        this.enrollmentAttendances.set(
          filteredEnrollments.map((enrollment) => {
            const attendance = this.attendances().find(
              (a) => a.enrollmentId === enrollment.id
            );

            return {
              attendance: attendance,
              ...enrollment,
              present: attendance != undefined,
            } as EnrollmentAttendanceSearch;
          })
        );
      },
      error: (error) => {
        console.error(error);
        this.error.set(this.utils.handleResponse(error, null));
      },
      complete: () => {
        this.loading.set(false);
        // console.log(this.enrollmentAttendances);
      },
    });
  }

  onCheckboxUpdateEatsInOratoryChange(
    event: any,
    data: EnrollmentAttendanceSearch
  ) {
    this.updateAttendance(
      data.attendance?.id,
      data.user.id,
      data.present,
      event.target.checked
    );
  }

  updateAttendance(
    id: number | undefined,
    userId: string,
    present: boolean,
    eatsInOratory: boolean = false
  ) {
    const attendance = this.attendances().find((a) => a.id == id);

    console.log({
      id,
      userId,
      present,
      eatsInOratory,
      date: this.searchForm.get('date')?.value,
      attendance,
    });

    if (!attendance) {
      this.api
        .addAttendance({
          date: this.searchForm.get('date')?.value,
          userId: userId,
        })
        .subscribe({
          next: (response) => {
            if (response.status == 200) {
              this.loadAttendances();
            }
          },
          error: (error) => {
            console.error(error);
            this.error.set(this.utils.handleResponse(error, null));
          },
        });
    } else {
      if (present == false && id) {
        this.api.deleteAttendance(id).subscribe({
          next: (response) => {
            if (response.status == 200) {
              this.loadAttendances();
            }
          },
          error: (error) => {
            console.error(error);
            this.error.set(this.utils.handleResponse(error, null));
          },
        });
        return;
      } else if (id) {
        this.api
          .updateAttendance(
            id,
            this.searchForm.get('date')?.value,
            eatsInOratory
          )
          .subscribe({
            next: (response) => {
              if (response.status == 200) {
                this.loadAttendances();
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

  // updateAttendance(attendance: EnrollmentAttendanceSearch) {
  //   if (!attendance.present) {
  //     attendance.eatsInOratory = false;
  //   }

  //   this.api
  //     .updateAttendance(
  //       attendance.id,
  //       this.searchForm.get('date')?.value,
  //       attendance.eatsInOratory
  //     )
  //     .subscribe({
  //       next: (response) => {
  //         if (response.status == 200) {
  //           this.loadAttendances();
  //         }
  //       },
  //       error: (error) => {
  //         console.error(error);
  //         this.error.set(this.utils.handleResponse(error, null));
  //       },
  //     });
  // }

  openExtraordinaryAttendanceModal(
    attendance: AttendanceSearch | undefined,
    type: 'Join' | 'Left'
  ) {
    if (!attendance) return;

    this.selectedAttendance.set(attendance);
    this.extraordinaryAttendanceForm.patchValue({
      type: type,
    });

    this.isExtraordinaryAttendanceModalOpen.set(true);
  }

  closeExtraordinaryAttendanceModal() {
    this.isExtraordinaryAttendanceModalOpen.set(false);
    this.extraordinaryAttendanceForm.reset();
  }

  onSaveNewExtraordinaryAttendance() {
    // TODO - Add call to api to save extraordinary attendance when the backend is ready
  }
}
