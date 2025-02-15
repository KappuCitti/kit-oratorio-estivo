import type { HonoRoute } from './models/route.model';
import main from '@/routes/main';

export const routes: HonoRoute[] = [{ path: '/', handler: main }];
