import { hc } from 'hono/client';
import { Observable, from } from 'rxjs';
import { environment } from '../environments/environment';
import type { ApiType } from '../models/api.generated';

/**
 * Client tipizzato verso l'API, costruito sul contratto generato dal server
 * (RPC di Hono).
 *
 * Percorsi, parametri, corpo della richiesta e forma della risposta non sono
 * riscritti qui: li dichiara il server. Cambiare una rotta e dimenticarsi del
 * client diventa un errore di compilazione, invece di un 404 scoperto in
 * produzione.
 *
 * `credentials: 'include'` e' impostato una volta sola: l'autenticazione usa un
 * cookie HttpOnly, e prima ogni singolo metodo ripeteva `withCredentials: true`
 * a mano - trentotto volte, con il rischio che la trentanovesima se lo
 * dimenticasse.
 *
 * Il prefisso `/api/v1` sta qui e non nei tipi: sul server e' configurabile a
 * runtime, quindi non e' un letterale e non puo' far parte del contratto.
 */
export const api = hc<ApiType>(`${environment.server}/api/v1`, {
  init: { credentials: 'include' },
});

/** Esito di una chiamata: lo stato HTTP e il corpo gia' decodificato. */
export interface ApiResult<T> {
  status: number;
  body: T;
}

/**
 * Errore di una richiesta andata male.
 *
 * `fetch` NON lancia sugli stati 4xx e 5xx: risolve normalmente. `HttpClient`
 * invece lancia, e tutto il codice che chiama l'API conta su quel
 * comportamento per mostrare i messaggi d'errore nel ramo `error:` della
 * subscribe. Senza questa conversione una 403 finirebbe nel ramo `next:`, il
 * controllo `if (status == 200)` fallirebbe e l'utente non vedrebbe nulla.
 */
export class ApiError extends Error {
  constructor(readonly status: number, readonly body: unknown) {
    super(`La richiesta e' fallita con stato ${status}`);
    this.name = 'ApiError';
  }
}

type BodyOf<R> = R extends { json(): Promise<infer T> } ? T : never;

/**
 * Trasforma la Promise restituita da `hc` in un Observable con la stessa forma
 * che i componenti gia' si aspettano (`{ status, body }`), cosi' i punti di
 * chiamata restano `.subscribe()` e non vanno riscritti tutti insieme.
 */
export function request<R extends { status: number; json(): Promise<unknown> }>(
  call: Promise<R>
): Observable<ApiResult<BodyOf<R>>> {
  return from(
    call.then(async (response) => {
      const body = (await response.json()) as BodyOf<R>;
      if (response.status >= 400) throw new ApiError(response.status, body);
      return { status: response.status, body };
    })
  );
}
