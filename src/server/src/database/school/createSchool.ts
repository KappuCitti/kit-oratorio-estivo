import { HttpStatusCodes } from '@/codes';
import { existsSchool } from './exists';
import { db } from '..';
import { schoolTable } from '../schema/school';
import { DatabaseError } from '@/errors/database';

export async function createSchool(name: string, canChooseActivities: boolean) {
  const exists = await existsSchool(name);
  if (exists)
    throw new DatabaseError(HttpStatusCodes.CONFLICT, 'school_exists');
  const [school] = await db
    .insert(schoolTable)
    .values({ name, canChooseActivities })
    .$returningId();
  return school.id;
}
