import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import type { Permission } from '../models/permissions.generated';
import { SessionService } from '../services/session.service';

/*
 * Il cookie di sessione e' HttpOnly, quindi da JavaScript non e' leggibile:
 * l'unico modo per sapere se la sessione e' valida e' chiederlo al server.
 * La vecchia versione leggeva `user_token` con CookieService e usciva subito se
 * era vuoto: con un cookie HttpOnly quel controllo manderebbe sempre al login.
 *
 * Tutte le guard passano da SessionService, che la richiesta la fa una volta
 * sola e la condivide.
 */

/**
 * Consente l'accesso alle pagine di login/registrazione solo a chi NON ha una
 * sessione valida. Chi e' gia' autenticato viene mandato alla propria area.
 */
export const LoginGuard: CanActivateFn = () => {
  const session = inject(SessionService);
  const router = inject(Router);

  return session.load().pipe(
    map((user) => {
      if (!user) return true;
      return router.parseUrl(session.landingPath());
    })
  );
};

/** Protegge le pagine che richiedono una sessione, senza guardare i permessi. */
export const AuthGuard: CanActivateFn = () => {
  const session = inject(SessionService);
  const router = inject(Router);

  return session
    .load()
    .pipe(map((user) => (user ? true : router.parseUrl('/login'))));
};

/**
 * Protegge una pagina con gli stessi permessi che il server pretende sulle
 * rotte che quella pagina chiama.
 *
 * Chi non li ha non viene lasciato sulla pagina: le voci di menu
 * corrispondenti sono gia' nascoste dalla navbar, e chi arriva scrivendo
 * l'indirizzo a mano viene riportato alla propria pagina iniziale. Il server
 * rifiuterebbe comunque le chiamate, ma mostrare una pagina che non puo'
 * funzionare sarebbe solo un modo piu' lento di dire di no.
 *
 * I permessi sono del tipo generato dal server: scriverne uno inesistente non
 * compila.
 */
export function permissionGuard(...required: Permission[]): CanActivateFn {
  return () => {
    const session = inject(SessionService);
    const router = inject(Router);

    return session.load().pipe(
      map((user) => {
        if (!user) return router.parseUrl('/login');
        if (session.hasAll(...required)) return true;
        return router.parseUrl(session.landingPath());
      })
    );
  };
}
