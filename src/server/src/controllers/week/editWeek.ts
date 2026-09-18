import { editWeek } from '@/database/week/editWeek';
import type { RouteController } from '@/models/app.model';
import type { EditWeekRoute } from '@/openapi/week/editWeek';
import { httpSuccessResponse } from '@/utils/responses';

const editWeekController: RouteController<EditWeekRoute> = async (c) => {
  const { id } = c.req.valid('param');
  const changes = c.req.valid('json');
  await editWeek(id, changes);
  return httpSuccessResponse(c, null);
};

export default editWeekController;
