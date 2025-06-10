import { eq } from 'drizzle-orm';
import { db } from '..';
import { weekTable } from '../schema/week';
import { dateYear } from '../utils/year';

export async function getWeeks(year: number) {
  const weeks = await db.query.weeks.findMany({
    where: eq(dateYear(weekTable.startDate), year),
  });
  return weeks;
}
