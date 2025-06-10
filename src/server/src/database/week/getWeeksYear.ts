import { HttpStatusCodes } from '@/codes';
import { db } from '..';
import { inArray } from 'drizzle-orm';
import { weekTable } from '../schema/week';
import { dateYear } from '../utils/year';
import { DatabaseError } from '@/errors/database';

export async function getWeeksYear(weeks: number[]) {
  const years = await db
    .selectDistinct({
      year: dateYear(weekTable.startDate),
    })
    .from(weekTable)
    .where(inArray(weekTable.id, weeks));
  if (years.length > 1)
    throw new DatabaseError(HttpStatusCodes.BAD_REQUEST, 'cross_year_weeks');
  return years[0].year;
}
