import { DatePipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faArrowLeft,
  faArrowRotateLeft,
  faCheck,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { QueueEnrollment } from '../../../../models/Enrollment.model';
import {
  EnrollmentApprovalRequest,
  QueueGetRequest,
} from '../../../../models/Request.model';
import Team from '../../../../models/Team.model';
import Week from '../../../../models/Week.model';
import { ApiService } from '../../../../services/api.service';
import { SessionService } from '../../../../services/session.service';
import { UtilsService } from '../../../../services/utils.service';
import { FooterComponent } from '../../../components/footer/footer.component';
import { NavbarComponent } from '../../../components/navbar/navbar.component';
import { PaginationComponent } from '../../../components/pagination/pagination.component';

/**
 * Le richieste di iscrizione inviate dai genitori, in attesa di un
 * responsabile.
 *
 * E' la seconda meta' del percorso del genitore: lui chiede, qui si approva o
 * si rifiuta. Prima questa pagina non esisteva, quindi le richieste restavano
 * in coda senza che nessuno potesse vederle.
 *
 * All'approvazione il responsabile completa cio' che il genitore non puo'
 * decidere: la squadra, quali settimane risultano gia' pagate e l'uscita
 * autonoma. Le settimane sono quelle richieste dal genitore e non si cambiano
 * qui: per modificarle si approva e poi si corregge l'iscrizione.
 */
@Component({
  selector: 'app-enrollments-queue',
  imports: [
    NavbarComponent,
    FooterComponent,
    FontAwesomeModule,
    ReactiveFormsModule,
    PaginationComponent,
    RouterLink,
    DatePipe,
  ],
  templateUrl: './enrollments-queue.component.html',
})
export class EnrollmentsQueueComponent implements OnInit {
  private api = inject(ApiService);
  private fb = inject(FormBuilder);
  private utils = inject(UtilsService);
  private session = inject(SessionService);

  faArrowLeft = faArrowLeft;
  faArrowRotateLeft = faArrowRotateLeft;
  faCheck = faCheck;
  faXmark = faXmark;

  readonly requests = signal<QueueEnrollment[]>([]);
  readonly weeks = signal<Week[]>([]);
  readonly teams = signal<Team[]>([]);
  readonly elements = signal(0);
  readonly error = signal<string | null>(null);

  page = 1;
  size = 25;
  year = new Date().getFullYear();

  searchForm: FormGroup;

  // --- approvazione ---
  readonly toApprove = signal<QueueEnrollment | null>(null);
  /** Id delle settimane da segnare come gia' pagate. */
  readonly paidWeeks = signal<number[]>([]);
  approvalForm: FormGroup;
  readonly approving = signal(false);
  readonly approvalError = signal<string | null>(null);

  /**
   * Come nel form di iscrizione: il server rifiuta `exitAuthorization` da chi
   * non ha il permesso di concederla, anche quando vale `false`.
   */
  readonly canGiveExitAuthorization = () =>
    this.session.has('give_exit_authorization');

  // --- rifiuto ---
  readonly toReject = signal<QueueEnrollment | null>(null);
  readonly rejecting = signal(false);
  readonly rejectError = signal<string | null>(null);

  constructor() {
    this.searchForm = this.fb.group({
      year: [this.year, [Validators.required, Validators.min(1980)]],
      query: ['', [Validators.maxLength(100)]],
    });

    this.approvalForm = this.fb.group({
      teamId: [null],
      exitAuthorization: [false],
      managerNotes: ['', [Validators.maxLength(255)]],
    });

    this.searchForm.valueChanges.subscribe((value) => {
      if (!this.searchForm.valid) return;
      this.page = 1;
      if (value.year != this.year) {
        this.year = Number(value.year);
        this.loadWeeks();
      }
      this.loadRequests();
    });
  }

  ngOnInit() {
    this.api.getTeams().subscribe({
      next: (response) => {
        if (response.body?.success) this.teams.set(response.body.data);
      },
      error: (error) => console.error(error),
    });
    this.loadWeeks();
    this.loadRequests();
  }

  private loadWeeks() {
    this.api.getWeeks(this.year).subscribe({
      next: (response) => {
        if (response.body?.success) this.weeks.set(response.body.data);
      },
      error: (error) => console.error(error),
    });
  }

  loadRequests() {
    const params: QueueGetRequest = {
      year: this.year,
      page: this.page,
      size: this.size,
    };
    const query = this.searchForm.get('query')?.value;
    if (query) params.query = query;

    this.api.getEnrollmentQueue(params).subscribe({
      next: (response) => {
        if (response.body?.success) {
          this.requests.set(response.body.data.elements);
          this.elements.set(response.body.data.count);
        }
        this.error.set(null);
      },
      error: (error) => {
        console.error(error);
        this.error.set(this.utils.handleResponse(error, null));
      },
    });
  }

  /** Numero della settimana nell'anno (il server le restituisce in ordine di data). */
  weekLabel(weekId: number): string {
    const index = this.weeks().findIndex((w) => w.id === weekId);
    return index === -1 ? `#${weekId}` : `${index + 1}`;
  }

  /** Le settimane dell'anno che hanno raggiunto il limite di posti. */
  readonly fullWeeks = computed(() => this.weeks().filter((w) => w.isFull));

  /** Le settimane piene comprese in una richiesta. */
  requestFullWeeks(request: QueueEnrollment): Week[] {
    return this.fullWeeks().filter((w) =>
      request.weeks.some((r) => r.weekId === w.id)
    );
  }

  weekOf(weekId: number): Week | undefined {
    return this.weeks().find((w) => w.id === weekId);
  }

  onResetSearch() {
    this.searchForm.reset({ year: new Date().getFullYear(), query: '' });
  }

  onPageChange(page: number) {
    this.page = page;
    this.loadRequests();
  }

  onSizeChange(size: number) {
    this.size = size;
    this.loadRequests();
  }

  // --- approvazione ---

  openApprove(request: QueueEnrollment) {
    this.toApprove.set(request);
    this.paidWeeks.set([]);
    this.approvalError.set(null);
    this.approvalForm.reset({
      teamId: null,
      // Quello che ha indicato il genitore, se l'ha indicato; altrimenti no.
      exitAuthorization: request.exitAuthorization ?? false,
      managerNotes: '',
    });
  }

  closeApprove() {
    this.toApprove.set(null);
  }

  togglePaid(weekId: number, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    this.paidWeeks.update((ids) =>
      checked ? [...ids, weekId] : ids.filter((id) => id !== weekId)
    );
  }

  approve() {
    const request = this.toApprove();
    if (!request || this.approving() || this.approvalForm.invalid) return;

    const form = this.approvalForm.value;
    const approval: EnrollmentApprovalRequest = {
      queueId: request.id,
      teamId: form.teamId ? Number(form.teamId) : null,
      weeks: request.weeks.map((w) => ({
        id: w.weekId,
        isPaid: this.paidWeeks().includes(w.weekId),
      })),
      managerNotes: form.managerNotes || null,
    };
    if (this.canGiveExitAuthorization()) {
      approval.exitAuthorization = form.exitAuthorization == true;
    }

    this.approving.set(true);
    this.approvalError.set(null);

    this.api.approveEnrollment(approval).subscribe({
      next: () => {
        this.approving.set(false);
        this.closeApprove();
        this.loadRequests();
      },
      error: (error) => {
        console.error(error);
        this.approving.set(false);
        this.approvalError.set(this.utils.handleResponse(error, null));
      },
    });
  }

  // --- rifiuto ---

  openReject(request: QueueEnrollment) {
    this.toReject.set(request);
    this.rejectError.set(null);
  }

  closeReject() {
    this.toReject.set(null);
  }

  reject() {
    const request = this.toReject();
    if (!request || this.rejecting()) return;

    this.rejecting.set(true);
    this.api.rejectEnrollmentRequest(request.id).subscribe({
      next: () => {
        this.rejecting.set(false);
        this.closeReject();
        this.loadRequests();
      },
      error: (error) => {
        console.error(error);
        this.rejecting.set(false);
        this.rejectError.set(this.utils.handleResponse(error, null));
      },
    });
  }
}
