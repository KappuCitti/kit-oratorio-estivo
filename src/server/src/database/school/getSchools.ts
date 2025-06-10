import { db } from '..';
import { like } from 'drizzle-orm';
import { schoolTable } from '../schema/school';

export async function getSchools(query: string = '') {
  const schools = await db.query.schools.findMany({
    where: like(schoolTable.name, `%${query}%`),
  });
  return schools;
}
