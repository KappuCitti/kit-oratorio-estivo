import type { InferResponseType } from 'hono/client';
import { api } from '../services/api-client';

/**
 * Le persone della rubrica, come le restituisce il server.
 *
 * Sostituiscono `PeopleSearch`, `ChildSearch`, `ParentSearch`, `ChildResponse`
 * e `ParentResponse`, che descrivevano endpoint mai esistiti e che per giunta
 * dichiaravano campi sbagliati (`PeopleSearch` aveva `surname: gender`).
 */
type PeopleResponse = InferResponseType<typeof api.admin.people.$get, 200>;

export type PersonListItem = Extract<
  PeopleResponse,
  { success: true }
>['data']['elements'][number];

type PersonResponse = InferResponseType<
  (typeof api.admin.people)[':id']['$get'],
  200
>;

/** Dettaglio di una persona: include chi la gestisce e chi gestisce lei. */
export type PersonDetail = Extract<
  PersonResponse,
  { success: true }
>['data'];

type RolesResponse = InferResponseType<typeof api.roles.$get, 200>;

/** Un ruolo assegnabile a una persona. */
export type Role = Extract<RolesResponse, { success: true }>['data'][number];
