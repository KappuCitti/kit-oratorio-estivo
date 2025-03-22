import { and, count, eq, like, or } from 'drizzle-orm';
import { db } from '..';
import { createErrorResult, createSuccessResult } from '@/utils/createResult';
import { HttpStatusCodes } from '@/codes';
import type { Gender } from '@/models/gender.model';
import { childParentTable, parentTable } from '../schema';
import { dbLogger } from '../logger';

export async function getParents(
  page: number,
  pageSize: number,
  query: string = '',
  gender?: Gender,
  childId?: number
) {
  try {
    const filters = query
      .split(' ')
      .filter((s) => s.trim().length > 0)
      .map((s) =>
        or(
          like(parentTable.name, `%${s}%`),
          like(parentTable.surname, `%${s}%`)
        )
      );
    if (gender) filters.push(eq(parentTable.gender, gender));
    if (childId) filters.push(eq(childParentTable.childId, childId));
    const parentsQuery = db
      .select({
        id: parentTable.id,
        name: parentTable.name,
        surname: parentTable.surname,
        gender: parentTable.gender,
      })
      .from(parentTable)
      .innerJoin(
        childParentTable,
        eq(parentTable.id, childParentTable.parentId)
      )
      .where(and(...filters));
    const [rows] = await db
      .select({ count: count() })
      .from(parentsQuery.as('p'))
      .execute();
    const parents = await parentsQuery
      .limit(pageSize)
      .offset((page - 1) * pageSize)
      .execute();

    return createSuccessResult({ count: rows.count, parents });
  } catch (e) {
    dbLogger.error(e);
    return createErrorResult(HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
}
