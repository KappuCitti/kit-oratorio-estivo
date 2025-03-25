import { HttpStatusCodes } from '@/codes';
import { createErrorResult, createSuccessResult } from '@/utils/createResult';
import { dbLogger } from '../logger';
import { db } from '..';
import { and, eq, gte, lte } from 'drizzle-orm';
import {
  attendanceTable,
  enrollmentTable,
  enrollmentWeeksTable,
  weekTable,
} from '../schema';

export async function createAttendance(
  enrollmentId: number,
  date: Date,
  present: boolean,
  eatsInOratory: boolean,
  eatsPlain: boolean
) {
  try {
    const attendanceExists = !!(await db.query.attendanceTable.findFirst({
      where: and(
        eq(attendanceTable.enrollmentId, enrollmentId),
        eq(attendanceTable.date, date)
      ),
    }));
    if (attendanceExists) return createErrorResult(HttpStatusCodes.CONFLICT);
    const enrollment = await db
      .select()
      .from(enrollmentWeeksTable)
      .innerJoin(weekTable, eq(enrollmentWeeksTable.weekId, weekTable.id))
      .where(
        and(
          eq(enrollmentWeeksTable.enrollmentId, enrollmentId),
          lte(weekTable.startDate, date),
          gte(weekTable.endDate, date)
        )
      )
      .limit(1);
    if (enrollment.length < 1)
      return createErrorResult(HttpStatusCodes.BAD_REQUEST);
    const [attendance] = await db
      .insert(attendanceTable)
      .values({
        enrollmentId,
        date,
        present,
        eatsInOratory,
        eatsPlain,
      })
      .$returningId();
    return createSuccessResult(attendance.id);
  } catch (e) {
    dbLogger.error(e);
    return createErrorResult(HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
}
