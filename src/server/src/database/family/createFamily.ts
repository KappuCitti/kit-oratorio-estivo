import type { BodyFamily } from '@/models/family.model';
import { dbLogger } from '../logger';
import { createErrorResult, createSuccessResult } from '@/utils/createResult';
import { HttpStatusCodes } from '@/codes';
import { db } from '..';
import {
  childParentTable,
  childTable,
  enrollmentTable,
  enrollmentWeeksTable,
  parentTable,
} from '../schema';
import type { ChildTable } from '@/models/children.model';
import { createAddressIfNotExists } from '../address/createAddress';
import type { EnrollmentTable } from '@/models/enrollment.model';
import type { EnrollmentWeek } from '@/models/week.model';

export async function createFamily(family: BodyFamily) {
  try {
    const parents = (
      family.parents.length > 0
        ? await db.insert(parentTable).values(family.parents).$returningId()
        : []
    ).map(({ id }) => id);

    const childToInsert: Omit<ChildTable, 'id'>[] = [];
    const enrollments: Omit<EnrollmentTable, 'id'>[] = [];
    const enrollmentWeeks: Omit<EnrollmentWeek, 'id'>[] = [];
    for (let i = 0; i < family.childs.length; i++) {
      const child = family.childs[i];
      const addressId = await createAddressIfNotExists(child.address);
      if (!addressId.success) return addressId;
      childToInsert.push({
        name: child.name,
        surname: child.surname,
        birthPlace: child.birthPlace,
        birthDate: child.birthDate,
        gender: child.gender,
        addressId: addressId.data,
      });
      for (let j = 0; j < child.enrollments.length; j++) {
        const enrollment = child.enrollments[j];
        enrollments.push({
          childId: i,
          teamId: enrollment.team ?? null,
          shirtSizeId: enrollment.shirt ?? null,
          dateOfEnrollment: new Date(),
          year: enrollment.year,
          managerNotes: enrollment.managerNotes ?? null,
          parentNotes: enrollment.parentNotes ?? null,
          className: enrollment.className,
          section: enrollment.section,
          schoolType: enrollment.schoolType,
          dataProcessingConsent: enrollment.dataProcessingConsent,
          exitAuthorization: enrollment.exitAuthorization,
        });
        for (const week of enrollment.weeks) {
          enrollmentWeeks.push({
            enrollmentId: j,
            weekId: week.id,
            isPaid: week.isPaid,
          });
        }
      }
    }
    const childs = (
      family.childs.length > 0
        ? await db.insert(childTable).values(childToInsert).$returningId()
        : []
    ).map(({ id }) => id);

    const childParents: { childId: number; parentId: number }[] = [];
    for (const childId of childs) {
      for (const parentId of parents) {
        childParents.push({ childId, parentId });
      }
    }
    if (childParents.length > 0)
      await db.insert(childParentTable).values(childParents);

    let enrollmentIds: number[] = [];
    if (enrollments.length > 0) {
      enrollmentIds = (
        await db
          .insert(enrollmentTable)
          .values(
            enrollments.map((e) => ({
              ...e,
              childId: childs[e.childId],
            }))
          )
          .$returningId()
      ).map(({ id }) => id);

      if (enrollmentWeeks.length > 0) {
        await db.insert(enrollmentWeeksTable).values(
          enrollmentWeeks.map((w) => ({
            ...w,
            enrollmentId: enrollmentIds[w.enrollmentId],
          }))
        );
      }
    }
    return createSuccessResult({
      parents,
      childs,
      enrollments: enrollmentIds,
    });
  } catch (e) {
    dbLogger.error(e);
    return createErrorResult(HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
}
