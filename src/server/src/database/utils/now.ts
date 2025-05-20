import { sql } from 'drizzle-orm';

export const now = () => sql<Date>`NOW()`;
