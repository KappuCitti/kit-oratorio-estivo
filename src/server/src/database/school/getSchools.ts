import { db } from '..';
import { eq, like } from 'drizzle-orm';
import { schoolTable } from '../schema/school';
import { classTable } from '../schema/class';
import { jsonObjectArray } from '../utils/jsonArray';

export async function getSchools(query: string = '') {
  const schools = await db
    .select({
      id: schoolTable.id,
      name: schoolTable.name,
      canChooseActivities: schoolTable.canChooseActivities,
      classes: jsonObjectArray({
        id: classTable.id,
        name: classTable.name,
      }),
    })
    .from(schoolTable)
    .innerJoin(classTable, eq(schoolTable.id, classTable.schoolId))
    .groupBy(schoolTable.id, schoolTable.name, schoolTable.canChooseActivities)
    .having(like(schoolTable.name, `%${query}%`));
  return schools;
}
