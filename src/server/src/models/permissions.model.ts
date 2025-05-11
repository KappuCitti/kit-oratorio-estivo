export const PERMISSIONS = [
  'register',
  'login',
  'manage_self_child_users',
  'be_managed',
  'see_users',
  'manage_users',
  'manage_roles',
  'see_personal_info',
  'manage_personal_info',
  'be_enrolled',
  'register_child_users',
] as const;
export type Permission = (typeof PERMISSIONS)[number];
