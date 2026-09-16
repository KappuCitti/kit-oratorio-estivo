import type { InferResponseType } from 'hono/client';
import { api } from '../services/api-client';
import { EnrollmentSearch } from './Enrollment.model';

/**
 * Una presenza, come la restituisce GET /attendances.
 *
 * Non e' piu' scritta a mano. La versione precedente dichiarava `user` come
 * `UserSimplified`, quindi con un campo `gender` che il server non restituisce
 * e che nessuna parte della pagina presenze usa.
 */
type AttendancesResponse = InferResponseType<typeof api.attendances.$get, 200>;

export type AttendanceSearch = Extract<
  AttendancesResponse,
  { success: true }
>['data'][number];

// mix enrollmentId with attendance in one type
export type EnrollmentAttendanceSearch = EnrollmentSearch & {
  present: boolean;
  attendance?: AttendanceSearch;
};
