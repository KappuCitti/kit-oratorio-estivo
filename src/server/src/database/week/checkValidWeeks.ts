import { db } from '..';
import { count, inArray } from 'drizzle-orm';
import { weekTable } from '../schema/week';

export async function checkValidWeeks(weeks: number[]) {
  const [result] = await db
    .select({ count: count() })
    .from(weekTable)
    .where(inArray(weekTable.id, weeks));
  return result.count === weeks.length;
}
