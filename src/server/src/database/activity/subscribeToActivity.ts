import { HttpStatusCodes } from '@/codes';
import { canUserManageFromToken } from '../user/managed/canUserManage';
import { canUserJoinActivity } from './canUserJoinActivity';
import { db } from '..';
import { activitySubscriptionTable } from '../schema/activitySubscriptions';
import { getEnrollmentFromWeek } from '../enrollment/getEnrollmentFromWeek';
import { hasPermission } from '../permissions/hasPermission';
import { DatabaseError } from '@/errors/database';

export async function subscribeToActivity(
  token: string,
  userId: string,
  activityId: number,
  weekId: number
) {
  const canManage = await canUserManageFromToken(token, userId);
  if (!canManage)
    throw new DatabaseError(HttpStatusCodes.FORBIDDEN, 'cant_manage');

  const hasPerm = await hasPermission(userId, 'be_enrolled');
  if (!hasPerm)
    throw new DatabaseError(HttpStatusCodes.FORBIDDEN, 'cant_enroll');

  const canSubscribe = await canUserJoinActivity(userId, activityId, weekId);
  if (!canSubscribe)
    throw new DatabaseError(HttpStatusCodes.FORBIDDEN, 'cant_join_activity');

  const enrollment = await getEnrollmentFromWeek(userId, weekId);
  if (!enrollment)
    throw new DatabaseError(HttpStatusCodes.NOT_FOUND, 'enrollment_not_found');

  await db.insert(activitySubscriptionTable).values({
    enrollmentId: enrollment.id,
    activityId,
    weekId,
  });
}
