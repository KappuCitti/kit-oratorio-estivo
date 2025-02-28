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

export async function createEnrollment(
  childId: number,
  weeks: WeekEnrollment[],
  dataProcessingConsent: boolean,
  exitAuthorization: boolean,
  schoolType: SchoolType,
  className: Class,
  section: string,
  year: number,
  teamId?: number,
  shirtSizeId?: number,
  parentNotes?: string,
  managerNotes?: string
) {
  try {
    const child = await db.query.childTable.findFirst({
      where: eq(childTable.id, childId),
    });
    if (!child) return createErrorResult(HttpStatusCodes.BAD_REQUEST);
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
    const [enroll] = await db
      .insert(enrollmentTable)
      .values({
        childId,
        teamId,
        shirtSizeId,
        dataProcessingConsent,
        exitAuthorization,
        schoolType,
        class: className,
        section,
        year,
        dateOfEnrollment: new Date(),
        parentNotes,
        managerNotes,
      })
      .$returningId();
    if (!enroll)
      return createErrorResult(HttpStatusCodes.INTERNAL_SERVER_ERROR);
    const [weeksCount] = await db
      .select({ count: count() })
      .from(weekTable)
      .where(
        inArray(
          weekTable.id,
          weeks.map((w) => w.weekId)
        )
      );
    if (!weeksCount || weeksCount.count !== weeks.length)
      return createErrorResult(HttpStatusCodes.BAD_REQUEST);
    for (const week of weeks) {
      await db.insert(enrollmentWeeksTable).values({
        enrollmentId: enroll.id,
        weekId: week.weekId,
        isPaid: week.isPaid,
      });
    }
    return createSuccessResult(enroll.id);
  } catch (e) {
    console.error(e);
    return createErrorResult(HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
}
