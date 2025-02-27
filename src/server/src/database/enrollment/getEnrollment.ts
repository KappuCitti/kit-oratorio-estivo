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
import type { FullEnrollment } from '@/models/enrollment.model';
import { HttpStatusCodes } from '@/codes';

export async function getEnrollment(id: number) {
  try {
    const enrollment = await db.query.enrollmentTable.findFirst({
      where: eq(enrollmentTable.id, id),
    });
    if (!enrollment) return createSuccessResult(null);
    let finalEnrollment!: FullEnrollment;

    const baseChild = await db.query.childTable.findFirst({
      where: eq(childTable.id, enrollment.childId),
    });
    if (!baseChild) return createSuccessResult(null);

    const child: FullEnrollment['family']['child'] = {
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

    if (!child) return createSuccessResult(null);

    const parents = (
      await db
        .select()
        .from(parentTable)
        .innerJoin(
          childParentTable,
          eq(parentTable.id, childParentTable.parentId)
        )
        .where(eq(childParentTable.childId, enrollment.childId))
    ).map((p) => p.Parent);

    const shirt = enrollment.shirtSizeId
      ? await db.query.shirtSizeTable.findFirst({
          where: eq(shirtSizeTable.id, enrollment.shirtSizeId),
        })
      : null;
    if (shirt === undefined) return createSuccessResult(null);

    const team = enrollment.teamId
      ? await db.query.teamTable.findFirst({
          where: eq(teamTable.id, enrollment.teamId),
        })
      : null;
    if (team === undefined) return createSuccessResult(null);
    const weeks = await db
      .select({
        ...getTableColumns(weekTable),
        isPaid: enrollmentWeeksTable.isPaid,
      })
      .from(weekTable)
      .innerJoin(enrollmentWeeksTable, eq(enrollmentWeeksTable.weekId, weekTable.id))
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
      family: {
        child,
        parents,
      },
      shirt,
      team,
      weeks,
    };
    return createSuccessResult(finalEnrollment);
  } catch (e) {
    console.error(e);
    return createErrorResult(HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
}
