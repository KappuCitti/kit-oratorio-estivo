import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import Enrollment, {
  EnrollmentWeekSearch,
} from '../../../models/Enrollment.model';
import { CommonModule, DatePipe } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faFloppyDisk } from '@fortawesome/free-solid-svg-icons';
import Team from '../../../models/Team.model';
import Week from '../../../models/Week.model';
import { Shirt } from '../../../models/Shirt.model';
import { ApiService } from '../../../services/api.service';
import { zip } from 'rxjs';

@Component({
  selector: 'app-enrollment',
  imports: [DatePipe, ReactiveFormsModule, FaIconComponent, CommonModule],
  templateUrl: './enrollment.component.html',
  styleUrl: './enrollment.component.css',
})
export class EnrollmentComponent implements OnChanges {
  @Input() enrollment: Enrollment | null = null;
  @Output() enrollmentChange = new EventEmitter<Enrollment | null>();
  @Output() isValid = new EventEmitter<boolean>(false);

  @Input() editable: boolean = false;
  @Input() save: Function | null = null;

  enrollmentForm!: FormGroup;
  selectedWeeks: EnrollmentWeekSearch[] = [];

  @Input() year: number = new Date().getFullYear();

  teams: Team[] = [];
  weeks: Week[] = [];
  shirts: Shirt[] = [];

  faFloppyDisk = faFloppyDisk;

  constructor(private fb: FormBuilder, private api: ApiService) {
    this.enrollmentForm = this.fb.group({
      schoolType: [
        '',
        [Validators.required, Validators.pattern(/^(Secondary|Primary)$/)],
      ],
      className: [
        '',
        [Validators.required, Validators.pattern(/^(I|II|III|IV|V)$/)],
      ],
      section: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[a-zA-Z]+$/),
          Validators.maxLength(1),
        ],
      ],
      dataProcessingConsent: [
        true,
        [Validators.required, Validators.pattern(/^(true|false)$/)],
      ],
      exitAuthorization: [
        true,
        [Validators.required, Validators.pattern(/^(true|false)$/)],
      ],
      team: ['', []],
      shirt: ['', []],
      parentNotes: ['', [Validators.maxLength(255)]],
      managerNotes: ['', [Validators.maxLength(255)]],
    });

    this.enrollmentForm.valueChanges.subscribe(() => {
      if (this.enrollmentForm.valid) {
        this.updateEnrollment();
      }
      this.isValid.emit(this.enrollmentForm.valid);
    });
  }

  get getTitle(): string {
    return `${this.editable ? 'Modifica' : 'Dettagli'} iscrizione ${
      this.editable && this.enrollment != null ? `(${this.year})` : ''
    }`;
  }

  ngOnChanges() {
    zip([
      this.api.getWeeks(this.year),
      this.api.getTeams(),
      this.api.getShirts(),
    ]).subscribe(([weeks, teams, shirts]) => {
      if (weeks.status === 200 && weeks.body?.data) {
        this.weeks = weeks.body.data;
      }
      if (teams.status === 200 && teams.body?.data) {
        this.teams = teams.body.data;
      }
      if (shirts.status === 200 && shirts.body?.data) {
        this.shirts = shirts.body.data;
      }

      if (this.enrollment != null) {
        this.loadEnrollment();
      }
    });

    if (this.editable) {
      this.enrollmentForm.enable();
    } else {
      this.enrollmentForm.disable();
    }

    this.isValid.emit(this.enrollmentForm.valid);
  }

  loadEnrollment() {
    if (this.enrollment) {
      this.selectedWeeks =
        this.enrollment?.weeks.map((week) => {
          return { weekId: week.id, isPaid: week.isPaid };
        }) || [];

      this.year = this.enrollment?.year || new Date().getFullYear();

      this.enrollmentForm.patchValue({
        schoolType: this.enrollment?.schoolType,
        className: this.enrollment?.className,
        section: this.enrollment?.section,
        dataProcessingConsent: this.enrollment?.dataProcessingConsent,
        exitAuthorization: this.enrollment?.exitAuthorization,
        team: this.enrollment?.team?.id || '',
        shirt: this.enrollment?.shirt?.id || '',
        parentNotes: this.enrollment?.parentNotes,
        managerNotes: this.enrollment?.managerNotes,
      });
    }
  }

  updateEnrollment() {
    console.log('Updated Enrollment:');
    console.table({
      dataProcessingConsent: this.enrollmentForm.value.dataProcessingConsent,
      typeOfDataProcessingConsent:
        typeof this.enrollmentForm.value.dataProcessingConsent,
      exitAuthorization: this.enrollmentForm.value.exitAuthorization,
      typeOfExitAuthorization:
        typeof this.enrollmentForm.value.exitAuthorization,
    });

    const updatedEnrollment: Enrollment = {
      ...this.enrollment,
      ...this.enrollmentForm.value,
      team: this.teams.find(
        (team) => team.id == this.enrollmentForm.value.team
      ),
      shirt: this.shirts.find(
        (shirt) => shirt.id == this.enrollmentForm.value.shirt
      ),
      weeks: this.weeks
        .filter((week) =>
          this.selectedWeeks.some(
            (selectedWeek) => selectedWeek.weekId === week.id
          )
        )
        .map((week) => {
          const selectedWeek = this.selectedWeeks.find(
            (selectedWeek) => selectedWeek.weekId === week.id
          ) || { weekId: week.id, isPaid: false };
          return { ...week, isPaid: selectedWeek.isPaid, weekId: week.id };
        }),
      year: this.year,
      dataProcessingConsent:
        this.enrollmentForm.value.dataProcessingConsent == true,
      exitAuthorization: this.enrollmentForm.value.exitAuthorization == true,
    };

    this.enrollment = updatedEnrollment;
    this.enrollmentChange.emit(updatedEnrollment);
  }

  isWeekEnrolled(id: number | string): boolean {
    const enrolled = this.selectedWeeks.some((week) => week.weekId == id);
    return enrolled;
  }

  isWeekPaid(id: number | string): boolean {
    return this.selectedWeeks.some((week) => week.weekId == id && week.isPaid);
  }

  toggleWeekSelection(
    id: number | string,
    event: Event,
    type: 'e' | 'p'
  ): void {
    const input = event.target as HTMLInputElement;
    const checked = input.checked;
    const index = this.selectedWeeks.findIndex((w) => w.weekId == id);

    if (type === 'e') {
      if (checked && index == -1) {
        this.selectedWeeks.push({ weekId: id, isPaid: false });
      } else if (!checked && index != -1) {
        this.selectedWeeks.splice(index, 1);
      }
    } else if (type === 'p') {
      if (index != -1) {
        this.selectedWeeks[index].isPaid = checked;
      }
    }

    this.updateEnrollment();
  }

  saveEnrollment() {
    if (this.editable && this.save && this.enrollmentForm.valid) {
      this.save();
    }
  }
}
