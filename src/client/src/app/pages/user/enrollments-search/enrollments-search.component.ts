import { DatePipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Observable, map, zip } from 'rxjs';
import { ManagedEnrollment } from '../../../../models/Enrollment.model';
import Week from '../../../../models/Week.model';
import { ApiService } from '../../../../services/api.service';
import { SessionService } from '../../../../services/session.service';
import { UtilsService } from '../../../../services/utils.service';
import { FooterComponent } from '../../../components/footer/footer.component';
import { NavbarComponent } from '../../../components/navbar/navbar.component';

/**
 * Le iscrizioni per l'anno in corso.
 *
 * Serve due persone diverse:
 * - il genitore vede tutti i ragazzi che gestisce, sempre con prezzi e stato
 *   dei pagamenti;
 * - il ragazzo vede solo la propria iscrizione, e prezzi e pagamenti solo se
 *   chi lo gestisce ha scelto di mostrarglieli. Il server li toglie gia' dalla
 *   risposta (`price` e `isPaid` a null): qui non si nasconde niente, si
 *   mostra quello che arriva.
 *
 * Prima mostrava due ragazzi inventati nel codice e un'escursione di esempio.
 */
@Component({
  selector: 'app-enrollments-search',
  imports: [NavbarComponent, FooterComponent, FaIconComponent, RouterLink, DatePipe],
  templateUrl: './enrollments-search.component.html',
})
export class EnrollmentsSearchComponent implements OnInit {
  private api = inject(ApiService);
  private utils = inject(UtilsService);
  private session = inject(SessionService);

  faPlus = faPlus;

  readonly year = new Date().getFullYear();
  readonly people = signal<ManagedEnrollment[]>([]);
  readonly weeks = signal<Week[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  /** Chi gestisce dei ragazzi; altrimenti e' il ragazzo che guarda se stesso. */
  readonly isParent = computed(() =>
    this.session.has('manage_self_child_users')
  );

  /** C'e' almeno un ragazzo che si puo' ancora iscrivere quest'anno. */
  readonly canEnrollSomeone = computed(
    () => this.isParent() && this.people().some((p) => p.status === 'none')
  );

  ngOnInit(): void {
    const people$: Observable<ManagedEnrollment[]> = this.isParent()
      ? this.api
          .getManagedEnrollments(this.year)
          .pipe(map((r) => (r.body?.success ? r.body.data : [])))
      : this.api
          .getOwnEnrollment(this.year)
          .pipe(map((r) => (r.body?.success ? [r.body.data] : [])));

    zip([people$, this.api.getWeeks(this.year)]).subscribe({
      next: ([people, weeks]) => {
        this.people.set(people);
        if (weeks.body?.success) this.weeks.set(weeks.body.data);
        this.loading.set(false);
      },
      error: (error) => {
        console.error(error);
        this.error.set(this.utils.handleResponse(error, null));
        this.loading.set(false);
      },
    });
  }

  /** Numero della settimana nell'anno (1, 2, ...), come la conoscono tutti. */
  weekNumber(weekId: number): number | null {
    const index = this.weeks().findIndex((w) => w.id === weekId);
    return index === -1 ? null : index + 1;
  }

  weekOf(weekId: number): Week | undefined {
    return this.weeks().find((w) => w.id === weekId);
  }

  /**
   * Quanto resta da pagare per un'iscrizione confermata, o null se il prezzo
   * non e' visibile a chi guarda.
   */
  amountDue(p: ManagedEnrollment): number | null {
    if (p.status !== 'enrolled') return null;
    let totale = 0;
    for (const w of p.weeks) {
      const prezzo = this.weekOf(w.weekId)?.price;
      if (prezzo == null || w.isPaid === null) return null;
      if (!w.isPaid) totale += Number(prezzo);
    }
    return totale;
  }

  statusLabel(status: ManagedEnrollment['status']): string {
    switch (status) {
      case 'enrolled':
        return 'Iscritto';
      case 'pending':
        return 'In attesa di approvazione';
      default:
        return 'Non iscritto';
    }
  }
}
