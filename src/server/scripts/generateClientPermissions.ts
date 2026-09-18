/**
 * Genera per il client la lista dei permessi e la mappa rotta -> permesso,
 * leggendole dal server.
 *
 * Il client deve decidere cosa mostrare esattamente come il server decide cosa
 * autorizzare. Se quelle informazioni venissero riscritte a mano nel client,
 * divergerebbero al primo permesso aggiunto o rinominato, e la divergenza non
 * darebbe nessun errore: semplicemente il client mostrerebbe pulsanti che il
 * server rifiuta, o nasconderebbe funzioni a cui l'utente ha diritto.
 *
 * Le definizioni delle rotte vengono importate davvero, non lette con una
 * espressione regolare: il permesso e' esposto come `.permission` sul
 * middleware creato da `can()` (vedi middlewares/hasPermission.ts).
 *
 *   bun run sync:permissions           rigenera il file
 *   bun run sync:permissions --check   fallisce se il file e' disallineato
 */
import { Glob } from 'bun';
import { dirname, join, relative, resolve } from 'node:path';
import {
  AREAS,
  PERMISSIONS,
  PERMISSION_AREAS,
  type Permission,
} from '../src/models/permissions.model';

const SERVER_ROOT = resolve(import.meta.dir, '..');
const OPENAPI_DIR = join(SERVER_ROOT, 'src', 'openapi');
const OUTPUT = resolve(
  SERVER_ROOT,
  '..',
  'client',
  'src',
  'models',
  'permissions.generated.ts'
);

interface RouteDef {
  method: string;
  path: string;
  middleware?: unknown;
}

function isRouteDef(value: unknown): value is RouteDef {
  return (
    !!value &&
    typeof value === 'object' &&
    typeof (value as RouteDef).method === 'string' &&
    typeof (value as RouteDef).path === 'string'
  );
}

/** Estrae il permesso da un middleware, che puo' essere singolo o una lista. */
function permissionOf(middleware: unknown): Permission | null {
  const list = Array.isArray(middleware) ? middleware : [middleware];
  for (const entry of list) {
    if (typeof entry === 'function' && 'permission' in entry) {
      return (entry as { permission: Permission }).permission;
    }
  }
  return null;
}

async function collectRoutes() {
  const routes: { method: string; path: string; permission: Permission }[] = [];
  const glob = new Glob('**/*.ts');

  for await (const file of glob.scan(OPENAPI_DIR)) {
    const module = await import(join(OPENAPI_DIR, file));
    for (const exported of Object.values(module)) {
      if (!isRouteDef(exported)) continue;
      const permission = permissionOf(exported.middleware);
      if (!permission) continue;
      routes.push({
        method: exported.method.toUpperCase(),
        path: exported.path,
        permission,
      });
    }
  }

  // Ordine stabile: senza, l'ordine di scansione del filesystem produrrebbe
  // diff casuali a ogni rigenerazione.
  routes.sort((a, b) =>
    a.path === b.path
      ? a.method.localeCompare(b.method)
      : a.path.localeCompare(b.path)
  );
  return routes;
}

function render(routes: Awaited<ReturnType<typeof collectRoutes>>) {
  const permissions = [...PERMISSIONS].sort();
  const relativeSource = relative(
    dirname(OUTPUT),
    join(SERVER_ROOT, 'src', 'models', 'permissions.model.ts')
  ).replace(/\\/g, '/');

  return `/**
 * FILE GENERATO - non modificarlo a mano.
 *
 * Prodotto da src/server/scripts/generateClientPermissions.ts leggendo il
 * server: la lista dei permessi viene da
 *   ${relativeSource}
 * e la mappa rotta -> permesso dai middleware \`can()\` dichiarati nelle
 * definizioni in src/server/src/openapi.
 *
 * Per rigenerarlo:      cd src/server && bun run sync:permissions
 * Per verificarlo:      cd src/server && bun run sync:permissions --check
 *
 * Il controllo gira dentro \`bun run check\` del server, quindi un permesso
 * aggiunto, rinominato o rimosso lato server fa fallire la verifica finche'
 * questo file non viene rigenerato.
 */

/** Tutti i permessi che il server conosce. */
export const PERMISSIONS = [
${permissions.map((p) => `  '${p}',`).join('\n')}
] as const;

export type Permission = (typeof PERMISSIONS)[number];

export const AREAS = [${AREAS.map((a) => `'${a}'`).join(', ')}] as const;

export type Area = (typeof AREAS)[number];

/**
 * In quale area vale ciascun permesso: su /user solo quelli dell'area utente,
 * su /admin solo quelli dell'area admin. Vedi PERMISSION_AREAS sul server.
 */
export const PERMISSION_AREAS = {
${permissions
  .map(
    (p) =>
      `  ${p}: [${(PERMISSION_AREAS[p] as readonly string[])
        .map((a) => `'${a}'`)
        .join(', ')}],`
  )
  .join('\n')}
} as const satisfies Record<Permission, readonly Area[]>;

/**
 * Il permesso che il server richiede su ciascuna rotta protetta.
 *
 * Le rotte che chiedono solo una sessione valida (\`isLogged\`) e quelle
 * pubbliche non compaiono qui: non dipendono da un permesso.
 */
export const ROUTE_PERMISSIONS = {
${routes.map((r) => `  '${r.method} ${r.path}': '${r.permission}',`).join('\n')}
} as const satisfies Record<string, Permission>;

export type ProtectedRoute = keyof typeof ROUTE_PERMISSIONS;
`;
}

const routes = await collectRoutes();
const content = render(routes);
const check = process.argv.includes('--check');

const current = (await Bun.file(OUTPUT).exists())
  ? await Bun.file(OUTPUT).text()
  : null;

if (check) {
  if (current === content) {
    console.log(
      `permessi allineati: ${PERMISSIONS.length} permessi, ${routes.length} rotte protette`
    );
    process.exit(0);
  }
  console.error(
    'I permessi del client sono disallineati rispetto al server.\n' +
      'Rigenerali con:  cd src/server && bun run sync:permissions'
  );
  process.exit(1);
}

if (current === content) {
  console.log('permessi allineati, niente da riscrivere');
  process.exit(0);
}

await Bun.write(OUTPUT, content);
console.log(
  `scritto ${relative(resolve(SERVER_ROOT, '..', '..'), OUTPUT).replace(
    /\\/g,
    '/'
  )}: ${PERMISSIONS.length} permessi, ${routes.length} rotte protette`
);
