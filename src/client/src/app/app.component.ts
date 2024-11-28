/*
 *   Copyright (c) 2024 KappuCitti.
 *   All rights reserved.
 *
 *   Licensed under the MIT License.
 *   See LICENSE file in the project root for full license information.
 */
import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { Theme } from 'src/models/Theme.model';
import { ThemeService } from 'src/services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'client';
  theme: string = this.themeService.getTheme();

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    private themeService: ThemeService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.themeService.themeChange.subscribe(theme => {
      this.theme = theme;
      this.renderer.setAttribute(this.document.body, 'data-bs-theme', this.theme);
    })

    this.router.events.subscribe(() => {
      this.theme = this.themeService.getTheme();
      this.renderer.setAttribute(this.document.body, 'data-bs-theme', this.theme);
    })

    this.renderer.setAttribute(this.document.body, 'data-bs-theme', this.theme);
  }
}
