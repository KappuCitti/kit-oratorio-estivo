import { SQL, sql } from 'drizzle-orm';
import type { MySqlColumn } from 'drizzle-orm/mysql-core';

export function jsonArray<T extends Record<string, MySqlColumn>>(schema: T) {
  type JsonArrayResult = {
    [K in keyof typeof schema]: (typeof schema)[K]['_']['notNull'] extends true
      ? (typeof schema)[K]['_']['hasDefault'] extends true
        ? (typeof schema)[K]['_']['data']
        : (typeof schema)[K]['_']['data'] | null | undefined
      : (typeof schema)[K]['_']['data'];
  };
  const jsonObjectParts: SQL[] = [sql`JSON_OBJECT(`];
  for (const key in Object.keys(schema)) {
    jsonObjectParts.push(sql`'${key}'`);
    jsonObjectParts.push(sql.raw(','));
    jsonObjectParts.push(sql`${schema[key]}`);
    jsonObjectParts.push(sql.raw(','));
  }
  jsonObjectParts.pop();
  jsonObjectParts.push(sql`)`);
  return sql.join([
    sql`JSON_EXTRACT(COALESCE(JSON_ARRAYAGG(`,
    sql.join(jsonObjectParts),
    sql`), '[]'), '$')`,
  ]) as SQL<JsonArrayResult>;
}
