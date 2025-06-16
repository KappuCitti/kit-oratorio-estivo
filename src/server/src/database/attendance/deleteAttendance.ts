import { DatabaseError } from '@/errors/database';
import { getAttendance } from './getAttendance';
import { HttpStatusCodes } from '@/codes';
import { db } from '..';
import { attendanceTable } from '../schema/attendance';
import { eq } from 'drizzle-orm';

export async function deleteAttendance(id: number) {
  const attendance = await getAttendance(id);
  if (!attendance)
    throw new DatabaseError(HttpStatusCodes.NOT_FOUND, 'attendance_not_found');
  await db.delete(attendanceTable).where(eq(attendanceTable.id, id));
}
