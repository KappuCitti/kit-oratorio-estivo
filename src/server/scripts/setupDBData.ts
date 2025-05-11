import { db } from '../src/database';
import { roleTable } from '../src/database/schema/role';
import { rolePermissionTable } from '../src/database/schema/rolePermission';
import { usersTable } from '../src/database/schema/user';
import { hashPassword } from '../src/utils/password';

import { PERMISSIONS, type Permission } from '../src/models/permissions.model';

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
];

const childPermissions: Permission[] = [
  'login',
  'see_personal_info',
  'be_managed',
  'be_enrolled',
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
    const [adminId, parentId, childId] = await tx
      .insert(roleTable)
      .values([
        {
          name: 'admin',
          description: 'Amministratore',
        },
        {
          name: 'parent',
          description: 'Genitore',
        },
        {
          name: 'child',
          description: 'Figlio',
        },
      ])
      .$returningId();
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

    await tx.insert(usersTable).values({
      id: adminCF,
      roleId: adminId.id,
      email: adminEmail,
      password: await hashPassword(adminPassword),
      theme: 'System',
    });
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
