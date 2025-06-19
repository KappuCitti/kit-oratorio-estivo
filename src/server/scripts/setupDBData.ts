import { db } from '../src/database';
import { roleTable } from '../src/database/schema/role';
import { rolePermissionTable } from '../src/database/schema/rolePermission';
import { usersTable } from '../src/database/schema/user';
import { hashPassword } from '../src/utils/password';

import { PERMISSIONS, type Permission } from '../src/models/permissions.model';
import { teamTable } from '../src/database/schema/team';
import { shirtSizeTable } from '../src/database/schema/shirt';
import { schoolTable } from '../src/database/schema/school';
import { classTable } from '../src/database/schema/class';

const adminPermissions: Permission[] = PERMISSIONS.filter(
  (p) => p !== 'be_managed' && p !== 'register'
);

const parentPermissions: Permission[] = [
  'login',
  'register',
  'manage_self_child_users',
  'see_personal_info',
  'manage_personal_info',
  'register_child_users',
  'see_activities',
  'see_classes',
];

const childPermissions: Permission[] = [
  'login',
  'see_personal_info',
  'be_managed',
  'be_enrolled',
  'be_selected',
  'see_classes',
];

async function main() {
  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminCF = process.env.ADMIN_CF;
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminPassword || !adminCF || !adminEmail) {
    throw new Error(
      'Missing one or more environment variables: ADMIN_PASSWORD, ADMIN_CF, ADMIN_EMAIL'
    );
  }

  await db.transaction(async (tx) => {
    console.log('Adding roles...');
    const [adminId, parentId, childId] = await tx
      .insert(roleTable)
      .values([
        {
          name: 'admin',
          displayName: 'Amministratore',
        },
        {
          name: 'parent',
          displayName: 'Genitore',
        },
        {
          name: 'child',
          displayName: 'Figlio',
        },
      ])
      .$returningId();

    console.log('Setting up permissions...');
    const rolePermissions: { roleId: number; permission: Permission }[] = [];
    adminPermissions.forEach((p) => {
      rolePermissions.push({
        roleId: adminId.id,
        permission: p,
      });
    });
    parentPermissions.forEach((p) => {
      rolePermissions.push({
        roleId: parentId.id,
        permission: p,
      });
    });
    childPermissions.forEach((p) => {
      rolePermissions.push({
        roleId: childId.id,
        permission: p,
      });
    });
    await tx.insert(rolePermissionTable).values(rolePermissions);

    console.log('Creating admin user...');
    await tx.insert(usersTable).values({
      id: adminCF,
      roleId: adminId.id,
      email: adminEmail,
      password: await hashPassword(adminPassword),
      theme: 'System',
    });

    console.log('Creating teams...');
    await tx.insert(teamTable).values([
      {
        name: 'Rosso',
        color: '#dc3545',
      },
      {
        name: 'Giallo',
        color: '#ffc107',
      },
      {
        name: 'Blu',
        color: '#0d6efd',
      },
      {
        name: 'Verde',
        color: '#198754',
      },
    ]);

    console.log('Creating shirt sizes...');
    await tx.insert(shirtSizeTable).values([
      {
        sizeName: 'Small',
        width: '45.0',
        height: '65.0',
        isAvailable: true,
      },
      {
        sizeName: 'Medium',
        width: '50.0',
        height: '70.0',
        isAvailable: true,
      },
      {
        sizeName: 'Large',
        width: '55.0',
        height: '75.0',
        isAvailable: true,
      },
      {
        sizeName: 'Extra Large',
        width: '60.0',
        height: '80.0',
        isAvailable: false,
      },
    ]);

    console.log('Creating schools...');
    const [primaryId, secondaryId] = await tx
      .insert(schoolTable)
      .values([
        {
          name: 'Elementari',
          canChooseActivities: false,
        },
        {
          name: 'Medie',
          canChooseActivities: true,
        },
      ])
      .$returningId();

    console.log('Creating classes...');
    await tx.insert(classTable).values([
      {
        name: 'I',
        schoolId: primaryId.id,
      },
      {
        name: 'II',
        schoolId: primaryId.id,
      },
      {
        name: 'III',
        schoolId: primaryId.id,
      },
      {
        name: 'IV',
        schoolId: primaryId.id,
      },
      {
        name: 'V',
        schoolId: primaryId.id,
      },
      {
        name: 'I',
        schoolId: secondaryId.id,
      },
      {
        name: 'II',
        schoolId: secondaryId.id,
      },
      {
        name: 'III',
        schoolId: secondaryId.id,
      },
    ]);
  });
}

main()
  .then(() => {
    console.log('Setup complete');
  })
  .catch((e) => {
    console.error('Setup failed');
    console.error(e);
  });
