import { sql } from 'drizzle-orm';
import { db } from '..';
import { weekTable } from '../schema';
import { HttpStatusCodes } from '@/codes';
import { createErrorResult, createSuccessResult } from '@/utils/createResult';

export async function getWeeks(year: number) {
  try {
    const weeks = await db.query.weekTable.findMany({
      where: sql`YEAR(${weekTable.startDate}) = ${year}`,
    });
    return createSuccessResult(weeks);
  } catch (e) {
    console.error(e);
    return createErrorResult(HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
}
