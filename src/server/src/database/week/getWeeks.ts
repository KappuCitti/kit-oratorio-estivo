import { sql } from 'drizzle-orm';
import { db } from '..';
import { HttpStatusCodes } from '@/codes';
import { createErrorResult, createSuccessResult } from '@/utils/createResult';
import { dbLogger } from '../logger';
import { weekTable } from '../schema/week';

export async function getWeeks(year: number) {
  try {
    const weeks = await db.query.weeks.findMany({
      where: sql`YEAR(${weekTable.startDate}) = ${year}`,
    });
    return createSuccessResult(weeks);
  } catch (e) {
    dbLogger.error(e);
    return createErrorResult(HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
}
