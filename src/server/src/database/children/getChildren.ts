import { createErrorResult, createSuccessResult } from '@/utils/createResult';
import { dbLogger } from '@/database/logger';
import { HttpStatusCodes } from '@/codes';
import { db } from '@/database';
import { eq } from 'drizzle-orm';
import {
  addressTable,
  childParentTable,
  childTable,
  enrollmentTable,
  parentTable,
} from '../schema';
import type { FullChildWithParents } from '@/models/children.model';
import { getBaseEnrollment } from '../enrollment/getEnrollment';

export async function getChildren(id: number) {
  try {
    const childResult = await db.query.childTable.findFirst({
      where: eq(childTable.id, id),
    });
    if (!childResult) return createErrorResult(HttpStatusCodes.NOT_FOUND);
    let child!: FullChildWithParents;
    const address = await db.query.addressTable.findFirst({
      where: eq(addressTable.id, childResult.addressId),
    });
    if (!address) {
      dbLogger.error(`Child ${id} has no address`);
      return createErrorResult(HttpStatusCodes.INTERNAL_SERVER_ERROR);
    }
    const enrollId = await db.query.enrollmentTable.findFirst({
      where: eq(enrollmentTable.childId, childResult.id),
      columns: {
        id: true,
      },
    });
    if (!enrollId) {
      dbLogger.error(`Child ${id} has no enrollment`);
      return createErrorResult(HttpStatusCodes.INTERNAL_SERVER_ERROR);
    }
    const enrollment = await getBaseEnrollment(enrollId.id);
    if (!enrollment.success) return enrollment;

    const parents = (
      await db
        .select()
        .from(parentTable)
        .innerJoin(
          childParentTable,
          eq(parentTable.id, childParentTable.parentId)
        )
        .where(eq(childParentTable.childId, childResult.id))
        .execute()
    ).map((p) => p.Parent);

    child = {
      id: childResult.id,
      name: childResult.name,
      surname: childResult.surname,
      gender: childResult.gender,
      birthDate: childResult.birthDate,
      birthPlace: childResult.birthPlace,
      address,
      enrollment: enrollment.data,
      parents,
    };

    return createSuccessResult(child);
  } catch (e) {
    dbLogger.error(e);
    return createErrorResult(HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
}
