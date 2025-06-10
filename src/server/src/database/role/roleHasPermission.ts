import { createErrorResult, createSuccessResult } from '@/utils/createResult';
import { dbLogger } from '../logger';
import { HttpStatusCodes } from '@/codes';
import { db } from '..';
import { rolePermissionTable } from '../schema/rolePermission';
import { roleTable } from '../schema/role';
import { and, eq, inArray } from 'drizzle-orm';
import type { Permission } from '@/models/permissions.model';

export async function getRoleIdIfCan(role: string, permission: Permission) {
  const rolePermissions = await db
    .select({
      roleId: roleTable.id,
      permissions: rolePermissionTable.permission,
    })
    .from(rolePermissionTable)
    .innerJoin(roleTable, eq(rolePermissionTable.roleId, roleTable.id))
    .where(eq(roleTable.name, role));
  const permissions = rolePermissions.map((r) => r.permissions);

  return permissions.includes(permission) ? rolePermissions[0].roleId : null;
}

export async function rolesCan(roles: number[], permission: Permission) {
  roles = [...new Set(roles)];
  const rolePermissions = await db
    .select({
      roleId: rolePermissionTable.roleId,
    })
    .from(rolePermissionTable)
    .where(
      and(
        eq(rolePermissionTable.permission, permission),
        inArray(rolePermissionTable.roleId, roles)
      )
    );

  return rolePermissions.length === roles.length;
}
