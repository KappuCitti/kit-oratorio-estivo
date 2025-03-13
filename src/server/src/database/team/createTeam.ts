import { createErrorResult, createSuccessResult } from '@/utils/createResult';
import { dbLogger } from '../logger';
import { HttpStatusCodes } from '@/codes';
import { db } from '..';
import { eq } from 'drizzle-orm';
import { teamTable } from '../schema';

export async function createTeam(name: string, color: string) {
  try {
    const rows = await db.query.teamTable.findFirst({
      where: eq(teamTable.name, name),
    });
    if (rows) {
      return createErrorResult(HttpStatusCodes.CONFLICT);
    }
    const [team] = await db
      .insert(teamTable)
      .values({ name, color })
      .$returningId();
    return createSuccessResult(team.id);
  } catch (e) {
    dbLogger.error(e);
    return createErrorResult(HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
}
