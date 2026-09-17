import type { InferResponseType } from 'hono/client';
import { api } from '../services/api-client';

/**
 * Scuole e classi, come le restituisce il server.
 *
 * Non sono piu' scritte a mano: gli id erano dichiarati `number | string`,
 * mentre il server usa sempre numeri.
 */
type SchoolsResponse = InferResponseType<typeof api.schools.$get, 200>;
type ClassesResponse = InferResponseType<typeof api.classes.$get, 200>;

export type School = Extract<
  SchoolsResponse,
  { success: true }
>['data'][number];

export type Class = Extract<
  ClassesResponse,
  { success: true }
>['data'][number];

/** Una classe come compare dentro una scuola: senza il rimando alla scuola. */
export type SchoolClass = School['classes'][number];
