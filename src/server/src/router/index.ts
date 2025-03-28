import { createRouter } from '@/utils/createApp';
import v1 from './v1';
import type { HonoApp } from '@/models/app.model';

export default () => {
  const v1Router = createRouter();
  v1(v1Router);
  const routers = {
    v1: v1Router,
  } as const;

  return routers;
};
