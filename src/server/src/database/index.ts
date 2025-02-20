import config from '@/config';
import { drizzle } from 'drizzle-orm/mysql2';
import { createPool } from 'mysql2/promise';

import * as schema from './schema';

const client = createPool(config.database);

export const db = drizzle(client, { schema, mode: 'default' });
