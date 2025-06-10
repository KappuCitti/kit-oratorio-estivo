import { HttpStatusCodes } from '@/codes';
import { db } from '..';
import { and, eq } from 'drizzle-orm';
import { classTable } from '../schema/class';
import { isValidSchool } from '../school/isValid';
import { DatabaseError } from '@/errors/database';

export async function createClass(name: string, schoolId: number) {
  const schoolValid = await isValidSchool(schoolId);
  if (!schoolValid)
    throw new DatabaseError(HttpStatusCodes.BAD_REQUEST, 'school_not_found');

  const exists = await db.query.classes.findFirst({
    where: and(eq(classTable.name, name), eq(classTable.schoolId, schoolId)),
  });
  if (exists) throw new DatabaseError(HttpStatusCodes.CONFLICT, 'class_exists');
  const [classRes] = await db
    .insert(classTable)
    .values({ name, schoolId })
    .$returningId();
  return classRes.id;
}
