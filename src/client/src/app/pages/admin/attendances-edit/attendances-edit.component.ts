import { Component, OnInit, inject, signal } from '@angular/core';
import { NavbarComponent } from "../../../components/navbar/navbar.component";
import { FooterComponent } from '../../../components/footer/footer.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faArrowRotateLeft, faCalendarDay, faRightFromBracket, faRightToBracket } from '@fortawesome/free-solid-svg-icons';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PaginationComponent } from "../../../components/pagination/pagination.component";
import { CalendarEvent, CalendarModule } from 'angular-calendar';
import { MonthViewDay } from 'calendar-utils';
import { Subject } from 'rxjs';
import { DatePipe } from '@angular/common';
import { addMonths, subMonths } from 'date-fns';

@Component({
  selector: 'app-attendances-edit',
  imports: [NavbarComponent, FooterComponent, FaIconComponent, ReactiveFormsModule, PaginationComponent,
    CalendarModule, DatePipe,
  ],
  templateUrl: './attendances-edit.component.html',
})
export class AttendancesEditComponent implements OnInit {
  private fb = inject(FormBuilder);

  faArrowRotateLeft = faArrowRotateLeft;
  faRightToBracket = faRightToBracket;
  faRightFromBracket = faRightFromBracket;
  faCalendarDay = faCalendarDay;

  searchForm: FormGroup;
  extraordinaryAttendanceForm: FormGroup;

  readonly error = signal<string | null>(null);

  readonly extraordinaryAttendances = signal<any[]>([]);
  readonly selectedExtraordinaryAttendance = signal<any>(null);

  readonly isExtraordinaryAttendanceModalOpen = signal(false);

  readonly elements = signal(0);
  page: number = 1;
  size: number = 25;

  refresh = new Subject<void>();
  readonly events = signal<CalendarEvent[]>([]);

  readonly today = signal(new Date());

  constructor() {
    this.searchForm = this.fb.group({
      date: ['', []],
      type: ['', []],
    });
    this.extraordinaryAttendanceForm = this.fb.group({
      type: ['', [Validators.required]],
      time: ['', [Validators.required]],
      notes: [''],
    });


    this.searchForm.valueChanges.subscribe((value) => {
      if (this.searchForm.valid) this.loadExtraordinaryAttendances();
      this.today.set(this.getDate());
    });
  }

  ngOnInit(): void {
    this.events.set([{
      start: new Date('2025-04-09T09:00:00'),
      title: 'Ingresso puntuale',
      color: { primary: '#4caf50', secondary: '#c8e6c9' }, // verde
      meta: {
        type: 'Join',
        note: 'Ingresso puntuale',
      },
    },
    {
      start: new Date('2025-04-09T15:00:00'),
      title: 'Uscita anticipata per appuntamento medico',
      color: { primary: '#f44336', secondary: '#ffcdd2' }, // rosso
      meta: {
        type: 'Left',
        note: 'Uscita anticipata per appuntamento medico',
      },
    }]);

    this.loadExtraordinaryAttendances();
  }

  onResetSearch() { }

  onPageChange(page: number) {
    this.page = page;
    this.loadExtraordinaryAttendances();
  }
  onSizeChange(size: number) {
    this.size = size;
    this.loadExtraordinaryAttendances();
  }

  loadExtraordinaryAttendances() { }

  getDate() {
    return this.searchForm.get('date')?.value || this.today();
  }
  isToday(date: Date): boolean {
    return date.toDateString() === this.today().toDateString();
  }
  previousMonth(): void {
    this.today.update((today) => subMonths(today, 1));
    this.searchForm.patchValue({ date: '' });
  }

  nextMonth(): void {
    this.today.update((today) => addMonths(today, 1));
    this.searchForm.patchValue({ date: '' });
  }
  onDayClicked(event: { day: MonthViewDay<any>; sourceEvent: MouseEvent | KeyboardEvent; }): void {
    const day = new Date(event.day.date);
    this.today.set(day);
    this.searchForm.patchValue({ date: day.toISOString().slice(0, 10) });
  }

  openExtraordinaryAttendanceModal(extraordinaryAttendance: any) {
    this.selectedExtraordinaryAttendance.set(extraordinaryAttendance);
    this.isExtraordinaryAttendanceModalOpen.set(true);
  }

  closeExtraordinaryAttendanceModal() {
    this.isExtraordinaryAttendanceModalOpen.set(false);
    this.extraordinaryAttendanceForm.reset();
  }

  onSaveEditedExtraordinaryAttendance() {
    // TODO - Call API when the backend is ready
  }

  onDeleteEvent(event: CalendarEvent) { }
}
