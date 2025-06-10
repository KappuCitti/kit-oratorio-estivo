import { db } from '..';

export async function getTeamList() {
  const teams = await db.query.teams.findMany();
  return teams;
}
