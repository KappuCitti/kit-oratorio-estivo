import { HttpStatusCodes } from '@/codes';
import { createErrorResult, createSuccessResult } from '@/utils/createResult';
import { db } from '..';

export async function getTeamList() {
  try {
    const teams = await db.query.teamTable.findMany();
    return createSuccessResult(teams);
  } catch (e) {
    console.error(e);
    return createErrorResult(HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
}
