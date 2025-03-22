/*
 *   Copyright (c) 2024 KappuCitti.
 *   All rights reserved.
 *
 *   Licensed under the MIT License.
 *   See LICENSE file in the project root for full license information.
 */
// src/app/services/cookie.service.ts

import { Injectable } from '@angular/core';
import { CookieService as NgxCookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class CookiesService {
  constructor(private cookieService: NgxCookieService) {}

  setCookie(name: string, value: string, days: number = 1): void {
    const expireDate = new Date();
    expireDate.setDate(expireDate.getDate() + days);
    this.cookieService.set(name, value, expireDate, '/');
  }

  getCookie(name: string): string {
    return this.cookieService.get(name);
  }

  deleteCookie(name: string): void {
    this.cookieService.delete(name);
  }

  deleteAllCookies(): void {
    this.cookieService.deleteAll();
  }

  checkCookie(name: string): boolean {
    return this.cookieService.check(name);
  }
}
