import { count, eq } from 'drizzle-orm';
import { db } from '..';
import { classTable } from '../schema/class';
import { schoolTable } from '../schema/school';
import { enrollmentTable } from '../schema/enrollment';

export async function getUsersStats(year: number = new Date().getFullYear()) {
  const [users] = await db
    .select({ total: count() })
    .from(enrollmentTable)
    .where(eq(enrollmentTable.year, year));
  const classes = await db
    .select({
      id: classTable.id,
      name: classTable.name,
      total: count(),
      schoolId: classTable.schoolId,
    })
    .from(classTable)
    .innerJoin(enrollmentTable, eq(enrollmentTable.classId, classTable.id))
    .where(eq(enrollmentTable.year, year))
    .groupBy(classTable.id, classTable.name, classTable.schoolId);
  const schools = (
    await db
      .select({ id: schoolTable.id, name: schoolTable.name, total: count() })
      .from(schoolTable)
      .innerJoin(classTable, eq(classTable.schoolId, schoolTable.id))
      .innerJoin(enrollmentTable, eq(enrollmentTable.classId, classTable.id))
      .where(eq(enrollmentTable.year, year))
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
