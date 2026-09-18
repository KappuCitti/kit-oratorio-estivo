import type { InferRequestType } from 'hono/client';
import { api } from '../services/api-client';

export interface Request {
  page?: number;
  size?: number;
}

/**
 * I corpi delle richieste non sono piu' scritti a mano: li dichiara il server.
 *
 * Quelli precedenti parlavano ancora lo schema v1 (`schoolType`, `className`,
 * `child`), che il server v2 non conosce: erano richieste che sarebbero state
 * rifiutate con 422 appena collegate davvero.
 */
export type EnrollmentGetRequest = InferRequestType<
  typeof api.enrollments.$get
>['query'];

export type EnrollmentUpdateRequest = InferRequestType<
  (typeof api.enrollments)[':id']['$put']
>['json'] & { id: number };

/** Richiesta di iscrizione inviata da un genitore (finisce in coda). */
export type QueueEnrollmentCreateRequest = InferRequestType<
  typeof api.enrollments.queue.$post
>['json'];

/** Approvazione di una richiesta in coda da parte di un amministratore. */
export type EnrollmentApprovalRequest = InferRequestType<
  typeof api.enrollments.$post
>['json'];

/** Iscrizione creata direttamente da un amministratore (sportello). */
export type AdminEnrollmentCreateRequest = InferRequestType<
  typeof api.admin.enrollments.$post
>['json'];

// --- Rubrica ---

export type PeopleGetRequest = InferRequestType<
  typeof api.admin.people.$get
>['query'];

export type PersonUpdateRequest = InferRequestType<
  (typeof api.admin.people)[':id']['$put']
>['json'];

export type FamilyCreateRequest = InferRequestType<
  typeof api.admin.family.$post
>['json'];

/** Una persona dentro la richiesta di creazione di un nucleo familiare. */
export type FamilyPersonRequest = FamilyCreateRequest['managed'][number];

/** Filtri della coda: ha i propri, non quelli dell'elenco iscrizioni. */
export type QueueGetRequest = InferRequestType<
  typeof api.enrollments.queue.$get
>['query'];

// --- Genitore ---

/** Registrazione pubblica. Il ruolo lo decide il server. */
export type RegisterRequest = InferRequestType<
  typeof api.user.register.$post
>['json'];

/** Un ragazzo aggiunto dal genitore al proprio nucleo. */
export type ManagedPersonCreateRequest = InferRequestType<
  typeof api.users.$post
>['json'];

// --- Squadre, scuole e classi ---
//
// Erano interfacce scritte a mano, con due errori gia' trovati in passato
// (`id: number | string`, `schooldId`). Dedotte dal contratto non possono
// piu' divergere.

export type TeamCreateRequest = InferRequestType<
  typeof api.teams.$post
>['json'];

export type TeamUpdateRequest = InferRequestType<
  (typeof api.teams)[':id']['$put']
>['json'] & { id: number };

export type SchoolCreateRequest = InferRequestType<
  typeof api.schools.$post
>['json'];

export type ClassCreateRequest = InferRequestType<
  typeof api.classes.$post
>['json'];
