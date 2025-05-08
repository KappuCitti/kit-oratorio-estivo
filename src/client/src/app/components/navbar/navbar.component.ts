import { CommonModule } from '@angular/common';
import { Component, computed, OnInit, Signal, signal } from '@angular/core';
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
  faMountainCity,
  faMountainSun,
} from '@fortawesome/free-solid-svg-icons';
import { ApiService } from '../../../services/api.service';
import { filter } from 'rxjs';

interface Page {
  url: string;
  icon: IconDefinition;
  title: string;
  display?: boolean; // Don't show the button
  disabled?: boolean; // Shows a disabled style
}

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  imports: [RouterLink, CommonModule, FontAwesomeModule],
})
export class NavbarComponent implements OnInit {
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

  isMenuOpenSignal = signal(false);
  isDropdownOpenSignal = signal(false);

  isMenuOpen = computed(() => this.isMenuOpenSignal());
  isDropdownOpen = computed(() => this.isDropdownOpenSignal());

  isAdmin = signal(false);
  baseURL = computed(() => (this.isAdmin() ? '/admin' : '/user'));

  // TODO - Replace all display with a proper check for the user role

  pages = computed<Page[]>(() => [
    // Admin pages
    {
      url: `${this.baseURL()}/people`,
      icon: this.faAddressBook,
      title: 'Rubrica',
      display: this.isAdmin() && true,
      disabled: false,
    },
    {
      // User and admins
      url: `${this.baseURL()}/enrollments`,
      icon: this.isAdmin() ? this.faUsers : this.faUserPen,
      title: 'Iscrizioni',
      display: true,
      disabled: false,
    },
    {
      url: `${this.baseURL()}/attendances`,
      icon: this.faHighlighter,
      title: 'Presenze',
      display: this.isAdmin() && true,
      disabled: false,
    },
    {
      url: `${this.baseURL()}/trips`,
      icon: this.faMountainSun,
      title: 'Eventi',
      display: this.isAdmin() && true,
      disabled: true,
    },
    {
      url: `${this.baseURL()}/staff`,
      icon: this.faUserGear,
      title: 'Staff',
      display: this.isAdmin() && true,
      disabled: true,
    },
    {
      url: `${this.baseURL()}/teams`,
      icon: this.faFlag,
      title: 'Squadre',
      display: this.isAdmin() && true,
      disabled: false,
    },
    {
      url: `${this.baseURL()}/leaderboard`,
      icon: this.faChartLine,
      title: 'Classifica',
      display: this.isAdmin() && true,
      disabled: true,
    },
    {
      url: `${this.baseURL()}/games`,
      icon: this.faDragon,
      title: 'Giochi',
      display: this.isAdmin() && true,
      disabled: true,
    },
    {
      url: `${this.baseURL()}/music`,
      icon: this.faMusic,
      title: 'Musica',
      display: this.isAdmin() && true,
      disabled: true,
    },
    {
      url: `${this.baseURL()}/settings`,
      icon: this.faGears,
      title: 'Impostazioni',
      display: this.isAdmin() && true,
      disabled: false,
    },

    // User pages
    {
      url: `${this.baseURL()}/people`,
      icon: this.faUsers,
      title: 'Famiglia',
      display: !this.isAdmin() && true,
      disabled: false,
    },
  ]);

  constructor(private api: ApiService, private router: Router) {
    this.isAdmin.set(false);

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const url = event.urlAfterRedirects || event.url;
        this.isAdmin.set(url.includes('/admin/') ? true : false);
      });
  }

  ngOnInit(): void {}

  toggleMenu(): void {
    this.isMenuOpenSignal.set(!this.isMenuOpenSignal());
  }

  toggleDropdown(): void {
    this.isDropdownOpenSignal.set(!this.isDropdownOpenSignal());
  }

  logout(): void {
    this.api.logout().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }
}
