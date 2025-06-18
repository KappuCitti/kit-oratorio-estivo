import { SQL, sql, type GetColumnData } from 'drizzle-orm';
import type { MySqlColumn } from 'drizzle-orm/mysql-core';

export function jsonObjectArray<T extends Record<string, MySqlColumn>>(
  schema: T
) {
  type JsonArrayResult = {
    [K in keyof typeof schema]: GetColumnData<(typeof schema)[K]>;
  };
  const jsonObjectParts: SQL[] = [sql`JSON_OBJECT(`];
  for (const key in schema) {
    jsonObjectParts.push(sql`${key}`);
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
  ]) as SQL<JsonArrayResult[]>;
}

export function jsonArray<T extends MySqlColumn>(schema: T) {
  type JsonArrayResult = GetColumnData<T>;
  return sql.join([
    sql`JSON_EXTRACT(COALESCE(JSON_ARRAYAGG(`,
    sql`${schema}`,
    sql`), '[]'), '$')`,
  ]) as SQL<JsonArrayResult[]>;
}
