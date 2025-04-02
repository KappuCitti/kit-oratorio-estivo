import { CommonModule } from '@angular/common';
import { Component, computed, Signal, signal } from '@angular/core';
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
} from '@fortawesome/free-solid-svg-icons';
import { ApiService } from '../../../services/api.service';

interface Page {
  url: string;
  icon: IconDefinition;
  title: string;
  enabled?: boolean; // Don't show the button
  disabled?: boolean; // Shows a disabled style
}

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  imports: [RouterLink, CommonModule, FontAwesomeModule],
})
export class NavbarComponent {
  faHouse = faHouse;
  faBars = faBars;
  faChevronLeft = faChevronLeft;
  faAddressBook = faAddressBook;
  faUsers = faUsers;
  faHighlighter = faHighlighter;
  faUserGear = faUserGear;
  faFlag = faFlag;
  faChartLine = faChartLine;
  faDragon = faDragon;
  faMusic = faMusic;
  faGears = faGears;
  faCircleUser = faCircleUser;

  isMenuOpenSignal = signal(false);
  isDropdownOpenSignal = signal(false);

  isMenuOpen = computed(() => this.isMenuOpenSignal());
  isDropdownOpen = computed(() => this.isDropdownOpenSignal());

  pages: Page[] = [
    {
      url: '/admin/people',
      icon: this.faAddressBook,
      title: 'Rubrica',
      disabled: false,
    },
    {
      url: '/admin/enrollments',
      icon: this.faUsers,
      title: 'Iscrizioni',
      disabled: false,
    },
    {
      url: '/admin/attendances',
      icon: this.faHighlighter,
      title: 'Presenze',
      disabled: false,
    },
    {
      url: '/admin/staff',
      icon: this.faUserGear,
      title: 'Staff',
      disabled: true,
    },
    {
      url: '/admin/teams',
      icon: this.faFlag,
      title: 'Squadre',
      disabled: false,
    },
    {
      url: '/admin/leaderboard',
      icon: this.faChartLine,
      title: 'Classifica',
      disabled: true,
    },
    {
      url: '/admin/games',
      icon: this.faDragon,
      title: 'Giochi',
      disabled: true,
    },
    {
      url: '/admin/music',
      icon: this.faMusic,
      title: 'Musica',
      disabled: true,
    },
    {
      url: '/admin/settings',
      icon: this.faGears,
      title: 'Impostazioni',
      disabled: true,
    },
  ];

  constructor(private api: ApiService, private router: Router) {}

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
