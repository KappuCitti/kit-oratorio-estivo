import { createErrorResult, createSuccessResult } from '@/utils/createResult';
import { HttpStatusCodes } from '@/codes';
import { db } from '..';
import { eq } from 'drizzle-orm';
import { teamTable } from '../schema/team';
import { DatabaseError } from '@/errors/database';

export async function createTeam(name: string, color: string) {
  const rows = await db.query.teams.findFirst({
    where: eq(teamTable.name, name),
  });
  if (rows) throw new DatabaseError(HttpStatusCodes.CONFLICT, 'team_exists');

  const [team] = await db
    .insert(teamTable)
    .values({ name, color })
    .$returningId();
  return team.id;
}
