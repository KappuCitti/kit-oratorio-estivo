import { HttpStatusCodes } from '@/codes';
import { db } from '@/database';
import { txCreateAddressIfNotExists } from '@/database/address/createAddress';
import { dbLogger } from '@/database/logger';
import { getUserRole } from '@/database/role/getUserRole';
import { rolesCan } from '@/database/role/roleHasPermission';
import { managesTable } from '@/database/schema/manages';
import { personalInfoTable } from '@/database/schema/personalInfo';
import { usersTable } from '@/database/schema/user';
import type { AdminCreateUser } from '@/models/user.model';
import { createErrorResult, createSuccessResult } from '@/utils/createResult';
import { eq, inArray, or } from 'drizzle-orm';

export async function createUsers(users: AdminCreateUser[]) {
  try {
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
    if (exists.length > 0) return createErrorResult(HttpStatusCodes.CONFLICT);
    const canUsersBeManaged = await rolesCan(
      users.map((u) => u.role),
      'be_managed'
    );
    if (!canUsersBeManaged.success)
      return createErrorResult(HttpStatusCodes.INTERNAL_SERVER_ERROR);
    if (!canUsersBeManaged.data)
      return createErrorResult(HttpStatusCodes.FORBIDDEN);
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
      if (!managerRole.success)
        return createErrorResult(HttpStatusCodes.INTERNAL_SERVER_ERROR);
      if (!managerRole.data)
        return createErrorResult(HttpStatusCodes.FORBIDDEN);
      managerRoles.push(managerRole.data);
    }
    const canExistingManagersManage = await rolesCan(
      managerRoles,
      'manage_self_child_users'
    );
    if (!canExistingManagersManage.success)
      return createErrorResult(HttpStatusCodes.INTERNAL_SERVER_ERROR);
    if (!canExistingManagersManage.data)
      return createErrorResult(HttpStatusCodes.FORBIDDEN);
    if (!canUsersManage.success)
      return createErrorResult(HttpStatusCodes.INTERNAL_SERVER_ERROR);
    if (!canUsersManage.data)
      return createErrorResult(HttpStatusCodes.FORBIDDEN);
    return await db.transaction(async (tx) => {
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
        if (!addressId.success)
          return createErrorResult(HttpStatusCodes.INTERNAL_SERVER_ERROR);
        address.id = addressId.data;
      }

      const usersBody = users
        .flatMap((u) => [u, ...u.managers])
        .filter((u) => typeof u !== 'string')
        .map((u) => ({
          id: u.cf,
          email: u.email,
          phone: u.phoneNumber,
          password: u.password,
          roleId: u.role,
          theme: 'System' as const,
        }));
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

      return createSuccessResult(null);
    });
  } catch (e) {
    dbLogger.error(e);
    return createErrorResult(HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
}
