import { HttpStatusCodes } from '@/codes';
import { dbLogger } from '@/database/logger';
import { createErrorResult, createSuccessResult } from '@/utils/createResult';
import { canUserManageFromToken } from '../user/managed/canUserManage';
import { canUserJoinActivity } from './canUserJoinActivity';
import { db } from '..';
import { activitySubscriptionTable } from '../schema/activitySubscriptions';
import { getEnrollmentFromWeek } from '../enrollment/getEnrollmentFromWeek';
import { hasPermission } from '../permissions/hasPermission';

export async function subscribeToActivity(
  token: string,
  userId: string,
  activityId: number,
  weekId: number
) {
  try {
    const canManage = await canUserManageFromToken(token, userId);
    if (!canManage.success) return canManage;
    if (!canManage.data) return createErrorResult(HttpStatusCodes.FORBIDDEN);

    const hasPerm = await hasPermission(userId, 'be_enrolled');
    if (!hasPerm.success) return hasPerm;
    if (!hasPerm.data) return createErrorResult(HttpStatusCodes.FORBIDDEN);

    const canSubscribe = await canUserJoinActivity(userId, activityId, weekId);
    if (!canSubscribe.success) return canSubscribe;
    if (!canSubscribe.data)
      return createErrorResult(HttpStatusCodes.BAD_REQUEST);

    const enrollment = await getEnrollmentFromWeek(userId, weekId);
    if (!enrollment.success) return enrollment;
    if (!enrollment.data) return createErrorResult(HttpStatusCodes.FORBIDDEN);

    await db.insert(activitySubscriptionTable).values({
      enrollmentId: enrollment.data.id,
      activityId,
      weekId,
    });

    return createSuccessResult(null);
  } catch (e) {
    dbLogger.error(e);
    return createErrorResult(HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
}
