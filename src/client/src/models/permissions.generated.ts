/**
 * FILE GENERATO - non modificarlo a mano.
 *
 * Prodotto da src/server/scripts/generateClientPermissions.ts leggendo il
 * server: la lista dei permessi viene da
 *   ../../../server/src/models/permissions.model.ts
 * e la mappa rotta -> permesso dai middleware `can()` dichiarati nelle
 * definizioni in src/server/src/openapi.
 *
 * Per rigenerarlo:      cd src/server && bun run sync:permissions
 * Per verificarlo:      cd src/server && bun run sync:permissions --check
 *
 * Il controllo gira dentro `bun run check` del server, quindi un permesso
 * aggiunto, rinominato o rimosso lato server fa fallire la verifica finche'
 * questo file non viene rigenerato.
 */

/** Tutti i permessi che il server conosce. */
export const PERMISSIONS = [
  'be_enrolled',
  'be_managed',
  'be_selected',
  'give_exit_authorization',
  'login',
  'manage_activities',
  'manage_attendances',
  'manage_classes',
  'manage_enrollments',
  'manage_events',
  'manage_personal_info',
  'manage_roles',
  'manage_self_child_users',
  'manage_teams',
  'manage_users',
  'manage_weeks',
  'register',
  'register_child_users',
  'see_activities',
  'see_classes',
  'see_personal_info',
  'see_stats',
  'see_users',
] as const;

export type Permission = (typeof PERMISSIONS)[number];

/**
 * Il permesso che il server richiede su ciascuna rotta protetta.
 *
 * Le rotte che chiedono solo una sessione valida (`isLogged`) e quelle
 * pubbliche non compaiono qui: non dipendono da un permesso.
 */
export const ROUTE_PERMISSIONS = {
  'GET /activities': 'see_activities',
  'POST /activities': 'manage_activities',
  'POST /activities/{id}/subscribe': 'manage_self_child_users',
  'POST /admin/enrollments': 'manage_enrollments',
  'POST /admin/family': 'manage_users',
  'GET /admin/people': 'see_users',
  'DELETE /admin/people/{id}': 'manage_users',
  'GET /admin/people/{id}': 'see_users',
  'PUT /admin/people/{id}': 'manage_users',
  'POST /admin/users': 'manage_users',
  'POST /admin/users/bulk': 'manage_users',
  'GET /attendances': 'manage_attendances',
  'POST /attendances': 'manage_attendances',
  'DELETE /attendances/{id}': 'manage_attendances',
  'PUT /attendances/{id}': 'manage_attendances',
  'GET /attendances/grouped': 'manage_attendances',
  'GET /classes': 'see_classes',
  'POST /classes': 'manage_classes',
  'GET /enrollments': 'see_users',
  'POST /enrollments': 'manage_enrollments',
  'DELETE /enrollments/{id}': 'manage_enrollments',
  'GET /enrollments/{id}': 'see_users',
  'PUT /enrollments/{id}': 'manage_enrollments',
  'GET /enrollments/queue': 'manage_enrollments',
  'POST /enrollments/queue': 'manage_self_child_users',
  'DELETE /enrollments/queue/{id}': 'manage_enrollments',
  'GET /roles': 'see_users',
  'GET /schools': 'see_classes',
  'POST /schools': 'manage_classes',
  'POST /shirts': 'manage_enrollments',
  'DELETE /shirts/{id}': 'manage_enrollments',
  'PUT /shirts/{id}': 'manage_enrollments',
  'GET /stats/users/{year}': 'see_stats',
  'POST /teams': 'manage_teams',
  'DELETE /teams/{id}': 'manage_teams',
  'PUT /teams/{id}': 'manage_teams',
  'GET /users': 'manage_self_child_users',
  'POST /users': 'register_child_users',
  'PUT /users/{id}/payments-visibility': 'manage_self_child_users',
  'GET /users/enrollments': 'manage_self_child_users',
  'GET /users/self/enrollments': 'be_enrolled',
  'POST /weeks': 'manage_weeks',
  'PUT /weeks/{id}': 'manage_weeks',
} as const satisfies Record<string, Permission>;

export type ProtectedRoute = keyof typeof ROUTE_PERMISSIONS;
