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
  'be_selected',
  'manage_attendances',
  'manage_events',
  'manage_activities',
] as const;
export type Permission = (typeof PERMISSIONS)[number];
