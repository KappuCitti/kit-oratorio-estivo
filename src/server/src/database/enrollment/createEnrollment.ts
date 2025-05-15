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

export async function createEnrollment(
  token: string,
  userId: string,
  dataProcessingConsent: boolean,
  imageProcessingConsent: boolean,
  exitAuthorization: boolean,
  schoolId: number,
  classId: number,
  weeks: number[],
  specialDiet: string | null = null,
  parentNotes: string | null = null,
  shirtId: number | null = null
) {
  try {
    const canManage = await canUserManageFromToken(token, userId);
    if (!canManage.success) return canManage;
    if (!canManage.data) return createErrorResult(HttpStatusCodes.FORBIDDEN);

    const validWeeks = await checkValidWeeks(weeks);
    if (!validWeeks.success) return validWeeks;
    if (!validWeeks.data) return createErrorResult(HttpStatusCodes.BAD_REQUEST);

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
      return createErrorResult(HttpStatusCodes.CONFLICT);

    const validSchool = await isValidSchool(schoolId);
    if (!validSchool.success) return validSchool;
    if (!validSchool.data)
      return createErrorResult(HttpStatusCodes.BAD_REQUEST);

    const validClass = await isValidClass(classId);
    if (!validClass.success) return validClass;
    if (!validClass.data) return createErrorResult(HttpStatusCodes.BAD_REQUEST);

    const year = await getWeeksYear(weeks);
    if (!year.success) return year;
    let enrollmentId!: number;
    await db.transaction(async (tx) => {
      const [enrollment] = await tx
        .insert(enrollmentQueueTable)
        .values({
          userId,
          year: year.data,
          dataProcessingConsent,
          imageProcessingConsent,
          exitAuthorization,
          schoolId,
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
      enrollmentId = enrollment.id;
    });
    return createSuccessResult(enrollmentId);
  } catch (e) {
    dbLogger.error(e);
    return createErrorResult(HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
}
