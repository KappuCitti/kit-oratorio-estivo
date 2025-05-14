import { HttpStatusCodes } from '@/codes';
import { dbLogger } from '../logger';
import { createErrorResult, createSuccessResult } from '@/utils/createResult';
import { db } from '..';
import { count, inArray } from 'drizzle-orm';
import { weekTable } from '../schema/week';

export async function checkValidWeeks(weeks: number[]) {
  try {
    const [result] = await db
      .select({ count: count() })
      .from(weekTable)
      .where(inArray(weekTable.id, weeks));
    return createSuccessResult(result.count === weeks.length);
  } catch (e) {
    dbLogger.error(e);
    return createErrorResult(HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
}
