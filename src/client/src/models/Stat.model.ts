import type { InferResponseType } from 'hono/client';
import { api } from '../services/api-client';

/**
 * Risposta di GET /attendances/grouped: le presenze del giorno raggruppate per
 * scuola e classe.
 *
 * Non e' piu' scritta a mano. Prima ancora era dichiarata come
 * `School[] & { total, classes }`, cioe' un array intersecato con un oggetto:
 * non corrispondeva alla risposta del server e faceva accettare al compilatore
 * accessi che a runtime davano undefined.
 */
type GroupedResponse = InferResponseType<
  typeof api.attendances.grouped.$get,
  200
>;

export type AttendancesStat = Extract<
  GroupedResponse,
  { success: true }
>['data'];

export type SchoolAttendancesStat = AttendancesStat['schools'][number];
export type ClassAttendancesStat = SchoolAttendancesStat['classes'][number];
