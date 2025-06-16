import { eq } from 'drizzle-orm';
import { db } from '..';
import { attendanceTable } from '../schema/attendance';

export async function getAttendance(id: number) {
  const attendance = await db.query.attendances.findFirst({
    where: eq(attendanceTable.id, id),
  });
  return attendance;
}
