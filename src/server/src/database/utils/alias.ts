import { SQL, type GetColumnData } from 'drizzle-orm';
import type { MySqlColumn } from 'drizzle-orm/mysql-core';

export function aliased<TCol extends MySqlColumn>(
  column: TCol,
  alias: string
): SQL.Aliased<GetColumnData<TCol>> {
  return column.getSQL().mapWith(column.mapFromDriverValue).as(alias);
}
