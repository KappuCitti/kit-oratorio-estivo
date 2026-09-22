import { NgClass } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
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
  /**
   * Permesso richiesto; con una lista ne basta uno. Se manca, la voce vale per
   * chiunque sia collegato.
   */
  permission?: Permission | Permission[];
  /** Funzione non ancora realizzata: la voce si vede ma non e' cliccabile. */
  disabled?: boolean;
  /**
   * Questa voce ha una pagina solo sotto /admin: su /user quell'indirizzo non
   * esiste. Non basta escluderla col permesso, perche' un responsabile che e'
   * anche genitore quel permesso ce l'ha comunque: e' un fatto sulla rotta, non
   * su chi e' collegato.
   */
  adminOnly?: boolean;
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
   * Il router notifica la navigazione con un flusso di eventi (e' un'API a
   * Observable): lo si porta nel mondo dei signal una volta sola, con
   * `toSignal`, senza operatori RxJS di mezzo. Il resto - riconoscere
   * l'evento giusto, leggere l'indirizzo - resta nel mondo dei signal, dentro
   * i `computed` qui sotto.
   */
  private readonly navigation = toSignal(this.router.events, {
    initialValue: null,
  });

  /**
   * In quale zona del sito ci si trova: lo dice l'indirizzo, non i permessi.
   * Chi e' responsabile e anche genitore vede quindi il menu giusto per la
   * pagina che ha aperto, non sempre quello da responsabile.
   */
  readonly isAdminArea = computed(() => {
    const event = this.navigation();
    const url = event instanceof NavigationEnd ? event.urlAfterRedirects : this.router.url;
    return url.startsWith('/admin');
  });
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
        // Il genitore vede le iscrizioni dei figli, il ragazzo la propria.
        permission: admin
          ? 'see_users'
          : ['manage_self_child_users', 'be_enrolled'],
      },
      {
        url: `${base}/attendances`,
        icon: this.faHighlighter,
        title: 'Presenze',
        permission: 'manage_attendances',
        adminOnly: true,
      },
      {
        url: `${base}/teams`,
        icon: this.faFlag,
        title: 'Squadre',
        permission: 'manage_teams',
        adminOnly: true,
      },
      {
        url: `${base}/settings`,
        icon: this.faGears,
        title: 'Impostazioni',
        permission: 'manage_classes',
        adminOnly: true,
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
      // queste rotte esiste, quindi restano non cliccabili. Sono comunque
      // gestione lato oratorio (adminOnly): un genitore non ha motivo di
      // vederle come segnaposto nella propria area.
      {
        url: `${base}/trips`,
        icon: this.faMountainSun,
        title: 'Eventi',
        permission: 'manage_events',
        disabled: true,
        adminOnly: true,
      },
      {
        url: `${base}/staff`,
        icon: this.faUserGear,
        title: 'Staff',
        permission: 'manage_users',
        disabled: true,
        adminOnly: true,
      },
      {
        url: `${base}/leaderboard`,
        icon: this.faChartLine,
        title: 'Classifica',
        permission: 'manage_teams',
        disabled: true,
        adminOnly: true,
      },
      {
        url: `${base}/games`,
        icon: this.faDragon,
        title: 'Giochi',
        permission: 'manage_activities',
        disabled: true,
        adminOnly: true,
      },
      {
        url: `${base}/music`,
        icon: this.faMusic,
        title: 'Musica',
        permission: 'manage_activities',
        disabled: true,
        adminOnly: true,
      },
    ];

    return all.filter((page) => {
      if (page.adminOnly && !admin) return false;
      if (!page.permission) return true;
      const richiesti = Array.isArray(page.permission)
        ? page.permission
        : [page.permission];
      return this.session.hasAny(...richiesti);
    });
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
