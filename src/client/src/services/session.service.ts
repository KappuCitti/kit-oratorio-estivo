import { Service, computed, inject, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, finalize, map, shareReplay, tap } from 'rxjs/operators';
import type { Permission } from '../models/permissions.generated';
import User from '../models/User.model';
import { ApiService } from './api.service';

/**
 * Chi e' l'utente collegato e cosa gli e' permesso.
 *
 * I permessi NON sono decisi qui: arrivano da GET /users/self, cioe' dagli
 * stessi `role_permissions` che il server consulta per autorizzare le
 * richieste. Il client non ha una sua idea di chi sia amministratore, e non
 * deduce niente dal nome del ruolo: guarda solo l'elenco dei permessi che il
 * server gli ha mandato.
 *
 * I nomi dei permessi arrivano da permissions.generated.ts, generato dal
 * server: un permesso scritto male o non piu' esistente e' un errore di
 * compilazione, non una condizione sempre falsa scoperta in produzione.
 */
@Service()
export class SessionService {
  private api = inject(ApiService);

  private readonly currentUser = signal<User | null>(null);

  readonly user = this.currentUser.asReadonly();
  readonly isLogged = computed(() => this.currentUser() !== null);
  readonly permissions = computed<readonly Permission[]>(
    () => this.currentUser()?.role?.permissions ?? []
  );

  /**
   * La pagina iniziale dipende da cosa l'utente puo' fare, non dal nome del suo
   * ruolo: chi puo' vedere gli iscritti entra nell'area di amministrazione, gli
   * altri nella propria.
   */
  readonly landingPath = computed(() =>
    this.has('see_users') ? '/admin/dashboard' : '/user/dashboard'
  );

  // Richiesta in corso, condivisa: durante una navigazione piu' guard possono
  // chiedere l'utente nello stesso istante, e senza questo partirebbe una
  // chiamata a testa.
  private pending: Observable<User | null> | null = null;

  has(permission: Permission): boolean {
    return this.permissions().includes(permission);
  }

  hasAll(...permissions: Permission[]): boolean {
    return permissions.every((permission) => this.has(permission));
  }

  hasAny(...permissions: Permission[]): boolean {
    return permissions.some((permission) => this.has(permission));
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
