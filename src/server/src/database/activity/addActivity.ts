import type { ActivityWeek } from '@/models/activity.model';
import { dbLogger } from '../logger';
import { HttpStatusCodes } from '@/codes';
import { createErrorResult, createSuccessResult } from '@/utils/createResult';
import { activityExists } from './exists';
import { checkValidWeeks } from '../week/checkValidWeeks';
import { db } from '..';
import { activityTable } from '../schema/activities';
import { activityAppointmentTable } from '../schema/activityAppointments';

export async function addActivity(
  name: string,
  weeks: ActivityWeek[],
  place: string | null = null
) {
  try {
    const isInvalid = await activityExists(name);
    if (!isInvalid.success) return isInvalid;
    if (isInvalid.data) return createErrorResult(HttpStatusCodes.CONFLICT);

    const validWeeks = await checkValidWeeks(weeks.map((w) => w.weekId));
    if (!validWeeks.success) return validWeeks;
    if (!validWeeks.data) return createErrorResult(HttpStatusCodes.BAD_REQUEST);

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
      return createSuccessResult(activity.id);
    });
  } catch (e) {
    dbLogger.error(e);
    return createErrorResult(HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
}
