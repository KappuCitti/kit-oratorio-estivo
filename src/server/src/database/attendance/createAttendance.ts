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
import { enrollmentExistsInDate } from '../enrollment/enrollmentExistsInDate';

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
    const validEnrollment = await enrollmentExistsInDate(enrollmentId, date);
    if (!validEnrollment) return createErrorResult(HttpStatusCodes.BAD_REQUEST);
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
