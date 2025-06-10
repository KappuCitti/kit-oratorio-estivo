import { db } from '..';
import { eq } from 'drizzle-orm';
import { classTable } from '../schema/class';

export async function isValidClass(classId: number) {
  const exists = !!(await db.query.classes.findFirst({
    where: eq(classTable.id, classId),
  }));
  return exists;
}
