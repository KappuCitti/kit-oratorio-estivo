import { db } from '..';
import { classTable } from '../schema/class';
import { eq } from 'drizzle-orm';
import { schoolTable } from '../schema/school';

export async function getClasses(schoolId?: number) {
  const classes = await db
    .select({
      id: classTable.id,
      name: classTable.name,
      school: {
        id: schoolTable.id,
        name: schoolTable.name,
        canChooseActivities: schoolTable.canChooseActivities,
      },
    })
    .from(classTable)
    .innerJoin(schoolTable, eq(classTable.schoolId, schoolTable.id))
    .where(schoolId ? eq(classTable.schoolId, schoolId) : undefined);
  return classes;
}
