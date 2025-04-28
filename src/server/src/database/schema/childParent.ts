import { int, mysqlTable, primaryKey } from 'drizzle-orm/mysql-core';
import { parentTable } from './parent';
import { childTable } from './child';

export const childParentTable = mysqlTable(
  'child_parents',
  {
    childId: int()
      .notNull()
      .references(() => childTable.id, { onDelete: 'cascade' }),
    parentId: int()
      .notNull()
      .references(() => parentTable.id, { onDelete: 'cascade' }),
  },
  (table) => [primaryKey({ columns: [table.childId, table.parentId] })]
);
