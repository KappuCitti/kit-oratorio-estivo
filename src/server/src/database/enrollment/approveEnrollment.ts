import { HttpStatusCodes } from '@/codes';
import { db } from '..';
import { enrollmentQueueTable } from '../schema/enrollmentQueue';
import { and, eq } from 'drizzle-orm';
import { teamTable } from '../schema/team';
import { enrollmentTable } from '../schema/enrollment';
import type { WeekEnrollment } from '@/models/week.model';
import { checkValidWeeks } from '../week/checkValidWeeks';
import { enrollmentQueueWeeksTable } from '../schema/enrollmentQueueWeek';
import { enrollmentWeeksTable } from '../schema/enrollmentWeek';
import { DatabaseError } from '@/errors/database';

export async function approveEnrollment(
  queueId: number,
  weeks: WeekEnrollment[],
  teamId: number | null = null,
  managerNotes: string | null = null,
  exitAuthorization: boolean | null = null
) {
  const exists = !!(await db.query.enrollmentQueue.findFirst({
    where: eq(enrollmentQueueTable.id, queueId),
  }));
  if (!exists)
    throw new DatabaseError(
      HttpStatusCodes.NOT_FOUND,
      'enrollment_queue_not_found'
    );
  if (teamId) {
    const exists = !!(await db.query.teams.findFirst({
      where: eq(teamTable.id, teamId),
    }));
    if (!exists)
      throw new DatabaseError(HttpStatusCodes.NOT_FOUND, 'team_not_found');
  }
  const weeksValid = await checkValidWeeks(weeks.map((w) => w.id));
  if (!weeksValid)
    throw new DatabaseError(HttpStatusCodes.BAD_REQUEST, 'invalid_weeks');
  return await db.transaction(async (tx) => {
    // Filtrava su `enrollmentTable.id`, cioe' su una colonna di un'altra
    // tabella: la query generata cercava `enrollments`.`id` dentro
    // `enrollment_queue`, quindi nessuna richiesta poteva essere approvata.
    const queue = await tx.query.enrollmentQueue.findFirst({
      where: eq(enrollmentQueueTable.id, queueId),
      columns: { id: false },
    });
    if (!queue) {
      throw new DatabaseError(
        HttpStatusCodes.NOT_FOUND,
        'enrollment_queue_not_found'
      );
    }

    // Fra l'invio e l'approvazione la stessa persona puo' essere stata
    // iscritta allo sportello: approvare darebbe una seconda iscrizione.
    const alreadyEnrolled = !!(await tx.query.enrollments.findFirst({
      where: and(
        eq(enrollmentTable.userId, queue.userId),
        eq(enrollmentTable.year, queue.year)
      ),
    }));
    if (alreadyEnrolled) {
      throw new DatabaseError(
        HttpStatusCodes.CONFLICT,
        'user_already_enrolled'
      );
    }
    const queueWeeks = await tx.query.enrollmentQueueWeeks.findMany({
      where: eq(enrollmentQueueWeeksTable.enrollmentId, queueId),
    });
    const [enrollment] = await tx
      .insert(enrollmentTable)
      .values({
        ...queue,
        teamId,
        managerNotes,
        exitAuthorization:
          exitAuthorization ?? queue.exitAuthorization ?? false,
      })
      .$returningId();
    await tx.insert(enrollmentWeeksTable).values(
      queueWeeks.map((w) => ({
        enrollmentId: enrollment.id,
        weekId: w.weekId,
        isPaid: weeks.find((ww) => ww.id === w.weekId)?.isPaid ?? false,
      }))
    );
    await tx
      .delete(enrollmentQueueWeeksTable)
      .where(eq(enrollmentQueueWeeksTable.enrollmentId, queueId));
    await tx
      .delete(enrollmentQueueTable)
      .where(eq(enrollmentQueueTable.id, queueId));
    return enrollment.id;
  });
}
