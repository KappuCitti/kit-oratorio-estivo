import { HttpStatusCodes } from '@/codes';
import { db } from '..';
import { and, gt, lt, not, or, SQL } from 'drizzle-orm';
import { weekTable } from '../schema/week';
import { strDate } from '../utils/date';
import { DatabaseError } from '@/errors/database';

export async function createWeek(
  startDate: string,
  endDate: string,
  price: number,
  maxEnrollments: number,
  registrationOpenDate: string,
  registrationCloseDate: string
) {
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
  if (conflict)
    throw new DatabaseError(HttpStatusCodes.CONFLICT, 'week_exists');
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
  return week.id;
}
