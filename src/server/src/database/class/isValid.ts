import { HttpStatusCodes } from '@/codes';
import { createErrorResult, createSuccessResult } from '@/utils/createResult';
import { dbLogger } from '../logger';
import { db } from '..';
import { eq } from 'drizzle-orm';
import { classTable } from '../schema/class';

export async function isValidClass(classId: number) {
  try {
    const exists = !!(await db.query.classes.findFirst({
      where: eq(classTable.id, classId),
    }));
    return createSuccessResult(exists);
  } catch (e) {
    dbLogger.error(e);
    return createErrorResult(HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
}
