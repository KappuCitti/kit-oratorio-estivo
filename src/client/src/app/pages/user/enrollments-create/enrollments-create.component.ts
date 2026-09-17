import { DatePipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faCalendar,
  faClipboardCheck,
  faIdCardClip,
  faInfo,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';
import { FooterComponent } from '../../../components/footer/footer.component';
import { NavbarComponent } from '../../../components/navbar/navbar.component';
import {
  EnrollmentComponent,
  type EnrollmentFormValue,
} from '../../../components/enrollment/enrollment.component';
import { FamilyMember } from '../../../../models/Family.model';
import { QueueEnrollmentCreateRequest } from '../../../../models/Request.model';
import { ApiService } from '../../../../services/api.service';
import { SessionService } from '../../../../services/session.service';
import { UtilsService } from '../../../../services/utils.service';

/**
 * Richiesta di iscrizione inviata da un genitore.
 *
 * Passi: si sceglie uno dei propri figli, si compila l'iscrizione, si conferma.
 *
 * La richiesta finisce in CODA (POST /enrollments/queue) e diventa
 * un'iscrizione solo quando un responsabile la approva. E' il flusso che il
 * server implementa: prima questa pagina chiamava POST /enrollments, che invece
 * APPROVA una richiesta gia' in coda e si aspetta un `queueId`. Il corpo che
 * mandava non aveva niente a che vedere con quello atteso.
 *
 * L'elenco dei figli arriva da GET /users, che restituisce le persone gestite
 * da chi e' collegato. Prima si chiamava `/childs`, che non e' mai esistito, e
 * la pagina aveva ricerca e paginazione per una lista che e' lunga quanto la
 * propria famiglia.
 */
@Component({
  selector: 'app-enrollments-create',
  imports: [
    NavbarComponent,
    FooterComponent,
    FontAwesomeModule,
    EnrollmentComponent,
    DatePipe,
  ],
  templateUrl: './enrollments-create.component.html',
})
export class EnrollmentsCreateComponent implements OnInit {
  private api = inject(ApiService);
  private router = inject(Router);
  private utils = inject(UtilsService);
  private session = inject(SessionService);

  faInfo = faInfo;
  faUsers = faUsers;
  faCalendar = faCalendar;
  faIdCardClip = faIdCardClip;
  faClipboardCheck = faClipboardCheck;

  readonly step = signal(0);
  readonly maxStep = signal(0);

  readonly childs = signal<FamilyMember[]>([]);
  readonly selectedChildId = signal<string | null>(null);
  readonly formValue = signal<EnrollmentFormValue | null>(null);
  readonly isEnrollmentValid = signal(false);

  readonly error = signal<string | null>(null);
  readonly loading = signal(true);
  readonly submitting = signal(false);

  readonly selectedChild = computed(() =>
    this.childs().find((c) => c.id === this.selectedChildId())
  );

  ngOnInit() {
    this.api.getManagedPeople().subscribe({
      next: (response) => {
        if (response.body?.success) this.childs.set(response.body.data);
        this.loading.set(false);
      },
      error: (error) => {
        console.error(error);
        this.error.set(this.utils.handleResponse(error, null));
        this.loading.set(false);
      },
    });
  }

  onSelectedChildChange(id: string) {
    this.selectedChildId.set(id);
    this.maxStep.set(1);
  }

  onEnrollmentChange(value: EnrollmentFormValue) {
    this.formValue.set(value);
  }

  onIsEnrollmentValidChange(valid: boolean) {
    this.isEnrollmentValid.set(valid);
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

  /** Riepilogo mostrato all'ultimo passo. */
  readonly riepilogo = computed(() => {
    const value = this.formValue();
    if (!value) return null;
    return {
      settimane: value.weeks.length,
      sezione: value.section,
      classe: value.classId,
    };
  });

  createEnrollment() {
    const child = this.selectedChildId();
    const value = this.formValue();

    if (!child || !value?.classId || this.submitting()) return;

    const richiesta: QueueEnrollmentCreateRequest = {
      user: child,
      classId: value.classId,
      section: value.section,
      // La coda accetta i soli id delle settimane: chi paga cosa lo decide il
      // responsabile in fase di approvazione, non il genitore.
      weeks: value.weeks.map((week) => week.weekId),
      dataProcessingConsent: value.dataProcessingConsent,
      // Il consenso alle immagini non e' ancora chiesto dal form: il server lo
      // pretende, quindi per ora si invia come non concesso.
      imageProcessingConsent: false,
      shirt: value.shirt,
      parentNotes: value.parentNotes,
    };

    // `exitAuthorization` si invia SOLO se l'utente ha il permesso di
    // deciderlo. Il server rifiuta con 403 chi lo manda senza quel permesso, e
    // lo rifiuta anche se lo manda a `false`: la sola presenza del campo e' una
    // decisione, e per un genitore non e' una decisione sua.
    if (this.session.has('give_exit_authorization')) {
      richiesta.exitAuthorization = value.exitAuthorization;
    }

    this.submitting.set(true);
    this.api.createQueueEnrollment(richiesta).subscribe({
      next: () => {
        this.submitting.set(false);
        this.router.navigateByUrl(this.session.landingPath());
      },
      error: (error) => {
        console.error(error);
        this.submitting.set(false);
        this.error.set(this.utils.handleResponse(error, null));
      },
    });
  }
}
