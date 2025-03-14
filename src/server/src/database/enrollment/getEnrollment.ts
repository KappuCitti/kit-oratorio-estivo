import { createErrorResult, createSuccessResult } from '@/utils/createResult';
import { db } from '@/database';
import { eq, getTableColumns } from 'drizzle-orm';
import {
  addressTable,
  childParentTable,
  childTable,
  enrollmentTable,
  enrollmentWeeksTable,
  parentTable,
  shirtSizeTable,
  teamTable,
  weekTable,
} from '../schema';
import type {
  FullEnrollment,
  FullEnrollmentWithFamily,
} from '@/models/enrollment.model';
import { HttpStatusCodes } from '@/codes';
import { dbLogger } from '../logger';

export async function getBaseEnrollment(id: number) {
  try {
    const enrollment = await db.query.enrollmentTable.findFirst({
      where: eq(enrollmentTable.id, id),
    });
    if (!enrollment) return createErrorResult(HttpStatusCodes.NOT_FOUND);
    let finalEnrollment!: FullEnrollment;
    const shirt = enrollment.shirtSizeId
      ? await db.query.shirtSizeTable.findFirst({
          where: eq(shirtSizeTable.id, enrollment.shirtSizeId),
        })
      : null;
    if (shirt === undefined) {
      dbLogger.error(`Enrollment ${id} has an invalid shirt size id`);
      return createErrorResult(HttpStatusCodes.INTERNAL_SERVER_ERROR);
    }

    const team = enrollment.teamId
      ? await db.query.teamTable.findFirst({
          where: eq(teamTable.id, enrollment.teamId),
        })
      : null;
    if (team === undefined) {
      dbLogger.error(`Enrollment ${id} has an invalid team id`);
      return createErrorResult(HttpStatusCodes.INTERNAL_SERVER_ERROR);
    }
    const weeks = await db
      .select({
        ...getTableColumns(weekTable),
        isPaid: enrollmentWeeksTable.isPaid,
      })
      .from(weekTable)
      .innerJoin(
        enrollmentWeeksTable,
        eq(enrollmentWeeksTable.weekId, weekTable.id)
      )
      .where(eq(enrollmentWeeksTable.enrollmentId, enrollment.id));

    finalEnrollment = {
      id: enrollment.id,
      class: enrollment.class,
      section: enrollment.section,
      dataProcessingConsent: enrollment.dataProcessingConsent,
      exitAuthorization: enrollment.exitAuthorization,
      schoolType: enrollment.schoolType,
      managerNotes: enrollment.managerNotes,
      parentNotes: enrollment.parentNotes,
      year: enrollment.year,
      dateOfEnrollment: enrollment.dateOfEnrollment,
      shirt,
      team,
      weeks,
    };
    return createSuccessResult(finalEnrollment);
  } catch (e) {
    dbLogger.error(e);
    return createErrorResult(HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
}

export async function getEnrollment(id: number) {
  try {
    const baseEnrollment = await getBaseEnrollment(id);
    if (!baseEnrollment.success) return baseEnrollment;
    const enrollment = baseEnrollment.data;
    const childIdQuery = await db.query.enrollmentTable.findFirst({
      where: eq(enrollmentTable.id, enrollment.id),
      columns: {
        childId: true,
      },
    });
    if (!childIdQuery) {
      dbLogger.error(`Enrollment ${id} has an invalid child id`);
      return createErrorResult(HttpStatusCodes.INTERNAL_SERVER_ERROR);
    }

    let finalEnrollment!: FullEnrollmentWithFamily;

    const baseChild = await db.query.childTable.findFirst({
      where: eq(childTable.id, childIdQuery.childId),
    });
    if (!baseChild) {
      dbLogger.error(`Enrollment ${id} has an invalid child id`);
      return createErrorResult(HttpStatusCodes.INTERNAL_SERVER_ERROR);
    }

    const child: FullEnrollmentWithFamily['family']['child'] = {
      id: baseChild.id,
      name: baseChild.name,
      surname: baseChild.surname,
      gender: baseChild.gender,
      birthDate: baseChild.birthDate,
      birthPlace: baseChild.birthPlace,
      address: (
        await db.query.addressTable.findMany({
          where: eq(addressTable.id, baseChild.addressId),
          columns: {
            id: false,
          },
        })
      )[0],
    };

    const parents = (
      await db
        .select()
        .from(parentTable)
        .innerJoin(
          childParentTable,
          eq(parentTable.id, childParentTable.parentId)
        )
        .where(eq(childParentTable.childId, childIdQuery.childId))
    ).map((p) => p.Parent);

    finalEnrollment = {
      ...enrollment,
      family: {
        child,
        parents,
      },
    };
    return createSuccessResult(finalEnrollment);
  } catch (e) {
    dbLogger.error(e);
    return createErrorResult(HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
}
