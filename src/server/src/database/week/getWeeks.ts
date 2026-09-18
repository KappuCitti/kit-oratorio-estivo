import { count, eq } from 'drizzle-orm';
import { db } from '..';
import { enrollmentWeeksTable } from '../schema/enrollmentWeek';
import { weekTable } from '../schema/week';
import { dateYear } from '../utils/year';

/**
 * Le settimane dell'anno, con il numero di iscrizioni confermate.
 *
 * Il conteggio serve a dire se una settimana e' piena; chi lo riceve per
 * intero lo decide il controller (vedi controllers/week/getWeekList.ts).
 */
export async function getWeeks(year: number) {
  const weeks = await db
    .select({
      id: weekTable.id,
      startDate: weekTable.startDate,
      endDate: weekTable.endDate,
      price: weekTable.price,
      maxEnrollments: weekTable.maxEnrollments,
      registrationOpenDate: weekTable.registrationOpenDate,
      registrationCloseDate: weekTable.registrationCloseDate,
      allowOverbooking: weekTable.allowOverbooking,
      enrolledCount: count(enrollmentWeeksTable.enrollmentId),
    })
    .from(weekTable)
    .leftJoin(enrollmentWeeksTable, eq(enrollmentWeeksTable.weekId, weekTable.id))
    .where(eq(dateYear(weekTable.startDate), year))
    .groupBy(weekTable.id)
    .orderBy(weekTable.startDate);

  return weeks.map((week) => ({
    ...week,
    isFull: week.enrolledCount >= week.maxEnrollments,
  }));
}
