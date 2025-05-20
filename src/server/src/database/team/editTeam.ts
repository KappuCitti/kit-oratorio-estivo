import { createErrorResult, createSuccessResult } from '@/utils/createResult';
import { dbLogger } from '../logger';
import { HttpStatusCodes } from '@/codes';
import { db } from '..';
import { eq } from 'drizzle-orm';
import { teamTable } from '../schema/team';

export async function editTeam(id: number, name?: string, color?: string) {
  try {
    const exists = !!(await db.query.teams.findFirst({
      where: eq(teamTable.id, id),
    }));
    if (!exists) return createErrorResult(HttpStatusCodes.NOT_FOUND);
    if (name) {
      const conflict = !!(await db.query.teams.findFirst({
        where: eq(teamTable.name, name),
      }));
      if (conflict) return createErrorResult(HttpStatusCodes.CONFLICT);
    }
    await db.update(teamTable).set({ name, color }).where(eq(teamTable.id, id));
    return createSuccessResult(null);
  } catch (e) {
    dbLogger.error(e);
    return createErrorResult(HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
}
