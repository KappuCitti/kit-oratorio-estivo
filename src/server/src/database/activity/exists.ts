import { eq } from 'drizzle-orm';
import { db } from '..';
import { activityTable } from '../schema/activities';
import { createErrorResult, createSuccessResult } from '@/utils/createResult';
import { HttpStatusCodes } from '@/codes';
import { dbLogger } from '../logger';

export async function activityExists(name: string) {
  try {
    const exists = !!(await db.query.activities.findFirst({
      where: eq(activityTable.name, name),
    }));
    return createSuccessResult(exists);
  } catch (e) {
    dbLogger.error(e);
    return createErrorResult(HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
}
