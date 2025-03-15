import { HttpStatusCodes } from '@/codes';
import type { Class } from '@/models/class.model';
import type { SchoolType } from '@/models/schoolTypes.model';
import { createErrorResult, createSuccessResult } from '@/utils/createResult';
import { db } from '..';
import { eq } from 'drizzle-orm';
import {
  enrollmentTable,
  enrollmentWeeksTable,
  shirtSizeTable,
  teamTable,
} from '../schema';
import type { WeekEnrollment } from '@/models/week.model';
import { dbLogger } from '../logger';

export async function editEnrollment(
  enrollmentId: number,
  weeks: WeekEnrollment[],
  dataProcessingConsent: boolean,
  exitAuthorization: boolean,
  schoolType: SchoolType,
  className: Class,
  section: string,
  year: number,
  teamId?: number | null,
  shirtSizeId?: number | null,
  parentNotes?: string | null,
  managerNotes?: string | null
) {
  try {
    if (teamId) {
      const team = await db.query.teamTable.findFirst({
        where: eq(teamTable.id, teamId),
      });
      if (!team) return createErrorResult(HttpStatusCodes.BAD_REQUEST);
    }
    if (shirtSizeId) {
      const shirt = await db.query.shirtSizeTable.findFirst({
        where: eq(shirtSizeTable.id, shirtSizeId),
      });
      if (!shirt) return createErrorResult(HttpStatusCodes.BAD_REQUEST);
    }
    await db
      .update(enrollmentTable)
      .set({
        teamId,
        shirtSizeId,
        dataProcessingConsent,
        exitAuthorization,
        schoolType,
        className,
        section,
        year,
        parentNotes,
        managerNotes,
      })
      .where(eq(enrollmentTable.id, enrollmentId));
    await db
      .delete(enrollmentWeeksTable)
      .where(eq(enrollmentWeeksTable.enrollmentId, enrollmentId));
    for (const week of weeks) {
      await db.insert(enrollmentWeeksTable).values({
        enrollmentId,
        weekId: week.id,
        isPaid: week.isPaid,
      });
    }
    return createSuccessResult(null);
  } catch (e) {
    dbLogger.error(e);
    return createErrorResult(HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
}
