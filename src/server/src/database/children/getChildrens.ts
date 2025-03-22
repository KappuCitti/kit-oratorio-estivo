import { and, count, eq, like, or } from 'drizzle-orm';
import { db } from '..';
import { childTable } from '../schema';
import { createErrorResult, createSuccessResult } from '@/utils/createResult';
import { HttpStatusCodes } from '@/codes';
import type { Gender } from '@/models/gender.model';
import { dbLogger } from '../logger';

export async function getChildrens(
  page: number,
  pageSize: number,
  query: string = '',
  gender?: Gender
) {
  try {
    const filters = query
      .split(' ')
      .filter((s) => s.trim().length > 0)
      .map((s) =>
        or(like(childTable.name, `%${s}%`), like(childTable.surname, `%${s}%`))
      );
    if (gender) filters.push(eq(childTable.gender, gender));
    const childsQuery = db
      .select({
        id: childTable.id,
        name: childTable.name,
        surname: childTable.surname,
        gender: childTable.gender,
        birthDate: childTable.birthDate,
      })
      .from(childTable)
      .where(and(...filters));
    const [rows] = await db
      .select({ count: count() })
      .from(childsQuery.as('c'))
      .execute();
    const childs = await childsQuery
      .limit(pageSize)
      .offset((page - 1) * pageSize)
      .execute();

    return createSuccessResult({ count: rows.count, childs });
  } catch (e) {
    dbLogger.error(e);
    return createErrorResult(HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
}
