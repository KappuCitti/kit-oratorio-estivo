import config from '@/config';
import type { CookieOptions } from 'hono/utils/cookie';

/**
 * Durata della sessione, in secondi. E' la stessa usata per calcolare
 * `sessions.expires` lato database: le due devono restare allineate, altrimenti
 * il browser continua a mandare un token che il server ha gia' scartato (o
 * viceversa).
 */
export const SESSION_DURATION_SECONDS = 30 * 24 * 60 * 60;

/**
 * Opzioni del cookie di sessione.
 *
 * Hono serializza solo gli attributi che gli vengono passati: chiamare
 * `setCookie(c, name, value)` senza opzioni produce un cookie senza HttpOnly,
 * senza Secure, senza SameSite e con il Path di default della RFC 6265 (la
 * directory dell'URL di login, quindi `/api/v1/user`). Questo oggetto esiste
 * perche' quelle opzioni non vengano dimenticate di nuovo.
 */
export const SESSION_COOKIE_OPTIONS: CookieOptions = {
  // Il token non deve essere leggibile da JavaScript: e' la differenza tra una
  // XSS fastidiosa e il furto di una sessione da 30 giorni.
  httpOnly: true,
  // In sviluppo il server gira in HTTP, quindi Secure lo renderebbe inutilizzabile.
  secure: config.useHttps,
  // Lax lascia passare la navigazione normale ma blocca le POST cross-site.
  sameSite: 'Lax',
  path: '/',
  maxAge: SESSION_DURATION_SECONDS,
};

/**
 * Il tema non e' un segreto e il client lo legge da JavaScript per evitare il
 * flash di tema sbagliato al primo render: qui HttpOnly non va messo.
 */
export const THEME_COOKIE_OPTIONS: CookieOptions = {
  httpOnly: false,
  secure: config.useHttps,
  sameSite: 'Lax',
  path: '/',
  maxAge: SESSION_DURATION_SECONDS,
};
