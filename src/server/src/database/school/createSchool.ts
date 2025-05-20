import { HttpStatusCodes } from '@/codes';
import { createErrorResult, createSuccessResult } from '@/utils/createResult';
import { dbLogger } from '../logger';
import { existsSchool } from './exists';
import { db } from '..';
import { schoolTable } from '../schema/school';

export async function createSchool(name: string, canChooseActivities: boolean) {
  try {
    const exists = await existsSchool(name);
    if (!exists.success) return exists;
    if (exists.data) return createErrorResult(HttpStatusCodes.CONFLICT);
    const [school] = await db
      .insert(schoolTable)
      .values({ name, canChooseActivities })
      .$returningId();
    return createSuccessResult(school.id);
  } catch (e) {
    dbLogger.error(e);
    return createErrorResult(HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
}
