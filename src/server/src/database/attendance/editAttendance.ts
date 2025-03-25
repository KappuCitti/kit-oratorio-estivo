import { HttpStatusCodes } from '@/codes';
import { createErrorResult, createSuccessResult } from '@/utils/createResult';
import { dbLogger } from '../logger';
import { enrollmentExistsInDate } from '../enrollment/enrollmentExistsInDate';
import { db } from '..';
import { and, eq, sql } from 'drizzle-orm';
import { attendanceTable, enrollmentTable } from '../schema';
import type { Attendance } from '@/models/attendance.model';

export async function editAttendance(
  id: number,
  enrollmentId?: number,
  date?: string,
  present?: boolean,
  eatsInOratory?: boolean,
  eatsPlain?: boolean
) {
  try {
    const updateMask: Omit<Partial<Attendance>, 'date'> & { date?: any } = {};
    const attendance = await db.query.attendanceTable.findFirst({
      where: eq(attendanceTable.id, id),
    });
    if (!attendance) return createErrorResult(HttpStatusCodes.NOT_FOUND);
    if (enrollmentId) {
      const validEnrollment = date
        ? await enrollmentExistsInDate(enrollmentId, date)
        : !!(await db.query.enrollmentTable.findFirst({
            where: eq(enrollmentTable.id, enrollmentId),
          }));
      if (!validEnrollment)
        return createErrorResult(HttpStatusCodes.BAD_REQUEST);
      const alreadyExists = await db
        .select()
        .from(attendanceTable)
        .where(
          and(
            eq(attendanceTable.enrollmentId, enrollmentId),
            eq(attendanceTable.date, date ? sql`${date}` : attendance.date)
          )
        )
        .limit(1);
      if (alreadyExists.length > 0)
        return createErrorResult(HttpStatusCodes.CONFLICT);
      if (alreadyExists.length > 0) updateMask.enrollmentId = enrollmentId;
      if (date) updateMask.date = sql`${date}`;
    } else if (date) {
      const validEnrollment = await enrollmentExistsInDate(
        attendance.enrollmentId,
        date
      );
      if (!validEnrollment)
        return createErrorResult(HttpStatusCodes.BAD_REQUEST);
      const alreadyExists = await db
        .select()
        .from(attendanceTable)
        .where(
          and(
            eq(attendanceTable.enrollmentId, attendance.enrollmentId),
            eq(attendanceTable.date, sql`${date}`)
          )
        )
        .limit(1);
      if (alreadyExists.length > 0)
        return createErrorResult(HttpStatusCodes.CONFLICT);
      updateMask.date = sql`${date}`;
    }
    if (present !== undefined) updateMask.present = present;
    if (eatsInOratory !== undefined) updateMask.eatsInOratory = eatsInOratory;
    if (eatsPlain !== undefined) updateMask.eatsPlain = eatsPlain;
    await db
      .update(attendanceTable)
      .set(updateMask)
      .where(eq(attendanceTable.id, id));
    return createSuccessResult(null);
  } catch (e) {
    dbLogger.error(e);
    return createErrorResult(HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
}
