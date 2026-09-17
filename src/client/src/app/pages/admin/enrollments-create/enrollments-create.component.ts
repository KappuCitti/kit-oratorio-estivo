import { DatePipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faClipboardCheck,
  faIdCardClip,
  faTriangleExclamation,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';
import {
  EnrollmentComponent,
  type EnrollmentFormValue,
} from '../../../components/enrollment/enrollment.component';
import { FooterComponent } from '../../../components/footer/footer.component';
import { NavbarComponent } from '../../../components/navbar/navbar.component';
import { PaginationComponent } from '../../../components/pagination/pagination.component';
import { PersonListItem } from '../../../../models/Person.model';
import { AdminEnrollmentCreateRequest } from '../../../../models/Request.model';
import { ApiService } from '../../../../services/api.service';
import { UtilsService } from '../../../../services/utils.service';

/**
 * Iscrizione creata direttamente da un responsabile, senza passare dalla coda.
 *
 * E' il percorso dello sportello: qualcuno si presenta di persona e lo si
 * iscrive sul momento. Il percorso del genitore e' un altro (richiesta in coda
 * e successiva approvazione), e un amministratore non puo' usarlo al posto suo
 * perche' la coda pretende che chi invia GESTISCA il ragazzo.
 *
 * Due modalita', scelte esplicitamente prima di confermare:
 * - NORMALE: valgono la finestra di iscrizione e il limite di posti;
 * - FORZATA: si scavalcano entrambi. Restano sempre i controlli di coerenza
 *   (classe, squadra, maglietta e settimane devono esistere, e non si puo'
 *   iscrivere due volte la stessa persona per lo stesso anno).
 */
@Component({
  selector: 'app-enrollments-create',
  imports: [
    NavbarComponent,
    FooterComponent,
    FontAwesomeModule,
    ReactiveFormsModule,
    EnrollmentComponent,
    PaginationComponent,
    DatePipe,
  ],
  templateUrl: './enrollments-create.component.html',
})
export class EnrollmentsCreateComponent implements OnInit {
  private api = inject(ApiService);
  private router = inject(Router);
  private utils = inject(UtilsService);
  private fb = inject(FormBuilder);

  faUsers = faUsers;
  faIdCardClip = faIdCardClip;
  faClipboardCheck = faClipboardCheck;
  faTriangleExclamation = faTriangleExclamation;

  readonly step = signal(0);
  readonly maxStep = signal(0);

  searchForm: FormGroup;
  readonly people = signal<PersonListItem[]>([]);
  readonly elements = signal(0);
  page = 1;
  size = 25;

  readonly selectedId = signal<string | null>(null);
  readonly formValue = signal<EnrollmentFormValue | null>(null);

  /** Scavalca finestra di iscrizione e limite di posti. */
  readonly ignoreRestrictions = signal(false);

  readonly loading = signal(true);
  readonly submitting = signal(false);
  readonly error = signal<string | null>(null);

  readonly selected = computed(() =>
    this.people().find((p) => p.id === this.selectedId())
  );

  constructor() {
    this.searchForm = this.fb.group({
      query: ['', [Validators.maxLength(100)]],
    });

    this.searchForm.valueChanges.subscribe(() => {
      this.page = 1;
      this.loadPeople();
    });
  }

  ngOnInit() {
    this.loadPeople();
  }

  loadPeople() {
    this.loading.set(true);
    const query = this.searchForm.get('query')?.value;

    this.api
      .getPeople({
        page: this.page,
        size: this.size,
        ...(query ? { query } : {}),
      })
      .subscribe({
        next: (response) => {
          if (response.body?.success) {
            this.people.set(response.body.data.elements);
            this.elements.set(response.body.data.count);
          }
          this.loading.set(false);
        },
        error: (error) => {
          console.error(error);
          this.error.set(this.utils.handleResponse(error, null));
          this.loading.set(false);
        },
      });
  }

  onSelectedChange(id: string) {
    this.selectedId.set(id);
    this.maxStep.set(1);
  }

  onEnrollmentChange(value: EnrollmentFormValue) {
    this.formValue.set(value);
  }

  onIsEnrollmentValidChange(valid: boolean) {
    this.maxStep.set(valid ? 2 : 1);
  }

  setStep(step: number) {
    if (step <= this.maxStep()) this.step.set(step);
  }

  nextStep() {
    if (this.step() < this.maxStep()) this.step.update((s) => s + 1);
  }

  previousStep() {
    if (this.step() > 0) this.step.update((s) => s - 1);
  }

  onPageChange(page: number) {
    this.page = page;
    this.loadPeople();
  }

  onSizeChange(size: number) {
    this.size = size;
    this.loadPeople();
  }

  createEnrollment() {
    const userId = this.selectedId();
    const value = this.formValue();

    if (!userId || !value?.classId || this.submitting()) return;

    // Il server pretende almeno una settimana. Il passo 3 non e' raggiungibile
    // senza, ma se lo diventasse il messaggio deve dire cosa manca invece di
    // lasciare passare un 422 generico.
    if (value.weeks.length === 0) {
      this.error.set('Seleziona almeno una settimana.');
      return;
    }

    const richiesta: AdminEnrollmentCreateRequest = {
      userId,
      classId: value.classId,
      section: value.section,
      weeks: value.weeks.map((week) => ({
        id: week.weekId,
        isPaid: week.isPaid,
      })),
      team: value.team,
      shirt: value.shirt,
      dataProcessingConsent: value.dataProcessingConsent,
      imageProcessingConsent: false,
      exitAuthorization: value.exitAuthorization,
      parentNotes: value.parentNotes,
      managerNotes: value.managerNotes,
      ignoreRestrictions: this.ignoreRestrictions(),
    };

    this.submitting.set(true);
    this.error.set(null);

    this.api.createEnrollmentAsAdmin(richiesta).subscribe({
      next: () => {
        this.submitting.set(false);
        this.router.navigateByUrl('/admin/enrollments');
      },
      error: (error) => {
        console.error(error);
        this.submitting.set(false);
        this.error.set(this.utils.handleResponse(error, null));
      },
    });
  }
}
