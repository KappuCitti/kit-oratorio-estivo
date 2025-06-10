import { db } from '..';
import { and, eq, inArray } from 'drizzle-orm';
import { enrollmentTable } from '../schema/enrollment';
import { enrollmentWeeksTable } from '../schema/enrollmentWeek';
import { activityClassesTable } from '../schema/activityClasses';

export async function canUserJoinActivity(
  userId: string,
  activityId: number,
  weekId: number
) {
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
  return enrollments.length > 0;
}
