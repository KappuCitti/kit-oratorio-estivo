import config from '@/config';

export function prefixJoin(path: string) {
  if (path.startsWith('/')) {
    if (config.routesPrefix.endsWith('/')) {
      return config.routesPrefix + path.slice(1);
    }
    return config.routesPrefix + path;
  } else {
    if (config.routesPrefix.endsWith('/')) {
      return config.routesPrefix + path;
    }
    return config.routesPrefix + '/' + path;
  }
}
