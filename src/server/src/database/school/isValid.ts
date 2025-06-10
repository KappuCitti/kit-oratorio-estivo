import { db } from '..';
import { eq } from 'drizzle-orm';
import { schoolTable } from '../schema/school';

export async function isValidSchool(schoolId: number) {
  const exists = !!(await db.query.schools.findFirst({
    where: eq(schoolTable.id, schoolId),
  }));
  return exists;
}
