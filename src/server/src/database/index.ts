import config from '@/config';
import type { Result } from '@/models/result.model';
import { createErrorResult, createSuccessResult } from '@/utils/createResult';
import { createPool, type Pool, type RowDataPacket } from 'mysql2/promise';

let pool: Pool | null = null;

export async function getConnection() {
  if (!pool) {
    try {
      pool = await createPool(config.database);
    } catch (e) {
      console.error(e);
      return createErrorResult("Can't connect to database");
    }
  }
  return createSuccessResult(pool);
}

export async function closeConnection() {
  if (pool) {
    try {
      await pool.end();
      return createSuccessResult(null);
    } catch (e) {
      console.error(e);
      return createErrorResult("Can't close database connection");
    } finally {
      pool = null;
    }
  }
  return createSuccessResult(null);
}

export async function startTransaction() {
  const conn = await getConnection();
  if (!conn.success) {
    return conn;
  }
  const { data: c } = conn;
  try {
    await c.beginTransaction();
  } catch (e) {
    console.error(e);
    await closeConnection();
    return createErrorResult('Error while starting transaction');
  }
  return createSuccessResult(c);
}

export async function commitTransaction() {
  const conn = await getConnection();
  if (!conn.success) {
    return conn;
  }
  const { data: c } = conn;
  try {
    await c.commit();
  } catch (e) {
    console.error(e);
    await closeConnection();
    return createErrorResult('Error while committing transaction');
  }
  return createSuccessResult(c);
}

export async function rollbackTransaction() {
  const conn = await getConnection();
  if (!conn.success) {
    return conn;
  }
  const { data: c } = conn;
  try {
    await c.rollback();
  } catch (e) {
    console.error(e);
    await closeConnection();
    return createErrorResult('Error while rolling back transaction');
  }
  return createSuccessResult(c);
}

export async function query<T>(
  query: TemplateStringsArray,
  ...params: any[]
): Promise<Result<T[]>> {
  const conn = await getConnection();
  if (!conn.success) {
    return conn;
  }
  const { data: c } = conn;
  try {
    const [rows] = await c.query<Array<T & RowDataPacket>>(
      query.join('?'),
      params
    );
    return createSuccessResult(rows);
  } catch (e) {
    console.error(e);
    await closeConnection();
    return createErrorResult('Error while querying database');
  }
}

export async function execute<T>(
  query: TemplateStringsArray,
  ...params: any[]
): Promise<Result<T[]>> {
  const conn = await getConnection();
  if (!conn.success) {
    return conn;
  }
  const { data: c } = conn;
  try {
    const [rows] = await c.execute<Array<T & RowDataPacket>>(
      query.join('?'),
      params
    );
    return createSuccessResult(rows);
  } catch (e) {
    console.error(e);
    await closeConnection();
    return createErrorResult('Error while executing database query');
  }
}

export async function composedQuery<T>(
  query: string,
  params: any[]
): Promise<Result<T[]>> {
  const conn = await getConnection();
  if (!conn.success) {
    return conn;
  }
  const { data: c } = conn;
  try {
    const [rows] = await c.query<Array<T & RowDataPacket>>(query, params);
    return createSuccessResult(rows);
  } catch (e) {
    console.error(e);
    await closeConnection();
    return createErrorResult('Error while querying database');
  }
}
