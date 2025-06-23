import { getUsersStats } from '@/database/stats/getUsersStats';
import type { RouteController } from '@/models/app.model';
import type { UsersStatsRoute } from '@/openapi/stats/users';
import { httpSuccessResponse } from '@/utils/responses';

const usersStatsController: RouteController<UsersStatsRoute> = async (c) => {
  const { year } = c.req.valid('param');
  const usersStats = await getUsersStats(year);
  return httpSuccessResponse(c, usersStats);
};

export default usersStatsController;
