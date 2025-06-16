import { eq } from 'drizzle-orm';
import { db } from '..';
import { attendanceTable } from '../schema/attendance';
import { enrollmentTable } from '../schema/enrollment';
import { personalInfoTable } from '../schema/personalInfo';
import { aliased } from '../utils/alias';
import { strDate } from '../utils/date';

export async function getAttendanceList(date: string) {
  const attendances = await db
    .select({
      id: attendanceTable.id,
      eatsInOratory: attendanceTable.eatsInOratory,
      enrollmentId: attendanceTable.enrollmentId,
      user: {
        id: aliased(enrollmentTable.userId, 'userId'),
        name: personalInfoTable.name,
        surname: personalInfoTable.surname,
      },
    })
    .from(attendanceTable)
    .innerJoin(
      enrollmentTable,
      eq(attendanceTable.enrollmentId, enrollmentTable.id)
    )
    .innerJoin(
      personalInfoTable,
      eq(enrollmentTable.userId, personalInfoTable.id)
    )
    .where(eq(attendanceTable.date, strDate(date)));
  return attendances;
}
