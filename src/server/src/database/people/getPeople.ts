import type { Gender } from '@/models/gender.model';
import { dbLogger } from '../logger';
import { createErrorResult, createSuccessResult } from '@/utils/createResult';
import { HttpStatusCodes } from '@/codes';
import { count, eq, like, or, sql } from 'drizzle-orm';
import { db } from '..';
import { union } from 'drizzle-orm/mysql-core';
import { childTable, parentTable } from '../schema';
import type { PeopleType } from '@/models/people.model';

export async function getPeople(
  page: number,
  pageSize: number,
  query: string = '',
  gender?: Gender
) {
  try {
    function createFilters(table: any) {
      const mappedSearch = query
        .split(' ')
        .filter((s) => s.trim().length > 0)
        .map((s) =>
          or(like(table.name, `%${s}%`), like(table.surname, `%${s}%`))
        );
      if (gender) mappedSearch.push(eq(table.gender, gender));
      return mappedSearch.length > 0 ? or(...mappedSearch) : undefined;
    }

    const parentsQuery = db
      .select({
        id: parentTable.id,
        name: parentTable.name,
        surname: parentTable.surname,
        gender: parentTable.gender,
        type: sql<PeopleType>`'Parent'`,
      })
      .from(parentTable)
      .where(createFilters(parentTable));
    const childsQuery = db
      .select({
        id: childTable.id,
        name: childTable.name,
        surname: childTable.surname,
        gender: childTable.gender,
        type: sql<PeopleType>`'Child'`,
      })
      .from(childTable)
      .where(createFilters(childTable));
    const [rows] = await db
      .select({
        count: count(),
      })
      .from(sql`(${parentsQuery} UNION ${childsQuery}) AS t`)
      .execute();
    const res = await union(parentsQuery, childsQuery)
      .orderBy(parentTable.surname, parentTable.name)
      .limit(pageSize)
      .offset((page - 1) * pageSize);
    return createSuccessResult({
      count: rows.count,
      people: res,
    });
  } catch (e) {
    dbLogger.error(e);
    return createErrorResult(HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
}
