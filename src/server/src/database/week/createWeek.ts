import { HttpStatusCodes } from '@/codes';
import { createErrorResult, createSuccessResult } from '@/utils/createResult';
import { dbLogger } from '../logger';
import { db } from '..';
import { and, eq, gt, lt, not, or, SQL } from 'drizzle-orm';
import { weekTable } from '../schema/week';
import { strDate } from '../utils/date';

export async function createWeek(
  startDate: string,
  endDate: string,
  price: number,
  maxEnrollments: number,
  registrationOpenDate: string,
  registrationCloseDate: string
) {
  try {
    const conflict = await db.query.weeks.findFirst({
      where: not(
        or(
          and(
            gt(weekTable.startDate, strDate(endDate)),
            gt(weekTable.endDate, strDate(endDate))
          ),
          and(
            lt(weekTable.startDate, strDate(startDate)),
            lt(weekTable.endDate, strDate(startDate))
          )
        ) as SQL
      ),
    });
    if (conflict) return createErrorResult(HttpStatusCodes.CONFLICT);
    const [week] = await db
      .insert(weekTable)
      .values({
        startDate: strDate(startDate),
        endDate: strDate(endDate),
        price: price.toString(),
        maxEnrollments,
        registrationOpenDate: strDate(registrationOpenDate),
        registrationCloseDate: strDate(registrationCloseDate),
      })
      .$returningId();
    return createSuccessResult(week.id);
  } catch (e) {
    dbLogger.error(e);
    return createErrorResult(HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
}
