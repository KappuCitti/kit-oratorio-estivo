import { and, eq, like, or } from 'drizzle-orm';
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
    const childs = await db.query.childTable.findMany({
      columns: {
        addressId: false,
        birthPlace: false,
      },
      where: filters.length > 0 ? and(...filters) : undefined,
      limit: pageSize,
      offset: (page - 1) * pageSize,
    });

    return createSuccessResult(childs);
  } catch (e) {
    dbLogger.error(e);
    return createErrorResult(HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
}
