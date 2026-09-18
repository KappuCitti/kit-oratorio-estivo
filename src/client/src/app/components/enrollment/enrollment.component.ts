import {
  Component,
  OnChanges,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faFloppyDisk } from '@fortawesome/free-solid-svg-icons';
import { zip } from 'rxjs';
import Enrollment, {
  EnrollmentWeekSearch,
} from '../../../models/Enrollment.model';
import { School, SchoolClass } from '../../../models/School.model';
import { Shirt } from '../../../models/Shirt.model';
import Team from '../../../models/Team.model';
import Week from '../../../models/Week.model';
import { ApiService } from '../../../services/api.service';
import { SessionService } from '../../../services/session.service';

/**
 * I valori raccolti dal form, nella forma in cui servono a chi lo usa.
 *
 * Prima il componente emetteva un oggetto `Enrollment` intero, costruito
 * mescolando i valori del form con l'iscrizione ricevuta: in creazione quella
 * iscrizione non c'e', quindi emetteva un oggetto incompleto spacciato per
 * completo, e ogni pagina lo riconvertiva a modo suo. Emettere i valori del
 * form dice la verita' su cosa il componente sa davvero.
 */
export interface EnrollmentFormValue {
  schoolId: number | null;
  classId: number | null;
  section: string;
  dataProcessingConsent: boolean;
  exitAuthorization: boolean;
  team: number | null;
  shirt: number | null;
  weeks: EnrollmentWeekSearch[];
  parentNotes: string | null;
  managerNotes: string | null;
}

@Component({
  selector: 'app-enrollment',
  imports: [DatePipe, ReactiveFormsModule, FaIconComponent],
  templateUrl: './enrollment.component.html',
})
export class EnrollmentComponent implements OnChanges {
  private fb = inject(FormBuilder);
  private api = inject(ApiService);
  private session = inject(SessionService);

  /**
   * Chi puo' decidere se il ragazzo esce da solo.
   *
   * Il server rifiuta con 403 chi invia `exitAuthorization` senza il permesso
   * `give_exit_authorization` - e lo rifiuta anche quando lo invia a `false`,
   * perche' la sola presenza del campo e' una decisione. I genitori non hanno
   * quel permesso: e' una scelta che spetta ai responsabili. La casella quindi
   * non si mostra a chi non potrebbe usarla, com'e' per il resto dell'interfaccia.
   */
  readonly canGiveExitAuthorization = computed(() =>
    this.session.has('give_exit_authorization')
  );

  /**
   * I responsabili vedono e segnano i pagamenti e il conteggio dei posti. Il
   * genitore no: la sua richiesta non porta lo stato dei pagamenti (lo decide
   * chi la approva), quindi le caselle sarebbero state ignorate.
   */
  readonly canManageEnrollments = computed(() =>
    this.session.has('manage_enrollments')
  );

  /** Il prezzo arriva solo a chi puo' vederlo (null altrimenti). */
  readonly showPrices = computed(() =>
    this.weeks().some((w) => w.price !== null)
  );

  /** Le settimane scelte che hanno gia' esaurito i posti. */
  readonly selectedFullWeeks = computed(() =>
    this.weeks().filter(
      (w) => w.isFull && this.selectedWeeks().some((s) => s.weekId === w.id)
    )
  );

  /**
   * Una settimana piena che non accetta richieste oltre il limite non si puo'
   * scegliere: il server le rifiuterebbe. Resta selezionabile se e' gia' parte
   * dell'iscrizione (modifica), e sempre per i responsabili, che possono
   * forzare l'iscrizione allo sportello.
   */
  isWeekBlocked(week: Week): boolean {
    if (this.canManageEnrollments()) return false;
    if (this.isWeekEnrolled(week.id)) return false;
    return week.isFull && !week.allowOverbooking;
  }

  /** L'iscrizione da mostrare, quando se ne sta modificando una esistente. */
  readonly enrollment = input<Enrollment | null>(null);
  readonly enrollmentChange = output<EnrollmentFormValue>();
  readonly isValid = output<boolean>();

  readonly editable = input<boolean>(false);
  readonly save = input<Function | null>(null);

  enrollmentForm!: FormGroup;
  readonly selectedWeeks = signal<EnrollmentWeekSearch[]>([]);

  readonly year = input<number>(new Date().getFullYear());

  // L'anno di riferimento e' quello dell'iscrizione quando ce n'e' una,
  // altrimenti quello passato dal padre. Come computed e' corretto fin dalla
  // prima lettura, anche prima che loadEnrollment abbia girato.
  protected readonly effectiveYear = computed(
    () => this.enrollment()?.year || this.year()
  );

  readonly teams = signal<Team[]>([]);
  readonly weeks = signal<Week[]>([]);
  readonly shirts = signal<Shirt[]>([]);
  readonly schools = signal<School[]>([]);

  /** La scuola scelta nel form, per filtrare le classi. */
  private readonly selectedSchoolId = signal<number | null>(null);

  /**
   * Le classi della scuola scelta.
   *
   * Prima scuola e classe erano due elenchi fissi nel template
   * (Primary/Secondary e I..V): erano i valori dello schema v1. In v2 le scuole
   * e le classi stanno sul database, e l'iscrizione punta a una classe.
   */
  readonly classes = computed<SchoolClass[]>(() => {
    const schoolId = this.selectedSchoolId();
    if (!schoolId) return [];
    return this.schools().find((s) => s.id == schoolId)?.classes ?? [];
  });

  faFloppyDisk = faFloppyDisk;

  constructor() {
    this.enrollmentForm = this.fb.group({
      schoolId: [null, [Validators.required]],
      classId: [null, [Validators.required]],
      section: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[a-zA-Z]+$/),
          Validators.maxLength(1),
        ],
      ],
      dataProcessingConsent: [true, [Validators.required]],
      exitAuthorization: [true, [Validators.required]],
      team: [null, []],
      shirt: [null, []],
      parentNotes: ['', [Validators.maxLength(255)]],
      managerNotes: ['', [Validators.maxLength(255)]],
    });

    this.enrollmentForm.valueChanges.subscribe((value) => {
      // Cambiando scuola la classe scelta prima non ha piu' senso.
      const schoolId = value.schoolId ? Number(value.schoolId) : null;
      if (schoolId !== this.selectedSchoolId()) {
        this.selectedSchoolId.set(schoolId);
        this.enrollmentForm.patchValue({ classId: null }, { emitEvent: false });
      }

      if (this.enrollmentForm.valid) this.emitValue();
      this.emitValidity();
    });
  }

  /**
   * Un'iscrizione non e' valida senza almeno una settimana.
   *
   * Le settimane non sono un controllo del form (stanno in un signal a parte),
   * quindi `enrollmentForm.valid` le ignora: prima si poteva arrivare a
   * confermare senza averne scelta nessuna, e il server rispondeva 422 con un
   * messaggio generico. Il server pretende `weeks` con almeno un elemento sia
   * per la coda sia per l'iscrizione da sportello.
   */
  private emitValidity() {
    this.isValid.emit(
      this.enrollmentForm.valid && this.selectedWeeks().length > 0
    );
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
      this.api.getSchools(),
    ]).subscribe(([weeks, teams, shirts, schools]) => {
      if (weeks.status === 200 && weeks.body?.success) {
        this.weeks.set(weeks.body.data);
      }
      if (teams.status === 200 && teams.body?.success) {
        this.teams.set(teams.body.data);
      }
      if (shirts.status === 200 && shirts.body?.success) {
        this.shirts.set(shirts.body.data);
      }
      if (schools.status === 200 && schools.body?.success) {
        this.schools.set(schools.body.data);
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

    this.emitValidity();
  }

  loadEnrollment() {
    const enrollment = this.enrollment();
    if (!enrollment) return;

    this.selectedWeeks.set(
      enrollment.weeks.map((week) => ({
        weekId: week.weekId,
        isPaid: week.isPaid,
      }))
    );

    this.selectedSchoolId.set(enrollment.school.id);

    this.enrollmentForm.patchValue({
      schoolId: enrollment.school.id,
      classId: enrollment.class.id,
      section: enrollment.section,
      dataProcessingConsent: enrollment.dataProcessingConsent,
      exitAuthorization: enrollment.exitAuthorization,
      team: enrollment.team?.id ?? null,
      shirt: enrollment.shirt?.id ?? null,
      parentNotes: enrollment.parentNotes,
      managerNotes: enrollment.managerNotes,
    });

    this.emitValidity();
  }

  private emitValue() {
    const form = this.enrollmentForm.value;

    this.enrollmentChange.emit({
      schoolId: form.schoolId ? Number(form.schoolId) : null,
      classId: form.classId ? Number(form.classId) : null,
      section: form.section,
      dataProcessingConsent: form.dataProcessingConsent == true,
      exitAuthorization: form.exitAuthorization == true,
      team: form.team ? Number(form.team) : null,
      shirt: form.shirt ? Number(form.shirt) : null,
      weeks: this.selectedWeeks(),
      parentNotes: form.parentNotes || null,
      managerNotes: form.managerNotes || null,
    });
  }

  isWeekEnrolled(id: number): boolean {
    return this.selectedWeeks().some((week) => week.weekId == id);
  }

  isWeekPaid(id: number): boolean {
    return this.selectedWeeks().some((week) => week.weekId == id && week.isPaid);
  }

  toggleWeekSelection(id: number, event: Event, type: 'e' | 'p'): void {
    const checked = (event.target as HTMLInputElement).checked;

    // Aggiornamento immutabile: un signal notifica solo se cambia il
    // riferimento dell'array.
    this.selectedWeeks.update((weeks) => {
      const index = weeks.findIndex((w) => w.weekId == id);

      if (type === 'e') {
        if (checked && index == -1) return [...weeks, { weekId: id, isPaid: false }];
        if (!checked && index != -1) return weeks.filter((_, i) => i !== index);
        return weeks;
      }

      if (index == -1) return weeks;

      return weeks.map((week, i) =>
        i === index ? { ...week, isPaid: checked } : week
      );
    });

    this.emitValue();
    // Togliere l'ultima settimana rende l'iscrizione non piu' valida, e
    // aggiungerne una puo' renderla valida: la validita' va rivalutata a ogni
    // cambio, non solo quando cambia il form.
    this.emitValidity();
  }

  saveEnrollment() {
    const save = this.save();
    if (this.editable() && save && this.enrollmentForm.valid) {
      save();
    }
  }
}
