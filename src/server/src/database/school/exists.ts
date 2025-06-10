import { db } from '..';
import { eq } from 'drizzle-orm';
import { schoolTable } from '../schema/school';

export async function existsSchool(name: string) {
  const exists = await db.query.schools.findFirst({
    where: eq(schoolTable.name, name),
  });
  return !!exists;
}
