import { HttpStatusCodes } from '@/codes';
import { createErrorResult, createSuccessResult } from '@/utils/createResult';
import { dbLogger } from '../logger';
import { db } from '..';
import { and, eq } from 'drizzle-orm';
import { classTable } from '../schema/class';
import { isValidSchool } from '../school/isValid';

export async function createClass(name: string, schoolId: number) {
  try {
    const schoolValid = await isValidSchool(schoolId);
    if (!schoolValid.success) return schoolValid;
    if (!schoolValid.data)
      return createErrorResult(HttpStatusCodes.BAD_REQUEST);

    const exists = await db.query.classes.findFirst({
      where: and(eq(classTable.name, name), eq(classTable.schoolId, schoolId)),
    });
    if (exists) return createErrorResult(HttpStatusCodes.CONFLICT);
    const [classRes] = await db
      .insert(classTable)
      .values({ name, schoolId })
      .$returningId();
    return createSuccessResult(classRes.id);
  } catch (e) {
    dbLogger.error(e);
    return createErrorResult(HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
}
