import { sql } from 'drizzle-orm';
import type { MySqlColumn } from 'drizzle-orm/mysql-core';

export const dateYear = (column: MySqlColumn) => sql<number>`YEAR(${column})`;
