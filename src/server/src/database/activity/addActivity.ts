import type { ActivityWeek } from '@/models/activity.model';
import { dbLogger } from '../logger';
import { HttpStatusCodes } from '@/codes';
import { createErrorResult, createSuccessResult } from '@/utils/createResult';
import { activityExists } from './exists';
import { checkValidWeeks } from '../week/checkValidWeeks';
import { db } from '..';
import { activityTable } from '../schema/activities';
import { activityAppointmentTable } from '../schema/activityAppointments';
import { DatabaseError } from '@/errors/database';

export async function addActivity(
  name: string,
  weeks: ActivityWeek[],
  place: string | null = null
) {
  const isInvalid = await activityExists(name);
  if (isInvalid)
    throw new DatabaseError(HttpStatusCodes.CONFLICT, 'activity_exists');

  const validWeeks = await checkValidWeeks(weeks.map((w) => w.weekId));
  if (!validWeeks)
    throw new DatabaseError(HttpStatusCodes.BAD_REQUEST, 'invalid_weeks');

  return await db.transaction(async (tx) => {
    const [activity] = await tx
      .insert(activityTable)
      .values({
        name,
        place,
      })
      .$returningId();
    await tx
      .insert(activityAppointmentTable)
      .values(weeks.map((w) => ({ ...w, activityId: activity.id })));
    return activity.id;
  });
}
