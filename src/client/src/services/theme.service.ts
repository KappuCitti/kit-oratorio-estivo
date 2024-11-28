/*
 *   Copyright (c) 2024 KappuCitti.
 *   All rights reserved.
 *
 *   Licensed under the MIT License.
 *   See LICENSE file in the project root for full license information.
 */
import { EventEmitter, Injectable } from '@angular/core';
import { CookieService } from './cookies.service';
import { Theme } from 'src/models/Theme.model';
import { ApiService } from './api.service';
import { ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  themeChange = new EventEmitter<string>();

  constructor(private api: ApiService, private cookieService: CookieService) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
      if (this.cookieService.getCookie('user_theme') === 'System') {
        this.cookieService.setCookie('user_theme', event.matches ? 'Dark' : 'Light');
        this.themeChange.emit(this.getTheme());
      }
    });
  }

  setTheme(theme: Theme): void {
    this.api.settingSetTheme(theme).subscribe(
      () => {
        this.cookieService.setCookie('user_theme', theme);
        this.themeChange.emit(this.getTheme());
      }
    );
  }

  getTheme(): string {
    if (!window.location.pathname.startsWith('/admin'))
      return 'Light'.toLowerCase();

    const themeCookieSetting = this.cookieService.getCookie('user_theme');

    if (themeCookieSetting === 'System' || !themeCookieSetting) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'Dark' : 'Light';
    }

    const theme = themeCookieSetting ? themeCookieSetting as Theme : 'Light';

    return theme.toLocaleLowerCase();
  }
}
