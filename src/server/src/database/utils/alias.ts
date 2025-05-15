import type { ColumnType } from '@/models/common.model';
import { sql } from 'drizzle-orm';
import type { MySqlColumn } from 'drizzle-orm/mysql-core';

export function aliased<TCol extends MySqlColumn>(column: TCol, alias: string) {
  return sql<ColumnType<TCol>>`${column}`.as(alias);
}
