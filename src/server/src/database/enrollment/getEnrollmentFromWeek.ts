import { db } from '..';
import { enrollmentTable } from '../schema/enrollment';
import { and, eq, inArray } from 'drizzle-orm';
import { enrollmentWeeksTable } from '../schema/enrollmentWeek';

export async function getEnrollmentFromWeek(userId: string, weekId: number) {
  const [enrollment] = await db
    .select()
    .from(enrollmentTable)
    .where(
      and(
        eq(enrollmentTable.userId, userId),
        inArray(
          enrollmentTable.id,
          db
            .select({ enrollmentId: enrollmentWeeksTable.enrollmentId })
            .from(enrollmentWeeksTable)
            .where(eq(enrollmentWeeksTable.weekId, weekId))
            .as('weeks')
        )
      )
    )
    .limit(1);
  return enrollment;
}
