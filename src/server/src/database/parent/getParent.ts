import { createErrorResult, createSuccessResult } from '@/utils/createResult';
import { dbLogger } from '../logger';
import { HttpStatusCodes } from '@/codes';
import { db } from '..';
import { eq } from 'drizzle-orm';
import {
  addressTable,
  childParentTable,
  childTable,
  parentTable,
} from '../schema';
import type { FullParentWithChildren } from '@/models/parent.model';

export async function getParent(id: number) {
  try {
    const parentResult = await db.query.parentTable.findFirst({
      where: eq(parentTable.id, id),
    });
    if (!parentResult) return createErrorResult(HttpStatusCodes.NOT_FOUND);
    let parent!: FullParentWithChildren;

    const childrensResult = await db
      .select()
      .from(childTable)
      .innerJoin(childParentTable, eq(childTable.id, childParentTable.childId))
      .where(eq(childParentTable.parentId, id))
      .execute();
    const childrens: FullParentWithChildren['childrens'] = [];
    for (const childResult of childrensResult) {
      const child = childResult.Child;
      const address = await db.query.addressTable.findFirst({
        where: eq(addressTable.id, child.addressId),
      });
      if (!address) {
        dbLogger.error(
          `Address ${child.addressId} (on child ${child.id}) not found`
        );
        return createErrorResult(HttpStatusCodes.INTERNAL_SERVER_ERROR);
      }
      childrens.push({
        id: child.id,
        name: child.name,
        surname: child.surname,
        birthDate: child.birthDate,
        gender: child.gender,
        birthPlace: child.birthPlace,
        address,
      });
    }
    parent = {
      ...parentResult,
      childrens,
    };

    return createSuccessResult(parent);
  } catch (e) {
    dbLogger.error(e);
    return createErrorResult(HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
}
