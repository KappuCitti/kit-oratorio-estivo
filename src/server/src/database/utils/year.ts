import { sql } from 'drizzle-orm';
import type { MySqlColumn } from 'drizzle-orm/mysql-core';

export function dateYear<TCol extends MySqlColumn>(column: TCol) {
  return sql<number>`YEAR(${column})`;
}
