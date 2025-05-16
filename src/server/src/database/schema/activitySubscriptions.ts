import { int, mysqlTable } from 'drizzle-orm/mysql-core';
import { activityTable } from './activities';
import { weekTable } from './week';
import { enrollmentTable } from './enrollment';

export const activitySubscriptionTable = mysqlTable('activity_subscriptions', {
  activityId: int()
    .notNull()
    .references(() => activityTable.id),
  weekId: int()
    .notNull()
    .references(() => weekTable.id),
  enrollmentId: int()
    .notNull()
    .references(() => enrollmentTable.id),
});
