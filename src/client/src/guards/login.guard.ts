/*
 *   Copyright (c) 2024 KappuCitti.
 *   All rights reserved.
 *
 *   Licensed under the MIT License.
 *   See LICENSE file in the project root for full license information.
 */
import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { map, catchError, of } from 'rxjs';
import { ApiService } from 'src/services/api.service';

import { CookieService } from 'src/services/cookies.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {

  constructor(private api: ApiService, private cookieService: CookieService, private router: Router) { }

  canActivate() {
    // Controlla se il token esiste
    const token = this.cookieService.getCookie('user_token');

    if (token) {
      // Se esiste, controlla la validit  con una richiesta GET all'endpoint user
      return this.api.getUser().pipe(
        map(response => {
          if (response.status === 200) {
            // Se la risposta  200, reindirizza alla dashboard
            this.router.navigate(['/admin']);
            return false;
          } else {
            // Se la risposta non  200, reindirizza alla home
            return true;
          }
        }),
        catchError(error => {
          // Se si verifica un errore, reindirizza alla home
          return of(true);
        })
      );
    } else {
      // Se non esiste, permette l'accesso
      return of(true);
    }
  }
}