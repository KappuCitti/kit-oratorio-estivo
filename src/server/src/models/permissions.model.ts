export const PERMISSIONS = [
  'be_enrolled',
  'be_managed',
  'be_selected',
  'login',
  'manage_activities',
  'manage_attendances',
  'manage_enrollments',
  'manage_events',
  'manage_personal_info',
  'manage_roles',
  'manage_self_child_users',
  'manage_users',
  'register',
  'register_child_users',
  'see_personal_info',
  'see_users',
] as const;
export type Permission = (typeof PERMISSIONS)[number];
