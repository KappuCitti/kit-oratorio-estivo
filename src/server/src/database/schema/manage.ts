import { mysqlTable, primaryKey, varchar } from 'drizzle-orm/mysql-core';

export const manageTable = mysqlTable(
  'manage',
  {
    mainId: varchar({ length: 36 }).notNull(),
    targetId: varchar({ length: 36 }).notNull(),
  },
  (table) => [primaryKey({ columns: [table.mainId, table.targetId] })]
);
