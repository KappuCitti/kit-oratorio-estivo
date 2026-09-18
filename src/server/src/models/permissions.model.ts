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

export const AREAS = ['user', 'admin'] as const;
export type Area = (typeof AREAS)[number];

/**
 * In quale area dell'applicazione vale ciascun permesso.
 *
 * Il ruolo di un utente e' uno solo, ma una persona puo' essere insieme
 * responsabile e genitore (o ragazzo iscritto). Il client non somma i due
 * insiemi: su /admin l'utente agisce da responsabile, su /user da genitore o
 * ragazzo, e in ciascuna area valgono solo i permessi di quell'area. Cosi' un
 * responsabile che iscrive il proprio figlio dall'area utente segue le stesse
 * regole di qualunque altro genitore.
 *
 * Il server continua ad autorizzare ogni rotta con il permesso che richiede:
 * questa mappa decide cosa l'interfaccia mostra e consente in ciascuna area.
 * Sta qui, e non nel client, perche' il client la riceve generata insieme alla
 * lista dei permessi (vedi scripts/generateClientPermissions.ts).
 */
export const PERMISSION_AREAS = {
  // Comuni: servono in entrambe le aree.
  login: ['user', 'admin'],
  see_classes: ['user', 'admin'],
  see_activities: ['user', 'admin'],
  see_personal_info: ['user', 'admin'],

  // Area utente: il genitore e il ragazzo.
  register: ['user'],
  be_enrolled: ['user'],
  be_managed: ['user'],
  be_selected: ['user'],
  manage_self_child_users: ['user'],
  register_child_users: ['user'],
  manage_personal_info: ['user'],

  // Area admin: i responsabili.
  give_exit_authorization: ['admin'],
  manage_activities: ['admin'],
  manage_attendances: ['admin'],
  manage_classes: ['admin'],
  manage_enrollments: ['admin'],
  manage_events: ['admin'],
  manage_roles: ['admin'],
  manage_teams: ['admin'],
  manage_users: ['admin'],
  manage_weeks: ['admin'],
  see_stats: ['admin'],
  see_users: ['admin'],
} as const satisfies Record<Permission, readonly Area[]>;

/** I permessi che esistono solo in un'area: sono quelli che la aprono. */
export function areaOnlyPermissions(area: Area): Permission[] {
  return PERMISSIONS.filter((p) => {
    const aree: readonly Area[] = PERMISSION_AREAS[p];
    return aree.length === 1 && aree[0] === area;
  });
}
