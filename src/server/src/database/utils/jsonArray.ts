import { SQL, sql, type GetColumnData } from 'drizzle-orm';
import type { MySqlColumn } from 'drizzle-orm/mysql-core';

export function jsonObjectArray<
  UserSchema extends Record<string, any>,
  TSchema extends Record<string, SQL | MySqlColumn>
>(schema: TSchema) {
  type JsonArrayResult = {
    [K in keyof TSchema]: TSchema[K] extends MySqlColumn
      ? GetColumnData<TSchema[K]>
      : K extends keyof UserSchema
      ? UserSchema[K]
      : unknown;
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

export function jsonArray<K, T extends MySqlColumn | SQL<K>>(schema: T) {
  type JsonArrayResult = T extends MySqlColumn ? GetColumnData<T> : K;
  return sql.join([
    sql`JSON_EXTRACT(COALESCE(JSON_ARRAYAGG(`,
    sql`${schema}`,
    sql`), '[]'), '$')`,
  ]) as SQL<JsonArrayResult[]>;
}
