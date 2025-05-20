import { sql } from 'drizzle-orm';

export const strDate = (date: string) => sql<Date>`${date}`;
