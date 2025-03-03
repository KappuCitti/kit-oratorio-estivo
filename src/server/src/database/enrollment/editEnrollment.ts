import { HttpStatusCodes } from '@/codes';
import type { Class } from '@/models/class.model';
import type { SchoolType } from '@/models/schoolTypes.model';
import { createErrorResult, createSuccessResult } from '@/utils/createResult';
import { db } from '..';
import { count, eq, inArray } from 'drizzle-orm';
import {
  childTable,
  enrollmentTable,
  enrollmentWeeksTable,
  shirtSizeTable,
  teamTable,
  weekTable,
} from '../schema';
import type { WeekEnrollment } from '@/models/week.model';

export async function editEnrollment(
  enrollmentId: number,
  weeks: WeekEnrollment[],
  dataProcessingConsent: boolean,
  exitAuthorization: boolean,
  schoolType: SchoolType,
  className: Class,
  section: string,
  year: number,
  teamId?: number,
  shirtSizeId?: number,
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
        class: className,
        section,
        year,
        parentNotes,
        managerNotes,
      })
      .where(eq(enrollmentTable.id, enrollmentId));
    await db
      .delete(enrollmentWeeksTable)
      .where(eq(enrollmentWeeksTable.enrollmentId, enrollmentId));
    await db.insert(enrollmentWeeksTable).values({
      enrollmentId,
      weekId: weeks[0].id,
      isPaid: weeks[0].isPaid,
    });
    return createSuccessResult(null);
  } catch (e) {
    console.error(e);
    return createErrorResult(HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
}
