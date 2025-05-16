import { createErrorResult, createSuccessResult } from '@/utils/createResult';
import { dbLogger } from '../logger';
import { db } from '..';
import { and, eq, inArray } from 'drizzle-orm';
import { enrollmentTable } from '../schema/enrollment';
import { enrollmentWeeksTable } from '../schema/enrollmentWeek';
import { activityClassesTable } from '../schema/activityClasses';
import { HttpStatusCodes } from '@/codes';

export async function canUserJoinActivity(
  userId: string,
  activityId: number,
  weekId: number
) {
  try {
    const enrollments = await db
      .select()
      .from(enrollmentTable)
      .innerJoin(
        enrollmentWeeksTable,
        eq(enrollmentTable.id, enrollmentWeeksTable.enrollmentId)
      )
      .where(
        and(
          eq(enrollmentWeeksTable.weekId, weekId),
          eq(enrollmentTable.userId, userId),
          inArray(
            enrollmentTable.classId,
            db
              .select({
                classId: activityClassesTable.classId,
              })
              .from(activityClassesTable)
              .where(eq(activityClassesTable.activityId, activityId))
              .as('classes')
          )
        )
      )
      .limit(1);
    return createSuccessResult(enrollments.length > 0);
  } catch (e) {
    dbLogger.error(e);
    return createErrorResult(HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
}
