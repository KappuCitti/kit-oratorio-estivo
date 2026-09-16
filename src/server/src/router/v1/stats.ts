import usersStatsController from '@/controllers/stats/users';
import { usersStatsRouteDef } from '@/openapi/stats/users';
import { createRouter } from '@/utils/createRouter';

export default createRouter().openapi(
  usersStatsRouteDef,
  usersStatsController
);
