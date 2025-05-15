import { HttpStatusCodes } from '@/codes';
import { createErrorResult, createSuccessResult } from '@/utils/createResult';
import { dbLogger } from '../logger';
import { db } from '..';
import { eq } from 'drizzle-orm';
import { schoolTable } from '../schema/school';

export async function isValidSchool(schoolId: number) {
  try {
    const exists = !!(await db.query.schools.findFirst({
      where: eq(schoolTable.id, schoolId),
    }));
    return createSuccessResult(exists);
  } catch (e) {
    dbLogger.error(e);
    return createErrorResult(HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
}
