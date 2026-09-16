import { Component, OnChanges, ChangeDetectionStrategy, computed, inject, input, model, output } from '@angular/core';
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
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './enrollment.component.html',
})
export class EnrollmentComponent implements OnChanges {
  private fb = inject(FormBuilder);
  private api = inject(ApiService);

  readonly enrollment = model<Enrollment | null>(null);
  readonly isValid = output<boolean>();

  readonly editable = input<boolean>(false);
  readonly save = input<Function | null>(null);

  enrollmentForm!: FormGroup;
  selectedWeeks: EnrollmentWeekSearch[] = [];

  readonly year = input<number>(new Date().getFullYear());

  // L'anno di riferimento e' quello dell'iscrizione quando ce n'e' una (nelle
  // pagine di modifica), altrimenti quello passato dal padre (nelle pagine di
  // creazione, dove `enrollment` non e' bindato). Prima era l'input `year`
  // riscritto dentro loadEnrollment: siccome loadEnrollment gira dentro la
  // subscribe di getWeeks, la prima chiamata `getWeeks(this.year)` usava
  // ancora l'anno del padre e caricava le settimane sbagliate. Come
  // `computed` il valore e' corretto fin dalla prima lettura.
  protected readonly effectiveYear = computed(
    () => this.enrollment()?.year || this.year()
  );

  teams: Team[] = [];
  weeks: Week[] = [];
  shirts: Shirt[] = [];

  faFloppyDisk = faFloppyDisk;

  constructor() {
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
    return `${this.editable() ? 'Modifica' : 'Dettagli'} iscrizione ${
      this.editable() && this.enrollment() != null
        ? `(${this.effectiveYear()})`
        : ''
    }`;
  }

  ngOnChanges() {
    zip([
      this.api.getWeeks(this.effectiveYear()),
      this.api.getTeams(),
      this.api.getShirts(),
    ]).subscribe(([weeks, teams, shirts]) => {
      if (weeks.status === 200 && weeks.body?.success) {
        this.weeks = weeks.body.data;
      }
      if (teams.status === 200 && teams.body?.success) {
        this.teams = teams.body.data;
      }
      if (shirts.status === 200 && shirts.body?.success) {
        this.shirts = shirts.body.data;
      }

      if (this.enrollment() != null) {
        this.loadEnrollment();
      }
    });

    if (this.editable()) {
      this.enrollmentForm.enable();
    } else {
      this.enrollmentForm.disable();
    }

    this.isValid.emit(this.enrollmentForm.valid);
  }

  loadEnrollment() {
    const enrollment = this.enrollment();

    if (enrollment) {
      this.selectedWeeks =
        enrollment.weeks.map((week) => {
          return { weekId: week.id, isPaid: week.isPaid };
        }) || [];

      this.enrollmentForm.patchValue({
        schoolType: enrollment.schoolType,
        className: enrollment.className,
        section: enrollment.section,
        dataProcessingConsent: enrollment.dataProcessingConsent,
        exitAuthorization: enrollment.exitAuthorization,
        team: enrollment.team?.id || '',
        shirt: enrollment.shirt?.id || '',
        parentNotes: enrollment.parentNotes,
        managerNotes: enrollment.managerNotes,
      });
    }
  }

  updateEnrollment() {
    console.table({
      dataProcessingConsent: this.enrollmentForm.value.dataProcessingConsent,
      typeOfDataProcessingConsent:
        typeof this.enrollmentForm.value.dataProcessingConsent,
      exitAuthorization: this.enrollmentForm.value.exitAuthorization,
      typeOfExitAuthorization:
        typeof this.enrollmentForm.value.exitAuthorization,
    });

    const updatedEnrollment: Enrollment = {
      ...this.enrollment(),
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
      year: this.effectiveYear(),
      dataProcessingConsent:
        this.enrollmentForm.value.dataProcessingConsent == true,
      exitAuthorization: this.enrollmentForm.value.exitAuthorization == true,
    };

    // `set` su un model aggiorna il valore ed emette `enrollmentChange`.
    this.enrollment.set(updatedEnrollment);
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
    const save = this.save();
    if (this.editable() && save && this.enrollmentForm.valid) {
      save();
    }
  }
}
