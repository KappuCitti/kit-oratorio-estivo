import { CLASSES } from '@/models/class.model';
import { SCHOOL_TYPES } from '@/models/schoolTypes.model';
import { THEMES } from '@/models/theme.model';
import {
  boolean,
  char,
  date,
  datetime,
  decimal,
  mysqlEnum,
  mysqlTable,
  primaryKey,
  int,
  text,
  varchar,
} from 'drizzle-orm/mysql-core';

export const usersTable = mysqlTable('User', {
  id: int('ID').primaryKey().autoincrement(),
  name: varchar('Name', { length: 100 }).notNull(),
  surname: varchar('Surname', { length: 100 }).notNull(),
  email: varchar('Email', { length: 255 }),
  theme: mysqlEnum('Theme', THEMES)
    .notNull()
    .default('System'),
  password: varchar('Password', { length: 255 }).notNull(),
});

export const roleTable = mysqlTable('Role', {
  id: int('ID').primaryKey().autoincrement(),
  name: varchar('Name', { length: 50 }).notNull().unique(),
  description: text('Description'),
});

export const permissionTable = mysqlTable('Permission', {
  id: int('ID').primaryKey().autoincrement(),
  name: varchar('Name', { length: 100 }).notNull().unique(),
  description: text('Description'),
});

export const rolePermissionTable = mysqlTable(
  'RolePermission',
  {
    roleId: int('RoleID')
      .notNull()
      .references(() => roleTable.id, { onDelete: 'cascade' }),
    permissionId: int('PermissionID')
      .notNull()
      .references(() => permissionTable.id, { onDelete: 'cascade' }),
  },
  (table) => [primaryKey({ columns: [table.roleId, table.permissionId] })]
);

export const userRoleTable = mysqlTable(
  'UserRole',
  {
    userId: int('UserID').references(() => usersTable.id, {
      onDelete: 'cascade',
    }),
    roleId: int('RoleID')
      .notNull()
      .references(() => roleTable.id, { onDelete: 'cascade' }),
  },
  (table) => [primaryKey({ columns: [table.userId, table.roleId] })]
);

export const sessionTable = mysqlTable('Session', {
  token: varchar('Token', { length: 36 })
    .primaryKey()
    .notNull()
    .$defaultFn(() => crypto.randomUUID()),
  expires: varchar('Expires', { length: 255 }).notNull(),
  userId: int('UserID')
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
});

export const addressTable = mysqlTable('Address', {
  id: int('ID').primaryKey().autoincrement(),
  street: varchar('Street', { length: 255 }).notNull(),
  city: varchar('City', { length: 255 }).notNull(),
  postalCode: varchar('PostalCode', { length: 20 }).notNull(),
  country: varchar('Country', { length: 100 }).notNull(),
});

export const parentTable = mysqlTable('Parent', {
  id: int('ID').primaryKey().autoincrement(),
  name: varchar('Name', { length: 255 }).notNull(),
  surname: varchar('Surname', { length: 255 }).notNull(),
  gender: mysqlEnum('Gender', ['M', 'F', 'Other']).notNull(),
  email: varchar('Email', { length: 255 }),
  phoneNumber: varchar('PhoneNumber', { length: 20 }).notNull(),
});

export const childTable = mysqlTable('Child', {
  id: int('ID').primaryKey().autoincrement(),
  name: varchar('Name', { length: 255 }).notNull(),
  surname: varchar('Surname', { length: 255 }).notNull(),
  gender: mysqlEnum('Gender', ['M', 'F', 'Other']).notNull(),
  birthDate: varchar('BirthDate', { length: 255 }).notNull(),
  birthPlace: varchar('BirthPlace', { length: 255 }).notNull(),
  addressId: int('AddressID')
    .notNull()
    .references(() => addressTable.id),
});

export const childParentTable = mysqlTable(
  'ChildParent',
  {
    childId: int('ChildID')
      .notNull()
      .references(() => childTable.id, { onDelete: 'cascade' }),
    parentId: int('ParentID')
      .notNull()
      .references(() => parentTable.id, { onDelete: 'cascade' }),
  },
  (table) => [primaryKey({ columns: [table.childId, table.parentId] })]
);

export const teamTable = mysqlTable('Team', {
  id: int('ID').primaryKey().autoincrement(),
  name: varchar('Name', { length: 40 }).notNull(),
  color: varchar('Color', { length: 7 }).notNull(),
});

export const shirtSizeTable = mysqlTable('ShirtSize', {
  id: int('ID').primaryKey().autoincrement(),
  sizeName: varchar('SizeName', { length: 50 }).notNull(),
  width: decimal('Width', { precision: 5, scale: 2 }).notNull(),
  height: decimal('Height', { precision: 5, scale: 2 }).notNull(),
  isAvailable: boolean('IsAvailable').notNull().default(true),
});

export const enrollmentTable = mysqlTable('Enrollment', {
  id: int('ID').primaryKey().autoincrement(),
  childId: int('ChildID')
    .notNull()
    .references(() => childTable.id, { onDelete: 'cascade' }),
  teamId: int('TeamID').references(() => teamTable.id, { onDelete: 'cascade' }),
  shirtSizeId: int('ShirtSizeID').references(() => shirtSizeTable.id, {
    onDelete: 'set null',
  }),
  dataProcessingConsent: boolean('DataProcessingConsent')
    .notNull()
    .default(true),
  exitAuthorization: boolean('ExitAuthorization').notNull(),
  schoolType: mysqlEnum('SchoolType', SCHOOL_TYPES).notNull(),
  class: mysqlEnum('Class', CLASSES).notNull(),
  section: char('Section').notNull(),
  year: int('Year').notNull(),
  dateOfEnrollment: datetime('DateOfEnrollment').notNull(),
  parentNotes: text('ParentNotes'),
  managerNotes: text('ManagerNotes'),
});

export const weekTable = mysqlTable('Week', {
  id: int('ID').primaryKey().autoincrement(),
  startDate: date('StartDate').notNull(),
  endDate: date('EndDate').notNull(),
  price: decimal('Price', { precision: 10, scale: 2 }).notNull(),
});

export const enrollmentWeeksTable = mysqlTable(
  'EnrollmentWeeks',
  {
    enrollmentId: int('EnrollmentID')
      .notNull()
      .references(() => enrollmentTable.id, { onDelete: 'cascade' }),
    weekId: int('WeekID')
      .notNull()
      .references(() => weekTable.id, { onDelete: 'cascade' }),
    isPaid: boolean('IsPaid').notNull().default(false),
  },
  (table) => [primaryKey({ columns: [table.enrollmentId, table.weekId] })]
);

export const attendanceTable = mysqlTable('Attendance', {
  id: int('ID').primaryKey().autoincrement(),
  enrollmentId: int('EnrollmentID')
    .notNull()
    .references(() => enrollmentTable.id),
  date: date('Date').notNull(),
  present: boolean('Present').notNull().default(false),
  eatsInOratory: boolean('EatsInOratory').notNull().default(false),
  eatsPlain: boolean('EatsPlain').notNull().default(false),
});

export const extraordinaryAttendanceTable = mysqlTable(
  'ExtraordinaryAttendance',
  {
    id: int('ID').primaryKey().autoincrement(),
    childId: int('ChildID')
      .notNull()
      .references(() => childTable.id),
    type: mysqlEnum('Type', ['Join', 'Left']).notNull(),
    time: datetime('Time').notNull(),
    notes: varchar('Notes', { length: 255 }).notNull().default(''),
  }
);

export const pointTable = mysqlTable('Point', {
  id: int('ID').primaryKey().autoincrement(),
  teamId: int('TeamID')
    .notNull()
    .references(() => teamTable.id, { onDelete: 'cascade' }),
  date: date('Date').notNull(),
  quantity: int('Quantity').notNull(),
  reason: varchar('Reason', { length: 255 }),
  userId: int('UserID').references(() => usersTable.id, {
    onDelete: 'set null',
  }),
});

export const userActionTable = mysqlTable('UserAction', {
  id: int('ID').primaryKey().autoincrement(),
  userId: int('UserID').references(() => usersTable.id, {
    onDelete: 'set null',
  }),
  description: varchar('Description', { length: 255 }).notNull(),
  type: mysqlEnum('Type', ['CREATE', 'UPDATE', 'DELETE']).notNull(),
  date: date('Date').notNull(),
});

export const tripTable = mysqlTable('Trip', {
  id: int('ID').primaryKey().autoincrement(),
  title: varchar('Title', { length: 255 }).notNull(),
  description: text('Description'),
  place: varchar('Place', { length: 255 }).notNull(),
  url: text('Url'),
  date: date('Date').notNull(),
  price: decimal('Price', { precision: 10, scale: 2 }).notNull().default('0'),
});

export const tripEnrollmentTable = mysqlTable(
  'TripEnrollment',
  {
    enrollmentId: int('EnrollmentID')
      .notNull()
      .references(() => enrollmentTable.id, {
        onDelete: 'cascade',
      }),
    tripId: int('TripID').references(() => tripTable.id, {
      onDelete: 'cascade',
    }),
    isPaid: boolean('IsPaid').notNull().default(false),
  },
  (table) => [primaryKey({ columns: [table.enrollmentId, table.tripId] })]
);
