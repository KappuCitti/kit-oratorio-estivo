import { HttpStatusCodes } from '@/codes';
import { db } from '..';
import { eq } from 'drizzle-orm';
import { teamTable } from '../schema/team';
import { DatabaseError } from '@/errors/database';

export async function editTeam(id: number, name?: string, color?: string) {
  const exists = !!(await db.query.teams.findFirst({
    where: eq(teamTable.id, id),
  }));
  if (!exists)
    throw new DatabaseError(HttpStatusCodes.NOT_FOUND, 'team_not_found');
  if (name) {
    const conflict = !!(await db.query.teams.findFirst({
      where: eq(teamTable.name, name),
    }));
    if (conflict)
      throw new DatabaseError(HttpStatusCodes.CONFLICT, 'team_exists');
  }
  await db.update(teamTable).set({ name, color }).where(eq(teamTable.id, id));
}
