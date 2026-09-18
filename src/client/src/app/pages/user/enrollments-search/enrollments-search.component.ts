import { DatePipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { zip } from 'rxjs';
import { ManagedEnrollment } from '../../../../models/Enrollment.model';
import Week from '../../../../models/Week.model';
import { ApiService } from '../../../../services/api.service';
import { UtilsService } from '../../../../services/utils.service';
import { FooterComponent } from '../../../components/footer/footer.component';
import { NavbarComponent } from '../../../components/navbar/navbar.component';

/**
 * Le iscrizioni dei propri ragazzi, per l'anno in corso.
 *
 * Prima mostrava due ragazzi inventati nel codice ("Mario Rossi", "Giulia
 * Rossi") e una sezione eventi con un'escursione "sul cucuzzolo": nessun dato
 * veniva dal server. Gli eventi sono stati tolti perche' non hanno ancora
 * nessuna rotta; torneranno con quella funzione.
 */
@Component({
  selector: 'app-enrollments-search',
  imports: [NavbarComponent, FooterComponent, FaIconComponent, RouterLink, DatePipe],
  templateUrl: './enrollments-search.component.html',
})
export class EnrollmentsSearchComponent implements OnInit {
  private api = inject(ApiService);
  private utils = inject(UtilsService);

  faPlus = faPlus;

  readonly year = new Date().getFullYear();
  readonly people = signal<ManagedEnrollment[]>([]);
  readonly weeks = signal<Week[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  /** C'e' almeno un ragazzo che si puo' ancora iscrivere quest'anno. */
  readonly canEnrollSomeone = computed(() =>
    this.people().some((p) => p.status === 'none')
  );

  ngOnInit(): void {
    zip([
      this.api.getManagedEnrollments(this.year),
      this.api.getWeeks(this.year),
    ]).subscribe({
      next: ([people, weeks]) => {
        if (people.body?.success) this.people.set(people.body.data);
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
    const ordinate = [...this.weeks()].sort((a, b) => a.id - b.id);
    const index = ordinate.findIndex((w) => w.id === weekId);
    return index === -1 ? null : index + 1;
  }

  weekOf(weekId: number): Week | undefined {
    return this.weeks().find((w) => w.id === weekId);
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
