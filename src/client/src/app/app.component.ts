import { RouterOutlet } from '@angular/router';

import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { ThemeService } from '../services/theme.service';
import { Router, NavigationEnd } from '@angular/router';
import { Theme } from '../models/Theme.model';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './app.component.html',
})
export class AppComponent {
  private themeService = inject(ThemeService);
  private router = inject(Router);

  constructor() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.themeService.setTheme(this.themeService.getTheme() as Theme);
      }
    });
  }
}
