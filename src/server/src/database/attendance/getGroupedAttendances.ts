import { count, eq } from 'drizzle-orm';
import { db } from '..';
import { classTable } from '../schema/class';
import { schoolTable } from '../schema/school';
import { enrollmentTable } from '../schema/enrollment';
import { attendanceTable } from '../schema/attendance';
import { strDate } from '../utils/date';

export async function getGroupedAttendances(date: string) {
  const [users] = await db
    .select({ total: count() })
    .from(attendanceTable)
    .where(eq(attendanceTable.date, strDate(date)));
  const classes = await db
    .select({
      id: classTable.id,
      name: classTable.name,
      total: count(),
      schoolId: classTable.schoolId,
    })
    .from(classTable)
    .leftJoin(enrollmentTable, eq(enrollmentTable.classId, classTable.id))
    .leftJoin(
      attendanceTable,
      eq(attendanceTable.enrollmentId, enrollmentTable.id)
    )
    .where(eq(attendanceTable.date, strDate(date)))
    .groupBy(classTable.id, classTable.name, classTable.schoolId);
  const schools = (
    await db
      .select({ id: schoolTable.id, name: schoolTable.name, total: count() })
      .from(schoolTable)
      .innerJoin(classTable, eq(classTable.schoolId, schoolTable.id))
      .leftJoin(enrollmentTable, eq(enrollmentTable.classId, classTable.id))
      .leftJoin(
        attendanceTable,
        eq(attendanceTable.enrollmentId, enrollmentTable.id)
      )
      .where(eq(attendanceTable.date, strDate(date)))
      .groupBy(schoolTable.id, schoolTable.name)
  ).map((s) => ({
    ...s,
    classes: classes
      .filter((c) => c.schoolId === s.id)
      .map((c) => ({ id: c.id, name: c.name, total: c.total })),
  }));

  return {
    total: users.total,
    schools,
  };
}
