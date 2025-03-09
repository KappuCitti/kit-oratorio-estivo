import { HttpStatusCodes } from '@/codes';
import { createErrorResult, createSuccessResult } from '@/utils/createResult';
import { db } from '..';
import { dbLogger } from '../logger';

export async function getTeamList() {
  try {
    const teams = await db.query.teamTable.findMany();
    return createSuccessResult(teams);
  } catch (e) {
    dbLogger.error(e);
    return createErrorResult(HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
}
