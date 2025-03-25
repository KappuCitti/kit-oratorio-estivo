import { eq, and, lte, gte, sql } from 'drizzle-orm';
import { db } from '..';
import { enrollmentWeeksTable, weekTable } from '../schema';

export async function enrollmentExistsInDate(
  enrollmentId: number,
  date: Date | string
) {
  const enrollments = await db
    .select()
    .from(enrollmentWeeksTable)
    .innerJoin(weekTable, eq(enrollmentWeeksTable.weekId, weekTable.id))
    .where(
      and(
        eq(enrollmentWeeksTable.enrollmentId, enrollmentId),
        lte(weekTable.startDate, sql`${date}`),
        gte(weekTable.endDate, sql`${date}`)
      )
    )
    .limit(1);
  return enrollments.length > 0;
}
