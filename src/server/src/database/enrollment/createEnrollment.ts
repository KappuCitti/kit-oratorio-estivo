import { createErrorResult, createSuccessResult } from '@/utils/createResult';
import { dbLogger } from '../logger';
import { HttpStatusCodes } from '@/codes';
import { canUserManageFromToken } from '../user/managed/canUserManage';
import { db } from '..';
import { enrollmentTable } from '../schema/enrollment';
import { weekEnrollmentSchema, type WeekEnrollment } from '@/models/week.model';
import type { SchoolType } from '@/models/schoolTypes.model';
import type { Class } from '@/models/class.model';
import { enrollmentWeeksTable } from '../schema/enrollmentWeek';
import { and, eq, inArray, sql } from 'drizzle-orm';
import { weekTable } from '../schema/week';
import { checkValidWeeks } from '../week/checkValidWeeks';
import { getWeeksYear } from '../week/getWeeksYear';
import { dateYear } from '../utils/year';

export async function createEnrollment(
  token: string,
  userId: string,
  dataProcessingConsent: boolean,
  imageProcessingConsent: boolean,
  exitAuthorization: boolean,
  schoolType: SchoolType,
  className: Class,
  weeks: WeekEnrollment[],
  specialDiet: string | null = null,
  parentNotes: string | null = null,
  managerNotes: string | null = null,
  shirtId: number | null = null
) {
  try {
    const canManage = await canUserManageFromToken(token, userId);
    if (!canManage.success) return canManage;
    if (!canManage.data) return createErrorResult(HttpStatusCodes.FORBIDDEN);

    const validWeeks = await checkValidWeeks(weeks.map((w) => w.id));
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
              .where(
                inArray(
                  weekTable.id,
                  weeks.map((w) => w.id)
                )
              )
              .as('weeks')
          )
        )
      );
    if (alreadyExists.length > 0)
      return createErrorResult(HttpStatusCodes.CONFLICT);

    const year = await getWeeksYear(weeks.map((w) => w.id));
    if (!year.success) return year;
    let enrollmentId!: number;
    await db.transaction(async (tx) => {
      const [enrollment] = await tx
        .insert(enrollmentTable)
        .values({
          userId,
          year: year.data,
          dataProcessingConsent,
          imageProcessingConsent,
          exitAuthorization,
          schoolType,
          className,
          section: null,
          dateOfEnrollment: new Date(),
          specialDiet,
          shirtSizeId: shirtId,
          teamId: null,
          parentNotes,
          managerNotes,
        })
        .$returningId();
      const weeksToInsert = weeks.map((week) => ({
        enrollmentId: enrollment.id,
        weekId: week.id,
        isPaid: week.isPaid,
      }));
      await tx.insert(enrollmentWeeksTable).values(weeksToInsert);
      enrollmentId = enrollment.id;
    });
    return createSuccessResult(enrollmentId);
  } catch (e) {
    dbLogger.error(e);
    return createErrorResult(HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
}
