import { eq } from 'drizzle-orm';
import { db } from '..';
import { HttpStatusCodes } from '@/codes';
import { teamTable } from '../schema/team';
import { DatabaseError } from '@/errors/database';

export async function deleteTeam(id: number) {
  const team = await db.query.teams.findFirst({
    where: eq(teamTable.id, id),
  });
  if (!team)
    throw new DatabaseError(HttpStatusCodes.NOT_FOUND, 'team_not_found');
  await db.delete(teamTable).where(eq(teamTable.id, id));
}
