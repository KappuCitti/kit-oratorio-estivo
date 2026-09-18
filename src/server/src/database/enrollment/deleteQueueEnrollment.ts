import { HttpStatusCodes } from '@/codes';
import { DatabaseError } from '@/errors/database';
import { eq } from 'drizzle-orm';
import { db } from '..';
import { enrollmentQueueTable } from '../schema/enrollmentQueue';
import { enrollmentQueueWeeksTable } from '../schema/enrollmentQueueWeek';

/**
 * Rifiuta una richiesta di iscrizione in coda, cancellandola.
 *
 * Senza questa rotta un responsabile poteva solo approvare: una richiesta
 * sbagliata o doppia restava in coda per sempre.
 */
export async function deleteQueueEnrollment(id: number) {
  const exists = !!(await db.query.enrollmentQueue.findFirst({
    where: eq(enrollmentQueueTable.id, id),
  }));
  if (!exists)
    throw new DatabaseError(
      HttpStatusCodes.NOT_FOUND,
      'enrollment_queue_not_found'
    );

  await db.transaction(async (tx) => {
    await tx
      .delete(enrollmentQueueWeeksTable)
      .where(eq(enrollmentQueueWeeksTable.enrollmentId, id));
    await tx
      .delete(enrollmentQueueTable)
      .where(eq(enrollmentQueueTable.id, id));
  });
}
