import {
  Injectable,
  Signal,
  signal,
  computed,
  effect,
  inject,
  Renderer2,
} from '@angular/core';
import { CookiesService } from './cookies.service';
import { Theme, themes } from '../models/Theme.model';
import { ApiService } from './api.service';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private document = inject(DOCUMENT);
  private api = inject(ApiService);
  private cookiesService = inject(CookiesService);

  private userTheme = signal<Theme>(this.getInitialTheme());

  themeChange: Signal<string> = computed(() => {
    return this.userTheme();
  });

  constructor() {
    // Effetto reattivo per aggiornare il tema quando cambia la preferenza di sistema
    effect(() => {
      if (
        this.userTheme() === 'System' &&
        !document.documentElement.hasAttribute('data-theme')
      ) {
        const prefersdark = window.matchMedia(
          '(prefers-color-scheme: dark)'
        ).matches;
        this.userTheme.set(prefersdark ? themes.Dark : themes.Light);
      }
    });

    effect(() => {
      this.userTheme();
      this.setTheme(this.userTheme());
    });

    // Ascolta i cambiamenti del tema di sistema
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', (event) => {
        if (this.userTheme() === themes.System) {
          this.userTheme.set(event.matches ? themes.Dark : themes.Light);
        }
      });
  }

  getTheme(): string {
    const theme = window.location.pathname.startsWith('/admin')
      ? this.getInitialTheme()
      : 'dark';

    return theme;
  }

  /** Imposta il tema e aggiorna sia il cookie che il Signal */
  setTheme(theme: Theme): void {
    this.userTheme.set(theme);
    document.documentElement.setAttribute(
      'data-theme',
      this.getInitialTheme().toLocaleLowerCase()
    );
  }

  updateCookieAndSetTheme(theme: Theme): void {
    // this.api.settingSetTheme(theme).subscribe(() => { // TODO
    this.cookiesService.setCookie('user_theme', theme);
    this.setTheme(theme);
    // });
  }

  /** Ritorna il tema iniziale leggendo dal cookie o dalle impostazioni di sistema */
  private getInitialTheme(): Theme {
    const themeCookieSetting = this.cookiesService.getCookie(
      'user_theme'
    ) as Theme;

    if (themeCookieSetting == themes.System) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? themes.Dark
        : themes.Light;
    } else if (!themeCookieSetting) return themes.Light;

    return themeCookieSetting;
  }
}
