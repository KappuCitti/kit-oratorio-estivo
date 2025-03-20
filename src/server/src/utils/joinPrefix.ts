import config from '@/config';

export function prefixJoin(path: string) {
  if (path.startsWith('/')) {
    if (config.server.routesPrefix.endsWith('/')) {
      return config.server.routesPrefix + path.slice(1);
    }
    return config.server.routesPrefix + path;
  } else {
    if (config.server.routesPrefix.endsWith('/')) {
      return config.server.routesPrefix + path;
    }
    return config.server.routesPrefix + '/' + path;
  }
}
