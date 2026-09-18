import { THEMES } from '@/models/theme.model';
import {
  boolean,
  int,
  mysqlEnum,
  mysqlTable,
  varchar,
} from 'drizzle-orm/mysql-core';
import { roleTable } from './role';

export const usersTable = mysqlTable('users', {
  id: varchar({ length: 16 }).primaryKey().notNull(),
  email: varchar({ length: 255 }),
  password: varchar({ length: 255 }).notNull(),
  theme: mysqlEnum(THEMES).notNull().default('System'),
  phone: varchar({ length: 15 }),
  roleId: int()
    .notNull()
    .references(() => roleTable.id),
  /**
   * Se il ragazzo, quando accede con il proprio account, vede i prezzi e lo
   * stato dei pagamenti delle sue settimane. Lo decide chi lo gestisce; i
   * genitori li vedono sempre. Spento di default: e' un'informazione che il
   * genitore sceglie di condividere, non che deve ricordarsi di nascondere.
   */
  showPayments: boolean().notNull().default(false),
});
