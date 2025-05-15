import { HttpStatusCodes } from '@/codes';
import { createErrorResult, createSuccessResult } from '@/utils/createResult';
import { dbLogger } from '../logger';
import { db } from '..';
import { enrollmentQueueTable } from '../schema/enrollmentQueue';
import { eq } from 'drizzle-orm';
import { teamTable } from '../schema/team';
import { enrollmentTable } from '../schema/enrollment';
import type { WeekEnrollment } from '@/models/week.model';
import { checkValidWeeks } from '../week/checkValidWeeks';
import { enrollmentQueueWeeksTable } from '../schema/enrollmentQueueWeek';
import { enrollmentWeeksTable } from '../schema/enrollmentWeek';

export async function approveEnrollment(
  queueId: number,
  section: string,
  weeks: WeekEnrollment[],
  teamId: number | null = null,
  managerNotes: string | null = null
) {
  try {
    const exists = !!(await db.query.enrollmentQueue.findFirst({
      where: eq(enrollmentQueueTable.id, queueId),
    }));
    if (!exists) return createErrorResult(HttpStatusCodes.NOT_FOUND);
    if (teamId) {
      const exists = !!(await db.query.teams.findFirst({
        where: eq(teamTable.id, teamId),
      }));
      if (!exists) return createErrorResult(HttpStatusCodes.BAD_REQUEST);
    }
    const weeksValid = await checkValidWeeks(weeks.map((w) => w.id));
    if (!weeksValid.success) return weeksValid;
    if (!weeksValid.data) return createErrorResult(HttpStatusCodes.BAD_REQUEST);
    return await db.transaction(async (tx) => {
      const queue = await tx.query.enrollmentQueue.findFirst({
        where: eq(enrollmentTable.id, queueId),
        columns: { id: false },
      });
      if (!queue) {
        tx.rollback();
        return createErrorResult(HttpStatusCodes.NOT_FOUND);
      }
      const queueWeeks = await tx.query.enrollmentQueueWeeks.findMany({
        where: eq(enrollmentQueueWeeksTable.enrollmentId, queueId),
      });
      const [enrollment] = await tx
        .insert(enrollmentTable)
        .values({
          ...queue,
          section,
          teamId,
          managerNotes,
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
      return createSuccessResult(enrollment.id);
    });
  } catch (e) {
    dbLogger.error(e);
    return createErrorResult(HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
}
