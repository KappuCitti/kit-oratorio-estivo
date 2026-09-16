import { editEnrollment } from '@/database/enrollment/editEnrollment';
import type { RouteController } from '@/models/app.model';
import type { EditEnrollmentRoute } from '@/openapi/enrollment/editEnrollment';
import { httpSuccessResponse } from '@/utils/responses';

const editEnrollmentController: RouteController<EditEnrollmentRoute> = async (
  c
) => {
  const { id } = await c.req.valid('param');
  const data = await c.req.valid('json');
  await editEnrollment(id, data);
  return httpSuccessResponse(c, null);
};

export default editEnrollmentController;
