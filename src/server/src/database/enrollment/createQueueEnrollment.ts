import { createErrorResult, createSuccessResult } from '@/utils/createResult';
import { dbLogger } from '../logger';
import { HttpStatusCodes } from '@/codes';
import { canUserManageFromToken } from '../user/managed/canUserManage';
import { db } from '..';
import { enrollmentTable } from '../schema/enrollment';
import { and, eq, inArray } from 'drizzle-orm';
import { weekTable } from '../schema/week';
import { checkValidWeeks } from '../week/checkValidWeeks';
import { getWeeksYear } from '../week/getWeeksYear';
import { dateYear } from '../utils/year';
import { isValidSchool } from '../school/isValid';
import { isValidClass } from '../class/isValid';
import { enrollmentQueueTable } from '../schema/enrollmentQueue';
import { enrollmentQueueWeeksTable } from '../schema/enrollmentQueueWeek';
import { DatabaseError } from '@/errors/database';

export async function createEnrollment(
  token: string,
  userId: string,
  dataProcessingConsent: boolean,
  imageProcessingConsent: boolean,
  classId: number,
  weeks: number[],
  specialDiet: string | null = null,
  parentNotes: string | null = null,
  shirtId: number | null = null
) {
  const canManage = await canUserManageFromToken(token, userId);
  if (!canManage)
    throw new DatabaseError(HttpStatusCodes.FORBIDDEN, 'cant_manage');

  const validWeeks = await checkValidWeeks(weeks);
  if (!validWeeks)
    throw new DatabaseError(HttpStatusCodes.BAD_REQUEST, 'invalid_weeks');

  const alreadyExists = await db
    .select()
    .from(enrollmentTable)
    .where(
      and(
        eq(enrollmentTable.userId, userId),
        inArray(
          enrollmentTable.year,
          db
            .select({ year: dateYear(weekTable.startDate) })
            .from(weekTable)
            .where(inArray(weekTable.id, weeks))
            .as('weeks')
        )
      )
    );
  if (alreadyExists.length > 0)
    throw new DatabaseError(HttpStatusCodes.CONFLICT, 'user_already_enrolled');

  const validClass = await isValidClass(classId);
  if (!validClass)
    throw new DatabaseError(HttpStatusCodes.BAD_REQUEST, 'class_not_found');

  const year = await getWeeksYear(weeks);

  const enrollmentId = await db.transaction(async (tx) => {
    const [enrollment] = await tx
      .insert(enrollmentQueueTable)
      .values({
        userId,
        year,
        dataProcessingConsent,
        imageProcessingConsent,
        exitAuthorization: false,
        classId,
        dateOfEnrollment: new Date(),
        specialDiet,
        shirtSizeId: shirtId,
        parentNotes,
      })
      .$returningId();
    const weeksToInsert = weeks.map((week) => ({
      enrollmentId: enrollment.id,
      weekId: week,
    }));
    await tx.insert(enrollmentQueueWeeksTable).values(weeksToInsert);
    return enrollment.id;
  });
  return enrollmentId;
}
