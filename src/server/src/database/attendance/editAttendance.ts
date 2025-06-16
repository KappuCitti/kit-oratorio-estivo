import { HttpStatusCodes } from '@/codes';
import { DatabaseError } from '@/errors/database';
import { eq } from 'drizzle-orm';
import { attendanceTable } from '../schema/attendance';
import { strDate } from '../utils/date';
import { db } from '..';
import { getAttendance } from './getAttendance';

export async function editAttendance(
  attendanceId: number,
  date?: string,
  eatsInOratory?: boolean
) {
  const attendance = await getAttendance(attendanceId);
  if (!attendance)
    throw new DatabaseError(HttpStatusCodes.NOT_FOUND, 'attendance_not_found');

  if (!date && !eatsInOratory)
    throw new DatabaseError(HttpStatusCodes.BAD_REQUEST, 'nothing_to_change');

  await db.transaction(async (tx) => {
    await tx
      .update(attendanceTable)
      .set({
        date: date ? strDate(date) : undefined,
        eatsInOratory,
      })
      .where(eq(attendanceTable.id, attendanceId));
  });
}
