import { getFullUserFromToken } from '@/database/user/getUser';
import { getWeeks } from '@/database/week/getWeeks';
import type { RouteController } from '@/models/app.model';
import type { Permission } from '@/models/permissions.model';
import type { GetWeekListRoute } from '@/openapi/week/getWeeks';
import { httpSuccessResponse } from '@/utils/responses';
import { getCookie } from 'hono/cookie';

/**
 * Chi vede i prezzi: i responsabili, i genitori (sempre), e il ragazzo solo se
 * chi lo gestisce ha scelto di mostrarglieli. Il filtro sta qui e non
 * nell'interfaccia: nascondere il prezzo solo a schermo lo lascerebbe
 * leggibile a chiunque apra la risposta della rotta.
 */
const PRICE_PERMISSIONS: Permission[] = [
  'manage_self_child_users',
  'see_users',
  'manage_weeks',
  'manage_enrollments',
];

const getWeeksController: RouteController<GetWeekListRoute> = async (c) => {
  const { year } = await c.req.valid('query');
  const token = getCookie(c, 'user_token') as string;
  const user = await getFullUserFromToken(token);
  const permissions = (user?.role.permissions ?? []) as Permission[];

  const seesPrices =
    !!user?.showPayments ||
    PRICE_PERMISSIONS.some((p) => permissions.includes(p));
  const seesCounts = permissions.includes('see_users');

  const weeks = await getWeeks(year);
  return httpSuccessResponse(
    c,
    weeks.map((week) => ({
      ...week,
      price: seesPrices ? week.price : null,
      enrolledCount: seesCounts ? week.enrolledCount : null,
    }))
  );
};

export default getWeeksController;
