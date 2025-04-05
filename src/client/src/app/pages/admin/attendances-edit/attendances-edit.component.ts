import { Component, OnInit } from '@angular/core';
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
  styleUrl: './attendances-edit.component.css'
})
export class AttendancesEditComponent implements OnInit {
  faArrowRotateLeft = faArrowRotateLeft;
  faRightToBracket = faRightToBracket;
  faRightFromBracket = faRightFromBracket;
  faCalendarDay = faCalendarDay;

  searchForm: FormGroup;
  extraordinaryAttendanceForm: FormGroup;

  error: string | null = null;

  extraordinaryAttendances: any[] = [];
  selectedExtraordinaryAttendance: any = null;

  isExtraordinaryAttendanceModalOpen: boolean = false;

  elements: number = 0;
  page: number = 1;
  size: number = 25;

  refresh = new Subject<void>();
  events: CalendarEvent[] = [];

  today = new Date();

  constructor(private fb: FormBuilder) {
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
      this.today = this.getDate();
    });
  }

  ngOnInit(): void {
    this.events = [{
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
    }]

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
    return this.searchForm.get('date')?.value || this.today;
  }
  isToday(date: Date): boolean {
    return date.toDateString() === this.today.toDateString();
  }
  previousMonth(): void {
    this.today = subMonths(this.today, 1);
    this.searchForm.patchValue({ date: '' });
  }

  nextMonth(): void {
    this.today = addMonths(this.today, 1);
    this.searchForm.patchValue({ date: '' });
  }
  onDayClicked(event: { day: MonthViewDay<any>; sourceEvent: MouseEvent | KeyboardEvent; }): void {
    this.today = new Date(event.day.date);
    this.searchForm.patchValue({ date: this.today.toISOString().slice(0, 10) });
  }

  openExtraordinaryAttendanceModal(extraordinaryAttendance: any) {
    this.selectedExtraordinaryAttendance = extraordinaryAttendance;
    this.isExtraordinaryAttendanceModalOpen = true;
  }

  closeExtraordinaryAttendanceModal() {
    this.isExtraordinaryAttendanceModalOpen = false;
    this.extraordinaryAttendanceForm.reset();
  }

  onSaveEditedExtraordinaryAttendance() {
    // TODO - Call API when the backend is ready
  }

  onDeleteEvent(event: CalendarEvent) { }
}
