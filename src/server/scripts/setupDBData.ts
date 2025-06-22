import { db, schema } from '../src/database';
import { roleTable } from '../src/database/schema/role';
import { rolePermissionTable } from '../src/database/schema/rolePermission';
import { personalInfoTable } from '../src/database/schema/personalInfo';
import { usersTable } from '../src/database/schema/user';
import { hashPassword } from '../src/utils/password';
import { z } from 'zod';

import { PERMISSIONS, type Permission } from '../src/models/permissions.model';
import { teamTable } from '../src/database/schema/team';
import { shirtSizeTable } from '../src/database/schema/shirt';
import { schoolTable } from '../src/database/schema/school';
import { classTable } from '../src/database/schema/class';
import { addressTable } from '../src/database/schema/address';

import * as prompts from '@clack/prompts';
import { sql } from 'drizzle-orm';

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
  const requiredAdminData = {
    cf: process.env.ADMIN_CF,
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
    name: process.env.ADMIN_NAME,
    surname: process.env.ADMIN_SURNAME,
  } as { [key: string]: string };

  const adminData = {
    phone: process.env.ADMIN_PHONE,
    gender: process.env.ADMIN_GENDER,
    birthDate: process.env.ADMIN_BIRTH_DATE,
    birthPlace: process.env.ADMIN_BIRTH_PLACE,
  };

  const adminAddressData = {
    street: process.env.ADMIN_ADDRESS_STREET,
    city: process.env.ADMIN_ADDRESS_CITY,
    zipCode: process.env.ADMIN_ADDRESS_ZIP_CODE,
    country: process.env.ADMIN_ADDRESS_COUNTRY,
  } as { [key: string]: string };

  prompts.intro();

  const eraseDB = await prompts.confirm({
    message: 'Do you want to erase the database?',
    initialValue: true,
  });

  if (eraseDB) {
    const s = prompts.spinner();
    s.start('Erasing database...');
    await db.transaction(async (tx) => {
      await tx.execute(sql`SET FOREIGN_KEY_CHECKS = 0`);
      for (const table of Object.values(schema)) {
        await tx.execute(sql`TRUNCATE TABLE ${table}`);
        await tx.execute(sql`ALTER TABLE ${table} AUTO_INCREMENT = 1`);
      }
      await tx.execute(sql`SET FOREIGN_KEY_CHECKS = 1`);
    });
    s.stop('Database erased');
  }

  for (const key in requiredAdminData) {
    if (!requiredAdminData[key]) {
      const value = await prompts.text({
        message: `Enter the ${key} of the admin user:`,
        validate: (value) => {
          if ((value.length > 0 && value.length < 2) || value.length > 255) {
            return `Invalid length: '${key}'`;
          }
          if (key === 'email') {
            const valid = z.string().email().safeParse(value);
            if (!valid.success) return 'Invalid email';
          }
          if (key === 'password' && value.length < 8) {
            return 'Password must be between 8 and 255 characters';
          }
          if (key === 'cf' && value.length !== 16) {
            return "Invalid length: 'CF'";
          }
        },
      });
      if (typeof value === 'string') requiredAdminData[key] = value;
    }
  }
  if (Object.values(requiredAdminData).every((v) => v === undefined)) {
    prompts.cancel('Required data not provided');
    process.exit(1);
  }

  for (const key in adminData) {
    if (!adminData[key]) {
      const value = await prompts.text({
        message: `Enter the ${key} of the admin user (optional):`,
        validate: (value) => {
          if (value.length === 0) return;
          if (key === 'gender' && value !== 'M' && value !== 'F') {
            return 'Invalid gender';
          }
          if (key !== 'gender' && (value.length < 2 || value.length > 255)) {
            return `Invalid length: '${key}'`;
          }
        },
        initialValue: undefined,
      });
      if (typeof value === 'string' || value === undefined)
        adminData[key] = value;
    }
  }

  const setupAddress = await prompts.confirm({
    message: 'Do you want to setup the address?',
    initialValue: true,
  });

  if (setupAddress) {
    for (const key in adminAddressData) {
      if (!adminAddressData[key]) {
        const value = await prompts.text({
          message: `Enter the ${key} of the admin user:`,
          validate: (value) => {
            if (value.length < 2 || value.length > 255) {
              return `Invalid length: '${key}'`;
            }
          },
        });
        if (typeof value === 'string') adminAddressData[key] = value;
      }
    }
    if (Object.values(adminAddressData).every((v) => v === undefined)) {
      prompts.cancel('Required data not provided');
      process.exit(1);
    }
  }

  console.log(requiredAdminData);
  console.log(adminData);
  console.log(adminAddressData);

  await db.transaction(async (tx) => {
    const spinner = prompts.spinner();
    spinner.start('Adding roles...');
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
    spinner.stop('Roles added');

    spinner.start('Setting up permissions...');
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
    spinner.stop('Permissions added');

    spinner.start('Creating admin user...');
    await tx.insert(usersTable).values({
      id: requiredAdminData.cf,
      roleId: adminId.id,
      email: requiredAdminData.email,
      password: await hashPassword(requiredAdminData.password),
      theme: 'System',
    });

    let addressId: number | undefined = undefined;
    if (setupAddress) {
      const [address] = await tx
        .insert(addressTable)
        .values({
          street: adminAddressData.street,
          city: adminAddressData.city,
          postalCode: adminAddressData.zipCode,
          country: adminAddressData.country,
        })
        .$returningId();
      addressId = address.id;
    }

    await tx.insert(personalInfoTable).values({
      id: requiredAdminData.cf,
      name: requiredAdminData.name,
      surname: requiredAdminData.surname,
      gender: adminData.gender as 'M' | 'F',
      birthDate: adminData.birthDate,
      birthPlace: adminData.birthPlace,
      addressId,
    });
    spinner.stop('Admin user created');

    spinner.start('Creating teams...');
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
    spinner.stop('Teams created');

    spinner.start('Creating shirt sizes...');
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
    spinner.stop('Shirt sizes created');

    spinner.start('Creating schools...');
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
    spinner.stop('Schools created');

    spinner.start('Creating classes...');
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
    spinner.stop('Setup complete');
  });

  prompts.outro('Finished setup');
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((e) => {
    console.error('Setup failed');
    console.error(e);
    process.exit(1);
  });
