import { inject } from '@angular/core';
import { CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { map } from 'rxjs/operators';
import type { Permission } from '../models/permissions.generated';
import { SessionService, areaOfUrl } from '../services/session.service';

/*
 * Il cookie di sessione e' HttpOnly, quindi da JavaScript non e' leggibile:
 * l'unico modo per sapere se la sessione e' valida e' chiederlo al server.
 *
 * Tutte le guard passano da SessionService, che la richiesta la fa una volta
 * sola e la condivide.
 *
 * I permessi si valutano nell'area dell'indirizzo DI DESTINAZIONE (/user o
 * /admin), non in quella corrente: durante la navigazione l'indirizzo non e'
 * ancora cambiato, e usare l'area di partenza lascerebbe entrare in /admin con
 * i permessi raccolti su /user, o viceversa.
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

/**
 * Protegge le pagine che richiedono una sessione. Se la pagina appartiene a
 * un'area in cui l'utente non puo' entrare (un genitore su /admin, un
 * responsabile senza famiglia su /user), si torna alla pagina iniziale.
 */
export const AuthGuard: CanActivateFn = (_route, state) => {
  const session = inject(SessionService);
  const router = inject(Router);

  return session.load().pipe(
    map((user) => {
      if (!user) return router.parseUrl('/login');
      const area = areaOfUrl(state.url);
      if (area && !session.canEnter(area))
        return router.parseUrl(session.landingPath());
      return true;
    })
  );
};

function guard(
  test: (session: SessionService, state: RouterStateSnapshot) => boolean
): CanActivateFn {
  return (_route, state) => {
    const session = inject(SessionService);
    const router = inject(Router);

    return session.load().pipe(
      map((user) => {
        if (!user) return router.parseUrl('/login');
        if (test(session, state)) return true;
        return router.parseUrl(session.landingPath());
      })
    );
  };
}

function areaOf(session: SessionService, state: RouterStateSnapshot) {
  return areaOfUrl(state.url) ?? session.defaultArea();
}

/**
 * Protegge una pagina con gli stessi permessi che il server pretende sulle
 * rotte che quella pagina chiama, valutati nell'area della pagina.
 *
 * Chi non li ha non viene lasciato sulla pagina: le voci di menu
 * corrispondenti sono gia' nascoste dalla navbar, e chi arriva scrivendo
 * l'indirizzo a mano viene riportato alla propria pagina iniziale.
 *
 * I permessi sono del tipo generato dal server: scriverne uno inesistente non
 * compila.
 */
export function permissionGuard(...required: Permission[]): CanActivateFn {
  return guard((session, state) => {
    const area = areaOf(session, state);
    return required.every((p) => session.hasIn(area, p));
  });
}

/**
 * Come `permissionGuard`, ma basta uno dei permessi: serve alle pagine che
 * mostrano cose diverse al genitore e al ragazzo.
 */
export function anyPermissionGuard(...required: Permission[]): CanActivateFn {
  return guard((session, state) => {
    const area = areaOf(session, state);
    return required.some((p) => session.hasIn(area, p));
  });
}
