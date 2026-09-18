import { Service, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import {
  catchError,
  filter,
  finalize,
  map,
  shareReplay,
  tap,
} from 'rxjs/operators';
import {
  PERMISSION_AREAS,
  type Area,
  type Permission,
} from '../models/permissions.generated';
import User from '../models/User.model';
import { ApiService } from './api.service';

/** L'area a cui appartiene un indirizzo, o null se non e' di nessuna. */
export function areaOfUrl(url: string): Area | null {
  if (url === '/admin' || url.startsWith('/admin/')) return 'admin';
  if (url === '/user' || url.startsWith('/user/')) return 'user';
  return null;
}

/**
 * Chi e' l'utente collegato e cosa gli e' permesso, nell'area in cui si trova.
 *
 * I permessi NON sono decisi qui: arrivano da GET /users/self, cioe' dagli
 * stessi `role_permissions` che il server consulta per autorizzare le
 * richieste. Il client non deduce niente dal nome del ruolo.
 *
 * I permessi non si sommano fra le aree. Su /admin l'utente agisce da
 * responsabile, su /user da genitore o ragazzo, e `has()` risponde solo con i
 * permessi dell'area corrente (PERMISSION_AREAS, generata dal server). Chi e'
 * responsabile e anche genitore vede quindi il menu da genitore su /user e
 * quello da responsabile su /admin, e nell'area utente segue le stesse regole
 * di ogni altro genitore.
 *
 * Le aree in cui l'utente puo' entrare le decide il server (`areas` in
 * GET /users/self).
 */
@Service()
export class SessionService {
  private api = inject(ApiService);
  private router = inject(Router);

  private readonly currentUser = signal<User | null>(null);

  readonly user = this.currentUser.asReadonly();
  readonly isLogged = computed(() => this.currentUser() !== null);

  /** Tutti i permessi del ruolo, senza distinzione di area. */
  private readonly allPermissions = computed<readonly Permission[]>(
    () => this.currentUser()?.role?.permissions ?? []
  );

  /** Le aree in cui l'utente puo' entrare. */
  readonly areas = computed<readonly Area[]>(
    () => this.currentUser()?.areas ?? []
  );

  /** Se l'utente ha accesso a entrambe le aree e puo' passare dall'una all'altra. */
  readonly hasBothAreas = computed(
    () => this.areas().includes('admin') && this.areas().includes('user')
  );

  /** L'area in cui si entra dopo il login: quella admin, se c'e'. */
  readonly defaultArea = computed<Area>(() =>
    this.areas().includes('admin') ? 'admin' : 'user'
  );

  private readonly url = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map((e) => e.urlAfterRedirects)
    ),
    { initialValue: this.router.url }
  );

  /**
   * L'area in cui si trova l'utente: quella dell'indirizzo corrente, oppure,
   * sulle pagine comuni (home, login), quella predefinita.
   */
  readonly area = computed<Area>(
    () => areaOfUrl(this.url()) ?? this.defaultArea()
  );

  /** I permessi validi nell'area corrente. */
  readonly permissions = computed<readonly Permission[]>(() =>
    this.permissionsIn(this.area())
  );

  readonly landingPath = computed(() => `/${this.defaultArea()}/dashboard`);

  // Richiesta in corso, condivisa: durante una navigazione piu' guard possono
  // chiedere l'utente nello stesso istante, e senza questo partirebbe una
  // chiamata a testa.
  private pending: Observable<User | null> | null = null;

  permissionsIn(area: Area): Permission[] {
    if (!this.areas().includes(area)) return [];
    return this.allPermissions().filter((p) =>
      (PERMISSION_AREAS[p] as readonly Area[]).includes(area)
    );
  }

  canEnter(area: Area): boolean {
    return this.areas().includes(area);
  }

  /** Il permesso vale nell'area corrente. */
  has(permission: Permission): boolean {
    return this.permissions().includes(permission);
  }

  hasAll(...permissions: Permission[]): boolean {
    return permissions.every((permission) => this.has(permission));
  }

  hasAny(...permissions: Permission[]): boolean {
    return permissions.some((permission) => this.has(permission));
  }

  /** Come `has`, ma in un'area precisa: serve alle guard, prima che l'indirizzo cambi. */
  hasIn(area: Area, permission: Permission): boolean {
    return this.permissionsIn(area).includes(permission);
  }

  /**
   * Restituisce l'utente collegato, chiedendolo al server solo se non e' gia'
   * noto. Un esito negativo non viene memorizzato: dopo un login la chiamata
   * successiva deve poter riuscire.
   */
  load(): Observable<User | null> {
    const known = this.currentUser();
    if (known) return of(known);
    if (this.pending) return this.pending;

    this.pending = this.api.getUser().pipe(
      map((response) =>
        response.status === 200 && response.body?.success
          ? response.body.data
          : null
      ),
      // Nessuna sessione (401) o server irraggiungibile: per chi chiama la
      // differenza non conta, in entrambi i casi non c'e' un utente.
      catchError(() => of(null)),
      tap((user) => this.currentUser.set(user)),
      finalize(() => (this.pending = null)),
      shareReplay({ bufferSize: 1, refCount: false })
    );

    return this.pending;
  }

  /** Da chiamare al logout: senza, il vecchio utente resterebbe in memoria. */
  clear(): void {
    this.currentUser.set(null);
    this.pending = null;
  }
}
