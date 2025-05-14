import { createErrorResult, createSuccessResult } from '@/utils/createResult';
import { dbLogger } from '../logger';
import { HttpStatusCodes } from '@/codes';
import { db } from '..';
import { inArray, sql } from 'drizzle-orm';
import { weekTable } from '../schema/week';
import { dateYear } from '../utils/year';

export async function getWeeksYear(weeks: number[]) {
  try {
    const years = await db
      .selectDistinct({
        year: dateYear(weekTable.startDate),
      })
      .from(weekTable)
      .where(inArray(weekTable.id, weeks));
    if (years.length > 1) return createErrorResult(HttpStatusCodes.BAD_REQUEST);
    return createSuccessResult(years[0].year);
  } catch (e) {
    dbLogger.error(e);
    return createErrorResult(HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
}
