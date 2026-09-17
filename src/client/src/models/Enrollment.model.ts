import type { InferResponseType } from 'hono/client';
import { api } from '../services/api-client';

/**
 * Le iscrizioni, come le restituisce il server.
 *
 * Non sono piu' scritte a mano. La versione precedente parlava ancora lo
 * schema v1: `schoolType`, `className` e un oggetto `family` con figlio e
 * genitori. In v2 l'iscrizione punta a una CLASSE (`class`, che appartiene a
 * una `school`) e ha una `section`; il ragazzo e' `user` e i genitori si
 * leggono da `managers` nel dettaglio.
 */
type SearchResponse = InferResponseType<typeof api.enrollments.$get, 200>;

/** Un elemento della lista iscrizioni (GET /enrollments). */
export type EnrollmentSearch = Extract<
  SearchResponse,
  { success: true }
>['data']['elements'][number];

type DetailResponse = InferResponseType<
  (typeof api.enrollments)[':id']['$get'],
  200
>;

/** Il dettaglio di una singola iscrizione (GET /enrollments/{id}). */
type Enrollment = Extract<DetailResponse, { success: true }>['data'];

export default Enrollment;

/** Le settimane selezionate dentro un'iscrizione. */
export type EnrollmentWeekSearch = EnrollmentSearch['weeks'][number];

export type EnrollmentClass = EnrollmentSearch['class'];
export type EnrollmentSchool = EnrollmentSearch['school'];

type QueueResponse = InferResponseType<
  typeof api.enrollments.queue.$get,
  200
>;

/** Una richiesta di iscrizione in attesa di approvazione. */
export type QueueEnrollment = Extract<
  QueueResponse,
  { success: true }
>['data']['elements'][number];
