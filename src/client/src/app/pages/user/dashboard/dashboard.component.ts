import { DatePipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ManagedEnrollment } from '../../../../models/Enrollment.model';
import { ApiService } from '../../../../services/api.service';
import { SessionService } from '../../../../services/session.service';
import { FooterComponent } from '../../../components/footer/footer.component';
import { NavbarComponent } from '../../../components/navbar/navbar.component';

/**
 * La pagina iniziale dell'area utente.
 *
 * - Il genitore vede il riepilogo dell'anno: quanti ragazzi, quanti iscritti,
 *   quanti in attesa, quante settimane restano da pagare.
 * - Il ragazzo vede i propri dati e lo stato della propria iscrizione. Non
 *   vede nulla dei genitori, e non puo' modificare i propri dati: la pagina
 *   non offre nessun campo modificabile, e il server non ha una rotta con cui
 *   farlo.
 *
 * Prima conteneva solo "Ciao, Lorem Ipsum" e un riquadro vuoto.
 */
@Component({
  selector: 'app-dashboard',
  imports: [NavbarComponent, FooterComponent, RouterLink, DatePipe],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  private api = inject(ApiService);
  protected session = inject(SessionService);

  readonly year = new Date().getFullYear();
  readonly people = signal<ManagedEnrollment[]>([]);
  readonly own = signal<ManagedEnrollment | null>(null);
  readonly loaded = signal(false);

  readonly isParent = computed(() =>
    this.session.has('manage_self_child_users')
  );
  readonly isEnrollable = computed(
    () => !this.isParent() && this.session.has('be_enrolled')
  );

  readonly enrolled = computed(
    () => this.people().filter((p) => p.status === 'enrolled').length
  );
  readonly pending = computed(
    () => this.people().filter((p) => p.status === 'pending').length
  );
  readonly notEnrolled = computed(
    () => this.people().filter((p) => p.status === 'none').length
  );
  /** Settimane di iscrizioni confermate non ancora segnate come pagate. */
  readonly unpaidWeeks = computed(() =>
    this.people()
      .filter((p) => p.status === 'enrolled')
      .reduce((n, p) => n + p.weeks.filter((w) => w.isPaid === false).length, 0)
  );

  ngOnInit(): void {
    if (this.isParent()) {
      this.api.getManagedEnrollments(this.year).subscribe({
        next: (response) => {
          if (response.body?.success) this.people.set(response.body.data);
          this.loaded.set(true);
        },
        error: (error) => {
          console.error(error);
          this.loaded.set(true);
        },
      });
    } else if (this.isEnrollable()) {
      this.api.getOwnEnrollment(this.year).subscribe({
        next: (response) => {
          if (response.body?.success) this.own.set(response.body.data);
          this.loaded.set(true);
        },
        error: (error) => {
          console.error(error);
          this.loaded.set(true);
        },
      });
    }
  }

  statusLabel(status: ManagedEnrollment['status']): string {
    switch (status) {
      case 'enrolled':
        return 'Sei iscritto';
      case 'pending':
        return 'La tua iscrizione è in attesa di approvazione';
      default:
        return 'Non sei ancora iscritto';
    }
  }
}
