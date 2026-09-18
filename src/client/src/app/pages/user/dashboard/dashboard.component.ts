import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ManagedEnrollment } from '../../../../models/Enrollment.model';
import { ApiService } from '../../../../services/api.service';
import { SessionService } from '../../../../services/session.service';
import { FooterComponent } from '../../../components/footer/footer.component';
import { NavbarComponent } from '../../../components/navbar/navbar.component';

/**
 * La pagina iniziale di chi non e' un responsabile.
 *
 * Prima conteneva solo "Ciao, Lorem Ipsum" e un riquadro vuoto. Ora saluta per
 * nome e riassume l'anno: quanti ragazzi, quanti iscritti, quanti in attesa e
 * quante settimane restano da pagare.
 *
 * Il riepilogo si mostra solo a chi gestisce dei ragazzi: un ragazzo che accede
 * con il proprio account non ha il permesso di leggere quelle informazioni, e
 * la chiamata finirebbe in un 403.
 */
@Component({
  selector: 'app-dashboard',
  imports: [NavbarComponent, FooterComponent, RouterLink],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  private api = inject(ApiService);
  protected session = inject(SessionService);

  readonly year = new Date().getFullYear();
  readonly people = signal<ManagedEnrollment[]>([]);
  readonly loaded = signal(false);

  readonly isParent = computed(() =>
    this.session.has('manage_self_child_users')
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
    if (!this.isParent()) return;

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
  }
}
