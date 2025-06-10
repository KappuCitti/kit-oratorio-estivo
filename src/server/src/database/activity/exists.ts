import { eq } from 'drizzle-orm';
import { db } from '..';
import { activityTable } from '../schema/activities';

export async function activityExists(name: string) {
  const exists = !!(await db.query.activities.findFirst({
    where: eq(activityTable.name, name),
  }));
  return exists;
}
