import { HttpStatusCodes } from '@/codes';
import { db } from '@/database';
import { txCreateAddressIfNotExists } from '@/database/address/createAddress';
import { getUserRole } from '@/database/role/getUserRole';
import { rolesCan } from '@/database/role/roleHasPermission';
import { managesTable } from '@/database/schema/manages';
import { personalInfoTable } from '@/database/schema/personalInfo';
import { usersTable } from '@/database/schema/user';
import { DatabaseError } from '@/errors/database';
import type { AdminCreateUser } from '@/models/user.model';
import { hashPassword } from '@/utils/password';
import { inArray, or } from 'drizzle-orm';

export async function createUsers(users: AdminCreateUser[]) {
  const exists = await db
    .select()
    .from(usersTable)
    .where(
      or(
        inArray(
          usersTable.id,
          users
            .flatMap((user) => [user.cf, ...user.managers])
            .map((u) => (typeof u === 'string' ? u : u.cf))
        ),
        inArray(
          usersTable.email,
          users
            .flatMap((user) => [user.cf, ...user.managers])
            .filter((u) => typeof u !== 'string')
            .map((u) => u.email)
            .filter((mail) => mail !== undefined)
        )
      )
    );
  if (exists.length > 0)
    throw new DatabaseError(HttpStatusCodes.CONFLICT, 'user_exists');
  const canUsersBeManaged = await rolesCan(
    users.map((u) => u.role),
    'be_managed'
  );
  if (!canUsersBeManaged)
    throw new DatabaseError(
      HttpStatusCodes.FORBIDDEN,
      'admin_user_cant_manage'
    );
  const canUsersManage = await rolesCan(
    users.flatMap((u) =>
      u.managers.filter((m) => typeof m !== 'string').map((m) => m.role)
    ),
    'manage_self_child_users'
  );
  const managerIds = users.flatMap((u) =>
    u.managers.filter((m) => typeof m === 'string')
  );
  const managerRoles: number[] = [];
  for (const manager of managerIds) {
    const managerRole = await getUserRole(manager);
    if (!managerRole)
      throw new DatabaseError(
        HttpStatusCodes.FORBIDDEN,
        'admin_user_cant_manage'
      );
    managerRoles.push(managerRole);
  }
  const canExistingManagersManage = await rolesCan(
    managerRoles,
    'manage_self_child_users'
  );
  if (!canExistingManagersManage)
    throw new DatabaseError(
      HttpStatusCodes.FORBIDDEN,
      'admin_user_cant_manage'
    );
  if (!canUsersManage)
    throw new DatabaseError(
      HttpStatusCodes.FORBIDDEN,
      'admin_user_cant_manage'
    );
  await db.transaction(async (tx) => {
    const addresses = users
      .flatMap((u) => [
        u.address,
        ...u.managers
          .filter((m) => typeof m !== 'string')
          .map((m) => m.address),
      ])
      .map((a) => ({ id: 0, ...a }));
    for (const address of addresses) {
      const addressId = await txCreateAddressIfNotExists(tx, address);
      address.id = addressId;
    }

    const usersBody = await Promise.all(
      users
        .flatMap((u) => [u, ...u.managers])
        .filter((u) => typeof u !== 'string')
        .map(async (u) => ({
          id: u.cf,
          email: u.email,
          phone: u.phoneNumber,
          password: await hashPassword(u.password),
          roleId: u.role,
          theme: 'System' as const,
        }))
    );
    const userPersonalInfos = users
      .flatMap((u) => [u, ...u.managers])
      .filter((u) => typeof u !== 'string')
      .map((u) => ({
        id: u.cf,
        name: u.name,
        surname: u.surname,
        birthDate: u.birthDate,
        birthPlace: u.birthPlace,
        gender: u.gender,
        addressId: addresses.find(
          (a) =>
            a.street === u.address.street &&
            a.city === u.address.city &&
            a.postalCode === u.address.postalCode &&
            a.country === u.address.country
        )!.id,
      }));
    const manages: { mainId: string; targetId: string }[] = [];

    for (const user of users) {
      for (const manager of user.managers) {
        manages.push({
          mainId: user.cf,
          targetId: typeof manager === 'string' ? manager : manager.cf,
        });
      }
    }

    await tx.insert(usersTable).values(usersBody);
    await tx.insert(personalInfoTable).values(userPersonalInfos);
    await tx.insert(managesTable).values(manages);
  });
}
