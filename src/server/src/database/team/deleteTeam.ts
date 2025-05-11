import { eq } from 'drizzle-orm';
import { db } from '..';
import { dbLogger } from '../logger';
import { createErrorResult, createSuccessResult } from '@/utils/createResult';
import { HttpStatusCodes } from '@/codes';
import { teamTable } from '../schema/team';

export async function deleteTeam(id: number) {
  try {
    const team = await db.query.teams.findFirst({
      where: eq(teamTable.id, id),
    });
    if (!team) return createErrorResult(HttpStatusCodes.NOT_FOUND);
    await db.delete(teamTable).where(eq(teamTable.id, id));
    return createSuccessResult(null);
  } catch (e) {
    dbLogger.error(e);
    return createErrorResult(HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
}
