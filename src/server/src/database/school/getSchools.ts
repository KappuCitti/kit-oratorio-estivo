import { HttpStatusCodes } from '@/codes';
import { createErrorResult, createSuccessResult } from '@/utils/createResult';
import { dbLogger } from '../logger';
import { db } from '..';
import { like } from 'drizzle-orm';
import { schoolTable } from '../schema/school';

export async function getSchools(query: string = '') {
  try {
    const schools = await db.query.schools.findMany({
      where: like(schoolTable.name, `%${query}%`),
    });
    return createSuccessResult(schools);
  } catch (e) {
    dbLogger.error(e);
    return createErrorResult(HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
}
