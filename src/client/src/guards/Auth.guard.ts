import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { ApiService } from '../services/api.service';
import { of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

/*
 * Il cookie di sessione e' HttpOnly, quindi da JavaScript non e' leggibile:
 * l'unico modo per sapere se la sessione e' valida e' chiederlo al server.
 * La vecchia versione leggeva `user_token` con CookieService e usciva subito se
 * era vuoto — con un cookie HttpOnly quel controllo manderebbe sempre al login.
 */

/**
 * Consente l'accesso alle pagine di login/registrazione solo a chi NON ha una
 * sessione valida. Chi e' gia' autenticato viene mandato alla propria area.
 */
export const LoginGuard: CanActivateFn = () => {
  const api = inject(ApiService);
  const router = inject(Router);

  return api.getUser().pipe(
    map((response) => {
      if (response.status === 200 && response.body?.success) {
        router.navigate(['/user']);
        return false;
      }
      return true;
    }),
    // Nessuna sessione (401) o server irraggiungibile: la pagina di login e'
    // proprio quello che serve.
    catchError(() => of(true))
  );
};

/**
 * Protegge le pagine che richiedono una sessione.
 *
 * TODO - Non distingue ancora `/user/*` da `/admin/*`: serve un
 * PermissionGuard che legga i permessi da GET /users/self. Finche' manca,
 * qualunque utente autenticato puo' aprire le pagine admin (il server rifiuta
 * comunque le chiamate, ma la UI non dovrebbe mostrarle).
 */
export const AuthGuard: CanActivateFn = () => {
  const api = inject(ApiService);
  const router = inject(Router);

  return api.getUser().pipe(
    map((response) => {
      if (response.status === 200 && response.body?.success) return true;
      router.navigate(['/login']);
      return false;
    }),
    catchError(() => {
      router.navigate(['/login']);
      return of(false);
    })
  );
};
