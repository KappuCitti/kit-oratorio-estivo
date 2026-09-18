import { NgClass } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  FontAwesomeModule,
  IconDefinition,
} from '@fortawesome/angular-fontawesome';
import {
  faAddressBook,
  faBars,
  faChartLine,
  faChevronLeft,
  faCircleUser,
  faDragon,
  faFlag,
  faGears,
  faHighlighter,
  faHouse,
  faMusic,
  faUserGear,
  faUsers,
  faUserPen,
  faMountainSun,
} from '@fortawesome/free-solid-svg-icons';
import type { Permission } from '../../../models/permissions.generated';
import { ApiService } from '../../../services/api.service';
import { SessionService } from '../../../services/session.service';

interface Page {
  url: string;
  icon: IconDefinition;
  title: string;
  /** Permesso richiesto; se manca, la voce vale per chiunque sia collegato. */
  permission?: Permission;
  /** Funzione non ancora realizzata: la voce si vede ma non e' cliccabile. */
  disabled?: boolean;
}

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  imports: [RouterLink, FontAwesomeModule, NgClass],
})
export class NavbarComponent {
  private api = inject(ApiService);
  private router = inject(Router);
  private session = inject(SessionService);

  faHouse = faHouse;
  faBars = faBars;
  faChevronLeft = faChevronLeft;
  faAddressBook = faAddressBook;
  faUsers = faUsers;
  faUserPen = faUserPen;
  faHighlighter = faHighlighter;
  faUserGear = faUserGear;
  faFlag = faFlag;
  faChartLine = faChartLine;
  faDragon = faDragon;
  faMusic = faMusic;
  faMountainSun = faMountainSun;
  faGears = faGears;
  faCircleUser = faCircleUser;

  readonly isMenuOpen = signal(false);
  readonly isDropdownOpen = signal(false);

  /**
   * In quale area si trova l'utente.
   *
   * Prima veniva dedotto dall'indirizzo corrente (`url.includes('/admin/')`):
   * bastava scrivere a mano un indirizzo /admin per far comparire l'intero
   * menu di amministrazione a chiunque. Ora dipende dai permessi che il server
   * ha restituito, esattamente come le guard delle rotte.
   */
  readonly isAdminArea = computed(() => this.session.has('see_users'));
  readonly baseURL = computed(() => (this.isAdminArea() ? '/admin' : '/user'));

  /**
   * Le voci visibili: quelle il cui permesso l'utente ha davvero.
   *
   * Il filtro non e' cosmetico. Una voce mostrata a chi non ha il permesso
   * porta a una pagina che il server rifiuta di riempire, quindi a un errore
   * al posto di un contenuto.
   */
  readonly pages = computed<Page[]>(() => {
    const base = this.baseURL();
    const admin = this.isAdminArea();

    const all: Page[] = [
      {
        url: `${base}/enrollments`,
        icon: admin ? this.faUsers : this.faUserPen,
        title: 'Iscrizioni',
        permission: admin ? 'see_users' : 'manage_self_child_users',
      },
      {
        url: `${base}/attendances`,
        icon: this.faHighlighter,
        title: 'Presenze',
        permission: 'manage_attendances',
      },
      {
        url: `${base}/teams`,
        icon: this.faFlag,
        title: 'Squadre',
        permission: 'manage_teams',
      },
      {
        url: `${base}/settings`,
        icon: this.faGears,
        title: 'Impostazioni',
        permission: 'manage_classes',
      },
      // La stessa voce serve due pagine diverse: la rubrica di tutte le
      // persone per i responsabili, il proprio nucleo familiare per i
      // genitori. Cambia quindi anche il permesso richiesto, perche' un
      // genitore non ha `see_users` e un responsabile non ha necessariamente
      // `manage_self_child_users`.
      {
        url: `${base}/people`,
        icon: this.faUsers,
        title: admin ? 'Rubrica' : 'Famiglia',
        permission: admin ? 'see_users' : 'manage_self_child_users',
      },

      // Funzioni dichiarate nel README ma non ancora realizzate: nessuna di
      // queste rotte esiste, quindi restano non cliccabili.
      {
        url: `${base}/trips`,
        icon: this.faMountainSun,
        title: 'Eventi',
        permission: 'manage_events',
        disabled: true,
      },
      {
        url: `${base}/staff`,
        icon: this.faUserGear,
        title: 'Staff',
        permission: 'manage_users',
        disabled: true,
      },
      {
        url: `${base}/leaderboard`,
        icon: this.faChartLine,
        title: 'Classifica',
        permission: 'manage_teams',
        disabled: true,
      },
      {
        url: `${base}/games`,
        icon: this.faDragon,
        title: 'Giochi',
        permission: 'manage_activities',
        disabled: true,
      },
      {
        url: `${base}/music`,
        icon: this.faMusic,
        title: 'Musica',
        permission: 'manage_activities',
        disabled: true,
      },
    ];

    return all.filter(
      (page) => !page.permission || this.session.has(page.permission)
    );
  });

  toggleMenu(): void {
    this.isMenuOpen.update((open) => !open);
  }

  toggleDropdown(): void {
    this.isDropdownOpen.update((open) => !open);
  }

  logout(): void {
    this.api.logout().subscribe(() => {
      // Senza questo l'utente precedente resterebbe in memoria e le guard
      // continuerebbero a considerarlo collegato fino al ricaricamento.
      this.session.clear();
      this.router.navigate(['/login']);
    });
  }
}
