import type { HonoRoute } from '@/models/route.model';
import main from '@/routes/main';
import login from '@/routes/auth/login';

export const routes: HonoRoute[] = [
  { path: '/', handler: main },
  { path: '/login', handler: login },
];
