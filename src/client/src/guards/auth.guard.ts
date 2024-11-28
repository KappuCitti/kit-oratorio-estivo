/*
 *   Copyright (c) 2024 KappuCitti.
 *   All rights reserved.
 *
 *   Licensed under the MIT License.
 *   See LICENSE file in the project root for full license information.
 */
import { Injectable } from '@angular/core';
import { CanActivate, Router, } from '@angular/router';
import { Observable, of } from 'rxjs';

import { catchError, map } from 'rxjs/operators';
import { ApiService } from 'src/services/api.service';
import { CookieService } from 'src/services/cookies.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private apiService: ApiService, private router: Router) { }

  canActivate() {
    return this.apiService.getUser().pipe(
      map(response => {
        if (response.status === 200) {
          // L'API ha restituito 200, l'utente è autenticato

          return true;
        } else {
          // Qualsiasi altra risposta, non autenticato
          this.router.navigate(['/login']); // Redirigi all'area di login o altro
          return false;
        }
      }),
      // Gestisci eventuali errori, consideriamo l'utente non autenticato
      catchError(() => {
        this.router.navigate(['/login']); // Redirigi all'area di login o altro
        return of(false); // Restituisci false per bloccare la navigazione
      })
    );
  }
}