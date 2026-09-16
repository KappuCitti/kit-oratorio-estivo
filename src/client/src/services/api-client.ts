import { hc } from 'hono/client';
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
