import { deleteEnrollment } from '@/database/enrollment/deleteEnrollment';
import type { RouteController } from '@/models/app.model';
import type { DeleteEnrollmentRoute } from '@/openapi/enrollment/deleteEnrollment';
import { httpSuccessResponse } from '@/utils/responses';

const deleteEnrollmentController: RouteController<
  DeleteEnrollmentRoute
> = async (c) => {
  const { id } = await c.req.valid('param');
  await deleteEnrollment(id);
  return httpSuccessResponse(c, null);
};

export default deleteEnrollmentController;
