/**
 * Risposta di GET /attendances/grouped.
 *
 * Forma verificata contro il server:
 *   { "total": 0, "schools": [] }
 *   { "total": 12, "schools": [
 *       { "id": 1, "name": "Elementari", "total": 12,
 *         "classes": [ { "id": 3, "name": "III", "total": 5 } ] } ] }
 *
 * Era dichiarata come `School[] & { total, classes }`, cioe' un array
 * intersecato con un oggetto: non corrispondeva alla risposta del server e
 * avrebbe fatto accettare al compilatore accessi che a runtime davano
 * undefined.
 */
export interface ClassAttendancesStat {
  id: number;
  name: string;
  total: number;
}

export interface SchoolAttendancesStat {
  id: number;
  name: string;
  total: number;
  classes: ClassAttendancesStat[];
}

export interface AttendancesStat {
  total: number;
  schools: SchoolAttendancesStat[];
}
