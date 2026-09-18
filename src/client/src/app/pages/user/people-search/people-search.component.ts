import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FamilyMember } from '../../../../models/Family.model';
import { ApiService } from '../../../../services/api.service';
import { SessionService } from '../../../../services/session.service';
import { FamilyMemberComponent } from '../../../components/family-member/family-member.component';
import { FooterComponent } from '../../../components/footer/footer.component';
import { NavbarComponent } from '../../../components/navbar/navbar.component';

/**
 * Il nucleo familiare visto dal genitore: i propri dati e le persone che
 * gestisce.
 *
 * I dati sono in sola lettura: il server non ha ancora una rotta con cui un
 * genitore modifichi la propria anagrafica o quella dei figli (la rubrica
 * dell'amministratore richiede `manage_users`). Prima la pagina mostrava
 * `app-parent` in modifica, con i campi dello schema v1 e un salvataggio che
 * non andava da nessuna parte.
 */
@Component({
  selector: 'app-people-search',
  imports: [
    NavbarComponent,
    FooterComponent,
    FaIconComponent,
    RouterLink,
    FamilyMemberComponent,
  ],
  templateUrl: './people-search.component.html',
})
export class PeopleSearchComponent implements OnInit {
  private api = inject(ApiService);
  protected session = inject(SessionService);

  faPlus = faPlus;

  readonly childs = signal<FamilyMember[]>([]);
  readonly loading = signal(true);

  ngOnInit(): void {
    this.api.getManagedPeople().subscribe({
      next: (response) => {
        if (response.body?.success) this.childs.set(response.body.data);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading data', error);
        this.loading.set(false);
      },
    });
  }
}
