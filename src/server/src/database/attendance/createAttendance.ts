import { DatabaseError } from '@/errors/database';
import { hasPermission } from '../permissions/hasPermission';
import { HttpStatusCodes } from '@/codes';
import { db } from '..';
import { enrollmentTable } from '../schema/enrollment';
import { enrollmentWeeksTable } from '../schema/enrollmentWeek';
import { and, eq, gte, lte } from 'drizzle-orm';
import { weekTable } from '../schema/week';
import { strDate } from '../utils/date';
import { attendanceTable } from '../schema/attendance';

export async function createAttendance(
  userId: string,
  date: string,
  eatsInOratory: boolean
) {
  const canBeManaged = await hasPermission(userId, 'be_managed');
  if (!canBeManaged)
    throw new DatabaseError(HttpStatusCodes.FORBIDDEN, 'cant_be_managed');
  const [enrollment] = await db
    .select({ id: enrollmentTable.id })
    .from(enrollmentTable)
    .innerJoin(
      enrollmentWeeksTable,
      eq(enrollmentTable.id, enrollmentWeeksTable.enrollmentId)
    )
    .innerJoin(weekTable, eq(enrollmentWeeksTable.weekId, weekTable.id))
    .where(
      and(
        eq(enrollmentTable.userId, userId),
        lte(weekTable.startDate, strDate(date)),
        gte(weekTable.endDate, strDate(date))
      )
    )
    .limit(1);
  if (!enrollment)
    throw new DatabaseError(HttpStatusCodes.NOT_FOUND, 'enrollment_not_found');
  const [attendance] = await db
    .insert(attendanceTable)
    .values({
      enrollmentId: enrollment.id,
      date: strDate(date),
      eatsInOratory,
    })
    .$returningId();

  return attendance.id;
}
