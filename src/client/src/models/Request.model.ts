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

export interface TeamCreateRequest {
  name: string;
  color: string;
}

export interface TeamUpdateRequest {
  // Era `number | string`: il server accetta solo un numero.
  id: number;
  name?: string;
  color?: string;
  child?: {
    type: 'SET' | 'ADD';
    ids: number[];
  };
}
export interface SchoolCreateRequest {
  name: string;
  canChooseActivities: boolean;
}

export interface ClassCreateRequest {
  name: string;
  // Il server si aspetta `schoolId` (e un numero): era scritto `schooldId`,
  // quindi la chiamata sarebbe stata rifiutata con 422 appena collegata alla UI.
  schoolId: number;
}
