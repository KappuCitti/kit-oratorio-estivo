import { createErrorResult, createSuccessResult } from '@/utils/createResult';
import { dbLogger } from '../logger';
import { HttpStatusCodes } from '@/codes';
import { db } from '..';
import { activityTable } from '../schema/activities';
import { and, count, eq, like, or, SQL } from 'drizzle-orm';
import { activityClassesTable } from '../schema/activityClasses';

export async function getActivities(
  page: number,
  size: number,
  query: string = '',
  schoolId?: number,
  classId?: number
) {
  const filters: SQL[] = [
    or(
      like(activityTable.name, `%${query}%`),
      like(activityTable.place, `%${query}%`)
    ) as SQL,
  ];
  if (schoolId) filters.push(eq(activityClassesTable.schoolId, schoolId));
  if (classId) filters.push(eq(activityClassesTable.classId, classId));
  try {
    const activitiesQuery = db
      .selectDistinct({
        id: activityTable.id,
        name: activityTable.name,
        place: activityTable.place,
      })
      .from(activityTable)
      .leftJoin(
        activityClassesTable,
        eq(activityTable.id, activityClassesTable.activityId)
      )
      .where(and(...filters));

    const [activitiesCount] = await db
      .select({ count: count() })
      .from(activitiesQuery.as('activities'))
      .limit(1);

    const activities = await activitiesQuery
      .orderBy(activityTable.name)
      .limit(size)
      .offset((page - 1) * size);

    return createSuccessResult({
      elements: activities,
      count: activitiesCount.count,
    });
  } catch (e) {
    dbLogger.error(e);
    return createErrorResult(HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
}
