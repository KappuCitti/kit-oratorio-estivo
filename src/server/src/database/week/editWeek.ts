import { HttpStatusCodes } from '@/codes';
import { DatabaseError } from '@/errors/database';
import { eq } from 'drizzle-orm';
import { db } from '..';
import { weekTable } from '../schema/week';

export interface WeekChanges {
  maxEnrollments?: number;
  allowOverbooking?: boolean;
}

/**
 * Cambia il limite di posti di una settimana e cosa succede quando e' pieno.
 * Abbassare il limite sotto gli iscritti gia' confermati e' permesso: non si
 * cancella nessuno, semplicemente le nuove richieste seguono la regola scelta.
 */
export async function editWeek(id: number, changes: WeekChanges) {
  const exists = !!(await db.query.weeks.findFirst({
    where: eq(weekTable.id, id),
  }));
  if (!exists)
    throw new DatabaseError(HttpStatusCodes.NOT_FOUND, 'week_not_found');

  if (
    changes.maxEnrollments === undefined &&
    changes.allowOverbooking === undefined
  )
    throw new DatabaseError(HttpStatusCodes.BAD_REQUEST, 'nothing_to_change');

  await db.update(weekTable).set(changes).where(eq(weekTable.id, id));
}
